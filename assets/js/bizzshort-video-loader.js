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

        // Try to fetch from API first
        await this.fetchVideos();

        this.loadBreakingNews();
        this.loadLatestUpdates();
        this.loadClientInterviews();
        console.log('✅ BizzShort Video Loader ready');
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
                card.setAttribute('onclick', `playVideo('${video.id}', 'youtube', '${video.title.replace(/'/g, "\\'")}')`);

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
    loadLatestUpdates() {
        const grid = document.getElementById('latestUpdatesGrid');
        if (!grid) return;

        // Use API data if available, otherwise fallback
        let videos = this.youtube.videos.slice(0, 8);
        if (this.cachedVideos) {
            const apiVideos = this.cachedVideos.filter(v => v.source === 'youtube').slice(0, 8);
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

        grid.innerHTML = videos.map(video => `
            <article class="news-card-large video-card" data-category="${(video.category || 'Latest').toLowerCase()}" onclick="playVideo('${video.id}', 'youtube', '${video.title.replace(/'/g, "\\'")}')" style="cursor:pointer;">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" 
                         alt="${video.title}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${video.id}/mqdefault.jpg';">
                    <div class="play-overlay">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <span class="video-duration">${video.duration || 'Short'}</span>
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

        console.log('📊 Latest Updates section loaded with', videos.length, 'videos');
    },

    // Load Client Interviews section (Instagram Reels)
    loadClientInterviews() {
        const grid = document.querySelector('#client-interviews .interview-videos-grid');
        if (!grid) return;

        // Use API data if available, otherwise fallback
        let reels = this.instagram.reels;
        if (this.cachedVideos) {
            const apiReels = this.cachedVideos.filter(v => v.source === 'instagram').slice(0, 6);
            if (apiReels.length > 0) {
                reels = apiReels.map(v => ({
                    id: v.videoId,
                    title: v.title,
                    category: v.category
                }));
            }
        }

        grid.innerHTML = reels.map(reel => `
            <div class="interview-video-card" onclick="playInstagramReel('${reel.id}', '${reel.title.replace(/'/g, "\\'")}')" style="cursor:pointer;">
                <div class="video-embed-wrapper">
                    <div class="instagram-thumbnail">
                        <div class="instagram-placeholder">
                            <i class="fab fa-instagram"></i>
                            <span>Watch Reel</span>
                        </div>
                        <div class="play-overlay">
                            <i class="fab fa-instagram"></i>
                        </div>
                    </div>
                </div>
                <div class="interview-details">
                    <span class="interview-tag"><i class="fas fa-user-tie"></i> CLIENT INTERVIEW</span>
                    <h3>${reel.title}</h3>
                    <div class="video-meta">
                        <span><i class="fab fa-instagram"></i> @bizz_short</span>
                        <span><i class="far fa-clock"></i> Latest</span>
                    </div>
                </div>
            </div>
        `).join('');

        console.log('🎤 Client Interviews section loaded with', this.instagram.reels.length, 'reels');
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

// Instagram Reel Player - Premium Modal with embedded player
window.playInstagramReel = function (reelId, title) {
    if (!reelId) return;
    console.log('📸 Playing Instagram reel:', reelId);

    // Remove existing modal
    const existing = document.getElementById('instagramModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'instagramModal';
    modal.className = 'instagram-video-modal';
    modal.innerHTML = `
        <div class="instagram-modal-backdrop" onclick="closeInstagramModal()"></div>
        <div class="instagram-modal-container">
            <div class="instagram-modal-header">
                <div class="instagram-brand">
                    <i class="fab fa-instagram"></i>
                    <span>@bizz_short</span>
                </div>
                <button class="instagram-close-btn" onclick="closeInstagramModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="instagram-video-wrapper">
                <iframe 
                    src="https://www.instagram.com/reel/${reelId}/embed/captioned/" 
                    frameborder="0" 
                    scrolling="no" 
                    allowtransparency="true"
                    allowfullscreen="true"
                    class="instagram-embed-iframe">
                </iframe>
                <div class="instagram-loading">
                    <div class="instagram-spinner"></div>
                    <p>Loading Reel...</p>
                </div>
            </div>
            <div class="instagram-modal-footer">
                <div class="instagram-video-info">
                    <h3>${title || 'Client Interview'}</h3>
                    <p><i class="fas fa-user-tie"></i> BizzShort Client Interview Series</p>
                </div>
                <div class="instagram-actions">
                    <a href="https://www.instagram.com/reel/${reelId}/" target="_blank" class="instagram-open-btn">
                        <i class="fab fa-instagram"></i> Open in Instagram
                    </a>
                    <a href="https://www.instagram.com/bizz_short" target="_blank" class="instagram-follow-btn">
                        <i class="fas fa-user-plus"></i> Follow
                    </a>
                </div>
            </div>
        </div>
    `;

    // Add modal styles if not already added
    if (!document.getElementById('instagramModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'instagramModalStyles';
        styles.textContent = `
            .instagram-video-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: igModalFadeIn 0.3s ease;
            }
            @keyframes igModalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .instagram-modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
            }
            .instagram-modal-container {
                position: relative;
                width: 100%;
                max-width: 450px;
                max-height: 90vh;
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 25px 80px rgba(225, 48, 108, 0.3), 0 10px 40px rgba(0, 0, 0, 0.5);
                animation: igModalSlideUp 0.4s ease;
                margin: 20px;
            }
            @keyframes igModalSlideUp {
                from { transform: translateY(50px) scale(0.95); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
            }
            .instagram-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 15px 20px;
                background: linear-gradient(135deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
            }
            .instagram-brand {
                display: flex;
                align-items: center;
                gap: 10px;
                color: white;
                font-weight: 700;
                font-size: 16px;
            }
            .instagram-brand i {
                font-size: 24px;
            }
            .instagram-close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.3s ease;
            }
            .instagram-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }
            .instagram-video-wrapper {
                position: relative;
                width: 100%;
                height: 580px;
                max-height: 60vh;
                background: #000;
            }
            .instagram-embed-iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
            .instagram-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: white;
                z-index: -1;
            }
            .instagram-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: #e1306c;
                border-radius: 50%;
                animation: igSpin 1s linear infinite;
                margin: 0 auto 15px;
            }
            @keyframes igSpin {
                to { transform: rotate(360deg); }
            }
            .instagram-modal-footer {
                padding: 20px;
                background: #1a1a2e;
            }
            .instagram-video-info h3 {
                color: white;
                font-size: 16px;
                margin: 0 0 5px 0;
                font-weight: 600;
            }
            .instagram-video-info p {
                color: rgba(255, 255, 255, 0.6);
                font-size: 13px;
                margin: 0 0 15px 0;
            }
            .instagram-actions {
                display: flex;
                gap: 10px;
            }
            .instagram-open-btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px 20px;
                background: linear-gradient(135deg, #405de6, #5851db, #833ab4, #c13584, #e1306c);
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            .instagram-open-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(225, 48, 108, 0.4);
            }
            .instagram-follow-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px 20px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            .instagram-follow-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            @media (max-width: 480px) {
                .instagram-modal-container {
                    max-width: 100%;
                    margin: 10px;
                    border-radius: 15px;
                }
                .instagram-video-wrapper {
                    height: 500px;
                    max-height: 55vh;
                }
                .instagram-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // ESC key to close
    const escHandler = function (e) {
        if (e.key === 'Escape') {
            closeInstagramModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
};

// Close Instagram modal
window.closeInstagramModal = function () {
    const modal = document.getElementById('instagramModal');
    if (modal) {
        modal.style.animation = 'igModalFadeIn 0.2s ease reverse';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 200);
    }
};

// Keep the old function as alias
window.openInstagramReel = window.playInstagramReel;

// Close video modal function
window.closeVideoModal = function () {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
};

// YouTube video player - Opens in modal
window.playVideo = function (videoId, source, title) {
    if (!videoId) return;
    console.log('▶️ Playing video:', videoId, source);

    // If Instagram, use the premium Instagram modal
    if (source === 'instagram') {
        playInstagramReel(videoId, title);
        return;
    }

    // Remove existing modal
    const existing = document.getElementById('videoModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'videoModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.95);padding:20px;';

    // YouTube video/shorts - use regular embed with origin parameter
    modal.innerHTML = `
        <div style="position:relative;width:100%;max-width:900px;">
            <div style="position:absolute;top:-55px;right:0;display:flex;gap:10px;align-items:center;">
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" 
                   style="background:#ff0000;color:white;padding:10px 20px;border-radius:25px;text-decoration:none;font-weight:600;font-size:14px;display:flex;align-items:center;gap:8px;">
                    <i class="fab fa-youtube"></i> Watch on YouTube
                </a>
                <button onclick="closeVideoModal()" 
                        style="background:#e74c3c;color:white;border:none;width:45px;height:45px;
                               border-radius:50%;cursor:pointer;font-size:24px;z-index:100001;">×</button>
            </div>
            <div style="position:relative;padding-bottom:56.25%;height:0;background:#000;border-radius:12px;overflow:hidden;">
                <iframe 
                    id="youtubePlayer"
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                    referrerpolicy="strict-origin-when-cross-origin"
                    style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;">
                </iframe>
            </div>
            <div style="padding:16px;background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);border-radius:0 0 12px 12px;color:white;">
                <h3 style="margin:0 0 8px 0;font-size:18px;">${title || 'BizzShort Video'}</h3>
                <p style="margin:0;opacity:0.7;font-size:14px;display:flex;align-items:center;gap:8px;">
                    <i class="fab fa-youtube" style="color:#ff0000;"></i> @bizz_short • Business News in 60 Seconds
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeVideoModal();
    });

    // ESC key to close
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
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
