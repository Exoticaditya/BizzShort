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
            // Try to fetch videos - removed category filter for more results
            const response = await fetch(`${this.apiBaseURL}/api/videos?source=youtube&limit=5`);

            if (!response.ok) {
                console.warn(`API returned ${response.status}, using fallback videos`);
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            const videos = result.data || result; // Handle both {data: [...]} and direct array
            console.log('📰 Breaking news videos loaded:', videos ? videos.length : 0, videos);

            if (videos && videos.length > 0) {
                // Update main breaking news video (first video)
                this.updateMainVideo(videos[0]);

                // Update the 3 breaking news cards (next 3 videos)
                this.updateBreakingNewsCards(videos.slice(1, 4));
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
            }
        ];

        this.updateMainVideo(fallbackVideos[0]);
        this.updateBreakingNewsCards(fallbackVideos.slice(1, 4));
    }

    updateMainVideo(video) {
        if (!video) return;

        const iframe = document.querySelector('.breaking-video-player iframe');
        const title = document.querySelector('.breaking-video-player h3');
        const description = document.querySelector('.breaking-video-player p');
        const viewCount = document.querySelector('.video-stats span:nth-child(2)');
        const timeAgo = document.querySelector('.video-stats span:nth-child(3)');

        // Get the correct video ID (handle both formats)
        const videoId = video.youtubeId || video.videoId;
        
        if (iframe && videoId) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
            console.log('✅ Main breaking news video updated:', videoId);
        }

        if (title && video.title) {
            title.textContent = video.title;
        }

        if (description && video.description) {
            description.textContent = video.description.substring(0, 120) + '...';
        }

        if (viewCount && video.views) {
            viewCount.innerHTML = `<i class="far fa-eye"></i> ${this.formatViews(video.views)} views`;
        }

        if (timeAgo && video.publishedAt) {
            timeAgo.innerHTML = `<i class="far fa-clock"></i> ${this.getTimeAgo(video.publishedAt)}`;
        }
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

                // Store video data
                const videoId = video.videoId || video.youtubeId;
                const videoTitle = (video.title || '').replace(/"/g, '&quot;');
                card.dataset.videoId = videoId;
                card.dataset.videoTitle = videoTitle;

                // Add event listener for click
                card.addEventListener('click', function () {
                    console.log('🎬 Breaking news card clicked:', videoId);
                    if (typeof playVideo === 'function') {
                        playVideo(videoId, 'youtube', video.title);
                    } else {
                        console.error('❌ playVideo function not found!');
                    }
                });
                card.style.cursor = 'pointer';

                if (thumbnail && video.thumbnail) {
                    thumbnail.src = video.thumbnail;
                    thumbnail.alt = video.title;
                    // Add fallback
                    thumbnail.onerror = function () {
                        this.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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

                if (timeAgo && video.publishedAt) {
                    timeAgo.innerHTML = `<i class="far fa-clock"></i> ${this.getTimeAgo(video.publishedAt)}`;
                }

                console.log(`✅ Breaking news card ${index + 1} updated:`, video.title.substring(0, 30));
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
