/**
 * BizzShort Video Loader
 * Populates all video sections from BizzShort YouTube channel and Instagram
 * Connects YouTube, Instagram, and Website seamlessly
 */

const BizzShortVideoLoader = {
    // BizzShort Channel Info
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

    // Initialize the loader
    init() {
        console.log('🎬 BizzShort Video Loader initializing...');
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

        const videos = this.youtube.videos.slice(0, 8);
        
        grid.innerHTML = videos.map(video => `
            <article class="news-card-large video-card" data-category="${video.category.toLowerCase()}" onclick="playVideo('${video.id}', 'youtube', '${video.title.replace(/'/g, "\\'")}')" style="cursor:pointer;">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" alt="${video.title}" loading="lazy">
                    <div class="play-overlay">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <span class="video-duration">Short</span>
                </div>
                <div class="card-content">
                    <span class="card-category">${video.category}</span>
                    <h3>${video.title}</h3>
                    <div class="card-meta">
                        <span><i class="fab fa-youtube"></i> @bizz_short</span>
                        <span><i class="far fa-clock"></i> Latest</span>
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

        grid.innerHTML = this.instagram.reels.map(reel => `
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

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure other scripts are loaded
    setTimeout(() => {
        BizzShortVideoLoader.init();
    }, 100);
});

// Export for external use
window.BizzShortVideoLoader = BizzShortVideoLoader;
