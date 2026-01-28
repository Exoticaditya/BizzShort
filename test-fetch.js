const https = require('https');

// Test Instagram Image
const testInstagram = (id) => {
    return new Promise((resolve) => {
        const url = `https://www.instagram.com/p/${id}/media/?size=l`;
        console.log(`Checking Instagram: ${url}`);
        https.get(url, (res) => {
            console.log(`Instagram Status: ${res.statusCode}`);
            if (res.statusCode === 302 || res.statusCode === 301) {
                console.log(`Redirects to: ${res.headers.location}`);
            }
            resolve();
        }).on('error', (e) => {
            console.log(`Instagram Error: ${e.message}`);
            resolve();
        });
    });
};

// Test RSS Feed
const testRSS = (url) => {
    return new Promise((resolve) => {
        console.log(`Checking RSS: ${url}`);
        https.get(url, (res) => {
            console.log(`RSS Status: ${res.statusCode}`);
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`RSS Data Length: ${data.length}`);
                if (data.includes('<rss') || data.includes('<channel>')) {
                    console.log('✅ RSS Feed valid');
                } else {
                    console.log('❌ RSS Feed invalid/empty');
                }
                resolve();
            });
        }).on('error', (e) => {
            console.log(`RSS Error: ${e.message}`);
            resolve();
        });
    });
};

async function run() {
    console.log('--- Testing Instagram ---');
    await testInstagram('DSRtUxpisHf'); // Example ID from code

    console.log('\n--- Testing RSS ---');
    await testRSS('https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms');
}

run();
