/**
 * Real News Loader - Fetches actual news with photos
 * Uses the /api/news-with-images endpoint
 */

class RealNewsLoader {
    constructor() {
        this.apiBaseURL = window.APIConfig && window.APIConfig.baseURL
            ? window.APIConfig.baseURL
            : 'https://bizzshort.onrender.com';
        this.loaded = false;
    }

    async init() {
        if (this.loaded) return;
        console.log('📰 RealNewsLoader: Initializing...');
        await this.loadRealNews();
        this.loaded = true;
    }

    async loadRealNews() {
        const grid = document.getElementById('articleNewsGrid');
        if (!grid) {
            console.log('📰 RealNewsLoader: articleNewsGrid not found');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseURL}/api/news-with-images`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data && result.data.length > 0) {
                console.log(`📰 RealNewsLoader: Loaded ${result.data.length} news articles with images`);
                this.renderNewsCards(grid, result.data);
            } else {
                console.log('📰 RealNewsLoader: No news data, keeping default content');
            }
        } catch (error) {
            console.error('📰 RealNewsLoader: Failed to load news:', error);
            // Keep default static content as fallback
        }
    }

    renderNewsCards(grid, articles) {
        // Badge colors by category
        const badgeColors = {
            'ECONOMY': '#be123c',
            'MARKETS': '#059669',
            'STARTUPS': '#7c3aed',
            'TECHNOLOGY': '#ea580c',
            'FINANCE': '#0891b2',
            'INDUSTRY': '#4338ca',
            'BUSINESS': '#2563eb',
            'DEFAULT': '#667eea'
        };

        grid.innerHTML = articles.slice(0, 6).map((article, index) => {
            const category = (article.category || 'BUSINESS').toUpperCase();
            const badgeColor = badgeColors[category] || badgeColors.DEFAULT;
            const description = article.description
                ? article.description.substring(0, 120) + '...'
                : 'Read more about this story...';

            // Format time ago
            const timeAgo = this.getTimeAgo(article.publishedAt);

            return `
                <article class="breaking-news-card article-card" data-article-index="${index}" 
                         onclick="window.open('${article.url || '#'}', '_blank')" style="cursor:pointer;">
                    <div class="video-thumbnail article-thumbnail">
                        <img src="${article.image}" 
                             alt="${article.title}" 
                             loading="lazy"
                             onerror="this.src='https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800'">
                        <div class="read-overlay"><i class="fas fa-book-open"></i></div>
                    </div>
                    <div class="news-content article-content">
                        <span class="news-badge" style="background: ${badgeColor};">${category}</span>
                        <h4>${article.title}</h4>
                        <p>${description}</p>
                        <div class="news-meta">
                            <span><i class="fas fa-newspaper"></i> ${article.source || 'News'}</span>
                            <span><i class="far fa-clock"></i> ${timeAgo}</span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        console.log('📰 RealNewsLoader: Rendered news cards successfully');
    }

    getTimeAgo(dateString) {
        if (!dateString) return 'Recently';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffHours < 1) return 'Just now';
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
            return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        } catch {
            return 'Recently';
        }
    }
}

// Initialize after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other loaders to initialize
    setTimeout(() => {
        const realNewsLoader = new RealNewsLoader();
        realNewsLoader.init();
        window.realNewsLoader = realNewsLoader;
    }, 500);
});

console.log('✅ RealNewsLoader script loaded');
