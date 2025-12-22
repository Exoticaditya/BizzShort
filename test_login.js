
const BASE_URL = 'https://bizzshort.onrender.com/api';

async function testLogin() {
    console.log(`Testing login to: ${BASE_URL}/admin/login`);
    try {
        const response = await fetch(`${BASE_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);
    } catch (error) {
        console.error('Error:', error);
    }
}

testLogin();
