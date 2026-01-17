// API Configuration for BizzShort
// This file handles API URL configuration based on environment

const APIConfig = {
    // Backend API URL - always use Render deployment for API
    BACKEND_URL: 'https://bizzshort.onrender.com',
    
    // Automatically detect the API base URL
    getBaseURL: function() {
        // Check if running locally
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;
        
        // Local development - try to detect if server is running on port 3000
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // If we're on a different port (e.g., live server 5500), connect to backend on 3000
            return `http://${hostname}:3000`;
        }
        
        // Production on Render - API is on the same origin
        if (window.location.origin.includes('render.com') || window.location.origin.includes('onrender.com')) {
            return window.location.origin;
        }
        
        // For bizzshort.com or any other hosting (Netlify, Vercel, GitHub Pages, etc.)
        // Always use the Render backend for API calls
        return this.BACKEND_URL;
    },
    
    // Get the current base URL
    baseURL: null,
    
    // Initialize the config
    init: function() {
        this.baseURL = this.getBaseURL();
        console.log('🔧 API Base URL:', this.baseURL);
        return this.baseURL;
    },
    
    // Get endpoint URL
    endpoint: function(path) {
        if (!this.baseURL) {
            this.init();
        }
        return `${this.baseURL}${path}`;
    }
};

// Initialize on load
APIConfig.init();

// Export for use in other scripts
window.APIConfig = APIConfig;
