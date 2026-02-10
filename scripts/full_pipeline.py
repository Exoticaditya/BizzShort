"""
BizzShort Full Pipeline v2: Fetch → Transcribe → Categorize → Save
===================================================================

1. Deletes ALL existing videos from MongoDB
2. Fetches the latest 30 videos from @Bizz_Short YouTube (Shorts + Videos)
3. Downloads RAW audio (no ffmpeg postprocessing) and transcribes with Whisper
4. Categorizes each video:
   - Videos with BizzShort news content → 'news' (breaking-news or latest-updates)
   - Videos featuring clients → 'client' (client-features)
5. Distribution: 6 breaking news, 6 client features, 16 latest updates
6. Saves everything to MongoDB

Usage:
    python scripts/full_pipeline.py
"""

import os
import sys
import json
import tempfile
import re
import shutil
import glob
from datetime import datetime
from pathlib import Path

# ============================================================
# STEP 0: Fix FFmpeg — copy imageio_ffmpeg binary as ffmpeg.exe
# so Whisper can find it. yt-dlp does NOT need ffmpeg because
# we skip the postprocessor and download raw audio.
# ============================================================
FFMPEG_PATH = None
FFMPEG_TEMP_DIR = None

try:
    import imageio_ffmpeg
    _src = imageio_ffmpeg.get_ffmpeg_exe()
    FFMPEG_TEMP_DIR = tempfile.mkdtemp(prefix='bizzshort_ffmpeg_')
    _ext = '.exe' if sys.platform == 'win32' else ''
    _dst = os.path.join(FFMPEG_TEMP_DIR, f'ffmpeg{_ext}')
    shutil.copy2(_src, _dst)
    FFMPEG_PATH = _dst
    os.environ["PATH"] = FFMPEG_TEMP_DIR + os.pathsep + os.environ.get("PATH", "")
    print(f"✅ FFmpeg ready: {_dst}")
except ImportError:
    print("⚠️  imageio-ffmpeg not installed — hoping ffmpeg is in PATH")
except Exception as e:
    print(f"⚠️  FFmpeg setup issue: {e}")

# Load environment variables
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
CHANNEL_SHORTS = "https://www.youtube.com/@Bizz_Short/shorts"
CHANNEL_VIDEOS = "https://www.youtube.com/@Bizz_Short/videos"
NUM_VIDEOS = 30
WHISPER_MODEL = "base"  # tiny, base, small, medium, large

# Target distribution
TARGET_BREAKING = 6
TARGET_CLIENT = 6
TARGET_LATEST = 16  # 6+6+16 = 28 used, extras go here

# Category keywords
CATEGORY_MAP = {
    'economy': ['gdp', 'economy', 'inflation', 'growth', 'fiscal', 'economic',
                'production', 'exports', 'import', 'trade', 'rupee', 'forex',
                'rbi', 'reserve bank', 'monetary', 'gst', 'tax', 'budget',
                'agriculture', 'sugar', 'coffee', 'wheat', 'oil price',
                'hydrogen', 'green hydrogen', 'ev sales', 'electric vehicle',
                'solar', 'renewable', 'railway', 'train', 'vande bharat',
                'infrastructure'],
    'markets': ['stock', 'market', 'nifty', 'sensex', 'share', 'trading',
                'investor', 'mutual fund', 'fii', 'fpi', 'gold', 'silver',
                'commodity', 'hdfc', 'banking', 'earnings', 'quarter',
                'precious metal', 'market movement', 'monthly decline'],
    'technology': ['ai', 'tech', 'digital', 'software', 'data', 'innovation',
                   'semiconductor', 'chip', 'smartphone', 'app', 'startup',
                   'fintech', 'upi', 'payment', 'cyber', 'cloud',
                   'satellite', 'isro', 'space'],
    'defence': ['missile', 'defence', 'defense', 'military', 'army', 'navy',
                'air force', 'f-35', 'ballistic', 'pralay', 'weapon',
                'war', 'peace talks', 'bombardment', 'ukraine', 'russia',
                'nato', 'geopolitical', 'iran', 'diplomatic'],
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
    """Connect to MongoDB"""
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
    """Fetch latest videos from @Bizz_Short — tries Shorts first, then Videos tab"""
    print(f"\n📡 Fetching latest {num_videos} videos from @Bizz_Short...\n")
    
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
        'playlistend': num_videos + 5,  # fetch a few extra as buffer
        'ignoreerrors': True,
    }
    
    videos = []
    seen_ids = set()
    
    # Try Shorts tab first, then Videos tab
    for tab_url in [CHANNEL_SHORTS, CHANNEL_VIDEOS]:
        if len(videos) >= num_videos:
            break
        tab_name = "Shorts" if "shorts" in tab_url else "Videos"
        print(f"   🔍 Trying {tab_name} tab...")
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                result = ydl.extract_info(tab_url, download=False)
                if result and 'entries' in result:
                    for entry in result['entries']:
                        if entry is None:
                            continue
                        vid_id = entry.get('id', '')
                        if vid_id in seen_ids:
                            continue
                        seen_ids.add(vid_id)
                        vid = {
                            'videoId': vid_id,
                            'title': entry.get('title', 'Untitled'),
                            'yt_description': entry.get('description', ''),
                            'thumbnail': entry.get('thumbnail', ''),
                            'duration': str(entry.get('duration', 0)),
                            'view_count': str(entry.get('view_count', 0)),
                            'upload_date': entry.get('upload_date', ''),
                        }
                        videos.append(vid)
                        print(f"   {len(videos):02d}. [{tab_name[0]}] {vid['videoId']} → {vid['title'][:55]}")
                        if len(videos) >= num_videos:
                            break
        except Exception as e:
            print(f"   ⚠️  {tab_name} tab failed: {e}")
    
    print(f"\n✅ Fetched {len(videos)} videos\n")
    return videos[:num_videos]


def download_audio(video_id, temp_dir):
    """Download raw audio from YouTube WITHOUT ffmpeg postprocessing.
    
    Key: We skip FFmpegExtractAudio so yt-dlp does NOT need ffprobe.
    Whisper can handle webm/m4a/opus/mp4 natively via its own ffmpeg call.
    """
    output_template = os.path.join(temp_dir, f"{video_id}.%(ext)s")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_template,
        # NO postprocessors — raw download, no ffprobe needed
        'quiet': True,
        'no_warnings': True,
    }
    
    # Try Shorts URL first, then regular URL
    urls = [
        f'https://www.youtube.com/shorts/{video_id}',
        f'https://www.youtube.com/watch?v={video_id}',
    ]
    
    for url in urls:
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            
            # Find the downloaded file
            for f in os.listdir(temp_dir):
                if f.startswith(video_id):
                    fpath = os.path.join(temp_dir, f)
                    fsize = os.path.getsize(fpath)
                    if fsize > 1000:  # Must be >1KB to be valid
                        print(f"      ✅ Downloaded: {f} ({fsize // 1024}KB)")
                        return fpath
        except Exception as e:
            continue
    
    return None


def transcribe_audio(audio_path, model):
    """Transcribe audio using Whisper with proper Hindi/English detection.
    
    Whisper often misdetects Hindi as Urdu since they sound identical.
    We detect first, then force Hindi if Urdu is detected.
    """
    try:
        # Step 1: Detect language from first 30 seconds
        audio = whisper.load_audio(audio_path)
        audio_30s = whisper.pad_or_trim(audio)
        mel = whisper.log_mel_spectrogram(audio_30s).to(model.device)
        _, probs = model.detect_language(mel)
        detected = max(probs, key=probs.get)
        print(f"      🌐 Detected: {detected} ({probs[detected]:.2f})")
        
        # Step 2: Map Urdu/similar → Hindi, only allow en/hi
        LANG_MAP = {'ur': 'hi', 'sd': 'hi', 'pa': 'hi'}
        lang = LANG_MAP.get(detected, detected)
        if lang not in ('en', 'hi'):
            lang = 'hi'
        print(f"      🎤 Transcribing as: {lang}")
        
        # Step 3: Transcribe with forced language
        result = model.transcribe(audio_path, language=lang)
        text = result["text"].strip()
        return text
    except Exception as e:
        print(f"      ❌ Transcription failed: {e}")
        return None


def is_client_video(title, transcription):
    """Determine if video is a client feature based on content.
    
    Rule: Videos with #bizzshort or #news in title are NEWS.
    Videos without these hashtags, or about specific companies/brands are CLIENT.
    """
    title_lower = (title or '').lower()
    text = (title_lower + ' ' + (transcription or '').lower())
    
    # Strong news indicators - if title has these, it's definitely news
    news_hashtags = ['#bizzshort', '#news', '#breaking', '#update', '#market']
    has_news_hashtag = any(tag in title_lower for tag in news_hashtags)
    
    if has_news_hashtag:
        return False  # It's news, not client
    
    # Check for client-related keywords
    client_indicators = [
        'akona', 'tofu', 'garvik', 'client', 'brand story', 'sponsor',
        'partner', 'featured company', 'company profile', 'startup feature',
        'business spotlight', 'corporate feature', 'introducing',
        'in industries where', 'our product', 'our company', 'we provide',
        'our mission', 'our vision', 'we are', 'we offer',
    ]
    
    for keyword in client_indicators:
        if keyword in text:
            return True
    
    # If no news hashtags AND no clear news content, likely client
    news_content_words = [
        'government', 'policy', 'parliament', 'minister', 'gdp', 'rbi',
        'stock market', 'nifty', 'sensex', 'budget', 'inflation',
        'missile', 'defence', 'military', 'train', 'railway',
        'who ', 'ukraine', 'russia', 'trump', 'president',
        'hockey', 'coach', 'isro', 'satellite',
    ]
    
    has_news_content = any(word in text for word in news_content_words)
    
    if not has_news_content:
        return True  # No news indicators = client
    
    return False


def categorize_video(title, transcription):
    """Categorize video based on content"""
    text = (title + ' ' + (transcription or '')).lower()
    
    # Score each category
    scores = {}
    for category, keywords in CATEGORY_MAP.items():
        score = sum(1 for kw in keywords if kw in text)
        scores[category] = score
    
    # Return highest scoring category, default to 'business'
    if max(scores.values()) > 0:
        return max(scores, key=scores.get)
    return 'business'


def format_transcription_as_article(title, raw_text):
    """Convert raw transcription into proper article content"""
    if not raw_text or len(raw_text.strip()) < 20:
        return f"Watch the full video for detailed coverage on: {title}"
    
    # Clean up the text
    text = raw_text.strip()
    
    # Remove common Whisper artifacts
    text = re.sub(r'\[.*?\]', '', text)  # Remove [Music], [Applause] etc
    text = re.sub(r'\(.*?\)', '', text)  # Remove (inaudible) etc
    text = text.replace('  ', ' ').strip()
    
    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    if len(sentences) <= 2:
        # Short text - just return as one paragraph
        return text
    
    # Group sentences into paragraphs (3-4 sentences each)
    paragraphs = []
    current = []
    for i, sentence in enumerate(sentences):
        current.append(sentence.strip())
        if len(current) >= 3 or i == len(sentences) - 1:
            paragraphs.append(' '.join(current))
            current = []
    
    return '\n\n'.join(paragraphs)


def main():
    print("\n" + "=" * 70)
    print("   🚀 BIZZSHORT FULL PIPELINE v2")
    print("   Fetch → Transcribe → Categorize → Save")
    print(f"   Target: {TARGET_BREAKING} breaking | {TARGET_LATEST} latest | {TARGET_CLIENT} client")
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
    
    # Step 5: Process each video — download audio & transcribe
    print("=" * 70)
    print("   🎤 TRANSCRIBING VIDEOS")
    print("=" * 70 + "\n")
    
    processed_videos = []
    success_count = 0
    fail_count = 0
    
    for i, video in enumerate(videos):
        num = f"{i+1:02d}/{len(videos)}"
        vid_id = video['videoId']
        title = video['title']
        
        print(f"[{num}] 🎬 {title[:60]}...")
        print(f"      ID: {vid_id}")
        
        # Download and transcribe
        transcription = None
        with tempfile.TemporaryDirectory() as temp_dir:
            print(f"      📥 Downloading audio (raw, no ffmpeg post-processing)...")
            audio_path = download_audio(vid_id, temp_dir)
            
            if audio_path:
                print(f"      🎤 Transcribing with Whisper...")
                transcription = transcribe_audio(audio_path, model)
                if transcription and len(transcription.strip()) > 10:
                    print(f"      ✅ Transcribed: {len(transcription)} chars")
                    print(f"      Preview: \"{transcription[:80]}...\"")
                    success_count += 1
                else:
                    print(f"      ⚠️  Transcription too short or empty")
                    fail_count += 1
            else:
                print(f"      ⚠️  Audio download failed — will use title as fallback")
                fail_count += 1
        
        # Determine if client or news
        is_client = is_client_video(title, transcription)
        category = categorize_video(title, transcription)
        
        # Format transcription as article content
        article_text = format_transcription_as_article(title, transcription)
        
        video['transcription'] = article_text
        video['raw_transcription'] = transcription or ''
        video['is_client'] = is_client
        video['category'] = category
        
        type_label = "CLIENT" if is_client else "NEWS"
        print(f"      📌 Type: {type_label} | Category: {category.upper()}")
        print()
        
        processed_videos.append(video)
    
    print(f"\n📊 Transcription results: {success_count} succeeded, {fail_count} failed\n")
    
    # Step 6: Sort and assign sections (6 breaking / 16 latest / 6 client)
    client_videos = [v for v in processed_videos if v['is_client']]
    news_videos = [v for v in processed_videos if not v['is_client']]
    
    print("=" * 70)
    print("   📊 CATEGORIZATION RESULTS")
    print("=" * 70)
    print(f"\n   Client feature videos detected: {len(client_videos)}")
    print(f"   News videos detected: {len(news_videos)}\n")
    
    final_videos = []
    
    # --- Client Features (need TARGET_CLIENT) ---
    cf_pool = list(client_videos)
    # If not enough detected clients, pull from end of news list
    if len(cf_pool) < TARGET_CLIENT:
        extra = TARGET_CLIENT - len(cf_pool)
        cf_pool.extend(news_videos[-extra:])
        news_videos = news_videos[:-extra] if extra < len(news_videos) else []
    
    for v in cf_pool[:TARGET_CLIENT]:
        v['videoType'] = 'client'
        v['section'] = 'client-features'
        final_videos.append(v)
    
    # Leftover clients go to latest-updates
    leftover_clients = [v for v in client_videos if v not in final_videos]
    
    # --- Breaking News (first TARGET_BREAKING news videos) ---
    for v in news_videos[:TARGET_BREAKING]:
        v['videoType'] = 'news'
        v['section'] = 'breaking-news'
        final_videos.append(v)
    
    # --- Latest Updates (remaining news + leftover clients, capped) ---
    remaining_news = news_videos[TARGET_BREAKING:]
    latest_pool = remaining_news + leftover_clients
    
    for v in latest_pool[:TARGET_LATEST]:
        v['videoType'] = v.get('videoType', 'news')
        v['section'] = 'latest-updates'
        final_videos.append(v)
    
    # Any extras beyond the target also go to latest-updates
    for v in latest_pool[TARGET_LATEST:]:
        v['videoType'] = v.get('videoType', 'news')
        v['section'] = 'latest-updates'
        final_videos.append(v)
    
    # Step 7: Save to MongoDB
    print("=" * 70)
    print("   💾 SAVING TO DATABASE")
    print("=" * 70 + "\n")
    
    saved_count = 0
    for v in final_videos:
        try:
            doc = {
                'videoId': v['videoId'],
                'title': v['title'],
                'description': v['transcription'],  # Article content
                'transcription': v['transcription'],  # Also in transcription field
                'category': v['category'],
                'videoType': v['videoType'],
                'section': v['section'],
                'source': 'youtube',
                'thumbnail': v.get('thumbnail', f"https://img.youtube.com/vi/{v['videoId']}/maxresdefault.jpg"),
                'views': v.get('view_count', '0'),
                'duration': v.get('duration', '0'),
                'date': datetime.now().strftime('%Y-%m-%d'),
                'featured': False,
                'tags': [v['category']],
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow(),
            }
            db.videos.insert_one(doc)
            
            section_icon = {'breaking-news': '📰', 'client-features': '🎯', 'latest-updates': '📋'}
            icon = section_icon.get(v['section'], '📹')
            print(f"   {icon} [{v['section'].upper()}] {v['title'][:55]}...")
            saved_count += 1
            
        except Exception as e:
            print(f"   ❌ Failed to save {v['videoId']}: {e}")
    
    # Step 8: Final summary
    print("\n" + "=" * 70)
    print("   ✨ PIPELINE COMPLETE!")
    print("=" * 70)
    
    bn = sum(1 for v in final_videos if v['section'] == 'breaking-news')
    cf = sum(1 for v in final_videos if v['section'] == 'client-features')
    lu = sum(1 for v in final_videos if v['section'] == 'latest-updates')
    
    print(f"""
   Total videos saved: {saved_count}
   ├── 📰 Breaking News:    {bn}
   ├── 🎯 Client Features:  {cf}
   └── 📋 Latest Updates:   {lu}
   
   Categories:""")
    
    cats = {}
    for v in final_videos:
        cats[v['category']] = cats.get(v['category'], 0) + 1
    for cat, count in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"      {cat.capitalize()}: {count}")
    
    print(f"""
   🎯 Client Feature Videos:""")
    for v in final_videos:
        if v['section'] == 'client-features':
            print(f"      • {v['title'][:65]}")
    
    print(f"""
   📰 Breaking News Videos:""")
    for v in final_videos:
        if v['section'] == 'breaking-news':
            print(f"      • {v['title'][:65]}")
    
    print(f"\n{'=' * 70}\n")
    
    # Save a JSON backup
    backup_path = os.path.join(os.path.dirname(__file__), 'video_data_backup.json')
    backup_data = []
    for v in final_videos:
        backup_data.append({
            'videoId': v['videoId'],
            'title': v['title'],
            'section': v['section'],
            'videoType': v['videoType'],
            'category': v['category'],
            'transcription_length': len(v.get('transcription', '')),
        })
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(backup_data, f, indent=2, ensure_ascii=False)
    print(f"📁 Backup saved to: {backup_path}\n")
    
    # Cleanup temp ffmpeg directory
    if FFMPEG_TEMP_DIR and os.path.exists(FFMPEG_TEMP_DIR):
        try:
            shutil.rmtree(FFMPEG_TEMP_DIR)
        except:
            pass


if __name__ == "__main__":
    main()
