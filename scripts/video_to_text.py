"""
BizzShort Video-to-Text Transcription Script

Uses OpenAI Whisper to transcribe YouTube videos to text.
The transcribed text is saved to MongoDB for use as article content.

Requirements:
    pip install openai-whisper yt-dlp pymongo python-dotenv

Usage:
    python scripts/video_to_text.py
    python scripts/video_to_text.py --video-id VIDEO_ID
"""

import os
import sys
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# MongoDB connection
try:
    from pymongo import MongoClient
except ImportError:
    print("❌ pymongo not installed. Run: pip install pymongo")
    sys.exit(1)

# Check for required packages
def check_dependencies():
    """Check if required packages are installed"""
    missing = []
    
    try:
        import whisper
    except ImportError:
        missing.append("openai-whisper")
    
    try:
        import yt_dlp
    except ImportError:
        missing.append("yt-dlp")
    
    if missing:
        print("❌ Missing packages. Install with:")
        print(f"   pip install {' '.join(missing)}")
        return False
    return True

def download_audio(video_id: str, output_dir: str) -> str:
    """Download audio from YouTube video using yt-dlp"""
    import yt_dlp
    
    output_path = os.path.join(output_dir, f"{video_id}.mp3")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(output_dir, f"{video_id}.%(ext)s"),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '128',
        }],
        'quiet': True,
        'no_warnings': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([f'https://www.youtube.com/watch?v={video_id}'])
        
        if os.path.exists(output_path):
            return output_path
        
        # Check for other audio formats
        for ext in ['m4a', 'webm', 'wav']:
            alt_path = os.path.join(output_dir, f"{video_id}.{ext}")
            if os.path.exists(alt_path):
                return alt_path
                
    except Exception as e:
        print(f"   ❌ Download failed: {e}")
    
    return None

def transcribe_audio(audio_path: str, model_name: str = "base") -> str:
    """Transcribe audio using Whisper"""
    import whisper
    
    print(f"   🔄 Loading Whisper model ({model_name})...")
    model = whisper.load_model(model_name)
    
    print(f"   🎤 Transcribing audio...")
    result = model.transcribe(audio_path, language=None)  # Auto-detect language
    
    return result["text"].strip()

def get_mongodb_connection():
    """Connect to MongoDB"""
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("❌ MONGO_URI not set in environment")
        return None
    
    try:
        client = MongoClient(mongo_uri)
        db = client.get_database()
        print(f"✅ Connected to MongoDB: {db.name}")
        return db
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return None

def get_videos_without_transcription(db, limit: int = 10):
    """Get videos that don't have transcription yet"""
    return list(db.videos.find({
        "source": "youtube",
        "$or": [
            {"transcription": {"$exists": False}},
            {"transcription": None},
            {"transcription": ""}
        ]
    }).limit(limit))

def update_video_transcription(db, video_id: str, transcription: str):
    """Update video with transcription"""
    result = db.videos.update_one(
        {"videoId": video_id},
        {"$set": {
            "transcription": transcription,
            "updatedAt": datetime.utcnow()
        }}
    )
    return result.modified_count > 0

def process_video(video_id: str, db=None, model_name: str = "base"):
    """Process a single video: download, transcribe, save"""
    print(f"\n🎬 Processing video: {video_id}")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        # Step 1: Download audio
        print("   📥 Downloading audio...")
        audio_path = download_audio(video_id, temp_dir)
        
        if not audio_path:
            print("   ❌ Failed to download audio")
            return None
        
        print(f"   ✅ Audio downloaded: {os.path.basename(audio_path)}")
        
        # Step 2: Transcribe
        try:
            transcription = transcribe_audio(audio_path, model_name)
            print(f"   ✅ Transcription complete ({len(transcription)} chars)")
            
            # Step 3: Save to MongoDB if connected
            if db is not None:
                if update_video_transcription(db, video_id, transcription):
                    print("   💾 Saved to database")
                else:
                    print("   ⚠️ Video not found in database")
            
            return transcription
            
        except Exception as e:
            print(f"   ❌ Transcription failed: {e}")
            return None

def main():
    """Main function"""
    print("\n" + "=" * 60)
    print("   BizzShort Video-to-Text Transcription")
    print("   Using OpenAI Whisper for speech-to-text")
    print("=" * 60 + "\n")
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Parse command line arguments
    video_id = None
    model_name = "base"  # Options: tiny, base, small, medium, large
    
    for i, arg in enumerate(sys.argv[1:], 1):
        if arg == "--video-id" and i < len(sys.argv) - 1:
            video_id = sys.argv[i + 1]
        elif arg in ["tiny", "base", "small", "medium", "large"]:
            model_name = arg
    
    # Connect to MongoDB
    db = get_mongodb_connection()
    
    if video_id:
        # Process single video
        result = process_video(video_id, db, model_name)
        if result:
            print(f"\n📝 Transcription:\n{'-' * 40}")
            print(result[:500] + "..." if len(result) > 500 else result)
    else:
        # Process all videos without transcription
        if db is None:
            print("❌ No MongoDB connection and no video ID provided")
            return
        
        videos = get_videos_without_transcription(db, limit=5)
        print(f"📺 Found {len(videos)} videos needing transcription\n")
        
        if not videos:
            print("✅ All videos already have transcriptions!")
            return
        
        success_count = 0
        for video in videos:
            result = process_video(video["videoId"], db, model_name)
            if result:
                success_count += 1
        
        print(f"\n{'=' * 60}")
        print(f"   ✅ Successfully transcribed {success_count}/{len(videos)} videos")
        print("=" * 60 + "\n")

if __name__ == "__main__":
    main()
