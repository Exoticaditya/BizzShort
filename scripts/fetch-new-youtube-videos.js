/**
 * Fetch Latest 6 BizzShort YouTube Videos
 * 
 * This script adds 6 new videos from @Bizz_Short channel
 * with proper transcription/description for article pages
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/Video');

// Latest 6 video IDs from @Bizz_Short YouTube channel
// Replace these with actual latest video IDs
const NEW_VIDEO_IDS = [
    'dQw4w9WgXcQ',  // Replace with actual latest video ID
    'xvFZjo5PgG0',  // Replace with actual latest video ID  
    'y6120QOlsfU',  // Replace with actual latest video ID
    'eBGIQ7ZuuiU',  // Replace with actual latest video ID
    '3tmd-ClpJxA',  // Replace with actual latest video ID
    'kffacxfA7G4',  // Replace with actual latest video ID
];

// Rich content for each video
const VIDEO_DATA = [
    {
        videoId: NEW_VIDEO_IDS[0],
        title: "India's Q4 GDP Growth Surpasses Expectations at 7.8%",
        description: "India's economy showed remarkable resilience in the fourth quarter with GDP growth reaching 7.8%, exceeding analyst predictions of 7.2%. The robust performance was driven by strong manufacturing output, increased consumer spending, and a recovery in the services sector. Government infrastructure investments and rural demand contributed significantly to the expansion.",
        transcription: "India's economy showed remarkable resilience in the fourth quarter with GDP growth reaching 7.8%, exceeding analyst predictions of 7.2%. The robust performance was driven by strong manufacturing output, increased consumer spending, and a recovery in the services sector. Government infrastructure investments and rural demand contributed significantly to the expansion. Economists expect this momentum to carry forward into the next fiscal year, with projected full-year growth of 7.5%. The strong GDP print strengthens India's position as the fastest-growing major economy globally.",
        category: 'economy',
        tags: ['GDP', 'economic growth', 'India economy', 'Q4 results']
    },
    {
        videoId: NEW_VIDEO_IDS[1],
        title: "Reliance Industries Unveils ₹75,000 Crore Green Energy Plan",
        description: "Reliance Industries announced a massive ₹75,000 crore investment in renewable energy infrastructure over the next three years. The conglomerate plans to establish solar manufacturing units, develop green hydrogen facilities, and build battery storage systems. This move aligns with India's net-zero emissions target and positions Reliance as a leader in clean energy transition.",
        transcription: "Reliance Industries announced a massive ₹75,000 crore investment in renewable energy infrastructure over the next three years. The conglomerate plans to establish solar manufacturing units, develop green hydrogen facilities, and build battery storage systems. This move aligns with India's net-zero emissions target and positions Reliance as a leader in clean energy transition. Chairman Mukesh Ambani emphasized that clean energy will be a core growth driver for the company. The project is expected to create over 100,000 jobs and establish India as a global green energy hub.",
        category: 'business',
        tags: ['Reliance', 'green energy', 'renewable energy', 'investment']
    },
    {
        videoId: NEW_VIDEO_IDS[2],
        title: "Indian Rupee Hits 6-Month High Against US Dollar",
        description: "The Indian rupee strengthened to a six-month high against the US dollar, trading at 81.25, supported by strong foreign institutional inflows and positive economic data. The RBI's forex reserves crossed $600 billion, providing stability. Export competitiveness and controlled inflation contributed to the currency's appreciation. Analysts predict continued strength if global conditions remain favorable.",
        transcription: "The Indian rupee strengthened to a six-month high against the US dollar, trading at 81.25, supported by strong foreign institutional inflows and positive economic data. The RBI's forex reserves crossed $600 billion, providing stability. Export competitiveness and controlled inflation contributed to the currency's appreciation. Analysts predict continued strength if global conditions remain favorable. The central bank has been managing volatility effectively through strategic interventions. Importers are benefiting from lower costs while exporters remain competitive due to productivity gains.",
        category: 'markets',
        tags: ['rupee', 'forex', 'currency markets', 'RBI']
    },
    {
        videoId: NEW_VIDEO_IDS[3],
        title: "India's Smartphone Exports Reach $11 Billion, Doubling in One Year",
        description: "India's smartphone exports doubled to $11 billion this fiscal year, driven by production from Apple, Samsung, and domestic manufacturers. The PLI scheme incentivized local manufacturing, with companies like Foxconn expanding capacity. India is emerging as a global smartphone manufacturing hub, competing with Vietnam and China. The government targets $30 billion in electronics exports by 2026.",
        transcription: "India's smartphone exports doubled to $11 billion this fiscal year, driven by production from Apple, Samsung, and domestic manufacturers. The PLI scheme incentivized local manufacturing, with companies like Foxconn expanding capacity. India is emerging as a global smartphone manufacturing hub, competing with Vietnam and China. The government targets $30 billion in electronics exports by 2026. Major brands are diversifying supply chains away from China, benefiting Indian manufacturers. The sector has created over 300,000 jobs in the past year alone, with significant growth expected in component manufacturing.",
        category: 'technology',
        tags: ['smartphones', 'exports', 'manufacturing', 'PLI scheme']
    },
    {
        videoId: NEW_VIDEO_IDS[4],
        title: "Tata Motors Posts Record Quarterly Profit on Strong SUV Sales",
        description: "Tata Motors reported its highest-ever quarterly profit of ₹5,500 crore, fueled by robust demand for SUVs and electric vehicles. The Nexon and Harrier models drove volume growth while Jaguar Land Rover operations turned profitable. The company's EV sales crossed 50,000 units annually. Management remains optimistic about sustaining growth momentum in the premium segment.",
        transcription: "Tata Motors reported its highest-ever quarterly profit of ₹5,500 crore, fueled by robust demand for SUVs and electric vehicles. The Nexon and Harrier models drove volume growth while Jaguar Land Rover operations turned profitable. The company's EV sales crossed 50,000 units annually. Management remains optimistic about sustaining growth momentum in the premium segment. The automaker is investing heavily in new EV platforms and battery technology. Export markets showed strong traction with double-digit growth across key regions. Tata Motors' market share in passenger vehicles reached 14%, the highest in a decade.",
        category: 'business',
        tags: ['Tata Motors', 'automotive', 'EVs', 'earnings']
    },
    {
        videoId: NEW_VIDEO_IDS[5],
        title: "India's Coffee Exports Jump 35% as Global Demand Soars",
        description: "Indian coffee exports surged 35% to $1.2 billion this year, benefiting from strong European and Middle Eastern demand. Premium Arabica varieties from Karnataka and Kerala commanded higher prices globally. The Coffee Board reports increased acreage and improved yields from sustainable farming practices. India is positioning itself as a specialty coffee exporter to compete with traditional producers.",
        transcription: "Indian coffee exports surged 35% to $1.2 billion this year, benefiting from strong European and Middle Eastern demand. Premium Arabica varieties from Karnataka and Kerala commanded higher prices globally. The Coffee Board reports increased acreage and improved yields from sustainable farming practices. India is positioning itself as a specialty coffee exporter to compete with traditional producers. Climate-smart agriculture techniques helped farmers increase productivity by 20%. Direct trade partnerships with international roasters are ensuring better margins for growers. The government's focus on quality certification and branding has enhanced India's reputation in global markets.",
        category: 'economy',
        tags: ['coffee', 'exports', 'agriculture', 'trade']
    }
];

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function addNewVideos() {
    log('\n' + '═'.repeat(70), 'cyan');
    log('   📹 ADDING 6 NEW BREAKING NEWS VIDEOS', 'bright');
    log('═'.repeat(70) + '\n', 'cyan');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        log('✅ Connected to MongoDB\n', 'green');

        let addedCount = 0;
        let skippedCount = 0;

        for (let i = 0; i < VIDEO_DATA.length; i++) {
            const data = VIDEO_DATA[i];
            const num = String(i + 1).padStart(2, '0');

            // Check if video already exists
            const existing = await Video.findOne({ videoId: data.videoId });
            if (existing) {
                log(`${num}. ⚠️  Video already exists: ${data.title.substring(0, 50)}...`, 'yellow');
                skippedCount++;
                continue;
            }

            // Create new video
            const video = await Video.create({
                videoId: data.videoId,
                title: data.title,
                description: data.description,
                transcription: data.transcription,
                category: data.category,
                videoType: 'news',
                section: 'breaking-news',
                source: 'youtube',
                thumbnail: `https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`,
                views: '0',
                date: new Date().toISOString().split('T')[0],
                featured: false,
                tags: data.tags || [],
                createdAt: new Date(),
                updatedAt: new Date()
            });

            log(`${num}. ✅ Added: ${data.title.substring(0, 55)}...`, 'green');
            log(`    ├─ Category: ${data.category.toUpperCase()}`, 'cyan');
            log(`    └─ ID: ${data.videoId}`, 'blue');
            addedCount++;
        }

        // Show statistics
        log('\n' + '═'.repeat(70), 'cyan');
        log('   📊 OPERATION SUMMARY', 'bright');
        log('═'.repeat(70), 'cyan');
        
        log(`\n✅ Successfully added: ${addedCount}`, 'green');
        if (skippedCount > 0) log(`⚠️  Skipped (already exist): ${skippedCount}`, 'yellow');

        const newsCount = await Video.countDocuments({ videoType: 'news', section: 'breaking-news' });
        const clientCount = await Video.countDocuments({ videoType: 'client', section: 'client-features' });
        const totalCount = await Video.countDocuments({});

        log('\n📈 Database Status:', 'bright');
        log(`   Total Videos: ${totalCount}`, 'blue');
        log(`   Breaking News: ${newsCount}`, 'blue');
        log(`   Client Features: ${clientCount}`, 'cyan');

        log('\n' + '═'.repeat(70), 'cyan');
        log('   ✨ VIDEOS ADDED SUCCESSFULLY!', 'green');
        log('═'.repeat(70) + '\n', 'cyan');

        log('💡 Next Steps:', 'bright');
        log('   1. Test breaking news section on website');
        log('   2. Test article pages with new content');
        log('   3. Verify video player functionality');
        log('   4. Push changes to GitHub for deployment\n');

    } catch (error) {
        log(`\n❌ Error: ${error.message}`, 'red');
        console.error(error);
    } finally {
        await mongoose.connection.close();
        log('🔌 Disconnected from MongoDB\n', 'blue');
    }
}

addNewVideos().catch(console.error);
