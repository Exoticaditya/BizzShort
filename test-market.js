const https = require('https');

const fetchYahoo = (symbol, useHeader) => {
    return new Promise((resolve, reject) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        const options = useHeader ? {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        } : {};

        console.log(`Fetching ${symbol} with${useHeader ? '' : 'out'} User-Agent...`);

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`Status (with header: ${useHeader}): ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.chart && parsed.chart.result) {
                            console.log('✅ Success! Got data.');
                            resolve(true);
                        } else {
                            console.log('❌ Failed: Invalid structure');
                            resolve(false);
                        }
                    } catch (e) {
                        console.log('❌ Failed: Parse error');
                        resolve(false);
                    }
                } else {
                    console.log(`❌ Failed with status ${res.statusCode}`);
                    resolve(false);
                }
            });
        }).on('error', (e) => {
            console.log(`❌ Network Error: ${e.message}`);
            resolve(false);
        });
    });
};

async function run() {
    console.log('--- Testing without User-Agent ---');
    await fetchYahoo('^NSEI', false);

    console.log('\n--- Testing with User-Agent ---');
    await fetchYahoo('^NSEI', true);
}

run();
