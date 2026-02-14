/**
 * Add specific client feature videos manually
 * These are hand-picked client showcase videos
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Video IDs from YouTube URLs
const CLIENT_VIDEOS = [
    'K7H6X8dFQjU',
    'HA4qS7sU4z0',
    'V-_pwdqEib0',
    'VDnyundJvlc',
    'bLOxCfgDtNo',
    'jm3X331Tb3o'
];

async function addClientVideos() {
    console.log('\n🎯 Adding Client Feature Videos\n');
    console.log('═══════════════════════════════════════════════════\n');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const Video = require('../models/Video');

    // Step 1: Clear all existing videos
    console.log('🗑️  Clearing all existing videos...');
    const deleteResult = await Video.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} videos\n`);

    // Step 2: Add the 6 client videos
    console.log('📺 Adding 6 client feature videos...\n');

    for (let i = 0; i < CLIENT_VIDEOS.length; i++) {
        const videoId = CLIENT_VIDEOS[i];
        
        await Video.create({
            videoId: videoId,
            title: `Client Feature Video ${i + 1}`, // Temporary title
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
            featured: i === 0,
            tags: ['client', 'industry'],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log(`   ✅ Added: ${videoId}`);
    }

    console.log('\n✅ All client videos added to database\n');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Next step: Run transcription with:');
    console.log('  python scripts/video_to_text.py\n');

    await mongoose.disconnect();
    process.exit(0);
}

addClientVideos().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
