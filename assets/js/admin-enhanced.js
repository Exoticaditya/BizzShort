// Enhanced Admin Panel JavaScript with Backend API Integration

// ============ Configuration ============
const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    articles: '/api/articles',
    events: '/api/events',
    analytics: '/api/analytics',
    health: '/api/health',
    // Admin endpoints (to be added to server.js)
    adminArticles: '/api/admin/articles',
    adminEvents: '/api/admin/events',
    adminInterviews: '/api/admin/interviews',
    adminNews: '/api/admin/news',
    adminIndustry: '/api/admin/industry',
    adminClients: '/api/admin/clients',
};

// ============ API Helper Functions ============
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message, 'error');
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
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============ Section Navigation ============
function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (event && event.target) {
        const navItem = event.target.closest('.nav-item');
        if (navItem) navItem.classList.add('active');
    }
    
    // Load data for section
    loadSectionData(sectionId);
}

// ============ Load Section Data ============
async function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            await refreshDashboard();
            break;
        case 'articles':
            await loadArticles();
            break;
        case 'events':
            await loadEvents();
            break;
    }
}

// ============ Dashboard Functions ============
async function refreshDashboard() {
    try {
        showNotification('Refreshing dashboard...', 'info');
        
        // Get analytics data
        const analyticsResponse = await apiRequest(API_ENDPOINTS.analytics);
        const analytics = analyticsResponse.data;
        
        // Update stat cards
        if (analytics) {
            updateStatCard('visitors', analytics.visitors?.total || 0);
            updateStatCard('pageViews', analytics.pageViews?.total || 0);
            updateStatCard('avgSession', analytics.avgSessionTime?.value || '0:00');
            updateStatCard('bounceRate', analytics.bounceRate?.value || 0);
        }
        
        // Get articles count
        const articlesResponse = await apiRequest(API_ENDPOINTS.articles);
        if (articlesResponse.data) {
            updateStatCard('articles', articlesResponse.data.total || 0);
        }
        
        // Get events count
        const eventsResponse = await apiRequest(API_ENDPOINTS.events);
        if (eventsResponse.data) {
            updateStatCard('events', eventsResponse.data.length || 0);
        }
        
        showNotification('Dashboard refreshed successfully!', 'success');
    } catch (error) {
        console.error('Dashboard refresh error:', error);
    }
}

function updateStatCard(type, value) {
    const statElement = document.querySelector(`[data-stat="${type}"]`);
    if (statElement) {
        statElement.textContent = value;
    }
}

// ============ Articles Management ============
async function loadArticles() {
    try {
        const response = await apiRequest(API_ENDPOINTS.articles);
        if (response.success && response.data) {
            displayArticlesTable(response.data.articles || []);
        }
    } catch (error) {
        console.error('Load articles error:', error);
    }
}

function displayArticlesTable(articles) {
    const tableBody = document.querySelector('#articles table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = articles.map(article => `
        <tr>
            <td>${article.id}</td>
            <td>${article.title}</td>
            <td>${article.category}</td>
            <td>${article.author?.name || 'Unknown'}</td>
            <td>${new Date(article.publishedAt).toLocaleDateString()}</td>
            <td><span class="badge badge-success">Published</span></td>
            <td>
                <button onclick="editArticle(${article.id})" class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteArticle(${article.id})" class="btn-icon" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function saveArticle(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const articleData = {
        title: formData.get('title'),
        category: formData.get('category'),
        content: formData.get('content'),
        author: formData.get('author'),
        image: formData.get('image'),
        excerpt: formData.get('content')?.substring(0, 200) + '...',
        slug: formData.get('title')?.toLowerCase().replace(/\s+/g, '-'),
        publishedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        readTime: Math.ceil(formData.get('content')?.split(' ').length / 200) || 1
    };
    
    try {
        // NOTE: This endpoint needs to be added to server.js
        const response = await apiRequest(API_ENDPOINTS.adminArticles, 'POST', articleData);
        
        if (response.success) {
            showNotification('Article saved successfully!', 'success');
            closeModal();
            loadArticles();
        }
    } catch (error) {
        // Fallback for when endpoint doesn't exist yet
        console.warn('Admin endpoint not available yet. Article data:', articleData);
        showNotification('Article saved (mock mode - add admin endpoints to server.js)', 'success');
        closeModal();
    }
}

async function editArticle(id) {
    try {
        const response = await apiRequest(`${API_ENDPOINTS.articles}/${id}`);
        
        if (response.success && response.data) {
            const article = response.data;
            
            // Open modal with pre-filled form
            openModal('editArticle', article);
        }
    } catch (error) {
        console.error('Edit article error:', error);
    }
}

async function deleteArticle(id) {
    if (!confirm('Are you sure you want to delete this article?')) {
        return;
    }
    
    try {
        // NOTE: This endpoint needs to be added to server.js
        await apiRequest(`${API_ENDPOINTS.adminArticles}/${id}`, 'DELETE');
        showNotification('Article deleted successfully!', 'success');
        loadArticles();
    } catch (error) {
        console.warn('Admin delete endpoint not available yet');
        showNotification('Delete functionality requires admin endpoints in server.js', 'error');
    }
}

// ============ Events Management ============
async function loadEvents() {
    try {
        const response = await apiRequest(API_ENDPOINTS.events);
        if (response.success && response.data) {
            displayEventsTable(response.data || []);
        }
    } catch (error) {
        console.error('Load events error:', error);
    }
}

function displayEventsTable(events) {
    const tableBody = document.querySelector('#events table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = events.map(event => `
        <tr>
            <td>${event.id}</td>
            <td>${event.title}</td>
            <td>${new Date(event.date).toLocaleDateString()}</td>
            <td>${event.location}</td>
            <td>${event.attendees}/${event.maxAttendees}</td>
            <td>
                <button onclick="editEvent(${event.id})" class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteEvent(${event.id})" class="btn-icon" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function saveEvent(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const eventData = {
        title: formData.get('title'),
        date: formData.get('date'),
        endDate: formData.get('endDate'),
        location: formData.get('location'),
        city: formData.get('city'),
        description: formData.get('description'),
        maxAttendees: parseInt(formData.get('maxAttendees')),
        attendees: 0,
        category: formData.get('category'),
        image: formData.get('image'),
        price: parseFloat(formData.get('price') || 0),
        currency: 'INR',
        slug: formData.get('title')?.toLowerCase().replace(/\s+/g, '-')
    };
    
    try {
        await apiRequest(API_ENDPOINTS.adminEvents, 'POST', eventData);
        showNotification('Event saved successfully!', 'success');
        closeModal();
        loadEvents();
    } catch (error) {
        console.warn('Admin endpoint not available yet. Event data:', eventData);
        showNotification('Event saved (mock mode)', 'success');
        closeModal();
    }
}

async function editEvent(id) {
    try {
        const response = await apiRequest(`${API_ENDPOINTS.events}/${id}`);
        if (response.success && response.data) {
            openModal('editEvent', response.data);
        }
    } catch (error) {
        console.error('Edit event error:', error);
    }
}

async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
        await apiRequest(`${API_ENDPOINTS.adminEvents}/${id}`, 'DELETE');
        showNotification('Event deleted successfully!', 'success');
        loadEvents();
    } catch (error) {
        showNotification('Delete functionality requires admin endpoints', 'error');
    }
}

// ============ Modal Management ============
function openModal(type, data = null) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) {
        console.error('Modal elements not found');
        return;
    }
    
    let content = '';
    
    switch(type) {
        case 'addArticle':
        case 'editArticle':
            content = `
                <h2>${data ? 'Edit' : 'Add New'} Article</h2>
                <form onsubmit="saveArticle(event)">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" class="form-input" value="${data?.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category" class="form-input" required>
                            <option ${data?.category === 'Technology' ? 'selected' : ''}>Technology</option>
                            <option ${data?.category === 'Business' ? 'selected' : ''}>Business</option>
                            <option ${data?.category === 'Markets' ? 'selected' : ''}>Markets</option>
                            <option ${data?.category === 'Startups' ? 'selected' : ''}>Startups</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Content</label>
                        <textarea name="content" class="form-textarea" rows="8" required>${data?.content || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Author</label>
                        <input type="text" name="author" class="form-input" value="${data?.author?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Featured Image URL</label>
                        <input type="url" name="image" class="form-input" value="${data?.image || ''}" required>
                    </div>
                    <button type="submit" class="btn-primary">Save Article</button>
                    <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                </form>
            `;
            break;
            
        case 'addEvent':
        case 'editEvent':
            content = `
                <h2>${data ? 'Edit' : 'Add New'} Event</h2>
                <form onsubmit="saveEvent(event)">
                    <div class="form-group">
                        <label>Event Name</label>
                        <input type="text" name="title" class="form-input" value="${data?.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" class="form-input" value="${data?.date || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" name="endDate" class="form-input" value="${data?.endDate || ''}">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" name="location" class="form-input" value="${data?.location || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>City</label>
                        <input type="text" name="city" class="form-input" value="${data?.city || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" class="form-textarea" rows="6" required>${data?.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Max Attendees</label>
                        <input type="number" name="maxAttendees" class="form-input" value="${data?.maxAttendees || 100}" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category" class="form-input" required>
                            <option ${data?.category === 'Conference' ? 'selected' : ''}>Conference</option>
                            <option ${data?.category === 'Workshop' ? 'selected' : ''}>Workshop</option>
                            <option ${data?.category === 'Webinar' ? 'selected' : ''}>Webinar</option>
                            <option ${data?.category === 'Networking' ? 'selected' : ''}>Networking</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="image" class="form-input" value="${data?.image || ''}">
                    </div>
                    <div class="form-group">
                        <label>Price (INR)</label>
                        <input type="number" name="price" class="form-input" value="${data?.price || 0}">
                    </div>
                    <button type="submit" class="btn-primary">Save Event</button>
                    <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                </form>
            `;
            break;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============ Logout Function ============
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1000);
    }
}

// ============ Initialize on Page Load ============
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminSession') === 'true' || 
                           sessionStorage.getItem('adminSession') === 'true';
    
    if (!isAuthenticated) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Test API connection
    try {
        const healthCheck = await apiRequest(API_ENDPOINTS.health);
        console.log('✅ API Connected:', healthCheck);
        showNotification('Connected to API', 'success');
    } catch (error) {
        console.error('❌ API Connection Failed:', error);
        showNotification('API Server not running! Start server.js', 'error');
    }
    
    // Load initial dashboard data
    await refreshDashboard();
    
    // Close modal on outside click
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const section = e.target.closest('.admin-section');
            const rows = section.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    });
    
    console.log('✅ Admin Panel Initialized');
});
