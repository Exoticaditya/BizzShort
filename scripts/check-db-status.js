const mongoose = require('mongoose');
require('dotenv').config();

async function checkStatus() {
    await mongoose.connect(process.env.MONGO_URI);
    const Video = require('../models/Video');
    
    const count = await Video.countDocuments();
    console.log('\n📊 Database Status:');
    console.log('   Total videos:', count);
    
    if (count > 0) {
        const sections = {
            'client-features': await Video.countDocuments({ section: 'client-features' }),
            'breaking-news': await Video.countDocuments({ section: 'breaking-news' }),
            'latest-updates': await Video.countDocuments({ section: 'latest-updates' })
        };
        
        console.log('\n   By section:');
        console.log('   - Client Features:', sections['client-features']);
        console.log('   - Breaking News:', sections['breaking-news']);
        console.log('   - Latest Updates:', sections['latest-updates']);
        
        const withTranscription = await Video.countDocuments({ 
            transcription: { $exists: true, $ne: '' } 
        });
        console.log('\n   With transcription:', withTranscription);
        
        console.log('\n   Recent videos:');
        const videos = await Video.find({}).sort({createdAt: -1}).limit(5);
        videos.forEach((v, i) => {
            const hasTranscript = v.transcription && v.transcription.length > 0;
            console.log(`   ${i+1}. [${v.section}] ${v.videoId} - ${hasTranscript ? '✅' : '❌'}`);
        });
    }
    
    await mongoose.disconnect();
}

checkStatus().catch(console.error);
