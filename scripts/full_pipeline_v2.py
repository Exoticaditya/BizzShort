"""
BizzShort Full Pipeline v2: Fetch → Transcribe → Categorize → Save
====================================================================
FIXES from v1:
 - Uses Shorts URL format for downloading audio (fixes download failures)
 - Properly handles Hindi/multilingual transcription
 - Generates proper article content from transcriptions
 - Adds Instagram reel support
 - Distribution: 6 breaking news, 6 client features, 16 latest updates (+ 2 Instagram)
"""

import os
import sys
import json
import tempfile
import re
from datetime import datetime
from pathlib import Path

# Set ffmpeg path from imageio-ffmpeg
FFMPEG_PATH = None
try:
    import imageio_ffmpeg
    FFMPEG_PATH = imageio_ffmpeg.get_ffmpeg_exe()
    ffmpeg_dir = os.path.dirname(FFMPEG_PATH)
    os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")
    print(f"✅ FFmpeg found: {FFMPEG_PATH}")
except ImportError:
    print("⚠️  imageio-ffmpeg not installed, hoping ffmpeg is in PATH")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

import yt_dlp
import whisper
from pymongo import MongoClient

# ============================================================
# CONFIGURATION
# ============================================================
CHANNEL_URL = "https://www.youtube.com/@Bizz_Short/shorts"
NUM_VIDEOS = 30
WHISPER_MODEL = "base"

# Known Instagram reel IDs from @bizz_short
INSTAGRAM_REELS = [
    {'reelId': 'DSRfWfMjQy_', 'title': 'Industry Expert - Market Insights & Analysis'},
    {'reelId': 'DTHxue9lEFt', 'title': 'Business Leader - Strategic Growth Interview'},
]

# Client detection keywords
CLIENT_KEYWORDS = [
    'akona', 'tofu', 'garvik', 'client', 'brand story', 'sponsor',
    'partner', 'featured company', 'company profile', 'startup feature',
    'business spotlight', 'corporate feature', 'introducing',
    'in industries where', 'our product', 'our company', 'we provide',
    'our mission', 'our vision', 'we are a', 'we offer',
    'safety, strength', 'precision matter', 'right equipment',
]

# BizzShort news indicators
NEWS_HASHTAGS = ['#bizzshort', '#news', '#breaking', '#update', '#market']

# Category keywords
CATEGORY_MAP = {
    'economy': ['gdp', 'economy', 'inflation', 'growth', 'fiscal', 'economic',
                'production', 'exports', 'import', 'trade', 'rupee', 'forex',
                'rbi', 'reserve bank', 'monetary', 'gst', 'tax', 'budget',
                'agriculture', 'sugar', 'coffee', 'wheat', 'oil price',
                'hydrogen', 'green hydrogen', 'ev sales', 'electric vehicle',
                'solar', 'renewable', 'railway', 'train', 'vande bharat',
                'infrastructure', 'satellite', 'isro'],
    'markets': ['stock', 'market', 'nifty', 'sensex', 'share', 'trading',
                'investor', 'mutual fund', 'fii', 'fpi', 'gold', 'silver',
                'commodity', 'hdfc', 'banking', 'earnings', 'quarter',
                'precious metal', 'market movement', 'monthly decline'],
    'technology': ['ai', 'tech', 'digital', 'software', 'data', 'innovation',
                   'semiconductor', 'chip', 'smartphone', 'app', 'startup',
                   'fintech', 'upi', 'payment', 'cyber', 'cloud',
                   'policy', 'ai policy'],
    'defence': ['missile', 'defence', 'defense', 'military', 'army', 'navy',
                'air force', 'f-35', 'ballistic', 'pralay', 'weapon',
                'war', 'peace talks', 'bombardment', 'ukraine', 'russia',
                'nato', 'geopolitical', 'iran', 'diplomatic', 'trump'],
    'sports': ['hockey', 'cricket', 'coach', 'sports', 'player', 'team',
               'tournament', 'olympics', 'governance act', 'marijne'],
    'health': ['who', 'nipah', 'virus', 'health', 'medical', 'pandemic',
               'disease', 'hospital'],
    'industry': ['manufacturing', 'steel', 'pharma', 'automotive', 'aviation',
                 'energy', 'construction', 'cement', 'chemical',
                 'industries', 'safety', 'strength', 'precision'],
    'business': ['business', 'company', 'corporate', 'revenue', 'profit',
                 'merger', 'acquisition', 'ipo', 'listing', 'retail',
                 'e-commerce', 'real estate', 'property']
}


def get_mongodb():
    uri = os.getenv("MONGO_URI")
    if not uri:
        print("❌ MONGO_URI not set!")
        sys.exit(1)
    client = MongoClient(uri)
    db = client.get_database()
    db.command('ping')
    print(f"✅ Connected to MongoDB: {db.name}")
    return db


def fetch_channel_videos(num_videos=30):
    """Fetch latest videos from @Bizz_Short Shorts channel"""
    print(f"\n📡 Fetching latest {num_videos} videos from @Bizz_Short...\n")
    
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
        'playlistend': num_videos,
        'ignoreerrors': True,
    }
    
    videos = []
    
    # Try shorts first, then regular videos
    urls_to_try = [
        "https://www.youtube.com/@Bizz_Short/shorts",
        "https://www.youtube.com/@Bizz_Short/videos",
    ]
    
    for url in urls_to_try:
        try:
            print(f"   Trying: {url}")
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                result = ydl.extract_info(url, download=False)
                if result and 'entries' in result:
                    for entry in result['entries']:
                        if entry is None:
                            continue
                        vid = {
                            'videoId': entry.get('id', ''),
                            'title': entry.get('title', 'Untitled'),
                            'yt_description': entry.get('description', ''),
                            'thumbnail': entry.get('thumbnail', ''),
                            'duration': str(entry.get('duration', 0)),
                            'view_count': str(entry.get('view_count', 0)),
                            'upload_date': entry.get('upload_date', ''),
                        }
                        # Skip duplicates
                        if any(v['videoId'] == vid['videoId'] for v in videos):
                            continue
                        videos.append(vid)
                        print(f"   {len(videos):02d}. {vid['videoId']} → {vid['title'][:60]}")
                        if len(videos) >= num_videos:
                            break
            if len(videos) >= num_videos:
                break
        except Exception as e:
            print(f"   ⚠️ Error with {url}: {e}")
            continue
    
    print(f"\n✅ Fetched {len(videos)} videos\n")
    return videos


def download_audio(video_id, temp_dir):
    """Download audio from a YouTube Shorts video — tries multiple URL formats"""
    output_template = os.path.join(temp_dir, f"{video_id}.%(ext)s")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_template,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '128',
        }],
        'quiet': True,
        'no_warnings': True,
    }
    
    if FFMPEG_PATH:
        ydl_opts['ffmpeg_location'] = os.path.dirname(FFMPEG_PATH)
    
    # Try multiple URL formats (shorts and regular)
    urls = [
        f'https://www.youtube.com/shorts/{video_id}',
        f'https://www.youtube.com/watch?v={video_id}',
    ]
    
    for url in urls:
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            
            # Find the audio file
            for ext in ['mp3', 'm4a', 'webm', 'wav', 'opus']:
                path = os.path.join(temp_dir, f"{video_id}.{ext}")
                if os.path.exists(path):
                    return path
        except Exception:
            continue
    
    return None


def transcribe_audio(audio_path, model):
    """Transcribe audio using Whisper"""
    try:
        result = model.transcribe(audio_path, language=None)
        text = result["text"].strip()
        return text
    except Exception as e:
        print(f"      ❌ Transcription failed: {e}")
        return None


def is_client_video(title, transcription):
    """Determine if video is client feature vs BizzShort news.
    
    Rule: 
    - #bizzshort logo/hashtag in title → NEWS
    - Client keywords → CLIENT  
    - No BizzShort branding and no news content → CLIENT
    """
    title_lower = (title or '').lower()
    text = (title_lower + ' ' + (transcription or '').lower())
    
    # Strong news indicators
    has_news_hashtag = any(tag in title_lower for tag in NEWS_HASHTAGS)
    if has_news_hashtag:
        return False  # It's news
    
    # Check for client keywords
    for keyword in CLIENT_KEYWORDS:
        if keyword in text:
            return True
    
    # If no BizzShort branding AND no clear news content → likely client
    news_words = [
        'government', 'policy', 'parliament', 'minister', 'gdp', 'rbi',
        'stock market', 'nifty', 'sensex', 'budget', 'inflation',
        'missile', 'defence', 'military', 'train', 'railway',
        'who ', 'ukraine', 'russia', 'trump', 'president',
        'hockey', 'coach', 'isro', 'satellite',
    ]
    has_news_content = any(word in text for word in news_words)
    
    if not has_news_content:
        return True
    
    return False


def categorize_video(title, transcription):
    """Categorize video based on content"""
    text = (title + ' ' + (transcription or '')).lower()
    
    scores = {}
    for category, keywords in CATEGORY_MAP.items():
        score = sum(1 for kw in keywords if kw in text)
        scores[category] = score
    
    if max(scores.values()) > 0:
        return max(scores, key=scores.get)
    return 'business'


def format_transcription_as_article(title, raw_text):
    """Convert raw transcription into proper article content.
    If transcription is too short or empty, generate article from title."""
    
    # Clean title for use in content
    clean_title = re.sub(r'#\w+', '', title).strip()
    clean_title = re.sub(r'\s+', ' ', clean_title).strip()
    
    if not raw_text or len(raw_text.strip()) < 30:
        # No transcription → generate article from title
        return generate_article_from_title(clean_title)
    
    text = raw_text.strip()
    
    # Remove Whisper artifacts
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'\(.*?\)', '', text)
    text = re.sub(r'#\w+', '', text)
    text = text.replace('  ', ' ').strip()
    
    if len(text) < 30:
        return generate_article_from_title(clean_title)
    
    # Split into sentences
    sentences = re.split(r'(?<=[.!?।])\s+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if len(sentences) <= 1:
        # Single long sentence — add context
        article = f"{text}\n\n"
        article += f"This development is part of the broader trends shaping India's economic and business landscape. "
        article += f"BizzShort continues to bring you the latest updates on stories that matter to investors and business professionals."
        return article
    
    # Group into paragraphs (3-4 sentences each)
    paragraphs = []
    current = []
    for i, sentence in enumerate(sentences):
        current.append(sentence)
        if len(current) >= 3 or i == len(sentences) - 1:
            paragraphs.append(' '.join(current))
            current = []
    
    return '\n\n'.join(paragraphs)


def generate_article_from_title(title):
    """Generate a journalistic article from just the title when transcription fails."""
    
    # Remove hashtags and clean
    clean = re.sub(r'#\w+', '', title).strip()
    clean = re.sub(r'\s+', ' ', clean)
    
    if not clean:
        return "Watch the video for the full story. BizzShort brings you daily business and market updates."
    
    # Generate contextual article
    article = f"{clean}.\n\n"
    
    title_lower = clean.lower()
    
    if any(w in title_lower for w in ['gold', 'silver', 'precious metal', 'commodity']):
        article += "Precious metals markets have been experiencing significant volatility driven by global macroeconomic factors and shifting investor sentiment. "
        article += "Analysts are closely watching central bank policies and geopolitical tensions that continue to influence commodity prices across the board.\n\n"
        article += "Market experts suggest that the current price movements reflect broader trends in the global economy, with inflation concerns and currency fluctuations playing key roles in determining precious metal valuations."
    
    elif any(w in title_lower for w in ['oil', 'crude', 'petrol', 'fuel']):
        article += "Global crude oil markets continue to be influenced by geopolitical developments and supply-demand dynamics. "
        article += "OPEC+ production decisions, along with tensions in key oil-producing regions, are keeping traders on alert for potential price disruptions.\n\n"
        article += "Energy analysts note that India, as one of the world's largest oil importers, watches these developments closely as they directly impact domestic fuel prices and the broader economy."
    
    elif any(w in title_lower for w in ['ukraine', 'russia', 'war', 'peace', 'bombardment', 'nato', 'trump']):
        article += "The geopolitical landscape continues to evolve with significant implications for global markets and diplomatic relations. "
        article += "International observers are monitoring developments closely as they could have far-reaching consequences for trade, energy markets, and global stability.\n\n"
        article += "Diplomatic channels remain active with multiple nations involved in efforts to de-escalate tensions. The outcome of these negotiations could significantly influence investor confidence and market trajectories worldwide."
    
    elif any(w in title_lower for w in ['ev', 'electric vehicle', 'automobile', 'car', 'vehicle']):
        article += "India's electric vehicle market is witnessing remarkable transformation driven by government incentives, expanding charging infrastructure, and growing consumer awareness about sustainable transportation.\n\n"
        article += "Major automobile manufacturers are ramping up their EV portfolios to meet rising demand. Industry experts project the Indian EV market will continue its rapid growth trajectory, supported by favorable policy frameworks and declining battery costs."
    
    elif any(w in title_lower for w in ['hydrogen', 'solar', 'renewable', 'green energy']):
        article += "India's clean energy transition is gaining momentum with substantial government investment and private sector participation. The country's renewable energy ambitions align with its commitment to achieving net-zero emissions.\n\n"
        article += "Industry stakeholders view these developments as critical steps toward energy security and sustainable economic growth. The initiatives are expected to create significant employment opportunities while reducing India's dependence on fossil fuels."
    
    elif any(w in title_lower for w in ['railway', 'vande bharat', 'train']):
        article += "Indian Railways continues its ambitious modernization program with new routes, upgraded services, and faster trains. The expansion of the Vande Bharat network represents a significant step in improving passenger rail connectivity across the country.\n\n"
        article += "Railway authorities have emphasized that these developments will boost regional economies and provide travelers with world-class rail services. The investment in modern rolling stock and infrastructure upgrades signals the government's commitment to transforming India's railway network."
    
    elif any(w in title_lower for w in ['missile', 'defence', 'military', 'pralay', 'ballistic', 'f-35']):
        article += "India's defence sector continues to advance with indigenous technology development and strategic capability building. These developments underscore the nation's commitment to self-reliance in defense manufacturing.\n\n"
        article += "Defence analysts note that India's growing military capabilities serve as a strategic deterrent while also boosting the domestic defense industry. The focus on indigenous production aligns with the broader Atmanirbhar Bharat vision."
    
    elif any(w in title_lower for w in ['stock', 'market', 'nifty', 'sensex', 'decline', 'trading']):
        article += "Indian equity markets have seen notable activity as investors assess corporate earnings, global cues, and domestic economic indicators. Trading volumes reflected the market's response to recent developments across sectors.\n\n"
        article += "Market strategists advise investors to maintain a balanced portfolio approach given the current environment. Sector rotation and earnings trajectory will be key factors influencing market direction in the near term."
    
    elif any(w in title_lower for w in ['hockey', 'coach', 'cricket', 'sports', 'marijne']):
        article += "Indian sports continues to make strides on the international stage with strategic appointments and governance reforms. These developments signal a professional approach to achieving excellence in competitive sports.\n\n"
        article += "Sports administrators and athletes alike view these changes as positive steps toward building stronger national teams and improving India's performance in global competitions."
    
    elif any(w in title_lower for w in ['who', 'nipah', 'virus', 'health']):
        article += "Health authorities continue to monitor the situation closely while maintaining preparedness protocols. India's healthcare infrastructure has been significantly strengthened in recent years to handle emerging health challenges.\n\n"
        article += "Public health experts emphasize the importance of awareness, early detection, and swift response mechanisms. The government has assured citizens that all necessary measures are being taken to safeguard public health."
    
    elif any(w in title_lower for w in ['ai', 'policy', 'digital', 'technology']):
        article += "India's technology sector is evolving rapidly with supportive policy frameworks and growing digital adoption. The government's focus on artificial intelligence and digital infrastructure aims to position India as a global technology leader.\n\n"
        article += "Industry experts believe these policy initiatives will drive innovation, create employment opportunities, and accelerate India's digital transformation across multiple sectors."
    
    elif any(w in title_lower for w in ['satellite', 'isro', 'space']):
        article += "India's space program continues to achieve remarkable milestones with contributions from both government agencies and private sector players. The growing ecosystem of space startups reflects the sector's expanding commercial potential.\n\n"
        article += "ISRO's collaborative approach with startups and academic institutions is fostering innovation and reducing costs in space technology. These developments position India as a key player in the global space industry."
    
    elif any(w in title_lower for w in ['iran', 'diplomatic', 'foreign', 'minister']):
        article += "Diplomatic engagements continue to shape the geopolitical landscape with implications for regional stability and international trade. Multilateral dialogues remain crucial for resolving complex geopolitical challenges.\n\n"
        article += "Analysts observe that these diplomatic signals could influence energy markets, trade routes, and strategic partnerships. India maintains its position of strategic autonomy while engaging constructively with all parties."
    
    else:
        # Generic business article
        article += "This development highlights the dynamic nature of India's business and economic landscape. Industry observers note that such trends have significant implications for investors, policymakers, and market participants alike.\n\n"
        article += "BizzShort brings you comprehensive coverage of the stories shaping India's economic future. Stay tuned for more updates as this story develops."
    
    return article


def main():
    print("\n" + "=" * 70)
    print("   🚀 BIZZSHORT FULL PIPELINE v2")
    print("   Fetch → Transcribe → Categorize → Save")
    print("=" * 70 + "\n")
    
    # Step 1: Connect to MongoDB
    db = get_mongodb()
    
    # Step 2: Delete ALL existing videos
    print("\n🗑️  Deleting ALL existing videos...")
    delete_result = db.videos.delete_many({})
    print(f"   Deleted {delete_result.deleted_count} videos\n")
    
    # Step 3: Fetch latest 30 videos from channel
    videos = fetch_channel_videos(NUM_VIDEOS)
    
    if not videos:
        print("❌ No videos fetched. Aborting.")
        return
    
    # Step 4: Load Whisper model
    print(f"🧠 Loading Whisper model ({WHISPER_MODEL})...")
    model = whisper.load_model(WHISPER_MODEL)
    print("✅ Model loaded\n")
    
    # Step 5: Process each video
    print("=" * 70)
    print("   🎤 TRANSCRIBING VIDEOS")
    print("=" * 70 + "\n")
    
    processed = []
    
    for i, video in enumerate(videos):
        num = f"{i+1:02d}/{len(videos)}"
        vid_id = video['videoId']
        title = video['title']
        
        print(f"[{num}] 🎬 {title[:60]}...")
        print(f"      ID: {vid_id}")
        
        transcription = None
        with tempfile.TemporaryDirectory() as temp_dir:
            print(f"      📥 Downloading audio...")
            audio_path = download_audio(vid_id, temp_dir)
            
            if audio_path:
                file_size = os.path.getsize(audio_path)
                print(f"      📁 Audio file: {file_size/1024:.0f} KB")
                print(f"      🎤 Transcribing...")
                transcription = transcribe_audio(audio_path, model)
                if transcription:
                    print(f"      ✅ Transcribed ({len(transcription)} chars): {transcription[:80]}...")
                else:
                    print(f"      ⚠️  Transcription empty")
            else:
                print(f"      ⚠️  Audio download failed, will generate article from title")
        
        # Determine if client or news
        is_client = is_client_video(title, transcription)
        category = categorize_video(title, transcription)
        
        # Format article content
        article_text = format_transcription_as_article(title, transcription)
        
        video['transcription'] = article_text
        video['raw_transcription'] = transcription or ''
        video['is_client'] = is_client
        video['category'] = category
        
        type_label = "🎯 CLIENT" if is_client else "📰 NEWS"
        print(f"      📌 {type_label} | Category: {category.upper()}")
        print(f"      📝 Article: {len(article_text)} chars")
        print()
        
        processed.append(video)
    
    # Step 6: Assign sections
    client_vids = [v for v in processed if v['is_client']]
    news_vids = [v for v in processed if not v['is_client']]
    
    print("=" * 70)
    print("   📊 CLASSIFICATION RESULTS")
    print("=" * 70)
    print(f"\n   Client feature videos: {len(client_vids)}")
    print(f"   News videos: {len(news_vids)}\n")
    
    final = []
    
    # Client features (need exactly 6)
    cf_count = 0
    for v in client_vids[:6]:
        v['videoType'] = 'client'
        v['section'] = 'client-features'
        final.append(v)
        cf_count += 1
    
    # If not enough client videos, take from end of news list
    if cf_count < 6:
        extra_needed = 6 - cf_count
        if extra_needed <= len(news_vids):
            extra = news_vids[-extra_needed:]
            news_vids = news_vids[:-extra_needed]
        else:
            extra = news_vids[:]
            news_vids = []
        for v in extra:
            v['videoType'] = 'client'
            v['section'] = 'client-features'
            final.append(v)
            cf_count += 1
    
    # Extra client videos → latest-updates
    for v in client_vids[6:]:
        v['videoType'] = 'client'
        v['section'] = 'latest-updates'
        final.append(v)
    
    # Breaking news (first 6 news)
    for v in news_vids[:6]:
        v['videoType'] = 'news'
        v['section'] = 'breaking-news'
        final.append(v)
    
    # Latest updates (remaining news) — aim for 16
    for v in news_vids[6:]:
        v['videoType'] = 'news'
        v['section'] = 'latest-updates'
        final.append(v)
    
    # Step 7: Add Instagram reels as interviews
    print("📸 Adding Instagram reels...")
    for reel in INSTAGRAM_REELS:
        reel_doc = {
            'videoId': reel['reelId'],
            'title': reel['title'],
            'transcription': f"{reel['title']}.\n\nExclusive interview brought to you by BizzShort. Watch the full conversation with industry leaders sharing their insights on current market trends, business strategies, and the economic outlook for India.\n\nBizzShort features in-depth conversations with business leaders, market analysts, and industry experts to bring you perspectives that matter.",
            'raw_transcription': '',
            'is_client': False,
            'category': 'business',
            'videoType': 'news',
            'section': 'interviews',
            'yt_description': '',
            'thumbnail': '',
            'duration': '60',
            'view_count': '0',
            'upload_date': '',
            'source_type': 'instagram',
        }
        final.append(reel_doc)
        print(f"   📸 Added reel: {reel['title'][:50]}")
    
    # Step 8: Save to MongoDB
    print("\n" + "=" * 70)
    print("   💾 SAVING TO DATABASE")
    print("=" * 70 + "\n")
    
    saved = 0
    for v in final:
        try:
            is_instagram = v.get('source_type') == 'instagram'
            source = 'instagram' if is_instagram else 'youtube'
            vid_id = v['videoId']
            
            if is_instagram:
                thumb = ''
            else:
                thumb = v.get('thumbnail', f"https://img.youtube.com/vi/{vid_id}/maxresdefault.jpg")
            
            doc = {
                'videoId': vid_id,
                'title': v['title'],
                'description': v['transcription'],
                'transcription': v['transcription'],
                'category': v['category'],
                'videoType': v['videoType'],
                'section': v['section'],
                'source': source,
                'thumbnail': thumb,
                'views': v.get('view_count', '0'),
                'duration': v.get('duration', '0'),
                'date': datetime.now().strftime('%Y-%m-%d'),
                'featured': False,
                'tags': [v['category']],
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow(),
            }
            db.videos.insert_one(doc)
            
            icons = {'breaking-news': '📰', 'client-features': '🎯', 'latest-updates': '📋', 'interviews': '🎤'}
            icon = icons.get(v['section'], '📹')
            print(f"   {icon} [{v['section'].upper():17s}] {v['title'][:55]}...")
            saved += 1
            
        except Exception as e:
            print(f"   ❌ Failed: {e}")
    
    # Step 9: Summary
    bn = sum(1 for v in final if v['section'] == 'breaking-news')
    cf = sum(1 for v in final if v['section'] == 'client-features')
    lu = sum(1 for v in final if v['section'] == 'latest-updates')
    iv = sum(1 for v in final if v['section'] == 'interviews')
    
    print(f"""
{'=' * 70}
   ✨ PIPELINE v2 COMPLETE!
{'=' * 70}

   Total saved: {saved}
   ├── 📰 Breaking News:    {bn}
   ├── 🎯 Client Features:  {cf}
   ├── 📋 Latest Updates:   {lu}
   └── 🎤 Interviews:       {iv}
""")
    
    # Show categories
    cats = {}
    for v in final:
        cats[v['category']] = cats.get(v['category'], 0) + 1
    print("   Categories:")
    for cat, count in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"      {cat.capitalize()}: {count}")
    
    # Show client videos
    print(f"\n   🎯 Client Feature Videos:")
    for v in final:
        if v['section'] == 'client-features':
            print(f"      • {v['title'][:65]}")
    
    print(f"\n   📰 Breaking News Videos:")
    for v in final:
        if v['section'] == 'breaking-news':
            print(f"      • {v['title'][:65]}")
    
    # Save backup
    backup_path = os.path.join(os.path.dirname(__file__), 'video_data_backup.json')
    backup = []
    for v in final:
        backup.append({
            'videoId': v['videoId'],
            'title': v['title'],
            'section': v['section'],
            'videoType': v['videoType'],
            'category': v['category'],
            'article_length': len(v.get('transcription', '')),
            'has_real_transcription': len(v.get('raw_transcription', '')) > 30,
        })
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(backup, f, indent=2, ensure_ascii=False)
    print(f"\n📁 Backup saved: {backup_path}\n")


if __name__ == "__main__":
    main()
