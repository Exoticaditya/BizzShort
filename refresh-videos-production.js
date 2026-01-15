// Refresh Videos Script - PRODUCTION VERSION
// Clears and populates videos to PRODUCTION database on Render
// Uses YouTube Data API v3 to fetch videos from @bizz_short channel

const axios = require('axios');

// Production API Configuration
const API_BASE_URL = 'https://bizzshort.onrender.com/api';
const YOUTUBE_API_KEY = 'AIzaSyAN1Rovlvni8gGdVoVg9Z_Mhz5jyL6KgO8';
const CHANNEL_USERNAME = '@bizz_short';

// Admin credentials (you'll need to login first)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

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

// Login to get admin token
async function loginAsAdmin() {
    try {
        console.log('🔐 Logging in as admin...');
        const response = await axios.post(`${API_BASE_URL}/admin/login`, ADMIN_CREDENTIALS);
        
        if (response.data.success) {
            console.log('✅ Admin login successful');
            return response.data.sessionId || response.data.token;
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('❌ Login error:', error.response?.data || error.message);
        throw error;
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

// Delete all videos via API
async function deleteAllVideos(token) {
    try {
        console.log('🗑️  Fetching all existing videos...');
        
        // Get all videos
        const response = await axios.get(`${API_BASE_URL}/videos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const videos = response.data.data || response.data || [];
        console.log(`Found ${videos.length} videos to delete`);
        
        // Delete each video
        let deleted = 0;
        for (const video of videos) {
            try {
                await axios.delete(`${API_BASE_URL}/videos/${video._id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                deleted++;
                process.stdout.write(`\rDeleting videos... ${deleted}/${videos.length}`);
            } catch (err) {
                console.error(`\nError deleting video ${video._id}:`, err.message);
            }
        }
        
        console.log(`\n✅ Deleted ${deleted} videos\n`);
        return deleted;
    } catch (error) {
        console.error('❌ Error deleting videos:', error.response?.data || error.message);
        throw error;
    }
}

// Add videos via API
async function addVideos(videos, token) {
    try {
        console.log('💾 Adding videos to production database...');
        
        let added = 0;
        for (const video of videos) {
            try {
                await axios.post(`${API_BASE_URL}/videos`, video, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                added++;
                process.stdout.write(`\rAdding videos... ${added}/${videos.length}`);
            } catch (err) {
                console.error(`\nError adding video: ${err.response?.data?.error || err.message}`);
            }
        }
        
        console.log(`\n✅ Successfully added ${added} videos\n`);
        return added;
    } catch (error) {
        console.error('❌ Error adding videos:', error.message);
        throw error;
    }
}

// Main function
async function refreshProductionVideos() {
    try {
        console.log('🚀 Starting PRODUCTION video refresh...\n');

        // Step 1: Login
        const token = await loginAsAdmin();

        // Step 2: Fetch channel ID
        const channelId = await getChannelId();

        // Step 3: Fetch videos from YouTube
        const videos = await fetchYouTubeVideos(channelId, 50);

        // Step 4: Delete all existing videos
        await deleteAllVideos(token);

        // Step 5: Add new videos
        const added = await addVideos(videos, token);

        // Step 6: Display summary
        const categoryCounts = {};
        videos.forEach(v => {
            categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
        });

        console.log('📊 SUMMARY:');
        console.log('─'.repeat(50));
        Object.entries(categoryCounts).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} videos`);
        });
        console.log('─'.repeat(50));
        console.log(`   TOTAL: ${added} videos\n`);

        console.log('✅ Production database updated successfully!');
        console.log('🌐 Check: https://bizzshort.com');

    } catch (error) {
        console.error('❌ Error in refresh process:', error);
        process.exit(1);
    }
}

// Run the script
refreshProductionVideos();
