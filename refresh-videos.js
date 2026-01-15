// Refresh Videos Script - Clear old data and populate with real YouTube videos
// Uses YouTube Data API v3 to fetch videos from @bizz_short channel

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// MongoDB Connection - Use existing database connection config
const connectDB = require('./config/db');
const Video = require('./models/Video');

// YouTube API Configuration
const YOUTUBE_API_KEY = 'AIzaSyAN1Rovlvni8gGdVoVg9Z_Mhz5jyL6KgO8';
const CHANNEL_USERNAME = '@bizz_short';

// Category mapping based on video titles/descriptions
function categorizeVideo(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.match(/market|stock|trading|nifty|sensex|share|equity/i)) {
        return 'markets';
    } else if (text.match(/tech|technology|digital|software|ai|startup/i)) {
        return 'technology';
    } else if (text.match(/industry|manufacturing|sector|wire|cable/i)) {
        return 'industry';
    } else {
        return 'business';
    }
}

// Fetch channel ID from username
async function getChannelId() {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: CHANNEL_USERNAME,
                type: 'channel',
                key: YOUTUBE_API_KEY
            }
        });

        if (response.data.items && response.data.items.length > 0) {
            const channelId = response.data.items[0].snippet.channelId;
            console.log(`✅ Found Channel ID: ${channelId}`);
            return channelId;
        } else {
            throw new Error('Channel not found');
        }
    } catch (error) {
        console.error('❌ Error fetching channel ID:', error.message);
        throw error;
    }
}

// Fetch videos from YouTube channel
async function fetchYouTubeVideos(channelId, maxResults = 50) {
    try {
        console.log(`📺 Fetching up to ${maxResults} videos from channel...`);
        
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                channelId: channelId,
                order: 'date',
                type: 'video',
                maxResults: maxResults,
                key: YOUTUBE_API_KEY
            }
        });

        const videos = response.data.items.map(item => ({
            youtubeId: item.id.videoId,
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            excerpt: item.snippet.description.substring(0, 150) + '...',
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
            category: categorizeVideo(item.snippet.title, item.snippet.description),
            source: 'youtube',
            published: true,
            views: 0,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            position: 'latest-updates'
        }));

        console.log(`✅ Fetched ${videos.length} videos`);
        return videos;
    } catch (error) {
        console.error('❌ Error fetching YouTube videos:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
        throw error;
    }
}

// Main function
async function refreshVideos() {
    try {
        console.log('🚀 Starting video refresh process...\n');

        // Connect to MongoDB
        await connectDB();

        // Step 1: Delete all existing videos
        console.log('🗑️  Deleting all existing videos...');
        const deleteResult = await Video.deleteMany({});
        console.log(`✅ Deleted ${deleteResult.deletedCount} old videos\n`);

        // Step 2: Fetch channel ID
        const channelId = await getChannelId();

        // Step 3: Fetch videos from YouTube
        const videos = await fetchYouTubeVideos(channelId, 50);

        // Step 4: Insert videos into database
        console.log('💾 Inserting videos into database...');
        const insertResult = await Video.insertMany(videos);
        console.log(`✅ Successfully inserted ${insertResult.length} videos\n`);

        // Step 5: Display summary
        console.log('📊 SUMMARY:');
        console.log('─'.repeat(50));
        
        const categoryCounts = await Video.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        categoryCounts.forEach(cat => {
            console.log(`   ${cat._id}: ${cat.count} videos`);
        });
        console.log('─'.repeat(50));
        console.log(`   TOTAL: ${insertResult.length} videos\n`);

        console.log('✅ Video refresh completed successfully!');
        
        // Close connection
        await mongoose.connection.close();
        console.log('📴 Database connection closed');

    } catch (error) {
        console.error('❌ Error in refresh process:', error);
        process.exit(1);
    }
}

// Run the script
refreshVideos();
