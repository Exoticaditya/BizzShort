// Article Detail Page JavaScript
// Handles interactions and functionality on article detail pages

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(location.search);
    const title = params.get('title') || '';
    const thumb = params.get('thumb') || '';
    const url = params.get('url') || '';
    const source = params.get('source') || '';
    const category = params.get('category') || '';
    const published = params.get('published') || '';
    const excerpt = params.get('excerpt') || '';
    const titleEl = document.querySelector('.article-title');
    const catEl = document.querySelector('.article-category');
    const imgEl = document.querySelector('.featured-image img');
    const leadEl = document.querySelector('.lead-paragraph');
    const dateEl = document.querySelector('.publish-date');
    if (titleEl && title) titleEl.textContent = title;
    if (catEl) {
        const cat = category || 'business';
        catEl.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        catEl.className = `article-category ${cat}`;
    }
    if (imgEl) {
        if (thumb) imgEl.src = thumb;
        imgEl.style.cursor = 'pointer';
        const container = document.querySelector('.featured-image');
        function embedYouTube(u) {
            const idMatch = u.match(/(?:v=|\/shorts\/|youtu\.be\/|\/watch\?v=|\/embed\/)([\w-]{11})/);
            const vid = idMatch ? idMatch[1] : null;
            if (!vid) return false;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${vid}?rel=0&autoplay=1`; 
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            const player = document.createElement('div');
            player.className = 'video-player';
            player.appendChild(iframe);
            container.innerHTML = '';
            container.appendChild(player);
            return true;
        }
        function embedInstagram(u) {
            const iframe = document.createElement('iframe');
            const embedUrl = u.endsWith('/') ? `${u}embed` : `${u}/embed`;
            iframe.src = embedUrl;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.frameBorder = '0';
            const player = document.createElement('div');
            player.className = 'video-player';
            player.appendChild(iframe);
            container.innerHTML = '';
            container.appendChild(player);
        }
        function playInline() {
            if (!url) return;
            if (source === 'youtube') {
                if (!embedYouTube(url)) window.open(url, '_blank');
            } else if (source === 'instagram') {
                embedInstagram(url);
            } else {
                window.open(url, '_blank');
            }
        }
        container.addEventListener('click', playInline);
        // Auto-embed if video URL exists
        if (url && (source === 'youtube' || source === 'instagram')) {
            // Show play button overlay initially
            const overlay = container.querySelector('.play-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }
        }
    }
    if (leadEl && excerpt) leadEl.textContent = excerpt;
    if (dateEl && published) dateEl.innerHTML = `<i class="far fa-clock"></i> ${new Date(published).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    // Smooth scroll for anchor links
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

    // Social share functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList[1]; // facebook, twitter, linkedin, whatsapp
            const shareTarget = encodeURIComponent(url || window.location.href);
            const title = encodeURIComponent(document.querySelector('.article-title').textContent);
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareTarget}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${shareTarget}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareTarget}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title}%20${shareTarget}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Show success message
            alert('Thank you for subscribing! We\'ll send the latest news to ' + email);
            this.reset();
        });
    }

    // Related card click tracking
    const relatedCards = document.querySelectorAll('.related-card');
    relatedCards.forEach(card => {
        card.addEventListener('click', function() {
            // In production, this would track analytics
            console.log('Related article clicked');
        });
    });

    // Trending item click tracking
    const trendingItems = document.querySelectorAll('.trending-item');
    trendingItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // In production, this would navigate to the article
            console.log('Trending article clicked');
        });
    });

    // Read progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #e74c3c 0%, #f39c12 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    });

    // Copy link functionality
    function copyLinkToClipboard() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(function() {
            showNotification('Link copied to clipboard!');
        });
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Lazy load images
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

    console.log('Article detail page initialized');
});
