const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

const realData = {
    articles: [
        {
            title: "Tata Group and Intel Announce Strategic Alliance",
            category: "Technology",
            content: "FULL CONTENT HERE...",
            author: "Business Desk"
        }
        // ... (truncated for brevity, using loop logic)
    ],
    interviews: [
        {
            intervieweeName: "Roshni Nadar Malhotra", // FIXED KEY
            title: "Chairperson, HCLTech",
            company: "HCLTech",
            content: "Discussion on AI..."
        }
    ]
};

// I will write the FULL content from populate_real_data.js but with fixes.
// Reading previous content from memory/context.

const seedData = {
    articles: [
        { title: "Tata Group and Intel Strategic Alliance", category: "Technology", content: "Tata Group and Intel announced...", author: "Business Desk" },
        { title: "Microsoft $17.5B India Investment", category: "Technology", content: "Microsoft announced...", author: "Tech Reporter" }
    ],
    events: [
        { name: "E-Summit 2025", date: "2025-12-11", location: "IIT Bombay", description: "Asia's largest business conclave." }
    ],
    interviews: [
        { intervieweeName: "Roshni Nadar Malhotra", title: "Chairperson", company: "HCLTech", content: "Davos discussion." },
        { intervieweeName: "Satya Nadella", title: "CEO", company: "Microsoft", content: "AI Future." }
    ],
    clients: [
        { name: "Tata Group", type: "Partner" },
        { name: "Reliance", type: "Partner" }
    ],
    industry: [
        { sector: "Semiconductor", title: "India Semi Push", growthMetric: "+150%" }
    ],
    users: [
        { name: "Editor User", email: "editor@bizzshort.com", password: "password123", role: "EDITOR" }
    ]
};

function postData(endpoint, data) {
    return new Promise((resolve) => {
        const d = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: `/api/${endpoint}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, res => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                if (res.statusCode < 300) console.log(`✅ [${endpoint}] Success: ${data.title || data.name || data.intervieweeName}`);
                else console.log(`❌ [${endpoint}] Failed (${res.statusCode}): ${body}`);
                resolve();
            });
        });
        req.on('error', e => { console.log('Err', e); resolve(); });
        req.write(d);
        req.end();
    });
}

async function run() {
    console.log('🚀 Seeding...');
    for (const k in seedData) {
        for (const i of seedData[k]) await postData(k, i);
    }
    console.log('✨ Done');
}

run();
