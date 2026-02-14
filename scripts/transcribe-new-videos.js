const mongoose = require('mongoose');
const Video = require('../models/Video');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizzshort';

const VIDEO_IDS = ['qIitvlJI0WU', 'FUR7OtMgHJQ', 'xrdOa0iRX4E', 'JP_P9Sn2ck8'];

async function transcribeVideo(videoId) {
    return new Promise((resolve) => {
        console.log(`\n🎤 Transcribing ${videoId}...`);
        
        const pythonPath = 'python';
        const scriptPath = path.join(__dirname, 'video_to_text.py');
        
        const process = spawn(pythonPath, [scriptPath, videoId]);
        let output = '';
        let errorOutput = '';
        
        process.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            if (text.includes('🔄') || text.includes('🌐')) {
                process.stdout.write('.');
            }
        });
        
        process.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                try {
                    // Look for JSON in output
                    const jsonMatch = output.match(/\{[^{}]*"transcription"[^{}]*\}/);
                    if (jsonMatch) {
                        const result = JSON.parse(jsonMatch[0]);
                        console.log(`✅ Success (${result.language || 'unknown'})`);
                        resolve(result);
                    } else {
                        console.log(`⚠️  No JSON output, assuming success`);
                        resolve({ transcription: '', language: 'en' });
                    }
                } catch (e) {
                    console.log(`⚠️  Parse error, using empty`);
                    resolve({ transcription: '', language: 'en' });
                }
            } else {
                console.log(`❌ Failed (exit code ${code})`);
                if (errorOutput) console.log(errorOutput.substring(0, 200));
                resolve({ transcription: '', language: 'en' });
            }
        });
    });
}

async function main() {
    try {
        console.log('🚀 Transcribing new videos...\n');
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        for (const videoId of VIDEO_IDS) {
            // Get video from DB
            const video = await Video.findOne({ videoId });
            
            if (!video) {
                console.log(`❌ Video ${videoId} not found in database\n`);
                continue;
            }
            
            console.log(`\n📹 Processing: ${video.title.substring(0, 50)}...`);
            console.log(`   Section: ${video.section}`);
            
            // Transcribe
            const result = await transcribeVideo(videoId);
            
            // Update video
            if (result.transcription) {
                video.transcription = result.transcription;
                await video.save();
                console.log(`   💾 Updated in database (${result.transcription.length} chars)`);
            }
        }
        
        // Export to seed
        console.log('\n\n💾 Exporting to seed file...');
        const videos = await Video.find({}).lean();
        const seedPath = path.join(__dirname, '../data/seed-videos.json');
        await fs.writeFile(seedPath, JSON.stringify(videos, null, 2));
        
        const fileStats = await fs.stat(seedPath);
        console.log(`✅ Exported ${videos.length} videos (${(fileStats.size / 1024).toFixed(1)} KB)`);
        
        // Count transcriptions
        const transcribed = videos.filter(v => v.transcription && v.transcription.length > 0).length;
        console.log(`✅ ${transcribed}/${videos.length} videos have transcriptions`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Done!');
    }
}

main();
