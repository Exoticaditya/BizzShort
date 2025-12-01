// Enhanced Features for BizzShort
// Scroll to top, reading progress, dark mode, and more

class EnhancedFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.createScrollToTop();
        this.createReadingProgress();
        this.initSmoothScroll();
        this.initLazyLoading();
        console.log('BizzShort Enhanced Features initialized');
    }

    // Scroll to Top Button
    createScrollToTop() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.setAttribute('aria-label', 'Scroll to top');
        button.setAttribute('data-tooltip', 'Back to top');
        
        document.body.appendChild(button);

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });

        // Scroll to top on click
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Reading Progress Bar
    createReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.width = '0%';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }

    // Smooth Scroll for Anchor Links
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Lazy Loading for Images
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Show Notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Copy to Clipboard functionality
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = element.innerHTML;
        element.innerHTML = '<i class="fas fa-check"></i> Copied!';
        element.style.background = '#28a745';
        
        setTimeout(() => {
            element.innerHTML = originalHTML;
            element.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Share functionality
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url || window.location.href
        }).then(() => {
            console.log('Content shared successfully');
        }).catch(err => {
            console.log('Error sharing:', err);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        copyToClipboard(url || window.location.href, event.target);
    }
}

// Print Page
function printPage() {
    window.print();
}

// Initialize Enhanced Features
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedFeatures = new EnhancedFeatures();
});

// Performance Monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Send analytics (local only)
    if (window.localStorage) {
        const analytics = JSON.parse(localStorage.getItem('pageAnalytics') || '{}');
        analytics.lastVisit = new Date().toISOString();
        analytics.totalVisits = (analytics.totalVisits || 0) + 1;
        analytics.loadTime = loadTime;
        localStorage.setItem('pageAnalytics', JSON.stringify(analytics));
    }
});