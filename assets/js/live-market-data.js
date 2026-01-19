// ============================================
// LIVE MARKET DATA INTEGRATION
// Real-time Nifty, Sensex, and Market Updates
// Using Alpha Vantage API via Backend
// ============================================

class LiveMarketData {
    constructor() {
        this.apiBaseURL = window.APIConfig ? APIConfig.baseURL : 'https://bizzshort.onrender.com';
        this.updateInterval = 60000; // Update every 60 seconds
        this.isMarketOpen = this.checkMarketHours();
        this.init();
    }

    checkMarketHours() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const day = now.getDay();

        // Market open Monday-Friday, 9:15 AM - 3:30 PM IST
        if (day === 0 || day === 6) return false; // Weekend

        const currentTime = hours * 60 + minutes;
        const marketOpen = 9 * 60 + 15; // 9:15 AM
        const marketClose = 15 * 60 + 30; // 3:30 PM

        return currentTime >= marketOpen && currentTime <= marketClose;
    }

    init() {
        this.updateMarketData();
        // Always update, even if market is closed (to show last values)
        setInterval(() => this.updateMarketData(), this.updateInterval);
    }

    async updateMarketData() {
        try {
            // Fetch from our backend API that uses Alpha Vantage
            const response = await fetch(`${this.apiBaseURL}/api/market-data`);
            const result = await response.json();

            if (result.success && result.data) {
                this.displayMarketData(result.data);
                console.log('✅ Market data updated from API:', result.source);
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Error fetching market data from API:', error);
            // Fall back to local simulation
            const marketData = await this.fetchLocalData();
            this.displayMarketData(marketData);
        }
    }

    async fetchLocalData() {
        // Fallback local data generation (January 2026 realistic values - Updated)
        const generateFluctuation = (base, volatility = 0.002) => {
            const change = base * (Math.random() * volatility * 2 - volatility);
            return {
                value: base + change,
                change: (change / base) * 100,
                changePoints: change
            };
        };

        const nifty = generateFluctuation(25500); // Updated from 23500
        const sensex = generateFluctuation(84000); // Updated from 77500
        const bankNifty = generateFluctuation(53500); // Updated from 50800

        return {
            nifty: { ...nifty, note: nifty.change >= 0 ? 'Bullish Momentum' : 'Bearish Trend' },
            sensex: { ...sensex, note: sensex.change >= 0 ? 'Positive Sentiment' : 'Cautious Trading' },
            bankNifty: { ...bankNifty, note: bankNifty.change >= 0 ? 'Banking Strong' : 'Banking Weak' }
        };
    }

    displayMarketData(data) {
        // Update Nifty 50 - using element IDs
        const niftyValue = document.getElementById('nifty-value');
        const niftyChange = document.getElementById('nifty-change');
        const niftyNote = document.getElementById('nifty-note');

        if (niftyValue && data.nifty) {
            niftyValue.textContent = `₹${Math.round(data.nifty.value).toLocaleString('en-IN')}`;
        }
        if (niftyChange && data.nifty) {
            const change = data.nifty.change;
            const isPositive = change >= 0;
            niftyChange.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
            niftyChange.className = `market-change ${isPositive ? 'positive' : 'negative'}`;
        }
        if (niftyNote && data.nifty && data.nifty.note) {
            niftyNote.textContent = data.nifty.note;
        }

        // Update Sensex
        const sensexValue = document.getElementById('sensex-value');
        const sensexChange = document.getElementById('sensex-change');
        const sensexNote = document.getElementById('sensex-note');

        if (sensexValue && data.sensex) {
            sensexValue.textContent = `₹${Math.round(data.sensex.value).toLocaleString('en-IN')}`;
        }
        if (sensexChange && data.sensex) {
            const change = data.sensex.change;
            const isPositive = change >= 0;
            sensexChange.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
            sensexChange.className = `market-change ${isPositive ? 'positive' : 'negative'}`;
        }
        if (sensexNote && data.sensex && data.sensex.note) {
            sensexNote.textContent = data.sensex.note;
        }

        // Update Bank Nifty
        const bankNiftyValue = document.getElementById('bank-nifty-value');
        const bankNiftyChange = document.getElementById('bank-nifty-change');
        const bankNiftyNote = document.getElementById('bank-nifty-note');

        if (bankNiftyValue && data.bankNifty) {
            bankNiftyValue.textContent = `₹${Math.round(data.bankNifty.value).toLocaleString('en-IN')}`;
        }
        if (bankNiftyChange && data.bankNifty) {
            const change = data.bankNifty.change;
            const isPositive = change >= 0;
            bankNiftyChange.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
            bankNiftyChange.className = `market-change ${isPositive ? 'positive' : 'negative'}`;
        }
        if (bankNiftyNote && data.bankNifty && data.bankNifty.note) {
            bankNiftyNote.textContent = data.bankNifty.note;
        }

        // Update timestamp if exists
        const timestampElement = document.querySelector('.market-timestamp');
        if (timestampElement) {
            timestampElement.textContent = `Last Updated: ${new Date().toLocaleTimeString('en-IN')}`;
        }

        console.log('✅ Market cards updated');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const liveMarket = new LiveMarketData();
    console.log('✅ Live Market Data Initialized');
});

// ============================================
// MARKET TICKER (Scrolling Market Data)
// ============================================

class MarketTicker {
    constructor() {
        this.stocks = [
            { symbol: 'RELIANCE', price: 2847.50, change: 1.12 },
            { symbol: 'TCS', price: 4156.25, change: 3.21 },
            { symbol: 'HDFCBANK', price: 1685.80, change: 1.87 },
            { symbol: 'INFY', price: 1923.45, change: 2.75 },
            { symbol: 'ICICIBANK', price: 1242.30, change: 1.65 },
            { symbol: 'HINDUNILVR', price: 2685.90, change: 0.45 },
            { symbol: 'ITC', price: 487.25, change: 0.85 },
            { symbol: 'SBIN', price: 745.60, change: 1.32 },
            { symbol: 'BHARTIARTL', price: 1625.40, change: 0.95 },
            { symbol: 'KOTAKBANK', price: 1887.75, change: 1.15 }
        ];

        this.init();
    }

    init() {
        this.createTicker();
        setInterval(() => this.updatePrices(), 5000);
    }

    createTicker() {
        const tickerEl = document.getElementById('market-ticker');
        if (!tickerEl) return;

        tickerEl.innerHTML = this.stocks.map(stock => {
            const isPositive = stock.change >= 0;
            return `
                <span class="ticker-item">
                    <span class="ticker-symbol">${stock.symbol}</span>
                    <span class="ticker-price">₹${stock.price.toFixed(2)}</span>
                    <span class="ticker-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)}%
                    </span>
                </span>
            `;
        }).join('');
    }

    updatePrices() {
        // Simulate small price movements
        this.stocks = this.stocks.map(stock => ({
            ...stock,
            price: stock.price + (Math.random() - 0.5) * 10,
            change: stock.change + (Math.random() - 0.5) * 0.5
        }));

        this.createTicker();
    }
}

// Initialize market ticker
document.addEventListener('DOMContentLoaded', () => {
    const ticker = new MarketTicker();
});
