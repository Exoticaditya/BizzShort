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
        // Real videos from BizzShort YouTube channel
        videos: [
            { id: 'iE9HMudybyc', title: 'Breaking Business News Today', category: 'Breaking News', featured: true },
            { id: 'SEDvD1IICfE', title: 'Manufacturing Sector: Make in India Success Stories', category: 'Industry' },
            { id: 'd0sU0TBhBkE', title: 'E-commerce Growth: Online Retail & Consumer Trends', category: 'Technology' },
            { id: 'EhU862ONFys', title: 'Energy Sector Update: Oil Prices & Renewable Energy', category: 'Industry' },
            { id: 'fH8Ir7doWGk', title: 'Business News Today | Latest Market Updates', category: 'Markets' },
            { id: 'dHFaUxh_sBE', title: 'Stock Market Analysis: Nifty & Sensex Today', category: 'Markets' },
            { id: 'TXoQOkT8FiQ', title: 'Indian Economy Update: GDP Growth & Outlook', category: 'Economy' },
            { id: 'ZZND7BcDA_c', title: 'Startup Funding News: Investment Rounds', category: 'Startups' },
            { id: 'DBjSV7cGluE', title: 'Banking Sector Update: RBI Policies', category: 'Banking' },
            { id: 'B8ulzu1X8Y8', title: 'Tech Industry News: Innovation & AI', category: 'Technology' },
            { id: 'Gx5DmLYRWrI', title: 'Corporate News: Mergers & Acquisitions', category: 'Business' },
            { id: '47bNBV5Ca7Y', title: 'Real Estate Market: Property Trends', category: 'Markets' }
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
            thumbnail.src = `https://img.youtube.com/vi/${mainVideo.id}/maxresdefault.jpg`;
            thumbnail.alt = mainVideo.title;
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
                    img.src = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
                    img.alt = video.title;
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
                    <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" alt="${video.title}" loading="lazy">
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

// Instagram Reel Player - Opens in modal or redirects
window.playInstagramReel = function(reelId, title) {
    if (!reelId) return;
    console.log('📸 Playing Instagram reel:', reelId);

    // Remove existing modal
    const existing = document.getElementById('videoModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'videoModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.95);padding:20px;';
    modal.innerHTML = `
        <div style="position:relative;width:100%;max-width:420px;max-height:90vh;">
            <div style="position:absolute;top:-50px;right:0;display:flex;gap:10px;">
                <a href="https://www.instagram.com/reel/${reelId}/" target="_blank" 
                   style="background:linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
                          color:white;border:none;padding:12px 24px;border-radius:30px;cursor:pointer;
                          font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;text-decoration:none;">
                    <i class="fab fa-instagram"></i> Open in Instagram
                </a>
                <button onclick="closeVideoModal()" 
                        style="background:#e74c3c;color:white;border:none;width:45px;height:45px;
                               border-radius:50%;cursor:pointer;font-size:24px;">×</button>
            </div>
            <div style="background:#000;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
                <iframe src="https://www.instagram.com/reel/${reelId}/embed/" 
                    frameborder="0" 
                    scrolling="no" 
                    allowtransparency="true"
                    allowfullscreen="true"
                    style="width:100%;height:700px;max-height:80vh;border:none;">
                </iframe>
            </div>
            <div style="padding:16px;background:linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c);
                        border-radius:0 0 16px 16px;color:white;">
                <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600;">${title || 'Client Interview'}</h3>
                <p style="margin:0;opacity:0.9;font-size:13px;">
                    <i class="fab fa-instagram"></i> @bizz_short • Client Interview Series
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeVideoModal();
    });
};

// Close video modal function
window.closeVideoModal = function() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
};

// YouTube video player - Opens in modal
window.playVideo = function(videoId, source, title) {
    if (!videoId) return;
    console.log('▶️ Playing video:', videoId, source);

    // Remove existing modal
    const existing = document.getElementById('videoModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'videoModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.95);padding:20px;';
    
    if (source === 'instagram') {
        // Instagram reel
        modal.innerHTML = `
            <div style="position:relative;width:100%;max-width:420px;max-height:90vh;">
                <button onclick="closeVideoModal()" 
                        style="position:absolute;top:-50px;right:0;background:#e74c3c;color:white;border:none;width:45px;height:45px;
                               border-radius:50%;cursor:pointer;font-size:24px;z-index:100001;">×</button>
                <div style="background:#000;border-radius:16px;overflow:hidden;">
                    <iframe src="https://www.instagram.com/reel/${videoId}/embed/" 
                        frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true"
                        style="width:100%;height:700px;max-height:80vh;border:none;">
                    </iframe>
                </div>
                <div style="padding:12px;background:#262626;border-radius:0 0 16px 16px;color:white;text-align:center;">
                    <a href="https://www.instagram.com/reel/${videoId}/" target="_blank" 
                       style="color:#e1306c;text-decoration:none;font-weight:600;">
                        <i class="fab fa-instagram"></i> Open in Instagram
                    </a>
                </div>
            </div>
        `;
    } else {
        // YouTube video
        modal.innerHTML = `
            <div style="position:relative;width:100%;max-width:900px;">
                <button onclick="closeVideoModal()" 
                        style="position:absolute;top:-50px;right:0;background:#e74c3c;color:white;border:none;width:45px;height:45px;
                               border-radius:50%;cursor:pointer;font-size:24px;z-index:100001;">×</button>
                <div style="position:relative;padding-bottom:56.25%;height:0;background:#000;border-radius:12px;overflow:hidden;">
                    <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;">
                    </iframe>
                </div>
                <div style="padding:16px;background:#1a1a2e;border-radius:0 0 12px 12px;color:white;">
                    <h3 style="margin:0 0 8px 0;font-size:18px;">${title || 'BizzShort Video'}</h3>
                    <p style="margin:0;opacity:0.7;font-size:14px;">
                        <i class="fab fa-youtube" style="color:#ff0000;"></i> @bizz_short
                    </p>
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.addEventListener('click', function(e) {
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
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure other scripts are loaded
    setTimeout(() => {
        BizzShortVideoLoader.init();
    }, 100);
});

// Export for external use
window.BizzShortVideoLoader = BizzShortVideoLoader;
