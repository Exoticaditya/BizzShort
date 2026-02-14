const mongoose = require('mongoose');
const Video = require('../models/Video');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { spawn } = require('child_process');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizzshort';

// YouTube channel videos (manually curated latest from @bizz_short)
const NEW_VIDEOS = [
    // These are placeholder IDs - replace with actual latest videos from the channel
    { videoId: 'dQw4w9WgXcQ', title: 'New Client Feature Video' },
    { videoId: 'jNQXAC9IVRw', title: 'New Breaking News Video' },
    { videoId: 'y6120QOlsfU', title: 'New Latest Update 1' },
    { videoId: 'kJQP7kiw5Fk', title: 'New Latest Update 2' }
];

async function loadSeedData() {
    console.log('📂 Loading seed data...');
    const seedPath = path.join(__dirname, '../data/seed-videos.json');
    const seedData = JSON.parse(await fs.readFile(seedPath, 'utf8'));
    
    // Clear existing videos
    await Video.deleteMany({});
    console.log('🗑️  Cleared existing videos');
    
    // Insert seed data
    await Video.insertMany(seedData);
    console.log(`✅ Loaded ${seedData.length} videos from seed\n`);
}

async function moveSunEnergyVideo() {
    console.log('🔄 Moving Sun Energy video to client-features...');
    
    // Find the video by title pattern
    const video = await Video.findOne({
        title: { $regex: /sun energy|सोलर टेक्नोलॉजी/i }
    });
    
    if (video) {
        video.section = 'client-features';
        video.videoType = 'client';
        video.category = 'industry';
        await video.save();
        console.log(`✅ Moved video ${video.videoId} to client-features`);
        console.log(`   Title: ${video.title.substring(0, 60)}...\n`);
    } else {
        console.log('⚠️  Sun Energy video not found\n');
    }
}

async function fetchVideoDetails(videoId) {
    return new Promise((resolve) => {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Extract title from HTML (basic extraction)
                const titleMatch = data.match(/<title>(.*?)<\/title>/);
                const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : 'Untitled Video';
                resolve({
                    videoId,
                    title,
                    thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
                });
            });
        }).on('error', () => {
            resolve({
                videoId,
                title: 'Video Title',
                thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
            });
        });
    });
}

async function transcribeVideo(videoId) {
    return new Promise((resolve) => {
        console.log(`   🎤 Transcribing ${videoId}...`);
        
        const pythonPath = 'python';
        const scriptPath = path.join(__dirname, 'video_to_text.py');
        
        const process = spawn(pythonPath, [scriptPath, videoId]);
        let output = '';
        
        process.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                try {
                    const result = JSON.parse(output);
                    console.log(`   ✅ Transcribed (${result.language})`);
                    resolve(result);
                } catch (e) {
                    console.log(`   ⚠️  Using empty transcription`);
                    resolve({ transcription: '', language: 'en' });
                }
            } else {
                console.log(`   ⚠️  Transcription failed, using empty`);
                resolve({ transcription: '', language: 'en' });
            }
        });
    });
}

async function addNewVideos() {
    console.log('➕ Adding new videos...\n');
    
    // Define what we need
    const requirements = [
        { section: 'client-features', type: 'client', count: 1 },
        { section: 'breaking-news', type: 'news', count: 1 },
        { section: 'latest-updates', type: 'news', count: 2 }
    ];
    
    let videoIndex = 0;
    
    for (const req of requirements) {
        for (let i = 0; i < req.count; i++) {
            if (videoIndex >= NEW_VIDEOS.length) {
                console.log('⚠️  No more new videos to add');
                break;
            }
            
            const videoInfo = NEW_VIDEOS[videoIndex++];
            
            console.log(`📹 Processing video ${videoInfo.videoId} for ${req.section}...`);
            
            // Check if already exists
            const exists = await Video.findOne({ videoId: videoInfo.videoId });
            if (exists) {
                console.log(`   ⏭️  Already exists, skipping\n`);
                continue;
            }
            
            // Get details
            const details = await fetchVideoDetails(videoInfo.videoId);
            
            // Transcribe
            const transcription = await transcribeVideo(videoInfo.videoId);
            
            // Create video
            const newVideo = new Video({
                title: details.title,
                category: req.type === 'client' ? 'industry' : 'business',
                videoType: req.type,
                section: req.section,
                source: 'youtube',
                videoId: videoInfo.videoId,
                thumbnail: details.thumbnail,
                description: '',
                transcription: transcription.transcription || '',
                views: '0',
                date: new Date().toISOString().split('T')[0],
                duration: '0',
                featured: req.section === 'breaking-news',
                tags: [req.type]
            });
            
            await newVideo.save();
            console.log(`   ✅ Added to ${req.section}\n`);
        }
    }
}

async function exportToSeed() {
    console.log('💾 Exporting to seed file...');
    
    const videos = await Video.find({}).lean();
    const seedPath = path.join(__dirname, '../data/seed-videos.json');
    
    await fs.writeFile(seedPath, JSON.stringify(videos, null, 2));
    
    console.log(`✅ Exported ${videos.length} videos\n`);
    
    // Show distribution
    const dist = videos.reduce((acc, v) => {
        acc[v.section] = (acc[v.section] || 0) + 1;
        return acc;
    }, {});
    
    console.log('📊 Final Distribution:');
    Object.entries(dist).forEach(([section, count]) => {
        console.log(`   ${section}: ${count} videos`);
    });
}

async function main() {
    try {
        console.log('🚀 Starting complete reorganization...\n');
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
        
        // Load seed data first
        await loadSeedData();
        
        // Move Sun Energy video
        await moveSunEnergyVideo();
        
        // Note about manual video IDs
        console.log('⚠️  NOTE: Please update NEW_VIDEOS array with actual latest video IDs from @bizz_short channel');
        console.log('   For now, skipping new video addition. Uncomment addNewVideos() when ready.\n');
        
        // Uncomment when you have real video IDs:
        // await addNewVideos();
        
        // Export the reorganized data
        await exportToSeed();
        
        console.log('\n✅ Complete! Ready to deploy.');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected');
    }
}

main();
