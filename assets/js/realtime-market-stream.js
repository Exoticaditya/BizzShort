// ============================================
// REAL-TIME MARKET DATA STREAM (SSE)
// Updates every 10 seconds via Server-Sent Events
// ============================================

class RealTimeMarketStream {
    constructor() {
        this.apiBaseURL = window.APIConfig ? APIConfig.baseURL : 'https://bizzshort.onrender.com';
        this.eventSource = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000; // 3 seconds
        this.init();
    }

    init() {
        console.log('🚀 Initializing Real-Time Market Stream (SSE)...');
        this.connect();
    }

    connect() {
        try {
            // Close existing connection if any
            if (this.eventSource) {
                this.eventSource.close();
            }

            // Create new SSE connection
            this.eventSource = new EventSource(`${this.apiBaseURL}/api/market-stream`);

            // Handle incoming messages
            this.eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.success) {
                        this.updateMarketDisplay(data);
                        this.reconnectAttempts = 0; // Reset on successful message
                        console.log('📊 Real-time market update received:', data.source);
                    }
                } catch (error) {
                    console.error('❌ Error parsing SSE data:', error);
                }
            };

            // Handle connection open
            this.eventSource.onopen = () => {
                console.log('✅ SSE connection established - receiving real-time updates every 30 seconds');
                this.reconnectAttempts = 0;
            };

            // Handle errors
            this.eventSource.onerror = (error) => {
                console.error('❌ SSE connection error:', error);
                this.eventSource.close();
                this.handleReconnect();
            };

        } catch (error) {
            console.error('❌ Failed to create SSE connection:', error);
            this.handleReconnect();
        }
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Reconnecting... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), this.reconnectDelay);
        } else {
            console.error('❌ Max reconnection attempts reached. Falling back to polling.');
            // Fallback to old polling method
            this.fallbackToPolling();
        }
    }

    fallbackToPolling() {
        // Use the old LiveMarketData class as fallback
        if (window.LiveMarketData) {
            console.log('📡 Switching to polling mode (60s intervals)');
            new LiveMarketData();
        }
    }

    updateMarketDisplay(result) {
        const { data, source, timestamp, marketStatus } = result;

        // Update Nifty 50
        this.updateCard('nifty', data.nifty);

        // Update Sensex
        this.updateCard('sensex', data.sensex);

        // Update Bank Nifty
        this.updateCard('bankNifty', data.bankNifty);

        // Update timestamp
        const timestampElement = document.querySelector('.market-timestamp');
        if (timestampElement) {
            const time = new Date(timestamp).toLocaleTimeString('en-IN');
            timestampElement.textContent = `Last Updated: ${time} (Live)`;
        }

        // Add visual indicator for real-time updates
        this.showUpdateIndicator(source);
    }

    updateCard(market, data) {
        const valueEl = document.getElementById(`${market}-value`);
        const changeEl = document.getElementById(`${market}-change`);
        const noteEl = document.getElementById(`${market}-note`);

        if (valueEl && data) {
            // Animate value change
            const newValue = `₹${Math.round(data.value).toLocaleString('en-IN')}`;
            if (valueEl.textContent !== newValue) {
                valueEl.classList.add('value-updating');
                setTimeout(() => valueEl.classList.remove('value-updating'), 500);
            }
            valueEl.textContent = newValue;
        }

        if (changeEl && data) {
            const change = data.change;
            const isPositive = change >= 0;
            changeEl.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
            changeEl.className = `market-change ${isPositive ? 'positive' : 'negative'}`;
        }

        if (noteEl && data && data.note) {
            noteEl.textContent = data.note;
        }
    }

    showUpdateIndicator(source) {
        // Create or update live indicator
        let indicator = document.querySelector('.live-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'live-indicator';
            indicator.innerHTML = '<span class="pulse"></span> LIVE';

            const marketSection = document.querySelector('.market-today') || document.querySelector('#market-today');
            if (marketSection) {
                marketSection.style.position = 'relative';
                marketSection.appendChild(indicator);
            }
        }

        // Pulse animation on update
        indicator.classList.add('updating');
        setTimeout(() => indicator.classList.remove('updating'), 1000);

        // Update source indicator
        const sourceText = source === 'yahoo_finance_stream' ? 'Yahoo Finance' : 'Estimated';
        indicator.setAttribute('title', `Live data from ${sourceText}`);
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            console.log('📡 SSE connection closed');
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if market cards exist on the page
    if (document.getElementById('nifty-value') || document.querySelector('.market-today')) {
        window.marketStream = new RealTimeMarketStream();
        console.log('✅ Real-Time Market Stream initialized');
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.marketStream) {
        window.marketStream.disconnect();
    }
});

// Add CSS for live indicator and animations
const style = document.createElement('style');
style.textContent = `
    .live-indicator {
        position: absolute;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 10px rgba(231, 76, 60, 0.3);
        z-index: 10;
        animation: slideIn 0.3s ease;
    }

    .live-indicator .pulse {
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    .live-indicator.updating .pulse {
        animation: pulse 0.5s infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.5;
            transform: scale(1.2);
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .value-updating {
        animation: valueFlash 0.5s ease;
    }

    @keyframes valueFlash {
        0%, 100% {
            background: transparent;
        }
        50% {
            background: rgba(102, 126, 234, 0.1);
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(style);
