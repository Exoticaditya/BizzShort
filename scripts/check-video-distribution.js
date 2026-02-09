require('dotenv').config();
const { MongoClient } = require('mongodb');

(async () => {
    const c = await MongoClient.connect(process.env.MONGO_URI);
    const db = c.db();
    
    const clientFeatures = await db.collection('videos').find({ section: 'client-features' }).toArray();
    const latestUpdates = await db.collection('videos').find({ section: 'latest-updates' }).toArray();
    const breakingNews = await db.collection('videos').find({ section: 'breaking-news' }).toArray();
    
    console.log('=== VIDEO DISTRIBUTION ===');
    console.log('Client-features:', clientFeatures.length);
    console.log('Latest-updates:', latestUpdates.length);
    console.log('Breaking-news:', breakingNews.length);
    console.log('Total:', clientFeatures.length + latestUpdates.length + breakingNews.length);
    
    console.log('\n=== CLIENT FEATURES ===');
    clientFeatures.forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.title?.substring(0, 65)} | ${v.videoType}`);
    });
    
    console.log('\n=== TRANSCRIPTION CHECK (sample 3) ===');
    const sample = await db.collection('videos').find().limit(3).toArray();
    sample.forEach(v => {
        const trans = v.transcription || '';
        console.log(`\nTitle: ${v.title?.substring(0, 50)}`);
        console.log(`Transcription (first 100 chars): ${trans.substring(0, 100)}...`);
        console.log(`Has Devanagari: ${/[\u0900-\u097F]/.test(trans)}`);
        console.log(`Has Arabic/Urdu: ${/[\u0600-\u06FF]/.test(trans)}`);
    });
    
    c.close();
})();
