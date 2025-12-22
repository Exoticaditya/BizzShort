// ============================================
// SMOOTH SCROLL TO SECTIONS
// ============================================
document.addEventListener('DOMContentLoaded', function () {
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
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.news-card, .news-card-large, .interview-card, .event-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
window.addEventListener('scroll', function () {
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
document.addEventListener('DOMContentLoaded', function () {
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

// =============================
// Integrated Media Loader
// =============================
async function resolveYouTubeChannelId(handle) {
    try {
        const h = handle.replace('@', '').trim();
        const res = await fetch(`https://r.jina.ai/http://www.youtube.com/@${h}`);
        const text = await res.text();
        const m = text.match(/"channelId":"(UC[\w-]+)"/);
        return m ? m[1] : null;
    } catch (_) {
        return null;
    }
}

async function fetchYouTubeRSS(channelId, limit = 6) {
    try {
        const res = await fetch(`https://r.jina.ai/http://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        const xml = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        const entries = Array.from(doc.getElementsByTagName('entry')).slice(0, limit);
        return entries.map(e => {
            const title = e.getElementsByTagName('title')[0]?.textContent || '';
            const link = e.getElementsByTagName('link')[0]?.getAttribute('href') || '';
            const published = e.getElementsByTagName('published')[0]?.textContent || '';

            // Extract Video ID to ensure high quality thumbnail
            let videoId = '';
            const ytVideoIdNode = e.getElementsByTagName('yt:videoId')[0];
            if (ytVideoIdNode) {
                videoId = ytVideoIdNode.textContent;
            } else {
                const urlMatch = link.match(/[?&]v=([^&]+)/);
                if (urlMatch) videoId = urlMatch[1];
            }

            let thumb = '';
            if (videoId) {
                thumb = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Standard quality
            } else {
                const mt = e.getElementsByTagName('media:thumbnail')[0] || e.getElementsByTagName('thumbnail')[0];
                if (mt) thumb = mt.getAttribute('url') || '';
            }

            let desc = '';
            const mg = e.getElementsByTagName('media:group')[0];
            if (mg) {
                const md = mg.getElementsByTagName('media:description')[0] || mg.getElementsByTagName('description')[0];
                if (md) desc = md.textContent || '';
            }
            const excerpt = buildExcerpt(desc || title);
            const category = chooseCategory(`${title} ${desc}`);
            return { source: 'youtube', title, url: link, thumbnail: thumb, published, excerpt, category };
        });
    } catch (_) {
        return [];
    }
}

function getCache(key, ttlMs) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const obj = JSON.parse(raw);
        if (!obj || typeof obj !== 'object') return null;
        if (Date.now() - obj.t > ttlMs) return null;
        return obj.v;
    } catch (_) { return null; }
}

function setCache(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value }));
    } catch (_) { }
}

function decodeInstagramString(s) {
    try {
        return s.replace(/\\u0026/g, '&').replace(/\\\//g, '/');
    } catch (_) {
        return s;
    }
}

async function fetchInstagramMedia(username, limit = 6) {
    try {
        const u = username.trim();
        const res = await fetch(`https://r.jina.ai/http://www.instagram.com/${u}/`);
        const text = await res.text();
        const items = [];
        const re = /"shortcode":"([^"]+)"[\s\S]*?"display_url":"([^"]+)"[\s\S]*?"is_video":(true|false)[\s\S]*?"taken_at_timestamp":(\d+)/g;
        let m;
        while ((m = re.exec(text)) && items.length < limit) {
            const shortcode = m[1];
            const displayUrl = decodeInstagramString(m[2]);
            const isVideo = m[3] === 'true';
            const ts = Number(m[4]) * 1000;
            const url = `https://www.instagram.com/p/${shortcode}/`;
            const titleMatch = new RegExp(`"shortcode":"${shortcode}"[\s\S]*?"edge_media_to_caption":\{\"edges\":\[\{\"node\":\{\"text\":\"([\s\S]*?)\"`).exec(text);
            const caption = titleMatch ? decodeInstagramString(titleMatch[1]) : '';
            const title = caption ? caption.split('\n')[0].slice(0, 120) : 'Instagram Reel';
            const excerpt = buildExcerpt(caption || title);
            const category = chooseCategory(`${title} ${caption}`);
            items.push({ source: 'instagram', title, url, thumbnail: displayUrl, published: new Date(ts).toISOString(), excerpt, category, isVideo });
        }
        return items;
    } catch (_) {
        return [];
    }
}

function buildExcerpt(text, maxLen = 160) {
    const t = (text || '').trim().replace(/\s+/g, ' ');
    if (t.length <= maxLen) return t;
    const cut = t.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 50 ? cut.slice(0, lastSpace) : cut) + '…';
}

function chooseCategory(text) {
    const t = (text || '').toLowerCase();
    if (/(nifty|sensex|stock|market|indices|gdp|budget|inflation)/.test(t)) return 'markets';
    if (/(startup|funding|venture|unicorn|founder|entrepreneur)/.test(t)) return 'startups';
    if (/(technology|tech|ai|robot|software|data|cloud)/.test(t)) return 'technology';
    if (/(finance|bank|loan|investment|ipo|profit|revenue)/.test(t)) return 'finance';
    return 'business';
}

function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str || '').replace(/[&<>"']/g, s => map[s]);
}

function buildVideoCard(item) {
    const el = document.createElement('article');
    el.className = 'video-card';
    const thumb = item.thumbnail || 'assets/images/logo.jpeg';
    const articleUrl = `article-detail.html?title=${encodeURIComponent(item.title)}&thumb=${encodeURIComponent(thumb)}&url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&category=${encodeURIComponent(item.category)}&published=${encodeURIComponent(item.published)}&excerpt=${encodeURIComponent(item.excerpt)}`;
    el.innerHTML = `
        <a href="${articleUrl}" class="blog-card-link">
            <div class="video-thumbnail">
                <img src="${thumb}" alt="${escapeHtml(item.title)}">
                <div class="play-button"><i class="fas fa-play"></i></div>
                <span class="video-duration">${item.source === 'instagram' ? 'Reel' : 'Video'}</span>
                <span class="source-badge ${item.source}">${item.source === 'instagram' ? 'Instagram' : 'YouTube'}</span>
            </div>
        </a>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.excerpt)}</p>
    `;
    return el;
}

function buildNewsCardSmall(item) {
    const el = document.createElement('article');
    el.className = 'news-card';
    const cat = item.category || chooseCategory(`${item.title} ${item.excerpt}`);
    const thumb = item.thumbnail || 'assets/images/logo.jpeg';
    const articleUrl = `article-detail.html?title=${encodeURIComponent(item.title)}&thumb=${encodeURIComponent(thumb)}&url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&category=${encodeURIComponent(cat)}&published=${encodeURIComponent(item.published)}&excerpt=${encodeURIComponent(item.excerpt)}`;
    el.innerHTML = `
        <a href="${articleUrl}" class="blog-card-link">
            <img src="${thumb}" alt="${escapeHtml(item.title)}">
            <div class="news-card-content">
                <span class="news-category">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.excerpt)}</p>
                <div class="news-meta">
                    <span><i class="far fa-calendar"></i> ${new Date(item.published).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
        </a>
    `;
    return el;
}

function buildNewsItem(item) {
    const el = document.createElement('article');
    el.className = 'news-item';
    const cat = item.category || chooseCategory(`${item.title} ${item.excerpt}`);
    const thumb = item.thumbnail || 'assets/images/logo.jpeg';
    const articleUrl = `article-detail.html?title=${encodeURIComponent(item.title)}&thumb=${encodeURIComponent(thumb)}&url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&category=${encodeURIComponent(cat)}&published=${encodeURIComponent(item.published)}&excerpt=${encodeURIComponent(item.excerpt)}`;
    el.innerHTML = `
        <a href="${articleUrl}" class="blog-card-link">
            <img src="${thumb}" alt="${escapeHtml(item.title)}">
            <div class="news-item-content">
                <span class="news-badge">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.excerpt)}</p>
                <div class="news-item-meta">
                    <span><i class="far fa-calendar"></i> ${new Date(item.published).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
        </a>
    `;
    return el;
}

function buildArticleCard(item) {
    const el = document.createElement('article');
    const catClass = item.category === 'technology' ? 'technology' : item.category === 'markets' ? 'markets' : item.category === 'finance' ? 'finance' : item.category === 'startups' ? 'innovation' : '';
    el.className = 'blog-card';
    el.setAttribute('data-category', item.category);
    const thumb = item.thumbnail || 'assets/images/logo.jpeg';
    const url = `article-detail.html?title=${encodeURIComponent(item.title)}&thumb=${encodeURIComponent(thumb)}&url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&category=${encodeURIComponent(item.category)}&published=${encodeURIComponent(item.published)}&excerpt=${encodeURIComponent(item.excerpt)}`;
    el.innerHTML = `
        <a href="${url}" class="blog-card-link">
            <div class="blog-image">
                <img src="${thumb}" alt="${escapeHtml(item.title)}">
                <span class="category-badge ${catClass}">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                <span class="source-badge ${item.source}">${item.source === 'instagram' ? 'Instagram' : 'YouTube'}</span>
            </div>
            <div class="blog-content-area">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.excerpt)}</p>
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${new Date(item.published).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span><i class="far fa-clock"></i> 3 min read</span>
                </div>
            </div>
        </a>
    `;
    return el;
}

function buildNewsCardLarge(item) {
    const el = document.createElement('article');
    const cat = item.category || chooseCategory(`${item.title} ${item.excerpt}`);
    el.className = 'news-card-large';
    el.setAttribute('data-category', cat);
    const thumb = item.thumbnail || 'assets/images/logo.jpeg';
    const badgeClass = cat === 'technology' ? 'technology' : cat === 'markets' ? 'markets' : cat === 'finance' ? 'finance' : cat === 'startups' ? 'business' : 'business';
    const articleUrl = `article-detail.html?title=${encodeURIComponent(item.title)}&thumb=${encodeURIComponent(thumb)}&url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&category=${encodeURIComponent(cat)}&published=${encodeURIComponent(item.published)}&excerpt=${encodeURIComponent(item.excerpt)}`;
    el.innerHTML = `
        <a href="${articleUrl}" class="blog-card-link">
            <img src="${thumb}" alt="${escapeHtml(item.title)}">
            <div class="card-content">
                <span class="category-badge ${badgeClass}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.excerpt)}</p>
                <div class="card-footer">
                    <span class="time"><i class="far fa-calendar"></i> ${new Date(item.published).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span class="time"><i class="fab fa-${item.source === 'instagram' ? 'instagram' : 'youtube'}"></i> ${item.source === 'instagram' ? 'Instagram' : 'YouTube'}</span>
                </div>
            </div>
        </a>
    `;
    return el;
}

document.addEventListener('DOMContentLoaded', async function () {
    const videoGrid = document.querySelector('.video-section .video-grid');
    const latestGrid = document.querySelector('.latest-news-grid');
    const breakingStory = document.querySelector('.main-breaking-story');
    if (videoGrid || latestGrid || breakingStory) {
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
        if (videoGrid) {
            videoGrid.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const sk = document.createElement('div');
                sk.className = 'skeleton-card';
                sk.innerHTML = '<div class="skeleton-thumb"></div><div class="skeleton-title"></div><div class="skeleton-text"></div>';
                videoGrid.appendChild(sk);
            }
        }
        let ytItems = [];
        const cid = await resolveYouTubeChannelId(ytHandle);
        const ytCacheKey = `media_youtube_${ytHandle}`;
        const igCacheKey = `media_instagram_${igUser}`;
        ytItems = getCache(ytCacheKey, 10 * 60 * 1000) || [];
        if (cid && ytItems.length === 0) {
            ytItems = await fetchYouTubeRSS(cid, 6);
            if (ytItems.length) setCache(ytCacheKey, ytItems);
        }
        let igItems = getCache(igCacheKey, 10 * 60 * 1000) || [];
        if (igItems.length === 0) {
            igItems = await fetchInstagramMedia(igUser, 6);
            if (igItems.length) setCache(igCacheKey, igItems);
        }
        const items = [...ytItems, ...igItems].sort((a, b) => new Date(b.published) - new Date(a.published));
        // If no items from external APIs, keep static HTML content as fallback (don't show empty state)
        if (videoGrid) {
            videoGrid.innerHTML = '';
            items.slice(0, 6).forEach(i => videoGrid.appendChild(buildVideoCard(i)));
        }
        if (latestGrid) {
            // IMPORTANT: Don't clear the grid if we have no items - keep static HTML content as fallback
            if (items.length > 0) {
                latestGrid.innerHTML = '';
                items.slice(0, 8).forEach(i => latestGrid.appendChild(buildNewsCardLarge(i)));
            } else {
                console.warn('⚠️ No external content loaded - keeping static HTML content in Latest Updates section');
                // Static content in index.html will remain visible as fallback
            }
        }
        if (breakingStory) {
            const top = items[0];
            const img = breakingStory.querySelector('img');
            const h3 = breakingStory.querySelector('h3');
            const cat = breakingStory.querySelector('.story-category');
            if (img) img.src = top.thumbnail || 'assets/images/logo.jpeg';
            if (h3) h3.textContent = top.title;
            const finalCat = (top.category || chooseCategory(top.title));
            if (cat) cat.textContent = finalCat.charAt(0).toUpperCase() + finalCat.slice(1);
            const articleUrl = `article-detail.html?title=${encodeURIComponent(top.title)}&thumb=${encodeURIComponent(top.thumbnail || 'assets/images/logo.jpeg')}&url=${encodeURIComponent(top.url)}&source=${encodeURIComponent(top.source)}&category=${encodeURIComponent(finalCat)}&published=${encodeURIComponent(top.published)}&excerpt=${encodeURIComponent(top.excerpt)}`;
            breakingStory.style.cursor = 'pointer';
            breakingStory.onclick = () => { window.location.href = articleUrl; };
        }
        const breakingGrid = document.querySelector('.news-cards-grid');
        if (breakingGrid) {
            breakingGrid.innerHTML = '';
            items.slice(1, 4).forEach(i => breakingGrid.appendChild(buildNewsCardSmall(i)));
        }
        const newsGrid = document.querySelector('.news-grid');
        if (newsGrid) {
            newsGrid.innerHTML = '';
            items.slice(0, 4).forEach(i => newsGrid.appendChild(buildNewsItem(i)));
        }
        const interviewGrid = document.querySelector('.interview-grid');
        if (interviewGrid) {
            interviewGrid.innerHTML = '';
            items.slice(0, 2).forEach(i => interviewGrid.appendChild(buildArticleCard(i)));
        }
        const eventsGrid = document.querySelector('.events-grid');
        if (eventsGrid) {
            eventsGrid.innerHTML = '';
            items.slice(2, 5).forEach(i => eventsGrid.appendChild(buildArticleCard(i)));
        }
        const analysisGrid = document.querySelector('.analysis-grid');
        if (analysisGrid) {
            analysisGrid.innerHTML = '';
            items.slice(5, 8).forEach(i => analysisGrid.appendChild(buildArticleCard(i)));
        }
    }
});

window.resolveYouTubeChannelId = resolveYouTubeChannelId;
window.fetchYouTubeRSS = fetchYouTubeRSS;
window.fetchInstagramMedia = fetchInstagramMedia;
window.buildArticleCard = buildArticleCard;
window.chooseCategory = chooseCategory;
window.getCache = getCache;
window.setCache = setCache;
window.buildNewsCardLarge = buildNewsCardLarge;

// ============================================
// BACKEND API INTEGRATION
// ============================================
const API_BASE = '/api'; // Relative path for production

async function fetchFromBackend(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error);
        return [];
    }
}

async function loadBackendContent() {
    // Parallel fetch for speed
    const [articles, events, news, interviews] = await Promise.all([
        fetchFromBackend('/articles'),
        fetchFromBackend('/events'),
        fetchFromBackend('/news'),
        fetchFromBackend('/interviews')
    ]);

    // Update Latest Updates (Articles)
}

// Update Latest Updates (Articles) - Ensure thumbnails are handled correctly
const latestGrid = document.querySelector('.latest-news-grid');
if (latestGrid && articles.length > 0) {
    latestGrid.innerHTML = '';
    articles.slice(0, 8).forEach(item => {

        // Logic to prefer youtube thumbnail if it's a video article
        let thumbnail = item.image;
        if (!thumbnail || thumbnail.includes('via.placeholder') || thumbnail.includes('placehold.co')) {
            // If backend didn't provide good image, check if we can extract from video URL
            if (item.videoUrl && (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be'))) {
                const match = item.videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11}).*/);
                if (match && match[1]) {
                    thumbnail = `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
                }
            }
        }
        // Fallback
        if (!thumbnail) thumbnail = 'assets/images/logo.jpeg';

        const mapped = {
            title: item.title,
            excerpt: item.excerpt || item.content.substring(0, 100) + '...',
            thumbnail: thumbnail,
            category: item.category,
            published: item.publishedAt || item.createdAt,
            url: `article-detail.html?id=${item.id}`,
            source: 'bizzshort'
        };
        latestGrid.appendChild(buildNewsCardLarge(mapped));
    });
}

// Update Events
const eventsGrid = document.querySelector('.events-grid');
if (eventsGrid && events.length > 0) {
    eventsGrid.innerHTML = '';
    events.slice(0, 3).forEach(item => {
        const mapped = {
            title: item.name,
            excerpt: `${item.location} • ${new Date(item.date).toLocaleDateString()}`,
            thumbnail: item.image || 'https://placehold.co/600x400?text=Event',
            category: 'events',
            published: item.createdAt,
            url: '#', // or event detail page
            source: 'bizzshort'
        };
        eventsGrid.appendChild(buildArticleCard(mapped));
    });
}

// Update Interviews
const interviewGrid = document.querySelector('.interview-grid');
if (interviewGrid && interviews.length > 0) {
    interviewGrid.innerHTML = '';
    interviews.slice(0, 2).forEach(item => {
        const mapped = {
            title: `${item.intervieweeName} - ${item.company}`,
            excerpt: item.summary || item.designation,
            thumbnail: item.image || 'https://placehold.co/600x400?text=Interview',
            category: 'interviews',
            published: item.publishedAt,
            url: '#',
            source: 'bizzshort'
        };
        interviewGrid.appendChild(buildArticleCard(mapped));
    });
}
}

document.addEventListener('DOMContentLoaded', loadBackendContent);

// ============================================
// BACK TO TOP BUTTON
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    // Show/hide button on scroll
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', function () {
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

    searchInput.addEventListener('input', debounce(function (e) {
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
document.addEventListener('DOMContentLoaded', function () {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function () {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
});

console.log('✅ BizzShort - All frontend functionality loaded successfully');
