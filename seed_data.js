const https = require('https');

const BASE_URL = 'https://bizzshort.onrender.com/api';

const seedData = {
    articles: [
        {
            title: "Tata Group and Intel Announce Strategic Alliance",
            category: "Technology",
            content: "FULL CONTENT HERE...",
            author: "Business Desk",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example YT
        }
    ],
    // ...
};

// ...

function postData(endpoint, data) {
    return new Promise((resolve) => {
        const d = JSON.stringify(data);
        const req = https.request({
            hostname: 'bizzshort.onrender.com',
            port: 443,
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
