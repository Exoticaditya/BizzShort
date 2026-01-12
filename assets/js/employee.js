// Employee Panel JavaScript - BizzShort
// Simple CRUD operations only (no analytics)

// ============ Configuration ============
// Backend API is always on Render, regardless of where frontend is hosted
const API_BASE_URL = (function() {
    // First try to use APIConfig if available
    if (window.APIConfig && window.APIConfig.baseURL) {
        return window.APIConfig.baseURL;
    }
    
    // Fallback logic
    const hostname = window.location.hostname;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${window.location.protocol}//${hostname}:${window.location.port || 3000}`;
    }
    
    // Production on Render - same origin
    if (window.location.origin.includes('onrender.com')) {
        return window.location.origin;
    }
    
    // All other cases (bizzshort.com, netlify, vercel, etc.) - use Render backend
    return 'https://bizzshort.onrender.com';
})();

console.log('🔧 Employee Panel API URL:', API_BASE_URL);

const API_ENDPOINTS = {
    health: `${API_BASE_URL}/api/health`,
    events: `${API_BASE_URL}/api/events`,
    advertisements: `${API_BASE_URL}/api/advertisements`,
    videos: `${API_BASE_URL}/api/videos`,
    myStats: `${API_BASE_URL}/api/employee/my-stats`
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
    const user = JSON.parse(localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser') || '{}');
    
    if (!session) {
        window.location.href = 'admin-login.html';
        return false;
    }
    
    // Check if user is employee/editor
    if (user.role !== 'EDITOR' && user.role !== 'ADMIN') {
        window.location.href = 'admin-login.html';
        return false;
    }
    
    // Update UI with user info
    if (user.name) {
        document.getElementById('employeeName').textContent = user.name;
        document.getElementById('employeeAvatar').src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3498db&color=fff`;
    }
    
    return true;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminUser');
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
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to clicked nav item
    const clickedNav = document.querySelector(`a[href="#${sectionId}"]`);
    if (clickedNav) {
        clickedNav.classList.add('active');
    }
    
    // Load section data
    switch(sectionId) {
        case 'videos':
            loadVideos();
            break;
        case 'events':
            loadEvents();
            break;
        case 'advertisements':
            loadAdvertisements();
            break;
    }
}

// ============ Dashboard ============
async function loadDashboard() {
    try {
        const response = await apiRequest(API_ENDPOINTS.myStats);
        
        if (response.success) {
            document.querySelector('[data-stat="myVideos"]').textContent = response.stats.videos || 0;
            document.querySelector('[data-stat="myEvents"]').textContent = response.stats.events || 0;
            document.querySelector('[data-stat="myAds"]').textContent = response.stats.advertisements || 0;
            document.querySelector('[data-stat="totalPosts"]').textContent = 
                (response.stats.videos || 0) + (response.stats.events || 0) + (response.stats.advertisements || 0);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function refreshDashboard() {
    loadDashboard();
    showNotification('Dashboard refreshed', 'success');
}

// ============ Videos Management ============
async function loadVideos() {
    try {
        const response = await apiRequest(API_ENDPOINTS.videos);
        const tbody = document.getElementById('videosTableBody');
        const videos = response.data || [];
        
        if (!response.success || videos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <i class="fas fa-video" style="font-size: 48px; color: #e1e8ed;"></i>
                        <p style="color: #6B7280;">No videos yet.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = videos.map(video => `
            <tr>
                <td>
                    <img src="${video.thumbnail || 'assets/images/default-video.jpg'}" 
                         alt="${video.title}" 
                         style="width: 100px; height: 60px; object-fit: cover; border-radius: 6px;">
                </td>
                <td><strong>${video.title}</strong></td>
                <td><span class="badge badge-primary">${video.category || 'General'}</span></td>
                <td><span class="badge">${video.source || 'YouTube'}</span></td>
                <td>${new Date(video.createdAt || Date.now()).toLocaleDateString()}</td>
                <td>
                    <button class="btn-edit btn-sm" onclick="editVideo('${video._id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete btn-sm" onclick="deleteVideo('${video._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading videos:', error);
        showNotification('Failed to load videos', 'error');
    }
}

function showAddVideoModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-video"></i> Add New Video';
    document.getElementById('videoForm').reset();
    document.getElementById('videoId').value = '';
    document.getElementById('videoModal').style.display = 'block';
}

function closeVideoModal() {
    document.getElementById('videoModal').style.display = 'none';
}

async function saveVideo(e) {
    e.preventDefault();
    
    const videoId = document.getElementById('videoId').value;
    const videoData = {
        url: document.getElementById('videoUrl').value,
        title: document.getElementById('videoTitle').value,
        description: document.getElementById('videoDescription').value,
        category: document.getElementById('videoCategory').value
    };
    
    try {
        const method = videoId ? 'PUT' : 'POST';
        const endpoint = videoId ? `${API_ENDPOINTS.videos}/${videoId}` : API_ENDPOINTS.videos;
        
        const response = await apiRequest(endpoint, method, videoData);
        
        if (response.success) {
            showNotification(videoId ? 'Video updated successfully' : 'Video added successfully', 'success');
            closeVideoModal();
            loadVideos();
        }
    } catch (error) {
        showNotification(error.message || 'Failed to save video', 'error');
    }
}

async function deleteVideo(id) {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
        const response = await apiRequest(`${API_ENDPOINTS.videos}/${id}`, 'DELETE');
        if (response.success) {
            showNotification('Video deleted successfully', 'success');
            loadVideos();
        }
    } catch (error) {
        showNotification('Failed to delete video', 'error');
    }
}

// ============ Events Management ============
async function loadEvents() {
    try {
        const response = await apiRequest(API_ENDPOINTS.events);
        const tbody = document.getElementById('eventsTableBody');
        const events = response.data || [];
        
        if (!response.success || events.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <i class="fas fa-calendar-alt" style="font-size: 48px; color: #e1e8ed;"></i>
                        <p style="color: #6B7280;">No events yet.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = events.map(event => `
            <tr>
                <td><strong>${event.title}</strong></td>
                <td>${new Date(event.date).toLocaleDateString()}</td>
                <td>${event.location || 'TBD'}</td>
                <td><span class="badge">${event.type || 'Event'}</span></td>
                <td><span class="badge badge-success">Active</span></td>
                <td>
                    <button class="btn-edit btn-sm" onclick="editEvent('${event._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete btn-sm" onclick="deleteEvent('${event._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        showNotification('Failed to load events', 'error');
    }
}

async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
        const response = await apiRequest(`${API_ENDPOINTS.events}/${id}`, 'DELETE');
        if (response.success) {
            showNotification('Event deleted successfully', 'success');
            loadEvents();
        }
    } catch (error) {
        showNotification('Failed to delete event', 'error');
    }
}

function showAddEventModal() {
    document.getElementById('eventModalTitle').innerHTML = '<i class="fas fa-calendar-plus"></i> Add New Event';
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    document.getElementById('eventModal').style.display = 'block';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
}

async function saveEvent(e) {
    e.preventDefault();
    
    const eventId = document.getElementById('eventId').value;
    const eventData = {
        title: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        type: document.getElementById('eventType').value,
        description: document.getElementById('eventDescription').value
    };
    
    try {
        const method = eventId ? 'PUT' : 'POST';
        const endpoint = eventId ? `${API_ENDPOINTS.events}/${eventId}` : API_ENDPOINTS.events;
        
        const response = await apiRequest(endpoint, method, eventData);
        
        if (response.success) {
            showNotification(eventId ? 'Event updated successfully' : 'Event added successfully', 'success');
            closeEventModal();
            loadEvents();
        }
    } catch (error) {
        showNotification(error.message || 'Failed to save event', 'error');
    }
}

async function editEvent(id) {
    try {
        const response = await apiRequest(`${API_ENDPOINTS.events}/${id}`);
        if (response.success && response.data) {
            const event = response.data;
            document.getElementById('eventModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Event';
            document.getElementById('eventId').value = event._id;
            document.getElementById('eventName').value = event.title || '';
            document.getElementById('eventDate').value = event.date ? event.date.split('T')[0] : '';
            document.getElementById('eventTime').value = event.time || '';
            document.getElementById('eventLocation').value = event.location || '';
            document.getElementById('eventType').value = event.type || 'Conference';
            document.getElementById('eventDescription').value = event.description || '';
            document.getElementById('eventModal').style.display = 'block';
        }
    } catch (error) {
        showNotification('Failed to load event details', 'error');
    }
}

// ============ Advertisements Management ============
async function loadAdvertisements() {
    try {
        const response = await apiRequest(API_ENDPOINTS.advertisements);
        const tbody = document.getElementById('advertisementsTableBody');
        const ads = response.data || [];
        
        if (!response.success || ads.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-ad" style="font-size: 48px; color: #e1e8ed;"></i>
                        <p style="color: #6B7280;">No advertisements yet.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = ads.map(ad => `
            <tr>
                <td>
                    <img src="${ad.image || 'assets/images/ad-placeholder.jpg'}" 
                         alt="${ad.company}" 
                         style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;">
                </td>
                <td><strong>${ad.company || 'N/A'}</strong></td>
                <td><span class="badge">${ad.type || 'Banner'}</span></td>
                <td><span class="badge badge-success">Active</span></td>
                <td>${ad.startDate ? new Date(ad.startDate).toLocaleDateString() : 'N/A'}</td>
                <td>${ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="btn-edit btn-sm" onclick="editAd('${ad._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete btn-sm" onclick="deleteAd('${ad._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading advertisements:', error);
        showNotification('Failed to load advertisements', 'error');
    }
}

async function deleteAd(id) {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    
    try {
        const response = await apiRequest(`${API_ENDPOINTS.advertisements}/${id}`, 'DELETE');
        if (response.success) {
            showNotification('Advertisement deleted successfully', 'success');
            loadAdvertisements();
        }
    } catch (error) {
        showNotification('Failed to delete advertisement', 'error');
    }
}

function showAddAdModal() {
    document.getElementById('adModalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Add New Advertisement';
    document.getElementById('adForm').reset();
    document.getElementById('adId').value = '';
    document.getElementById('adModal').style.display = 'block';
}

function closeAdModal() {
    document.getElementById('adModal').style.display = 'none';
}

async function saveAd(e) {
    e.preventDefault();
    
    const adId = document.getElementById('adId').value;
    const adData = {
        company: document.getElementById('adCompany').value,
        title: document.getElementById('adTitle').value,
        type: document.getElementById('adType').value,
        image: document.getElementById('adImage').value,
        clickUrl: document.getElementById('adClickUrl').value,
        startDate: document.getElementById('adStartDate').value,
        endDate: document.getElementById('adEndDate').value
    };
    
    try {
        const method = adId ? 'PUT' : 'POST';
        const endpoint = adId ? `${API_ENDPOINTS.advertisements}/${adId}` : API_ENDPOINTS.advertisements;
        
        const response = await apiRequest(endpoint, method, adData);
        
        if (response.success) {
            showNotification(adId ? 'Advertisement updated successfully' : 'Advertisement added successfully', 'success');
            closeAdModal();
            loadAdvertisements();
        }
    } catch (error) {
        showNotification(error.message || 'Failed to save advertisement', 'error');
    }
}

async function editAd(id) {
    try {
        const response = await apiRequest(`${API_ENDPOINTS.advertisements}/${id}`);
        if (response.success && response.data) {
            const ad = response.data;
            document.getElementById('adModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Advertisement';
            document.getElementById('adId').value = ad._id;
            document.getElementById('adCompany').value = ad.company || '';
            document.getElementById('adTitle').value = ad.title || '';
            document.getElementById('adType').value = ad.type || 'Banner';
            document.getElementById('adImage').value = ad.image || '';
            document.getElementById('adClickUrl').value = ad.clickUrl || '';
            document.getElementById('adStartDate').value = ad.startDate ? ad.startDate.split('T')[0] : '';
            document.getElementById('adEndDate').value = ad.endDate ? ad.endDate.split('T')[0] : '';
            document.getElementById('adModal').style.display = 'block';
        }
    } catch (error) {
        showNotification('Failed to load advertisement details', 'error');
    }
}

// Modal opening functions
function openModal(type) {
    switch(type) {
        case 'addVideo':
            showAddVideoModal();
            break;
        case 'addEvent':
            showAddEventModal();
            break;
        case 'addAd':
            showAddAdModal();
            break;
        default:
            showNotification('Unknown modal type', 'error');
    }
}

async function editVideo(id) {
    try {
        const response = await apiRequest(`${API_ENDPOINTS.videos}/${id}`);
        if (response.success && response.data) {
            const video = response.data;
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Video';
            document.getElementById('videoId').value = video._id;
            document.getElementById('videoUrl').value = video.url || '';
            document.getElementById('videoTitle').value = video.title || '';
            document.getElementById('videoDescription').value = video.description || '';
            document.getElementById('videoCategory').value = video.category || 'Business';
            document.getElementById('videoModal').style.display = 'block';
        }
    } catch (error) {
        showNotification('Failed to load video details', 'error');
    }
}

function filterVideos() {
    // Simple filter - can be enhanced
    loadVideos();
}

// ============ Initialize on Page Load ============
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;

    // Load initial dashboard
    loadDashboard();

    // Setup video form handler
    const videoForm = document.getElementById('videoForm');
    if (videoForm) {
        videoForm.addEventListener('submit', saveVideo);
    }
    
    // Setup event form handler
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', saveEvent);
    }
    
    // Setup ad form handler
    const adForm = document.getElementById('adForm');
    if (adForm) {
        adForm.addEventListener('submit', saveAd);
    }
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const videoModal = document.getElementById('videoModal');
        const eventModal = document.getElementById('eventModal');
        const adModal = document.getElementById('adModal');
        
        if (event.target == videoModal) {
            closeVideoModal();
        }
        if (event.target == eventModal) {
            closeEventModal();
        }
        if (event.target == adModal) {
            closeAdModal();
        }
    };
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
            closeEventModal();
            closeAdModal();
        }
    });
});
