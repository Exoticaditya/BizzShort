// ============================================
// LIVE MARKET DATA INTEGRATION
// Real-time Nifty, Sensex, and Market Updates
// ============================================

class LiveMarketData {
    constructor() {
        this.updateInterval = 30000; // Update every 30 seconds
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
        if (this.isMarketOpen) {
            setInterval(() => this.updateMarketData(), this.updateInterval);
        }
    }

    async updateMarketData() {
        try {
            // Using Yahoo Finance API alternative or mock data for demonstration
            const marketData = await this.fetchMarketData();
            this.displayMarketData(marketData);
        } catch (error) {
            console.error('Error fetching market data:', error);
            this.displayMockData(); // Fallback to mock data
        }
    }

    async fetchMarketData() {
        // Option 1: Use Yahoo Finance API (free alternative)
        // Option 2: Use Alpha Vantage API (requires free API key)
        // Option 3: Use BSE/NSE official APIs (limited access)
        
        // For demonstration, using mock data with realistic values
        // Replace this with actual API call in production
        
        return {
            nifty: {
                value: 24850.25,
                change: 195.40,
                changePercent: 0.79,
                high: 24895.60,
                low: 24720.15,
                volume: '₹67,340 Cr'
            },
            sensex: {
                value: 81467.10,
                change: 648.75,
                changePercent: 0.80,
                high: 81589.20,
                low: 81105.45,
                volume: '₹8,245 Cr'
            },
            bankNifty: {
                value: 52340.80,
                change: 618.25,
                changePercent: 1.20,
                high: 52498.35,
                low: 52105.90
            },
            niftyIT: {
                value: 42185.65,
                change: 867.45,
                changePercent: 2.10,
                high: 42298.70,
                low: 41965.25
            },
            timestamp: new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    }

    displayMarketData(data) {
        // Update Nifty
        this.updateIndexCard('nifty', data.nifty);
        
        // Update Sensex
        this.updateIndexCard('sensex', data.sensex);
        
        // Update Bank Nifty
        this.updateIndexCard('bankNifty', data.bankNifty);
        
        // Update Nifty IT
        this.updateIndexCard('niftyIT', data.niftyIT);
        
        // Update timestamp
        const timestampEl = document.getElementById('market-update-time');
        if (timestampEl) {
            timestampEl.textContent = `Last Updated: ${data.timestamp}`;
        }

        // Update market status
        const statusEl = document.getElementById('market-status');
        if (statusEl) {
            statusEl.textContent = this.isMarketOpen ? 'Market Open' : 'Market Closed';
            statusEl.className = this.isMarketOpen ? 'market-open' : 'market-closed';
        }
    }

    updateIndexCard(indexId, data) {
        const valueEl = document.getElementById(`${indexId}-value`);
        const changeEl = document.getElementById(`${indexId}-change`);
        const changePercentEl = document.getElementById(`${indexId}-change-percent`);
        const highEl = document.getElementById(`${indexId}-high`);
        const lowEl = document.getElementById(`${indexId}-low`);

        if (valueEl) valueEl.textContent = data.value.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (changeEl) {
            const isPositive = data.change >= 0;
            changeEl.textContent = `${isPositive ? '+' : ''}${data.change.toFixed(2)}`;
            changeEl.className = isPositive ? 'change positive' : 'change negative';
        }

        if (changePercentEl) {
            const isPositive = data.changePercent >= 0;
            changePercentEl.textContent = `(${isPositive ? '+' : ''}${data.changePercent.toFixed(2)}%)`;
            changePercentEl.className = isPositive ? 'change-percent positive' : 'change-percent negative';
        }

        if (highEl) highEl.textContent = data.high.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (lowEl) lowEl.textContent = data.low.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    displayMockData() {
        // Fallback mock data
        const mockData = {
            nifty: { value: 24850.25, change: 195.40, changePercent: 0.79, high: 24895.60, low: 24720.15 },
            sensex: { value: 81467.10, change: 648.75, changePercent: 0.80, high: 81589.20, low: 81105.45 },
            bankNifty: { value: 52340.80, change: 618.25, changePercent: 1.20, high: 52498.35, low: 52105.90 },
            niftyIT: { value: 42185.65, change: 867.45, changePercent: 2.10, high: 42298.70, low: 41965.25 },
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
        };

        this.displayMarketData(mockData);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const liveMarket = new LiveMarketData();
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
