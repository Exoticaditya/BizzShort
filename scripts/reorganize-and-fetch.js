const mongoose = require('mongoose');
const Video = require('../models/Video');
const Parser = require('rss-parser');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizzshort';
const RSS_FEED = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCfsq2kZFfr1wdzfJG5OOUMw';

async function moveVideoToClientFeatures() {
    console.log('\n📦 Moving Sun Energy video to client-features...');
    
    const result = await Video.updateOne(
        { videoId: '24zcyAjnXBc' },
        { 
            $set: { 
                section: 'client-features',
                videoType: 'client',
                category: 'industry'
            } 
        }
    );
    
    if (result.modifiedCount > 0) {
        console.log('✅ Successfully moved Sun Energy video to client-features');
    } else {
        console.log('⚠️ Video not found or already in client-features');
    }
}

async function fetchNewVideos() {
    console.log('\n🔍 Fetching latest videos from YouTube RSS...');
    const parser = new Parser();
    const feed = await parser.parseURL(RSS_FEED);
    
    // Get existing video IDs
    const existingVideos = await Video.find({}, 'videoId');
    const existingIds = new Set(existingVideos.map(v => v.videoId));
    
    // Filter new videos
    const newVideos = feed.items
        .filter(item => {
            const videoId = item.link.split('v=')[1];
            return !existingIds.has(videoId);
        })
        .slice(0, 10); // Get up to 10 new videos
    
    console.log(`📊 Found ${newVideos.length} new videos`);
    
    return newVideos.map(item => ({
        videoId: item.link.split('v=')[1],
        title: item.title,
        thumbnail: `https://i.ytimg.com/vi/${item.link.split('v=')[1]}/maxresdefault.jpg`,
        pubDate: item.pubDate
    }));
}

async function transcribeVideo(videoId) {
    return new Promise((resolve, reject) => {
        console.log(`🎤 Transcribing video ${videoId}...`);
        
        const pythonPath = 'python';
        const scriptPath = path.join(__dirname, 'video_to_text.py');
        
        const process = spawn(pythonPath, [scriptPath, videoId]);
        let output = '';
        let errorOutput = '';
        
        process.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        process.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                try {
                    const result = JSON.parse(output);
                    resolve(result);
                } catch (e) {
                    console.log('⚠️ Could not parse transcription output, using raw text');
                    resolve({ transcription: output.trim(), language: 'en' });
                }
            } else {
                console.log(`⚠️ Transcription failed for ${videoId}:`, errorOutput);
                resolve({ transcription: '', language: 'en' });
            }
        });
    });
}

async function assignVideoCategory(video, index, targetSections) {
    // Assign based on target requirements
    if (targetSections.clientFeatures > 0) {
        targetSections.clientFeatures--;
        return {
            section: 'client-features',
            videoType: 'client',
            category: 'industry'
        };
    } else if (targetSections.breakingNews > 0) {
        targetSections.breakingNews--;
        return {
            section: 'breaking-news',
            videoType: 'news',
            category: 'business',
            featured: true
        };
    } else if (targetSections.latestUpdates > 0) {
        targetSections.latestUpdates--;
        return {
            section: 'latest-updates',
            videoType: 'news',
            category: 'business'
        };
    } else {
        // Default to latest updates
        return {
            section: 'latest-updates',
            videoType: 'news',
            category: 'business'
        };
    }
}

async function addNewVideos(newVideos) {
    console.log('\n➕ Adding and transcribing new videos...');
    
    const targetSections = {
        clientFeatures: 1,  // 1 for client features
        breakingNews: 1,    // 1 for breaking news
        latestUpdates: 2    // 2 for latest updates
    };
    
    const videosToAdd = newVideos.slice(0, 4); // Only process 4 videos
    
    for (let i = 0; i < videosToAdd.length; i++) {
        const video = videosToAdd[i];
        
        try {
            // Transcribe video
            const transcriptionResult = await transcribeVideo(video.videoId);
            
            // Assign category
            const assignment = await assignVideoCategory(video, i, targetSections);
            
            // Create video document
            const newVideo = new Video({
                title: video.title,
                category: assignment.category,
                videoType: assignment.videoType,
                section: assignment.section,
                source: 'youtube',
                videoId: video.videoId,
                thumbnail: video.thumbnail,
                description: '',
                transcription: transcriptionResult.transcription || '',
                views: '0',
                date: new Date(video.pubDate).toISOString().split('T')[0],
                duration: '0',
                featured: assignment.featured || false,
                tags: [assignment.videoType]
            });
            
            await newVideo.save();
            console.log(`✅ Added ${video.videoId} to ${assignment.section} (${transcriptionResult.language})`);
            
        } catch (error) {
            console.log(`❌ Failed to add ${video.videoId}:`, error.message);
        }
    }
}

async function exportToSeed() {
    console.log('\n💾 Exporting to seed file...');
    
    const videos = await Video.find({}).lean();
    const seedPath = path.join(__dirname, '../data/seed-videos.json');
    
    await fs.writeFile(seedPath, JSON.stringify(videos, null, 2));
    
    console.log(`✅ Exported ${videos.length} videos to seed-videos.json`);
    
    // Show distribution
    const distribution = videos.reduce((acc, v) => {
        acc[v.section] = (acc[v.section] || 0) + 1;
        return acc;
    }, {});
    
    console.log('\n📊 Video Distribution:');
    Object.entries(distribution).forEach(([section, count]) => {
        console.log(`   ${section}: ${count} videos`);
    });
}

async function main() {
    try {
        console.log('🚀 Starting video reorganization and fetch...\n');
        
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        // Step 1: Move Sun Energy video to client-features
        await moveVideoToClientFeatures();
        
        // Step 2: Fetch new videos
        const newVideos = await fetchNewVideos();
        
        if (newVideos.length === 0) {
            console.log('⚠️ No new videos found. Skipping addition step.');
        } else {
            // Step 3: Add and transcribe new videos
            await addNewVideos(newVideos);
        }
        
        // Step 4: Export to seed file
        await exportToSeed();
        
        console.log('\n✅ All operations completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

main();
