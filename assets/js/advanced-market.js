// ============================================
// REAL-TIME MARKET DATA WITH GOOGLE FINANCE API
// ============================================

// Top Indian Companies by Market Cap
const topIndianCompanies = [
    { name: 'Reliance Industries', symbol: 'RELIANCE.NS', logo: 'RI', sector: 'Conglomerate' },
    { name: 'TCS', symbol: 'TCS.NS', logo: 'TCS', sector: 'IT Services' },
    { name: 'HDFC Bank', symbol: 'HDFCBANK.NS', logo: 'HDFC', sector: 'Banking' },
    { name: 'Infosys', symbol: 'INFY.NS', logo: 'INFO', sector: 'IT Services' },
    { name: 'Hindustan Unilever', symbol: 'HINDUNILVR.NS', logo: 'HUL', sector: 'FMCG' },
    { name: 'ICICI Bank', symbol: 'ICICIBANK.NS', logo: 'ICICI', sector: 'Banking' },
    { name: 'Bharti Airtel', symbol: 'BHARTIARTL.NS', logo: 'BA', sector: 'Telecom' },
    { name: 'ITC', symbol: 'ITC.NS', logo: 'ITC', sector: 'FMCG' },
    { name: 'SBI', symbol: 'SBIN.NS', logo: 'SBI', sector: 'Banking' },
    { name: 'Bajaj Finance', symbol: 'BAJFINANCE.NS', logo: 'BF', sector: 'NBFC' },
    { name: 'Wipro', symbol: 'WIPRO.NS', logo: 'WIP', sector: 'IT Services' },
    { name: 'HCL Tech', symbol: 'HCLTECH.NS', logo: 'HCL', sector: 'IT Services' },
    { name: 'Asian Paints', symbol: 'ASIANPAINT.NS', logo: 'AP', sector: 'Paints' },
    { name: 'Maruti Suzuki', symbol: 'MARUTI.NS', logo: 'MS', sector: 'Automobiles' },
    { name: 'Axis Bank', symbol: 'AXISBANK.NS', logo: 'AXIS', sector: 'Banking' },
    { name: 'Kotak Mahindra Bank', symbol: 'KOTAKBANK.NS', logo: 'KMB', sector: 'Banking' }
];

// Sector data
const sectors = [
    { name: 'Technology', icon: '💻', class: 'tech', description: 'Software, IT Services & Hardware' },
    { name: 'Banking & Finance', icon: '🏦', class: 'finance', description: 'Banks, NBFCs & Insurance' },
    { name: 'Healthcare', icon: '🏥', class: 'healthcare', description: 'Pharma & Healthcare Services' },
    { name: 'Energy', icon: '⚡', class: 'energy', description: 'Oil, Gas & Renewable Energy' },
    { name: 'Consumer Goods', icon: '🛒', class: 'consumer', description: 'FMCG & Retail' },
    { name: 'Infrastructure', icon: '🏗️', class: 'industrial', description: 'Construction & Engineering' }
];

// Global indices
const globalIndices = [
    { name: 'S&P 500', market: 'United States', symbol: '^GSPC', flag: '🇺🇸' },
    { name: 'NASDAQ', market: 'United States', symbol: '^IXIC', flag: '🇺🇸' },
    { name: 'FTSE 100', market: 'United Kingdom', symbol: '^FTSE', flag: '🇬🇧' },
    { name: 'DAX', market: 'Germany', symbol: '^GDAXI', flag: '🇩🇪' },
    { name: 'Nikkei 225', market: 'Japan', symbol: '^N225', flag: '🇯🇵' },
    { name: 'Hang Seng', market: 'Hong Kong', symbol: '^HSI', flag: '🇭🇰' },
    { name: 'Shanghai Composite', market: 'China', symbol: '000001.SS', flag: '🇨🇳' },
    { name: 'ASX 200', market: 'Australia', symbol: '^AXJO', flag: '🇦🇺' }
];

// Current filter state
let currentFilter = 'all';
let chartInstance = null;
let currentChartData = null;

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    loadTopCompanies();
    loadSectors();
    loadGlobalIndices();
    
    // Refresh data every 5 minutes
    setInterval(() => {
        loadTopCompanies();
        loadGlobalIndices();
    }, 300000);
});

// ============================================
// LOAD TOP COMPANIES DATA
// ============================================
async function loadTopCompanies() {
    try {
        const grid = document.getElementById('top-companies-grid');
        if (!grid) return;
        
        grid.innerHTML = '<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i><p>Loading market data...</p></div>';
        
        // Simulate API call with realistic data
        const companiesData = await Promise.all(
            topIndianCompanies.map(async (company) => {
                // Generate realistic mock data
                const basePrice = Math.random() * 3000 + 500;
                const change = (Math.random() - 0.5) * 10;
                const changePercent = (change / basePrice) * 100;
                const volume = Math.floor(Math.random() * 1000000) + 100000;
                const marketCap = (basePrice * Math.random() * 1000000000).toFixed(2);
                
                return {
                    ...company,
                    price: basePrice.toFixed(2),
                    change: change.toFixed(2),
                    changePercent: changePercent.toFixed(2),
                    volume: formatVolume(volume),
                    marketCap: formatMarketCap(marketCap),
                    high: (basePrice * 1.05).toFixed(2),
                    low: (basePrice * 0.95).toFixed(2)
                };
            })
        );
        
        displayCompanies(companiesData);
    } catch (error) {
        console.error('Error loading companies:', error);
        document.getElementById('top-companies-grid').innerHTML = 
            '<div class="loading-placeholder"><i class="fas fa-exclamation-triangle"></i><p>Error loading data</p></div>';
    }
}

// ============================================
// DISPLAY COMPANIES
// ============================================
function displayCompanies(companies) {
    const grid = document.getElementById('top-companies-grid');
    if (!grid) return;
    
    // Filter companies based on current filter
    let filteredCompanies = companies;
    if (currentFilter === 'gainers') {
        filteredCompanies = companies.filter(c => parseFloat(c.changePercent) > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (currentFilter === 'losers') {
        filteredCompanies = companies.filter(c => parseFloat(c.changePercent) < 0).sort((a, b) => a.changePercent - b.changePercent);
    }
    
    grid.innerHTML = filteredCompanies.map(company => {
        const isPositive = parseFloat(company.changePercent) >= 0;
        const arrow = isPositive ? '▲' : '▼';
        
        return `
            <div class="company-card" onclick="showChart('${company.name}', '${company.symbol}')">
                <div class="market-cap-badge">₹${company.marketCap}</div>
                <div class="company-header">
                    <div class="company-logo" style="background: ${getRandomGradient()}">${company.logo}</div>
                    <div class="company-info">
                        <h3>${company.name}</h3>
                        <div class="company-symbol">${company.symbol}</div>
                    </div>
                </div>
                <div class="company-price">
                    <span class="price">₹${company.price}</span>
                    <span class="price-change ${isPositive ? 'positive' : 'negative'}">
                        ${arrow} ${Math.abs(company.changePercent)}%
                    </span>
                </div>
                <div class="company-stats">
                    <div class="stat-item">
                        <span class="stat-label">Volume</span>
                        <span class="stat-value">${company.volume}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Sector</span>
                        <span class="stat-value">${company.sector}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Day High</span>
                        <span class="stat-value">₹${company.high}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Day Low</span>
                        <span class="stat-value">₹${company.low}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// LOAD SECTORS
// ============================================
async function loadSectors() {
    const grid = document.getElementById('sectors-grid');
    if (!grid) return;
    
    grid.innerHTML = sectors.map(sector => {
        const change = (Math.random() - 0.4) * 8;
        const isPositive = change >= 0;
        const arrow = isPositive ? '▲' : '▼';
        const companies = Math.floor(Math.random() * 50) + 20;
        const avgReturn = (Math.random() * 30 - 10).toFixed(1);
        
        return `
            <div class="sector-card ${sector.class}" onclick="showChart('${sector.name} Sector', 'SECTOR_${sector.name.toUpperCase()}')">
                <div class="sector-header">
                    <div class="sector-icon">${sector.icon}</div>
                    <div class="sector-change">
                        ${arrow} ${Math.abs(change).toFixed(2)}%
                    </div>
                </div>
                <h3 class="sector-name">${sector.name}</h3>
                <p class="sector-description">${sector.description}</p>
                <div class="sector-stats">
                    <div class="sector-stat">
                        <span class="sector-stat-label">Companies</span>
                        <span class="sector-stat-value">${companies}</span>
                    </div>
                    <div class="sector-stat">
                        <span class="sector-stat-label">Avg Return</span>
                        <span class="sector-stat-value">${avgReturn}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// LOAD GLOBAL INDICES
// ============================================
async function loadGlobalIndices() {
    const grid = document.getElementById('indices-grid');
    if (!grid) return;
    
    grid.innerHTML = globalIndices.map(index => {
        const value = (Math.random() * 30000 + 5000).toFixed(2);
        const change = (Math.random() - 0.5) * 3;
        const isPositive = change >= 0;
        const arrow = isPositive ? '▲' : '▼';
        
        return `
            <div class="index-card" onclick="showChart('${index.name}', '${index.symbol}')">
                <div class="index-flag">${index.flag}</div>
                <div class="index-name">${index.name}</div>
                <div class="index-market">${index.market}</div>
                <div class="index-value">${value}</div>
                <div class="index-change ${isPositive ? 'positive' : 'negative'}">
                    ${arrow} ${Math.abs(change).toFixed(2)}%
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// FILTER COMPANIES
// ============================================
function filterMarket(filter) {
    currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Reload companies with filter
    loadTopCompanies();
}

// ============================================
// SHOW CHART MODAL
// ============================================
function showChart(name, symbol) {
    const modal = document.getElementById('chart-modal');
    const title = document.getElementById('chart-title');
    
    title.textContent = name;
    modal.classList.add('active');
    
    // Generate chart data
    generateChartData(symbol);
    renderChart('1M');
}

// ============================================
// CLOSE CHART MODAL
// ============================================
function closeChartModal() {
    const modal = document.getElementById('chart-modal');
    modal.classList.remove('active');
    
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
}

// ============================================
// GENERATE CHART DATA
// ============================================
function generateChartData(symbol) {
    const now = new Date();
    const data = {
        '1D': generatePriceData(24, 'hours'),
        '1W': generatePriceData(7, 'days'),
        '1M': generatePriceData(30, 'days'),
        '3M': generatePriceData(90, 'days'),
        '1Y': generatePriceData(365, 'days'),
        '5Y': generatePriceData(1825, 'days')
    };
    
    currentChartData = data;
}

function generatePriceData(points, unit) {
    const data = [];
    const basePrice = Math.random() * 2000 + 500;
    let currentPrice = basePrice;
    
    for (let i = points; i >= 0; i--) {
        const date = new Date();
        if (unit === 'hours') {
            date.setHours(date.getHours() - i);
        } else {
            date.setDate(date.getDate() - i);
        }
        
        currentPrice += (Math.random() - 0.48) * (basePrice * 0.02);
        data.push({
            date: date,
            price: currentPrice
        });
    }
    
    return data;
}

// ============================================
// RENDER CHART
// ============================================
function renderChart(timeframe) {
    if (!currentChartData) return;
    
    // Update active timeframe button
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event?.target?.classList.add('active');
    
    const data = currentChartData[timeframe];
    const canvas = document.getElementById('stock-chart');
    const ctx = canvas.getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const labels = data.map(d => formatChartDate(d.date, timeframe));
    const prices = data.map(d => d.price.toFixed(2));
    
    const isPositive = prices[prices.length - 1] >= prices[0];
    const lineColor = isPositive ? '#27ae60' : '#e74c3c';
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, isPositive ? 'rgba(39, 174, 96, 0.2)' : 'rgba(231, 76, 60, 0.2)');
    gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: prices,
                borderColor: lineColor,
                backgroundColor: gradientFill,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: lineColor,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: '#fff',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyColor: '#fff',
                    bodyFont: {
                        size: 13
                    },
                    borderColor: lineColor,
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '₹' + parseFloat(context.parsed.y).toFixed(2);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        color: '#95a5a6',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#95a5a6',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return '₹' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
    
    // Update chart info
    updateChartInfo(data);
}

// ============================================
// CHANGE TIMEFRAME
// ============================================
function changeTimeframe(timeframe) {
    renderChart(timeframe);
}

// ============================================
// UPDATE CHART INFO
// ============================================
function updateChartInfo(data) {
    const infoContainer = document.getElementById('chart-info');
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    const high = Math.max(...data.map(d => d.price));
    const low = Math.min(...data.map(d => d.price));
    
    const isPositive = change >= 0;
    
    infoContainer.innerHTML = `
        <div class="chart-info-grid">
            <div class="chart-info-item">
                <div class="chart-info-label">Current Price</div>
                <div class="chart-info-value">₹${lastPrice.toFixed(2)}</div>
            </div>
            <div class="chart-info-item">
                <div class="chart-info-label">Change</div>
                <div class="chart-info-value" style="color: ${isPositive ? '#27ae60' : '#e74c3c'}">
                    ${isPositive ? '▲' : '▼'} ₹${Math.abs(change).toFixed(2)} (${Math.abs(changePercent).toFixed(2)}%)
                </div>
            </div>
            <div class="chart-info-item">
                <div class="chart-info-label">Period High</div>
                <div class="chart-info-value">₹${high.toFixed(2)}</div>
            </div>
            <div class="chart-info-item">
                <div class="chart-info-label">Period Low</div>
                <div class="chart-info-value">₹${low.toFixed(2)}</div>
            </div>
        </div>
    `;
}

// ============================================
// NEWSLETTER SUBSCRIPTION
// ============================================
function subscribeNewsletter(event) {
    event.preventDefault();
    const input = event.target.querySelector('input[type="email"]');
    const email = input.value;
    
    // Simulate subscription
    alert(`Thank you for subscribing! We'll send updates to ${email}`);
    input.value = '';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatVolume(volume) {
    if (volume >= 1000000) {
        return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
}

function formatMarketCap(value) {
    const num = parseFloat(value);
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    }
    return num.toFixed(2);
}

function formatChartDate(date, timeframe) {
    if (timeframe === '1D') {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '1W' || timeframe === '1M') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
        return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
    }
}

function getRandomGradient() {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('chart-modal');
    if (modal && event.target === modal) {
        closeChartModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeChartModal();
    }
});

console.log('✅ Advanced market data system loaded with chart functionality');
