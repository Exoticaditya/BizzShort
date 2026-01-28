/**
 * Real Article Data Loader for BizzShort
 * Fetches real-time news from backend (scraped from Economic Times)
 */

async function loadRealArticles() {
    const articleGrid = document.getElementById('articleNewsGrid');

    if (!articleGrid) {
        console.warn('Article grid not found');
        return;
    }

    // Show loading state
    articleGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7f8c8d;">
            <i class="fas fa-spinner fa-spin" style="font-size: 24px;"></i>
            <p style="margin-top: 10px;">Loading latest updates...</p>
        </div>
    `;

    try {
        // Fetch from our new scraping endpoint
        const API_BASE_URL = window.APIConfig ? APIConfig.baseURL : 'https://bizzshort.onrender.com';
        const response = await fetch(`${API_BASE_URL}/api/latest-news`);
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
            // Clear loading
            articleGrid.innerHTML = '';

            // Populate with real articles
            result.data.forEach(article => {
                const articleCard = `
                    <article class="breaking-news-card article-card" onclick="window.open('${article.url}', '_blank')" style="cursor: pointer;">
                        <div class="video-thumbnail article-thumbnail">
                            <img src="${article.image}" alt="${article.title}" loading="lazy" 
                                 onerror="this.src='assets/images/news-placeholder.jpg'">
                            <div class="read-overlay"><i class="fas fa-book-open"></i></div>
                        </div>
                        <div class="news-content article-content">
                            <span class="news-badge">${article.category}</span>
                            <h4>${article.title}</h4>
                            <p>${article.description}</p>
                            <div class="news-meta">
                                <span><i class="far fa-eye"></i> ${article.views}</span>
                                <span><i class="far fa-clock"></i> ${article.time || article.readTime}</span>
                            </div>
                        </div>
                    </article>
                `;
                articleGrid.innerHTML += articleCard;
            });
            console.log(`✅ Loaded ${result.data.length} real news articles`);
        } else {
            throw new Error('No data returned');
        }

    } catch (error) {
        console.error('❌ Error loading real articles:', error);
        articleGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 20px; color: #e74c3c;">
                <p>Failed to load latest news. Please try again later.</p>
            </div>
        `;
    }
}

// Load articles when DOM is ready
document.addEventListener('DOMContentLoaded', loadRealArticles);
