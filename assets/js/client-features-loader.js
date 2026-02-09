/**
 * Client Features Loader
 * Loads client feature videos from API (videoType='client' and section='client-features')
 */

class ClientFeaturesLoader {
    constructor() {
        // Use APIConfig if available, otherwise fallback to Render URL
        this.apiBaseURL = window.APIConfig && window.APIConfig.baseURL
            ? window.APIConfig.baseURL
            : 'https://bizzshort.onrender.com';
        this.init();
    }

    async init() {
        console.log('🎯 Loading client features from:', this.apiBaseURL);
        await this.loadClientFeatures();
    }

    async loadClientFeatures() {
        try {
            // Fetch ONLY client feature videos
            const response = await fetch(`${this.apiBaseURL}/api/videos?source=youtube&section=client-features&videoType=client&limit=10`);

            if (!response.ok) {
                console.warn(`API returned ${response.status}, using fallback`);
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            const videos = result.data || result;
            console.log('🎯 Client feature videos loaded:', videos ? videos.length : 0);

            if (videos && videos.length > 0) {
                this.updateClientFeatureGrid(videos);
            } else {
                console.log('📺 No client feature videos found');
                this.showEmptyMessage();
            }
        } catch (error) {
            console.error('❌ Failed to load client features:', error);
            this.showEmptyMessage();
        }
    }

    updateClientFeatureGrid(videos) {
        const grid = document.getElementById('clientFeatureGrid');
        if (!grid) {
            console.warn('⚠️ clientFeatureGrid element not found');
            return;
        }

        // Clear existing content
        grid.innerHTML = '';

        videos.forEach((video, index) => {
            const card = this.createClientFeatureCard(video, index);
            grid.appendChild(card);
        });

        console.log(`✅ Updated ${videos.length} client feature cards`);
    }

    createClientFeatureCard(video, index) {
        const article = document.createElement('article');
        article.className = 'news-card-large video-card client-feature-card';
        article.dataset.videoId = video.videoId || video.youtubeId;
        article.dataset.category = video.category?.toLowerCase() || 'business';
        article.style.cursor = 'pointer';

        const videoId = video.videoId || video.youtubeId;
        const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const maxTitleLength = window.innerWidth <= 768 ? 90 : 80;
        const maxDescLength = window.innerWidth <= 768 ? 140 : 120;
        const title = (video.title || 'Client Feature').substring(0, maxTitleLength);
        const description = (video.description || 'Learn about this featured client.').substring(0, maxDescLength);
        const category = video.category || 'Business';
        const views = this.formatViews(video.views || 0);
        const timeAgo = video.date || this.getTimeAgo(video.publishedAt || video.createdAt);

        // Click handler to open article page
        const encodedTitle = encodeURIComponent(video.title || 'Client Feature');
        const encodedDesc = encodeURIComponent(video.description || '');
        article.onclick = function() {
            console.log('🎯 Client feature card clicked:', videoId);
            window.location.href = `article.html?id=${videoId}&source=youtube&title=${encodedTitle}&desc=${encodedDesc}`;
        };

        article.innerHTML = `
            <div class="video-thumbnail">
                <img src="${thumbnailUrl}" 
                     alt="${title}" 
                     loading="lazy"
                     onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
                <div class="play-overlay">
                    <i class="fab fa-youtube"></i>
                </div>
                <span class="video-duration">${video.duration || '5:00'}</span>
            </div>
            <div class="card-content">
                <span class="card-category client-badge" style="background: linear-gradient(135deg, #059669, #047857); color: white;">
                    🎯 CLIENT FEATURE
                </span>
                <h3>${title}${title.length >= 80 ? '...' : ''}</h3>
                <p>${description}...</p>
                <div class="card-meta">
                    <span><i class="fab fa-youtube"></i> @bizz_short</span>
                    <span><i class="far fa-eye"></i> ${views} views</span>
                    <span><i class="far fa-clock"></i> ${timeAgo}</span>
                </div>
            </div>
        `;

        return article;
    }

    showEmptyMessage() {
        const grid = document.getElementById('clientFeatureGrid');
        if (!grid) return;

        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-video" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 1rem;"></i>
                <h3 style="color: #4a5568; margin-bottom: 0.5rem;">No Client Features Available</h3>
                <p style="color: #718096;">Featured client content will appear here soon.</p>
            </div>
        `;
    }

    formatViews(views) {
        if (!views) return '0';
        const num = parseInt(views);
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    getTimeAgo(dateString) {
        if (!dateString) return 'recently';

        const date = new Date(dateString);
        const now = new Date();
        const secondsAgo = Math.floor((now - date) / 1000);

        if (secondsAgo < 60) return 'just now';
        if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
        if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
        if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)} days ago`;
        if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 604800)} weeks ago`;
        return `${Math.floor(secondsAgo / 2592000)} months ago`;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ClientFeaturesLoader();
    });
} else {
    new ClientFeaturesLoader();
}
