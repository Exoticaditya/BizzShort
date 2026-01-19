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
document.addEventListener('DOMContentLoaded', async function () {
    console.log('📺 Latest Updates loader initialized');
    const gridContainer = document.getElementById('latestUpdatesGrid');
    if (gridContainer) {
        console.log('📺 Grid container found');
        // Ensure grid is visible
        gridContainer.style.display = 'grid';
    } else {
        console.error('❌ latestUpdatesGrid container not found!');
    }
    await loadLatestUpdates();
    setupCategoryFilters();
});

// ============================================
// LOAD LATEST UPDATES FROM DATABASE/YOUTUBE
// ============================================
async function loadLatestUpdates(category = 'all') {
    const gridContainer = document.getElementById('latestUpdatesGrid');
    if (!gridContainer) {
        console.error('❌ latestUpdatesGrid not found in loadLatestUpdates');
        return;
    }

    try {
        // Show loading state
        gridContainer.innerHTML = '<div class="loading-spinner" style="grid-column:1/-1;text-align:center;padding:40px;">Loading latest updates...</div>';

        console.log('📺 Fetching videos from:', `${API_BASE_URL}/api/videos?limit=12&source=youtube`);

        // Fetch videos from backend API
        const response = await fetch(`${API_BASE_URL}/api/videos?limit=12&source=youtube`);

        console.log('📺 API Response status:', response.status);

        if (!response.ok) {
            throw new Error('Failed to fetch videos: ' + response.status);
        }

        const result = await response.json();
        console.log('📺 API Result:', result);
        
        const videos = result.data || result; // Handle both { data: [...] } and direct array
        console.log('📺 Videos array:', videos?.length, 'videos');

        // If API returns empty array, use fallback data
        if (!videos || videos.length === 0) {
            console.log('📺 No videos in database, using fallback data');
            throw new Error('No videos in database');
        }

        // Filter by category if not "all"
        const filteredVideos = category === 'all'
            ? videos
            : videos.filter(video => (video.category || '').toLowerCase() === category.toLowerCase());

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

    container.innerHTML = videos.map(video => {
        const videoId = video.youtubeId || video.videoId;
        const videoTitle = (video.title || '').replace(/"/g, '&quot;');
        const videoCategory = (video.category || 'business').toLowerCase();
        
        // Use sddefault for better reliability (always exists)
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
        
        return `
        <div class="news-video-card-large" 
             data-category="${videoCategory}" 
             data-video-id="${videoId}"
             data-video-title="${videoTitle}">
            <div class="video-player-wrapper">
                <img src="${thumbnailUrl}" 
                     alt="${video.title}" 
                     class="video-thumbnail-img"
                     onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'"
                     loading="lazy">
                <div class="play-button-overlay">
                    <i class="fab fa-youtube"></i>
                </div>
            </div>
            <div class="video-card-content">
                <span class="video-category-badge ${videoCategory}">${formatCategory(videoCategory)}</span>
                <h3 class="video-title">${video.title}</h3>
                <p class="video-excerpt">${video.excerpt || video.description || 'Watch latest business and market updates'}</p>
                <div class="video-meta-info">
                    <span><i class="fab fa-youtube"></i> YouTube</span>
                    <span><i class="far fa-calendar"></i> ${formatDate(video.publishedAt || video.createdAt)}</span>
                </div>
            </div>
        </div>
    `}).join('');

    // Add event listeners after DOM insertion
    setTimeout(() => {
        container.querySelectorAll('.news-video-card-large').forEach((card, index) => {
            const videoId = card.dataset.videoId;
            const videoTitle = card.dataset.videoTitle;

            // Add click event listener
            card.addEventListener('click', function () {
                console.log('🎬 Card clicked:', videoId);
                if (typeof playVideo === 'function') {
                    playVideo(videoId, 'youtube', videoTitle);
                } else {
                    console.error('❌ playVideo function not found!');
                }
            });
            card.style.cursor = 'pointer';

            // Add smooth fade-in animation
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
        button.addEventListener('click', function (e) {
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

// Note: playVideo(), openVideoModal(), closeVideoModal() are now handled by video-manager.js

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        if (typeof closeVideoModal !== 'undefined') {
            closeVideoModal();
        }
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatCategory(category) {
    if (!category) return 'Business';
    
    const categoryLower = category.toLowerCase();
    const categories = {
        'business': 'BUSINESS',
        'markets': 'MARKETS',
        'technology': 'TECHNOLOGY',
        'industry': 'INDUSTRY UPDATE',
        'industry update': 'INDUSTRY UPDATE'
    };
    return categories[categoryLower] || 'BUSINESS';
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
// Real video IDs from @bizz_short YouTube channel
// ============================================
function getPlaceholderVideos() {
    // Real working video IDs from BizzShort YouTube channel
    return [
        {
            youtubeId: 'fH8Ir7doWGk',
            title: 'Weekly Market Roundup: Top Gainers & Losers',
            excerpt: 'Weekly summary of market performance, sector analysis, and outlook for the coming week.',
            category: 'markets',
            publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/fH8Ir7doWGk/sddefault.jpg'
        },
        {
            youtubeId: 'pK70FxjUJCY',
            title: 'Manufacturing Sector: Make in India Success Stories',
            excerpt: 'Celebrating Make in India achievements, manufacturing sector growth, and export success stories.',
            category: 'business',
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/pK70FxjUJCY/sddefault.jpg'
        },
        {
            youtubeId: 'tR1ZlYUvzUo',
            title: 'E-commerce Growth: Online Retail & Consumer Trends',
            excerpt: 'Insights into India\'s booming e-commerce sector, online retail growth, and consumer behavior.',
            category: 'technology',
            publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/tR1ZlYUvzUo/sddefault.jpg'
        },
        {
            youtubeId: 'zX280yTaG_E',
            title: 'Energy Sector Update: Oil Prices & Renewable Energy',
            excerpt: 'Latest developments in energy sector including oil prices and renewable energy projects.',
            category: 'business',
            publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/zX280yTaG_E/sddefault.jpg'
        },
        {
            youtubeId: '47bNBV5Ca7Y',
            title: 'Real Estate Market: Property Trends & Investment Tips',
            excerpt: 'Real estate market trends, property prices, and smart investment strategies.',
            category: 'markets',
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/47bNBV5Ca7Y/sddefault.jpg'
        },
        {
            youtubeId: 'dHFaUxh_sBE',
            title: 'Stock Market Analysis: Nifty & Sensex Today',
            excerpt: 'Comprehensive analysis of today\'s stock market performance and trading strategies.',
            category: 'markets',
            publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/dHFaUxh_sBE/sddefault.jpg'
        },
        {
            youtubeId: 'TXoQOkT8FiQ',
            title: 'Indian Economy Update: GDP Growth & Outlook',
            excerpt: 'Latest insights on India\'s GDP growth and economic policies.',
            category: 'business',
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/TXoQOkT8FiQ/sddefault.jpg'
        },
        {
            youtubeId: 'ZZND7BcDA_c',
            title: 'Startup Funding News: Investment Rounds',
            excerpt: 'Breaking news on startup funding and emerging business opportunities.',
            category: 'business',
            publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://img.youtube.com/vi/ZZND7BcDA_c/sddefault.jpg'
        }
    ];
}
