/**
 * Instagram Thumbnail Fetcher (Server-Side Proxy Version)
 * Fetches real thumbnails for Instagram Reels via our server-side proxy
 * This avoids CORS issues and rate limiting faced by client-side requests
 */

const InstagramThumbnailFetcher = {
    // Cache for fetched data
    cache: new Map(),

    // API base URL
    getApiBase() {
        return window.APIConfig && window.APIConfig.baseURL
            ? window.APIConfig.baseURL
            : 'https://bizzshort.onrender.com';
    },

    /**
     * Fetch Instagram thumbnail via server-side proxy
     * @param {string} reelId - Instagram reel ID
     * @returns {Promise<object>} Thumbnail data with thumbnailUrl
     */
    async fetchThumbnail(reelId) {
        // Check cache first
        if (this.cache.has(reelId)) {
            return this.cache.get(reelId);
        }

        try {
            const response = await fetch(`${this.getApiBase()}/api/instagram-thumbnail/${reelId}`);
            const result = await response.json();

            if (result.success && result.data && result.data.thumbnailUrl) {
                this.cache.set(reelId, result.data);
                console.log(`✅ Fetched Instagram thumbnail for ${reelId}`);
                return result.data;
            } else {
                console.log(`📷 Using gradient placeholder for ${reelId} (thumbnail unavailable)`);
                return null;
            }
        } catch (error) {
            console.warn(`⚠️ Instagram thumbnail fetch error for ${reelId}:`, error.message);
            return null;
        }
    },

    /**
     * Update all Instagram thumbnail images on the page
     * Looks for images with data-proxy-url attribute
     */
    async updateAllThumbnails() {
        const cards = document.querySelectorAll('.interview-video-card[data-reel-id]');
        console.log(`🎬 Found ${cards.length} Instagram reel cards to update`);

        for (const card of cards) {
            const reelId = card.getAttribute('data-reel-id');
            const img = card.querySelector('.insta-thumb-img');

            if (!reelId || !img) continue;

            const data = await this.fetchThumbnail(reelId);

            if (data && data.thumbnailUrl) {
                img.src = data.thumbnailUrl;
                img.style.display = 'block';
                console.log(`📸 Updated thumbnail for ${reelId}`);
            }
        }
    },

    /**
     * Initialize and update thumbnails after DOM is ready
     */
    init() {
        // Wait for video loader to finish, then update thumbnails
        setTimeout(() => {
            this.updateAllThumbnails();
        }, 2000); // Wait 2 seconds for video cards to load
    }
};

// Auto-initialize after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Delayed initialization to ensure video cards are loaded first
    setTimeout(() => {
        InstagramThumbnailFetcher.init();
    }, 1500);
});

// Export for external use
window.InstagramThumbnailFetcher = InstagramThumbnailFetcher;

console.log('✅ Instagram Thumbnail Fetcher (Server Proxy) loaded');
