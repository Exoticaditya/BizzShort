// full_crud_test.js
const http = require('http');

const BASE_URL = 'http://localhost:3000/api';
let SESSION_ID = null;

// Helper: Request Wrapper
function request(method, endpoint, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const dataStr = data ? JSON.stringify(data) : '';
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/${endpoint}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataStr.length,
                ...headers
            }
        };

        if (SESSION_ID) {
            options.headers['Session-ID'] = SESSION_ID;
            options.headers['Cookie'] = `adminSession=${SESSION_ID}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, body: json });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => resolve({ error: e.message }));
        if (data) req.write(dataStr);
        req.end();
    });
}

async function runTests() {
    console.log('🧪 STARTING COMPREHENSIVE CRUD TEST SUITE\n');

    // 1. Authentication
    console.log('--- 1. Authentication System ---');
    const login = await request('POST', 'admin/login', { username: 'admin', password: 'admin123' });
    if (login.status === 200 && login.body.success) {
        console.log('✅ Login Successful');
        SESSION_ID = login.body.sessionId;
    } else {
        console.error('❌ Login Failed', login.body);
        process.exit(1);
    }

    const sessionCheck = await request('GET', 'admin/verify-session');
    if (sessionCheck.status === 200 && sessionCheck.body.valid) console.log('✅ Session Verified');
    else console.error('❌ Session Verification Failed');

    // 2. Articles Management
    console.log('\n--- 2. Articles Management ---');
    let articleId = null;
    const details = { title: "Test Article", category: "Business", content: "Test Content", author: "QA Bot" };

    // Create
    const artCreate = await request('POST', 'articles', details);
    if (artCreate.status === 201) {
        console.log('✅ Article Created');
        articleId = artCreate.body.data.id;
    } else console.error('❌ Article Create Failed', artCreate.body);

    // Read
    const artList = await request('GET', 'articles');
    if (artList.body.data && artList.body.data.some(a => a.id === articleId)) console.log('✅ Article Found in List');
    else console.error('❌ Article Read Failed');

    // Update
    const artUpdate = await request('PUT', `articles/${articleId}`, { ...details, title: "Updated Title" });
    if (artUpdate.status === 200) console.log('✅ Article Updated');
    else console.error('❌ Article Update Failed');

    // Delete
    const artDelete = await request('DELETE', `articles/${articleId}`);
    if (artDelete.status === 200) console.log('✅ Article Deleted');
    else console.error('❌ Article Delete Failed');


    // 3. Events Management
    console.log('\n--- 3. Events Management ---');
    let eventId = null;
    const eventDetails = { name: "Test Event", date: "2025-01-01", location: "Test Loc", description: "Desc" };

    const evCreate = await request('POST', 'events', eventDetails);
    if (evCreate.status === 201) {
        console.log('✅ Event Created');
        eventId = evCreate.body.data.id;
    }

    const evUpdate = await request('PUT', `events/${eventId}`, { ...eventDetails, location: "Updated Loc" });
    if (evUpdate.status === 200) console.log('✅ Event Updated');

    const evDelete = await request('DELETE', `events/${eventId}`);
    if (evDelete.status === 200) console.log('✅ Event Deleted');


    // 4. Clients Management
    console.log('\n--- 4. Clients Management ---');
    let clientId = null;
    const clientDetails = { name: "Test Client", type: "Partner" };

    const clCreate = await request('POST', 'clients', clientDetails);
    if (clCreate.status === 201) {
        console.log('✅ Client Created');
        clientId = clCreate.body.data.id;
    }

    const clUpdate = await request('PUT', `clients/${clientId}`, { ...clientDetails, type: "Vendor" });
    if (clUpdate.status === 200) console.log('✅ Client Updated');

    const clDelete = await request('DELETE', `clients/${clientId}`);
    if (clDelete.status === 200) console.log('✅ Client Deleted');


    // 5. Users Management
    console.log('\n--- 5. Users Management ---');
    let userId = null;
    const userDetails = { name: "Test User", email: "test@bizzshort.com", role: "Editor", status: "Active" };

    const usrCreate = await request('POST', 'users', userDetails);
    if (usrCreate.status === 201) {
        console.log('✅ User Created');
        userId = usrCreate.body.data.id;
    }

    const usrUpdate = await request('PUT', `users/${userId}`, { ...userDetails, role: "Admin" });
    if (usrUpdate.status === 200) console.log('✅ User Updated');

    const usrDelete = await request('DELETE', `users/${userId}`);
    if (usrDelete.status === 200) console.log('✅ User Deleted');


    // 6. YouTube Converter
    console.log('\n--- 6. YouTube Converter ---');
    const ytConvert = await request('POST', 'youtube/convert', { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
    if (ytConvert.status === 200) console.log('✅ YouTube Video Converted');
    else console.error('❌ YouTube Convert Failed', ytConvert.body);


    // 7. Advertisements
    console.log('\n--- 7. Advertisements & Analytics ---');
    let adId = null;
    const adDetails = { title: "Test Ad", position: "Header" };

    const adCreate = await request('POST', 'advertisements', adDetails);
    if (adCreate.status === 201) {
        console.log('✅ Advertisement Created');
        adId = adCreate.body.data.id;
    }

    // Analytics
    const trackImp = await request('POST', `advertisements/${adId}/track-impression`);
    if (trackImp.status === 200) console.log('✅ Ad Impression Tracked');

    const trackClick = await request('POST', `advertisements/${adId}/track-click`);
    if (trackClick.status === 200) console.log('✅ Ad Click Tracked');

    const adDelete = await request('DELETE', `advertisements/${adId}`);
    if (adDelete.status === 200) console.log('✅ Advertisement Deleted');


    console.log('\n✨ TEST SUITE COMPLETED SUCCESSFULLY');
}

runTests();
