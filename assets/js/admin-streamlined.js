// Streamlined Admin Panel JavaScript - BizzShort
// Only includes: Videos, Events, Advertisements

// ============ Configuration ============
const API_BASE_URL = 'https://bizzshort.onrender.com';

const API_ENDPOINTS = {
    health: `${API_BASE_URL}/api/health`,
    stats: `${API_BASE_URL}/api/stats`,
    events: `${API_BASE_URL}/api/events`,
    advertisements: `${API_BASE_URL}/api/advertisements`,
    videos: `${API_BASE_URL}/api/videos`,
    adminLogin: `${API_BASE_URL}/api/admin/login`,
    adminLogout: `${API_BASE_URL}/api/admin/logout`
};

// ============ API Helper Functions ============
async function apiRequest(endpoint, method = 'GET', data = null, isFormData = false) {
    try {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession')}`
            }
        };

        if (data && !isFormData) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        } else if (data && isFormData) {
            options.body = data;
        }

        const response = await fetch(endpoint, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Request failed');
        }

        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ============ Notification System ============
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============ Authentication ============
function checkAuth() {
    const session = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
    if (!session) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
        window.location.href = 'admin-login.html';
    }
}

// ============ Navigation ============
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }

    // Highlight active nav item
    const navItem = document.querySelector(`[href="#${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }

    // Load data for the section
    if (sectionId === 'dashboard') {
        loadDashboard();
    } else if (sectionId === 'videos') {
        loadVideos();
    } else if (sectionId === 'events') {
        loadEvents();
    } else if (sectionId === 'advertisements') {
        loadAdvertisements();
    }
}

// ============ Dashboard Functions ============
async function loadDashboard() {
    try {
        const stats = await apiRequest(API_ENDPOINTS.stats);
        
        // Update stat cards with fallback values
        document.querySelector('[data-stat="videos"]').textContent = stats.videos || 0;
        document.querySelector('[data-stat="events"]').textContent = stats.events || 0;
        document.querySelector('[data-stat="advertisements"]').textContent = stats.advertisements || 0;
        document.querySelector('[data-stat="views"]').textContent = stats.totalViews || 0;

        // Load charts
        loadTrafficChart();
        loadContentChart();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        
        // Display fallback values when API fails
        document.querySelector('[data-stat="videos"]').textContent = '0';
        document.querySelector('[data-stat="events"]').textContent = '0';
        document.querySelector('[data-stat="advertisements"]').textContent = '0';
        document.querySelector('[data-stat="views"]').textContent = '0';
        
        // Still load charts with default data
        loadTrafficChart();
        loadContentChart();
        
        showNotification('Dashboard stats unavailable. Using default values.', 'warning');
    }
}

function refreshDashboard() {
    showNotification('Refreshing dashboard...', 'info');
    loadDashboard();
}

function loadTrafficChart() {
    const ctx = document.getElementById('trafficChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Views',
                data: [1200, 1900, 3000, 5000, 6000, 7500, 8200, 9500, 10200, 11500, 12800, 14000],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function loadContentChart() {
    const ctx = document.getElementById('contentChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Videos', 'Events', 'Advertisements'],
            datasets: [{
                data: [60, 25, 15],
                backgroundColor: ['#3498db', '#27ae60', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// ============ Video Management ============
let currentVideos = [];

async function loadVideos() {
    try {
        const response = await apiRequest(API_ENDPOINTS.videos);
        currentVideos = response.data || [];
        renderVideosTable();
    } catch (error) {
        console.error('Error loading videos:', error);
        showNotification('Failed to load videos', 'error');
    }
}

function renderVideosTable() {
    const tbody = document.getElementById('videosTableBody');
    if (!tbody) return;

    if (currentVideos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-video" style="font-size: 48px; color: #e1e8ed; margin-bottom: 15px;"></i>
                    <p style="color: #6B7280;">No videos yet. Click "Add New Video" to get started.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentVideos.map(video => `
        <tr>
            <td>
                <img src="${video.thumbnail || 'assets/images/default-thumbnail.jpg'}" 
                     alt="${video.title}" 
                     style="width: 80px; height: 45px; object-fit: cover; border-radius: 4px;">
            </td>
            <td>${video.title}</td>
            <td><span class="badge badge-blue">${video.category}</span></td>
            <td><span class="badge badge-${video.source === 'youtube' ? 'red' : 'purple'}">${video.source}</span></td>
            <td>${video.views || 0}</td>
            <td>${new Date(video.createdAt).toLocaleDateString()}</td>
            <td class="actions">
                <button class="btn-icon" onclick="editVideo('${video._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="deleteVideo('${video._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showAddVideoModal() {
    const modal = document.getElementById('videoModal');
    document.getElementById('videoModalTitle').innerHTML = '<i class="fas fa-video"></i> Add New Video';
    document.getElementById('videoForm').reset();
    document.getElementById('videoId').value = '';
    modal.style.display = 'block';
}

function closeVideoModal() {
    document.getElementById('videoModal').style.display = 'none';
}

async function saveVideo(event) {
    event.preventDefault();

    const videoId = document.getElementById('videoId').value;
    const videoData = {
        title: document.getElementById('videoTitle').value,
        category: document.getElementById('videoCategory').value,
        source: document.getElementById('videoSource').value,
        url: document.getElementById('videoUrl').value,
        description: document.getElementById('videoDescription').value,
        featured: document.getElementById('videoFeatured').checked
    };

    try {
        if (videoId) {
            await apiRequest(`${API_ENDPOINTS.videos}/${videoId}`, 'PUT', videoData);
            showNotification('Video updated successfully!', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.videos, 'POST', videoData);
            showNotification('Video added successfully!', 'success');
        }

        closeVideoModal();
        loadVideos();
    } catch (error) {
        console.error('Error saving video:', error);
        showNotification(error.message || 'Failed to save video', 'error');
    }
}

async function editVideo(videoId) {
    const video = currentVideos.find(v => v._id === videoId);
    if (!video) return;

    document.getElementById('videoModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Video';
    document.getElementById('videoId').value = video._id;
    document.getElementById('videoTitle').value = video.title;
    document.getElementById('videoCategory').value = video.category;
    document.getElementById('videoSource').value = video.source;
    document.getElementById('videoUrl').value = video.url;
    document.getElementById('videoDescription').value = video.description || '';
    document.getElementById('videoFeatured').checked = video.featured || false;

    document.getElementById('videoModal').style.display = 'block';
}

async function deleteVideo(videoId) {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
        await apiRequest(`${API_ENDPOINTS.videos}/${videoId}`, 'DELETE');
        showNotification('Video deleted successfully!', 'success');
        loadVideos();
    } catch (error) {
        console.error('Error deleting video:', error);
        showNotification('Failed to delete video', 'error');
    }
}

function filterVideos() {
    const searchTerm = document.getElementById('videoSearchInput').value.toLowerCase();
    const category = document.getElementById('videoCategoryFilter').value;
    const source = document.getElementById('videoSourceFilter').value;

    const filtered = currentVideos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || video.category === category;
        const matchesSource = !source || video.source === source;
        return matchesSearch && matchesCategory && matchesSource;
    });

    const tbody = document.getElementById('videosTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 48px; color: #e1e8ed; margin-bottom: 15px;"></i>
                    <p style="color: #6B7280;">No videos match your filters</p>
                </td>
            </tr>
        `;
    } else {
        // Re-render with filtered data
        currentVideos = filtered;
        renderVideosTable();
    }
}

// ============ Event Management ============
let currentEvents = [];

async function loadEvents() {
    try {
        const response = await apiRequest(API_ENDPOINTS.events);
        currentEvents = response.data || [];
        renderEventsTable();
    } catch (error) {
        console.error('Error loading events:', error);
        showNotification('Failed to load events', 'error');
    }
}

function renderEventsTable() {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;

    if (currentEvents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-calendar-alt" style="font-size: 48px; color: #e1e8ed; margin-bottom: 15px;"></i>
                    <p style="color: #6B7280;">No events scheduled. Click "Add New Event" to create one.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentEvents.map(event => `
        <tr>
            <td>${event.title}</td>
            <td>${new Date(event.date).toLocaleDateString()}</td>
            <td>${event.location}</td>
            <td><span class="badge badge-blue">${event.type}</span></td>
            <td>${event.attendees || 0}</td>
            <td><span class="badge badge-${event.status === 'upcoming' ? 'success' : 'warning'}">${event.status}</span></td>
            <td class="actions">
                <button class="btn-icon" onclick="editEvent('${event._id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteEvent('${event._id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// ============ Advertisement Management ============
let currentAdvertisements = [];

async function loadAdvertisements() {
    try {
        const response = await apiRequest(API_ENDPOINTS.advertisements);
        currentAdvertisements = response.data || [];
        renderAdvertisementsTable();
        updateAdStats();
    } catch (error) {
        console.error('Error loading advertisements:', error);
        showNotification('Failed to load advertisements', 'error');
    }
}

function renderAdvertisementsTable() {
    const tbody = document.getElementById('advertisementsTableBody');
    if (!tbody) return;

    if (currentAdvertisements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <i class="fas fa-ad" style="font-size: 48px; color: #e1e8ed; margin-bottom: 15px;"></i>
                    <p style="color: #6B7280;">No advertisements. Click "Add New Advertisement" to create one.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentAdvertisements.map(ad => {
        const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0;
        return `
        <tr>
            <td>
                <img src="${ad.imageUrl}" alt="${ad.name}" 
                     style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px;">
            </td>
            <td>${ad.name}</td>
            <td><span class="badge badge-blue">${ad.position}</span></td>
            <td><span class="badge badge-${ad.status === 'active' ? 'success' : 'warning'}">${ad.status}</span></td>
            <td>${ad.impressions || 0}</td>
            <td>${ad.clicks || 0}</td>
            <td>${ctr}%</td>
            <td class="actions">
                <button class="btn-icon" onclick="editAd('${ad._id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteAd('${ad._id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `}).join('');
}

function updateAdStats() {
    const totalImpressions = currentAdvertisements.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
    const totalClicks = currentAdvertisements.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
    const activeAds = currentAdvertisements.filter(ad => ad.status === 'active').length;

    document.getElementById('totalImpressions').textContent = totalImpressions.toLocaleString();
    document.getElementById('totalClicks').textContent = totalClicks.toLocaleString();
    document.getElementById('avgCTR').textContent = avgCTR + '%';
    document.getElementById('activeAds').textContent = activeAds;
}

// ============ Modal Functions ============
function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

function openModal(type) {
    // Implementation for event modal
    showNotification('Event management coming soon!', 'info');
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// ============ Initialize on Page Load ============
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;

    // Load initial dashboard
    loadDashboard();

    // Setup form handler
    const videoForm = document.getElementById('videoForm');
    if (videoForm) {
        videoForm.addEventListener('submit', saveVideo);
    }
});
