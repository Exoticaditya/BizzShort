// ============================================
// NEWS API INTEGRATION
// Fetches Real Business News from News API
// ============================================

class NewsAPIIntegration {
    constructor() {
        // Get your FREE API key from: https://newsapi.org/
        // Replace with your actual API key
        this.apiKey = 'YOUR_NEWS_API_KEY_HERE';
        this.baseUrl = 'https://newsapi.org/v2';

        // Alternative: Use Google News RSS (no API key needed)
        // DISABLED: RSS2JSON service is rate-limited, using mock data instead
        this.useGoogleNews = false;

        this.categories = {
            business: 'business',
            technology: 'technology',
            markets: 'business',
            startups: 'business'
        };

        this.init();
    }

    async init() {
        console.log('📰 News Integration: Initializing...');
        // Try Google News first (free, no key)
        await this.fetchGoogleNews();
    }

    async fetchNewsAPI() {
        // ... (Keep existing implementation as fallback/alternative if key provided)
        try {
            if (!this.apiKey || this.apiKey === 'YOUR_NEWS_API_KEY_HERE') {
                throw new Error('No API Key');
            }
            const response = await fetch(
                `${this.baseUrl}/top-headlines?country=in&category=business&pageSize=23&apiKey=${this.apiKey}`
            );

            if (!response.ok) throw new Error('News API request failed');

            const data = await response.json();
            this.displayNews(data.articles);
        } catch (error) {
            console.warn('News API failed or no key, switching to Google News RSS...');
            await this.fetchGoogleNews();
        }
    }

    async fetchGoogleNews() {
        try {
            console.log('🔄 Fetching from Google News RSS...');
            const topics = [
                'India business news',
                'Indian stock market',
                'Indian economy'
            ];

            const allArticles = [];
            // fetching sequentially to avoid rate limits on rss2json free tier
            for (const topic of topics) {
                const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-IN&gl=IN&ceid=IN:en`;
                const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=8`;

                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    if (data.status === 'ok') {
                        allArticles.push(...data.items);
                    }
                    // small delay
                    await new Promise(r => setTimeout(r, 500));
                } catch (err) {
                    console.warn(`Failed to fetch topic: ${topic}`, err);
                }
            }

            if (allArticles.length === 0) throw new Error('No articles found');

            // Deduplicate by title
            const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.title, item])).values());

            const articles = uniqueArticles.slice(0, 23).map(item => ({
                title: item.title,
                description: this.cleanDescription(item.description),
                url: item.link,
                urlToImage: this.extractImage(item) || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
                publishedAt: item.pubDate,
                source: { name: 'Google News' }
            }));

            this.displayNews(articles);
        } catch (error) {
            console.error('Error fetching Google News:', error);
            this.displayMockNews();
        }
    }

    cleanDescription(html) {
        if (!html) return '';
        // Remove HTML tags
        let text = html.replace(/<[^>]*>/g, '');
        // Decode entities
        const txt = document.createElement("textarea");
        txt.innerHTML = text;
        return txt.value.substring(0, 150) + '...';
    }

    extractImage(item) {
        // rss2json sometimes puts image in enclosure, or description
        if (item.enclosure && item.enclosure.link) return item.enclosure.link;
        if (item.thumbnail) return item.thumbnail;

        // Try to find img tag in description
        const match = item.description?.match(/src="([^"]+)"/);
        if (match) return match[1];

        return null;
    }

    displayNews(articles) {
        // Update top 3 featured cards
        this.updateFeaturedCards(articles.slice(0, 3));

        // Update main news grid (8 cards)
        this.updateNewsGrid(articles.slice(3, 11));

        // Update remaining cards
        this.updateRemainingCards(articles.slice(11, 23));
    }

    updateFeaturedCards(articles) {
        const featuredContainer = document.querySelector('.news-cards-grid');
        if (!featuredContainer) return;

        const newsCards = featuredContainer.querySelectorAll('.news-card');

        articles.forEach((article, index) => {
            if (newsCards[index]) {
                const card = newsCards[index];

                // Update image
                const img = card.querySelector('img');
                if (img) img.src = article.urlToImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800';

                // Update title
                const title = card.querySelector('h3');
                if (title) title.textContent = article.title;

                // Update description
                const desc = card.querySelector('p');
                if (desc) desc.textContent = article.description;

                // Update link
                card.onclick = () => window.open(article.url, '_blank');

                // Update time
                const timeEl = card.querySelector('.time');
                if (timeEl) timeEl.textContent = this.formatTime(article.publishedAt);
            }
        });
    }

    updateNewsGrid(articles) {
        const newsGrid = document.querySelector('.news-grid');
        if (!newsGrid) return;

        const cards = newsGrid.querySelectorAll('.news-card-large');

        articles.forEach((article, index) => {
            if (cards[index]) {
                const card = cards[index];

                // Update image
                const img = card.querySelector('img');
                if (img) img.src = article.urlToImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800';

                // Update title
                const title = card.querySelector('h3');
                if (title) title.textContent = article.title;

                // Update description
                const desc = card.querySelector('p');
                if (desc) desc.textContent = article.description;

                // Update link
                card.onclick = () => window.open(article.url, '_blank');

                // Update time
                const timeEl = card.querySelector('.time');
                if (timeEl) timeEl.textContent = this.formatTime(article.publishedAt);
            }
        });
    }

    updateRemainingCards(articles) {
        // Update any remaining article cards on the page
        const remainingCards = document.querySelectorAll('.article-card:not(.news-card):not(.news-card-large)');

        articles.forEach((article, index) => {
            if (remainingCards[index]) {
                const card = remainingCards[index];

                const img = card.querySelector('img');
                if (img) img.src = article.urlToImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800';

                const title = card.querySelector('h3, .article-title');
                if (title) title.textContent = article.title;

                const desc = card.querySelector('p, .article-description');
                if (desc) desc.textContent = article.description;

                card.onclick = () => window.open(article.url, '_blank');
            }
        });
    }

    displayMockNews() {
        // Fallback mock news data
        const mockArticles = [
            {
                title: 'Nifty 50 Hits Record High as FII Inflows Surge',
                description: 'Indian equity markets reached new highs today with strong foreign institutional investor inflows driving the rally across sectors.',
                urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
                url: '#',
                publishedAt: new Date().toISOString(),
                source: { name: 'BizzShort' }
            },
            {
                title: 'Indian Startups Raise $24 Billion in 2025, Focus Shifts to Profitability',
                description: 'The startup ecosystem shows maturity with investors prioritizing sustainable business models and clear paths to profitability.',
                urlToImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                url: '#',
                publishedAt: new Date().toISOString(),
                source: { name: 'BizzShort' }
            },
            {
                title: 'RBI Maintains Repo Rate at 6.50%, GDP Growth Forecast at 7.3%',
                description: 'Reserve Bank of India keeps policy rates unchanged while maintaining growth-inflation balance. Economy shows robust momentum.',
                urlToImage: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800',
                url: '#',
                publishedAt: new Date().toISOString(),
                source: { name: 'BizzShort' }
            }
        ];

        // Repeat to get 23 articles
        const articles = [];
        for (let i = 0; i < 23; i++) {
            articles.push({ ...mockArticles[i % 3], title: mockArticles[i % 3].title + ` (${i + 1})` });
        }

        this.displayNews(articles);
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return `${diffMins} minutes ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} days ago`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const newsAPI = new NewsAPIIntegration();

    // Refresh news every 10 minutes
    setInterval(() => {
        if (newsAPI.useGoogleNews) {
            newsAPI.fetchGoogleNews();
        } else {
            newsAPI.fetchNewsAPI();
        }
    }, 600000); // 10 minutes
});
