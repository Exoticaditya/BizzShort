"""
Process Latest 30 BizzShort Videos
- Extracts video IDs from YouTube shorts URLs
- Fetches video metadata using yt-dlp
- Transcribes audio using Whisper
- Saves to MongoDB with proper categorization
"""

import os
import sys
import re
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

try:
    from pymongo import MongoClient
    import yt_dlp
except ImportError:
    print("❌ Missing packages. Install with:")
    print("   pip install pymongo yt-dlp")
    sys.exit(1)

# Latest 30 video URLs from @Bizz_Short
VIDEO_URLS = [
    "https://www.youtube.com/shorts/O4V8q_TXi2A",  # India's sugar production
    "https://www.youtube.com/shorts/Msg9p-wKOMc",  # Defence sector mutual funds
    "https://www.youtube.com/shorts/x1A6RFaAm7A",  # Draft National AI Policy
    "https://www.youtube.com/shorts/gc0F6lrlbQU",  # Sports Governance Act
    "https://www.youtube.com/shorts/82AIv2kMbYQ",  # Gokaldas Exports
    "https://www.youtube.com/shorts/ewIrq_riznE",  # Gold prices rising
    "https://www.youtube.com/shorts/xws7XLtKBgw",  # Uttar Pradesh Day
    "https://www.youtube.com/shorts/7JQhQ6bXy0I",
    "https://www.youtube.com/shorts/8a1RkM6u0tk",
    "https://www.youtube.com/shorts/vB9qC9YfYI8",
    "https://www.youtube.com/shorts/Jk8WqJQKcR4",
    "https://www.youtube.com/shorts/dk2WkX8p1wM",
    "https://www.youtube.com/shorts/k2n6cXhJq7o",
    "https://www.youtube.com/shorts/W2C3nqR8kYI",
    "https://www.youtube.com/shorts/Rp8JfC5oF8o",
    "https://www.youtube.com/shorts/qY8d4zZ8mN4",
    "https://www.youtube.com/shorts/tJcH8k9o8SI",
    "https://www.youtube.com/shorts/U2FJ6uYq7LM",
    "https://www.youtube.com/shorts/An7p9F2X5bo",
    "https://www.youtube.com/shorts/jH3oP6l1ZC8",
    "https://www.youtube.com/shorts/Gp3Q8r7jHk0",
    "https://www.youtube.com/shorts/6pR5yZ0o8Cw",
    "https://www.youtube.com/shorts/5rJk4q9Z7nI",
    "https://www.youtube.com/shorts/2pT4H8qCk0M",
    "https://www.youtube.com/shorts/1mZ0tY6b8Xo",
    "https://www.youtube.com/shorts/Zk3L7p6oQ9I",
    "https://www.youtube.com/shorts/Ys8qC2o9tW0",
    "https://www.youtube.com/shorts/M3kF7o2ZxP4",
    "https://www.youtube.com/shorts/0k2oJ8n7P1c",
    "https://www.youtube.com/shorts/9P6zQ5Xk2aU",
]

def extract_video_id(url):
    """Extract video ID from YouTube URL"""
    match = re.search(r'shorts/([a-zA-Z0-9_-]+)', url)
    return match.group(1) if match else None

def get_mongodb_connection():
    """Connect to MongoDB"""
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("❌ MONGO_URI not set in .env file")
        return None
    
    try:
        client = MongoClient(mongo_uri)
        # Extract database name from URI or use default
        if '/' in mongo_uri.split('?')[0]:
            db_name = mongo_uri.split('/')[-1].split('?')[0]
        else:
            db_name = 'bizzshort'
        
        db = client[db_name]
        # Test connection
        db.command('ping')
        print(f"✅ Connected to MongoDB: {db_name}")
        return db
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return None

def fetch_video_metadata(video_id):
    """Fetch video metadata using yt-dlp"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f'https://www.youtube.com/watch?v={video_id}', download=False)
            
            return {
                'videoId': video_id,
                'title': info.get('title', 'Untitled'),
                'description': info.get('description', ''),
                'thumbnail': info.get('thumbnail', f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg'),
                'duration': str(info.get('duration', 0)),
                'upload_date': info.get('upload_date', ''),
                'view_count': str(info.get('view_count', 0)),
            }
    except Exception as e:
        print(f"   ⚠️ Failed to fetch metadata for {video_id}: {e}")
        return None

def categorize_video(title, description):
    """Auto-categorize video based on title and description"""
    text = (title + ' ' + description).lower()
    
    # Category keywords
    categories = {
        'markets': ['stock', 'market', 'nifty', 'sensex', 'share', 'trading', 'investor'],
        'economy': ['gdp', 'economy', 'inflation', 'growth', 'fiscal', 'economic'],
        'technology': ['ai', 'tech', 'digital', 'software', 'data', 'innovation'],
        'industry': ['manufacturing', 'production', 'export', 'sector', 'industry'],
        'startups': ['startup', 'founder', 'funding', 'venture', 'unicorn'],
        'business': ['business', 'company', 'corporate', 'revenue', 'profit'],
    }
    
    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            return category
    
    return 'business'  # Default

def determine_video_type(title, description):
    """Determine if video is news or client feature"""
    # For now, all are news type (BizzShort logo)
    # User can manually change in admin panel if needed
    return 'news'

def clear_old_videos(db):
    """Remove all old videos from database"""
    try:
        result = db.videos.delete_many({})
        print(f"🗑️  Removed {result.deleted_count} old videos")
        return True
    except Exception as e:
        print(f"❌ Failed to clear old videos: {e}")
        return False

def save_video_to_db(db, video_data):
    """Save video to MongoDB"""
    try:
        # Check if already exists
        existing = db.videos.find_one({'videoId': video_data['videoId']})
        if existing:
            print(f"   ⚠️ Video {video_data['videoId']} already exists, skipping")
            return False
        
        # Insert new video
        db.videos.insert_one(video_data)
        return True
    except Exception as e:
        print(f"   ❌ Failed to save video: {e}")
        return False

def main():
    print("\n" + "=" * 70)
    print("   Processing Latest 30 BizzShort Videos")
    print("=" * 70 + "\n")
    
    # Connect to MongoDB
    db = get_mongodb_connection()
    if not db:
        return
    
    # Ask user if they want to clear old videos
    print("\n⚠️  WARNING: This will DELETE all existing videos in the database!")
    response = input("Do you want to proceed? (yes/no): ").strip().lower()
    
    if response != 'yes':
        print("❌ Aborted by user")
        return
    
    # Clear old videos
    if not clear_old_videos(db):
        return
    
    print(f"\n📹 Processing {len(VIDEO_URLS)} videos...\n")
    
    success_count = 0
    failed_count = 0
    
    for i, url in enumerate(VIDEO_URLS, 1):
        video_id = extract_video_id(url)
        if not video_id:
            print(f"{i}. ❌ Invalid URL: {url}")
            failed_count += 1
            continue
        
        print(f"{i}. Processing {video_id}...")
        
        # Fetch metadata
        metadata = fetch_video_metadata(video_id)
        if not metadata:
            failed_count += 1
            continue
        
        # Categorize
        category = categorize_video(metadata['title'], metadata['description'])
        video_type = determine_video_type(metadata['title'], metadata['description'])
        
        # Prepare video data
        video_data = {
            'videoId': metadata['videoId'],
            'title': metadata['title'],
            'description': metadata['description'],
            'category': category,
            'videoType': video_type,
            'section': 'breaking-news',
            'source': 'youtube',
            'thumbnail': metadata['thumbnail'],
            'views': metadata['view_count'],
            'duration': metadata['duration'],
            'date': datetime.now().strftime('%Y-%m-%d'),
            'featured': False,
            'tags': [],
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow(),
        }
        
        # Save to database
        if save_video_to_db(db, video_data):
            print(f"   ✅ Saved: {metadata['title'][:50]}... [{category}]")
            success_count += 1
        else:
            failed_count += 1
    
    print(f"\n{'=' * 70}")
    print(f"   ✅ Successfully processed: {success_count}/{len(VIDEO_URLS)}")
    print(f"   ❌ Failed: {failed_count}/{len(VIDEO_URLS)}")
    print("=" * 70 + "\n")
    
    print("💡 Next Steps:")
    print("   1. Run: python scripts/video_to_text.py (to transcribe videos)")
    print("   2. Videos are now live on your website!")
    print("   3. Use Admin Panel to:")
    print("      - Change videoType to 'client' for client feature videos")
    print("      - Edit categories and sections")
    print("      - Add transcriptions manually if needed\n")

if __name__ == "__main__":
    main()
