/**
 * Instagram oEmbed Thumbnail Fetcher
 * Fetches real thumbnails for Instagram Reels using the oEmbed API
 * Note: Instagram's public oEmbed API may have rate limits and restrictions
 */

const InstagramThumbnailFetcher = {
    // Cache for oEmbed data
    cache: new Map(),

    // Flag to disable API calls if they consistently fail
    apiDisabled: false,

    /**
     * Fetch Instagram oEmbed data for a reel
     * @param {string} reelId - Instagram reel ID
     * @returns {Promise<object>} oEmbed data with thumbnail_url
     */
    async fetchOEmbedData(reelId) {
        // If API has been disabled due to failures, skip
        if (this.apiDisabled) {
            return null;
        }

        // Check cache first
        if (this.cache.has(reelId)) {
            return this.cache.get(reelId);
        }

        const reelUrl = `https://www.instagram.com/reel/${reelId}/`;

        // Note: The Facebook Graph API version requires an access token
        // which should be handled server-side, not in client code.
        // Using public oEmbed endpoint only (with limitations)

        try {
            const publicOEmbedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(reelUrl)}`;

            const response = await fetch(publicOEmbedUrl);
            if (response.ok) {
                const data = await response.json();
                this.cache.set(reelId, data);
                console.log(`✅ Fetched Instagram thumbnail for ${reelId}`);
                return data;
            } else if (response.status === 429) {
                // Rate limited - disable further API calls
                console.warn('⚠️ Instagram API rate limited, disabling thumbnail fetcher');
                this.apiDisabled = true;
                return null;
            } else {
                console.warn(`⚠️ Instagram oEmbed failed for ${reelId}: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.warn(`⚠️ Instagram oEmbed error for ${reelId}:`, error.message);
            return null;
        }
    },

    /**
     * Update interview card with real thumbnail
     * @param {string} reelId - Instagram reel ID
     * @param {HTMLElement} cardElement - Card DOM element
     */
    async updateCardThumbnail(reelId, cardElement) {
        const data = await this.fetchOEmbedData(reelId);
        if (!data || !data.thumbnail_url) {
            console.log(`📷 Using gradient placeholder for ${reelId} (oEmbed unavailable)`);
            return;
        }

        // Find the thumbnail container
        const thumbnailContainer = cardElement.querySelector('.instagram-thumbnail');
        if (!thumbnailContainer) return;

        // Replace gradient with real thumbnail
        thumbnailContainer.style.background = 'none';
        thumbnailContainer.innerHTML = `
            <img src="${data.thumbnail_url}" 
                 alt="${data.title || 'Instagram Reel'}" 
                 style="width:100%;height:100%;object-fit:cover;border-radius:12px;">
            <div class="instagram-play-btn">
                <i class="fab fa-instagram"></i>
            </div>
            <div class="instagram-reel-icon">
                <i class="fas fa-play"></i>
            </div>
        `;

        console.log(`✅ Updated thumbnail for ${reelId}`);
    },

    /**
     * Initialize thumbnail fetching for all interview cards
     */
    async initializeAll() {
        const cards = document.querySelectorAll('.interview-video-card[onclick*="playInstagramReel"]');

        console.log(`📸 Found ${cards.length} Instagram video cards`);

        for (const card of cards) {
            const onclickAttr = card.getAttribute('onclick');
            if (!onclickAttr) continue;

            // Extract reel ID from onclick="playInstagramReel('REEL_ID', 'Title')"
            const match = onclickAttr.match(/playInstagramReel\('([^']+)'/);
            if (match && match[1]) {
                const reelId = match[1];
                // Add slight delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
                await this.updateCardThumbnail(reelId, card);
            }
        }

        console.log('✅ Instagram thumbnail initialization complete');
    }
};

// Auto-initialize when DOM is ready and after video loader completes
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for BizzShortVideoLoader to finish
        setTimeout(() => {
            if (typeof InstagramThumbnailFetcher !== 'undefined') {
                InstagramThumbnailFetcher.initializeAll();
            }
        }, 2000); // 2 second delay to let other scripts load
    });
} else {
    // Already loaded
    setTimeout(() => {
        InstagramThumbnailFetcher.initializeAll();
    }, 2000);
}

// Export for manual use
window.InstagramThumbnailFetcher = InstagramThumbnailFetcher;
