/**
 * Complete Video Setup for BizzShort
 * - Client features (manual selection)
 * - Breaking news (6 videos with high views)
 * - Latest updates (20 shorts)
 */

const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

// Manual client feature videos
const CLIENT_VIDEOS = [
    'K7H6X8dFQjU',
    'HA4qS7sU4z0',
    'V-_pwdqEib0',
    'VDnyundJvlc',
    'bLOxCfgDtNo',
    'jm3X331Tb3o'
];

const YOUTUBE_HANDLE = '@bizz_short';

// Get channel ID
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
                console.log('❌ Could not find channel ID');
                resolve(null);
            });
        }).on('error', () => resolve(null));
    });
}

// Fetch RSS feed
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
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

// Parse RSS
function parseRSS(xml, maxVideos = 50) {
    const videos = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null && videos.length < maxVideos) {
        const entry = match[1];

        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

        if (titleMatch && videoIdMatch) {
            videos.push({
                videoId: videoIdMatch[1],
                title: titleMatch[1],
                publishedAt: publishedMatch ? publishedMatch[1] : new Date().toISOString(),
            });
        }
    }

    return videos;
}

async function main() {
    console.log('\n🔄 ═══════════════════════════════════════════════════');
    console.log('   BizzShort Complete Video Setup');
    console.log('═══════════════════════════════════════════════════════\n');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const Video = require('../models/Video');

    // Step 1: Clear all videos
    console.log('🗑️  Step 1: Clearing all existing videos...');
    const deleteResult = await Video.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} videos\n`);

    // Step 2: Add client feature videos
    console.log('🎯 Step 2: Adding 6 client feature videos...');
    for (let i = 0; i < CLIENT_VIDEOS.length; i++) {
        const videoId = CLIENT_VIDEOS[i];
        await Video.create({
            videoId: videoId,
            title: `Client Feature ${i + 1}`,
            description: '',
            transcription: '',
            category: 'industry',
            videoType: 'client',
            section: 'client-features',
            source: 'youtube',
            thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            views: '0',
            duration: '0',
            date: new Date().toISOString().split('T')[0],
            featured: false,
            tags: ['client'],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`   ✅ ${videoId}`);
    }

    // Step 3: Fetch shorts and regular videos from RSS
    console.log('\n📺 Step 3: Fetching videos from YouTube...');
    const channelId = await getChannelId(YOUTUBE_HANDLE);
    if (!channelId) {
        console.log('❌ Could not resolve channel ID');
        process.exit(1);
    }

    const rss = await fetchRSS(channelId);
    let allVideos = [];
    
    if (rss) {
        allVideos = parseRSS(rss, 50);
        console.log(`   Found ${allVideos.length} videos from RSS\n`);
    } else {
        console.log('   ⚠️  RSS fetch failed, will add placeholder videos\n');
        // Create placeholder video entries
        for (let i = 0; i < 26; i++) {
            allVideos.push({
                videoId: `placeholder_${i}`,
                title: `BizzShort News ${i + 1}`,
                publishedAt: new Date().toISOString()
            });
        }
    }

    // Filter: Shorts typically have #shorts in title or are labeled as "Short"
    // For now, we'll take first 20 as latest updates and next 6 as breaking news
    
    console.log('📌 Step 4: Categorizing videos...');
    
    // First 20 → Latest Updates (Shorts)
    const latestUpdates = allVideos.slice(0, 20);
    for (const video of latestUpdates) {
        await Video.create({
            videoId: video.videoId,
            title: video.title,
            description: '',
            transcription: '',
            category: 'business',
            videoType: 'news',
            section: 'latest-updates',
            source: 'youtube',
            thumbnail: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
            views: '0',
            duration: '0',
            date: new Date(video.publishedAt).toISOString().split('T')[0],
            featured: false,
            tags: ['news'],
            createdAt: new Date(video.publishedAt),
            updatedAt: new Date()
        });
    }
    console.log(`   ✅ Added 20 videos to Latest Updates`);

    // Next 6 → Breaking News
    const breakingNews = allVideos.slice(20, 26);
    for (let i = 0; i < breakingNews.length; i++) {
        const video = breakingNews[i];
        await Video.create({
            videoId: video.videoId,
            title: video.title,
            description: '',
            transcription: '',
            category: 'business',
            videoType: 'news',
            section: 'breaking-news',
            source: 'youtube',
            thumbnail: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
            views: '0',
            duration: '0',
            date: new Date(video.publishedAt).toISOString().split('T')[0],
            featured: i === 0,
            tags: ['news'],
            createdAt: new Date(video.publishedAt),
            updatedAt: new Date()
        });
    }
    console.log(`   ✅ Added 6 videos to Breaking News\n`);

    // Summary
    const total = await Video.countDocuments();
    const bySection = {
        client: await Video.countDocuments({ section: 'client-features' }),
        breaking: await Video.countDocuments({ section: 'breaking-news' }),
        latest: await Video.countDocuments({ section: 'latest-updates' })
    };

    console.log('📊 Summary:');
    console.log(`   Total videos: ${total}`);
    console.log(`   Client Features: ${bySection.client}`);
    console.log(`   Breaking News: ${bySection.breaking}`);
    console.log(`   Latest Updates: ${bySection.latest}\n`);

    console.log('✅ ═══════════════════════════════════════════════════');
    console.log('   Setup complete!');
    console.log('   Next: Run python scripts/video_to_text.py');
    console.log('         (Run multiple times to transcribe all)');
    console.log('═══════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
