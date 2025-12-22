const https = require('https');

const BASE_URL = 'https://bizzshort.onrender.com/api';

const seedData = {
    articles: [
        {
            title: "Tata Group and Intel Announce Strategic Alliance",
            slug: "tata-group-intel-alliance-" + Date.now(),
            category: "Technology",
            content: "FULL CONTENT HERE...",
            author: "Business Desk",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example YT
        },
        {
            title: "Indian Stock Market High",
            slug: "indian-stock-market-high-" + Date.now(),
            category: "Markets",
            content: "Markets hit new high...",
            author: "Market Desk",
            videoUrl: "https://www.youtube.com/watch?v=fH8Ir7doWGk"
        }
    ],
    // ...
};

// ...

let authToken = '';

function login() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            username: "admin",
            password: "admin123" // Default admin credentials
        });
        const req = https.request({
            hostname: 'bizzshort.onrender.com',
            port: 443,
            path: '/api/admin/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, res => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const json = JSON.parse(body);
                    authToken = json.sessionId;
                    console.log('✅ Login Successful');
                    resolve(authToken);
                } else {
                    console.error('❌ Login Failed:', body);
                    reject(body);
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

function postData(endpoint, data) {
    return new Promise((resolve) => {
        const d = JSON.stringify(data);
        const req = https.request({
            hostname: 'bizzshort.onrender.com',
            port: 443,
            path: `/api/${endpoint}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
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
    console.log('🚀 Authenticating...');
    try {
        await login();
        console.log('🚀 Seeding...');
        for (const k in seedData) {
            for (const i of seedData[k]) await postData(k, i);
        }
        console.log('✨ Done');
    } catch (e) {
        console.error('Script Failed:', e);
    }
}

run();
