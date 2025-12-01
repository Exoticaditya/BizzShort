// Analytics Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart').getContext('2d');
    new Chart(trafficCtx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
            datasets: [{
                label: 'Daily Visitors',
                data: [2800, 3200, 3800, 4100, 3900, 4500, 4800],
                borderColor: '#1e3c72',
                backgroundColor: 'rgba(30, 60, 114, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Demographics Pie Chart
    const demographicsCtx = document.getElementById('demographicsChart').getContext('2d');
    new Chart(demographicsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Business Professionals', 'Entrepreneurs', 'Investors', 'Students', 'Others'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    '#1e3c72',
                    '#2a5298',
                    '#64b5f6',
                    '#90caf9',
                    '#bbdefb'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Animate metric cards on scroll
    const metricCards = document.querySelectorAll('.metric-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    metricCards.forEach(card => {
        observer.observe(card);
    });

    // Real-time data simulation
    function updateRealTimeMetrics() {
        const metrics = [
            { element: '.metric-card:nth-child(1) h3', baseValue: 125450, variance: 50 },
            { element: '.metric-card:nth-child(2) h3', baseValue: 78920, variance: 30 },
            { element: '.metric-card:nth-child(4) h3', baseValue: 68.5, variance: 0.5, isPercentage: true }
        ];

        metrics.forEach(metric => {
            const element = document.querySelector(metric.element);
            if (element) {
                const randomChange = (Math.random() - 0.5) * metric.variance;
                const newValue = metric.baseValue + randomChange;
                
                if (metric.isPercentage) {
                    element.textContent = newValue.toFixed(1) + '%';
                } else {
                    element.textContent = Math.round(newValue).toLocaleString();
                }
            }
        });
    }

    // Update metrics every 30 seconds
    setInterval(updateRealTimeMetrics, 30000);

    // Smooth scrolling for CTA buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Export analytics data functionality
    function exportAnalyticsData() {
        const analyticsData = {
            timestamp: new Date().toISOString(),
            pageViews: 125450,
            uniqueVisitors: 78920,
            avgSessionDuration: '4:32',
            engagementRate: '68.5%',
            topArticles: [
                'Sensex Hits New All-Time High',
                'Indian Startups Raise $12B in Q4',
                'RBI Digital Banking Guidelines',
                'Reliance Q3 Earnings Report',
                'Tech IPO Market Outlook 2026'
            ],
            trafficSources: {
                direct: '42.5%',
                google: '35.2%',
                social: '15.8%',
                referral: '4.2%',
                email: '2.3%'
            }
        };

        const dataStr = JSON.stringify(analyticsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bizzshort_analytics_' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Add export button functionality if it exists
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAnalyticsData);
    }
});