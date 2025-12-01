// BizzShort - Backend API Integration Layer

class BizzShortAPI {
    constructor() {
        this.baseURL = this.getAPIBaseURL();
        this.endpoints = {
            // Content Endpoints
            articles: '/api/articles',
            articleById: '/api/articles/:id',
            categories: '/api/categories',
            trending: '/api/articles/trending',
            popular: '/api/articles/popular',
            latest: '/api/articles/latest',
            
            // Analytics Endpoints
            analytics: '/api/analytics',
            traffic: '/api/analytics/traffic',
            engagement: '/api/analytics/engagement',
            sources: '/api/analytics/sources',
            
            // User Endpoints
            newsletter: '/api/newsletter/subscribe',
            contact: '/api/contact',
            feedback: '/api/feedback',
            
            // Advertisement Endpoints
            ads: '/api/advertisements',
            adUpload: '/api/advertisements/upload',
            adStats: '/api/advertisements/stats',
            
            // Events Endpoints
            events: '/api/events',
            eventById: '/api/events/:id',
            eventRegister: '/api/events/:id/register',
            
            // Search
            search: '/api/search',
            autocomplete: '/api/search/autocomplete'
        };
        
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    getAPIBaseURL() {
        // Development vs Production
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        
        return 'https://api.bizzshort.com';
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const config = { ...defaultOptions, ...options };
        
        // Add authorization token if available
        const token = this.getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('API Request Failed:', error);
            return { success: false, error: error.message };
        }
    }

    // GET request with caching
    async get(endpoint, useCache = true) {
        const cacheKey = `GET_${endpoint}`;
        
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        const result = await this.request(endpoint, { method: 'GET' });
        
        if (result.success && useCache) {
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
        }

        return result;
    }

    // POST request
    async post(endpoint, data) {
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return await this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // File upload
    async upload(endpoint, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const url = `${this.baseURL}${endpoint}`;
        const token = this.getAuthToken();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload Error: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Upload Failed:', error);
            return { success: false, error: error.message };
        }
    }

    // ============ Content API Methods ============

    async getArticles(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `${this.endpoints.articles}?${queryString}`;
        return await this.get(endpoint);
    }

    async getArticleById(id) {
        const endpoint = this.endpoints.articleById.replace(':id', id);
        return await this.get(endpoint);
    }

    async getTrendingArticles() {
        return await this.get(this.endpoints.trending);
    }

    async getPopularArticles() {
        return await this.get(this.endpoints.popular);
    }

    async getLatestArticles(limit = 10) {
        return await this.get(`${this.endpoints.latest}?limit=${limit}`);
    }

    async getCategories() {
        return await this.get(this.endpoints.categories);
    }

    // ============ Analytics API Methods ============

    async getAnalytics(period = '7d') {
        return await this.get(`${this.endpoints.analytics}?period=${period}`, false);
    }

    async getTrafficData(period = '7d') {
        return await this.get(`${this.endpoints.traffic}?period=${period}`, false);
    }

    async getEngagementMetrics() {
        return await this.get(this.endpoints.engagement, false);
    }

    async getTrafficSources() {
        return await this.get(this.endpoints.sources, false);
    }

    // ============ User Interaction API Methods ============

    async subscribeNewsletter(email) {
        return await this.post(this.endpoints.newsletter, { email });
    }

    async submitContact(formData) {
        return await this.post(this.endpoints.contact, formData);
    }

    async submitFeedback(feedback) {
        return await this.post(this.endpoints.feedback, feedback);
    }

    // ============ Advertisement API Methods ============

    async getAdvertisements(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return await this.get(`${this.endpoints.ads}?${queryString}`);
    }

    async uploadAdvertisement(file, adData) {
        return await this.upload(this.endpoints.adUpload, file, adData);
    }

    async getAdStatistics() {
        return await this.get(this.endpoints.adStats, false);
    }

    // ============ Events API Methods ============

    async getEvents(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return await this.get(`${this.endpoints.events}?${queryString}`);
    }

    async getEventById(id) {
        const endpoint = this.endpoints.eventById.replace(':id', id);
        return await this.get(endpoint);
    }

    async registerForEvent(eventId, userData) {
        const endpoint = this.endpoints.eventRegister.replace(':id', eventId);
        return await this.post(endpoint, userData);
    }

    // ============ Search API Methods ============

    async search(query, filters = {}) {
        const params = { q: query, ...filters };
        const queryString = new URLSearchParams(params).toString();
        return await this.get(`${this.endpoints.search}?${queryString}`);
    }

    async getAutocomplete(query) {
        return await this.get(`${this.endpoints.autocomplete}?q=${query}`);
    }

    // ============ Utility Methods ============

    getAuthToken() {
        return localStorage.getItem('bizzshort_auth_token');
    }

    setAuthToken(token) {
        localStorage.setItem('bizzshort_auth_token', token);
    }

    clearAuthToken() {
        localStorage.removeItem('bizzshort_auth_token');
    }

    clearCache() {
        this.cache.clear();
    }

    // Mock data for development (when backend is not available)
    getMockData(type) {
        const mockData = {
            articles: {
                success: true,
                data: {
                    articles: [
                        {
                            id: 1,
                            title: 'Indian Stock Market Hits New All-Time High',
                            category: 'Market Updates',
                            excerpt: 'Sensex crosses 85,000 mark driven by strong IT sector performance',
                            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
                            author: 'Rajesh Kumar',
                            date: '2025-11-30',
                            views: 45234,
                            readTime: '5 min'
                        },
                        {
                            id: 2,
                            title: 'Startups Raise Record $12B in Funding',
                            category: 'Business News',
                            excerpt: 'Indian startup ecosystem sees unprecedented growth in Q4 2025',
                            image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800',
                            author: 'Priya Sharma',
                            date: '2025-11-29',
                            views: 38192,
                            readTime: '4 min'
                        }
                    ],
                    total: 250,
                    page: 1,
                    limit: 10
                }
            },
            analytics: {
                success: true,
                data: {
                    visitors: 245382,
                    pageViews: 1200000,
                    avgSessionTime: '4:32',
                    bounceRate: 32.4,
                    growth: {
                        visitors: 12.5,
                        pageViews: 18.3,
                        sessionTime: 8.7,
                        bounceRate: -5.2
                    }
                }
            },
            events: {
                success: true,
                data: {
                    events: [
                        {
                            id: 1,
                            title: 'India Business Summit 2025',
                            date: '2025-12-15',
                            location: 'Mumbai, India',
                            category: 'Conference',
                            attendees: 500,
                            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
                        }
                    ]
                }
            }
        };

        return mockData[type] || { success: false, error: 'Mock data not available' };
    }
}

// Initialize API client
const api = new BizzShortAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BizzShortAPI;
}
