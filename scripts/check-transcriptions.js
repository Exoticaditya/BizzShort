/**
 * Check full transcription content for all videos
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/Video');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const videos = await Video.find({}).sort({ section: 1 });
    
    for (const v of videos) {
        console.log(`\n${'='.repeat(70)}`);
        console.log(`[${v.section}] [${v.videoType}] ${v.videoId}`);
        console.log(`Title: ${v.title}`);
        console.log(`Category: ${v.category}`);
        console.log(`Transcription (${v.transcription?.length || 0} chars):`);
        console.log(v.transcription || '(empty)');
        console.log(`Description (${v.description?.length || 0} chars):`);
        console.log(v.description?.substring(0, 200) || '(empty)');
    }
    
    await mongoose.disconnect();
}

check().catch(e => { console.error(e); process.exit(1); });
