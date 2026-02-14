/**
 * Complete BizzShort Video Database Setup
 * 1. Adds 6 client feature videos (manual selection)
 * 2. Fetches 26 news videos from @bizz_short channel
 * 3. Assigns: 6 breaking news + 20 latest updates
 */

const https = require('https');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Manual client videos
const CLIENT_VIDEOS = [
    'K7H6X8dFQjU',
    'HA4qS7sU4z0',
    'V-_pwdqEib0',
    'VDnyundJvlc',
    'bLOxCfgDtNo',
    'jm3X331Tb3o'
];

const YOUTUBE_HANDLE = '@bizz_short';

async function getChannelId(handle) {
    return new Promise((resolve) => {
        const url = `https://www.youtube.com/${handle}`;
        https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/"channelId":"(UC[\w-]+)"/) || data.match(/"externalId":"(UC[\w-]+)"/);
                resolve(match ? match[1] : null);
            });
        }).on('error', () => resolve(null));
    });
}

async function fetchRSS(channelId) {
    return new Promise((resolve) => {
        https.get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(res.statusCode === 200 ? data : null));
        }).on('error', () => resolve(null));
    });
}

function parseRSS(xml, limit) {
    const videos = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null && videos.length < limit) {
        const entry = match[1];
        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

        if (titleMatch && idMatch) {
            videos.push({
                videoId: idMatch[1],
                title: titleMatch[1],
                publishedAt: publishedMatch ? publishedMatch[1] : new Date().toISOString()
            });
        }
    }
    return videos;
}

async function main() {
    console.log('\n🚀 BizzShort Complete Video Database Setup\n');
    console.log('═'.repeat(60) + '\n');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const Video = require('../models/Video');

    // Step 1: Clear database
    console.log('🗑️  Clearing database...');
    const deleted = await Video.deleteMany({});
    console.log(`   Deleted ${deleted.deletedCount} old videos\n`);

    // Step 2: Add client videos
    console.log('🎯 Adding 6 client feature videos...');
    for (const videoId of CLIENT_VIDEOS) {
        await Video.create({
            videoId,
            title: 'Client Feature Video',
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
    }
    console.log(`   ✅ Added ${CLIENT_VIDEOS.length} client videos\n`);

    // Step 3: Fetch news videos
    console.log('📺 Fetching news videos from YouTube...');
    const channelId = await getChannelId(YOUTUBE_HANDLE);
    
    if (!channelId) {
        console.log('   ⚠️  Could not resolve channel ID\n');
        console.log('✅ Setup complete (client videos only)\n');
        await mongoose.disconnect();
        return;
    }

    console.log(`   Channel ID: ${channelId}`);
    
    const rss = await fetchRSS(channelId);
    if (!rss) {
        console.log('   ⚠️  Could not fetch RSS feed\n');
        console.log('✅ Setup complete (client videos only)\n');
        await mongoose.disconnect();
        return;
    }

    const newsVideos = parseRSS(rss, 30);
    console.log(`   Found ${newsVideos.length} videos from RSS\n`);

    // Step 4: Add breaking news (first 6)
    console.log('📰 Adding 6 breaking news videos...');
    for (let i = 0; i < Math.min(6, newsVideos.length); i++) {
        const video = newsVideos[i];
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
    console.log('   ✅ Added 6 breaking news\n');

    // Step 5: Add latest updates (next 20)
    console.log('📋 Adding 20 latest update videos...');
    for (let i = 6; i < Math.min(26, newsVideos.length); i++) {
        const video = newsVideos[i];
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
    console.log('   ✅ Added 20 latest updates\n');

    // Summary
    const counts = {
        total: await Video.countDocuments(),
        client: await Video.countDocuments({ section: 'client-features' }),
        breaking: await Video.countDocuments({ section: 'breaking-news' }),
        latest: await Video.countDocuments({ section: 'latest-updates' })
    };

    console.log('═'.repeat(60));
    console.log('📊 Final Summary:');
    console.log(`   Total Videos: ${counts.total}`);
    console.log(`   Client Features: ${counts.client}`);
    console.log(`   Breaking News: ${counts.breaking}`);
    console.log(`   Latest Updates: ${counts.latest}`);
    console.log('═'.repeat(60));
    console.log('\n✅ Database setup complete!\n');
    console.log('📝 Next steps:');
    console.log('   1. Run: python scripts/video_to_text.py');
    console.log('   2. Repeat until all videos transcribed');
    console.log('   3. Run: node scripts/export-seed.js\n');

    await mongoose.disconnect();
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
