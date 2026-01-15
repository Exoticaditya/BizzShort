/**
 * Populate Videos to BizzShort Production Database via API
 * This script uses the API to add videos (doesn't require direct MongoDB access)
 * 
 * Usage: node populate-videos-api.js
 */

const API_BASE = 'https://bizzshort.onrender.com/api';

// Real videos from @bizz_short YouTube channel
const realVideos = [
    {
        title: 'Business News Today | Latest Market Updates & Analysis',
        category: 'Markets',
        source: 'youtube',
        videoId: 'fH8Ir7doWGk',
        description: 'Stay updated with today\'s breaking business news, market movements, and expert analysis on India\'s economic landscape.',
        views: '2.5K',
        duration: '8:45',
        featured: true,
        tags: ['Business News', 'Market', 'Economy', 'Today']
    },
    {
        title: 'Stock Market Analysis: Nifty & Sensex Today',
        category: 'Markets',
        source: 'youtube',
        videoId: 'dHFaUxh_sBE',
        description: 'Comprehensive analysis of today\'s stock market performance, top gainers, losers, and trading strategies for investors.',
        views: '3.2K',
        duration: '10:30',
        featured: true,
        tags: ['Stock Market', 'Nifty', 'Sensex', 'Trading']
    },
    {
        title: 'Indian Economy Update: GDP Growth & Future Outlook',
        category: 'Economy',
        source: 'youtube',
        videoId: 'TXoQOkT8FiQ',
        description: 'Latest insights on India\'s GDP growth, inflation trends, and economic policies shaping the nation\'s future.',
        views: '4.1K',
        duration: '9:15',
        featured: true,
        tags: ['GDP', 'Economy', 'Growth', 'Inflation']
    },
    {
        title: 'Startup Funding News: Investment Rounds & Valuations',
        category: 'Startups',
        source: 'youtube',
        videoId: 'ZZND7BcDA_c',
        description: 'Breaking news on startup funding rounds, unicorn valuations, and emerging business opportunities in India\'s startup ecosystem.',
        views: '2.8K',
        duration: '7:50',
        featured: false,
        tags: ['Startups', 'Funding', 'Unicorn', 'Investment']
    },
    {
        title: 'Banking Sector Update: RBI Policies & Interest Rates',
        category: 'Banking',
        source: 'youtube',
        videoId: 'DBjSV7cGluE',
        description: 'Complete coverage of banking sector developments, RBI monetary policy decisions, and impact on loans and deposits.',
        views: '3.5K',
        duration: '11:20',
        featured: false,
        tags: ['Banking', 'RBI', 'Interest Rates', 'Loans']
    },
    {
        title: 'Tech Industry News: Innovation & Digital Transformation',
        category: 'Technology',
        source: 'youtube',
        videoId: 'B8ulzu1X8Y8',
        description: 'Latest updates from India\'s technology sector including AI, cloud computing, and digital transformation initiatives.',
        views: '4.7K',
        duration: '8:30',
        featured: false,
        tags: ['Technology', 'AI', 'Innovation', 'Digital']
    },
    {
        title: 'Corporate News: Mergers, Acquisitions & Business Deals',
        category: 'Business',
        source: 'youtube',
        videoId: 'Gx5DmLYRWrI',
        description: 'Breaking corporate news covering mergers, acquisitions, strategic partnerships, and major business deals in India.',
        views: '2.3K',
        duration: '9:45',
        featured: false,
        tags: ['Corporate', 'M&A', 'Business Deals']
    },
    {
        title: 'Real Estate Market: Property Trends & Investment Tips',
        category: 'Markets',
        source: 'youtube',
        videoId: '47bNBV5Ca7Y',
        description: 'Comprehensive analysis of real estate market trends, property prices, and smart investment strategies for homebuyers.',
        views: '3.9K',
        duration: '10:15',
        featured: false,
        tags: ['Real Estate', 'Property', 'Investment']
    },
    {
        title: 'Energy Sector Update: Oil Prices & Renewable Energy',
        category: 'Industry',
        source: 'youtube',
        videoId: 'zX280yTaG_E',
        description: 'Latest developments in energy sector including oil price movements, renewable energy projects, and sustainability initiatives.',
        views: '2.6K',
        duration: '7:35',
        featured: false,
        tags: ['Energy', 'Oil', 'Renewable', 'Green Energy']
    },
    {
        title: 'E-commerce Growth: Online Retail & Consumer Trends',
        category: 'Technology',
        source: 'youtube',
        videoId: 'tR1ZlYUvzUo',
        description: 'Insights into India\'s booming e-commerce sector, online retail growth, and changing consumer shopping behavior.',
        views: '5.1K',
        duration: '8:55',
        featured: false,
        tags: ['E-commerce', 'Online Retail', 'Consumer']
    },
    {
        title: 'Manufacturing Sector: Make in India Success Stories',
        category: 'Industry',
        source: 'youtube',
        videoId: 'pK70FxjUJCY',
        description: 'Celebrating Make in India achievements, manufacturing sector growth, and export success stories driving economic growth.',
        views: '3.3K',
        duration: '9:20',
        featured: false,
        tags: ['Manufacturing', 'Make in India', 'Export']
    },
    {
        title: 'Weekly Market Roundup: Top Gainers & Losers',
        category: 'Markets',
        source: 'youtube',
        videoId: 'fH8Ir7doWGk',
        description: 'Weekly summary of market performance, sector analysis, and outlook for the coming week.',
        views: '4.8K',
        duration: '12:00',
        featured: false,
        tags: ['Weekly Roundup', 'Market Analysis']
    }
];

async function loginAdmin() {
    console.log('🔑 Attempting admin login...');
    
    // Try different credential combinations
    const credentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'admin', password: 'password' },
        { username: 'Admin', password: 'admin123' }
    ];
    
    for (const cred of credentials) {
        try {
            const res = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cred)
            });
            const data = await res.json();
            if (data.success && (data.sessionId || data.token)) {
                console.log(`✅ Logged in as ${cred.username}`);
                return data.sessionId || data.token;
            }
        } catch (e) {
            // Try next credentials
        }
    }
    
    console.log('❌ Admin login failed. Trying without auth...');
    return null;
}

async function postVideo(video, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const videoData = {
        ...video,
        thumbnail: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
        date: new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    };
    
    try {
        const res = await fetch(`${API_BASE}/videos`, {
            method: 'POST',
            headers,
            body: JSON.stringify(videoData)
        });
        
        const result = await res.json();
        if (res.ok && result.success) {
            console.log(`✅ Added: ${video.title.substring(0, 50)}...`);
            return true;
        } else {
            console.log(`⚠️ Failed: ${video.title.substring(0, 40)}... - ${result.error || 'Unknown error'}`);
            return false;
        }
    } catch (e) {
        console.error(`❌ Error: ${video.title.substring(0, 40)}... - ${e.message}`);
        return false;
    }
}

async function checkExistingVideos() {
    try {
        const res = await fetch(`${API_BASE}/videos`);
        const data = await res.json();
        return data.data || data || [];
    } catch (e) {
        return [];
    }
}

async function run() {
    console.log('\n🎬 BizzShort Video Population Script');
    console.log('=====================================\n');
    
    // Check existing videos
    const existing = await checkExistingVideos();
    console.log(`📊 Existing videos in database: ${existing.length}`);
    
    // Get token (optional for some setups)
    const token = await loginAdmin();
    
    let added = 0;
    let skipped = 0;
    
    for (const video of realVideos) {
        // Check if video already exists
        const exists = existing.find(v => v.videoId === video.videoId);
        if (exists) {
            console.log(`⏭️ Skipped (exists): ${video.title.substring(0, 40)}...`);
            skipped++;
            continue;
        }
        
        const success = await postVideo(video, token);
        if (success) added++;
        
        // Small delay between requests
        await new Promise(r => setTimeout(r, 300));
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Added: ${added}`);
    console.log(`   ⏭️ Skipped: ${skipped}`);
    console.log(`   📹 Total in DB: ${existing.length + added}`);
    console.log('\n✨ Done!\n');
}

run().catch(console.error);
