// Blog Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const articles = document.querySelectorAll('.blog-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter articles with animation
            articles.forEach(article => {
                article.style.opacity = '0';
                article.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    if (category === 'all' || article.dataset.category === category) {
                        article.style.display = 'block';
                        setTimeout(() => {
                            article.style.opacity = '1';
                            article.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        article.style.display = 'none';
                    }
                }, 200);
            });
        });
    });
    
    // Search Functionality
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search as user types
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                filterArticlesBySearch(query);
            } else if (query.length === 0) {
                showAllArticles();
            }
        }, 300));
    }
    
    function performSearch() {
        const query = searchInput.value.toLowerCase();
        if (query.trim()) {
            filterArticlesBySearch(query);
        }
    }
    
    function filterArticlesBySearch(query) {
        articles.forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const content = article.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || content.includes(query)) {
                article.style.display = 'block';
                highlightSearchTerms(article, query);
            } else {
                article.style.display = 'none';
            }
        });
    }
    
    function showAllArticles() {
        articles.forEach(article => {
            article.style.display = 'block';
            removeHighlights(article);
        });
    }
    
    function highlightSearchTerms(article, query) {
        // Simple highlighting - could be enhanced
        const title = article.querySelector('h3');
        const titleText = title.textContent;
        const highlightedTitle = titleText.replace(
            new RegExp(query, 'gi'),
            '<mark>$&</mark>'
        );
        title.innerHTML = highlightedTitle;
    }
    
    function removeHighlights(article) {
        const marks = article.querySelectorAll('mark');
        marks.forEach(mark => {
            mark.outerHTML = mark.innerHTML;
        });
    }
    
    // Load More Functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more articles
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                loadMoreArticles();
                this.innerHTML = '<i class="fas fa-plus"></i> Load More Articles';
                this.disabled = false;
            }, 1500);
        });
    }
    
    function loadMoreArticles() {
        // Simulate adding more articles
        const articlesGrid = document.getElementById('articlesGrid');
        const newArticles = generateNewArticles(3);
        
        newArticles.forEach((articleHTML, index) => {
            const articleElement = document.createElement('div');
            articleElement.innerHTML = articleHTML;
            const article = articleElement.firstElementChild;
            
            // Add animation
            article.style.opacity = '0';
            article.style.transform = 'translateY(30px)';
            articlesGrid.appendChild(article);
            
            setTimeout(() => {
                article.style.transition = 'all 0.6s ease';
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        showNotification('3 new articles loaded!', 'success');
    }
    
    function generateNewArticles(count) {
        const sampleArticles = [
            {
                category: 'technology',
                categoryClass: '',
                title: 'Machine Learning in Manufacturing Quality Control',
                excerpt: 'Exploring how ML algorithms are improving defect detection and quality assurance...',
                date: 'Nov 19, 2025',
                readTime: '8 min read',
                image: 'assets/images/blog-ml.jpg'
            },
            {
                category: 'sustainability',
                categoryClass: 'sustainability',
                title: 'Circular Economy Principles in Industrial Design',
                excerpt: 'How manufacturers are adopting circular economy models for sustainable growth...',
                date: 'Nov 18, 2025',
                readTime: '10 min read',
                image: 'assets/images/blog-circular.jpg'
            },
            {
                category: 'innovation',
                categoryClass: 'innovation',
                title: 'Robotics Revolution in Assembly Lines',
                excerpt: 'Advanced robotics systems transforming traditional assembly processes...',
                date: 'Nov 17, 2025',
                readTime: '7 min read',
                image: 'assets/images/blog-robotics.jpg'
            }
        ];
        
        return sampleArticles.slice(0, count).map(article => `
            <article class="blog-card" data-category="${article.category}">
                <div class="blog-image">
                    <img src="${article.image}" alt="${article.title}">
                    <span class="category-badge ${article.categoryClass}">${article.category.charAt(0).toUpperCase() + article.category.slice(1)}</span>
                </div>
                <div class="blog-content-area">
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <div class="blog-meta">
                        <span><i class="far fa-calendar"></i> ${article.date}</span>
                        <span><i class="far fa-clock"></i> ${article.readTime}</span>
                    </div>
                    <a href="article.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `);
    }
    
    // Tag Cloud Interaction
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.toLowerCase();
            searchInput.value = tagText;
            filterArticlesBySearch(tagText);
            
            // Scroll to articles
            document.querySelector('.articles-grid').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Popular Posts Click Tracking
    const popularPosts = document.querySelectorAll('.popular-post');
    popularPosts.forEach(post => {
        post.addEventListener('click', function() {
            // Analytics tracking could go here
            // Track popular post click
            const postTitle = this.querySelector('h4').textContent;
        });
    });
    
    // Infinite Scroll (Optional)
    let isLoading = false;
    window.addEventListener('scroll', function() {
        if (isLoading) return;
        
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.offsetHeight;
        
        if (scrollPosition >= documentHeight - 1000) {
            isLoading = true;
            setTimeout(() => {
                if (loadMoreBtn && loadMoreBtn.style.display !== 'none') {
                    loadMoreBtn.click();
                }
                isLoading = false;
            }, 1000);
        }
    });
    
    // Reading Progress for Featured Article
    const featuredArticle = document.querySelector('.featured-article');
    if (featuredArticle) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-featured';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #ff6b6b, #ffa726);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const articleRect = featuredArticle.getBoundingClientRect();
            const articleHeight = featuredArticle.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (articleRect.top <= 0 && articleRect.bottom >= 0) {
                const scrolled = Math.abs(articleRect.top) / (articleHeight - windowHeight);
                const progress = Math.min(scrolled * 100, 100);
                progressBar.style.width = progress + '%';
            }
        });
    }
    
    // Article Cards Animation on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initial setup for animation
    articles.forEach((article, index) => {
        article.style.opacity = '0';
        article.style.transform = 'translateY(30px)';
        article.style.transition = 'all 0.6s ease';
        article.style.transitionDelay = `${index * 0.1}s`;
        cardObserver.observe(article);
    });
    
});

document.addEventListener('DOMContentLoaded', async function() {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;
    const body = document.body;
    function normalizeYouTubeHandle(v) {
        const s = (v || '').trim();
        if (s.includes('youtube.com/@')) {
            const at = s.indexOf('@');
            let h = s.slice(at + 1);
            const q = h.indexOf('?');
            if (q >= 0) h = h.slice(0, q);
            return h;
        }
        return s.replace('@', '');
    }
    function normalizeInstagramUser(v) {
        const s = (v || '').trim();
        if (s.includes('instagram.com/')) {
            let h = s.split('instagram.com/')[1];
            const q = h.indexOf('?');
            if (q >= 0) h = h.slice(0, q);
            return h.replace('/', '') || 'bizz_short';
        }
        return s || 'bizz_short';
    }
    const ytHandle = normalizeYouTubeHandle(body.getAttribute('data-youtube-handle') || '@bizz_short');
    const igUser = normalizeInstagramUser(body.getAttribute('data-instagram-username') || 'bizz_short');
    let ytItems = [];
    const cid = await window.resolveYouTubeChannelId(ytHandle);
    const ytCacheKey = `media_youtube_${ytHandle}`;
    const igCacheKey = `media_instagram_${igUser}`;
    ytItems = window.getCache ? (window.getCache(ytCacheKey, 10 * 60 * 1000) || []) : [];
    if (cid && ytItems.length === 0) {
        ytItems = await window.fetchYouTubeRSS(cid, 8);
        if (ytItems.length && window.setCache) window.setCache(ytCacheKey, ytItems);
    }
    let igItems = window.getCache ? (window.getCache(igCacheKey, 10 * 60 * 1000) || []) : [];
    if (igItems.length === 0) {
        igItems = await window.fetchInstagramMedia(igUser, 8);
        if (igItems.length && window.setCache) window.setCache(igCacheKey, igItems);
    }
    const items = [...ytItems, ...igItems].sort((a, b) => new Date(b.published) - new Date(a.published));
    if (items.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'loading-placeholder';
        placeholder.innerHTML = '<i class="fas fa-info-circle"></i><p>Latest reels/videos could not be loaded. Showing existing articles.</p>';
        grid.appendChild(placeholder);
        return;
    }
    grid.innerHTML = '';
    items.forEach(i => grid.appendChild(window.buildArticleCard(i)));
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
    // Show skeletons while loading
    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const sk = document.createElement('div');
        sk.className = 'skeleton-card';
        sk.innerHTML = '<div class="skeleton-thumb"></div><div class="skeleton-title"></div><div class="skeleton-text"></div>';
        grid.appendChild(sk);
    }
