/**
 * BizzShort Video Database Rebuild Script
 * 
 * This script:
 * 1. Clears all existing videos from the database
 * 2. Fetches fresh videos from @bizz_short YouTube channel via RSS
 * 3. Fetches transcriptions (English or Hindi only, no Urdu)
 * 4. Categorizes videos (client vs news)
 * 5. Assigns to proper sections (breaking-news, client-features, latest-updates)
 * 6. Saves to database and generates new seed-videos.json
 * 
 * Usage: node scripts/rebuild-video-database.js
 */

const https = require('https');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ============ CONFIGURATION ============
const YOUTUBE_HANDLE = '@bizz_short';
const MAX_VIDEOS = 50; // Increased to get more client videos

// Category keywords
const CATEGORY_KEYWORDS = {
    'economy': ['gdp', 'economy', 'inflation', 'growth', 'fiscal', 'economic',
        'production', 'exports', 'import', 'trade', 'rupee', 'forex',
        'rbi', 'reserve bank', 'monetary', 'gst', 'tax', 'budget',
        'agriculture', 'sugar', 'coffee', 'wheat', 'oil price',
        'hydrogen', 'green hydrogen', 'ev sales', 'electric vehicle',
        'solar', 'renewable', 'railway', 'train', 'vande bharat',
        'infrastructure', 'satellite', 'isro', 'green energy'],
    'markets': ['stock', 'market', 'nifty', 'sensex', 'share', 'trading',
        'investor', 'mutual fund', 'fii', 'fpi', 'gold', 'silver',
        'commodity', 'hdfc', 'banking', 'earnings', 'quarter',
        'precious metal', 'market movement', 'monthly decline'],
    'technology': ['ai', 'tech', 'digital', 'software', 'data', 'innovation',
        'semiconductor', 'chip', 'smartphone', 'app', 'startup',
        'fintech', 'upi', 'payment', 'cyber', 'cloud', 'policy', 'ai policy'],
    'defence': ['missile', 'defence', 'defense', 'military', 'army', 'navy',
        'air force', 'f-35', 'ballistic', 'pralay', 'weapon',
        'war', 'peace talks', 'bombardment', 'ukraine', 'russia',
        'nato', 'geopolitical', 'iran', 'diplomatic', 'trump'],
    'sports': ['hockey', 'cricket', 'coach', 'sports', 'player', 'team',
        'tournament', 'olympics', 'governance act'],
    'health': ['who', 'nipah', 'virus', 'health', 'medical', 'pandemic',
        'disease', 'hospital'],
    'industry': ['manufacturing', 'steel', 'pharma', 'automotive', 'aviation',
        'energy', 'construction', 'cement', 'chemical',
        'industries', 'safety', 'strength', 'precision', 'equipment',
        'cargo', 'lifting', 'ferriero'],
    'business': ['business', 'company', 'corporate', 'revenue', 'profit',
        'merger', 'acquisition', 'ipo', 'listing', 'retail',
        'e-commerce', 'real estate', 'property', 'cooperation', 'anti-terror']
};

// Client detection keywords
const CLIENT_KEYWORDS = [
    'in industries where', 'safety, strength', 'precision matter',
    'right equipment', 'our product', 'our company', 'we provide',
    'ferriero', 'cargo', 'lifting solutions', 'manufactured with',
    'global craftsmanship', 'trusted manufacturing', 'call us today',
    'visit www', 'email us', 'company profile'
];

const NEWS_HASHTAGS = ['#bizzshort', '#news', '#breaking', '#update'];

// ============ UTILITY FUNCTIONS ============

function categorizeVideo(title, transcription = '') {
    const text = (title + ' ' + transcription).toLowerCase();
    const scores = {};
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        scores[category] = keywords.filter(kw => text.includes(kw)).length;
    }
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return (best && best[1] > 0) ? best[0] : 'business';
}

function isClientVideo(title, transcription = '') {
    const titleLower = (title || '').toLowerCase();
    const text = titleLower + ' ' + (transcription || '').toLowerCase();

    // If has BizzShort news hashtags → it's news
    if (NEWS_HASHTAGS.some(tag => titleLower.includes(tag))) return false;

    // Check for client keywords
    if (CLIENT_KEYWORDS.some(kw => text.includes(kw))) return true;

    // If no news content → might be client
    const newsWords = [
        'government', 'policy', 'minister', 'gdp', 'rbi', 'bank',
        'stock market', 'nifty', 'sensex', 'budget', 'inflation',
        'missile', 'defence', 'military', 'ukraine', 'russia', 'trump',
        'who ', 'virus', 'health'
    ];
    return !newsWords.some(word => text.includes(word));
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ============ YOUTUBE FUNCTIONS ============

async function getChannelId(handle) {
    return new Promise((resolve) => {
        const h = handle.replace('@', '');
        console.log(`🔍 Resolving channel ID for @${h}...`);

        https.get(`https://www.youtube.com/@${h}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let match = data.match(/"channelId":"(UC[\w-]+)"/);
                if (match) {
                    console.log(`✅ Found channel ID: ${match[1]}`);
                    resolve(match[1]);
                    return;
                }
                match = data.match(/"externalId":"(UC[\w-]+)"/);
                if (match) {
                    console.log(`✅ Found channel ID: ${match[1]}`);
                    resolve(match[1]);
                    return;
                }
                console.log('❌ Could not find channel ID');
                resolve(null);
            });
        }).on('error', () => resolve(null));
    });
}

async function fetchRSS(channelId) {
    return new Promise((resolve) => {
        const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        console.log(`📡 Fetching RSS feed...`);

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    console.log(`❌ RSS fetch failed: ${res.statusCode}`);
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

function parseRSS(xml) {
    const videos = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null && videos.length < MAX_VIDEOS) {
        const entry = match[1];

        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
        const descMatch = entry.match(/<media:description>([^<]*)<\/media:description>/);

        if (titleMatch && videoIdMatch) {
            const videoId = videoIdMatch[1];
            videos.push({
                videoId: videoId,
                title: titleMatch[1],
                description: descMatch ? descMatch[1].substring(0, 200) : '',
                publishedAt: publishedMatch ? publishedMatch[1] : new Date().toISOString(),
                thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
            });
        }
    }

    return videos;
}

// ============ TRANSCRIPTION FETCHER ============

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

async function fetchTranscript(videoId) {
    return new Promise((resolve) => {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        https.get(videoUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const captionMatch = data.match(/"captionTracks":\s*\[(.*?)\]/);
                    if (!captionMatch) {
                        resolve({ text: null, lang: null });
                        return;
                    }

                    const captionData = JSON.parse(`[${captionMatch[1]}]`);

                    // Priority: English → Hindi → Auto-English → Auto-Hindi
                    // NEVER pick Urdu or other languages
                    let captionUrl = null;
                    let captionLang = null;
                    const langPriority = ['en', 'hi', 'a.en', 'a.hi'];

                    for (const lang of langPriority) {
                        const track = captionData.find(t =>
                            t.languageCode === lang ||
                            (t.vssId && t.vssId.includes(lang))
                        );
                        if (track && track.baseUrl) {
                            captionUrl = track.baseUrl;
                            captionLang = lang.replace('a.', '');
                            break;
                        }
                    }

                    // If none found, pick first English/Hindi only
                    if (!captionUrl) {
                        for (const track of captionData) {
                            if (track.baseUrl && (track.languageCode === 'en' || track.languageCode === 'hi')) {
                                captionUrl = track.baseUrl;
                                captionLang = track.languageCode;
                                break;
                            }
                        }
                    }

                    if (!captionUrl) {
                        resolve({ text: null, lang: null });
                        return;
                    }

                    // Fetch caption XML
                    https.get(captionUrl, (captionRes) => {
                        let captionXml = '';
                        captionRes.on('data', chunk => captionXml += chunk);
                        captionRes.on('end', () => {
                            const transcript = parseSubtitles(captionXml);
                            if (transcript && transcript.length > 30) {
                                resolve({ text: transcript, lang: captionLang });
                            } else {
                                resolve({ text: null, lang: null });
                            }
                        });
                    }).on('error', () => resolve({ text: null, lang: null }));

                } catch (error) {
                    resolve({ text: null, lang: null });
                }
            });
        }).on('error', () => resolve({ text: null, lang: null }));
    });
}

// ============ MAIN SCRIPT ============

async function main() {
    console.log('\n🔄 ═══════════════════════════════════════════════════');
    console.log('   BizzShort Video Database Rebuild');
    console.log('═══════════════════════════════════════════════════════\n');

    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.log('❌ MONGO_URI not set in .env file');
        process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const Video = require('../models/Video');

    // Step 1: Clear existing videos
    console.log('🗑️  Step 1: Clearing existing videos...');
    const deleteResult = await Video.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} old videos\n`);

    // Step 2: Fetch fresh videos from RSS
    console.log('📺 Step 2: Fetching fresh videos from YouTube...');
    const channelId = await getChannelId(YOUTUBE_HANDLE);
    if (!channelId) {
        console.log('❌ Could not resolve channel ID');
        process.exit(1);
    }

    const rss = await fetchRSS(channelId);
    if (!rss) {
        console.log('❌ Could not fetch RSS feed');
        process.exit(1);
    }

    const videos = parseRSS(rss);
    console.log(`   Found ${videos.length} videos\n`);

    // Step 3: Fetch transcriptions
    console.log('🎤 Step 3: Fetching transcriptions...\n');
    const processedVideos = [];
    let transcribedCount = 0;
    let englishCount = 0;
    let hindiCount = 0;

    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const num = `${String(i + 1).padStart(2, '0')}/${videos.length}`;
        console.log(`[${num}] ${video.title.substring(0, 70)}...`);

        const { text: transcript, lang } = await fetchTranscript(video.videoId);

        if (transcript) {
            console.log(`      ✅ Transcription: ${lang} (${transcript.length} chars)`);
            transcribedCount++;
            if (lang === 'en') englishCount++;
            if (lang === 'hi') hindiCount++;
        } else {
            console.log(`      ⚠️  No transcription available`);
        }

        // Categorize
        const category = categorizeVideo(video.title, transcript || '');
        const isClient = isClientVideo(video.title, transcript || '');

        processedVideos.push({
            videoId: video.videoId,
            title: video.title,
            description: transcript || video.description,
            transcription: transcript || '',
            category: category,
            videoType: isClient ? 'client' : 'news',
            section: '', // assigned below
            source: 'youtube',
            thumbnail: video.thumbnail,
            views: '0',
            duration: '0',
            date: formatDate(video.publishedAt),
            featured: false,
            tags: [category],
            createdAt: new Date(video.publishedAt),
            updatedAt: new Date()
        });

        // Rate limiting
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n📊 Transcription Summary:`);
    console.log(`   Total: ${transcribedCount}/${videos.length}`);
    console.log(`   English: ${englishCount}`);
    console.log(`   Hindi: ${hindiCount}\n`);

    // Step 4: Assign sections
    console.log('📌 Step 4: Assigning sections...');
    const clientVids = processedVideos.filter(v => v.videoType === 'client');
    const newsVids = processedVideos.filter(v => v.videoType === 'news');

    // Assign client features (up to 6)
    clientVids.slice(0, 6).forEach(v => v.section = 'client-features');
    clientVids.slice(6).forEach(v => v.section = 'latest-updates');

    // Assign breaking news (first 6 news)
    newsVids.slice(0, 6).forEach((v, i) => {
        v.section = 'breaking-news';
        if (i === 0) v.featured = true;
    });
    newsVids.slice(6).forEach(v => v.section = 'latest-updates');

    console.log(`   Breaking News: ${newsVids.slice(0, 6).length}`);
    console.log(`   Client Features: ${clientVids.slice(0, 6).length}`);
    console.log(`   Latest Updates: ${processedVideos.filter(v => v.section === 'latest-updates').length}\n`);

    // Step 5: Save to database
    console.log('💾 Step 5: Saving to database...');
    await Video.insertMany(processedVideos);
    console.log(`   Saved ${processedVideos.length} videos\n`);

    // Step 6: Generate seed file
    console.log('📁 Step 6: Generating seed-videos.json...');
    const seedPath = path.join(__dirname, '..', 'data', 'seed-videos.json');
    const seedData = processedVideos.map(v => ({
        videoId: v.videoId,
        title: v.title,
        description: v.description,
        transcription: v.transcription,
        category: v.category,
        videoType: v.videoType,
        section: v.section,
        source: v.source,
        thumbnail: v.thumbnail,
        views: v.views,
        duration: v.duration,
        date: v.date,
        featured: v.featured,
        tags: v.tags,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt
    }));

    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2));
    console.log(`   Saved to: data/seed-videos.json\n`);

    console.log('✅ ═══════════════════════════════════════════════════');
    console.log('   Video database rebuild complete!');
    console.log(`   Total videos: ${processedVideos.length}`);
    console.log(`   With transcriptions: ${transcribedCount}`);
    console.log(`   English: ${englishCount} | Hindi: ${hindiCount}`);
    console.log('═══════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
