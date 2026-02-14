const mongoose = require('mongoose');
const Video = require('../models/Video');
const fs = require('fs').promises;
const path = require('path');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizzshort';

async function main() {
    try {
        console.log('🚀 Fixing video sections and categories...\n');
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
        
        // 1. Move Dai Tofu video from breaking-news to client-features
        console.log('📦 Step 1: Moving Dai Tofu video to client-features...');
        const tofuResult = await Video.updateOne(
            { videoId: 'g5TUDlgcV9Y' },
            {
                $set: {
                    section: 'client-features',
                    videoType: 'client',
                    category: 'industry',
                    featured: false
                }
            }
        );
        console.log(`   ${tofuResult.modifiedCount > 0 ? '✅' : '⚠️'} Dai Tofu video ${tofuResult.modifiedCount > 0 ? 'moved' : 'not found or already updated'}\n`);
        
        // 2. Move kmtSz79ChCA from latest-updates to breaking-news
        console.log('📰 Step 2: Moving Seismic Activity video to breaking-news...');
        const seismicResult = await Video.updateOne(
            { videoId: 'kmtSz79ChCA' },
            {
                $set: {
                    section: 'breaking-news',
                    videoType: 'news',
                    category: 'business',
                    featured: true
                }
            }
        );
        console.log(`   ${seismicResult.modifiedCount > 0 ? '✅' : '⚠️'} Seismic video ${seismicResult.modifiedCount > 0 ? 'moved' : 'not found or already updated'}\n`);
        
        // 3. Fix categories for latest-updates videos
        console.log('🏷️  Step 3: Fixing categories for latest-updates videos...');
        
        const latestUpdates = await Video.find({ section: 'latest-updates' }).sort({ createdAt: 1 });
        
        // Assign appropriate categories based on titles/content
        const categoryAssignments = [
            { pattern: /market|stock|trading|sensex|nifty|investor/i, category: 'markets' },
            { pattern: /tech|ai|digital|startup|innovation|app/i, category: 'technology' },
            { pattern: /industry|manufacturing|infrastructure|production/i, category: 'industry' },
            { pattern: /.*/, category: 'business' } // Default fallback
        ];
        
        let updatedCount = 0;
        for (const video of latestUpdates) {
            // Determine category based on title
            let assignedCategory = 'business';
            const titleAndDesc = (video.title + ' ' + video.transcription).toLowerCase();
            
            for (const assignment of categoryAssignments) {
                if (assignment.pattern.test(titleAndDesc)) {
                    assignedCategory = assignment.category;
                    break;
                }
            }
            
            // Update if category is different
            if (video.category !== assignedCategory) {
                await Video.updateOne(
                    { _id: video._id },
                    { $set: { category: assignedCategory } }
                );
                console.log(`   ✅ ${video.videoId}: ${video.category} → ${assignedCategory}`);
                updatedCount++;
            }
        }
        
        console.log(`\n   📊 Updated ${updatedCount} video categories\n`);
        
        // 4. Export to seed file
        console.log('💾 Step 4: Exporting to seed file...');
        const videos = await Video.find({}).lean();
        const seedPath = path.join(__dirname, '../data/seed-videos.json');
        await fs.writeFile(seedPath, JSON.stringify(videos, null, 2));
        
        const fileStats = await fs.stat(seedPath);
        console.log(`✅ Exported ${videos.length} videos (${(fileStats.size / 1024).toFixed(1)} KB)\n`);
        
        // 5. Show distribution
        const dist = videos.reduce((acc, v) => {
            acc[v.section] = (acc[v.section] || 0) + 1;
            return acc;
        }, {});
        
        console.log('📊 Final Section Distribution:');
        Object.entries(dist).forEach(([section, count]) => {
            console.log(`   ${section}: ${count} videos`);
        });
        
        // Show category distribution for latest-updates
        const latestCats = videos
            .filter(v => v.section === 'latest-updates')
            .reduce((acc, v) => {
                acc[v.category] = (acc[v.category] || 0) + 1;
                return acc;
            }, {});
        
        console.log('\n📂 Latest Updates Category Distribution:');
        Object.entries(latestCats).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} videos`);
        });
        
        console.log('\n✅ All fixes complete!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Done!');
    }
}

main();
