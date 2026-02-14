const mongoose = require('mongoose');
const Video = require('../models/Video');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizzshort';

// Add new video IDs here - get these from https://www.youtube.com/@bizz_short/shorts
const NEW_VIDEOS_TO_ADD = [
    // Format: { videoId: 'YOUTUBE_ID', section: 'client-features' | 'breaking-news' | 'latest-updates' }
    { videoId: 'qIitvlJI0WU', section: 'client-features' },
    { videoId: 'FUR7OtMgHJQ', section: 'breaking-news' },
    { videoId: 'xrdOa0iRX4E', section: 'latest-updates' },
    { videoId: 'JP_P9Sn2ck8', section: 'latest-updates' }
];

async function loadCurrentSeed() {
    console.log('📂 Loading current seed data...');
    const seedPath = path.join(__dirname, '../data/seed-videos.json');
    const seedData = JSON.parse(await fs.readFile(seedPath, 'utf8'));
    
    await Video.deleteMany({});
    await Video.insertMany(seedData);
    console.log(`✅ Loaded ${seedData.length} videos\n`);
}

async function transcribeVideo(videoId) {
    return new Promise((resolve) => {
        console.log(`   🎤 Transcribing...`);
        
        const pythonPath = 'python';
        const scriptPath = path.join(__dirname, 'video_to_text.py');
        
        const process = spawn(pythonPath, [scriptPath, videoId]);
        let output = '';
        let errorOutput = '';
        
        process.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            // Show progress
            if (text.includes('Detecting language')) {
                process.stdout.write('.');
            }
        });
        
        process.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        process.on('close', (code) => {
            console.log(''); // New line after progress dots
            if (code === 0) {
                try {
                    const result = JSON.parse(output);
                    console.log(`   ✅ Transcribed in ${result.language}`);
                    resolve(result);
                } catch (e) {
                    console.log(`   ⚠️  Using empty transcription`);
                    resolve({ transcription: '', language: 'en' });
                }
            } else {
                console.log(`   ❌ Transcription failed`);
                resolve({ transcription: '', language: 'en' });
            }
        });
    });
}

async function addVideos() {
    console.log('➕ Adding new videos...\n');
    
    for (const videoInfo of NEW_VIDEOS_TO_ADD) {
        // Skip placeholders
        if (videoInfo.videoId.startsWith('__')) {
            console.log(`⏭️  Skipping placeholder ${videoInfo.section}\n`);
            continue;
        }
        
        console.log(`📹 Adding video ${videoInfo.videoId} to ${videoInfo.section}...`);
        
        // Check if exists
        const exists = await Video.findOne({ videoId: videoInfo.videoId });
        if (exists) {
            console.log(`   ⏭️  Already exists\n`);
            continue;
        }
        
        // Transcribe
        const transcription = await transcribeVideo(videoInfo.videoId);
        
        // Determine video type
        const videoType = videoInfo.section === 'client-features' ? 'client' : 'news';
        const category = videoType === 'client' ? 'industry' : 'business';
        const featured = videoInfo.section === 'breaking-news';
        
        // Create video
        const newVideo = new Video({
            title: videoInfo.title || 'New Video',
            category,
            videoType,
            section: videoInfo.section,
            source: 'youtube',
            videoId: videoInfo.videoId,
            thumbnail: `https://i.ytimg.com/vi/${videoInfo.videoId}/maxresdefault.jpg`,
            description: '',
            transcription: transcription.transcription || '',
            views: '0',
            date: new Date().toISOString().split('T')[0],
            duration: '0',
            featured,
            tags: [videoType]
        });
        
        await newVideo.save();
        console.log(`   ✅ Added successfully\n`);
    }
}

async function exportToSeed() {
    console.log('💾 Exporting to seed file...');
    
    const videos = await Video.find({}).lean();
    const seedPath = path.join(__dirname, '../data/seed-videos.json');
    
    await fs.writeFile(seedPath, JSON.stringify(videos, null, 2));
    
    const fileStats = await fs.stat(seedPath);
    const fileSizeKB = (fileStats.size / 1024).toFixed(1);
    
    console.log(`✅ Exported ${videos.length} videos (${fileSizeKB} KB)\n`);
    
    // Show distribution
    const dist = videos.reduce((acc, v) => {
        acc[v.section] = (acc[v.section] || 0) + 1;
        return acc;
    }, {});
    
    console.log('📊 Final Distribution:');
    Object.entries(dist).forEach(([section, count]) => {
        console.log(`   ${section}: ${count} videos`);
    });
    
    // Count transcriptions
    const transcribed = videos.filter(v => v.transcription && v.transcription.length > 0).length;
    console.log(`\n✅ ${transcribed}/${videos.length} videos have transcriptions`);
}

async function main() {
    try {
        console.log('🚀 Adding new videos to database...\n');
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
        
        // Load current seed
        await loadCurrentSeed();
        
        // Check if there are any real videos to add
        const realVideos = NEW_VIDEOS_TO_ADD.filter(v => !v.videoId.startsWith('__'));
        
        if (realVideos.length === 0) {
            console.log('⚠️  No videos to add. Please update NEW_VIDEOS_TO_ADD array with real YouTube video IDs.');
            console.log('\nHow to get video IDs:');
            console.log('1. Visit https://www.youtube.com/@bizz_short/shorts');
            console.log('2. Click on a video');
            console.log('3. Copy the ID from the URL (e.g., youtube.com/shorts/ABC123 → ABC123)');
            console.log('4. Update NEW_VIDEOS_TO_ADD in this script\n');
        } else {
            // Add new videos
            await addVideos();
            
            // Export
            await exportToSeed();
            
            console.log('\n✅ Complete! Ready to commit and deploy.');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected');
    }
}

main();
