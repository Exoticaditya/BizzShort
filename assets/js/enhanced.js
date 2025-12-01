// BizzShort - Advanced Features & Enhancements

class BizzShortApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollReveal();
        this.setupLazyLoading();
        this.setupSmoothScroll();
        this.setupProgressBar();
        this.setupSearchEnhancement();
        this.setupNotifications();
        this.setupImageOptimization();
        this.setupPerformanceTracking();
    }

    // Scroll Reveal Animation
    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal, .blog-card, .news-card, article');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            revealObserver.observe(el);
        });
    }

    // Enhanced Lazy Loading
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src || img.src;
                    
                    if (img.dataset.src) {
                        img.src = src;
                        img.classList.add('loaded');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Smooth Scroll Enhancement
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Reading Progress Bar
    setupProgressBar() {
        let progressBar = document.querySelector('.progress-bar');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            document.body.appendChild(progressBar);
        }

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Enhanced Search with Debounce
    setupSearchEnhancement() {
        const searchInputs = document.querySelectorAll('input[type="search"], .search-input input');
        
        searchInputs.forEach(input => {
            let searchTimeout;
            
            input.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        this.performSearch(query);
                    }, 300);
                }
            });
        });
    }

    performSearch(query) {
        const articles = document.querySelectorAll('.blog-card, .news-card, article');
        let foundCount = 0;
        
        articles.forEach(article => {
            const title = article.querySelector('h2, h3, h4')?.textContent.toLowerCase() || '';
            const content = article.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (title.includes(query.toLowerCase()) || content.includes(query.toLowerCase())) {
                article.style.display = 'block';
                article.classList.add('animate-fade-in');
                foundCount++;
            } else {
                article.style.display = 'none';
            }
        });

        this.showNotification(`Found ${foundCount} results for "${query}"`, 'info');
    }

    // Notification System
    setupNotifications() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.className = 'toast-container';
        this.toastContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(this.toastContainer);
    }

    showNotification(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <span style="font-size: 20px;">${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;
        
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Image Optimization
    setupImageOptimization() {
        document.querySelectorAll('img').forEach(img => {
            img.onerror = function() {
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage Not Available%3C/text%3E%3C/svg%3E';
                this.style.objectFit = 'cover';
            };
        });
    }

    // Performance Tracking
    setupPerformanceTracking() {
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 3000) {
                        console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
                    }
                });
            });

            perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
        }

        // Page Load Time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            if (loadTime > 3000) {
                console.warn(`Page load time: ${loadTime}ms - Consider optimization`);
            }
        });
    }
}

// Advanced Form Validation
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
                return false;
            }
        });

        // Real-time validation
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateForm() {
        let isValid = true;
        this.form.querySelectorAll('input[required], textarea[required]').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';

        // Required check
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Min length check
        if (input.hasAttribute('minlength')) {
            const minLength = parseInt(input.getAttribute('minlength'));
            if (value.length < minLength) {
                isValid = false;
                errorMessage = `Minimum ${minLength} characters required`;
            }
        }

        if (!isValid) {
            this.showError(input, errorMessage);
        } else {
            this.clearError(input);
        }

        return isValid;
    }

    showError(input, message) {
        this.clearError(input);
        
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #EF4444; font-size: 12px; margin-top: 4px;';
        errorDiv.textContent = message;
        
        input.parentElement.appendChild(errorDiv);
    }

    clearError(input) {
        input.classList.remove('error');
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

// Local Storage Manager
class StorageManager {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }

    static get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    const app = new BizzShortApp();
    
    // Initialize form validators
    new FormValidator('.newsletter-form');
    new FormValidator('.contact-form');
    
    // Add card interactions
    document.querySelectorAll('.blog-card, .news-card, .event-card').forEach(card => {
        card.classList.add('card-interactive', 'hover-lift');
    });
    
    // Add button ripple effects
    document.querySelectorAll('button, .btn, .cta-button').forEach(btn => {
        btn.classList.add('btn-ripple');
    });
    
    // Stagger animations for grid items
    document.querySelectorAll('.content-grid > *, .news-grid > *').forEach((item, index) => {
        item.classList.add('stagger-item');
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    console.log('BizzShort Enhanced Features Loaded Successfully! 🚀');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BizzShortApp, FormValidator, StorageManager };
}
