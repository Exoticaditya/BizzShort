// ============================================
// LIVE MARKET CHARTS
// Interactive Charts using Chart.js and TradingView Widgets
// ============================================

class LiveMarketCharts {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        // Add delay to ensure DOM is ready
        setTimeout(() => {
            this.createTradingViewWidgets();
            this.createChartJsCharts();
        }, 100);
    }

    // TradingView Widgets (Free, No API Key Required)
    createTradingViewWidgets() {
        // Nifty 50 Chart
        this.createTradingViewWidget('nifty-chart', 'NSE:NIFTY', 'Nifty 50');

        // Sensex Chart
        this.createTradingViewWidget('sensex-chart', 'BSE:SENSEX', 'Sensex');

        // Bank Nifty Chart
        this.createTradingViewWidget('banknifty-chart', 'NSE:BANKNIFTY', 'Bank Nifty');

        // Market Overview Widget
        this.createMarketOverviewWidget();

        // Stock Screener Widget
        this.createStockScreenerWidget();
    }

    createTradingViewWidget(containerId, symbol, title) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Create TradingView widget
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            new TradingView.widget({
                "width": container.offsetWidth || 800,
                "height": container.offsetHeight || 500,
                "symbol": symbol,
                "interval": "D",
                "timezone": "Asia/Kolkata",
                "theme": "light",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": containerId,
                "studies": [
                    "STD;SMA",
                    "STD;RSI"
                ],
                "show_popup_button": true,
                "popup_width": "1000",
                "popup_height": "650",
                "support_host": "https://www.tradingview.com"
            });
        };

        document.head.appendChild(script);
    }

    createMarketOverviewWidget() {
        const container = document.getElementById('market-overview-widget');
        if (!container) return;

        container.innerHTML = `
            <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
            </div>
        `;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "colorTheme": "light",
            "dateRange": "12M",
            "showChart": true,
            "locale": "en",
            "width": "100%",
            "height": "450",
            "largeChartUrl": "",
            "isTransparent": false,
            "showSymbolLogo": true,
            "showFloatingTooltip": false,
            "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
            "plotLineColorFalling": "rgba(41, 98, 255, 1)",
            "gridLineColor": "rgba(240, 243, 250, 0)",
            "scaleFontColor": "rgba(120, 123, 134, 1)",
            "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
            "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
            "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
            "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
            "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
            "tabs": [
                {
                    "title": "Indices",
                    "symbols": [
                        { "s": "NSE:NIFTY", "d": "Nifty 50" },
                        { "s": "BSE:SENSEX", "d": "Sensex" },
                        { "s": "NSE:BANKNIFTY", "d": "Bank Nifty" },
                        { "s": "NSE:NIFTYIT", "d": "Nifty IT" },
                        { "s": "NSE:CNXMIDCAP", "d": "Nifty Midcap" }
                    ],
                    "originalTitle": "Indices"
                },
                {
                    "title": "Top Stocks",
                    "symbols": [
                        { "s": "NSE:RELIANCE", "d": "Reliance" },
                        { "s": "NSE:TCS", "d": "TCS" },
                        { "s": "NSE:HDFCBANK", "d": "HDFC Bank" },
                        { "s": "NSE:INFY", "d": "Infosys" },
                        { "s": "NSE:ICICIBANK", "d": "ICICI Bank" }
                    ],
                    "originalTitle": "Top Stocks"
                }
            ]
        });

        const widgetContainer = container.querySelector('.tradingview-widget-container__widget');
        if (widgetContainer) {
            widgetContainer.appendChild(script);
        }
    }

    createStockScreenerWidget() {
        const container = document.getElementById('stock-screener-widget');
        if (!container) return;

        container.innerHTML = `
            <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
            </div>
        `;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "width": "100%",
            "height": 490,
            "defaultColumn": "overview",
            "screener_type": "crypto_mkt",
            "displayCurrency": "INR",
            "colorTheme": "light",
            "locale": "en",
            "isTransparent": false
        });

        const widgetContainer = container.querySelector('.tradingview-widget-container__widget');
        if (widgetContainer) {
            widgetContainer.appendChild(script);
        }
    }

    // Chart.js Charts (Customizable)
    createChartJsCharts() {
        this.createNiftyLineChart();
        this.createSectoralPerformanceChart();
        this.createMarketBreadthChart();
    }

    createNiftyLineChart() {
        const canvas = document.getElementById('nifty-line-chart');
        if (!canvas) return;
        // Destroy existing chart if it exists
        if (this.charts['nifty-intraday']) {
            this.charts['nifty-intraday'].destroy();
        }
        const ctx = canvas.getContext('2d');

        // Generate mock intraday data
        const labels = [];
        const data = [];
        const baseValue = 24850;

        for (let i = 9.25; i <= 15.5; i += 0.25) {
            const hours = Math.floor(i);
            const minutes = (i % 1) * 60;
            labels.push(`${hours}:${minutes.toString().padStart(2, '0')}`);
            data.push(baseValue + (Math.random() - 0.5) * 200);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nifty 50',
                    data: data,
                    borderColor: 'rgb(34, 139, 34)',
                    backgroundColor: 'rgba(34, 139, 34, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Nifty 50 - Intraday Movement'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function (value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });

        this.charts['nifty-intraday'] = new Chart(ctx, config);
    }

    createSectoralPerformanceChart() {
        const canvas = document.getElementById('sectoral-performance-chart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.charts['sectoral-performance']) {
            this.charts['sectoral-performance'].destroy();
        }

        const ctx = canvas.getContext('2d');

        this.charts['sectoral-performance'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['IT', 'Banking', 'Pharma', 'Auto', 'Realty', 'Metal', 'FMCG', 'Energy'],
                datasets: [{
                    label: 'Daily Change (%)',
                    data: [2.1, 1.4, 1.8, 0.9, 1.6, -0.5, 0.7, 0.3],
                    backgroundColor: [
                        'rgba(34, 139, 34, 0.7)',
                        'rgba(34, 139, 34, 0.7)',
                        'rgba(34, 139, 34, 0.7)',
                        'rgba(34, 139, 34, 0.7)',
                        'rgba(34, 139, 34, 0.7)',
                        'rgba(220, 53, 69, 0.7)',
                        'rgba(34, 139, 34, 0.7)',
                        'rgba(34, 139, 34, 0.7)'
                    ],
                    borderColor: [
                        'rgb(34, 139, 34)',
                        'rgb(34, 139, 34)',
                        'rgb(34, 139, 34)',
                        'rgb(34, 139, 34)',
                        'rgb(34, 139, 34)',
                        'rgb(220, 53, 69)',
                        'rgb(34, 139, 34)',
                        'rgb(34, 139, 34)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sectoral Performance Today'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    createMarketBreadthChart() {
        const canvas = document.getElementById('market-breadth-chart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.charts['market-breadth']) {
            this.charts['market-breadth'].destroy();
        }

        const ctx = canvas.getContext('2d');

        this.charts['market-breadth'] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Advancing', 'Declining', 'Unchanged'],
                datasets: [{
                    data: [2145, 1423, 176],
                    backgroundColor: [
                        'rgba(34, 139, 34, 0.8)',
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)'
                    ],
                    borderColor: [
                        'rgb(34, 139, 34)',
                        'rgb(220, 53, 69)',
                        'rgb(255, 193, 7)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Market Breadth - Advance/Decline Ratio'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load Chart.js library if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            const charts = new LiveMarketCharts();
        };
        document.head.appendChild(script);
    } else {
        const charts = new LiveMarketCharts();
    }
});
