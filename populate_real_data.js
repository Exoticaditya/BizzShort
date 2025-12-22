// populate_real_data.js
// Standard Node.js fetch (Node 18+)
// Usage: node populate_real_data.js [API_URL]
// Example: node populate_real_data.js https://bizzshort.onrender.com/api

const args = process.argv.slice(2);
const BASE_URL = args[0] || 'http://localhost:3000/api';

console.log(`📡 Target API: ${BASE_URL}\n`);

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
            title: "E-Summit 2025: Asia's Largest Business Conclave",
            date: "2025-12-11",
            location: "IIT Bombay, Mumbai",
            description: "Asia's largest business conclave, focusing on groundbreaking ideas and visionary solutions.",
            category: "Conference",
            maxAttendees: 500
        },
        {
            title: "Bengaluru Tech Summit 2025",
            date: "2025-11-19",
            location: "Bangalore Palace Grounds",
            description: "A broad-based technology summit covering IT, innovation, IoT, and digital transformation.",
            category: "Summit",
            maxAttendees: 2000
        }
    ],
    interviews: [
        {
            name: "Roshni Nadar Malhotra",
            designation: "Chairperson",
            company: "HCLTech",
            description: "Discussing India's AI Future and Women's Leadership in Tech at Davos 2024."
        },
        {
            name: "Satya Nadella",
            designation: "Chairman & CEO",
            company: "Microsoft",
            description: "Microsoft's Commitment to India's Digital Transformation and AI investment."
        }
    ],
    industry: [
        {
            sector: "Semiconductor",
            description: "With Tata-Intel alliance and government incentives, India is positioning itself as a major hub."
        }
    ],
    clients: [
        { name: "Tata Group", type: "Corporate" },
        { name: "Reliance Industries", type: "Corporate" }
    ]
};

async function postData(endpoint, data) {
    // Determine admin token logic if needed (skipping for now, assuming public or dev endpoints)
    // If your API is protected, you might need to login first or use a hardcoded DEV bypass.
    // For now, these specific endpoints might be protected.

    // NOTE: If endpoints are protected, we need a token.
    // Let's assume we can login as admin first or endpoints are open for seed?
    // Looking at server.js: some POSTs are protected.
    // We should try to login as admin first.

    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header here if we had a token
                // 'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log(`✅ [${endpoint}] Created: ${data.title || data.name}`);
            return true;
        } else {
            const err = await response.text();
            console.error(`❌ [${endpoint}] Failed (${response.status}):`, err);
            return false;
        }
    } catch (error) {
        console.error(`🔥 [${endpoint}] Error:`, error.message);
        return false;
    }
}

async function loginAdmin() {
    console.log('🔑 Attempting to login/create admin...');
    try {
        const response = await fetch(`${BASE_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });

        const data = await response.json();
        console.log('🔍 Login Response:', JSON.stringify(data));

        if (data.success && data.sessionId) {
            console.log('🔓 Admin Logged In. Using Token.');
            return data.sessionId;
        } else {
            console.log('⚠️ Login Failed. Message:', data.error || data.message);
        }
    } catch (e) {
        console.log('⚠️ Login Exception:', e.message);
    }
    return null;
}

// Wrap original postData to include token
let authToken = null;
async function postDataWithAuth(endpoint, data) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log(`✅ [${endpoint}] Created: ${data.title || data.name}`);
            return true;
        } else {
            const err = await response.text();
            console.error(`❌ [${endpoint}] Failed (${response.status}): ${err}`); // Shortened error
            return false;
        }
    } catch (error) {
        console.error(`🔥 [${endpoint}] Error:`, error.message);
        return false;
    }
}


async function run() {
    console.log('🚀 Starting Data Population...');

    // 1. Try to get a token (will create admin if server is fresh and has that logic enabled)
    // Note: server.js snippet showed: if (!user && username === 'admin'...) -> create default admin.
    authToken = await loginAdmin();

    for (const key in realData) {
        for (const item of realData[key]) {
            await postDataWithAuth(key, item);
        }
    }
    console.log('✨ Done!');
}

run();
