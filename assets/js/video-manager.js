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
        title: 'Business News Today | Latest Market Updates & Analysis',
        category: 'Markets',
        source: 'youtube',
        videoId: 'fH8Ir7doWGk',
        thumbnail: 'https://img.youtube.com/vi/fH8Ir7doWGk/maxresdefault.jpg',
        description: 'Stay updated with today\'s breaking business news, market movements, and expert analysis on India\'s economic landscape.',
        views: '2.5K',
        date: 'Dec 11, 2025',
        duration: '8:45',
        featured: true,
        tags: ['Business News', 'Market', 'Economy', 'Today']
    },
    {
        id: '2',
        title: 'Stock Market Analysis: Nifty & Sensex Today',
        category: 'Markets',
        source: 'youtube',
        videoId: 'dHFaUxh_sBE',
        thumbnail: 'https://img.youtube.com/vi/dHFaUxh_sBE/maxresdefault.jpg',
        description: 'Comprehensive analysis of today\'s stock market performance, top gainers, losers, and trading strategies for investors.',
        views: '3.2K',
        date: 'Dec 11, 2025',
        duration: '10:30',
        featured: true,
        tags: ['Stock Market', 'Nifty', 'Sensex', 'Trading']
    },
    {
        id: '3',
        title: 'Indian Economy Update: GDP Growth & Future Outlook',
        category: 'Economy',
        source: 'youtube',
        videoId: 'TXoQOkT8FiQ',
        thumbnail: 'https://img.youtube.com/vi/TXoQOkT8FiQ/maxresdefault.jpg',
        description: 'Latest insights on India\'s GDP growth, inflation trends, and economic policies shaping the nation\'s future.',
        views: '4.1K',
        date: 'Dec 11, 2025',
        duration: '9:15',
        featured: true,
        tags: ['GDP', 'Economy', 'Growth', 'Inflation']
    },
    {
        id: '4',
        title: 'Startup Funding News: Investment Rounds & Valuations',
        category: 'Startups',
        source: 'youtube',
        videoId: 'ZZND7BcDA_c',
        thumbnail: 'https://img.youtube.com/vi/ZZND7BcDA_c/maxresdefault.jpg',
        description: 'Breaking news on startup funding rounds, unicorn valuations, and emerging business opportunities in India\'s startup ecosystem.',
        views: '2.8K',
        date: 'Dec 11, 2025',
        duration: '7:50',
        featured: false,
        tags: ['Startups', 'Funding', 'Unicorn', 'Investment']
    },
    {
        id: '5',
        title: 'Banking Sector Update: RBI Policies & Interest Rates',
        category: 'Banking',
        source: 'youtube',
        videoId: 'DBjSV7cGluE',
        thumbnail: 'https://img.youtube.com/vi/DBjSV7cGluE/maxresdefault.jpg',
        description: 'Complete coverage of banking sector developments, RBI monetary policy decisions, and impact on loans and deposits.',
        views: '3.5K',
        date: 'Dec 11, 2025',
        duration: '11:20',
        featured: false,
        tags: ['Banking', 'RBI', 'Interest Rates', 'Loans']
    },
    {
        id: '6',
        title: 'Tech Industry News: Innovation & Digital Transformation',
        category: 'Technology',
        source: 'youtube',
        videoId: 'B8ulzu1X8Y8',
        thumbnail: 'https://img.youtube.com/vi/B8ulzu1X8Y8/maxresdefault.jpg',
        description: 'Latest updates from India\'s technology sector including AI, cloud computing, and digital transformation initiatives.',
        views: '4.7K',
        date: 'Dec 11, 2025',
        duration: '8:30',
        featured: false,
        tags: ['Technology', 'AI', 'Innovation', 'Digital']
    },
    {
        id: '7',
        title: 'Corporate News: Mergers, Acquisitions & Business Deals',
        category: 'Markets',
        source: 'youtube',
        videoId: 'Gx5DmLYRWrI',
        thumbnail: 'https://img.youtube.com/vi/Gx5DmLYRWrI/maxresdefault.jpg',
        description: 'Breaking corporate news covering mergers, acquisitions, strategic partnerships, and major business deals in India.',
        views: '2.3K',
        date: 'Dec 11, 2025',
        duration: '9:45',
        featured: false,
        tags: ['Corporate', 'M&A', 'Business Deals']
    },
    {
        id: '8',
        title: 'Real Estate Market: Property Trends & Investment Tips',
        category: 'Markets',
        source: 'youtube',
        videoId: '47bNBV5Ca7Y',
        thumbnail: 'https://img.youtube.com/vi/47bNBV5Ca7Y/maxresdefault.jpg',
        description: 'Comprehensive analysis of real estate market trends, property prices, and smart investment strategies for homebuyers.',
        views: '3.9K',
        date: 'Dec 11, 2025',
        duration: '10:15',
        featured: false,
        tags: ['Real Estate', 'Property', 'Investment']
    },
    {
        id: '9',
        title: 'Energy Sector Update: Oil Prices & Renewable Energy',
        category: 'Energy',
        source: 'youtube',
        videoId: 'zX280yTaG_E',
        thumbnail: 'https://img.youtube.com/vi/zX280yTaG_E/maxresdefault.jpg',
        description: 'Latest developments in energy sector including oil price movements, renewable energy projects, and sustainability initiatives.',
        views: '2.6K',
        date: 'Dec 11, 2025',
        duration: '7:35',
        featured: false,
        tags: ['Energy', 'Oil', 'Renewable', 'Green Energy']
    },
    {
        id: '10',
        title: 'E-commerce Growth: Online Retail & Consumer Trends',
        category: 'E-commerce',
        source: 'youtube',
        videoId: 'tR1ZlYUvzUo',
        thumbnail: 'https://img.youtube.com/vi/tR1ZlYUvzUo/maxresdefault.jpg',
        description: 'Insights into India\'s booming e-commerce sector, online retail growth, and changing consumer shopping behavior.',
        views: '5.1K',
        date: 'Dec 11, 2025',
        duration: '8:55',
        featured: false,
        tags: ['E-commerce', 'Online Retail', 'Consumer']
    },
    {
        id: '11',
        title: 'Manufacturing Sector: Make in India Success Stories',
        category: 'Manufacturing',
        source: 'youtube',
        videoId: 'pK70FxjUJCY',
        thumbnail: 'https://img.youtube.com/vi/pK70FxjUJCY/maxresdefault.jpg',
        description: 'Celebrating Make in India achievements, manufacturing sector growth, and export success stories driving economic growth.',
        views: '3.3K',
        date: 'Dec 11, 2025',
        duration: '9:20',
        featured: false,
        tags: ['Manufacturing', 'Make in India', 'Export']
    },
    {
        id: '12',
        title: 'Market Highlights: Quick Business Update',
        category: 'Markets',
        source: 'instagram',
        videoId: 'DSHA0mkgHLS',
        thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        description: 'Quick 60-second roundup of today\'s most important market movements and business headlines.',
        views: '6.2K',
        date: 'Dec 11, 2025',
        duration: '1:00',
        featured: false,
        tags: ['Quick Update', 'Market Highlights']
    },
    {
        id: '13',
        title: 'Startup Story: From Idea to Unicorn',
        category: 'Startups',
        source: 'instagram',
        videoId: 'DSG50e1kf_H',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        description: 'Inspiring entrepreneurial journey from startup idea to unicorn status, featuring key lessons for aspiring founders.',
        views: '7.8K',
        date: 'Dec 11, 2025',
        duration: '0:55',
        featured: false,
        tags: ['Startup Story', 'Entrepreneurship']
    },
    {
        id: '14',
        title: 'Economic Policy Brief: Government Initiatives',
        category: 'Economy',
        source: 'instagram',
        videoId: 'DSFvu7rlS7D',
        thumbnail: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800',
        description: 'Quick overview of latest government economic policies and initiatives impacting businesses and citizens.',
        views: '4.5K',
        date: 'Dec 11, 2025',
        duration: '0:50',
        featured: false,
        tags: ['Policy', 'Government', 'Initiatives']
    },
    {
        id: '15',
        title: 'Investment Tips: Smart Money Moves',
        category: 'Markets',
        source: 'instagram',
        videoId: 'DSFoxt3DqbH',
        thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800',
        description: 'Expert investment advice and smart money management strategies for retail investors and beginners.',
        views: '8.9K',
        date: 'Dec 11, 2025',
        duration: '1:05',
        featured: false,
        tags: ['Investment', 'Money Tips', 'Finance']
    },
    {
        id: '16',
        title: 'Banking Innovation: Digital Banking Revolution',
        category: 'Banking',
        source: 'instagram',
        videoId: 'DSFhp73Clum',
        thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        description: 'How digital banking and fintech innovations are transforming the way Indians manage their finances.',
        views: '5.7K',
        date: 'Dec 11, 2025',
        duration: '0:58',
        featured: false,
        tags: ['Digital Banking', 'Fintech', 'Innovation']
    },
    {
        id: '17',
        title: 'Corporate Earnings: Quarterly Results Analysis',
        category: 'Markets',
        source: 'instagram',
        videoId: 'DSD_ZR4jZoX',
        thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
        description: 'Quick analysis of major corporate earnings, profit trends, and sectoral performance this quarter.',
        views: '4.2K',
        date: 'Dec 11, 2025',
        duration: '1:10',
        featured: false,
        tags: ['Earnings', 'Quarterly Results', 'Corporate']
    },
    {
        id: '18',
        title: 'Tech Stocks Update: IT Sector Performance',
        category: 'Technology',
        source: 'instagram',
        videoId: 'DSD4XfyFQZP',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        description: 'Latest updates on technology stocks, IT sector performance, and investment opportunities in tech companies.',
        views: '6.3K',
        date: 'Dec 11, 2025',
        duration: '0:52',
        featured: false,
        tags: ['Tech Stocks', 'IT Sector', 'Investment']
    },
    {
        id: '19',
        title: 'Business Success Tips: Entrepreneurship Guide',
        category: 'Startups',
        source: 'instagram',
        videoId: 'DSDqPEXD-hV',
        thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
        description: 'Essential business success tips and entrepreneurship guidance for aspiring business owners and startups.',
        views: '7.1K',
        date: 'Dec 11, 2025',
        duration: '1:02',
        featured: false,
        tags: ['Business Tips', 'Success', 'Entrepreneurship']
    },
    {
        id: '20',
        title: 'Cryptocurrency Regulations: India\'s Digital Asset Future',
        category: 'Cryptocurrency',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_20', // Replace with actual YouTube video ID
        thumbnail: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d241?w=800',
        description: 'Understanding India\'s evolving cryptocurrency regulations, digital asset taxation, and the future of crypto trading.',
        views: '19.2K',
        date: 'Dec 1, 2025',
        duration: '13:25',
        featured: false,
        tags: ['Tesla', 'EV', 'Auto Sector', 'Stocks', 'Investment']
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
function renderVideos(videos, containerId = 'videos-grid') {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Container with id '${containerId}' not found`);
        return;
    }
    
    if (!videos || videos.length === 0) {
        container.innerHTML = `
            <div class="no-videos">
                <i class="fas fa-video-slash"></i>
                <h3>No videos found</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = videos.map(video => createVideoCard(video)).join('');
}

// Render featured videos
function renderFeaturedVideos(containerId = 'featured-videos-slider') {
    const container = document.getElementById(containerId);
    
    if (!container) {
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
