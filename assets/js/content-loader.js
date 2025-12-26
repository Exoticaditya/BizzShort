// BizzShort Content Loader - Dynamically loads content from backend API

class ContentLoader {
    constructor() {
        this.api = new BizzShortAPI();
        this.initialized = false;
        this.youtubeHandle = '@bizz_short';
        this.instagramHandle = 'bizz_short';
    }

    async init() {
        if (this.initialized) return;
        
        try {
            await Promise.all([
                this.loadLatestNews(),
                this.loadInterviews(),
                this.loadEvents(),
                this.loadIndustryUpdates(),
                this.loadVideos()
            ]);
            
            this.initialized = true;
        } catch (error) {
            console.error('Content loading failed:', error);
            // Keep static content as fallback
        }
    }

    async loadVideos() {
        try {
            // Load videos from backend API
            const response = await fetch('https://bizzshort.onrender.com/api/videos?limit=20');
            if (!response.ok) {
                // Fallback to YouTube RSS if backend not available
                await this.loadYouTubeVideos();
                return;
            }
            
            const videos = await response.json();
            if (videos && videos.length > 0) {
                this.renderVideoGrid(videos);
            }
        } catch (error) {
            console.warn('Loading videos from YouTube:', error.message);
            await this.loadYouTubeVideos();
        }
    }

    async loadYouTubeVideos() {
        try {
            // Use YouTube Data API v3 or fetch from video-manager.js database
            const videoManager = window.videoDatabase;
            if (videoManager && videoManager.length > 0) {
                this.renderVideoGrid(videoManager);
            }
        } catch (error) {
            console.warn('Video loading skipped');
        }
    }

    renderVideoGrid(videos) {
        // Add videos to news items dynamically
        const newsCards = document.querySelectorAll('.news-card-large, .interview-card, .event-card');
        
        newsCards.forEach((card, index) => {
            if (videos[index]) {
                const video = videos[index];
                const videoLink = document.createElement('a');
                videoLink.href = `https://youtube.com/watch?v=${video.videoId || video.url}`;
                videoLink.target = '_blank';
                videoLink.className = 'video-link';
                videoLink.innerHTML = '<i class="fab fa-youtube"></i> YouTube';
                videoLink.style.cssText = 'display:inline-block;margin-top:10px;color:#ff0000;font-weight:bold;';
                
                const cardContent = card.querySelector('.card-content, .interview-content, .event-content');
                if (cardContent) {
                    cardContent.appendChild(videoLink);
                }
            }
        });
    }

    async loadLatestNews() {
        try {
            const response = await fetch('https://bizzshort.onrender.com/api/articles?limit=8');
            if (!response.ok) throw new Error('Failed to fetch articles');
            
            const articles = await response.json();
            if (articles && articles.length > 0) {
                this.renderLatestNews(articles);
            }
        } catch (error) {
            console.warn('Using static news content:', error.message);
        }
    }

    async loadInterviews() {
        try {
            const response = await fetch('https://bizzshort.onrender.com/api/interviews?limit=6');
            if (!response.ok) throw new Error('Failed to fetch interviews');
            
            const interviews = await response.json();
            if (interviews && interviews.length > 0) {
                this.renderInterviews(interviews);
            }
        } catch (error) {
            console.warn('Using static interview content:', error.message);
        }
    }

    async loadEvents() {
        try {
            const response = await fetch('https://bizzshort.onrender.com/api/events?limit=6');
            if (!response.ok) throw new Error('Failed to fetch events');
            
            const events = await response.json();
            if (events && events.length > 0) {
                this.renderEvents(events);
            }
        } catch (error) {
            console.warn('Using static event content:', error.message);
        }
    }

    async loadIndustryUpdates() {
        try {
            const response = await fetch('https://bizzshort.onrender.com/api/industry?limit=6');
            if (!response.ok) throw new Error('Failed to fetch industry updates');
            
            const updates = await response.json();
            if (updates && updates.length > 0) {
                this.renderIndustryUpdates(updates);
            }
        } catch (error) {
            console.warn('Using static industry content:', error.message);
        }
    }

    renderLatestNews(articles) {
        const newsGrid = document.querySelector('.news-grid-large');
        if (!newsGrid) return;

        newsGrid.innerHTML = articles.map(article => `
            <article class="news-card-large" data-category="${article.category?.toLowerCase() || 'business'}">
                <a href="article-detail.html?id=${article._id}" style="text-decoration: none; color: inherit;">
                    <img src="${article.image || article.thumbnail || 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'}" 
                         alt="${article.title}"
                         onerror="this.src='https://placehold.co/800x400/2c3e50/ffffff?text=BizzShort+News'">
                    <div class="card-content">
                        <span class="category-badge ${article.category?.toLowerCase() || 'business'}">${article.category || 'Business'}</span>
                        <h3>${article.title}</h3>
                        <p>${article.summary || article.excerpt || article.content?.substring(0, 150) + '...' || ''}</p>
                        <div class="card-footer">
                            <span class="author"><i class="fas fa-user"></i> ${article.author || 'BizzShort Team'}</span>
                            <span class="time"><i class="far fa-clock"></i> ${this.formatDate(article.createdAt || article.published)}</span>
                        </div>
                        ${article.url && article.url.includes('youtube') ? `
                        <a href="${article.url}" target="_blank" class="video-link" style="display:inline-block;margin-top:10px;color:#ff0000;font-weight:bold;">
                            <i class="fab fa-youtube"></i> Watch on YouTube
                        </a>` : ''}
                    </div>
                </a>
            </article>
        `).join('');
    }

    renderInterviews(interviews) {
        const interviewGrid = document.querySelector('.interview-grid');
        if (!interviewGrid) return;

        interviewGrid.innerHTML = interviews.map(interview => `
            <article class="interview-card">
                <a href="article-detail.html?id=${interview._id}" style="text-decoration: none; color: inherit;">
                    <img src="${interview.image || 'https://placehold.co/800x400/34495e/ffffff?text=Interview'}" 
                         alt="${interview.title}"
                         onerror="this.src='https://placehold.co/800x400/34495e/ffffff?text=Interview'">
                    <div class="interview-content">
                        <span class="interview-tag">${interview.intervieweeDesignation || 'Exclusive Interview'}</span>
                        <h3>${interview.title}</h3>
                        <p>${interview.summary || interview.content?.substring(0, 120) + '...' || ''}</p>
                        <div class="interview-meta">
                            <span>📅 ${this.formatDateShort(interview.date || interview.createdAt)}</span>
                            <span>⏱️ ${interview.readTime || '10'} min read</span>
                        </div>
                    </div>
                </a>
            </article>
        `).join('');
    }

    renderEvents(events) {
        const eventGrid = document.querySelector('.event-grid');
        if (!eventGrid) return;

        eventGrid.innerHTML = events.map(event => `
            <article class="event-card">
                <a href="events.html?id=${event._id}" style="text-decoration: none; color: inherit;">
                    <img src="${event.image || 'https://placehold.co/800x400/667eea/ffffff?text=Event'}" 
                         alt="${event.title}"
                         onerror="this.src='https://placehold.co/800x400/667eea/ffffff?text=Event'">
                    <div class="event-content">
                        <div class="event-date">
                            <span class="date-day">${this.getDay(event.date)}</span>
                            <span class="date-month">${this.getMonth(event.date)}</span>
                        </div>
                        <div class="event-info">
                            <h3>${event.title}</h3>
                            <p>${event.description || event.summary || ''}</p>
                            <div class="event-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${event.location || 'Online'}</span>
                                <span><i class="fas fa-users"></i> ${event.participants || event.attendees || 0} attendees</span>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        `).join('');
    }

    renderIndustryUpdates(updates) {
        const industryGrid = document.querySelector('.industry-grid');
        if (!industryGrid) return;

        industryGrid.innerHTML = updates.map(update => `
            <article class="industry-card">
                <a href="article-detail.html?id=${update._id}" style="text-decoration: none; color: inherit;">
                    <img src="${update.image || 'https://placehold.co/800x400/e74c3c/ffffff?text=Industry'}" 
                         alt="${update.title}"
                         onerror="this.src='https://placehold.co/800x400/e74c3c/ffffff?text=Industry'">
                    <div class="industry-content">
                        <span class="industry-tag">${update.category || 'Industry Update'}</span>
                        <h3>${update.title}</h3>
                        <p>${update.summary || update.content?.substring(0, 150) + '...' || ''}</p>
                        <div class="industry-footer">
                            <span><i class="far fa-calendar"></i> ${this.formatDateShort(update.createdAt)}</span>
                            <span><i class="far fa-eye"></i> ${update.views || 0} views</span>
                        </div>
                    </div>
                </a>
            </article>
        `).join('');
    }

    formatDate(dateString) {
        if (!dateString) return 'Just now';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    formatDateShort(dateString) {
        if (!dateString) return 'TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    getDay(dateString) {
        if (!dateString) return '01';
        const date = new Date(dateString);
        return String(date.getDate()).padStart(2, '0');
    }

    getMonth(dateString) {
        if (!dateString) return 'JAN';
        const date = new Date(dateString);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[date.getMonth()];
    }
}

// Initialize content loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const loader = new ContentLoader();
    loader.init();
});
