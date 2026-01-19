/**
 * Breaking News Loader
 * Loads real breaking news videos from API
 */

class BreakingNewsLoader {
    constructor() {
        // Use APIConfig if available, otherwise fallback to Render URL
        this.apiBaseURL = window.APIConfig && window.APIConfig.baseURL
            ? window.APIConfig.baseURL
            : 'https://bizzshort.onrender.com';
        this.init();
    }

    async init() {
        console.log('📰 Loading breaking news from:', this.apiBaseURL);
        await this.loadBreakingNews();
    }

    async loadBreakingNews() {
        try {
            // Try to fetch videos
            const response = await fetch(`${this.apiBaseURL}/api/videos?source=youtube&limit=7`);

            if (!response.ok) {
                console.warn(`API returned ${response.status}, using fallback videos`);
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            const videos = result.data || result;
            console.log('📰 Breaking news videos loaded:', videos ? videos.length : 0);

            if (videos && videos.length > 0) {
                // Update the 6 breaking news cards
                this.updateBreakingNewsCards(videos.slice(0, 6));
            } else {
                console.log('📺 No videos from API, using fallback');
                this.useFallbackVideos();
            }
        } catch (error) {
            console.error('❌ Failed to load breaking news:', error);
            this.useFallbackVideos();
        }
    }

    useFallbackVideos() {
        console.log('📺 Using fallback videos');
        const fallbackVideos = [
            {
                videoId: 'wG7_1jViDRs',
                title: 'Stock Market Today: Nifty 50 Analysis',
                description: 'Latest stock market updates and analysis',
                thumbnail: 'https://img.youtube.com/vi/wG7_1jViDRs/maxresdefault.jpg',
                category: 'Markets',
                views: 15234,
                publishedAt: new Date().toISOString()
            },
            {
                videoId: 'uSkTR0Q-HVQ',
                title: 'Business News Today | Top Headlines',
                description: 'Breaking business news',
                thumbnail: 'https://img.youtube.com/vi/uSkTR0Q-HVQ/maxresdefault.jpg',
                category: 'Business',
                views: 12500,
                publishedAt: new Date().toISOString()
            },
            {
                videoId: 'VDOutGjKtRg',
                title: 'Startup Funding Roundup',
                description: 'Recent startup funding news',
                thumbnail: 'https://img.youtube.com/vi/VDOutGjKtRg/maxresdefault.jpg',
                category: 'Startups',
                views: 9800,
                publishedAt: new Date().toISOString()
            },
            {
                videoId: 'UtIVXBTMw2I',
                title: 'Economic Outlook India',
                description: 'India economic forecast',
                thumbnail: 'https://img.youtube.com/vi/UtIVXBTMw2I/maxresdefault.jpg',
                category: 'Economy',
                views: 11200,
                publishedAt: new Date().toISOString()
            },
            {
                videoId: 'SEDvD1IICfE',
                title: 'Manufacturing Sector: Success Stories',
                description: 'Make in India achievements',
                thumbnail: 'https://img.youtube.com/vi/SEDvD1IICfE/maxresdefault.jpg',
                category: 'Industry',
                views: 3300,
                publishedAt: new Date().toISOString()
            },
            {
                videoId: 'd0sU0TBhBkE',
                title: 'E-commerce Growth Trends',
                description: 'Insights into India\'s e-commerce sector',
                thumbnail: 'https://img.youtube.com/vi/d0sU0TBhBkE/maxresdefault.jpg',
                category: 'Technology',
                views: 5100,
                publishedAt: new Date().toISOString()
            }
        ];

        this.updateBreakingNewsCards(fallbackVideos);
    }

    // Simplified updateMainVideo (kept for backward compatibility but no longer used in main flow)
    updateMainVideo(video) {
        // Feature removed in favor of 6-card grid
    }

    updateBreakingNewsCards(videos) {
        const cards = document.querySelectorAll('.breaking-news-card');

        videos.forEach((video, index) => {
            if (cards[index] && video) {
                const card = cards[index];
                const thumbnail = card.querySelector('.video-thumbnail img');
                const title = card.querySelector('h4');
                const description = card.querySelector('.news-content p');
                const viewCount = card.querySelector('.news-meta span:first-child');
                const timeAgo = card.querySelector('.news-meta span:last-child');
                const badge = card.querySelector('.news-badge');

                // Get the correct video ID
                const videoId = video.videoId || video.youtubeId;
                const videoTitle = (video.title || '').replace(/"/g, '&quot;');

                // Update data attribute
                card.dataset.videoId = videoId;

                // Set onclick directly to ensure it works
                card.onclick = function () {
                    console.log('🎬 Breaking news card clicked:', videoId);
                    if (typeof playVideo === 'function') {
                        playVideo(videoId, 'youtube', video.title || 'BizzShort Video');
                    } else {
                        // Fallback - open YouTube directly
                        window.open('https://www.youtube.com/watch?v=' + videoId, '_blank');
                    }
                };
                card.style.cursor = 'pointer';

                if (thumbnail && videoId) {
                    thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    thumbnail.alt = video.title || 'Video Thumbnail';
                    // Add fallback for thumbnail
                    thumbnail.onerror = function () {
                        this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    };
                }

                if (badge && video.category) {
                    badge.textContent = video.category.toUpperCase();
                }

                if (title && video.title) {
                    title.textContent = video.title.substring(0, 60) + (video.title.length > 60 ? '...' : '');
                }

                if (description && video.description) {
                    description.textContent = video.description.substring(0, 100) + '...';
                }

                if (viewCount && video.views) {
                    viewCount.innerHTML = `<i class="far fa-eye"></i> ${this.formatViews(video.views)}`;
                }

                if (timeAgo) {
                    if (video.publishedAt) {
                        timeAgo.innerHTML = `<i class="far fa-clock"></i> ${this.getTimeAgo(video.publishedAt)}`;
                    } else if (video.date) {
                        timeAgo.innerHTML = `<i class="far fa-clock"></i> ${video.date}`;
                    }
                }

                console.log(`✅ Breaking news card ${index + 1} updated:`, videoId, video.title?.substring(0, 30));
            }
        });
    }

    formatViews(views) {
        if (!views) return '0';
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    }

    getTimeAgo(dateString) {
        if (!dateString) return 'recently';

        const date = new Date(dateString);
        const now = new Date();
        const secondsAgo = Math.floor((now - date) / 1000);

        if (secondsAgo < 60) return 'just now';
        if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
        if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
        if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)} days ago`;
        if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 604800)} weeks ago`;
        return `${Math.floor(secondsAgo / 2592000)} months ago`;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BreakingNewsLoader();
    });
} else {
    new BreakingNewsLoader();
}
