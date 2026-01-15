/**
 * Advertisement Manager
 * Manages advertisements with analytics and tracking
 */

let advertisements = [];
let adCharts = {};
let currentAdTab = 'active';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAdvertisements();
    updateAdStats();
    initializeCharts();
});

/**
 * Load advertisements from localStorage
 */
function loadAdvertisements() {
    const stored = localStorage.getItem('bizzshortAds');
    if (stored) {
        try {
            advertisements = JSON.parse(stored);
            displayAds();
            updateAdStats();
        } catch (e) {
            console.error('Error loading ads:', e);
            advertisements = [];
        }
    }
}

/**
 * Save advertisements to localStorage
 */
function saveAds() {
    localStorage.setItem('bizzshortAds', JSON.stringify(advertisements));
}

/**
 * Show add advertisement modal
 */
function showAddAdModal() {
    document.getElementById('adModal').style.display = 'flex';
}

/**
 * Close advertisement modal
 */
function closeAdModal() {
    document.getElementById('adModal').style.display = 'none';
    document.getElementById('adForm').reset();
    document.getElementById('adImagePreview').style.display = 'none';
}

/**
 * Preview uploaded image
 */
function previewAdImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('adImagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Save new advertisement
 */
function saveAdvertisement(event) {
    event.preventDefault();
    
    const name = document.getElementById('adName').value;
    const position = document.getElementById('adPosition').value;
    const status = document.getElementById('adStatus').value;
    const url = document.getElementById('adUrl').value;
    const startDate = document.getElementById('adStartDate').value;
    const endDate = document.getElementById('adEndDate').value;
    const imageFile = document.getElementById('adImage').files[0];
    
    if (!imageFile) {
        alert('Please upload an image');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const ad = {
            id: Date.now(),
            name: name,
            position: position,
            status: status,
            url: url,
            image: e.target.result,
            startDate: startDate || new Date().toISOString().split('T')[0],
            endDate: endDate || '',
            impressions: 0,
            clicks: 0,
            ctr: 0,
            createdDate: new Date().toISOString(),
            analytics: {
                hourly: Array(24).fill(0),
                daily: []
            }
        };
        
        advertisements.push(ad);
        saveAds();
        displayAds();
        updateAdStats();
        closeAdModal();
        
        alert('Advertisement added successfully!');
    };
    reader.readAsDataURL(imageFile);
}

/**
 * Display advertisements in tables
 */
function displayAds() {
    displayActiveAds();
    displayAllAds();
}

/**
 * Display active ads
 */
function displayActiveAds() {
    const tbody = document.getElementById('activeAdsBody');
    if (!tbody) return; // Exit if element doesn't exist
    
    const activeAds = advertisements.filter(ad => ad.status === 'active');
    
    if (activeAds.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <i class="fas fa-ad" style="font-size: 48px; color: #e1e8ed; margin-bottom: 15px;"></i>
                    <p style="color: #6B7280;">No active advertisements. Click "Add New Advertisement" to create one.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = activeAds.map(ad => `
        <tr>
            <td>
                <img src="${ad.image}" alt="${ad.name}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 6px;">
            </td>
            <td><strong>${ad.name}</strong></td>
            <td><span class="badge badge-blue">${ad.position}</span></td>
            <td><span class="badge badge-success">${ad.status}</span></td>
            <td>${ad.impressions.toLocaleString()}</td>
            <td>${ad.clicks.toLocaleString()}</td>
            <td>${ad.ctr.toFixed(2)}%</td>
            <td>
                <div class="actions">
                    ${ad.status === 'active' 
                        ? `<button class="btn-small" style="background: #f39c12; color: white;" onclick="toggleAdStatus(${ad.id})">Pause</button>`
                        : `<button class="btn-small" style="background: #27ae60; color: white;" onclick="toggleAdStatus(${ad.id})">Activate</button>`
                    }
                    <button class="btn-small btn-edit" onclick="viewAdDetails(${ad.id})">View</button>
                    <button class="btn-small btn-delete" onclick="deleteAd(${ad.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Display all ads
 */
function displayAllAds() {
    const tbody = document.getElementById('allAdsBody');
    if (!tbody) return; // Exit if element doesn't exist
    
    if (advertisements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <i class="fas fa-ad" style="font-size: 48px; color: #e1e8ed; margin-bottom: 15px;"></i>
                    <p style="color: #6B7280;">No advertisements created yet.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = advertisements.map(ad => {
        const statusClass = ad.status === 'active' ? 'badge-success' : ad.status === 'paused' ? 'badge-warning' : 'badge-danger';
        return `
            <tr>
                <td>
                    <img src="${ad.image}" alt="${ad.name}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 6px;">
                </td>
                <td><strong>${ad.name}</strong></td>
                <td><span class="badge badge-blue">${ad.position}</span></td>
                <td><span class="badge ${statusClass}">${ad.status}</span></td>
                <td>${ad.startDate}</td>
                <td>${ad.endDate || 'N/A'}</td>
                <td>
                    <div style="font-size: 12px;">
                        <div>${ad.impressions.toLocaleString()} views</div>
                        <div>${ad.clicks.toLocaleString()} clicks</div>
                        <div style="color: #27ae60; font-weight: 600;">${ad.ctr.toFixed(2)}% CTR</div>
                    </div>
                </td>
                <td>
                    <div class="actions">
                        <button class="btn-small btn-edit" onclick="viewAdDetails(${ad.id})">View</button>
                        <button class="btn-small btn-delete" onclick="deleteAd(${ad.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Update advertisement statistics
 */
function updateAdStats() {
    const totalImpressions = advertisements.reduce((sum, ad) => sum + ad.impressions, 0);
    const totalClicks = advertisements.reduce((sum, ad) => sum + ad.clicks, 0);
    const activeAdsCount = advertisements.filter(ad => ad.status === 'active').length;
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    
    document.getElementById('totalImpressions').textContent = totalImpressions.toLocaleString();
    document.getElementById('totalClicks').textContent = totalClicks.toLocaleString();
    document.getElementById('avgCTR').textContent = avgCTR.toFixed(2) + '%';
    document.getElementById('activeAds').textContent = activeAdsCount;
}

/**
 * Switch between ad tabs
 */
function switchAdTab(tab) {
    currentAdTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.ad-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.ad-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tab === 'active') {
        document.getElementById('activeAdsTab').classList.add('active');
    } else if (tab === 'analytics') {
        document.getElementById('analyticsTab').classList.add('active');
        updateAnalyticsCharts();
    } else if (tab === 'all') {
        document.getElementById('allAdsTab').classList.add('active');
    }
}

/**
 * Toggle ad status
 */
function toggleAdStatus(adId) {
    const ad = advertisements.find(a => a.id === adId);
    if (ad) {
        ad.status = ad.status === 'active' ? 'paused' : 'active';
        saveAds();
        displayAds();
        updateAdStats();
    }
}

/**
 * Delete advertisement
 */
function deleteAd(adId) {
    if (confirm('Are you sure you want to delete this advertisement?')) {
        advertisements = advertisements.filter(a => a.id !== adId);
        saveAds();
        displayAds();
        updateAdStats();
    }
}

/**
 * View ad details
 */
function viewAdDetails(adId) {
    const ad = advertisements.find(a => a.id === adId);
    if (!ad) return;
    
    alert(`Ad Details:\n\nName: ${ad.name}\nPosition: ${ad.position}\nStatus: ${ad.status}\nImpressions: ${ad.impressions}\nClicks: ${ad.clicks}\nCTR: ${ad.ctr.toFixed(2)}%\n\nCreated: ${new Date(ad.createdDate).toLocaleDateString()}`);
}

/**
 * Filter ads
 */
function filterAds() {
    const searchTerm = document.getElementById('adSearchInput').value.toLowerCase();
    const statusFilter = document.getElementById('adStatusFilter').value;
    const positionFilter = document.getElementById('adPositionFilter').value;
    
    const filtered = advertisements.filter(ad => {
        const matchesSearch = ad.name.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || ad.status === statusFilter;
        const matchesPosition = !positionFilter || ad.position === positionFilter;
        return matchesSearch && matchesStatus && matchesPosition;
    });
    
    const tbody = document.getElementById('allAdsBody');
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 48px; color: #e1e8ed; margin-bottom: 15px;"></i>
                    <p style="color: #6B7280;">No advertisements match your filters.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filtered.map(ad => {
        const statusClass = ad.status === 'active' ? 'badge-success' : ad.status === 'paused' ? 'badge-warning' : 'badge-danger';
        return `
            <tr>
                <td>
                    <img src="${ad.image}" alt="${ad.name}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 6px;">
                </td>
                <td><strong>${ad.name}</strong></td>
                <td><span class="badge badge-blue">${ad.position}</span></td>
                <td><span class="badge ${statusClass}">${ad.status}</span></td>
                <td>${ad.startDate}</td>
                <td>${ad.endDate || 'N/A'}</td>
                <td>
                    <div style="font-size: 12px;">
                        <div>${ad.impressions.toLocaleString()} views</div>
                        <div>${ad.clicks.toLocaleString()} clicks</div>
                        <div style="color: #27ae60; font-weight: 600;">${ad.ctr.toFixed(2)}% CTR</div>
                    </div>
                </td>
                <td>
                    <div class="actions">
                        <button class="btn-small btn-edit" onclick="viewAdDetails(${ad.id})">View</button>
                        <button class="btn-small btn-delete" onclick="deleteAd(${ad.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Initialize analytics charts
 */
function initializeCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded yet');
        return;
    }

    // Performance over time chart
    const perfCtx = document.getElementById('adPerformanceChart');
    if (perfCtx) {
        adCharts.performance = new Chart(perfCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Impressions',
                    data: [1200, 1900, 1500, 2100, 1800, 2300, 2000],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Clicks',
                    data: [45, 72, 58, 85, 68, 92, 78],
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Position performance chart
    const posCtx = document.getElementById('positionChart');
    if (posCtx) {
        adCharts.position = new Chart(posCtx, {
            type: 'doughnut',
            data: {
                labels: ['Header', 'Sidebar', 'Footer', 'Inline'],
                datasets: [{
                    data: [35, 30, 20, 15],
                    backgroundColor: [
                        '#3498db',
                        '#27ae60',
                        '#f39c12',
                        '#e74c3c'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Hourly performance chart
    const hourlyCtx = document.getElementById('hourlyChart');
    if (hourlyCtx) {
        adCharts.hourly = new Chart(hourlyCtx, {
            type: 'bar',
            data: {
                labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
                datasets: [{
                    label: 'Clicks by Hour',
                    data: [12, 8, 15, 42, 58, 65, 72, 45],
                    backgroundColor: '#e74c3c'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

/**
 * Update analytics charts with real data
 */
function updateAnalyticsCharts() {
    // Update top performing ads
    const topAdsContainer = document.getElementById('topAdsContainer');
    const sortedAds = [...advertisements].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
    
    if (sortedAds.length === 0) {
        topAdsContainer.innerHTML = '<p class="empty-state-text">No data available yet</p>';
    } else {
        topAdsContainer.innerHTML = sortedAds.map((ad, index) => `
            <div style="padding: 15px; border-bottom: 1px solid #e1e8ed; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-size: 24px; font-weight: 700; color: #e74c3c;">#${index + 1}</span>
                    <div>
                        <div style="font-weight: 600; color: #2c3e50;">${ad.name}</div>
                        <div style="font-size: 12px; color: #6B7280;">${ad.position}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: #27ae60;">${ad.clicks} clicks</div>
                    <div style="font-size: 12px; color: #6B7280;">${ad.ctr.toFixed(2)}% CTR</div>
                </div>
            </div>
        `).join('');
    }
}

// Simulate ad impressions and clicks (for demo purposes)
function simulateAdActivity() {
    advertisements.forEach(ad => {
        if (ad.status === 'active') {
            // Random impressions between 10-50
            ad.impressions += Math.floor(Math.random() * 40) + 10;
            // Random clicks between 1-5
            ad.clicks += Math.floor(Math.random() * 5) + 1;
            // Calculate CTR
            ad.ctr = (ad.clicks / ad.impressions) * 100;
        }
    });
    saveAds();
    updateAdStats();
    displayAds();
}

// Simulate activity every 30 seconds (for demo)
setInterval(simulateAdActivity, 30000);
