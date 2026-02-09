/**
 * Video Reorganization Script
 * 
 * This script:
 * 1. Moves first 5 breaking news videos to client features
 * 2. Copies description to transcription field for article pages
 * 3. Prepares database for 6 new breaking news videos
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/Video');

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function reorganizeVideos() {
    log('\n' + '═'.repeat(70), 'cyan');
    log('   🔄 VIDEO REORGANIZATION SYSTEM', 'bright');
    log('═'.repeat(70) + '\n', 'cyan');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        log('✅ Connected to MongoDB\n', 'green');

        // Step 1: Get first 5 breaking news videos
        log('📋 Step 1: Finding first 5 breaking news videos...', 'blue');
        const breakingNewsVideos = await Video.find({ 
            section: 'breaking-news',
            videoType: 'news'
        })
        .sort({ createdAt: 1 }) // Oldest first
        .limit(5);

        if (breakingNewsVideos.length === 0) {
            log('⚠️  No breaking news videos found!', 'yellow');
            return;
        }

        log(`   Found ${breakingNewsVideos.length} videos to move\n`, 'green');

        // Step 2: Move these videos to client features
        log('🎯 Step 2: Moving videos to client features...', 'blue');
        let movedCount = 0;

        for (const video of breakingNewsVideos) {
            video.videoType = 'client';
            video.section = 'client-features';
            video.updatedAt = new Date();
            await video.save();
            
            log(`   ✓ Moved: ${video.title.substring(0, 60)}...`, 'green');
            movedCount++;
        }

        log(`\n✅ Successfully moved ${movedCount} videos to client features\n`, 'green');

        // Step 3: Copy descriptions to transcription field for all videos
        log('📝 Step 3: Copying descriptions to transcription field...', 'blue');
        
        const allVideos = await Video.find({});
        let updatedCount = 0;

        for (const video of allVideos) {
            if (!video.transcription && video.description) {
                video.transcription = video.description;
                video.updatedAt = new Date();
                await video.save();
                updatedCount++;
            }
        }

        log(`✅ Updated ${updatedCount} videos with transcription data\n`, 'green');

        // Step 4: Show current statistics
        log('📊 Current Database Statistics:', 'bright');
        
        const newsCount = await Video.countDocuments({ videoType: 'news', section: 'breaking-news' });
        const clientCount = await Video.countDocuments({ videoType: 'client', section: 'client-features' });
        const totalCount = await Video.countDocuments({});

        log(`   Total Videos: ${totalCount}`, 'blue');
        log(`   Breaking News: ${newsCount}`, 'blue');
        log(`   Client Features: ${clientCount}`, 'cyan');

        log('\n' + '═'.repeat(70), 'cyan');
        log('   ✨ REORGANIZATION COMPLETE!', 'green');
        log('═'.repeat(70) + '\n', 'cyan');

        log('💡 Next Steps:', 'bright');
        log('   1. Run: node scripts/fetch-new-youtube-videos.js (fetch 6 new videos)');
        log('   2. Test article.html pages to verify content display');
        log('   3. Verify client features section shows 8 videos (3 original + 5 moved)');
        log('   4. Verify breaking news section has space for new videos\n');

        // List client feature videos
        log('🎯 Current Client Feature Videos:', 'bright');
        const clientVideos = await Video.find({ section: 'client-features' }).sort({ createdAt: -1 });
        clientVideos.forEach((v, i) => {
            log(`   ${i + 1}. ${v.title.substring(0, 65)}...`, 'cyan');
        });
        log('');

    } catch (error) {
        log(`\n❌ Error: ${error.message}`, 'red');
        console.error(error);
    } finally {
        await mongoose.connection.close();
        log('🔌 Disconnected from MongoDB\n', 'blue');
    }
}

reorganizeVideos().catch(console.error);
