// populate_real_data.js
const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

const realData = {
    articles: [
        {
            title: "Tata Group and Intel Announce Strategic Alliance for Semiconductor Manufacturing",
            category: "Technology",
            author: "Business Desk",
            content: "Tata Group and Intel Corporation announced a strategic alliance to explore collaboration in consumer and enterprise hardware enablement, and semiconductor and systems manufacturing to support India's domestic semiconductor ecosystem.",
            date: "2025-12-08"
        },
        {
            title: "Microsoft Announces $17.5 Billion Investment in India's AI Infrastructure",
            category: "Technology",
            author: "Tech Reporter",
            content: "Microsoft announced its largest investment in Asia, committing US$17.5 billion over four years (CY 2026 to 2029) to advance India's cloud and artificial intelligence (AI) infrastructure.",
            date: "2025-12-12"
        },
        {
            title: "Sensex Surges to 85,221 as Markets Break Three-Day Losing Streak",
            category: "Markets",
            author: "Market Analyst",
            content: "Indian equity indices broke a three-day losing streak, with the Nifty closing near 25,900 and the Sensex at 84,818.13, both supported by positive global cues.",
            date: "2025-12-12"
        },
        {
            title: "India's Wealth Creation Reaches ₹148 Trillion from 2020-2025",
            category: "Economy",
            author: "Economic Affairs",
            content: "India's wealth creation reached ₹148 trillion from 2020-2025, with Bharti Airtel leading the wealth creation charts.",
            date: "2025-12-10"
        }
    ],
    events: [
        {
            name: "E-Summit 2025: Asia's Largest Business Conclave",
            date: "2025-12-11",
            location: "IIT Bombay, Mumbai",
            description: "Asia's largest business conclave, focusing on groundbreaking ideas and visionary solutions."
        },
        {
            name: "Bengaluru Tech Summit 2025",
            date: "2025-11-19",
            location: "Bangalore Palace Grounds",
            description: "A broad-based technology summit covering IT, innovation, IoT, and digital transformation."
        }
    ],
    interviews: [
        {
            name: "Roshni Nadar Malhotra",
            title: "Chairperson",
            company: "HCLTech",
            description: "Discussing India's AI Future and Women's Leadership in Tech at Davos 2024."
        },
        {
            name: "Satya Nadella",
            title: "Chairman & CEO",
            company: "Microsoft",
            description: "Microsoft's Commitment to India's Digital Transformation and AI investment."
        }
    ],
    industry: [
        {
            sector: "Semiconductor",
            title: "India's Semiconductor Push Gains Momentum",
            description: "With Tata-Intel alliance and government incentives, India is positioning itself as a major hub.",
            growth: "+150% by 2027"
        }
    ],
    clients: [
        { name: "Tata Group", type: "Strategic Partner" },
        { name: "Reliance Industries", type: "Premium Partner" }
    ]
};

function postData(endpoint, data) {
    return new Promise((resolve, reject) => {
        const dataStr = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/${endpoint}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataStr.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`✅ [${endpoint}] Created: ${data.title || data.name}`);
                    resolve(true);
                } else {
                    console.error(`❌ [${endpoint}] Failed (${res.statusCode}):`, body);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`🔥 [${endpoint}] Error:`, e.message);
            resolve(false);
        });

        req.write(dataStr);
        req.end();
    });
}

async function run() {
    console.log('🚀 Starting Data Population...');
    for (const key in realData) {
        for (const item of realData[key]) {
            await postData(key, item);
        }
    }
    console.log('✨ Done!');
}

run();
