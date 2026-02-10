/**
 * BizzShort Video Loader
 * Populates all video sections from BizzShort YouTube channel and Instagram
 * 
 * Features:
 * - Fetches real videos from /api/synced-videos
 * - News Videos: BizzShort logo (general news/updates)
 * - Client Videos: Client logo (client features/interviews)
 * - Auto-categorizes based on videoType field
 */

const BizzShortVideoLoader = {
    // API endpoint for synced videos
    apiEndpoint: '/api/synced-videos',

    // Video arrays - populated from API (no hardcoded data)
    newsVideos: [],      // Videos with BizzShort logo
    clientVideos: [],    // Videos with client logo
    reels: [],           // Instagram reels

    // Cached API data
    cachedVideos: null,
    lastFetch: null,

    // Fetch videos from API with caching
    async fetchVideos(source = null, limit = 20) {
        try {
            const baseUrl = window.APIConfig ? window.APIConfig.endpoint('/api/synced-videos') : '/api/synced-videos';
            const url = source ? `${baseUrl}?source=${source}&limit=${limit}` : `${baseUrl}?limit=${limit}`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.length > 0) {
                    // Sort by date (newest first)
                    const sorted = data.data.sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                        return dateB - dateA;
                    });
                    console.log(`📡 Fetched ${sorted.length} videos from API`);
                    return sorted;
                }
            }
        } catch (error) {
            console.warn('⚠️ API fetch failed:', error.message);
        }
        // Return empty array if API fails (no hardcoded fallback)
        return [];
    },

    // Initialize the loader
    async init() {
        console.log('🎬 BizzShort Video Loader initializing...');

        // Disable conflicting/old loaders
        window.LatestUpdatesLoader = null;
        window.BreakingNewsLoader = null;

        // Fetch real videos from API
        const apiVideos = await this.fetchVideos('youtube', 30);
        if (apiVideos && apiVideos.length > 0) {
            // Separate news videos (with BizzShort logo) and client videos
            this.newsVideos = apiVideos
                .filter(v => v.videoType !== 'client')
                .map(v => ({
                    id: v.videoId,
                    title: v.title,
                    category: v.category || 'Latest',
                    date: v.date || v.relativeTime || 'Today',
                    description: v.description || ''
                }));

            this.clientVideos = apiVideos
                .filter(v => v.videoType === 'client')
                .map(v => ({
                    id: v.videoId,
                    title: v.title,
                    category: v.category || 'Client Feature',
                    date: v.date || v.relativeTime || 'Today',
                    description: v.description || ''
                }));

            console.log(`✅ Loaded ${this.newsVideos.length} news videos, ${this.clientVideos.length} client videos`);
        } else {
            console.log('⚠️ No videos loaded from API');
        }

        this.loadBreakingNews();
        this.loadLatestUpdates('all');
        this.loadClientFeatures();
        this.loadClientInterviews();

        // Setup Category Filters
        this.setupCategoryFilters();

        console.log('✅ BizzShort Video Loader ready');
    },

    // Setup Category Filters for Latest Updates
    setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.category-filters .filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const category = button.getAttribute('data-category');
                this.loadLatestUpdates(category);
            });
        });
    },

    // Load Breaking News section (Strictly News/Logo content)
    loadBreakingNews() {
        // Use the first video as the main featured news
        const mainVideo = this.newsVideos[0];
        const thumbnail = document.getElementById('mainVideoThumbnail');
        const videoInfo = document.querySelector('.breaking-video-player .video-info');

        if (thumbnail) {
            thumbnail.src = `https://img.youtube.com/vi/${mainVideo.id}/mqdefault.jpg`;
            thumbnail.alt = mainVideo.title;
        }

        if (videoInfo) {
            videoInfo.innerHTML = `
                <span class="video-category">BREAKING NEWS</span>
                <h3>${mainVideo.title}</h3>
                <p>Latest market updates and business insights.</p>
                <div class="video-stats">
                    <span><i class="fab fa-youtube"></i> @bizz_short</span>
                    <span><i class="far fa-eye"></i> Live</span>
                    <span><i class="far fa-clock"></i> ${mainVideo.date}</span>
                </div>
            `;
        }

        // Update hidden iframe
        const iframe = document.querySelector('.breaking-video-player iframe');
        if (iframe) {
            iframe.src = `https://www.youtube-nocookie.com/embed/${mainVideo.id}?rel=0&modestbranding=1`;
        }

        // Update breaking news grid cards (Next 3 news videos)
        const breakingCards = document.querySelectorAll('.breaking-news-grid .breaking-news-card');
        const nextBreakingVideos = this.newsVideos.slice(1, 4);

        breakingCards.forEach((card, index) => {
            if (nextBreakingVideos[index]) {
                const video = nextBreakingVideos[index];

                // Set direct redirect
                card.onclick = () => {
                    const encodedTitle = encodeURIComponent(video.title);
                    window.location.href = `article.html?id=${video.id}&source=youtube&title=${encodedTitle}`;
                };
                card.style.cursor = 'pointer';

                const img = card.querySelector('.video-thumbnail img');
                if (img) {
                    img.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
                    img.alt = video.title;
                }

                const title = card.querySelector('h4');
                if (title) title.textContent = video.title;

                const badge = card.querySelector('.news-badge');
                if (badge) badge.textContent = video.category.toUpperCase();
            }
        });

        console.log('📰 Breaking News section loaded with BizzShort logo content');
    },

    // Load Latest Updates section (News/Logo Content)
    loadLatestUpdates(category = 'all') {
        const grid = document.getElementById('latestUpdatesGrid');
        if (!grid) return;

        // Use News Videos
        let videos = this.newsVideos;

        // Apply category filter
        const filteredVideos = category === 'all'
            ? videos
            : videos.filter(v => (v.category || '').toLowerCase() === category.toLowerCase());

        if (filteredVideos.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#7f8c8d;">No videos found in this category.</div>';
            return;
        }

        grid.innerHTML = filteredVideos.map(video => `
            <article class="news-video-card-large video-card" onclick="window.location.href='article.html?id=${video.id}&source=youtube&title=${encodeURIComponent(video.title)}'" style="cursor:pointer;">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" 
                         alt="${video.title}" 
                         loading="lazy">
                    <div class="play-overlay">
                        <i class="fab fa-youtube"></i>
                    </div>
                </div>
                <div class="card-content">
                    <span class="card-category">${video.category || 'Latest'}</span>
                    <h3>${video.title}</h3>
                    <div class="card-meta">
                        <span><i class="fab fa-youtube"></i> @bizz_short</span>
                        <span><i class="far fa-clock"></i> ${video.date || 'Recently'}</span>
                    </div>
                </div>
            </article>
        `).join('');

        console.log(`📊 Latest Updates section loaded for category "${category}"`);
    },

    // Load Client Features section (Client Logo/Content)
    loadClientFeatures() {
        const grid = document.getElementById('clientFeatureGrid');
        if (!grid) return;

        // Use Client Videos
        const videos = this.clientVideos;

        grid.innerHTML = videos.map(video => `
            <article class="news-video-card-large video-card" onclick="window.location.href='article.html?id=${video.id}&source=youtube&title=${encodeURIComponent(video.title)}'" style="cursor:pointer;">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" 
                         alt="${video.title}" 
                         loading="lazy">
                    <div class="play-overlay">
                        <i class="fab fa-play"></i>
                    </div>
                </div>
                <div class="card-content">
                    <span class="card-category" style="background: linear-gradient(135deg, #10b981, #059669);">${video.category || 'Feature'}</span>
                    <h3>${video.title}</h3>
                    <div class="card-meta">
                        <span><i class="fas fa-user-tie"></i> ${video.client || 'Client Success'}</span>
                        <span><i class="far fa-eye"></i> Featured</span>
                    </div>
                </div>
            </article>
        `).join('');

        console.log('🌟 Client Feature section loaded with', videos.length, 'videos');
    },

    // Load Interview & Podcasts section (Instagram Reels)
    loadClientInterviews() {
        const grid = document.getElementById('podcastGrid');
        if (!grid) return;

        const reels = this.reels;

        grid.innerHTML = reels.map(reel => `
            <div class="interview-video-card" onclick="window.location.href='article.html?id=${reel.id}&source=instagram&title=${encodeURIComponent(reel.title)}'" style="cursor:pointer;" data-reel-id="${reel.id}">
                <div class="video-embed-wrapper">
                    <div class="instagram-thumbnail" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                        <i class="fab fa-instagram" style="font-size: 3rem; color: white;"></i>
                        <div class="instagram-play-btn" style="z-index:2;">
                             <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="interview-details">
                    <span class="interview-tag"><i class="fas fa-podcast"></i> INTERVIEW</span>
                    <h3>${reel.title}</h3>
                    <div class="video-meta">
                        <span><i class="fab fa-instagram"></i> @bizz_short</span>
                        <span><i class="far fa-clock"></i> Latest</span>
                    </div>
                </div>
            </div>
        `).join('');

        console.log('🎤 Interview & Podcasts section loaded with', reels.length, 'reels');
    },

    // Fetch videos from API (for dynamic updates)
    async fetchFromAPI() {
        try {
            const response = await fetch(APIConfig.endpoint('/api/videos?limit=20'));
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.length > 0) {
                    console.log('📡 Fetched', data.data.length, 'videos from API');
                    return data.data;
                }
            }
        } catch (error) {
            console.warn('API fetch failed, using local data:', error.message);
        }
        return null;
    }
};

// Instagram Reel redirect
window.playInstagramReel = function (reelId, title) {
    if (!reelId) return;
    console.log('📸 Redirecting to article for reel:', reelId);

    // Encode parameters
    const params = new URLSearchParams({
        id: reelId,
        source: 'instagram',
        title: title || 'Instagram Reel',
        mode: 'watch'
    });

    window.location.href = `article.html?${params.toString()}`;
};



// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    // Wait a bit to ensure other scripts are loaded
    setTimeout(() => {
        BizzShortVideoLoader.init();
    }, 100);
});

// Export for external use
window.BizzShortVideoLoader = BizzShortVideoLoader;
