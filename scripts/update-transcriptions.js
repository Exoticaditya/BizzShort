const mongoose = require('mongoose');
const Video = require('../models/Video');
const fs = require('fs').promises;
const path = require('path');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizzshort';

const TRANSCRIPTIONS = {
    'qIitvlJI0WU': "In today's industrial environment, uninterrupted power is not a luxury. It's a necessity. Even a momentary power failure can lead to production loss, equipment damage, and costly downtime. That's where Jupiter Electronics and Telecom Systems supports industries with confidence. Jupiter Electronics and Telecom Systems provides reliable power backup solutions engineered for industrial applications. Their range includes industrial UPS systems, inverter based backup solutions, high capacity batteries, and renewable DC power solutions that can keep critical machinery, control systems, and entire production lines running without interruption. Built with advanced technology and rigorously tested for tough conditions, every product from Jupiter Electronics is designed for efficiency, durability, and reliability. Whether its manufacturing units, infrastructure projects, or process industries, Jupiter's power solutions ensures that your operations never stop. Power your industry with confidence. For inquiries call 6374511182 or visit Jupiter Electric Company.",
    
    'FUR7OtMgHJQ': "Best shot in seconds, Sigvot Nudgez. Indian stock markets face monthly decline. Indian stock markets recorded a significant monthly decline due to foreign investor selling, weak global queues and uncertainty over economic policies. Rising crude oil prices and a weakening repeat further affected investor sentiment. Market experts said mixed corporate earnings and cautious outlook ahead of the union budget also influenced trading. Despite short term pressure, analysts remain hopeful about long term growth prospects. Source, Times of India. This short in seconds. Say what matters. Think business, think with short, tap to subscribe.",
    
    'xrdOa0iRX4E': "This short in seconds say what matters. Students protest over immigration shootings in US. Thousands of students across the United States staged protests and walkouts following fatal shootings involving immigration officers. Demonstrators demanded justice and changes in immigration enforcement policies. Protests were held in several major cities highlighting concerns about civil rights and public safety. Organizers said the movement aimed to raise awareness and pressure authorities to take corrective action. Source, NBC News. This short in seconds say what matters. Think business, think with short, tap to subscribe.",
    
    'JP_P9Sn2ck8': "US shoots down Iranian drone amid rising tensions. The United States military reported that a US Navy F-35C fighter jet shot down an Iranian shot 139 drone that was approaching the USS Abraham Lincoln aircraft carrier in the Arabian Sea. The incident occurred as the Iran and Washington prepared for diplomatic talks later this week, with Iran reportedly opened to negotiations but pushing for a narrow agenda focused on nuclear issues. The clash also involved Iranian gunboats approaching a US flag tanker. Both incidents were confirmed by US Central Command. Analysts say while diplomacy remains a priority, tensions remain high in the region. Source, Reuters. This short in seconds say what matters. Think business, think with short, tap to subscribe."
};

async function main() {
    try {
        console.log('🚀 Updating video transcriptions...\n');
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
        
        for (const [videoId, transcription] of Object.entries(TRANSCRIPTIONS)) {
            console.log(`📝 Updating ${videoId}...`);
            
            const result = await Video.updateOne(
                { videoId },
                {
                    $set: {
                        transcription,
                        updatedAt: new Date()
                    }
                }
            );
            
            if (result.modifiedCount > 0) {
                console.log(`   ✅ Updated (${transcription.length} chars)`);
            } else {
                console.log(`   ⚠️  Not found or already updated`);
            }
            console.log('');
        }
        
        // Export to seed
        console.log('💾 Exporting to seed file...');
        const videos = await Video.find({}).lean();
        const seedPath = path.join(__dirname, '../data/seed-videos.json');
        await fs.writeFile(seedPath, JSON.stringify(videos, null, 2));
        
        const fileStats = await fs.stat(seedPath);
        console.log(`✅ Exported ${videos.length} videos (${(fileStats.size / 1024).toFixed(1)} KB)\n`);
        
        // Show stats
        const dist = videos.reduce((acc, v) => {
            acc[v.section] = (acc[v.section] || 0) + 1;
            return acc;
        }, {});
        
        console.log('📊 Final Distribution:');
        Object.entries(dist).forEach(([section, count]) => {
            console.log(`   ${section}: ${count} videos`);
        });
        
        const transcribed = videos.filter(v => v.transcription && v.transcription.length > 50).length;
        console.log(`\n✅ ${transcribed}/${videos.length} videos fully transcribed`);
        console.log('\n🎉 Ready to deploy!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Done!');
    }
}

main();
