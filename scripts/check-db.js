require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/Video');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const total = await Video.countDocuments();
    const bn = await Video.countDocuments({ section: 'breaking-news' });
    const cf = await Video.countDocuments({ section: 'client-features' });
    const lu = await Video.countDocuments({ section: 'latest-updates' });
    const yt = await Video.countDocuments({ source: 'youtube' });
    const ig = await Video.countDocuments({ source: 'instagram' });
    
    console.log('=== DATABASE STATUS ===');
    console.log(`Total: ${total} | YouTube: ${yt} | Instagram: ${ig}`);
    console.log(`Breaking News: ${bn} | Client Features: ${cf} | Latest Updates: ${lu}`);
    
    // Check transcription status
    const allVideos = await Video.find({}).sort({ createdAt: -1 });
    let withTrans = 0;
    let withoutTrans = 0;
    
    console.log('\n=== ALL VIDEOS ===');
    for (const v of allVideos) {
        const hasTrans = v.transcription && v.transcription.length > 50;
        if (hasTrans) withTrans++;
        else withoutTrans++;
        
        console.log(`[${v.section}] [${v.videoType}] ${v.videoId} | ${v.title?.substring(0, 50)} | trans: ${v.transcription?.length || 0} chars`);
    }
    
    console.log(`\nWith transcription (>50 chars): ${withTrans}`);
    console.log(`Without proper transcription: ${withoutTrans}`);
    
    await mongoose.disconnect();
}

check().catch(e => { console.error(e); process.exit(1); });
