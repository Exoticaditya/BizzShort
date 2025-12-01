// Live Search Feature for BizzShort
// Enhanced search functionality with real-time results

class SearchEngine {
    constructor() {
        this.searchData = [];
        this.searchResults = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.setupSearchUI();
        this.isInitialized = true;
    }

    // Build comprehensive search index
    buildSearchIndex() {
        this.searchData = [
            // Home page content
            { title: "Indian Stock Market Hits All-Time High", category: "Markets", page: "index.html", section: "hero" },
            { title: "Startups Raise Record $12B in Funding", category: "Startups", page: "index.html", section: "trending" },
            { title: "RBI Announces New Monetary Policy", category: "Finance", page: "index.html", section: "business-news" },
            { title: "Tech IPOs Dominate Market in 2025", category: "Tech", page: "index.html", section: "tech-news" },
            { title: "Green Energy Sector Sees 200% Growth", category: "Energy", page: "index.html", section: "markets" },
            
            // Analytics page
            { title: "Traffic Analytics Dashboard", category: "Analytics", page: "analytics.html", section: "main" },
            { title: "Advertising Performance Metrics", category: "Analytics", page: "analytics.html", section: "ads" },
            { title: "Content Performance Analysis", category: "Analytics", page: "analytics.html", section: "content" },
            
            // Advertise page
            { title: "Advertisement Packages and Pricing", category: "Advertise", page: "advertise.html", section: "pricing" },
            { title: "Banner Advertisement Options", category: "Advertise", page: "advertise.html", section: "options" },
            { title: "Sponsored Content Opportunities", category: "Advertise", page: "advertise.html", section: "sponsored" },
            { title: "ROI Calculator for Advertisers", category: "Advertise", page: "advertise.html", section: "roi" },
            
            // About page
            { title: "About BizzShort - Our Mission", category: "Company", page: "about.html", section: "about" },
            { title: "Our Team and Leadership", category: "Company", page: "about.html", section: "team" },
            { title: "Company History and Vision", category: "Company", page: "about.html", section: "history" },
            
            // Contact page
            { title: "Contact BizzShort Team", category: "Contact", page: "contact.html", section: "main" },
            { title: "Business Inquiries and Partnerships", category: "Contact", page: "contact.html", section: "business" },
            { title: "Editorial Submissions", category: "Contact", page: "contact.html", section: "editorial" },
            
            // Blog page
            { title: "Business News Blog", category: "Blog", page: "blog.html", section: "main" },
            { title: "Market Analysis Articles", category: "Blog", page: "blog.html", section: "analysis" },
            { title: "Industry Expert Opinions", category: "Blog", page: "blog.html", section: "expert" }
        ];
    }

    // Setup search UI
    setupSearchUI() {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.openSearchModal());
        }

        // Keyboard shortcut Ctrl+K for search
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.openSearchModal();
            }
        });
    }

    // Open search modal
    openSearchModal() {
        if (document.querySelector('.search-modal')) return;

        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search"></i>
                        <input type="text" id="liveSearch" placeholder="Search BizzShort... (Ctrl+K)" autofocus>
                        <button class="search-close" onclick="this.closest('.search-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="search-tips">
                        <span>Quick tips:</span>
                        <span class="tip">Try "markets", "analytics", "advertise"</span>
                    </div>
                </div>
                <div class="search-results-container">
                    <div class="search-categories">
                        <button class="category-filter active" data-category="all">All</button>
                        <button class="category-filter" data-category="Markets">Markets</button>
                        <button class="category-filter" data-category="Startups">Startups</button>
                        <button class="category-filter" data-category="Analytics">Analytics</button>
                        <button class="category-filter" data-category="Advertise">Advertise</button>
                    </div>
                    <div class="search-results" id="searchResults">
                        <div class="no-search">
                            <i class="fas fa-search"></i>
                            <p>Start typing to search...</p>
                        </div>
                    </div>
                </div>
                <div class="search-footer">
                    <div class="keyboard-shortcuts">
                        <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                        <span><kbd>Enter</kbd> Select</span>
                        <span><kbd>Esc</kbd> Close</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup event listeners
        const searchInput = modal.querySelector('#liveSearch');
        const resultsContainer = modal.querySelector('#searchResults');
        const categoryFilters = modal.querySelectorAll('.category-filter');

        let currentCategory = 'all';

        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value, currentCategory, resultsContainer);
        });

        categoryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                categoryFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                currentCategory = filter.dataset.category;
                this.performSearch(searchInput.value, currentCategory, resultsContainer);
            });
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
    }

    // Perform search
    performSearch(query, category, container) {
        if (!query.trim()) {
            container.innerHTML = `
                <div class="no-search">
                    <i class="fas fa-search"></i>
                    <p>Start typing to search...</p>
                </div>
            `;
            return;
        }

        const searchQuery = query.toLowerCase();
        let results = this.searchData.filter(item => {
            const matchesQuery = item.title.toLowerCase().includes(searchQuery) ||
                                item.category.toLowerCase().includes(searchQuery);
            const matchesCategory = category === 'all' || item.category === category;
            return matchesQuery && matchesCategory;
        });

        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-inbox"></i>
                    <p>No results found for "${query}"</p>
                    <small>Try different keywords or browse categories</small>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => `
            <a href="${result.page}#${result.section}" class="search-result-item" onclick="document.querySelector('.search-modal').remove()">
                <div class="result-icon">
                    <i class="fas ${this.getCategoryIcon(result.category)}"></i>
                </div>
                <div class="result-content">
                    <h4>${this.highlightMatch(result.title, searchQuery)}</h4>
                    <p>${result.category} • ${result.page.replace('.html', '')}</p>
                </div>
                <div class="result-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
            </a>
        `).join('');

        container.innerHTML = `
            <div class="results-header">
                <span>Found ${results.length} result${results.length !== 1 ? 's' : ''}</span>
            </div>
            ${resultsHTML}
        `;
    }

    // Highlight matching text
    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Get category icon
    getCategoryIcon(category) {
        const icons = {
            'Markets': 'fa-chart-line',
            'Startups': 'fa-rocket',
            'Finance': 'fa-coins',
            'Tech': 'fa-microchip',
            'Energy': 'fa-bolt',
            'Analytics': 'fa-chart-bar',
            'Advertise': 'fa-ad',
            'Company': 'fa-building',
            'Contact': 'fa-envelope',
            'Blog': 'fa-newspaper'
        };
        return icons[category] || 'fa-file-alt';
    }
}

// Initialize search engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.searchEngine = new SearchEngine();
    console.log('BizzShort Search Engine initialized');
});