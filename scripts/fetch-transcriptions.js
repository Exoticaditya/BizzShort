/**
 * YouTube Video Transcription Fetcher
 * 
 * Fetches auto-generated captions/subtitles from YouTube videos
 * and saves them as article transcriptions
 * 
 * Usage: node scripts/fetch-transcriptions.js
 */

const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

// Parse subtitle/caption text from YouTube's timedtext format
function parseSubtitles(xmlText) {
    const textRegex = /<text[^>]*>([^<]*)<\/text>/g;
    let match;
    const lines = [];

    while ((match = textRegex.exec(xmlText)) !== null) {
        let text = match[1]
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\n/g, ' ')
            .trim();
        if (text) lines.push(text);
    }

    return lines.join(' ');
}

// Fetch transcript from YouTube video
async function fetchTranscript(videoId) {
    return new Promise((resolve) => {
        // First, try to get the video page to find caption tracks
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        https.get(videoUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                try {
                    // Look for caption tracks in the page
                    const captionMatch = data.match(/"captionTracks":\s*\[(.*?)\]/);
                    if (!captionMatch) {
                        console.log(`   ⚠️ No captions found for ${videoId}`);
                        resolve(null);
                        return;
                    }

                    // Parse caption info
                    const captionData = JSON.parse(`[${captionMatch[1]}]`);

                    // Prefer English, then Hindi, then any available
                    let captionUrl = null;
                    for (const lang of ['en', 'hi', 'a.en', 'a.hi']) {
                        const track = captionData.find(t =>
                            t.languageCode === lang ||
                            t.vssId?.includes(lang)
                        );
                        if (track && track.baseUrl) {
                            captionUrl = track.baseUrl;
                            break;
                        }
                    }

                    // Use first available if no preferred language
                    if (!captionUrl && captionData.length > 0 && captionData[0].baseUrl) {
                        captionUrl = captionData[0].baseUrl;
                    }

                    if (!captionUrl) {
                        console.log(`   ⚠️ No usable caption URL for ${videoId}`);
                        resolve(null);
                        return;
                    }

                    // Fetch the actual captions
                    https.get(captionUrl, (captionRes) => {
                        let captionXml = '';
                        captionRes.on('data', chunk => captionXml += chunk);
                        captionRes.on('end', () => {
                            const transcript = parseSubtitles(captionXml);
                            if (transcript.length > 50) {
                                console.log(`   ✅ Got transcript (${transcript.length} chars)`);
                                resolve(transcript);
                            } else {
                                resolve(null);
                            }
                        });
                    }).on('error', () => resolve(null));

                } catch (error) {
                    console.log(`   ❌ Parse error for ${videoId}:`, error.message);
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

// Main function to update all videos with transcriptions
async function updateTranscriptions() {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('   BizzShort Video Transcription Fetcher');
    console.log('═══════════════════════════════════════════════════════\n');

    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.log('❌ MONGO_URI not set');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB\n');

        const Video = require('../models/Video');

        // Get videos without transcriptions
        const videos = await Video.find({
            source: 'youtube',
            $or: [
                { transcription: { $exists: false } },
                { transcription: null },
                { transcription: '' }
            ]
        }).limit(15);

        console.log(`📺 Found ${videos.length} videos needing transcription\n`);

        let updated = 0;
        for (const video of videos) {
            console.log(`🎬 Processing: ${video.title.substring(0, 50)}...`);

            const transcript = await fetchTranscript(video.videoId);

            if (transcript) {
                await Video.updateOne(
                    { _id: video._id },
                    { $set: { transcription: transcript, updatedAt: new Date() } }
                );
                updated++;
            }

            // Small delay to avoid rate limiting
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log(`\n✅ Updated ${updated} videos with transcriptions`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    await mongoose.disconnect();
    console.log('\n═══════════════════════════════════════════════════════\n');
    process.exit(0);
}

updateTranscriptions();
