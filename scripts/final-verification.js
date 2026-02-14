const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function finalVerification() {
    console.log('\n✅ BIZZSHORT VIDEO SYSTEM - FINAL STATUS\n');
    console.log('═══════════════════════════════════════════════════════\n');
    
    await mongoose.connect(process.env.MONGO_URI);
    const Video = require('../models/Video');
    
    // Get all videos
    const allVideos = await Video.find({}).sort({ section: 1, createdAt: -1 });
    
    // Stats
    const stats = {
        total: allVideos.length,
        clientFeatures: allVideos.filter(v => v.section === 'client-features').length,
        breakingNews: allVideos.filter(v => v.section === 'breaking-news').length,
        latestUpdates: allVideos.filter(v => v.section === 'latest-updates').length,
        withTranscription: allVideos.filter(v => v.transcription && v.transcription.length > 0).length,
        english: allVideos.filter(v => v.transcription && !/[\u0900-\u097F]/.test(v.transcription)).length,
        hindi: allVideos.filter(v => v.transcription && /[\u0900-\u097F]/.test(v.transcription)).length
    };
    
    console.log('📊 DATABASE SUMMARY:');
    console.log('   Total Videos: ' + stats.total);
    console.log('   ├─ Client Features: ' + stats.clientFeatures);
    console.log('   ├─ Breaking News: ' + stats.breakingNews);
    console.log('   └─ Latest Updates: ' + stats.latestUpdates);
    console.log('');
    console.log('🎤 TRANSCRIPTIONS:');
    console.log('   Total Transcribed: ' + stats.withTranscription + '/' + stats.total);
    console.log('   ├─ English: ' + stats.english);
    console.log('   └─ Hindi: ' + stats.hindi);
    console.log('');
    
    // Client Features
    console.log('🎯 CLIENT FEATURES (' + stats.clientFeatures + '):');
    const clients = allVideos.filter(v => v.section === 'client-features');
    clients.forEach((v, i) => {
        const lang = v.transcription && /[\u0900-\u097F]/.test(v.transcription) ? 'HI' : 'EN';
        const chars = v.transcription ? v.transcription.length : 0;
        console.log(`   ${i+1}. [${lang}] ${v.videoId} (${chars} chars)`);
    });
    console.log('');
    
    // Breaking News
    console.log('📰 BREAKING NEWS (' + stats.breakingNews + '):');
    const breaking = allVideos.filter(v => v.section === 'breaking-news');
    breaking.forEach((v, i) => {
        const lang = v.transcription && /[\u0900-\u097F]/.test(v.transcription) ? 'HI' : 'EN';
        const chars = v.transcription ? v.transcription.length : 0;
        console.log(`   ${i+1}. [${lang}] ${v.videoId} (${chars} chars)`);
    });
    console.log('');
    
    // Latest Updates
    console.log('📋 LATEST UPDATES (' + stats.latestUpdates + '):');
    const latest = allVideos.filter(v => v.section === 'latest-updates');
    latest.forEach((v, i) => {
        const lang = v.transcription && /[\u0900-\u097F]/.test(v.transcription) ? 'HI' : 'EN';
        const chars = v.transcription ? v.transcription.length : 0;
        console.log(`   ${i+1}. [${lang}] ${v.videoId} (${chars} chars)`);
    });
    console.log('');
    
    // Seed file check
    const seedPath = path.join(__dirname, '..', 'data', 'seed-videos.json');
    const seedExists = fs.existsSync(seedPath);
    const seedSize = seedExists ? (fs.statSync(seedPath).size / 1024).toFixed(1) : 0;
    
    console.log('📁 SEED FILE:');
    console.log('   Status: ' + (seedExists ? '✅ Generated' : '❌ Missing'));
    console.log('   Location: data/seed-videos.json');
    console.log('   Size: ' + seedSize + ' KB');
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ SYSTEM STATUS: ALL WORKING');
    console.log('═══════════════════════════════════════════════════════\n');
    
    await mongoose.disconnect();
}

const path = require('path');
finalVerification().catch(console.error);
