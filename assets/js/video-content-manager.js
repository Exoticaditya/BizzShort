/**
 * Video Content Manager
 * Handles all video interactions and YouTube data loading
 */

class VideoContentManager {
    constructor() {
        this.apiBaseURL = 'https://bizzshort.onrender.com/api';
        this.youtubeHandle = document.body.dataset.youtubeHandle || '@bizz_short';
        this.init();
    }

    init() {
        this.setupVideoClickHandlers();
        this.loadRealVideos();
    }

    /**
     * Setup click handlers for all video cards
     */
    setupVideoClickHandlers() {
        // Breaking news video - already embedded, no action needed
        
        // Latest News videos
        document.querySelectorAll('.news-video-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = card.dataset.videoId;
                this.openYouTubeVideo(videoId);
            });
        });

        // Interview videos
        document.querySelectorAll('.interview-video-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = card.dataset.videoId;
                this.openYouTubeVideo(videoId);
            });
        });
    }

    /**
     * Open YouTube video in new tab or modal
     */
    openYouTubeVideo(videoId) {
        if (!videoId || videoId.startsWith('VIDEO_') || videoId.startsWith('INTERVIEW_')) {
            // Fallback to channel if no specific video ID
            window.open(`https://youtube.com/${this.youtubeHandle}`, '_blank');
            return;
        }
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }

    /**
     * Load real videos from backend API
     */
    async loadRealVideos() {
        try {
            const response = await fetch(`${this.apiBaseURL}/videos?source=youtube&limit=20`);
            if (!response.ok) throw new Error('Failed to fetch videos');
            
            const videos = await response.json();
            
            if (videos && videos.length > 0) {
                this.updateBreakingNews(videos[0]);
                this.updateLatestNews(videos.slice(1, 5));
                this.updateInterviews(videos.slice(5, 8));
            }
        } catch (error) {
            console.info('Using placeholder videos. Real videos will load from:', this.youtubeHandle);
        }
    }

    /**
     * Update breaking news video
     */
    updateBreakingNews(video) {
        const breakingSection = document.querySelector('.breaking-video-player');
        if (!breakingSection || !video) return;

        const iframe = breakingSection.querySelector('iframe');
        const title = breakingSection.querySelector('h3');
        const description = breakingSection.querySelector('p');
        const viewCount = breakingSection.querySelector('.video-stats span:nth-child(2)');
        const timeAgo = breakingSection.querySelector('.video-stats span:nth-child(3)');

        if (iframe && video.videoId) {
            iframe.src = `https://www.youtube.com/embed/${video.videoId}?autoplay=0&rel=0`;
        }

        if (title && video.title) {
            title.textContent = video.title;
        }

        if (description && video.description) {
            description.textContent = video.description.substring(0, 150) + '...';
        }

        if (viewCount && video.views) {
            viewCount.innerHTML = `<i class="far fa-eye"></i> ${this.formatViews(video.views)}`;
        }

        if (timeAgo && video.publishedAt) {
            timeAgo.innerHTML = `<i class="far fa-clock"></i> ${this.getTimeAgo(video.publishedAt)}`;
        }
    }

    /**
     * Update latest news videos
     */
    updateLatestNews(videos) {
        const newsCards = document.querySelectorAll('.news-video-card');
        
        videos.forEach((video, index) => {
            if (newsCards[index] && video) {
                const card = newsCards[index];
                const thumbnail = card.querySelector('.video-thumbnail img');
                const title = card.querySelector('.video-details h3');
                const viewCount = card.querySelector('.video-meta span:first-child');
                const timeAgo = card.querySelector('.video-meta span:last-child');
                const duration = card.querySelector('.video-duration');

                card.dataset.videoId = video.videoId || '';

                if (thumbnail && video.thumbnail) {
                    thumbnail.src = video.thumbnail;
                    thumbnail.alt = video.title || 'Business News';
                }

                if (title && video.title) {
                    title.textContent = video.title;
                }

                if (viewCount && video.views) {
                    viewCount.innerHTML = `<i class="far fa-eye"></i> ${this.formatViews(video.views)}`;
                }

                if (timeAgo && video.publishedAt) {
                    timeAgo.innerHTML = `<i class="far fa-clock"></i> ${this.getTimeAgo(video.publishedAt)}`;
                }

                if (duration && video.duration) {
                    duration.textContent = this.formatDuration(video.duration);
                }
            }
        });
    }

    /**
     * Update interview videos
     */
    updateInterviews(videos) {
        const interviewCards = document.querySelectorAll('.interview-video-card');
        
        videos.forEach((video, index) => {
            if (interviewCards[index] && video) {
                const card = interviewCards[index];
                const thumbnail = card.querySelector('.video-thumbnail img');
                const title = card.querySelector('.interview-details h3');
                const viewCount = card.querySelector('.video-meta span:first-child');
                const timeAgo = card.querySelector('.video-meta span:last-child');
                const duration = card.querySelector('.video-duration');

                card.dataset.videoId = video.videoId || '';

                if (thumbnail && video.thumbnail) {
                    thumbnail.src = video.thumbnail;
                    thumbnail.alt = video.title || 'Interview';
                }

                if (title && video.title) {
                    title.textContent = video.title;
                }

                if (viewCount && video.views) {
                    viewCount.innerHTML = `<i class="far fa-eye"></i> ${this.formatViews(video.views)}`;
                }

                if (timeAgo && video.publishedAt) {
                    timeAgo.innerHTML = `<i class="far fa-clock"></i> ${this.getTimeAgo(video.publishedAt)}`;
                }

                if (duration && video.duration) {
                    duration.textContent = this.formatDuration(video.duration);
                }
            }
        });
    }

    /**
     * Format view count (e.g., 1234 -> 1.2K)
     */
    formatViews(views) {
        if (!views) return '0';
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    }

    /**
     * Format duration (seconds to MM:SS)
     */
    formatDuration(seconds) {
        if (!seconds) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Get time ago string
     */
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
        new VideoContentManager();
    });
} else {
    new VideoContentManager();
}
