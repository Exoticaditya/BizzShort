/**
 * BizzShort Daily Video Sync Utility
 * 
 * Automatically fetches new videos from @bizz_short YouTube and Instagram
 * Runs daily at 8:00 AM IST and categorizes videos automatically
 * 
 * Categories:
 * - Breaking News (featured/latest)
 * - Latest Updates (recent YouTube videos)
 * - Client Interviews (Instagram reels)
 * - Markets, Startups, Economy, etc. (by keywords)
 */

const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

// ============ CONFIGURATION ============
const CONFIG = {
    // YouTube API
    YOUTUBE_API_KEY: process.env.YT_API_KEY || '',
    YOUTUBE_CHANNEL_ID: process.env.YT_CHANNEL_ID || 'UCYourChannelId', // @bizz_short channel ID
    
    // Instagram (using public embed API - no auth needed for public reels)
    INSTAGRAM_USERNAME: 'bizz_short',
    
    // Sync settings
    MAX_YOUTUBE_VIDEOS: 20,
    MAX_INSTAGRAM_REELS: 10,
    
    // MongoDB
    MONGO_URI: process.env.MONGO_URI || ''
};

// Category mapping based on keywords
const CATEGORY_KEYWORDS = {
    'Markets': ['stock', 'market', 'sensex', 'nifty', 'trading', 'shares', 'investment', 'bse', 'nse'],
    'Startups': ['startup', 'entrepreneur', 'founder', 'funding', 'unicorn', 'seed', 'series'],
    'Economy': ['gdp', 'economy', 'economic', 'inflation', 'growth', 'recession', 'fiscal'],
    'Energy': ['oil', 'energy', 'power', 'renewable', 'solar', 'electric', 'petrol', 'diesel'],
    'Cryptocurrency': ['crypto', 'bitcoin', 'blockchain', 'btc', 'ethereum', 'web3', 'nft'],
    'Manufacturing': ['manufacturing', 'production', 'factory', 'industry', 'make in india'],
    'E-commerce': ['ecommerce', 'amazon', 'flipkart', 'shopping', 'retail', 'online store'],
    'Healthcare': ['health', 'medical', 'pharma', 'hospital', 'medicine', 'healthcare'],
    'Banking': ['bank', 'finance', 'loan', 'credit', 'rbi', 'financial', 'interest rate'],
    'Technology': ['tech', 'ai', 'software', 'it', 'digital', 'app', 'technology'],
    'Real Estate': ['real estate', 'property', 'housing', 'construction', 'realty']
};

// Video Schema (inline for standalone use)
let Video;

// ============ UTILITY FUNCTIONS ============

function categorizeVideo(title, description = '') {
    const text = (title + ' ' + description).toLowerCase();
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    
    return 'Latest Updates'; // Default category
}

function formatDuration(isoDuration) {
    if (!isoDuration) return '0:00';
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatViews(count) {
    const num = parseInt(count) || 0;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
}

// ============ YOUTUBE FETCHER ============

async function fetchYouTubeVideos() {
    if (!CONFIG.YOUTUBE_API_KEY) {
        console.log('⚠️  YouTube API key not configured, skipping YouTube sync');
        return [];
    }
    
    return new Promise((resolve, reject) => {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.YOUTUBE_API_KEY}&channelId=${CONFIG.YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=${CONFIG.MAX_YOUTUBE_VIDEOS}&type=video`;
        
        https.get(searchUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error) {
                        console.error('YouTube API Error:', response.error.message);
                        resolve([]);
                        return;
                    }
                    
                    if (!response.items || response.items.length === 0) {
                        console.log('No YouTube videos found');
                        resolve([]);
                        return;
                    }
                    
                    // Get video IDs for detailed info
                    const videoIds = response.items.map(v => v.id.videoId);
                    const details = await fetchYouTubeVideoDetails(videoIds);
                    
                    const videos = details.map((video, index) => ({
                        title: video.snippet.title,
                        category: categorizeVideo(video.snippet.title, video.snippet.description),
                        source: 'youtube',
                        videoId: video.id,
                        thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
                        description: video.snippet.description.substring(0, 200),
                        views: formatViews(video.statistics?.viewCount || 0),
                        date: formatDate(video.snippet.publishedAt),
                        relativeTime: getRelativeTime(video.snippet.publishedAt),
                        duration: formatDuration(video.contentDetails?.duration),
                        featured: index === 0,
                        publishedAt: new Date(video.snippet.publishedAt),
                        tags: video.snippet.tags || []
                    }));
                    
                    console.log(`✅ Fetched ${videos.length} YouTube videos`);
                    resolve(videos);
                } catch (error) {
                    console.error('YouTube parse error:', error.message);
                    resolve([]);
                }
            });
        }).on('error', error => {
            console.error('YouTube fetch error:', error.message);
            resolve([]);
        });
    });
}

async function fetchYouTubeVideoDetails(videoIds) {
    return new Promise((resolve, reject) => {
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${CONFIG.YOUTUBE_API_KEY}&id=${videoIds.join(',')}&part=snippet,contentDetails,statistics`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response.items || []);
                } catch (error) {
                    resolve([]);
                }
            });
        }).on('error', () => resolve([]));
    });
}

// ============ INSTAGRAM FETCHER ============

// Known BizzShort Instagram Reels (manually curated + can be updated)
const KNOWN_INSTAGRAM_REELS = [
    { id: 'DSRtUxpisHf', title: 'Client Success Story - Business Growth' },
    { id: 'DSRmTi7FA-g', title: 'Client Testimonial - Partnership Success' },
    { id: 'DSRfWfMjQy_', title: 'Industry Expert - Market Insights' },
    { id: 'DSRYU-bD_wU', title: 'CEO Spotlight - Leadership Vision' },
    { id: 'DTNW7RUgLeD', title: 'Startup Founder - Innovation Journey' },
    { id: 'DTHxue9lEFt', title: 'Business Leader - Strategic Growth' }
];

async function fetchInstagramReels() {
    // Instagram doesn't have a public API for fetching reels
    // We use the manually curated list + any new reels added to database
    
    const reels = KNOWN_INSTAGRAM_REELS.map((reel, index) => ({
        title: reel.title,
        category: 'Client Interviews',
        source: 'instagram',
        videoId: reel.id,
        thumbnail: null, // Instagram doesn't allow thumbnail hotlinking
        description: `Watch this exclusive client interview on BizzShort Instagram`,
        views: 'N/A',
        date: formatDate(new Date()),
        relativeTime: 'Latest',
        duration: '0:60',
        featured: index === 0,
        publishedAt: new Date(),
        tags: ['interview', 'client', 'business']
    }));
    
    console.log(`✅ Loaded ${reels.length} Instagram reels`);
    return reels;
}

// ============ DATABASE SYNC ============

async function connectDatabase() {
    if (!CONFIG.MONGO_URI) {
        console.log('⚠️  MongoDB URI not configured');
        return false;
    }
    
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(CONFIG.MONGO_URI);
            console.log('✅ Connected to MongoDB');
        }
        
        // Load Video model
        try {
            Video = mongoose.model('Video');
        } catch {
            Video = require('../models/Video');
        }
        
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        return false;
    }
}

async function syncVideosToDatabase(videos) {
    if (!Video) {
        console.log('⚠️  Video model not available, skipping database sync');
        return { added: 0, updated: 0 };
    }
    
    let added = 0;
    let updated = 0;
    
    for (const video of videos) {
        try {
            const existing = await Video.findOne({ 
                source: video.source, 
                videoId: video.videoId 
            });
            
            if (existing) {
                // Update existing video (views, etc.)
                await Video.updateOne(
                    { _id: existing._id },
                    { 
                        $set: { 
                            views: video.views,
                            updatedAt: new Date()
                        }
                    }
                );
                updated++;
            } else {
                // Add new video
                await Video.create({
                    title: video.title,
                    category: video.category,
                    source: video.source,
                    videoId: video.videoId,
                    thumbnail: video.thumbnail,
                    description: video.description,
                    views: video.views,
                    date: video.date,
                    duration: video.duration,
                    featured: video.featured,
                    tags: video.tags,
                    createdAt: video.publishedAt || new Date(),
                    updatedAt: new Date()
                });
                added++;
            }
        } catch (error) {
            console.error(`Error syncing video ${video.videoId}:`, error.message);
        }
    }
    
    return { added, updated };
}

// ============ MAIN SYNC FUNCTION ============

async function runDailySync() {
    const startTime = Date.now();
    console.log('\n🔄 ═══════════════════════════════════════════════════');
    console.log(`   BizzShort Daily Video Sync`);
    console.log(`   Started: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Connect to database
    const dbConnected = await connectDatabase();
    
    // Fetch videos from all sources
    const [youtubeVideos, instagramReels] = await Promise.all([
        fetchYouTubeVideos(),
        fetchInstagramReels()
    ]);
    
    const allVideos = [...youtubeVideos, ...instagramReels];
    console.log(`\n📊 Total videos fetched: ${allVideos.length}`);
    
    // Sync to database if connected
    let syncResult = { added: 0, updated: 0 };
    if (dbConnected) {
        syncResult = await syncVideosToDatabase(allVideos);
        console.log(`\n💾 Database Sync Results:`);
        console.log(`   New videos added: ${syncResult.added}`);
        console.log(`   Existing videos updated: ${syncResult.updated}`);
    }
    
    // Generate frontend data file
    await generateFrontendData(allVideos);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n✅ ═══════════════════════════════════════════════════');
    console.log(`   Sync completed in ${duration}s`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    return {
        success: true,
        youtube: youtubeVideos.length,
        instagram: instagramReels.length,
        dbAdded: syncResult.added,
        dbUpdated: syncResult.updated,
        duration: parseFloat(duration)
    };
}

async function generateFrontendData(videos) {
    const fs = require('fs');
    const path = require('path');
    
    // Organize videos by category
    const categorized = {
        breakingNews: videos.filter(v => v.featured && v.source === 'youtube').slice(0, 1),
        latestUpdates: videos.filter(v => v.source === 'youtube').slice(0, 12),
        clientInterviews: videos.filter(v => v.source === 'instagram').slice(0, 6),
        byCategory: {}
    };
    
    // Group by category
    for (const video of videos) {
        if (!categorized.byCategory[video.category]) {
            categorized.byCategory[video.category] = [];
        }
        categorized.byCategory[video.category].push(video);
    }
    
    // Generate JavaScript data file
    const jsContent = `/**
 * BizzShort Video Data
 * Auto-generated by daily-video-sync.js
 * Last updated: ${new Date().toISOString()}
 */

const BizzShortVideos = {
    lastSync: "${new Date().toISOString()}",
    
    // Featured breaking news video
    breakingNews: ${JSON.stringify(categorized.breakingNews, null, 8)},
    
    // Latest YouTube updates
    latestUpdates: ${JSON.stringify(categorized.latestUpdates, null, 8)},
    
    // Instagram client interviews
    clientInterviews: ${JSON.stringify(categorized.clientInterviews, null, 8)},
    
    // Videos by category
    categories: ${JSON.stringify(categorized.byCategory, null, 8)}
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BizzShortVideos;
}
`;
    
    const outputPath = path.join(__dirname, '..', 'assets', 'js', 'video-data.js');
    fs.writeFileSync(outputPath, jsContent);
    console.log(`\n📁 Frontend data saved to: assets/js/video-data.js`);
}

// ============ SCHEDULER ============

function scheduleDaily8AM() {
    const now = new Date();
    const target = new Date();
    
    // Set to 8:00 AM IST (UTC+5:30)
    target.setUTCHours(2, 30, 0, 0); // 8:00 AM IST = 2:30 AM UTC
    
    // If already past 8 AM today, schedule for tomorrow
    if (now > target) {
        target.setDate(target.getDate() + 1);
    }
    
    const msUntilTarget = target - now;
    const hoursUntil = (msUntilTarget / (1000 * 60 * 60)).toFixed(2);
    
    console.log(`⏰ Next sync scheduled for: ${target.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.log(`   (in ${hoursUntil} hours)\n`);
    
    setTimeout(async () => {
        await runDailySync();
        // Schedule next day
        scheduleDaily8AM();
    }, msUntilTarget);
}

// ============ API ENDPOINT HANDLER ============

async function getVideosForAPI(category = null, source = null, limit = 20) {
    const connected = await connectDatabase();
    
    if (connected && Video) {
        const query = {};
        if (category) query.category = category;
        if (source) query.source = source;
        
        const videos = await Video.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);
        
        return videos;
    }
    
    // Fallback to file-based data
    try {
        const videoData = require('../assets/js/video-data.js');
        let videos = [...(videoData.latestUpdates || []), ...(videoData.clientInterviews || [])];
        
        if (category) {
            videos = videos.filter(v => v.category === category);
        }
        if (source) {
            videos = videos.filter(v => v.source === source);
        }
        
        return videos.slice(0, limit);
    } catch {
        return [];
    }
}

// ============ EXPORTS ============

module.exports = {
    runDailySync,
    scheduleDaily8AM,
    fetchYouTubeVideos,
    fetchInstagramReels,
    getVideosForAPI,
    categorizeVideo,
    CATEGORY_KEYWORDS,
    KNOWN_INSTAGRAM_REELS
};

// ============ CLI EXECUTION ============

if (require.main === module) {
    // Run immediately if executed directly
    console.log('🚀 Running manual sync...\n');
    runDailySync().then(result => {
        console.log('Result:', result);
        process.exit(0);
    }).catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}
