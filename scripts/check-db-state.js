require('dotenv').config();
const { MongoClient } = require('mongodb');

(async () => {
    const c = await MongoClient.connect(process.env.MONGO_URI);
    const db = c.db();
    
    const total = await db.collection('videos').countDocuments();
    const withTranscription = await db.collection('videos').countDocuments({ 
        transcription: { $exists: true, $ne: '', $ne: null }
    });
    const withCreatedBy = await db.collection('videos').countDocuments({ 
        createdBy: { $exists: true, $ne: null }
    });
    const instagram = await db.collection('videos').countDocuments({ source: 'instagram' });
    const youtube = await db.collection('videos').countDocuments({ source: 'youtube' });
    
    console.log('=== DATABASE STATE ===');
    console.log('Total:', total);
    console.log('With transcription:', withTranscription);
    console.log('With createdBy (OLD):', withCreatedBy);
    console.log('YouTube:', youtube, 'Instagram:', instagram);
    
    console.log('\n--- Oldest 5 ---');
    const oldest = await db.collection('videos').find()
        .project({ title: 1, source: 1, section: 1, createdAt: 1, createdBy: 1, transcription: 1 })
        .sort({ createdAt: 1 }).limit(5).toArray();
    oldest.forEach(v => {
        const hasT = v.transcription && v.transcription.length > 10;
        console.log(`  [${v.createdBy ? 'OLD' : 'NEW'}] ${v.title?.substring(0, 55)} | ${v.source} | ${v.section} | trans:${hasT}`);
    });
    
    console.log('\n--- Newest 5 ---');
    const newest = await db.collection('videos').find()
        .project({ title: 1, source: 1, section: 1, createdAt: 1, createdBy: 1, transcription: 1 })
        .sort({ createdAt: -1 }).limit(5).toArray();
    newest.forEach(v => {
        const hasT = v.transcription && v.transcription.length > 10;
        console.log(`  [${v.createdBy ? 'OLD' : 'NEW'}] ${v.title?.substring(0, 55)} | ${v.source} | ${v.section} | trans:${hasT}`);
    });
    
    c.close();
})();
