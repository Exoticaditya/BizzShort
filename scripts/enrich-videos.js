/**
 * Enrich 30 BizzShort Videos with Content and Categorization
 * 
 * This script updates the MongoDB database with:
 * - Professional descriptions
 * - Accurate categorization
 * - Proper videoType (news vs client)
 * - Correct section assignment (breaking-news vs client-features)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/Video');
const videoEnrichmentData = require('./video-enrichment-data');

// Color codes for console output
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

async function enrichVideos() {
    log('\n' + '═'.repeat(70), 'cyan');
    log('   📹  BIZZSHORT VIDEO ENRICHMENT SYSTEM', 'bright');
    log('═'.repeat(70) + '\n', 'cyan');

    try {
        // Connect to MongoDB
        log('🔗 Connecting to MongoDB...', 'blue');
        await mongoose.connect(process.env.MONGO_URI);
        log('✅ Connected to MongoDB\n', 'green');

        // Get current video count
        const currentCount = await Video.countDocuments();
        log(`📊 Current videos in database: ${currentCount}`, 'blue');

        if (currentCount === 0) {
            log('⚠️  No videos found in database!', 'yellow');
            log('💡 Please run: node scripts/add-latest-30-videos.js first\n', 'yellow');
            return;
        }

        log(`\n🎯 Processing ${videoEnrichmentData.length} video enrichments...\n`, 'bright');

        let updated = 0;
        let notFound = 0;
        let errors = 0;

        const stats = {
            news: 0,
            client: 0,
            breakingNews: 0,
            clientFeatures: 0,
            categories: {}
        };

        for (let i = 0; i < videoEnrichmentData.length; i++) {
            const data = videoEnrichmentData[i];
            const num = String(i + 1).padStart(2, '0');

            try {
                // Find video by videoId
                const video = await Video.findOne({ videoId: data.videoId });

                if (!video) {
                    log(`${num}. ❌ Video not found: ${data.videoId}`, 'red');
                    notFound++;
                    continue;
                }

                // Update video with enriched data
                video.title = data.title;
                video.description = data.description;
                video.category = data.category;
                video.videoType = data.videoType;
                video.section = data.section;
                video.tags = data.tags || [];
                video.updatedAt = new Date();

                await video.save();

                // Update statistics
                stats[data.videoType === 'news' ? 'news' : 'client']++;
                stats[data.section === 'breaking-news' ? 'breakingNews' : 'clientFeatures']++;
                stats.categories[data.category] = (stats.categories[data.category] || 0) + 1;

                // Display update
                const typeIcon = data.videoType === 'client' ? '🎯' : '📰';
                const sectionBadge = data.section === 'client-features' ? '[CLIENT]' : '[NEWS]';
                
                log(`${num}. ${typeIcon} ${sectionBadge} ${data.title.substring(0, 55)}...`, 'green');
                log(`    ├─ Category: ${data.category.toUpperCase()}`, 'cyan');
                log(`    └─ ID: ${data.videoId}`, 'blue');

                updated++;

            } catch (error) {
                log(`${num}. ❌ Error updating ${data.videoId}: ${error.message}`, 'red');
                errors++;
            }
        }

        // Display summary
        log('\n' + '═'.repeat(70), 'cyan');
        log('   📊 ENRICHMENT SUMMARY', 'bright');
        log('═'.repeat(70), 'cyan');
        
        log(`\n✅ Successfully updated: ${updated}/${videoEnrichmentData.length}`, 'green');
        if (notFound > 0) log(`⚠️  Not found: ${notFound}`, 'yellow');
        if (errors > 0) log(`❌ Errors: ${errors}`, 'red');

        log('\n📈 Content Distribution:', 'bright');
        log(`   News Videos: ${stats.news}`, 'blue');
        log(`   Client Features: ${stats.client}`, 'cyan');

        log('\n📍 Section Distribution:', 'bright');
        log(`   Breaking News: ${stats.breakingNews}`, 'blue');
        log(`   Client Features: ${stats.clientFeatures}`, 'cyan');

        log('\n🏷️  Category Breakdown:', 'bright');
        Object.entries(stats.categories)
            .sort(([, a], [, b]) => b - a)
            .forEach(([cat, count]) => {
                log(`   ${cat.charAt(0).toUpperCase() + cat.slice(1)}: ${count}`, 'blue');
            });

        log('\n' + '═'.repeat(70), 'cyan');
        log('   ✨ ENRICHMENT COMPLETE!', 'green');
        log('═'.repeat(70) + '\n', 'cyan');

        log('💡 Next Steps:', 'bright');
        log('   1. Verify Breaking News section shows only news videos');
        log('   2. Verify Client Features section shows only client videos');
        log('   3. Check article pages display content correctly');
        log('   4. Test video playback and metadata display\n');

        // Display client feature videos
        log('🎯 Client Feature Videos (Should appear in Client Features section):', 'bright');
        const clientVideos = videoEnrichmentData.filter(v => v.videoType === 'client');
        clientVideos.forEach(v => {
            log(`   ✓ ${v.title}`, 'cyan');
        });
        log('');

    } catch (error) {
        log(`\n❌ Fatal Error: ${error.message}`, 'red');
        console.error(error);
    } finally {
        await mongoose.connection.close();
        log('🔌 Disconnected from MongoDB\n', 'blue');
    }
}

// Run the enrichment
enrichVideos().catch(console.error);
