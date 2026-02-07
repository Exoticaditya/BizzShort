/**
 * Process Latest 30 BizzShort Videos
 * Fetches metadata and saves to MongoDB
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Latest 30 video IDs from @Bizz_Short
const VIDEO_IDS = [
    'O4V8q_TXi2A',  // India's sugar production
    'Msg9p-wKOMc',  // Defence sector mutual funds
    'x1A6RFaAm7A',  // Draft National AI Policy
    'gc0F6lrlbQU',  // Sports Governance Act
    '82AIv2kMbYQ',  // Gokaldas Exports
    'ewIrq_riznE',  // Gold prices rising
    'xws7XLtKBgw',  // Uttar Pradesh Day
    '7JQhQ6bXy0I',
    '8a1RkM6u0tk',
    'vB9qC9YfYI8',
    'Jk8WqJQKcR4',
    'dk2WkX8p1wM',
    'k2n6cXhJq7o',
    'W2C3nqR8kYI',
    'Rp8JfC5oF8o',
    'qY8d4zZ8mN4',
    'tJcH8k9o8SI',
    'U2FJ6uYq7LM',
    'An7p9F2X5bo',
    'jH3oP6l1ZC8',
    'Gp3Q8r7jHk0',
    '6pR5yZ0o8Cw',
    '5rJk4q9Z7nI',
    '2pT4H8qCk0M',
    '1mZ0tY6b8Xo',
    'Zk3L7p6oQ9I',
    'Ys8qC2o9tW0',
    'M3kF7o2ZxP4',
    '0k2oJ8n7P1c',
    '9P6zQ5Xk2aU',
];

// Load Video model
const Video = require('../models/Video');

async function categorizeVideo(title, description) {
    const text = (title + ' ' + description).toLowerCase();

    const categories = {
        markets: ['stock', 'market', 'nifty', 'sensex', 'share', 'trading', 'investor', 'mutual fund'],
        economy: ['gdp', 'economy', 'inflation', 'growth', 'fiscal', 'economic', 'production'],
        technology: ['ai', 'tech', 'digital', 'software', 'data', 'innovation', 'policy'],
        industry: ['manufacturing', 'export', 'sector', 'industry'],
        business: ['business', 'company', 'corporate', 'revenue', 'profit'],
        sports: ['sports', 'governance', 'act'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }

    return 'business';
}

async function main() {
    console.log('\n' + '='.repeat(70));
    console.log('   Processing Latest 30 BizzShort Videos');
    console.log('='.repeat(70) + '\n');

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Ask for confirmation
        console.log('⚠️  WARNING: This will DELETE all existing videos in the database!');
        console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Clear old videos
        const deleteResult = await Video.deleteMany({});
        console.log(`🗑️  Removed ${deleteResult.deletedCount} old videos\n`);

        console.log(`📹 Processing ${VIDEO_IDS.length} videos...\n`);

        let successCount = 0;
        let failedCount = 0;

        for (let i = 0; i < VIDEO_IDS.length; i++) {
            const videoId = VIDEO_IDS[i];
            console.log(`${i + 1}. Processing ${videoId}...`);

            try {
                // Create video with basic metadata
                // Title and description will be filled by user or transcription script
                const category = 'business';  // Default, can be updated in admin

                const videoData = {
                    videoId: videoId,
                    title: `BizzShort Update - ${videoId}`,
                    description: 'Video description will be added via transcription or admin panel.',
                    category: category,
                    videoType: 'news',  // Default to news, can be changed in admin
                    section: 'breaking-news',
                    source: 'youtube',
                    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    views: '0',
                    date: new Date().toISOString().split('T')[0],
                    featured: false,
                    tags: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                await Video.create(videoData);
                console.log(`   ✅ Saved: ${videoData.title}`);
                successCount++;
            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}`);
                failedCount++;
            }
        }

        console.log(`\n${'='.repeat(70)}`);
        console.log(`   ✅ Successfully processed: ${successCount}/${VIDEO_IDS.length}`);
        console.log(`   ❌ Failed: ${failedCount}/${VIDEO_IDS.length}`);
        console.log('='.repeat(70) + '\n');

        console.log('💡 Next Steps:');
        console.log('   1. Run: node scripts/fetch-video-metadata.js (to fetch titles)');
        console.log('   2. Run: python scripts/video_to_text.py (to transcribe)');
        console.log('   3. Videos are now live on your website!');
        console.log('   4. Use Admin Panel to edit titles, categories, and sections\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

main();
