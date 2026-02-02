/**
 * BizzShort Video Loader
 * Populates all video sections from BizzShort YouTube channel and Instagram
 * Connects YouTube, Instagram, and Website seamlessly
 * 
 * Features:
 * - Auto-fetches from /api/synced-videos (daily 8 AM sync)
 * - Fallback to hardcoded data if API unavailable
 * - Populates Breaking News, Latest Updates, Client Interviews
 * - Category-wise video organization
 */

const BizzShortVideoLoader = {
    // API endpoint for synced videos
    apiEndpoint: '/api/synced-videos',

    // BizzShort Channel Info (Fallback data)
    youtube: {
        handle: '@bizz_short',
        channelUrl: 'https://www.youtube.com/@bizz_short',
        // Real videos from BizzShort YouTube channel (synced from API)
        videos: [
            { id: 'fH8Ir7doWGk', title: 'Weekly Market Roundup: Top Gainers & Losers', category: 'Markets', featured: true },
            { id: 'pK70FxjUJCY', title: 'Manufacturing Sector: Make in India Success Stories', category: 'Industry' },
            { id: 'tR1ZlYUvzUo', title: 'E-commerce Growth: Online Retail & Consumer Trends', category: 'Technology' },
            { id: 'zX280yTaG_E', title: 'Energy Sector Update: Oil Prices & Renewable Energy', category: 'Industry' },
            { id: '47bNBV5Ca7Y', title: 'Real Estate Market: Property Trends & Investment Tips', category: 'Markets' },
            { id: 'dHFaUxh_sBE', title: 'Stock Market Analysis: Nifty & Sensex Today', category: 'Markets' },
            { id: 'TXoQOkT8FiQ', title: 'Indian Economy Update: GDP Growth & Outlook', category: 'Economy' },
            { id: 'ZZND7BcDA_c', title: 'Startup Funding News: Investment Rounds', category: 'Startups' },
            { id: 'DBjSV7cGluE', title: 'Banking Sector Update: RBI Policies', category: 'Banking' },
            { id: 'B8ulzu1X8Y8', title: 'Tech Industry News: Innovation & AI', category: 'Technology' },
            { id: 'Gx5DmLYRWrI', title: 'Corporate News: Mergers & Acquisitions', category: 'Business' },
            { id: 'iE9HMudybyc', title: 'Breaking Business News Today', category: 'Breaking News' }
        ]
    },

    instagram: {
        handle: 'bizz_short',
        profileUrl: 'https://www.instagram.com/bizz_short',
        // Real reels from BizzShort Instagram
        reels: [
            { id: 'DSRtUxpisHf', title: 'Client Success Story - Business Growth', category: 'Client Interview' },
            { id: 'DSRmTi7FA-g', title: 'Client Testimonial - Partnership Success', category: 'Client Interview' },
            { id: 'DSRfWfMjQy_', title: 'Industry Expert - Market Insights', category: 'Client Interview' },
            { id: 'DSRYU-bD_wU', title: 'CEO Spotlight - Leadership Vision', category: 'Client Interview' },
            { id: 'DTNW7RUgLeD', title: 'Startup Founder - Innovation Journey', category: 'Client Interview' },
            { id: 'DTHxue9lEFt', title: 'Business Leader - Strategic Growth', category: 'Client Interview' }
        ]
    },

    // Cached API data
    cachedVideos: null,
    lastFetch: null,

    // Fetch videos from API with caching
    async fetchVideos(source = null, limit = 20) {
        // Use cache if fetched within last 5 minutes
        if (this.cachedVideos && this.lastFetch && (Date.now() - this.lastFetch < 300000)) {
            console.log('📦 Using cached video data');
            const videos = source ? this.cachedVideos.filter(v => v.source === source) : this.cachedVideos;
            return videos.slice(0, limit);
        }

        try {
            let url = this.apiEndpoint + '?limit=' + limit;
            if (source) url += '&source=' + source;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.length > 0) {
                    console.log(`✅ Fetched ${data.data.length} videos from API (synced at 8 AM daily)`);
                    this.cachedVideos = data.data;
                    this.lastFetch = Date.now();
                    return data.data;
                }
            }
        } catch (error) {
            console.log('📡 API unavailable, using fallback data');
        }

        return null;
    },

    // Initialize the loader
    async init() {
        console.log('🎬 BizzShort Video Loader initializing...');
        console.log('📅 Videos sync automatically at 8:00 AM IST daily');

        // Disable conflicting/old loaders to prevent double population
        window.LatestUpdatesLoader = null;
        window.BreakingNewsLoader = null;

        // Try to fetch from API first
        await this.fetchVideos();

        this.loadBreakingNews();
        this.loadLatestUpdates('all');
        this.loadClientFeatures();
        this.loadClientInterviews();
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

    // Load Breaking News section
    loadBreakingNews() {
        const mainVideo = this.youtube.videos.find(v => v.featured) || this.youtube.videos[0];
        const thumbnail = document.getElementById('mainVideoThumbnail');
        const videoInfo = document.querySelector('.breaking-video-player .video-info');

        if (thumbnail) {
            thumbnail.src = `https://img.youtube.com/vi/${mainVideo.id}/hqdefault.jpg`;
            thumbnail.alt = mainVideo.title;
            // Add fallback for thumbnail
            thumbnail.onerror = function () {
                this.onerror = null;
                this.src = `https://img.youtube.com/vi/${mainVideo.id}/mqdefault.jpg`;
            };
        }

        if (videoInfo) {
            videoInfo.innerHTML = `
                <span class="video-category">BREAKING NEWS</span>
                <h3>${mainVideo.title}</h3>
                <p>Latest business news and market updates from BizzShort</p>
                <div class="video-stats">
                    <span><i class="fab fa-youtube"></i> @bizz_short</span>
                    <span><i class="far fa-eye"></i> Live</span>
                    <span><i class="far fa-clock"></i> Today</span>
                </div>
            `;
        }

        // Update hidden iframe
        const iframe = document.querySelector('.breaking-video-player iframe');
        if (iframe) {
            iframe.src = `https://www.youtube-nocookie.com/embed/${mainVideo.id}?rel=0&modestbranding=1`;
        }

        // Update breaking news grid cards
        const breakingCards = document.querySelectorAll('.breaking-news-grid .breaking-news-card');
        const breakingVideos = this.youtube.videos.filter(v => !v.featured).slice(0, 3);

        breakingCards.forEach((card, index) => {
            if (breakingVideos[index]) {
                const video = breakingVideos[index];
                card.setAttribute('data-video-id', video.id);
                card.onclick = () => {
                    const params = new URLSearchParams({
                        id: video.id,
                        source: 'youtube',
                        title: video.title,
                        desc: 'Watch this latest breaking news update.'
                    });
                    window.location.href = `article.html?${params.toString()}`;
                };

                const img = card.querySelector('.video-thumbnail img');
                if (img) {
                    img.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                    img.alt = video.title;
                    // Add fallback for thumbnail
                    img.onerror = function () {
                        this.onerror = null;
                        this.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
                    };
                }

                const title = card.querySelector('h4');
                if (title) title.textContent = video.title;

                const badge = card.querySelector('.news-badge');
                if (badge) badge.textContent = video.category.toUpperCase();
            }
        });

        console.log('📰 Breaking News section loaded');
    },

    // Load Latest Updates section
    loadLatestUpdates(category = 'all') {
        const grid = document.getElementById('latestUpdatesGrid');
        if (!grid) return;

        // Use API data if available, otherwise fallback
        let videos = this.youtube.videos;
        if (this.cachedVideos) {
            const apiVideos = this.cachedVideos.filter(v => v.source === 'youtube');
            if (apiVideos.length > 0) {
                videos = apiVideos.map(v => ({
                    id: v.videoId,
                    title: v.title,
                    category: v.category || 'Latest',
                    views: v.views,
                    date: v.date || v.relativeTime
                }));
            }
        }

        // Apply category filter
        const filteredVideos = category === 'all'
            ? videos.slice(0, 8)
            : videos.filter(v => (v.category || '').toLowerCase() === category.toLowerCase()).slice(0, 8);

        if (filteredVideos.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#7f8c8d;">No videos found in this category.</div>';
            return;
        }

        grid.innerHTML = filteredVideos.map(video => `
            <article class="news-video-card-large video-card" data-category="${(video.category || 'Latest').toLowerCase()}" onclick="window.location.href='article.html?id=${video.id}&source=youtube&title=${encodeURIComponent(video.title.replace(/'/g, ''))}'" style="cursor:pointer;">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" 
                         alt="${video.title}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${video.id}/mqdefault.jpg';">
                    <div class="play-overlay">
                        <i class="fab fa-youtube"></i>
                    </div>
                </div>
                <div class="card-content">
                    <span class="card-category">${video.category || 'Latest'}</span>
                    <h3>${video.title}</h3>
                    <div class="card-meta">
                        <span><i class="fab fa-youtube"></i> @bizz_short</span>
                        <span><i class="far fa-eye"></i> ${video.views || 'New'}</span>
                        <span><i class="far fa-clock"></i> ${video.date || 'Latest'}</span>
                    </div>
                </div>
            </article>
        `).join('');

        console.log(`📊 Latest Updates section loaded for category "${category}"`);
    },

    // Load Client Features section (YouTube videos 1,2,3,4,5,7,8)
    loadClientFeatures() {
        const grid = document.getElementById('clientFeatureGrid');
        if (!grid) return;

        // Use API data if available, otherwise fallback
        let videos = this.youtube.videos;
        if (this.cachedVideos) {
            const apiVideos = this.cachedVideos.filter(v => v.source === 'youtube');
            if (apiVideos.length > 0) {
                videos = apiVideos.map(v => ({
                    id: v.videoId,
                    title: v.title,
                    category: v.category,
                    views: v.views,
                    date: v.date || v.relativeTime
                }));
            }
        }

        // Indices 1,2,3,4,5,7,8 (0-indexed: 0,1,2,3,4,6,7) - Request was 1,2,3,4,5,7,8 (skipping 6)
        // User said: "remove second video from the client feature section and add video number 1,2,3,4,5,7,8 of latest update"
        // Latest updates uses 1-8. Skipping 6 means using 1,2,3,4,5,7,8.
        const indices = [0, 1, 2, 3, 4, 6, 7];
        const selectedVideos = indices.map(i => videos[i]).filter(v => v);

        grid.innerHTML = selectedVideos.map(video => `
            <article class="news-video-card-large video-card" data-category="${(video.category || 'Client Feature').toLowerCase()}" onclick="window.location.href='article.html?id=${video.id}&source=youtube&title=${encodeURIComponent(video.title.replace(/'/g, ''))}'" style="cursor:pointer;">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" 
                         alt="${video.title}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${video.id}/mqdefault.jpg';">
                    <div class="play-overlay">
                        <i class="fab fa-youtube"></i>
                    </div>
                </div>
                <div class="card-content">
                    <span class="card-category">CLIENT FEATURE</span>
                    <h3>${video.title}</h3>
                    <div class="card-meta">
                        <span><i class="fab fa-youtube"></i> @bizz_short</span>
                        <span><i class="far fa-eye"></i> ${video.views || 'New'}</span>
                        <span><i class="far fa-clock"></i> ${video.date || 'Latest'}</span>
                    </div>
                </div>
            </article>
        `).join('');

        console.log('🌟 Client Feature section loaded with', selectedVideos.length, 'videos');
    },

    // Load Interview & Podcasts section (Instagram Reels 3,4,5,6 + 2 new)
    loadClientInterviews() {
        const grid = document.getElementById('podcastGrid');
        if (!grid) return;

        // Use API data if available, otherwise fallback
        let reels = this.instagram.reels;
        if (this.cachedVideos) {
            const apiReels = this.cachedVideos.filter(v => v.source === 'instagram');
            if (apiReels.length > 0) {
                reels = apiReels.map(v => ({
                    id: v.videoId,
                    title: v.title,
                    category: v.category
                }));
            }
        }

        // Indices 3,4,5,6 (0-indexed: 2,3,4,5) + 2 more (if available or placeholders)
        const selectedReels = reels.slice(2, 6);
        // Add 2 more if available, otherwise reuse or placeholders
        const extraReels = reels.slice(6, 8);
        const finalReels = [...selectedReels, ...extraReels];

        // Ensure we have at least 6 items for the grid
        while (finalReels.length < 6) {
            finalReels.push({ id: '', title: 'Coming Soon', placeholder: true });
        }

        grid.innerHTML = finalReels.map(reel => {
            if (reel.placeholder) {
                return `
                    <div class="interview-video-card placeholder-card">
                        <div class="video-embed-wrapper">
                            <div class="instagram-thumbnail">
                                <div class="instagram-placeholder">
                                    <i class="fas fa-microphone-alt"></i>
                                    <span>Podcast Coming Soon</span>
                                </div>
                            </div>
                        </div>
                        <div class="interview-details">
                            <span class="interview-tag upcoming-tag"><i class="fas fa-podcast"></i> UPCOMING</span>
                            <h3>BizzShort Podcast Series</h3>
                            <div class="video-meta" style="visibility: hidden;">
                                <span><i class="fab fa-instagram"></i> @bizz_short</span>
                                <span><i class="far fa-clock"></i> Soon</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Try to use real Instagram image via server proxy, fallback to stylish gradient
            const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            ];
            const gradient = gradients[finalReels.indexOf(reel) % gradients.length];

            // Use server-side proxy for thumbnail
            const proxyThumbUrl = APIConfig.endpoint(`/api/instagram-thumbnail/${reel.id}`);

            return `
                <div class="interview-video-card" onclick="window.location.href='article.html?id=${reel.id}&source=instagram&title=${encodeURIComponent(reel.title.replace(/'/g, ''))}'" style="cursor:pointer;" data-reel-id="${reel.id}">
                    <div class="video-embed-wrapper">
                        <div class="instagram-thumbnail" style="background:${gradient}; position: relative; overflow: hidden;" id="thumb-${reel.id}">
                            <img class="insta-thumb-img" data-proxy-url="${proxyThumbUrl}" 
                                 alt="${reel.title}" 
                                 style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; z-index:1; display:none;"
                                 onerror="this.style.display='none'">
                            <div class="instagram-play-btn" style="z-index:2;">
                                <i class="fab fa-instagram"></i>
                            </div>
                            <div class="instagram-reel-icon" style="z-index:2;">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                    </div>
                    <div class="interview-details">
                        <span class="interview-tag"><i class="fas fa-user-tie"></i> INTERVIEW</span>
                        <h3>${reel.title}</h3>
                        <div class="video-meta">
                            <span><i class="fab fa-instagram"></i> @bizz_short</span>
                            <span><i class="far fa-clock"></i> Latest</span>
                        </div>
                    </div>
                </div>
            `;

        }).join('');

        console.log('🎤 Interview & Podcasts section loaded with', finalReels.length, 'reels');
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
