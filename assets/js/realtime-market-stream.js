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
        this.marketHoursInterval = null;
        this.init();
    }

    init() {
        console.log('🚀 Initializing Real-Time Market Stream (SSE)...');
        this.updateLiveBadgeState();
        this.updateMarketClosedState();
        // Re-check market hours every minute to show/hide the badge automatically
        this.marketHoursInterval = setInterval(() => {
            this.updateLiveBadgeState();
            this.updateMarketClosedState();
        }, 60000);

        if (!this.isMarketOpen()) {
            console.log('⏸️ Market closed (Mon–Fri, 9:15–15:30 IST); live badge hidden.');
        }
    }

    updateMarketClosedState() {
        const isOpen = this.isMarketOpen();
        // Hide change badges and trend notes when market is closed
        const changeEls = document.querySelectorAll('.market-change');
        const noteEls = document.querySelectorAll('#nifty-note, #sensex-note, #bank-nifty-note');

        changeEls.forEach(el => {
            el.style.display = isOpen ? '' : 'none';
        });
        noteEls.forEach(el => {
            if (isOpen) {
                el.style.display = '';
            } else {
                el.textContent = 'Market Closed';
                el.style.display = '';
                el.style.color = 'rgba(255,255,255,0.45)';
                el.style.fontStyle = 'italic';
            }
        });
    }

    isMarketOpen() {
        // Market hours: Monday–Friday, 9:15 AM to 3:30 PM IST
        const now = new Date();
        const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const day = istNow.getDay(); // 0 = Sunday, 6 = Saturday
        if (day === 0 || day === 6) return false;

        const minutes = istNow.getHours() * 60 + istNow.getMinutes();
        const marketOpen = 9 * 60 + 15;
        const marketClose = 15 * 60 + 30;
        return minutes >= marketOpen && minutes <= marketClose;
    }

    connect() {
        if (!this.isMarketOpen()) {
            this.setLiveBadge(false);
            return;
        }

        try {
            if (this.eventSource) {
                this.eventSource.close();
            }

            this.eventSource = new EventSource(`${this.apiBaseURL}/api/market-stream`);

            this.eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.success) {
                        this.updateMarketDisplay(data);
                        this.reconnectAttempts = 0;
                        console.log('📊 Real-time market update received:', data.source);
                    }
                } catch (error) {
                    console.error('❌ Error parsing SSE data:', error);
                }
            };

            this.eventSource.onopen = () => {
                console.log('✅ SSE connection established - receiving real-time updates every 30 seconds');
                this.reconnectAttempts = 0;
            };

            this.eventSource.onerror = (error) => {
                console.error('❌ SSE connection error:', error);
                if (this.eventSource) {
                    this.eventSource.close();
                    this.eventSource = null;
                }
                this.handleReconnect();
            };

        } catch (error) {
            console.error('❌ Failed to create SSE connection:', error);
            this.handleReconnect();
        }
    }

    handleReconnect() {
        if (!this.isMarketOpen()) {
            this.setLiveBadge(false);
            return;
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Reconnecting... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), this.reconnectDelay);
        } else {
            console.error('❌ Max reconnection attempts reached. Falling back to polling.');
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

    updateLiveBadgeState(source = '') {
        const isOpen = this.isMarketOpen();
        this.setLiveBadge(isOpen, source);

        if (!isOpen) {
            this.disconnect();
            return;
        }

        if (!this.eventSource) {
            this.connect();
        }
    }

    setLiveBadge(isLive, source = '') {
        const badge = document.querySelector('.market-live-badge');
        if (!badge) return;

        badge.style.display = isLive ? 'inline-flex' : 'none';
        badge.classList.toggle('live-closed', !isLive);

        if (isLive) {
            const sourceText = source === 'yahoo_finance_stream' ? 'Yahoo Finance' : 'Live feed';
            badge.textContent = 'LIVE';
            badge.setAttribute('title', `Live data from ${sourceText}`);
        } else {
            badge.textContent = 'LIVE';
            badge.setAttribute('title', 'Market closed (Mon–Fri, 9:15–15:30 IST)');
        }
    }

    updateMarketDisplay(result) {
        const { data, source, timestamp } = result;

        this.setLiveBadge(this.isMarketOpen(), source);

        this.updateCard('nifty', data.nifty);
        this.updateCard('sensex', data.sensex);
        this.updateCard('bankNifty', data.bankNifty);

        const timestampElement = document.querySelector('.market-timestamp');
        if (timestampElement) {
            const time = new Date(timestamp).toLocaleTimeString('en-IN');
            timestampElement.textContent = `Last Updated: ${time} (Live)`;
        }

        this.showUpdateIndicator(source);
    }

    updateCard(market, data) {
        const elementId = market === 'bankNifty' ? 'bank-nifty' : market;
        const valueEl = document.getElementById(`${elementId}-value`);
        const changeEl = document.getElementById(`${elementId}-change`);
        const noteEl = document.getElementById(`${elementId}-note`);

        if (!valueEl || !data) {
            console.warn(`⚠️ Element or data missing for ${market}`);
            return;
        }

        try {
            const newValue = `₹${Math.round(data.value).toLocaleString('en-IN')}`;
            if (valueEl.textContent !== newValue) {
                valueEl.classList.add('value-updating');
                setTimeout(() => valueEl.classList.remove('value-updating'), 500);
            }
            valueEl.textContent = newValue;

            if (changeEl) {
                const change = data.change;
                const isPositive = change >= 0;
                changeEl.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
                changeEl.className = `market-change ${isPositive ? 'positive' : 'negative'}`;
            }

            if (noteEl && data.note) {
                noteEl.textContent = data.note;
            }
        } catch (error) {
            console.error(`❌ Error updating ${market} card:`, error);
        }
    }

    showUpdateIndicator(source) {
        this.setLiveBadge(this.isMarketOpen(), source);

        const badge = document.querySelector('.market-live-badge');
        if (!badge) return;

        badge.classList.add('updating');
        setTimeout(() => badge.classList.remove('updating'), 800);
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
            console.log('📡 SSE connection closed');
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
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
