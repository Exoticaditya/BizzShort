// Export pipeline videos from local DB to JSON seed file
require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

(async () => {
    const c = await MongoClient.connect(process.env.MONGO_URI);
    const db = c.db();
    
    const videos = await db.collection('videos').find().toArray();
    
    // Strip MongoDB internal fields, keep all content
    const cleaned = videos.map(v => {
        const { _id, __v, ...rest } = v;
        return rest;
    });
    
    const outputPath = path.join(__dirname, '..', 'data', 'seed-videos.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2));
    
    console.log(`Exported ${cleaned.length} videos to data/seed-videos.json`);
    console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
    
    // Verify
    const sample = cleaned[0];
    console.log(`\nSample video:`);
    console.log(`  Title: ${sample.title?.substring(0, 60)}`);
    console.log(`  Section: ${sample.section}`);
    console.log(`  Has transcription: ${!!sample.transcription && sample.transcription.length > 10}`);
    
    c.close();
})();
