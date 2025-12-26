// Enhanced Admin Panel JavaScript - Connected to Backend API

// ============ Configuration ============
const API_BASE_URL = 'https://bizzshort.onrender.com';
const USE_STATIC_MODE = false; // Connected to backend

const MOCK_DATA = {}; // Cleared mock data to ensure we use API

const API_ENDPOINTS = {
    health: `${API_BASE_URL}/api/health`,
    analytics: `${API_BASE_URL}/api/analytics`,
    stats: `${API_BASE_URL}/api/stats`, // Add stats endpoint
    articles: `${API_BASE_URL}/api/articles`,
    events: `${API_BASE_URL}/api/events`,
    interviews: `${API_BASE_URL}/api/interviews`,
    news: `${API_BASE_URL}/api/news`,
    industry: `${API_BASE_URL}/api/industry`,
    clients: `${API_BASE_URL}/api/clients`,
    users: `${API_BASE_URL}/api/users`,
    users: `${API_BASE_URL}/api/users`,
    advertisements: `${API_BASE_URL}/api/advertisements`,
    videos: `${API_BASE_URL}/api/videos`,
    youtubeConvert: `${API_BASE_URL}/api/youtube/convert`,
    youtubePublish: `${API_BASE_URL}/api/youtube/publish`,
    adminLogin: `${API_BASE_URL}/api/admin/login`,
    adminLogout: `${API_BASE_URL}/api/admin/logout`
};

// ============ API Helper Functions ============
async function apiRequest(endpoint, method = 'GET', data = null, isFormData = false) {
    if (USE_STATIC_MODE) {
        console.log(`[Static] ${method} ${endpoint}`, data);
        await new Promise(r => setTimeout(r, 500)); // Simulate delay

        // Return mock data based on endpoint
        if (endpoint.includes('articles')) return { success: true, data: MOCK_DATA.articles };
        if (endpoint.includes('events')) return { success: true, data: MOCK_DATA.events };
        if (endpoint.includes('interviews')) return { success: true, data: MOCK_DATA.interviews };
        if (endpoint.includes('news')) return { success: true, data: MOCK_DATA.news };
        if (endpoint.includes('industry')) return { success: true, data: MOCK_DATA.industry };
        if (endpoint.includes('clients')) return { success: true, data: MOCK_DATA.clients };
        if (endpoint.includes('users')) return { success: true, data: MOCK_DATA.users };

        return { success: true, message: 'Operation simulated in static mode' };
    }

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
            options.body = data; // FormData sets its own content-type
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
    switch (sectionId) {
        case 'dashboard':
            await refreshDashboard();
            break;
        case 'articles':
            await loadArticles();
            break;
        case 'events':
            await loadEvents();
            break;
        case 'interviews':
            await loadInterviews();
            break;
        case 'news':
            await loadNews();
            break;
        case 'industry':
            await loadIndustry();
            break;
        case 'clients':
            await loadClients();
            break;
        case 'users':
            await loadUsersData();
            break;
        case 'videos':
            await loadVideos();
            break;
    }
}

// ============ Dashboard Functions ============
async function refreshDashboard() {
    try {
        const response = await apiRequest(API_ENDPOINTS.stats);
        if (response.success && response.data) {
            // Update dashboard stats with real data
            const stats = response.data;
            updateStatCard('articles', stats.articles);
            updateStatCard('users', stats.users); // Assuming you want active users = total users for now
            updateStatCard('events', stats.events);
            updateStatCard('interviews', stats.interviews);
        }
        showNotification('Dashboard refreshed', 'success');
    } catch (error) {
        console.error('Dashboard refresh error:', error);
        showNotification('Failed to refresh dashboard', 'error');
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
            displayArticlesTable(response.data);
        }
    } catch (error) {
        console.error('Load articles error:', error);
        showNotification('Failed to load articles', 'error');
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

async function saveArticle(event, id) {
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

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${API_ENDPOINTS.articles}/${id}` : API_ENDPOINTS.articles;

    try {
        const response = await apiRequest(endpoint, method, articleData);

        if (response.success) {
            showNotification(response.message || 'Article saved successfully!', 'success');
            closeModal();
            loadArticles();
        }
    } catch (error) {
        console.error('Save article error:', error);
        showNotification(error.message || 'Failed to save article', 'error');
    }
}

async function editArticle(id) {
    try {
        const response = await apiRequest(`${API_ENDPOINTS.articles}/${id}`);

        if (response.success && response.data) {
            openModal('editArticle', response.data);
        }
    } catch (error) {
        console.error('Edit article error:', error);
        showNotification('Failed to load article', 'error');
    }
}

async function deleteArticle(id) {
    if (!confirm('Are you sure you want to delete this article?')) {
        return;
    }

    try {
        const response = await apiRequest(`${API_ENDPOINTS.articles}/${id}`, 'DELETE');
        showNotification(response.message || 'Article deleted successfully!', 'success');
        loadArticles();
    } catch (error) {
        console.error('Delete article error:', error);
        showNotification(error.message || 'Failed to delete article', 'error');
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

async function saveEvent(event, id) {
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

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${API_ENDPOINTS.events}/${id}` : API_ENDPOINTS.events;

    try {
        const response = await apiRequest(endpoint, method, eventData);
        showNotification(response.message || 'Event saved successfully!', 'success');
        closeModal();
        loadEvents();
    } catch (error) {
        console.error('Save event error:', error);
        showNotification(error.message || 'Failed to save event', 'error');
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
        const response = await apiRequest(`${API_ENDPOINTS.events}/${id}`, 'DELETE');
        showNotification(response.message || 'Event deleted successfully!', 'success');
        loadEvents();
    } catch (error) {
        console.error('Delete event error:', error);
        showNotification(error.message || 'Failed to delete event', 'error');
    }
}

// ============ Interviews Management ============
async function loadInterviews() {
    try {
        const response = await apiRequest(API_ENDPOINTS.interviews);
        if (response.success && response.data) {
            displayInterviews(response.data);
        }
    } catch (error) {
        console.error('Load interviews error:', error);
    }
}

function displayInterviews(interviews) {
    const container = document.querySelector('#interviews .content-grid');
    if (!container) return;

    if (interviews.length === 0) {
        container.innerHTML = '<p class="empty-state-text">No interviews yet.</p>';
        return;
    }

    container.innerHTML = interviews.map(interview => `
        <div class="content-card">
            <img src="${interview.image || 'https://via.placeholder.com/400x250'}" alt="${interview.name}">
            <div class="card-body">
                <h4>${interview.name} - ${interview.designation}</h4>
                <p>${interview.company}</p>
                <div class="card-actions">
                    <button class="btn-small btn-edit" onclick="editInterview(${interview.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteInterview(${interview.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function saveInterview(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${API_ENDPOINTS.interviews}/${id}` : API_ENDPOINTS.interviews;

    try {
        const response = await apiRequest(endpoint, method, data);
        showNotification(response.message || 'Interview saved successfully!', 'success');
        closeModal();
        loadInterviews();
    } catch (error) {
        console.error('Save interview error:', error);
        showNotification(error.message || 'Failed to save interview', 'error');
    }
}

async function editInterview(id) {
    try {
        const response = await apiRequest(API_ENDPOINTS.interviews);
        if (response.success && response.data) {
            const item = response.data.find(i => i.id === id);
            if (item) openModal('editInterview', item);
        }
    } catch (error) {
        console.error('Edit interview error:', error);
    }
}

async function deleteInterview(id) {
    if (!confirm('Are you sure you want to delete this interview?')) return;
    try {
        const response = await apiRequest(`${API_ENDPOINTS.interviews}/${id}`, 'DELETE');
        showNotification(response.message || 'Interview deleted successfully!', 'success');
        loadInterviews();
    } catch (error) {
        console.error('Delete interview error:', error);
        showNotification(error.message || 'Failed to delete interview', 'error');
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

    switch (type) {
        case 'addArticle':
        case 'editArticle':
            content = `
                <h2>${data ? 'Edit' : 'Add New'} Article</h2>
                <form onsubmit="saveArticle(event, ${data ? `'${data.id}'` : 'null'})">
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
                <form onsubmit="saveEvent(event, ${data ? `'${data.id}'` : 'null'})">
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

        case 'addInterview':
        case 'editInterview':
            content = `
                <h2>${data ? 'Edit' : 'Add New'} Interview</h2>
                <form onsubmit="saveInterview(event, ${data ? `'${data.id}'` : 'null'})">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="name" class="form-input" value="${data?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Designation</label>
                        <input type="text" name="designation" class="form-input" value="${data?.designation || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" name="company" class="form-input" value="${data?.company || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="image" class="form-input" value="${data?.image || ''}">
                    </div>
                     <div class="form-group">
                        <label>Video URL (Optional)</label>
                        <input type="url" name="videoUrl" class="form-input" value="${data?.videoUrl || ''}">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" class="form-textarea" rows="4">${data?.description || ''}</textarea>
                    </div>
                    <button type="submit" class="btn-primary">Save Interview</button>
                    <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                </form>
            `;
            break;

        case 'addNews':
        case 'editNews':
            content = `
                <h2>${data ? 'Edit' : 'Add'} Breaking News</h2>
                <form onsubmit="saveNews(event, ${data ? `'${data.id}'` : 'null'})">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" class="form-input" value="${data?.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Content</label>
                        <textarea name="content" class="form-textarea" rows="4" required>${data?.content || ''}</textarea>
                    </div>
                    <button type="submit" class="btn-primary">Save News</button>
                    <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                </form>
            `;
            break;

        case 'addIndustry':
        case 'editIndustry':
            content = `
                <h2>${data ? 'Edit' : 'Add'} Industry Update</h2>
                <form onsubmit="saveIndustry(event, ${data ? `'${data.id}'` : 'null'})">
                    <div class="form-group">
                        <label>Sector</label>
                        <input type="text" name="sector" class="form-input" value="${data?.sector || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                         <textarea name="description" class="form-textarea" rows="4" required>${data?.description || ''}</textarea>
                    </div>
                     <div class="form-group">
                        <label>Icon (FontAwesome class, e.g., 'microchip')</label>
                        <input type="text" name="icon" class="form-input" value="${data?.icon || 'industry'}">
                    </div>
                    <button type="submit" class="btn-primary">Save Update</button>
                    <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                </form>
            `;
            break;

        case 'addClient':
        case 'editClient':
            content = `
                <h2>${data ? 'Edit' : 'Add'} Client</h2>
                <form onsubmit="saveClient(event, ${data ? `'${data.id}'` : 'null'})">
                    <div class="form-group">
                        <label>Client Name</label>
                        <input type="text" name="name" class="form-input" value="${data?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Type</label>
                        <select name="type" class="form-input">
                             <option value="Corporate" ${data?.type === 'Corporate' ? 'selected' : ''}>Corporate</option>
                             <option value="Startup" ${data?.type === 'Startup' ? 'selected' : ''}>Startup</option>
                             <option value="Partner" ${data?.type === 'Partner' ? 'selected' : ''}>Partner</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Logo URL</label>
                        <input type="url" name="image" class="form-input" value="${data?.image || ''}" required>
                    </div>
                    <button type="submit" class="btn-primary">Save Client</button>
                    <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                </form>
            `;
            break;

        case 'addUser':
        case 'editUser':
            content = `
                 <h2>${data ? 'Edit' : 'Add'} User</h2>
                <form onsubmit="saveUser(event, ${data ? `'${data.id}'` : 'null'})">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="name" class="form-input" value="${data?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" class="form-input" value="${data?.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                         <select name="role" class="form-input">
                             <option value="USER" ${data?.role === 'USER' ? 'selected' : ''}>User</option>
                             <option value="ADMIN" ${data?.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
                             <option value="EDITOR" ${data?.role === 'EDITOR' ? 'selected' : ''}>Editor</option>
                        </select>
                    </div>
                     <div class="form-group">
                        <label>Status</label>
                         <select name="status" class="form-input">
                             <option value="Active" ${data?.status === 'Active' ? 'selected' : ''}>Active</option>
                             <option value="Inactive" ${data?.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                     <div class="form-group">
                        <label>Password ${data ? '(Leave blank to keep current)' : '*'}</label>
                        <input type="password" name="password" class="form-input" ${!data ? 'required' : ''}>
                    </div>
                    <button type="submit" class="btn-primary">Save User</button>
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
document.addEventListener('DOMContentLoaded', async function () {
    // Check authentication
    const sessionToken = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');

    if (!sessionToken) {
        console.warn('No session token found, redirecting to login');
        window.location.href = 'admin-login.html';
        return;
    }

    // Verify session with backend
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/verify-session`, {
            method: 'GET',
            headers: {
                'session-id': sessionToken,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (!result.valid) {
            console.warn('Session validation failed, redirecting to login');
            localStorage.removeItem('adminSession');
            sessionStorage.removeItem('adminSession');
            window.location.href = 'admin-login.html';
            return;
        }

        console.log('✅ Session validated for user:', result.user?.name || 'Admin');
        
        // Update user info in header if available
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement && result.user) {
            userNameElement.textContent = result.user.name;
        }

    } catch (error) {
        console.error('Session verification error:', error);
        // In development mode or static mode, allow operation
        if (USE_STATIC_MODE) {
            console.log('✅ Admin Panel: Static mode active (Session verification bypassed)');
        } else {
            showNotification('Unable to verify session with server', 'error');
        }
    }

    showNotification('Admin Panel Ready', 'success');

    // Close modal on outside click
    window.onclick = function (event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };

    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function (e) {
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

// ============ Dashboard Refresh Function ============
async function refreshDashboard() {
    try {
        // Load all stats
        const statsResponse = await apiRequest(API_ENDPOINTS.stats);
        
        if (statsResponse.success && statsResponse.data) {
            // Update stat cards
            const statsData = statsResponse.data;
            
            updateStatCard('articles', statsData.articles || 0);
            updateStatCard('events', statsData.events || 0);
            updateStatCard('users', statsData.users || 0);
            updateStatCard('interviews', statsData.interviews || 0);
        }
        
        showNotification('Dashboard refreshed', 'success');
        
    } catch (error) {
        console.error('Dashboard refresh error:', error);
        // Use fallback data in static mode
        if (USE_STATIC_MODE) {
            updateStatCard('articles', 45);
            updateStatCard('events', 12);
            updateStatCard('users', 8);
            updateStatCard('interviews', 15);
        }
    }
}

function updateStatCard(statName, value) {
    const statElement = document.querySelector(`[data-stat="${statName}"]`);
    if (statElement) {
        statElement.textContent = value.toLocaleString();
    }
}

// ============ Section Navigation ============
function showSection(sectionId) {
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
        }
    });

    // Update active section
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    // Load section data
    switch(sectionId) {
        case 'dashboard':
            refreshDashboard();
            break;
        case 'articles':
            loadArticles();
            break;
        case 'events':
            loadEvents();
            break;
        case 'interviews':
            loadInterviews();
            break;
        case 'news':
            loadNews();
            break;
        case 'industry':
            loadIndustry();
            break;
        case 'clients':
            loadClients();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'videos':
            loadVideos();
            break;
    }
}

// ============ News Management ============
async function loadNews() {
    try {
        const response = await apiRequest(API_ENDPOINTS.news);
        if (response.success && response.data) {
            displayNews(response.data);
        }
    } catch (error) {
        console.error('Load news error:', error);
    }
}

function displayNews(newsItems) {
    const container = document.querySelector('#news .news-list');
    if (!container) return;

    if (newsItems.length === 0) {
        container.innerHTML = '<p class="empty-state-text">No news items yet.</p>';
        return;
    }

    container.innerHTML = newsItems.map(news => `
        <div class="news-item-admin">
            <h4>${news.title}</h4>
            <p>${news.content}</p>
            <div class="item-meta">
                <span>${new Date(news.createdAt || Date.now()).toLocaleString()}</span>
                <button class="btn-icon" onclick="editNews(${news.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteNews(${news.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

async function deleteNews(id) {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
        const response = await apiRequest(`${API_ENDPOINTS.news}/${id}`, 'DELETE');
        showNotification(response.message || 'News deleted successfully!', 'success');
        loadNews();
    } catch (error) {
        console.error('Delete news error:', error);
        showNotification(error.message || 'Failed to delete news', 'error');
    }
}

async function saveNews(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${API_ENDPOINTS.news}/${id}` : API_ENDPOINTS.news;

    try {
        const response = await apiRequest(endpoint, method, data);
        showNotification(response.message || 'News saved successfully!', 'success');
        closeModal();
        loadNews();
    } catch (error) {
        console.error('Save news error:', error);
        showNotification(error.message || 'Failed to save news', 'error');
    }
}

async function editNews(id) {
    try {
        const response = await apiRequest(API_ENDPOINTS.news);
        if (response.success && response.data) {
            const item = response.data.find(n => n.id === id);
            if (item) openModal('editNews', item);
        }
    } catch (error) {
        console.error('Edit news error:', error);
    }
}

// ============ Industry Management ============
async function loadIndustry() {
    try {
        const response = await apiRequest(API_ENDPOINTS.industry);
        if (response.success && response.data) {
            displayIndustry(response.data);
        }
    } catch (error) {
        console.error('Load industry error:', error);
    }
}

function displayIndustry(industryItems) {
    const container = document.querySelector('#industry .content-grid');
    if (!container) return;

    if (industryItems.length === 0) {
        container.innerHTML = '<p class="empty-state-text">No industry updates yet.</p>';
        return;
    }

    container.innerHTML = industryItems.map(item => `
        <div class="industry-card-admin">
            <div class="card-icon"><i class="fas fa-${item.icon || 'industry'}"></i></div>
            <h4>${item.sector}</h4>
            <p>${item.description}</p>
            <div class="card-actions">
                <button class="btn-small btn-edit" onclick="editIndustry(${item.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteIndustry(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function deleteIndustry(id) {
    if (!confirm('Are you sure you want to delete this industry update?')) return;

    try {
        const response = await apiRequest(`${API_ENDPOINTS.industry}/${id}`, 'DELETE');
        showNotification(response.message || 'Industry update deleted successfully!', 'success');
        loadIndustry();
    } catch (error) {
        console.error('Delete industry error:', error);
        showNotification(error.message || 'Failed to delete industry update', 'error');
    }
}

async function saveIndustry(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${API_ENDPOINTS.industry}/${id}` : API_ENDPOINTS.industry;

    try {
        const response = await apiRequest(endpoint, method, data);
        showNotification(response.message || 'Industry update saved successfully!', 'success');
        closeModal();
        loadIndustry();
    } catch (error) {
        console.error('Save industry error:', error);
        showNotification(error.message || 'Failed to save industry update', 'error');
    }
}

async function editIndustry(id) {
    try {
        // Industry data is usually already loaded, but fetching single item is safer if API supports it.
        // If API doesn't have GET /:id, we might need to find it from list.
        // Assuming we rely on list reload for now or fetch list and find.
        // However, standard REST usually has GET /:id. The backend I wrote DOES NOT have GET /:id for all, only GET / which returns all.
        // server.js for industry: app.get('/api/industry', ...) returns all.
        // I should probably fetch all and find, OR just pass data if available.
        // Let's implement fetch all and find for now as robust fallback.

        const response = await apiRequest(API_ENDPOINTS.industry);
        if (response.success && response.data) {
            const item = response.data.find(i => i.id === id);
            if (item) openModal('editIndustry', item);
        }
    } catch (error) {
        console.error('Edit industry error:', error);
    }
}

// ============ Clients Management ============
async function loadClients() {
    try {
        const response = await apiRequest(API_ENDPOINTS.clients);
        if (response.success && response.data) {
            displayClients(response.data);
        }
    } catch (error) {
        console.error('Load clients error:', error);
    }
}

function displayClients(clients) {
    const container = document.querySelector('#clients .content-grid');
    if (!container) return;

    if (clients.length === 0) {
        container.innerHTML = '<p class="empty-state-text">No clients yet.</p>';
        return;
    }

    container.innerHTML = clients.map(client => `
        <div class="content-card">
            <img src="${client.image}" alt="${client.name}">
            <div class="card-body">
                <h4>${client.name}</h4>
                <p>${client.type}</p>
                <div class="card-actions">
                    <button class="btn-small btn-edit" onclick="editClient(${client.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteClient(${client.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function deleteClient(id) {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
        const response = await apiRequest(`${API_ENDPOINTS.clients}/${id}`, 'DELETE');
        showNotification(response.message || 'Client deleted successfully!', 'success');
        loadClients();
    } catch (error) {
        console.error('Delete client error:', error);
        showNotification(error.message || 'Failed to delete client', 'error');
    }
}

async function saveClient(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // Handle file upload manually if needed, or let apiRequest handle FormData
    // The apiRequest helper handles FormData if passed as data with isFormData=true

    // However, my modal form construction for others used JSON.
    // Client has file upload.

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${API_ENDPOINTS.clients}/${id}` : API_ENDPOINTS.clients;

    try {
        const response = await apiRequest(endpoint, method, formData, true);
        showNotification(response.message || 'Client saved successfully!', 'success');
        closeModal();
        loadClients();
    } catch (error) {
        console.error('Save client error:', error);
        showNotification(error.message || 'Failed to save client', 'error');
    }
}

async function editClient(id) {
    try {
        const response = await apiRequest(API_ENDPOINTS.clients);
        if (response.success && response.data) {
            const item = response.data.find(c => c.id === id);
            if (item) openModal('editClient', item);
        }
    } catch (error) {
        console.error('Edit client error:', error);
    }
}

// ============ Users Management ============
async function loadUsersData() {
    try {
        const response = await apiRequest(API_ENDPOINTS.users);
        if (response.success && response.data) {
            displayUsers(response.data);
        }
    } catch (error) {
        console.error('Load users error:', error);
    }
}

function displayUsers(users) {
    const tbody = document.querySelector('#users table tbody');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No users yet.</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-blue">${user.role}</span></td>
            <td><span class="badge badge-success">${user.status}</span></td>
            <td>${user.joined}</td>
            <td class="actions">
                <button class="btn-icon" onclick="editUserData(${user.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await apiRequest(`${API_ENDPOINTS.users}/${id}`, 'DELETE');
        showNotification(response.message || 'User deleted successfully!', 'success');
        loadUsersData();
    } catch (error) {
        console.error('Delete user error:', error);
        showNotification(error.message || 'Failed to delete user', 'error');
    }
}

async function saveUser(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Remove empty password if editing
    if (id && !data.password) delete data.password;

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${API_ENDPOINTS.users}/${id}` : API_ENDPOINTS.users;

    try {
        const response = await apiRequest(endpoint, method, data);
        showNotification(response.message || 'User saved successfully!', 'success');
        closeModal();
        loadUsersData();
    } catch (error) {
        console.error('Save user error:', error);
        showNotification(error.message || 'Failed to save user', 'error');
    }
}

function editUserData(id) { // Renamed from editUser to match HTML call
    apiRequest(API_ENDPOINTS.users).then(response => {
        if (response.success && response.data) {
            const item = response.data.find(u => u.id === id);
            if (item) openModal('editUser', item);
        }
    });
}

// ============ Video Card Generator ============
async function convertYouTubeToArticle() {
    const urlInput = document.getElementById('youtubeUrl');
    const titleInput = document.getElementById('articleTitle');
    const categorySelect = document.getElementById('articleCategory');
    const descriptionInput = document.getElementById('videoDescription');
    const featuredCheck = document.getElementById('featuredVideo');
    const fullscreenCheck = document.getElementById('enableFullscreen');
    const pipCheck = document.getElementById('enablePiP');

    if (!urlInput || !urlInput.value) {
        showNotification('Please enter a video URL (YouTube or Instagram)', 'error');
        return;
    }

    // Extract video ID and determine source
    const videoInfo = extractVideoInfo(urlInput.value);
    if (!videoInfo) {
        showNotification('Invalid video URL. Please use YouTube or Instagram links', 'error');
        return;
    }

    try {
        // Create video card data
        const videoCardData = {
            videoId: videoInfo.videoId,
            source: videoInfo.source,
            url: urlInput.value,
            title: titleInput.value || `${videoInfo.source} Video`,
            description: descriptionInput.value || '',
            category: categorySelect.value || 'General',
            thumbnail: videoInfo.thumbnail,
            embedUrl: videoInfo.embedUrl,
            featured: featuredCheck ? featuredCheck.checked : false,
            fullscreen: fullscreenCheck ? fullscreenCheck.checked : true,
            pip: pipCheck ? pipCheck.checked : true,
            createdAt: new Date().toISOString()
        };

        // Show preview
        displayVideoCardPreview(videoCardData);
        window.currentVideoCard = videoCardData;

        showNotification('Video card generated! Review and publish', 'success');
    } catch (error) {
        console.error('Generate video card error:', error);
        showNotification(error.message || 'Failed to generate video card', 'error');
    }
}

function extractVideoInfo(url) {
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return {
            videoId,
            source: 'youtube',
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
        };
    }

    // Instagram URL patterns
    const instagramRegex = /instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/i;
    const instagramMatch = url.match(instagramRegex);
    
    if (instagramMatch) {
        const postId = instagramMatch[2];
        return {
            videoId: postId,
            source: 'instagram',
            thumbnail: '/assets/images/instagram-placeholder.jpg',
            embedUrl: `https://www.instagram.com/p/${postId}/embed/`
        };
    }

    return null;
}

function displayVideoCardPreview(videoData) {
    const previewContainer = document.getElementById('articlePreview');
    const previewContent = document.getElementById('previewContent');

    if (!previewContainer || !previewContent) return;

    const featuredBadge = videoData.featured ? '<span class="featured-badge">FEATURED</span>' : '';
    
    previewContent.innerHTML = `
        <div class="video-card-player" data-fullscreen="${videoData.fullscreen}" data-pip="${videoData.pip}">
            ${featuredBadge}
            <div class="video-player-frame">
                <iframe 
                    src="${videoData.embedUrl}" 
                    data-video-id="${videoData.videoId}"
                    data-source="${videoData.source}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-card-info">
                <h3>${videoData.title}</h3>
                <p>${videoData.description}</p>
                <div class="video-card-meta">
                    <span class="video-category">
                        <i class="fas fa-tag"></i> ${videoData.category}
                    </span>
                    <div class="video-stats">
                        <span><i class="fab fa-${videoData.source}"></i> ${videoData.source}</span>
                        ${videoData.fullscreen ? '<span><i class="fas fa-expand"></i> Fullscreen</span>' : ''}
                        ${videoData.pip ? '<span><i class="fas fa-clone"></i> PiP</span>' : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    previewContainer.style.display = 'block';

    // Initialize video player for preview
    setTimeout(() => {
        const playerElement = previewContent.querySelector('.video-player-frame');
        if (playerElement && window.VideoCardPlayer) {
            new VideoCardPlayer(playerElement, {
                enableFullscreen: videoData.fullscreen,
                enablePiP: videoData.pip
            });
        }
    }, 100);
}

async function publishArticle() {
    if (!window.currentVideoCard) {
        showNotification('No video card to publish', 'error');
        return;
    }

    try {
        const response = await apiRequest(API_ENDPOINTS.videos, 'POST', window.currentVideoCard);
        showNotification(response.message || 'Video card published successfully!', 'success');
        resetConverter();
        loadVideos();
    } catch (error) {
        console.error('Publish video card error:', error);
        showNotification(error.message || 'Failed to publish video card', 'error');
    }
}

function resetConverter() {
    const urlInput = document.getElementById('youtubeUrl');
    const titleInput = document.getElementById('articleTitle');
    const descriptionInput = document.getElementById('videoDescription');
    const featuredCheck = document.getElementById('featuredVideo');
    const fullscreenCheck = document.getElementById('enableFullscreen');
    const pipCheck = document.getElementById('enablePiP');
    const previewContainer = document.getElementById('articlePreview');

    if (urlInput) urlInput.value = '';
    if (titleInput) titleInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
    if (featuredCheck) featuredCheck.checked = false;
    if (fullscreenCheck) fullscreenCheck.checked = true;
    if (pipCheck) pipCheck.checked = true;
    if (previewContainer) previewContainer.style.display = 'none';
    window.currentVideoCard = null;
}

console.log('\u2705 Admin Panel Initialized');
// ============ Video Management ============
async function loadVideos() {
    try {
        const response = await apiRequest(API_ENDPOINTS.videos);
        if (response.success && response.data) {
            displayVideosTable(response.data);
        }
    } catch (error) {
        console.error('Load videos error:', error);
        showNotification('Failed to load videos', 'error');
    }
}

function displayVideosTable(videos) {
    const tableBody = document.getElementById('videoTableBody');
    if (!tableBody) return;

    if (videos.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No videos found. Add one!</td></tr>';
        return;
    }

    tableBody.innerHTML = videos.map(video => `
        <tr>
            <td><img src="${video.thumbnail}" style="width: 80px; height: 45px; object-fit: cover; border-radius: 4px;"></td>
            <td>
                <strong>${video.title}</strong><br>
                <small style="color:#666">${video.videoId}</small>
            </td>
            <td><span class="badge badge-blue">${video.category}</span></td>
            <td><i class="fab fa-${video.source}"></i> ${video.source}</td>
            <td>
                <button onclick="editVideo('${video.id}')" class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
                <button onclick="deleteVideo('${video.id}')" class="btn-icon" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function showAddVideoModal(editMode = false) {
    const container = document.getElementById('addVideoFormContainer');
    if (container) {
        container.style.display = 'block';
        if (!editMode) {
            const form = document.getElementById('videoForm');
            if (form) form.reset();
            document.getElementById('videoId').value = '';
            document.getElementById('videoFormTitle').innerText = 'Add New Video';
        }
    }
}

function hideAddVideoModal() {
    const container = document.getElementById('addVideoFormContainer');
    if (container) container.style.display = 'none';
}

// Video Form Handler
const videoForm = document.getElementById('videoForm');
if (videoForm) {
    videoForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = document.getElementById('videoId').value;
        const url = document.getElementById('videoUrl').value;
        let videoId = url;

        const source = document.getElementById('videoSource').value;

        if (source === 'youtube') {
            const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            if (ytMatch) videoId = ytMatch[1];
        }

        let thumbnail = '';
        if (source === 'youtube') {
            thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        } else {
            thumbnail = 'https://via.placeholder.com/320x180?text=Instagram+Video';
        }

        const data = {
            title: document.getElementById('videoTitle').value,
            category: document.getElementById('videoCategory').value,
            source: source,
            videoId: videoId,
            description: document.getElementById('videoDescription').value,
            featured: document.getElementById('videoFeatured').checked,
            thumbnail: thumbnail,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            duration: '10:00', // Placeholder
            views: '0'
        };

        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `${API_ENDPOINTS.videos}/${id}` : API_ENDPOINTS.videos;

        try {
            const response = await apiRequest(endpoint, method, data);
            if (response.success) {
                showNotification('Video saved successfully', 'success');
                hideAddVideoModal();
                loadVideos();
            }
        } catch (err) {
            console.error(err);
            showNotification(err.message || 'Failed to save video', 'error');
        }
    });
}

async function deleteVideo(id) {
    if (!confirm("Delete this video?")) return;
    try {
        await apiRequest(`${API_ENDPOINTS.videos}/${id}`, 'DELETE');
        showNotification('Video deleted', 'success');
        loadVideos();
    } catch (err) { showNotification('Delete failed', 'error'); }
}

async function editVideo(id) {
    try {
        const response = await apiRequest(API_ENDPOINTS.videos);
        if (response.success && response.data) {
            const video = response.data.find(v => v.id === id);
            if (video) {
                document.getElementById('videoId').value = video.id;
                document.getElementById('videoTitle').value = video.title;
                document.getElementById('videoCategory').value = video.category;
                document.getElementById('videoSource').value = video.source;
                document.getElementById('videoUrl').value = video.videoId;
                document.getElementById('videoDescription').value = video.description;
                document.getElementById('videoFeatured').checked = video.featured;

                document.getElementById('videoFormTitle').innerText = 'Edit Video';
                showAddVideoModal(true);
            }
        }
    } catch (err) { console.error(err); }
}
