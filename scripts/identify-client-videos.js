/**
 * Identify and reclassify client feature videos
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function identifyAndReclassify() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const Video = require('../models/Video');
    const videos = await Video.find({}).sort({ createdAt: -1 });

    console.log('📺 Analyzing videos for client features...\n');

    const clientKeywords = [
        'sun energy', 'tofu', 'product', 'company', 'visit www', 'call us',
        'email us', 'contact', 'our mission', 'founded in', 'प्रोटीन', 
        'प्लांट-बेस्ड', 'कंपनी', 'हमारा'
    ];

    const potentialClients = [];

    videos.forEach((v, i) => {
        const text = (v.title + ' ' + v.description + ' ' + (v.transcription || '')).toLowerCase();
        const hasClientKeywords = clientKeywords.some(kw => text.includes(kw));
        
        if (hasClientKeywords && v.videoType !== 'client') {
            potentialClients.push(v);
            console.log(`${i + 1}. 🎯 FOUND: ${v.title.substring(0, 70)}...`);
            console.log(`   Current: ${v.videoType}/${v.section}`);
            console.log(`   Matched keywords: ${clientKeywords.filter(kw => text.includes(kw)).join(', ')}\n`);
        }
    });

    if (potentialClients.length === 0) {
        console.log('No additional client videos found.\n');
    } else {
        console.log(`\n📊 Found ${potentialClients.length} videos to reclassify\n`);
        
        // Reclassify them
        for (const video of potentialClients) {
            await Video.updateOne(
                { _id: video._id },
                {
                    $set: {
                        videoType: 'client',
                        section: 'client-features',
                        updatedAt: new Date()
                    }
                }
            );
            console.log(`✅ Reclassified: ${video.title.substring(0, 60)}...`);
        }
    }

    // Show final counts
    const updated = await Video.find({});
    console.log('\n📊 Final Distribution:');
    console.log(`   Total: ${updated.length}`);
    console.log(`   Client Features: ${updated.filter(v => v.section === 'client-features').length}`);
    console.log(`   Breaking News: ${updated.filter(v => v.section === 'breaking-news').length}`);
    console.log(`   Latest Updates: ${updated.filter(v => v.section === 'latest-updates').length}`);

    await mongoose.disconnect();
    process.exit(0);
}

identifyAndReclassify().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
