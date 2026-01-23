const axios = require('axios');

const API_URL = 'http://localhost:5000/auth';

async function testCookieAuth() {
    try {
        console.log('--- Testing Login and Cookie setting ---');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: 'test@example.com', // Assuming this user exists or I need to register first
            password: 'password123'
        });

        const cookies = loginRes.headers['set-cookie'];
        console.log('Set-Cookie Header:', cookies);

        if (!cookies || !cookies.some(c => c.startsWith('token='))) {
            console.error('FAILED: Token cookie not found in response');
            return;
        }

        console.log('SUCCESS: Token cookie received');

        // Now test /auth/me with the cookie
        const tokenCookie = cookies.find(c => c.startsWith('token=')).split(';')[0];

        console.log('\n--- Testing /auth/me with Cookie ---');
        const meRes = await axios.get(`${API_URL}/me`, {
            headers: {
                Cookie: tokenCookie
            }
        });

        console.log('Response status:', meRes.status);
        console.log('User data:', meRes.data.email);

        if (meRes.status === 200) {
            console.log('SUCCESS: Authenticated using cookie');
        } else {
            console.error('FAILED: Could not authenticate using cookie');
        }

    } catch (error) {
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error data:', error.response.data);
        } else {
            console.error('Error message:', error.message);
        }
    }
}

testCookieAuth();
