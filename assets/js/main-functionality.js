// ============================================
// SMOOTH SCROLL TO SECTIONS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80; // Account for sticky navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navbar item
                updateActiveNavItem(this);
            }
        });
    });
    
    // Update active state on scroll
    window.addEventListener('scroll', debounce(updateNavOnScroll, 100));
});

// ============================================
// NEWS FILTERING FUNCTIONALITY
// ============================================
function filterNews(category) {
    const newsCards = document.querySelectorAll('.news-card-large');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Update active tab
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category || 
            (category === 'all' && btn.textContent.toLowerCase() === 'all')) {
            btn.classList.add('active');
        }
    });
    
    // Filter news cards with animation
    newsCards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            // Stagger animation
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    card.style.transition = 'all 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }, index * 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav ul');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    nav.classList.toggle('mobile-active');
    toggle.classList.toggle('active');
}

// ============================================
// UPDATE ACTIVE NAV ITEM
// ============================================
function updateActiveNavItem(clickedElement) {
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.remove('active');
    });
    clickedElement.classList.add('active');
}

// ============================================
// UPDATE NAV ON SCROLL
// ============================================
function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.main-nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// DEBOUNCE UTILITY
// ============================================
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

// ============================================
// CARD HOVER EFFECTS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.news-card, .news-card-large, .interview-card, .event-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar-section');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
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
});

// ============================================
// ANIMATE ON SCROLL
// ============================================
function animateOnScroll() {
    const elements = document.querySelectorAll('.news-card, .interview-card, .event-card, .analysis-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ============================================
// SEARCH FUNCTIONALITY (if search box exists)
// ============================================
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const allCards = document.querySelectorAll('.news-card, .news-card-large, .interview-card');
        
        allCards.forEach(card => {
            const title = card.querySelector('h3, h4').textContent.toLowerCase();
            const description = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }, 300));
}

// Initialize search if search box exists
document.addEventListener('DOMContentLoaded', initializeSearch);

// ============================================
// SHARE FUNCTIONALITY
// ============================================
function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// ============================================
// READING PROGRESS BAR
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
});

console.log('✅ BizzShort - All frontend functionality loaded successfully');
