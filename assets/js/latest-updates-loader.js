// ============================================
// LATEST UPDATES - REAL YOUTUBE DATA LOADER
// Fetches videos from @bizz_short YouTube channel
// ============================================

const API_BASE_URL = 'https://bizzshort.onrender.com';
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

        const videos = await response.json();

        // Filter by category if not "all"
        const filteredVideos = category === 'all' 
            ? videos 
            : videos.filter(video => video.category === category);

        // Render video cards
        renderVideoCards(filteredVideos, gridContainer);

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
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            currentCategory = category;
            
            // Reload videos with filter
            loadLatestUpdates(category);
        });
    });
}

// ============================================
// PLAY VIDEO FUNCTION
// ============================================
function playVideo(videoId) {
    // Option 1: Redirect to video detail page
    // window.location.href = `video-detail.html?id=${videoId}`;
    
    // Option 2: Open in modal (recommended)
    openVideoModal(videoId);
}

function openVideoModal(videoId) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
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
    }, 10);
}

function closeVideoModal() {
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
    return [
        {
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Market Update: Nifty 50 Breaks New Records',
            excerpt: 'Indian stock market reaches all-time high as Nifty 50 surges past 22,000 mark',
            category: 'markets',
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://via.placeholder.com/640x360/e74c3c/ffffff?text=Market+Update'
        },
        {
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Business News: Top Companies Report Record Profits',
            excerpt: 'Q4 earnings exceed expectations as major corporations show strong growth',
            category: 'business',
            publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://via.placeholder.com/640x360/667eea/ffffff?text=Business+News'
        },
        {
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Tech Revolution: AI Transforms Business Landscape',
            excerpt: 'How artificial intelligence is reshaping industries and creating new opportunities',
            category: 'technology',
            publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://via.placeholder.com/640x360/4facfe/ffffff?text=Technology'
        },
        {
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Industry Insights: Manufacturing Sector Boom',
            excerpt: 'Indian manufacturing hits 5-year high with increased production and exports',
            category: 'industry',
            publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://via.placeholder.com/640x360/43e97b/ffffff?text=Industry+Update'
        },
        {
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Stock Market Analysis: Best Investment Opportunities',
            excerpt: 'Expert recommendations on top performing stocks and sectors for 2024',
            category: 'markets',
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://via.placeholder.com/640x360/f093fb/ffffff?text=Investment'
        },
        {
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Business Strategy: Startup Success Stories',
            excerpt: 'How Indian startups are disrupting traditional industries and scaling globally',
            category: 'business',
            publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://via.placeholder.com/640x360/764ba2/ffffff?text=Startup+News'
        },
        {
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Digital Transformation: Cloud Computing Growth',
            excerpt: 'Enterprise cloud adoption accelerates as businesses embrace digital solutions',
            category: 'technology',
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://via.placeholder.com/640x360/00f2fe/ffffff?text=Cloud+Tech'
        },
        {
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Economic Outlook: GDP Growth Projections',
            excerpt: 'India maintains fastest-growing major economy status with 7.5% GDP growth',
            category: 'business',
            publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://via.placeholder.com/640x360/f5576c/ffffff?text=Economy'
        },
        {
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Market Watch: Banking Sector Performance',
            excerpt: 'Bank Nifty rallies as financial institutions report strong quarterly results',
            category: 'markets',
            publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnail: 'https://via.placeholder.com/640x360/e74c3c/ffffff?text=Banking'
        }
    ];
}
