// Lazy Loading Implementation for BizzShort
// Improves initial page load performance by loading images only when needed

class LazyLoader {
    constructor() {
        this.images = [];
        this.observer = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // Check for IntersectionObserver support
        if ('IntersectionObserver' in window) {
            this.setupObserver();
            this.observeImages();
        } else {
            // Fallback for older browsers - load all images immediately
            this.loadAllImages();
        }
        
        this.initialized = true;
    }

    setupObserver() {
        const options = {
            root: null, // viewport
            rootMargin: '50px', // start loading 50px before image enters viewport
            threshold: 0.01 // trigger when 1% of image is visible
        };

        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeImages() {
        // Find all images with data-src attribute
        this.images = document.querySelectorAll('img[data-src]');
        
        this.images.forEach(img => {
            this.observer.observe(img);
        });

        // Also handle dynamically added images
        this.observeDynamicImages();
    }

    observeDynamicImages() {
        const config = { childList: true, subtree: true };
        
        const callback = (mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'IMG' && node.hasAttribute('data-src')) {
                        this.observer.observe(node);
                    } else if (node.querySelectorAll) {
                        const imgs = node.querySelectorAll('img[data-src]');
                        imgs.forEach(img => this.observer.observe(img));
                    }
                });
            });
        };
        
        const mutationObserver = new MutationObserver(callback);
        mutationObserver.observe(document.body, config);
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Show loading state
        img.style.opacity = '0.5';
        
        // Create a new image to preload
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.3s ease';
            img.classList.add('lazy-loaded');
        };
        
        tempImg.onerror = () => {
            // Use fallback image on error
            img.src = 'https://placehold.co/400x300/2c3e50/ffffff?text=Image+Not+Found';
            img.removeAttribute('data-src');
            img.style.opacity = '1';
        };
        
        tempImg.src = src;
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }

    // Convert existing images to lazy loading
    convertExistingImages() {
        const images = document.querySelectorAll('img:not([data-src]):not(.no-lazy)');
        let converted = 0;
        
        images.forEach(img => {
            const src = img.getAttribute('src');
            // Skip small images, logos, and images above the fold
            const rect = img.getBoundingClientRect();
            const isAboveFold = rect.top < window.innerHeight;
            
            if (src && !isAboveFold && !img.complete) {
                img.setAttribute('data-src', src);
                img.removeAttribute('src');
                img.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E');
                this.observer.observe(img);
                converted++;
            }
        });
        
        // Images converted to lazy loading
    }

    // Preload critical images
    preloadCritical(selectors = ['.logo-img', '.hero-image', '.featured-image']) {
        selectors.forEach(selector => {
            const imgs = document.querySelectorAll(selector);
            imgs.forEach(img => {
                const src = img.getAttribute('data-src') || img.getAttribute('src');
                if (src && !img.complete) {
                    const preloadImg = new Image();
                    preloadImg.src = src;
                }
            });
        });
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const lazyLoader = new LazyLoader();
    lazyLoader.init();
    
    // Preload critical images immediately
    lazyLoader.preloadCritical();
    
    // Convert existing images after a short delay
    setTimeout(() => {
        lazyLoader.convertExistingImages();
    }, 100);
});

// Reload images if content is dynamically added
window.addEventListener('contentLoaded', () => {
    const lazyLoader = new LazyLoader();
    lazyLoader.observeImages();
});
