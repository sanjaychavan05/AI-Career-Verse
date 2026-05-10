/**
 * Gemini API Key Verification Script
 * 
 * This script tests that the provided Gemini API key is active and working.
 * Run: node verify-gemini-api.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load API key from .env file
function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const vars = {};
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            vars[key.trim()] = valueParts.join('=').trim();
        }
    });
    return vars;
}

function verifyGeminiApiKey(apiKey) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            contents: [{
                parts: [{ text: "Say 'API key verified successfully!' in exactly those words." }]
            }]
        });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const urlObj = new URL(url);

        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve({ statusCode: res.statusCode, body: response });
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║     Gemini API Key Verification Script      ║');
    console.log('╠══════════════════════════════════════════════╣');

    try {
        const env = loadEnv();
        const apiKey = env.GEMINI_API_KEY;

        if (!apiKey) {
            console.log('║  ❌ ERROR: GEMINI_API_KEY not found in .env  ║');
            console.log('╚══════════════════════════════════════════════╝');
            process.exit(1);
        }

        console.log(`║  🔑 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}        ║`);
        console.log('║  📡 Testing connection to Gemini API...       ║');
        console.log('╠══════════════════════════════════════════════╣');

        const result = await verifyGeminiApiKey(apiKey);

        if (result.statusCode === 200 && result.body.candidates) {
            const responseText = result.body.candidates[0]?.content?.parts[0]?.text || '';
            console.log('║  ✅ STATUS: API Key is ACTIVE & WORKING!     ║');
            console.log('╠══════════════════════════════════════════════╣');
            console.log(`║  📝 Model Response:                          ║`);
            console.log(`║  "${responseText.trim().substring(0, 40)}"  `);
        } else if (result.body.error) {
            console.log(`║  ❌ STATUS: API Key FAILED                    ║`);
            console.log(`║  Error: ${result.body.error.message?.substring(0, 35)}  `);
        } else {
            console.log(`║  ⚠️  STATUS: Unexpected response (${result.statusCode})       ║`);
        }

        console.log('╚══════════════════════════════════════════════╝');
        console.log('');

    } catch (error) {
        console.log(`║  ❌ CONNECTION ERROR: ${error.message?.substring(0, 22)}  ║`);
        console.log('╚══════════════════════════════════════════════╝');
        process.exit(1);
    }
}

main();
