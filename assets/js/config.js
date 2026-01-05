// API Configuration for BizzShort
// This file handles API URL configuration based on environment

const APIConfig = {
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
        
        // Production - use the current origin if server is running on same domain
        // Otherwise use the Render deployment URL
        if (window.location.origin.includes('bizzshort') || window.location.origin.includes('render') || window.location.origin.includes('netlify') || window.location.origin.includes('vercel')) {
            return window.location.origin;
        }
        
        // Fallback to Render URL
        return 'https://bizzshort.onrender.com';
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
