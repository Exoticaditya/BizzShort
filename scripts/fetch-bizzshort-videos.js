/**
 * BizzShort YouTube Video Fetcher
 * 
 * Fetches the latest 30 videos from @bizz_short YouTube channel
 * Uses RSS feed (no API key required) and saves to MongoDB
 * 
 * Usage: node scripts/fetch-bizzshort-videos.js
 */

const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

// Configuration
const YOUTUBE_HANDLE = '@bizz_short';
const MAX_VIDEOS = 30;

// Category keywords for automatic categorization
const CATEGORY_KEYWORDS = {
    'Markets': ['stock', 'market', 'sensex', 'nifty', 'trading', 'shares', 'investment', 'bse', 'nse', 'index'],
    'Startups': ['startup', 'entrepreneur', 'founder', 'funding', 'unicorn', 'seed', 'series'],
    'Economy': ['gdp', 'economy', 'economic', 'inflation', 'growth', 'recession', 'fiscal', 'budget'],
    'Energy': ['oil', 'energy', 'power', 'renewable', 'solar', 'electric', 'petrol', 'diesel'],
    'Cryptocurrency': ['crypto', 'bitcoin', 'blockchain', 'btc', 'ethereum', 'web3'],
    'Banking': ['bank', 'finance', 'loan', 'credit', 'rbi', 'financial', 'interest rate'],
    'Technology': ['tech', 'ai', 'software', 'it', 'digital', 'app', 'technology'],
    'Real Estate': ['real estate', 'property', 'housing', 'construction', 'realty']
};

function categorize(title, description = '') {
    const text = (title + ' ' + description).toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(k => text.includes(k))) return category;
    }
    return 'Latest Updates';
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Step 1: Get channel ID from handle
async function getChannelId(handle) {
    return new Promise((resolve) => {
        const h = handle.replace('@', '');
        console.log(`🔍 Resolving channel ID for @${h}...`);

        https.get(`https://www.youtube.com/@${h}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Try multiple patterns to find channel ID
                let match = data.match(/"channelId":"(UC[\w-]+)"/);
                if (match) {
                    console.log(`✅ Found channel ID: ${match[1]}`);
                    resolve(match[1]);
                    return;
                }

                match = data.match(/"externalId":"(UC[\w-]+)"/);
                if (match) {
                    console.log(`✅ Found channel ID: ${match[1]}`);
                    resolve(match[1]);
                    return;
                }

                match = data.match(/channel\/(UC[\w-]+)/);
                if (match) {
                    console.log(`✅ Found channel ID: ${match[1]}`);
                    resolve(match[1]);
                    return;
                }

                console.log('❌ Could not find channel ID');
                resolve(null);
            });
        }).on('error', () => resolve(null));
    });
}

// Step 2: Fetch RSS feed
async function fetchRSS(channelId) {
    return new Promise((resolve) => {
        const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        console.log(`📡 Fetching RSS feed...`);

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    console.log(`❌ RSS fetch failed: ${res.statusCode}`);
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

// Step 3: Parse RSS XML
function parseRSS(xml) {
    const videos = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null && videos.length < MAX_VIDEOS) {
        const entry = match[1];

        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
        const descMatch = entry.match(/<media:description>([^<]*)<\/media:description>/);

        if (titleMatch && videoIdMatch) {
            const videoId = videoIdMatch[1];
            const title = titleMatch[1];
            const description = descMatch ? descMatch[1] : '';
            const published = publishedMatch ? publishedMatch[1] : new Date().toISOString();

            videos.push({
                title: title,
                category: categorize(title, description),
                source: 'youtube',
                videoId: videoId,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                description: description.substring(0, 200),
                views: '0',
                date: formatDate(published),
                duration: '0:00',
                featured: videos.length === 0,
                tags: [],
                createdAt: new Date(published),
                updatedAt: new Date()
            });
        }
    }

    return videos;
}

// Step 4: Connect to MongoDB and save
async function saveToMongoDB(videos) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.log('⚠️  MONGO_URI not set in .env, skipping database save');
        return false;
    }

    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // Define Video schema if needed
        let Video;
        try {
            Video = mongoose.model('Video');
        } catch {
            const VideoSchema = new mongoose.Schema({
                title: String,
                category: String,
                source: String,
                videoId: { type: String, required: true },
                thumbnail: String,
                description: String,
                views: String,
                date: String,
                duration: String,
                featured: Boolean,
                tags: [String],
                createdAt: Date,
                updatedAt: Date
            });
            Video = mongoose.model('Video', VideoSchema);
        }

        let added = 0, updated = 0;

        for (const video of videos) {
            const existing = await Video.findOne({ videoId: video.videoId, source: 'youtube' });

            if (existing) {
                await Video.updateOne(
                    { _id: existing._id },
                    { $set: { updatedAt: new Date() } }
                );
                updated++;
            } else {
                await Video.create(video);
                added++;
            }
        }

        console.log(`\n💾 Database Results:`);
        console.log(`   ✅ New videos added: ${added}`);
        console.log(`   🔄 Existing videos: ${updated}`);

        return true;
    } catch (error) {
        console.error('❌ MongoDB error:', error.message);
        return false;
    }
}

// Main execution
async function main() {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('   BizzShort YouTube Video Fetcher');
    console.log(`   Target: ${YOUTUBE_HANDLE} (latest ${MAX_VIDEOS} videos)`);
    console.log('═══════════════════════════════════════════════════════\n');

    // Get channel ID
    const channelId = await getChannelId(YOUTUBE_HANDLE);
    if (!channelId) {
        console.log('\n❌ Failed to get channel ID. Please check if @bizz_short exists.');
        process.exit(1);
    }

    // Fetch RSS
    const rss = await fetchRSS(channelId);
    if (!rss) {
        console.log('\n❌ Failed to fetch RSS feed.');
        process.exit(1);
    }

    // Parse videos
    const videos = parseRSS(rss);
    console.log(`\n📺 Found ${videos.length} videos from @bizz_short\n`);

    if (videos.length === 0) {
        console.log('No videos found. Channel may have no public videos.');
        process.exit(0);
    }

    // Show preview
    console.log('📋 Preview (first 5 videos):');
    videos.slice(0, 5).forEach((v, i) => {
        console.log(`   ${i + 1}. [${v.category}] ${v.title.substring(0, 50)}...`);
    });

    // Save to MongoDB
    await saveToMongoDB(videos);

    // Also save to JSON file for backup/debugging
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '..', 'assets', 'js', 'video-data.json');
    fs.writeFileSync(outputPath, JSON.stringify({
        lastSync: new Date().toISOString(),
        channelId: channelId,
        videos: videos
    }, null, 2));
    console.log(`\n📁 Also saved to: assets/js/video-data.json`);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('   ✅ Video fetch complete!');
    console.log('═══════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
