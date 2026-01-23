// BizzShort Article Loader - Dynamically loads articles from backend API

class ArticleLoader {
    constructor() {
        this.apiBaseURL = null;
        this.articles = [];
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        // Wait for API config to be ready
        if (typeof APIConfig !== 'undefined') {
            this.apiBaseURL = APIConfig.endpoint('/api/articles');
        } else {
            this.apiBaseURL = 'https://bizzshort.onrender.com/api/articles';
        }

        await this.loadArticles();
        this.initialized = true;
    }

    async loadArticles() {
        try {
            console.log('📰 Loading articles from API...');
            const response = await fetch(`${this.apiBaseURL}?limit=6&status=PUBLISHED`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            this.articles = result.data || result || [];
            
            if (this.articles.length > 0) {
                console.log(`✅ Loaded ${this.articles.length} articles`);
                this.renderArticles();
            } else {
                console.log('📝 No articles available, using default content');
            }
        } catch (error) {
            console.error('❌ Failed to load articles:', error);
            // Keep default static content as fallback
        }
    }

    renderArticles() {
        const grid = document.getElementById('articleNewsGrid');
        if (!grid) return;

        // Clear existing content
        grid.innerHTML = '';

        this.articles.forEach((article, index) => {
            const card = this.createArticleCard(article, index);
            grid.appendChild(card);
        });
    }

    createArticleCard(article, index) {
        const articleCard = document.createElement('article');
        articleCard.className = 'breaking-news-card article-card';
        articleCard.dataset.articleId = article._id || article.id;
        articleCard.style.cursor = 'pointer';
        
        // Determine badge color based on category
        const badgeColors = {
            'BUSINESS': '#2563eb',
            'MARKETS': '#059669',
            'STARTUPS': '#7c3aed',
            'TECHNOLOGY': '#ea580c',
            'FINANCE': '#0891b2',
            'ECONOMY': '#be123c',
            'INDUSTRY': '#4338ca',
            'DEFAULT': '#667eea'
        };
        
        const badgeColor = badgeColors[article.category?.toUpperCase()] || badgeColors.DEFAULT;
        
        // Get image URL or use placeholder
        const imageUrl = article.image || `https://img.youtube.com/vi/wG7_1jViDRs/hqdefault.jpg`;
        
        // Format views with K/M suffix
        const formatViews = (views) => {
            if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
            if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
            return views.toString();
        };
        
        // Create card HTML
        articleCard.innerHTML = `
            <div class="video-thumbnail article-thumbnail">
                <img src="${imageUrl}" alt="${article.title || 'Article Image'}" loading="lazy">
                <div class="read-overlay"><i class="fas fa-book-open"></i></div>
            </div>
            <div class="news-content article-content">
                <span class="news-badge" style="background: ${badgeColor};">${article.category?.toUpperCase() || 'ARTICLE'}</span>
                <h4>${article.title}</h4>
                <p>${article.excerpt || article.content?.substring(0, 120) + '...' || ''}</p>
                <div class="news-meta">
                    <span><i class="far fa-eye"></i> ${formatViews(article.views || Math.floor(Math.random() * 10000))}</span>
                    <span><i class="far fa-clock"></i> ${article.readTime || 5} min read</span>
                </div>
            </div>
        `;
        
        // Add click handler to open article
        articleCard.addEventListener('click', () => {
            this.openArticle(article);
        });
        
        return articleCard;
    }

    openArticle(article) {
        // Navigate to dedicated article page with SEO-friendly structure
        const articleId = article._id || article.id;
        const slug = article.slug || articleId;
        
        // Option 1: Navigate to dedicated article page (SEO-friendly)
        window.location.href = `article.html?id=${slug}`;
        
        // Option 2: Open in modal (uncomment below if you prefer modal)
        // this.showArticleModal(article);
    }

    showArticleModal(article) {
        // Check if modal already exists
        let modal = document.getElementById('articleModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'articleModal';
            modal.className = 'video-modal';
            document.body.appendChild(modal);
        }

        // Format publish date
        const publishDate = article.publishedAt 
            ? new Date(article.publishedAt).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
            : 'Recently';

        // Create modal content
        modal.innerHTML = `
            <div class="modal-content article-modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <span class="close-modal" onclick="closeArticleModal()">&times;</span>
                <div class="article-header" style="margin-bottom: 20px;">
                    ${article.image ? `<img src="${article.image}" alt="${article.title}" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 20px;">` : ''}
                    <span class="news-badge" style="margin-bottom: 10px; display: inline-block;">${article.category?.toUpperCase() || 'ARTICLE'}</span>
                    <h1 style="font-size: 2em; margin-bottom: 10px; color: #1a1a1a;">${article.title}</h1>
                    <div class="article-meta" style="display: flex; gap: 20px; color: #666; margin-bottom: 20px; font-size: 0.9em;">
                        ${article.author?.name ? `<span><i class="fas fa-user"></i> ${article.author.name}</span>` : ''}
                        <span><i class="far fa-calendar"></i> ${publishDate}</span>
                        <span><i class="far fa-clock"></i> ${article.readTime || 5} min read</span>
                        <span><i class="far fa-eye"></i> ${article.views || 0} views</span>
                    </div>
                </div>
                <div class="article-body" style="font-size: 1.1em; line-height: 1.8; color: #333;">
                    ${this.formatArticleContent(article.content)}
                </div>
                ${article.tags && article.tags.length > 0 ? `
                    <div class="article-tags" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <strong>Tags:</strong>
                        ${article.tags.map(tag => `<span style="display: inline-block; background: #f0f0f0; padding: 5px 12px; border-radius: 15px; margin: 5px; font-size: 0.9em;">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeArticleModal();
            }
        });

        // Track view
        this.trackArticleView(article._id || article.id);
    }

    formatArticleContent(content) {
        if (!content) return '<p>Content not available.</p>';
        
        // Simple formatting: split by newlines and wrap in paragraphs
        return content
            .split('\n\n')
            .filter(para => para.trim())
            .map(para => `<p>${para.trim()}</p>`)
            .join('');
    }

    async trackArticleView(articleId) {
        if (!articleId) return;
        
        try {
            // Send view tracking request
            const response = await fetch(`${this.apiBaseURL}/${articleId}/view`, {
                method: 'POST'
            });
            console.log('📊 Article view tracked');
        } catch (error) {
            console.error('Failed to track article view:', error);
        }
    }
}

// Global function to close article modal
window.closeArticleModal = function() {
    const modal = document.getElementById('articleModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Initialize article loader on page load
document.addEventListener('DOMContentLoaded', async () => {
    const articleLoader = new ArticleLoader();
    await articleLoader.init();
    
    // Store globally for debugging
    window.articleLoader = articleLoader;
});

console.log('✅ Article loader script loaded');
