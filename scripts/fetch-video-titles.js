/**
 * Fetch Video Metadata from YouTube
 * Updates video titles and descriptions in MongoDB
 */

require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');

const Video = require('../models/Video');

// Function to fetch video page and extract title
function fetchYouTubeTitle(videoId) {
    return new Promise((resolve, reject) => {
        const url = `https://www.youtube.com/watch?v=${videoId}`;

        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Extract title from page
                const titleMatch = data.match(/<title>(.+?) - YouTube<\/title>/);
                if (titleMatch) {
                    resolve(titleMatch[1]);
                } else {
                    // Try alternate pattern
                    const altMatch = data.match(/"title":"([^"]+)"/);
                    if (altMatch) {
                        resolve(altMatch[1]);
                    } else {
                        resolve(null);
                    }
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log('\n' + '='.repeat(60));
    console.log('   Fetching Video Titles from YouTube');
    console.log('='.repeat(60) + '\n');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const videos = await Video.find({});
        console.log(`📹 Found ${videos.length} videos to process\n`);

        let updated = 0;
        let failed = 0;

        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            console.log(`${i + 1}. Fetching: ${video.videoId}...`);

            try {
                const title = await fetchYouTubeTitle(video.videoId);

                if (title) {
                    // Update video with real title
                    await Video.updateOne(
                        { _id: video._id },
                        {
                            $set: {
                                title: title,
                                updatedAt: new Date()
                            }
                        }
                    );
                    console.log(`   ✅ ${title.substring(0, 50)}...`);
                    updated++;
                } else {
                    console.log(`   ⚠️ Could not fetch title`);
                    failed++;
                }

                // Small delay to avoid rate limiting
                await new Promise(r => setTimeout(r, 500));

            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
                failed++;
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`   ✅ Updated: ${updated} videos`);
        console.log(`   ⚠️ Failed: ${failed} videos`);
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

main();
