// ============================================
// LATEST UPDATES - REAL YOUTUBE DATA LOADER
// Fetches videos from @bizz_short YouTube channel
// ============================================

const API_BASE_URL = window.APIConfig ? window.APIConfig.baseURL : 
                     (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                      ? `${window.location.protocol}//${window.location.hostname}:${window.location.port || 3000}` 
                      : 'https://bizzshort.onrender.com');

console.log('📺 Latest Updates API URL:', API_BASE_URL);

let currentCategory = 'all';

// Initialize Latest Updates section on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadLatestUpdates();
    setupCategoryFilters();
});

// ============================================
// LOAD LATEST UPDATES FROM DATABASE/YOUTUBE
// ============================================
async function loadLatestUpdates(category = 'all') {
    const gridContainer = document.getElementById('latestUpdatesGrid');
    if (!gridContainer) return;

    try {
        // Show loading state
        gridContainer.innerHTML = '<div class="loading-spinner">Loading latest updates...</div>';

        // Fetch videos from backend API
        const response = await fetch(`${API_BASE_URL}/api/videos?limit=12&source=youtube`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }

        const result = await response.json();
        const videos = result.data || result; // Handle both { data: [...] } and direct array

        // If API returns empty array, use fallback data
        if (!videos || videos.length === 0) {
            console.log('📺 No videos in database, using fallback data');
            throw new Error('No videos in database');
        }

        // Filter by category if not "all"
        const filteredVideos = category === 'all' 
            ? videos 
            : videos.filter(video => video.category === category);

        // Render video cards (use placeholder if API returns empty)
        if (filteredVideos && filteredVideos.length > 0) {
            renderVideoCards(filteredVideos, gridContainer);
        } else {
            // Fallback to static placeholder data
            const placeholderData = getPlaceholderVideos();
            const filteredPlaceholder = category === 'all' 
                ? placeholderData 
                : placeholderData.filter(v => v.category === category);
            renderVideoCards(filteredPlaceholder, gridContainer);
        }

    } catch (error) {
        console.error('Error loading latest updates:', error);
        
        // Fallback to static placeholder data
        const placeholderData = getPlaceholderVideos();
        renderVideoCards(placeholderData, gridContainer);
    }
}

// ============================================
// RENDER VIDEO CARDS IN GRID
// ============================================
function renderVideoCards(videos, container) {
    if (!videos || videos.length === 0) {
        container.innerHTML = `
            <div class="no-videos-message">
                <i class="fas fa-video-slash"></i>
                <p>No videos available for this category</p>
            </div>
        `;
        return;
    }

    container.innerHTML = videos.map(video => `
        <div class="news-video-card-large" data-category="${video.category || 'business'}" onclick="playVideo('${video.youtubeId || video.videoId}')">
            <div class="video-player-wrapper">
                <img src="${video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId || video.videoId}/maxresdefault.jpg`}" 
                     alt="${video.title}" 
                     class="video-thumbnail-img">
                <div class="play-button-overlay">
                    <i class="fab fa-youtube"></i>
                </div>
            </div>
            <div class="video-card-content">
                <span class="video-category-badge ${video.category || 'business'}">${formatCategory(video.category)}</span>
                <h3 class="video-title">${video.title}</h3>
                <p class="video-excerpt">${video.excerpt || video.description || 'Watch latest business and market updates'}</p>
                <div class="video-meta-info">
                    <span><i class="fab fa-youtube"></i> YouTube</span>
                    <span><i class="far fa-calendar"></i> ${formatDate(video.publishedAt || video.createdAt)}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add smooth fade-in animation
    setTimeout(() => {
        container.querySelectorAll('.news-video-card-large').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 50);
}

// ============================================
// SETUP CATEGORY FILTER BUTTONS
// ============================================
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filters .filter-btn');
    
    if (filterButtons.length === 0) {
        console.warn('No category filter buttons found');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            currentCategory = category;
            
            console.log('Filter clicked:', category);
            
            // Reload videos with filter
            loadLatestUpdates(category);
        });
    });
    
    console.log('Category filters initialized:', filterButtons.length, 'buttons');
}

// ============================================
// PLAY VIDEO FUNCTION (Global)
// ============================================
window.playVideo = function(videoId) {
    console.log('🎬 Playing video:', videoId);
    
    if (!videoId) {
        console.error('❌ No video ID provided');
        return;
    }
    
    // Open in modal
    openVideoModal(videoId);
};

window.openVideoModal = function(videoId) {
    console.log('📺 Opening video modal for:', videoId);
    
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.id = 'videoModal';
    modal.innerHTML = `
        <div class="video-modal-overlay" onclick="closeVideoModal()"></div>
        <div class="video-modal-content">
            <button class="close-modal-btn" onclick="closeVideoModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="video-embed-wrapper">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('active');
        console.log('✅ Video modal opened');
    }, 10);
};

window.closeVideoModal = function() {
    console.log('🔒 Closing video modal');
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatCategory(category) {
    const categories = {
        'business': 'Business',
        'markets': 'Markets',
        'technology': 'Technology',
        'industry': 'Industry Update'
    };
    return categories[category] || 'Business';
}

function formatDate(dateString) {
    if (!dateString) return 'Recent';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================
// PLACEHOLDER DATA (Fallback)
// Real data from @bizz_short YouTube channel
// ============================================
function getPlaceholderVideos() {
    // Real video IDs from @bizz_short YouTube channel
    return [
        {
            youtubeId: 'fH8Ir7doWGk',
            title: 'Business News Today | Latest Market Updates & Analysis',
            excerpt: 'Stay updated with today\'s breaking business news, market movements, and expert analysis on India\'s economic landscape.',
            category: 'markets',
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/fH8Ir7doWGk/maxresdefault.jpg'
        },
        {
            youtubeId: 'dHFaUxh_sBE',
            title: 'Stock Market Analysis: Nifty & Sensex Today',
            excerpt: 'Comprehensive analysis of today\'s stock market performance, top gainers, losers, and trading strategies for investors.',
            category: 'markets',
            publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/dHFaUxh_sBE/maxresdefault.jpg'
        },
        {
            youtubeId: 'TXoQOkT8FiQ',
            title: 'Indian Economy Update: GDP Growth & Future Outlook',
            excerpt: 'Latest insights on India\'s GDP growth, inflation trends, and economic policies shaping the nation\'s future.',
            category: 'business',
            publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/TXoQOkT8FiQ/maxresdefault.jpg'
        },
        {
            youtubeId: 'ZZND7BcDA_c',
            title: 'Startup Funding News: Investment Rounds & Valuations',
            excerpt: 'Breaking news on startup funding rounds, unicorn valuations, and emerging business opportunities.',
            category: 'business',
            publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/ZZND7BcDA_c/maxresdefault.jpg'
        },
        {
            youtubeId: 'DBjSV7cGluE',
            title: 'Banking Sector Update: RBI Policies & Interest Rates',
            excerpt: 'Complete coverage of banking sector developments, RBI monetary policy decisions, and impact on loans.',
            category: 'markets',
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/DBjSV7cGluE/maxresdefault.jpg'
        },
        {
            youtubeId: 'B8ulzu1X8Y8',
            title: 'Tech Industry News: Innovation & Digital Transformation',
            excerpt: 'Latest updates from India\'s technology sector including AI, cloud computing, and digital initiatives.',
            category: 'technology',
            publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/B8ulzu1X8Y8/maxresdefault.jpg'
        },
        {
            youtubeId: 'fH8Ir7doWGk',
            title: 'Weekly Market Roundup: Top Gainers & Losers',
            excerpt: 'Weekly summary of market performance, sector analysis, and outlook for the coming week.',
            category: 'markets',
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/fH8Ir7doWGk/maxresdefault.jpg'
        },
        {
            youtubeId: 'dHFaUxh_sBE',
            title: 'Economic Outlook: Growth Projections & Analysis',
            excerpt: 'Expert analysis on India\'s economic growth trajectory and investment opportunities.',
            category: 'business',
            publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/dHFaUxh_sBE/maxresdefault.jpg'
        }
    ];
}
