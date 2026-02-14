const mongoose = require('mongoose');
const Video = require('../models/Video');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizzshort';

async function main() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
        
        // Find all breaking news videos
        const breakingNews = await Video.find({ section: 'breaking-news' });
        
        console.log('📰 BREAKING NEWS VIDEOS:');
        breakingNews.forEach((v, i) => {
            console.log(`${i + 1}. ${v.title.substring(0, 60)}...`);
            console.log(`   Video ID: ${v.videoId}`);
            console.log(`   Transcription: ${v.transcription.substring(0, 80)}...`);
            console.log('');
        });
        
        // Find all client features
        const clientFeatures = await Video.find({ section: 'client-features' });
        
        console.log('\n🎯 CLIENT FEATURES VIDEOS:');
        clientFeatures.forEach((v, i) => {
            console.log(`${i + 1}. ${v.title.substring(0, 60)}...`);
            console.log(`   Video ID: ${v.videoId}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
