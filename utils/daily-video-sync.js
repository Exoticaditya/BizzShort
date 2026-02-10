/**
 * BizzShort Daily Video Sync Utility
 * 
 * Automatically fetches new videos from @bizz_short YouTube channel
 * Fetches captions/transcriptions for each video (Hindi or English only)
 * Runs daily at 8:00 AM IST
 * 
 * Flow: Fetch Videos → Fetch Captions → Categorize → Save to DB
 */

const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

// ============ CONFIGURATION ============
const CONFIG = {
    YOUTUBE_API_KEY: process.env.YT_API_KEY || '',
    YOUTUBE_CHANNEL_ID: process.env.YT_CHANNEL_ID || '',
    MAX_YOUTUBE_VIDEOS: 20,
    MONGO_URI: process.env.MONGO_URI || ''
};

// Category mapping based on keywords in title/transcription
const CATEGORY_KEYWORDS = {
    'economy': ['gdp', 'economy', 'inflation', 'growth', 'fiscal', 'economic',
        'production', 'exports', 'import', 'trade', 'rupee', 'forex',
        'rbi', 'reserve bank', 'monetary', 'gst', 'tax', 'budget',
        'agriculture', 'sugar', 'coffee', 'wheat', 'oil price',
        'hydrogen', 'green hydrogen', 'ev sales', 'electric vehicle',
        'solar', 'renewable', 'railway', 'train', 'vande bharat',
        'infrastructure', 'satellite', 'isro'],
    'markets': ['stock', 'market', 'nifty', 'sensex', 'share', 'trading',
        'investor', 'mutual fund', 'fii', 'fpi', 'gold', 'silver',
        'commodity', 'hdfc', 'banking', 'earnings', 'quarter',
        'precious metal', 'market movement', 'monthly decline'],
    'technology': ['ai', 'tech', 'digital', 'software', 'data', 'innovation',
        'semiconductor', 'chip', 'smartphone', 'app', 'startup',
        'fintech', 'upi', 'payment', 'cyber', 'cloud',
        'policy', 'ai policy'],
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
        'industries', 'safety', 'strength', 'precision'],
    'business': ['business', 'company', 'corporate', 'revenue', 'profit',
        'merger', 'acquisition', 'ipo', 'listing', 'retail',
        'e-commerce', 'real estate', 'property']
};

// Client detection keywords
const CLIENT_KEYWORDS = [
    'akona', 'tofu', 'garvik', 'client', 'brand story', 'sponsor',
    'partner', 'featured company', 'company profile', 'startup feature',
    'business spotlight', 'corporate feature', 'introducing',
    'in industries where', 'our product', 'our company', 'we provide',
    'our mission', 'our vision', 'we are a', 'we offer',
    'safety, strength', 'precision matter', 'right equipment',
];

const NEWS_HASHTAGS = ['#bizzshort', '#news', '#breaking', '#update', '#market'];

// Video Model reference
let Video;

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

    // If no news content → likely client
    const newsWords = [
        'government', 'policy', 'parliament', 'minister', 'gdp', 'rbi',
        'stock market', 'nifty', 'sensex', 'budget', 'inflation',
        'missile', 'defence', 'military', 'train', 'railway',
        'who ', 'ukraine', 'russia', 'trump', 'president',
        'hockey', 'coach', 'isro', 'satellite',
    ];
    return !newsWords.some(word => text.includes(word));
}

function formatViews(count) {
    const num = parseInt(count) || 0;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

function formatDuration(isoDuration) {
    if (!isoDuration) return '0:00';
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}


// ============ YOUTUBE CAPTION FETCHER ============

/**
 * Fetches auto-generated captions from YouTube.
 * Prefers: English → Hindi → auto-English → auto-Hindi → any available
 * Does NOT use Urdu — only returns en or hi captions.
 */
function fetchYouTubeTranscript(videoId) {
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

                    // Priority: en → hi → a.en (auto-English) → a.hi (auto-Hindi)
                    // NEVER pick Urdu (ur)
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

                    // If none of the preferred found, use first available BUT skip Urdu
                    if (!captionUrl) {
                        for (const track of captionData) {
                            if (track.baseUrl && track.languageCode !== 'ur') {
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


// ============ YOUTUBE API FETCHER ============

async function fetchYouTubeVideos() {
    if (!CONFIG.YOUTUBE_API_KEY || !CONFIG.YOUTUBE_CHANNEL_ID) {
        console.log('⚠️  YouTube API key or Channel ID not configured');
        console.log('   Set YT_API_KEY and YT_CHANNEL_ID in your .env file');
        return [];
    }

    return new Promise((resolve) => {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.YOUTUBE_API_KEY}&channelId=${CONFIG.YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=${CONFIG.MAX_YOUTUBE_VIDEOS}&type=video`;

        https.get(searchUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error) {
                        console.error('   YouTube API Error:', response.error.message);
                        resolve([]);
                        return;
                    }
                    if (!response.items || response.items.length === 0) {
                        console.log('   No YouTube videos found');
                        resolve([]);
                        return;
                    }

                    const videoIds = response.items.map(v => v.id.videoId);
                    const details = await fetchYouTubeVideoDetails(videoIds);
                    resolve(details);
                } catch (error) {
                    console.error('   YouTube parse error:', error.message);
                    resolve([]);
                }
            });
        }).on('error', error => {
            console.error('   YouTube fetch error:', error.message);
            resolve([]);
        });
    });
}

function fetchYouTubeVideoDetails(videoIds) {
    return new Promise((resolve) => {
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${CONFIG.YOUTUBE_API_KEY}&id=${videoIds.join(',')}&part=snippet,contentDetails,statistics`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data).items || []);
                } catch { resolve([]); }
            });
        }).on('error', () => resolve([]));
    });
}


// ============ DATABASE ============

async function connectDatabase() {
    if (!CONFIG.MONGO_URI) {
        console.log('⚠️  MongoDB URI not configured');
        return false;
    }
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(CONFIG.MONGO_URI);
            console.log('✅ Connected to MongoDB');
        }
        try { Video = mongoose.model('Video'); }
        catch { Video = require('../models/Video'); }
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        return false;
    }
}

async function syncVideosToDatabase(processedVideos) {
    if (!Video) {
        console.log('⚠️  Video model not available, skipping database sync');
        return { added: 0, updated: 0, transcribed: 0 };
    }

    let added = 0, updated = 0, transcribed = 0;

    for (const video of processedVideos) {
        try {
            const existing = await Video.findOne({ source: 'youtube', videoId: video.videoId });

            if (existing) {
                // Update existing: views, and add transcription if missing
                const updateFields = {
                    views: video.views,
                    updatedAt: new Date()
                };
                if (video.transcription && (!existing.transcription || existing.transcription.length < 30)) {
                    updateFields.transcription = video.transcription;
                    updateFields.description = video.transcription;
                    updateFields.category = video.category;
                    updateFields.videoType = video.videoType;
                    updateFields.section = video.section;
                    transcribed++;
                }
                await Video.updateOne({ _id: existing._id }, { $set: updateFields });
                updated++;
            } else {
                // Insert new video
                await Video.create({
                    videoId: video.videoId,
                    title: video.title,
                    description: video.transcription || video.description,
                    transcription: video.transcription || '',
                    category: video.category,
                    videoType: video.videoType,
                    section: video.section,
                    source: 'youtube',
                    thumbnail: video.thumbnail,
                    views: video.views,
                    duration: video.duration,
                    date: video.date,
                    featured: video.featured || false,
                    tags: [video.category],
                    createdAt: video.publishedAt || new Date(),
                    updatedAt: new Date()
                });
                added++;
                if (video.transcription) transcribed++;
            }
        } catch (error) {
            console.error(`   ❌ Error syncing ${video.videoId}: ${error.message}`);
        }
    }

    return { added, updated, transcribed };
}


// ============ MAIN SYNC ============

async function runDailySync() {
    const startTime = Date.now();
    console.log('\n🔄 ═══════════════════════════════════════════════════');
    console.log('   BizzShort Daily Video Sync (with Transcription)');
    console.log(`   Started: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.log('═══════════════════════════════════════════════════════\n');

    const dbConnected = await connectDatabase();

    // Step 1: Fetch latest videos from YouTube API
    console.log('📡 Step 1: Fetching latest videos from YouTube...');
    const videoDetails = await fetchYouTubeVideos();
    console.log(`   Found ${videoDetails.length} videos\n`);

    if (videoDetails.length === 0) {
        console.log('⚠️  No videos fetched. Aborting sync.');
        return { success: false, reason: 'no_videos' };
    }

    // Step 2: Fetch transcriptions for each video
    console.log('🎤 Step 2: Fetching transcriptions (captions)...\n');
    const processedVideos = [];
    let transcriptionCount = 0;

    for (let i = 0; i < videoDetails.length; i++) {
        const detail = videoDetails[i];
        const videoId = detail.id;
        const title = detail.snippet.title;
        const num = `${String(i + 1).padStart(2, '0')}/${videoDetails.length}`;

        console.log(`[${num}] 🎬 ${title.substring(0, 60)}...`);

        // Fetch YouTube auto-captions (en/hi only, no Urdu)
        const { text: transcript, lang } = await fetchYouTubeTranscript(videoId);

        if (transcript) {
            console.log(`      ✅ Got transcript (${lang}, ${transcript.length} chars)`);
            transcriptionCount++;
        } else {
            console.log(`      ⚠️  No captions available`);
        }

        // Categorize based on title + transcription
        const category = categorizeVideo(title, transcript || '');
        const isClient = isClientVideo(title, transcript || '');
        const videoType = isClient ? 'client' : 'news';

        processedVideos.push({
            videoId,
            title,
            description: detail.snippet.description?.substring(0, 200) || '',
            transcription: transcript || '',
            category,
            videoType,
            section: '', // assigned below
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            views: formatViews(detail.statistics?.viewCount || 0),
            duration: formatDuration(detail.contentDetails?.duration),
            date: new Date(detail.snippet.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            }),
            publishedAt: new Date(detail.snippet.publishedAt),
            featured: false,
            tags: detail.snippet.tags || []
        });

        // Small delay to avoid YouTube rate limiting
        await new Promise(r => setTimeout(r, 800));
    }

    console.log(`\n📊 Transcriptions fetched: ${transcriptionCount}/${processedVideos.length}\n`);

    // Step 3: Assign sections (6 breaking / 6 client / rest latest)
    console.log('📌 Step 3: Assigning sections...');
    const clientVids = processedVideos.filter(v => v.videoType === 'client');
    const newsVids = processedVideos.filter(v => v.videoType === 'news');

    let sectionCounts = { 'breaking-news': 0, 'client-features': 0, 'latest-updates': 0 };

    // Assign client features (up to 6)
    for (const v of clientVids.slice(0, 6)) {
        v.section = 'client-features';
        sectionCounts['client-features']++;
    }
    // Extra clients → latest updates
    for (const v of clientVids.slice(6)) {
        v.section = 'latest-updates';
        sectionCounts['latest-updates']++;
    }

    // Assign breaking news (first 6 news)
    for (const v of newsVids.slice(0, 6)) {
        v.section = 'breaking-news';
        v.featured = sectionCounts['breaking-news'] === 0;
        sectionCounts['breaking-news']++;
    }
    // Rest of news → latest updates
    for (const v of newsVids.slice(6)) {
        v.section = 'latest-updates';
        sectionCounts['latest-updates']++;
    }

    // Fill up client slots from news if needed
    if (sectionCounts['client-features'] < 6) {
        const needed = 6 - sectionCounts['client-features'];
        const latestNews = processedVideos.filter(v => v.section === 'latest-updates');
        for (const v of latestNews.slice(-needed)) {
            v.section = 'client-features';
            v.videoType = 'client';
            sectionCounts['client-features']++;
            sectionCounts['latest-updates']--;
        }
    }

    console.log(`   📰 Breaking News: ${sectionCounts['breaking-news']}`);
    console.log(`   🎯 Client Features: ${sectionCounts['client-features']}`);
    console.log(`   📋 Latest Updates: ${sectionCounts['latest-updates']}\n`);

    // Step 4: Save to database
    let syncResult = { added: 0, updated: 0, transcribed: 0 };
    if (dbConnected) {
        console.log('💾 Step 4: Syncing to database...');
        syncResult = await syncVideosToDatabase(processedVideos);
        console.log(`   New: ${syncResult.added} | Updated: ${syncResult.updated} | Transcribed: ${syncResult.transcribed}\n`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('✅ ═══════════════════════════════════════════════════');
    console.log(`   Sync completed in ${duration}s`);
    console.log(`   Videos: ${processedVideos.length} | Transcribed: ${transcriptionCount}`);
    console.log('═══════════════════════════════════════════════════════\n');

    return {
        success: true,
        total: processedVideos.length,
        transcribed: transcriptionCount,
        dbAdded: syncResult.added,
        dbUpdated: syncResult.updated,
        dbTranscribed: syncResult.transcribed,
        duration: parseFloat(duration)
    };
}


// ============ SCHEDULER — 8:00 AM IST DAILY ============

function scheduleDaily8AM() {
    const now = new Date();
    const target = new Date();

    // 8:00 AM IST = 2:30 AM UTC
    target.setUTCHours(2, 30, 0, 0);

    // If already past 8 AM IST today, schedule for tomorrow
    if (now > target) {
        target.setDate(target.getDate() + 1);
    }

    const msUntilTarget = target - now;
    const hoursUntil = (msUntilTarget / (1000 * 60 * 60)).toFixed(2);

    console.log(`⏰ Next video sync: ${target.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST (in ${hoursUntil}h)`);

    setTimeout(async () => {
        try {
            await runDailySync();
        } catch (err) {
            console.error('❌ Scheduled sync failed:', err.message);
        }
        // Reschedule for next day
        scheduleDaily8AM();
    }, msUntilTarget);
}


// ============ API HELPER ============

async function getVideosForAPI(category = null, source = null, limit = 20) {
    const connected = await connectDatabase();
    if (connected && Video) {
        const query = {};
        if (category) query.category = category;
        if (source) query.source = source;
        return Video.find(query).sort({ createdAt: -1 }).limit(limit);
    }
    return [];
}


// ============ EXPORTS ============

module.exports = {
    runDailySync,
    scheduleDaily8AM,
    getVideosForAPI,
    categorizeVideo,
    fetchYouTubeTranscript
};


// ============ CLI ============

if (require.main === module) {
    console.log('🚀 Running manual sync...\n');
    runDailySync().then(result => {
        console.log('\nResult:', JSON.stringify(result, null, 2));
        process.exit(0);
    }).catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}
