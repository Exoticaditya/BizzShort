// BizzShort Website - Interactive JavaScript

// Mobile menu functionality
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn i');
    
    navLinks.classList.toggle('active');
    
    // Change icon
    if (navLinks.classList.contains('active')) {
        mobileMenuBtn.className = 'fas fa-times';
    } else {
        mobileMenuBtn.className = 'fas fa-bars';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle (updated for both structures)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (this.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    if (index === 0) span.style.transform = 'none';
                    if (index === 1) span.style.opacity = '1';
                    if (index === 2) span.style.transform = 'none';
                }
            });
        });
        
        // Close mobile menu when clicking on navigation links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                // Reset hamburger menu
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
    
    // Tab functionality for news categories
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simulate successful subscription
                alert('Thank you for subscribing to BizzShort newsletter!');
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Auto-refresh news ticker (simulate real-time updates)
    function refreshNewsTicker() {
        const headlines = [
            "Sensex gains 800 points as banking stocks rally",
            "RBI announces new digital banking guidelines",
            "Indian startups raise record $12B in Q4 2025",
            "Export growth crosses $450B mark this fiscal",
            "Tech IPOs expected to dominate 2026 market"
        ];
        
        const tickerElement = document.querySelector('.news-ticker');
        if (tickerElement) {
            const randomHeadline = headlines[Math.floor(Math.random() * headlines.length)];
            tickerElement.textContent = randomHeadline;
        }
    }
    
    // Refresh ticker every 30 seconds
    setInterval(refreshNewsTicker, 30000);
    
    // Load more articles functionality
    const loadMoreBtns = document.querySelectorAll('.load-more-btn');
    loadMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = 'Loading...';
            
            // Simulate loading
            setTimeout(() => {
                this.textContent = 'Load More Articles';
                // Here you would typically load more content via AJAX
                alert('More articles would be loaded here in a real implementation');
            }, 1000);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    // Simulate search
                    alert(`Searching for: "${query}"`);
                    // Here you would typically perform the actual search
                }
            }
        });
    }
    
    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Social media share functionality
    const shareButtons = document.querySelectorAll('.social-share a');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').classList[1].split('-')[1];
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                default:
                    return;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
    
    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #1e3c72;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.opacity = '0';
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #1e3c72, #2a5298);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
});
                
                // Reset hamburger menu
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    if (index === 0) span.style.transform = 'none';
                    if (index === 1) span.style.opacity = '1';
                    if (index === 2) span.style.transform = 'none';
                });
            
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Search Functionality (if search box exists)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', query);
        });
    }

    // Article Card Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe article cards and other elements for animation
    const animatedElements = document.querySelectorAll('.article-card, .trending-item, .update-item, .sidebar-widget');
    animatedElements.forEach(el => observer.observe(el));

    // Header Scroll Effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header-main');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Add shadow to header when scrolling
        if (scrollTop > 0) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    // Social Share Functionality
    const socialShareLinks = document.querySelectorAll('.social-share a');
    socialShareLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            if (platform.includes('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            } else if (platform.includes('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
            } else if (platform.includes('linkedin')) {
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            }
            
            if (shareUrl) {
                window.open(shareUrl, 'share', 'width=600,height=400,scrollbars=yes,resizable=yes');
            }
        });
    });

    // Dark Mode Toggle (if implemented)
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
        });
        
        // Load saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Image Lazy Loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));

    // Comment System (Basic)
    const commentForms = document.querySelectorAll('.comment-form');
    commentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const comment = this.querySelector('textarea[name="comment"]').value;
            
            if (name && email && comment && validateEmail(email)) {
                // Simulate comment submission
                showNotification('Thank you for your comment! It will be reviewed shortly.', 'success');
                this.reset();
            } else {
                showNotification('Please fill in all fields with valid information.', 'error');
            }
        });
    });

    // Search Suggestions
    const searchSuggestions = [
        'Manufacturing Excellence',
        'Industrial Innovation',
        'Technology Trends',
        'Industry Analysis',
        'Business Growth',
        'Sustainability',
        'Automation',
        'Quality Control',
        'Market Research',
        'Company Interviews'
    ];

    function createSearchSuggestions(input) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        input.parentNode.appendChild(suggestionsContainer);
        
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const filtered = searchSuggestions.filter(suggestion => 
                suggestion.toLowerCase().includes(query)
            );
            
            suggestionsContainer.innerHTML = '';
            
            if (query && filtered.length > 0) {
                filtered.forEach(suggestion => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    item.textContent = suggestion;
                    item.addEventListener('click', function() {
                        input.value = suggestion;
                        suggestionsContainer.innerHTML = '';
                    });
                    suggestionsContainer.appendChild(item);
                });
            }
        });
    }

    // Reading Progress Bar
    function createReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Initialize reading progress if on article page
    if (document.querySelector('.article-content')) {
        createReadingProgress();
    }

    // Print Article Function
    function printArticle() {
        window.print();
    }

    // Add print buttons to articles
    const printBtns = document.querySelectorAll('.print-btn');
    printBtns.forEach(btn => {
        btn.addEventListener('click', printArticle);
    });

    // Cookie Consent (if needed)
    function showCookieConsent() {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            const cookieBanner = document.createElement('div');
            cookieBanner.className = 'cookie-consent';
            cookieBanner.innerHTML = `
                <div class="cookie-content">
                    <p>We use cookies to enhance your browsing experience. By continuing to use this site, you agree to our use of cookies.</p>
                    <button class="accept-cookies">Accept</button>
                </div>
            `;
            document.body.appendChild(cookieBanner);
            
            cookieBanner.querySelector('.accept-cookies').addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'true');
                cookieBanner.remove();
            });
        }
    }

    // Show cookie consent
    setTimeout(showCookieConsent, 2000);

    // Performance Monitoring
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    });


// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

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
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

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

// Initialize Analytics (if needed)
function initAnalytics() {
    // Google Analytics or other tracking code would go here
    console.log('Analytics initialized');
}

// Initialize the site
document.addEventListener('DOMContentLoaded', initAnalytics);