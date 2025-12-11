// ============================================
// VIDEO MANAGEMENT AND DISPLAY
// ============================================

/**
 * VIDEO DATABASE
 * 
 * To add YOUR real videos from @bizz_short:
 * 1. Use the utility script: node utils/fetch-youtube-videos.js
 * 2. Or manually replace videoId with your actual YouTube video IDs
 * 3. Update thumbnails, views, dates, and descriptions
 * 
 * Video ID can be found in YouTube URL: youtube.com/watch?v=VIDEO_ID_HERE
 */

const videoDatabase = [
    {
        id: '1',
        title: 'Business News Update',
        category: 'Markets',
        source: 'youtube',
        videoId: 'fH8Ir7doWGk',
        thumbnail: 'https://img.youtube.com/vi/fH8Ir7doWGk/maxresdefault.jpg',
        description: 'Latest market updates and business insights from Bizz Short.',
        views: '15.2K',
        date: 'Dec 10, 2025',
        duration: '10:45',
        featured: true,
        tags: ['Business', 'Markets', 'News']
    },
    {
        id: '2',
        title: 'Business Insights',
        category: 'Economy',
        source: 'youtube',
        videoId: 'dHFaUxh_sBE',
        thumbnail: 'https://img.youtube.com/vi/dHFaUxh_sBE/maxresdefault.jpg',
        description: 'Expert analysis on economic trends and business developments.',
        views: '12.8K',
        date: 'Dec 9, 2025',
        duration: '9:30',
        featured: true,
        tags: ['Business', 'Economy', 'Analysis']
    },
    {
        id: '3',
        title: 'Market Watch',
        category: 'Markets',
        source: 'youtube',
        videoId: 'TXoQOkT8FiQ',
        thumbnail: 'https://img.youtube.com/vi/TXoQOkT8FiQ/maxresdefault.jpg',
        description: 'Daily market watch and trading insights for investors.',
        views: '18.5K',
        date: 'Dec 8, 2025',
        duration: '8:15',
        featured: true,
        tags: ['Markets', 'Trading', 'Investment']
    },
    {
        id: '4',
        title: 'Business Update',
        category: 'Economy',
        source: 'youtube',
        videoId: 'ZZND7BcDA_c',
        thumbnail: 'https://img.youtube.com/vi/ZZND7BcDA_c/maxresdefault.jpg',
        description: 'Latest business updates and economic news coverage.',
        views: '11.2K',
        date: 'Dec 7, 2025',
        duration: '12:20',
        featured: false,
        tags: ['Business', 'News', 'Economy']
    },
    {
        id: '5',
        title: 'Financial News',
        category: 'Banking',
        source: 'youtube',
        videoId: 'DBjSV7cGluE',
        thumbnail: 'https://img.youtube.com/vi/DBjSV7cGluE/maxresdefault.jpg',
        description: 'Banking and financial sector news and analysis.',
        views: '14.7K',
        date: 'Dec 6, 2025',
        duration: '10:50',
        featured: false,
        tags: ['Banking', 'Finance', 'News']
    },
    {
        id: '6',
        title: 'Market Analysis',
        category: 'Markets',
        source: 'youtube',
        videoId: 'B8ulzu1X8Y8',
        thumbnail: 'https://img.youtube.com/vi/B8ulzu1X8Y8/maxresdefault.jpg',
        description: 'Technical and fundamental market analysis for traders.',
        views: '9.3K',
        date: 'Dec 5, 2025',
        duration: '8:45',
        featured: false,
        tags: ['Markets', 'Analysis', 'Trading']
    },
    {
        id: '7',
        title: 'Business Strategy',
        category: 'Economy',
        source: 'youtube',
        videoId: 'Gx5DmLYRWrI',
        thumbnail: 'https://img.youtube.com/vi/Gx5DmLYRWrI/maxresdefault.jpg',
        description: 'Business strategies and growth insights for entrepreneurs.',
        views: '16.8K',
        date: 'Dec 4, 2025',
        duration: '11:30',
        featured: false,
        tags: ['Business', 'Strategy', 'Growth']
    },
    {
        id: '8',
        title: 'Tech News',
        category: 'Economy',
        source: 'youtube',
        videoId: '47bNBV5Ca7Y',
        thumbnail: 'https://img.youtube.com/vi/47bNBV5Ca7Y/maxresdefault.jpg',
        description: 'Technology sector updates and innovation news.',
        views: '8.9K',
        date: 'Dec 3, 2025',
        duration: '9:40',
        featured: false,
        tags: ['Technology', 'Innovation', 'Business']
    },
    {
        id: '9',
        title: 'Investment Tips',
        category: 'Markets',
        source: 'youtube',
        videoId: 'zX280yTaG_E',
        thumbnail: 'https://img.youtube.com/vi/zX280yTaG_E/maxresdefault.jpg',
        description: 'Smart investment tips and portfolio management strategies.',
        views: '13.4K',
        date: 'Dec 2, 2025',
        duration: '7:15',
        featured: false,
        tags: ['Investment', 'Portfolio', 'Wealth']
    },
    {
        id: '10',
        title: 'Stock Market News',
        category: 'Markets',
        source: 'youtube',
        videoId: 'tR1ZlYUvzUo',
        thumbnail: 'https://img.youtube.com/vi/tR1ZlYUvzUo/maxresdefault.jpg',
        description: 'Latest stock market news and investment opportunities.',
        views: '19.2K',
        date: 'Dec 1, 2025',
        duration: '13:25',
        featured: false,
        tags: ['Stocks', 'Market', 'Investment']
    },
    {
        id: '11',
        title: 'Economic Outlook',
        category: 'Economy',
        source: 'youtube',
        videoId: 'pK70FxjUJCY',
        thumbnail: 'https://img.youtube.com/vi/pK70FxjUJCY/maxresdefault.jpg',
        description: 'Economic forecast and business trends analysis.',
        views: '10.5K',
        date: 'Nov 30, 2025',
        duration: '10:20',
        featured: false,
        tags: ['Economy', 'Forecast', 'Trends']
    },
    {
        id: '12',
        title: 'Business Shorts',
        category: 'Markets',
        source: 'instagram',
        videoId: 'DSHA0mkgHLS',
        thumbnail: 'https://www.instagram.com/p/DSHA0mkgHLS/media/?size=l',
        description: 'Quick business insights and market updates.',
        views: '8.2K',
        date: 'Nov 29, 2025',
        duration: '0:45',
        featured: false,
        tags: ['Business', 'Quick Update', 'Markets']
    },
    {
        id: '13',
        title: 'Financial Update',
        category: 'Banking',
        source: 'instagram',
        videoId: 'DSG50e1kf_H',
        thumbnail: 'https://www.instagram.com/p/DSG50e1kf_H/media/?size=l',
        description: 'Banking sector news and financial updates.',
        views: '7.8K',
        date: 'Nov 28, 2025',
        duration: '0:50',
        featured: false,
        tags: ['Banking', 'Finance', 'Update']
    },
    {
        id: '14',
        title: 'Market Pulse',
        category: 'Markets',
        source: 'instagram',
        videoId: 'DSFvu7rlS7D',
        thumbnail: 'https://www.instagram.com/p/DSFvu7rlS7D/media/?size=l',
        description: 'Market pulse and trading insights.',
        views: '9.1K',
        date: 'Nov 27, 2025',
        duration: '0:55',
        featured: false,
        tags: ['Markets', 'Trading', 'Pulse']
    },
    {
        id: '15',
        title: 'Business Brief',
        category: 'Economy',
        source: 'instagram',
        videoId: 'DSFoxt3DqbH',
        thumbnail: 'https://www.instagram.com/p/DSFoxt3DqbH/media/?size=l',
        description: 'Brief overview of business developments.',
        views: '6.9K',
        date: 'Nov 26, 2025',
        duration: '0:48',
        featured: false,
        tags: ['Business', 'News', 'Brief']
    },
    {
        id: '16',
        title: 'Economic Insights',
        category: 'Economy',
        source: 'instagram',
        videoId: 'DSFhp73Clum',
        thumbnail: 'https://www.instagram.com/p/DSFhp73Clum/media/?size=l',
        description: 'Quick economic insights and analysis.',
        views: '7.5K',
        date: 'Nov 25, 2025',
        duration: '0:52',
        featured: false,
        tags: ['Economy', 'Insights', 'Analysis']
    },
    {
        id: '17',
        title: 'Market Watch',
        category: 'Markets',
        source: 'instagram',
        videoId: 'DSD_ZR4jZoX',
        thumbnail: 'https://www.instagram.com/p/DSD_ZR4jZoX/media/?size=l',
        description: 'Daily market watch and stock updates.',
        views: '8.7K',
        date: 'Nov 24, 2025',
        duration: '0:47',
        featured: false,
        tags: ['Markets', 'Stocks', 'Watch']
    },
    {
        id: '18',
        title: 'Banking News',
        category: 'Banking',
        source: 'instagram',
        videoId: 'DSD4XfyFQZP',
        thumbnail: 'https://www.instagram.com/p/DSD4XfyFQZP/media/?size=l',
        description: 'Latest banking sector news and updates.',
        views: '6.4K',
        date: 'Nov 23, 2025',
        duration: '0:49',
        featured: false,
        tags: ['Banking', 'News', 'Sector']
    },
    {
        id: '19',
        title: 'Business Flash',
        category: 'Economy',
        source: 'instagram',
        videoId: 'DSDqPEXD-hV',
        thumbnail: 'https://www.instagram.com/p/DSDqPEXD-hV/media/?size=l',
        description: 'Flash business updates and breaking news.',
        views: '9.3K',
        date: 'Nov 22, 2025',
        duration: '0:53',
        featured: false,
        tags: ['Business', 'Breaking', 'Flash']
    }
];

// Get unique categories
function getCategories() {
    const categories = ['All', ...new Set(videoDatabase.map(v => v.category))];
    return categories;
}

// Filter videos by category
function filterVideosByCategory(category) {
    if (category === 'All') {
        return videoDatabase;
    }
    return videoDatabase.filter(video => video.category === category);
}

// Create video card HTML
function createVideoCard(video) {
    const featuredClass = video.featured ? 'featured' : '';
    const sourceIcon = video.source === 'youtube' ? 'fa-youtube' : 'fa-instagram';
    const videoUrl = video.source === 'youtube' 
        ? `https://www.youtube.com/watch?v=${video.videoId}`
        : `https://www.instagram.com/bizz_short/`;
    
    return `
        <article class="video-card ${featuredClass}" data-category="${video.category}">
            <div class="video-thumbnail-container" onclick="window.open('${videoUrl}', '_blank')">
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                <div class="play-overlay">
                    <div class="play-icon">
                        <i class="fab ${sourceIcon}"></i>
                    </div>
                </div>
                <span class="video-source-badge ${video.source}">
                    <i class="fab ${sourceIcon}"></i> ${video.source}
                </span>
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-card-content" onclick="navigateToVideo('${video.id}')">
                <span class="video-category-label">${video.category}</span>
                <h3 class="video-card-title">${video.title}</h3>
                <p class="video-card-description">${video.description}</p>
                <div class="video-card-footer">
                    <div class="video-stats">
                        <span class="video-meta-item">
                            <i class="far fa-eye"></i> ${video.views}
                        </span>
                        <span class="video-meta-item">
                            <i class="far fa-clock"></i> ${video.date}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    `;
}

// Render videos grid
function renderFeaturedVideos(containerId = 'featured-videos-slider') {
    const container = document.getElementById(containerId);
    
    if (!container) {
        // Container not found - fail silently
        return;
    }
    
    const featuredVideos = videoDatabase.filter(video => video.featured);
    
    if (featuredVideos.length === 0) {
        container.innerHTML = `
            <div class="no-videos">
                <i class="fas fa-video-slash"></i>
                <h3>No videos found</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = featuredVideos.map(video => createVideoCard(video)).join('');
}

// Render category tabs
function renderCategoryTabs(containerId = 'video-category-tabs') {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id '${containerId}' not found`);
        return;
    }
    
    const categories = getCategories();
    
    container.innerHTML = categories.map((category, index) => `
        <button class="video-tab-btn ${index === 0 ? 'active' : ''}" 
                onclick="filterVideos('${category}')" 
                data-category="${category}">
            ${category}
        </button>
    `).join('');
}

// Filter videos and update UI
function filterVideos(category) {
    // Update active tab
    document.querySelectorAll('.video-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter and render videos
    const filteredVideos = filterVideosByCategory(category);
    renderVideos(filteredVideos);
}

// Navigate to video detail page
function navigateToVideo(videoId) {
    window.location.href = `video-detail.html?id=${videoId}`;
}

// Initialize video section
function initializeVideoSection() {
    // Render category tabs if container exists
    const tabsContainer = document.getElementById('video-category-tabs');
    if (tabsContainer) {
        renderCategoryTabs();
    }
    
    // Render initial videos
    const videosContainer = document.getElementById('videos-grid');
    if (videosContainer) {
        renderVideos(videoDatabase);
    }
}

// Load featured videos for homepage
function loadFeaturedVideos(limit = 3) {
    const featuredVideos = videoDatabase.slice(0, limit);
    renderVideos(featuredVideos, 'featured-videos-grid');
}

// Load latest videos for homepage
function loadLatestVideos(limit = 6) {
    const latestVideos = videoDatabase.slice(0, limit);
    renderVideos(latestVideos, 'latest-videos-grid');
}

// YouTube API Integration (Optional - for real-time data)
class YouTubeAPI {
    constructor(apiKey, channelId) {
        this.apiKey = apiKey;
        this.channelId = channelId;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    }
    
    async getChannelVideos(maxResults = 10) {
        try {
            const response = await fetch(
                `${this.baseUrl}/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch YouTube videos');
            }
            
            const data = await response.json();
            return this.formatYouTubeVideos(data.items);
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            return [];
        }
    }
    
    formatYouTubeVideos(items) {
        return items.map((item, index) => ({
            id: `yt_${item.id.videoId}`,
            title: item.snippet.title,
            category: 'Business', // You can categorize based on description/tags
            source: 'youtube',
            videoId: item.id.videoId,
            thumbnail: item.snippet.thumbnails.high.url,
            description: item.snippet.description.substring(0, 150) + '...',
            views: 'N/A', // Would need additional API call
            date: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            }),
            duration: '0:00', // Would need additional API call
            featured: index === 0
        }));
    }
}

// Instagram Basic Display API Integration (Optional)
class InstagramAPI {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseUrl = 'https://graph.instagram.com/me';
    }
    
    async getRecentMedia(limit = 10) {
        try {
            const response = await fetch(
                `${this.baseUrl}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${this.accessToken}&limit=${limit}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch Instagram media');
            }
            
            const data = await response.json();
            return this.formatInstagramMedia(data.data.filter(item => item.media_type === 'VIDEO'));
        } catch (error) {
            console.error('Error fetching Instagram media:', error);
            return [];
        }
    }
    
    formatInstagramMedia(items) {
        return items.map((item, index) => ({
            id: `ig_${item.id}`,
            title: this.extractTitle(item.caption),
            category: 'Business',
            source: 'instagram',
            videoId: item.id,
            thumbnail: item.thumbnail_url || item.media_url,
            description: item.caption ? item.caption.substring(0, 150) + '...' : '',
            views: 'N/A',
            date: new Date(item.timestamp).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            }),
            duration: '0:00',
            featured: index === 0
        }));
    }
    
    extractTitle(caption) {
        if (!caption) return 'Instagram Video';
        const firstLine = caption.split('\n')[0];
        return firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        videoDatabase,
        getCategories,
        filterVideosByCategory,
        renderVideos,
        renderCategoryTabs,
        filterVideos,
        navigateToVideo,
        initializeVideoSection,
        loadFeaturedVideos,
        loadLatestVideos,
        YouTubeAPI,
        InstagramAPI
    };
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVideoSection);
} else {
    initializeVideoSection();
}
