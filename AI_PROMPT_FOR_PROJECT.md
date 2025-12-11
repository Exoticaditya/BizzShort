# 🎯 AI PROMPT: Build BizzShort - Complete Business News Website

## Project Overview
Create a complete business news website called "BizzShort" with the tagline "In Seconds, Say What Matters". This is a modern, responsive news platform that integrates YouTube and Instagram videos, displays market data, and provides a professional admin panel.

---

## 🎨 Design Requirements

### Brand Identity
- **Name:** BizzShort
- **Tagline:** "IN SECONDS, SAY WHAT MATTERS"
- **Primary Color:** Red (#e74c3c)
- **Secondary Colors:** White, Dark Gray (#2c3e50)
- **Logo:** Professional business news logo with red accent
- **Font:** Poppins (headings), Inter (body text)

### Design Style
- Clean, modern, professional
- Card-based layout
- Smooth animations and hover effects
- Fully responsive (mobile, tablet, desktop)
- Sticky navigation header
- Side advertisements placeholders

---

## 📄 Required Pages

### 1. Homepage (index.html)
**Layout Structure:**
- **Advertisement Wrappers:**
  - Left Side Advertisement (300x600 + 300x250 sticky)
  - Right Side Advertisement (300x600 + 300x250 sticky)
  - Both fixed position, shown only on desktop (min-width: 1400px)
  - Ad label "Advertisement" at top
  - Main content wrapper centered between ads

- **Header Section:**
  - Logo on left with tagline below
  - **Top Advertisement Banner (970x90)** - Positioned right of logo
  - Horizontal navigation: Home | Latest News | Top Companies | Sectors | Interviews | Events | Blog | Advertise | About
  - Sticky on scroll
  - Mobile hamburger menu

- **Breaking News Section:**
  - Large featured story with image overlay
  - Category badge (Markets, Economy, etc.)
  - 3 smaller news cards below in grid
  - Market sidebar showing: Nifty 50, Sensex, FII Inflow with **LIVE DATA from Google Finance API**

- **Latest Updates Section:**
  - Tab filters: All | Business | Markets | Technology | Industry Update
  - Grid of 12-18 news/article cards with images
  - **Videos integrated as article cards** (no separate video section)
  - Each card: image/thumbnail, category badge, title, excerpt, read time
  - Video cards show play icon overlay to distinguish from text articles
  - Mix of YouTube/Instagram videos (from your channels) and news articles (from Google News API)

- **Market Data Sections:**
  - Top Market Cap Companies with **LIVE stock prices from Google Finance API**
  - Real-time % change, volume, market cap
  - Sector Performance (IT, Banking, Auto, etc.) with **live data**
  - Market charts using Chart.js with **real-time updates**

- **Interviews Section:**
  - CEO/Founder interview cards with quotes
  - Company info and position

- **Events Section:**
  - Upcoming business events calendar
  - Date, time, location, registration button

- **Analysis Section:**
  - Expert market analysis articles
  - Author info and publication date

- **Footer:**
  - About BizzShort
  - Quick links
  - Social media (YouTube: @bizz_short, Instagram: @bizz_short)
  - Newsletter signup
  - Copyright info
  - Admin login link (bottom right corner)

**CRITICAL REQUIREMENTS:** 
- **NO separate "Video News" or "Videos" page**
- **Videos MUST be integrated into Latest Updates section as regular article cards**
- Video cards look identical to news cards but have small play icon overlay
- Clicking video card goes to article-detail.html with video embedded
- Clicking text article goes to article-detail.html with article content

### 2. Article Detail Page (article-detail.html)
**Critical Requirements:**
- **Header:** Same as homepage with BizzShort logo and tagline
- **Top Advertisement Banner (728x90)** - Below header, above article
- **Article Layout:**
  - Category badge at top
  - Article title (from video title)
  - Author info, publish date, views, read time
  - **Featured Image/Video Container:**
    - Show video thumbnail as main image
    - Large red circular play button overlay (80px diameter)
    - Caption: "Click to watch the full video"
    - On click: Embed YouTube/Instagram player (16:9 aspect ratio)
    - Hover effects: scale image slightly, enlarge play button
  - **Article Description:**
    - Lead paragraph using video description from YouTube/Instagram
    - If description is short, generate business-focused content
    - Professional formatting with headings, paragraphs
  - **Mid-Article Advertisement (336x280 or 300x250):**
    - Centered within article content
    - Clear "Advertisement" label above
    - Placeholder image or Google AdSense slot
    - Margin spacing: 30px top and bottom
  - Related articles section
  - Social share buttons
- **Sidebar:**
  - **Sidebar Advertisement (300x250)** - Top of sidebar with "Advertisement" label
  - Stay Updated newsletter box
  - Popular Categories list
  - **Sidebar Advertisement (300x600)** - Below categories with "Advertisement" label
  - Trending News cards

**Dynamic Content:**
URL parameters: `?title=X&thumb=Y&url=Z&source=youtube&category=Markets&published=DATE&excerpt=DESCRIPTION&type=video`
- JavaScript loads these parameters
- If `type=video`: Auto-embeds video player on page load
- If `type=article`: Shows article content from Google News API or manual content
- Uses description as article excerpt/content

### 3. Blog Page (blog.html)
- Standard blog layout with article cards
- Filter by category
- Search functionality

### 4. Events Page (events.html)
- Upcoming events calendar
- Event cards with registration

### 5. About Page (about.html)
- Company information
- Mission, vision
- Team section
- Contact details

### 6. Contact Page (contact.html)
- Contact form (Name, Email, Subject, Message)
- Office address
- Email, phone
- Social media links
- Google Maps embed placeholder

### 7. Admin Login Page (admin-login.html)
**Design:**
- Two-column layout: left (gradient blue), right (white form)
- Left side: "Admin Panel" heading, features list with icons
- Right side: Login form
  - Username field
  - Password field (with show/hide toggle)
  - Remember me checkbox
  - Login button (gradient blue)
- **Authentication:**
  - Username: `admin`
  - Password: `admin123`
  - Store session in localStorage/sessionStorage
  - Redirect to admin.html on success

### 8. Admin Panel (admin.html)
**Layout:**
- Top header: BizzShort Admin logo, user avatar, logout button
- Left sidebar navigation:
  - Dashboard (active by default)
  - Articles
  - Interviews
  - Events
  - News
  - Industry Updates
  - Clients
  - Video Manager (important!)
  - Users
  - Settings

**Dashboard Section:**
- Stats cards: Total Articles, Active Users, Page Views, Events
- No API calls - static mode only
- Show placeholder data

**Video Manager Section:**
- Embed AUTO_ADD_VIDEOS.html as iframe (full height)
- Section title: "Video Manager"
- Instructions on how to use

**Other Sections:**
- Tables with sample data
- Add/Edit/Delete buttons (UI only, no backend)
- Search and filter functionality

**Critical:** 
- NO backend API calls
- NO connection to port 3000
- Static mode only - show success messages for actions
- Authentication check on page load (redirect to login if not logged in)

### 9. Advertise Page (advertise.html)
**Layout Structure:**
- **Header Section:**
  - Contact info bar: Phone, Email, Address
  - Social media links (Facebook, Twitter, LinkedIn, Instagram, WhatsApp)
  - Main navigation with "Advertise" highlighted

- **Hero Section:**
  - Headline: "Advertise With BizzShort"
  - Subheading about reaching India's business community
  - Key Stats Display:
    * 50K+ Monthly Readers
    * 85% Business Professionals
    * 25+ Industries Covered
  - CTA: "Get Started Today" button

- **Advertising Solutions Section:**
  - **Banner Advertisements Card:**
    * Icon: TV/Display icon
    * Description: Premium banner placements
    * Ad Sizes: Header (728x90), Sidebar (300x250), In-Article (336x280), Footer (728x90)
    * Starting from ₹15,000/month
  
  - **Sponsored Content Card (Featured/Most Popular):**
    * Icon: Newspaper icon
    * Description: Native advertising through sponsored articles
    * Options: Sponsored Articles, Company Features, Product Spotlights, Industry Insights
    * Starting from ₹25,000/article
  
  - **Newsletter Sponsorship Card:**
    * Icon: Envelope icon
    * Description: Reach subscribers through weekly newsletter
    * Options: Header, Mid-Newsletter, Dedicated Newsletter, Footer
    * Starting from ₹20,000/week
  
  - **Analytics Package Card:**
    * Icon: Chart icon
    * Description: Comprehensive advertising analytics
    * Features: Real-time Analytics, Demographics, Click-through Reports, ROI Analysis
    * Included with all packages

- **Pricing Section:**
  - **Starter Package (₹25,000/month):**
    * 2 Banner Placements
    * Basic Analytics
    * Monthly Report
    * Email Support
    * No Sponsored Content or Newsletter
  
  - **Professional Package (₹65,000/month) - RECOMMENDED:**
    * 5 Banner Placements
    * 2 Sponsored Articles
    * Newsletter Sponsorship
    * Advanced Analytics
    * Weekly Reports
    * Phone & Email Support
  
  - **Enterprise Package (₹1,25,000/month):**
    * Unlimited Banner Placements
    * 4 Sponsored Articles
    * Dedicated Newsletter
    * Premium Analytics
    * Daily Reports
    * Dedicated Account Manager
  
  - **Custom Solution CTA:**
    * "Need a Custom Solution?" heading
    * Request Custom Quote button

- **Audience Demographics Section:**
  - Age Demographics Chart (Chart.js pie/doughnut chart)
  - Professional Roles Chart (Chart.js bar chart)
  - Key Statistics Cards:
    * 52,000+ Monthly Unique Visitors
    * 3.5 min Average Session Duration
    * 85% Business Decision Makers
    * 68% Mobile Users

- **Success Stories Section:**
  - 3 Client Testimonial Cards:
    * **TechCorp Solutions (IT Services):**
      - Quote about 300% more qualified leads
      - Metrics: +300% Leads, +150% Website Traffic
    * **FinanceFirst (Financial Services):**
      - Quote about reaching C-level executives
      - Metrics: +250% Brand Awareness, +180% Conversions
    * **StartupHub (Business Consulting):**
      - Quote about newsletter sponsorship success
      - Metrics: 5 New Contracts, ₹25L+ Revenue

- **Contact Section:**
  - **Quote Request Form:**
    * Company Name
    * Contact Name
    * Email Address
    * Phone Number
    * Advertising Type Dropdown (Banner, Sponsored, Newsletter, Custom)
    * Budget Range Dropdown (₹25k-50k, ₹50k-100k, ₹100k-250k, ₹250k+)
    * Message Textarea
    * Submit Button: "Request Quote"
  
  - **Contact Information:**
    * Email: advertising@bizzshort.com
    * Phone: +91 98765-43210
    * Address: B-64, Sector 65, Noida, Uttar Pradesh
    * Business Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM

- **Footer:**
  - Standard footer with advertising-focused links
  - Social media links
  - Copyright info

**Design Requirements:**
- Professional business-focused design
- Use gradient backgrounds for CTAs
- Chart.js integration for demographics visualization
- Smooth animations and hover effects on cards
- Fully responsive layout
- Featured/Popular badge on recommended package

### 10. Video Manager Tool (AUTO_ADD_VIDEOS.html)
**Standalone Page Features:**
- Title: "Automatic Video Updater for BizzShort"
- **Input Section:**
  - Large textarea for YouTube/Instagram URLs (one per line, supports 100+ URLs)
  - Mode selector: ADD (preserve old videos) or REPLACE (new only)
  - "Generate Updated Code" button
- **Preview Section:**
  - Stats display: Existing videos, New videos, Total videos
  - Video preview cards showing new videos
  - Generated code display (formatted JavaScript)
- **Download Section:**
  - "Download Updated video-manager.js" button
  - Downloads complete file with all functions intact
- **Instructions:**
  - Step-by-step guide
  - YouTube/Instagram URL format examples
  - How to replace the file

---

## 🔌 Google API Integration

### Required APIs:

#### 1. Google News API
**Purpose:** Fetch real-time business news articles
**Setup:**
```javascript
// Get API key from: https://newsapi.org/
const NEWS_API_KEY = 'YOUR_API_KEY';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

async function fetchBusinessNews(category = 'business', country = 'in') {
    const response = await fetch(
        `${NEWS_API_URL}?country=${country}&category=${category}&apiKey=${NEWS_API_KEY}`
    );
    const data = await response.json();
    return data.articles; // Returns array of news articles
}
```

**Usage:**
- Fetch business, markets, technology news
- Display as article cards alongside your videos
- Update every 15-30 minutes
- Cache results to avoid API limits

#### 2. Google Finance API / Alpha Vantage API
**Purpose:** Live stock market data
**Setup:**
```javascript
// Alternative: Alpha Vantage (free tier available)
const ALPHA_VANTAGE_KEY = 'YOUR_API_KEY';
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

// Fetch Nifty 50, Sensex equivalent data
async function fetchStockData(symbol) {
    const response = await fetch(
        `${ALPHA_VANTAGE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apiKey=${ALPHA_VANTAGE_KEY}`
    );
    const data = await response.json();
    return data['Global Quote']; // Returns current price, change, % change
}

// Example stocks to track:
// Indian Market: RELIANCE.BSE, TCS.BSE, INFY.BSE
// US Market: AAPL, GOOGL, MSFT
```

**Real-time Updates:**
- Fetch market data every 1-5 minutes
- Display: Current price, Change, % Change, Volume
- Show green/red indicators for up/down
- Market charts with historical data

#### 3. YouTube Data API v3
**Purpose:** Fetch video metadata from your channel
**Setup:**
```javascript
const YOUTUBE_API_KEY = 'YOUR_API_KEY';
const YOUTUBE_CHANNEL_ID = 'YOUR_CHANNEL_ID'; // @bizz_short

async function fetchYouTubeVideos(maxResults = 10) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet&order=date&maxResults=${maxResults}&type=video`
    );
    const data = await response.json();
    return data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt
    }));
}
```

**Auto-fetch:**
- Periodically fetch new videos from your channel
- Update video database automatically
- No manual video ID entry needed

#### 4. Instagram Basic Display API (Optional)
**Purpose:** Fetch video posts from your Instagram
**Note:** Requires Facebook Developer account and app approval
**Alternative:** Use the 19 Instagram video IDs provided initially

---

## 📢 Advertisement Integration

### Advertisement Placements Across Site:

**Homepage Advertisement Zones:**
1. **Left Side Ad (Desktop Only):**
   - Position: Fixed left side, 300x600 + 300x250 stacked
   - Display: Only on screens > 1400px width
   - Sticky scroll behavior

2. **Right Side Ad (Desktop Only):**
   - Position: Fixed right side, 300x600 + 300x250 stacked
   - Display: Only on screens > 1400px width
   - Sticky scroll behavior

3. **Header Banner:**
   - Size: 970x90 (leaderboard)
   - Position: Top right of logo, before navigation
   - Responsive: Hide on mobile, show 728x90 on tablet

4. **In-Content Ads:**
   - Between sections (Breaking News → Latest Updates)
   - Size: 728x90 or 336x280
   - Clear "Advertisement" label

5. **Footer Banner:**
   - Size: 728x90
   - Position: Above footer content

**Article Page Advertisement Zones:**
1. **Top Banner:** 728x90 below header
2. **Mid-Article:** 336x280 within content (after 2-3 paragraphs)
3. **Sidebar Top:** 300x250
4. **Sidebar Bottom:** 300x600 (skyscraper)
5. **End-of-Article:** 728x90 before related articles

**Other Pages Advertisement:**
- Blog, Events, About pages: Header + Sidebar + Footer ads
- Contact page: Minimal ads (header only)
- Admin pages: NO advertisements

### Google AdSense Integration:

**Setup Instructions:**
```html
<!-- Add to <head> section of all public pages -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

**Ad Unit Example (Replace placeholder images):**
```html
<!-- Header Banner Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="horizontal"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

**Ad Sizes by Placement:**
- **Leaderboard:** 728x90 (header/footer)
- **Medium Rectangle:** 300x250 (sidebar, in-content)
- **Large Rectangle:** 336x280 (mid-article)
- **Wide Skyscraper:** 300x600 (sidebar)
- **Billboard:** 970x90 (premium header placement)
- **Mobile Banner:** 320x50 (mobile only)
- **Responsive:** Auto-size based on container

**Ad Loading Best Practices:**
1. Lazy load ads below the fold
2. Limit ads to 3 per page initially
3. Use async loading to prevent blocking
4. Add fallback placeholder images
5. Implement ad refresh after 30-60 seconds (optional)

**Revenue Optimization:**
- A/B test ad positions
- Monitor viewability metrics
- Use AdSense Auto Ads for optimal placement
- Enable responsive ad units for mobile
- Block low-quality ad categories

### CSS for Advertisement Styling:

```css
/* Side Advertisement Wrappers */
.page-wrapper-with-ads {
    display: flex;
    justify-content: center;
    position: relative;
}

.side-ad {
    position: fixed;
    top: 100px;
    width: 300px;
    z-index: 100;
}

.side-ad.left-ad {
    left: 20px;
}

.side-ad.right-ad {
    right: 20px;
}

.ad-sticky {
    position: sticky;
    top: 100px;
}

.ad-label {
    font-size: 10px;
    color: #999;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 5px;
}

/* Hide side ads on smaller screens */
@media (max-width: 1400px) {
    .side-ad {
        display: none;
    }
}

/* Advertisement Banners */
.ad-banner-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
}

.top-ad-banner {
    max-width: 970px;
    height: 90px;
    object-fit: cover;
}

/* In-Content Ads */
.mid-article-ad {
    text-align: center;
    margin: 30px 0;
    padding: 20px;
    background: #f8f9fa;
}

/* Sidebar Ads */
.sidebar-ad-space {
    margin-bottom: 30px;
    text-align: center;
}

.sidebar-ad-space img {
    width: 100%;
    height: auto;
    border: 1px solid #ddd;
}

/* Responsive Ad Adjustments */
@media (max-width: 768px) {
    .top-ad-banner {
        max-width: 320px;
        height: 50px;
    }
    
    .ad-banner-container {
        justify-content: center;
        margin-top: 10px;
    }
}
```

### Advertise Page Components:

**Chart.js Demographics Visualization:**
```javascript
// Age Demographics Pie Chart
const ageChart = new Chart(document.getElementById('ageChart'), {
    type: 'doughnut',
    data: {
        labels: ['25-34', '35-44', '45-54', '55+', '18-24'],
        datasets: [{
            data: [35, 30, 20, 10, 5],
            backgroundColor: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});

// Professional Roles Bar Chart
const rolesChart = new Chart(document.getElementById('rolesChart'), {
    type: 'bar',
    data: {
        labels: ['C-Level', 'Managers', 'Entrepreneurs', 'Analysts', 'Others'],
        datasets: [{
            label: 'Percentage',
            data: [25, 35, 20, 15, 5],
            backgroundColor: '#e74c3c'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true, max: 40 }
        }
    }
});
```

**Contact Form Handling:**
```javascript
document.getElementById('advertisingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        companyName: document.getElementById('companyName').value,
        contactName: document.getElementById('contactName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        adType: document.getElementById('adType').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('message').value
    };
    
    // Show success message (static mode)
    alert('Thank you! Your advertising quote request has been received. Our team will contact you within 24 hours.');
    
    // Reset form
    this.reset();
    
    // Optional: Send to email service (EmailJS, Formspree, etc.)
    // emailjs.send('service_id', 'template_id', formData);
});
```

---

## 📊 Video Database Structure

### Video Object Format:
```javascript
{
    id: '1',
    title: 'Video Title',
    category: 'Markets', // Markets, Economy, Banking
    source: 'youtube', // or 'instagram'
    videoId: 'fH8Ir7doWGk', // YouTube ID or Instagram post ID
    thumbnail: 'https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg',
    description: 'Video description from social media',
    views: '15.2K',
    date: 'Dec 10, 2025',
    duration: '10:45',
    featured: true, // true for featured videos
    tags: ['Markets', 'Business', 'News']
}
```

### Initial Videos (19 total):

**YouTube Videos:**
1. fH8Ir7doWGk - Business News Update (Markets)
2. dHFaUxh_sBE - Business Insights (Economy)
3. TXoQOkT8FiQ - Market Watch (Markets)
4. ZZND7BcDA_c - Business Update (Economy)
5. DBjSV7cGluE - Financial News (Banking)
6. B8ulzu1X8Y8 - Market Analysis (Markets)
7. Gx5DmLYRWrI - Business Strategy (Economy)
8. 47bNBV5Ca7Y - Tech News (Economy)
9. zX280yTaG_E - Investment Tips (Markets)
10. tR1ZlYUvzUo - Stock Market News (Markets)
11. pK70FxjUJCY - Economic Outlook (Economy)

**Instagram Reels:**
12. DSHA0mkgHLS - Business Shorts (Markets)
13. DSG50e1kf_H - Financial Update (Banking)
14. DSFvu7rlS7D - Market Pulse (Markets)
15. DSFoxt3DqbH - Business Brief (Economy)
16. DSFhp73Clum - Economic Insights (Economy)
17. DSD_ZR4jZoX - Market Watch (Markets)
18. DSD4XfyFQZP - Banking News (Banking)
19. DSDqPEXD-hV - Business Flash (Economy)

---

## 🎨 CSS Requirements

### File Structure:
1. **main-style.css** - Global styles, header, footer, base layout
2. **video-cards.css** - Video card components
3. **article-detail.css** - Article page styling
4. **market-sections.css** - Market data displays
5. **wirecable-grid.css** - Grid layouts
6. **admin.css** - Admin panel styling

### Key Design Elements:
- **Cards:** Border-radius: 12px, box-shadow on hover
- **Buttons:** Rounded, gradient backgrounds, hover effects
- **Colors:**
  - Primary: #e74c3c (red)
  - Success: #27ae60
  - Info: #3498db
  - Warning: #f39c12
  - Background: #f8f9fa
  - Text: #2c3e50
- **Typography:**
  - Headings: Poppins, 700-800 weight
  - Body: Inter, 400-500 weight
  - Line height: 1.6-1.8
- **Spacing:** 20px, 30px, 40px increments
- **Breakpoints:**
  - Mobile: 320px-768px
  - Tablet: 768px-1024px
  - Desktop: 1024px+

### Animations:
- Smooth transitions (0.3s ease)
- Hover scale effects (1.05)
- Fade-in on page load
- Skeleton loading states

---

## 💻 JavaScript Requirements

### File Structure:
1. **video-manager.js** - Video database and rendering
2. **main-functionality.js** - Homepage interactions
3. **article-detail.js** - Article page logic
4. **video-detail.js** - Video page logic
5. **market-data.js** - Market data display
6. **advanced-market.js** - Charts and graphs
7. **admin-enhanced.js** - Admin panel logic
8. **blog.js** - Blog functionality
9. **contact.js** - Contact form handling

### video-manager.js Functions:
```javascript
// Core Functions
const videoDatabase = [/* 19 videos array */];
const newsArticles = []; // Fetched from Google News API

function getCategories() { /* return unique categories */ }
function filterVideosByCategory(category) { /* filter videos */ }

// Create unified article card (works for both videos and news)
function createArticleCard(item) { 
    const isVideo = item.source === 'youtube' || item.source === 'instagram';
    const playIcon = isVideo ? '<div class="play-icon-overlay"><i class="fas fa-play"></i></div>' : '';
    const type = isVideo ? 'video' : 'article';
    
    return `
        <div class="news-card" onclick="window.location.href='article-detail.html?title=${encodeURIComponent(item.title)}&thumb=${encodeURIComponent(item.thumbnail)}&url=${encodeURIComponent(item.url)}&source=${item.source}&category=${item.category}&published=${item.date}&excerpt=${encodeURIComponent(item.description)}&type=${type}'">
            <img src="${item.thumbnail}" alt="${item.title}">
            ${playIcon}
            <div class="card-content">
                <span class="category-badge">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.description.substring(0, 120)}...</p>
                <div class="card-meta">
                    <span><i class="far fa-clock"></i> ${item.date}</span>
                    ${isVideo ? `<span><i class="far fa-eye"></i> ${item.views}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Merge videos and news articles
function getAllContent() {
    return [...videoDatabase, ...newsArticles].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
}

function renderMixedContent(containerId) { 
    const allContent = getAllContent();
    const container = document.getElementById(containerId);
    container.innerHTML = allContent.map(createArticleCard).join('');
}

function navigateToArticle(item) { /* go to article-detail.html with all params */ }
function initializeContentSection() { /* auto-init, fetch news, render all */ }

// YouTube Embed
function embedYouTubeVideo(videoId) {
    return `<iframe src="https://www.youtube.com/embed/${videoId}?rel=0" 
            allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

// Instagram Embed
function embedInstagramVideo(postId) {
    return `<iframe src="https://www.instagram.com/p/${postId}/embed" 
            frameborder="0"></iframe>`;
}
```

### article-detail.js Logic:
```javascript
// Get URL parameters
const params = new URLSearchParams(location.search);
const title = params.get('title');
const thumb = params.get('thumb');
const url = params.get('url');
const source = params.get('source');
const category = params.get('category');
const excerpt = params.get('excerpt');
const type = params.get('type'); // 'video' or 'article'

// Update page content
document.querySelector('.article-title').textContent = title;
document.querySelector('.article-category').textContent = category;
document.querySelector('#article-thumbnail').src = thumb;
document.querySelector('.lead-paragraph').textContent = excerpt;

// Handle different content types
if (type === 'video') {
    // Show play button overlay
    document.querySelector('.play-overlay').style.display = 'flex';
    document.querySelector('.image-caption').textContent = 'Click to watch the full video';
    
    // Handle video click
    document.querySelector('#video-container').addEventListener('click', () => {
        if (source === 'youtube') {
            embedYouTubePlayer(url);
        } else if (source === 'instagram') {
            embedInstagramPlayer(url);
        }
    });
} else if (type === 'article') {
    // Hide play button, show article content
    document.querySelector('.play-overlay').style.display = 'none';
    document.querySelector('.image-caption').textContent = 'Featured image';
    
    // If article URL exists, make image link to source
    if (url) {
        document.querySelector('#video-container').style.cursor = 'pointer';
        document.querySelector('#video-container').addEventListener('click', () => {
            window.open(url, '_blank');
        });
    }
    
    // Generate or fetch full article content
    loadFullArticleContent(excerpt);
}
```

### admin-enhanced.js Requirements:
- NO API calls to backend
- Static mode only
- Show success notifications for actions
- Authentication check on load
- Logout functionality clears session

---

## 🔧 Technical Requirements

### Cache Busting:
All CSS/JS files must have version parameters:
```html
<link rel="stylesheet" href="assets/css/main-style.css?v=3.0">
<script src="assets/js/video-manager.js?v=3.0"></script>
```

### Responsive Design:
- Mobile-first approach
- Hamburger menu for mobile
- Collapsible sidebar on admin panel
- Touch-friendly buttons (min 44px)
- Stacked layout on small screens

### Performance:
- Lazy load images
- Minify CSS/JS for production
- Compress images
- Use CDN for libraries (Font Awesome, Chart.js)

### SEO:
- Proper meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Canonical URLs
- Sitemap.xml
- Robots.txt
- Structured data (Schema.org)

### Accessibility:
- Alt text for all images
- ARIA labels for interactive elements
- Keyboard navigation support
- Proper heading hierarchy (H1 → H6)
- Color contrast ratio 4.5:1 minimum

---

## 📁 File Structure

```
BizzShort/
├── index.html
├── article-detail.html
├── blog.html
├── events.html
├── about.html
├── contact.html
├── advertise.html
├── admin-login.html
├── admin.html
├── AUTO_ADD_VIDEOS.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/
│   │   ├── main-style.css
│   │   ├── video-cards.css
│   │   ├── article-detail.css
│   │   ├── market-sections.css
│   │   ├── wirecable-grid.css
│   │   ├── admin.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── content-manager.js (videos + news articles)
│   │   ├── main-functionality.js
│   │   ├── article-detail.js
│   │   ├── market-data.js (with Google Finance API integration)
│   │   ├── news-fetcher.js (Google News API integration)
│   │   ├── advanced-market.js
│   │   ├── admin-enhanced.js
│   │   ├── blog.js
│   │   ├── contact.js
│   │   └── advertise.js
│   └── images/
│       ├── logo.jpeg
│       └── README.md
└── utils/
    └── easy-video-updater.js
```

---

## 🚀 Deployment Instructions

### Local Testing:
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

### Production Deployment Options:

**1. GitHub Pages (Free):**
- Push to GitHub repository
- Enable Pages in settings
- Branch: main, Folder: / (root)

**2. Netlify (Free):**
- Connect GitHub repo
- Build command: (none - static site)
- Publish directory: / (root)
- Auto-deploy on push

**3. Vercel (Free):**
- Import GitHub project
- Framework preset: Other
- Auto-deploy on push

**4. Custom Hosting:**
- Upload all files to web server
- No server-side code required
- Works with any static hosting

---

## 📋 Testing Checklist

### Functionality:
- [ ] All navigation links work
- [ ] Advertisement placements display correctly on all pages
- [ ] Advertise page loads with all components
- [ ] Advertise contact form submits successfully
- [ ] Demographics charts render properly (Chart.js)
- [ ] Side ads sticky behavior works on desktop
- [ ] Side ads hidden on mobile/tablet
- [ ] Videos and news articles mixed in Latest Updates section
- [ ] Video embeds play correctly in article-detail.html
- [ ] News articles open with content (not video player)
- [ ] Google News API fetching works
- [ ] Live market data updates from Google Finance API
- [ ] Category filters work
- [ ] Search functionality works
- [ ] Admin login with correct credentials
- [ ] Admin logout clears session
- [ ] Video Manager generates code
- [ ] Download button works
- [ ] Contact form submits
- [ ] Newsletter signup works
- [ ] Social share buttons work

### Responsive:
- [ ] Mobile (320px-480px)
- [ ] Tablet (768px-1024px)
- [ ] Desktop (1200px+)
- [ ] Hamburger menu on mobile
- [ ] Touch targets 44px minimum

### Browser Compatibility:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari
- [ ] Chrome Android

### Performance:
- [ ] Page load < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Cache busting works

---

## 🎯 Key Success Criteria

1. ✅ **Complete Advertisement System**
   - Advertise page with pricing packages, forms, and analytics
   - Strategic ad placements on all pages (header, sidebar, in-content)
   - Side advertisements on desktop (left/right fixed)
   - Google AdSense integration ready
   - Contact form for quote requests
   - Demographics charts with Chart.js
   - Responsive ad behavior (hide/resize based on screen size)

2. ✅ **NO separate "Videos" page or "Video News" section**
   - Videos integrated into Latest Updates section alongside news articles
   - Video cards and news cards mixed together
   - Sorted by date (most recent first)
   - Video cards show small play icon overlay to distinguish from articles

3. ✅ **Article-detail.html handles both videos AND news articles**
   - If type=video: Show play button, embed player on click
   - If type=article: Hide play button, show article text content
   - Same page layout for both types
   - Uses video description or article excerpt as content

4. ✅ **Live data from Google APIs**
   - News articles fetched from Google News API
   - Market data updated from Google Finance/Alpha Vantage API
   - Real-time stock prices, % changes
   - Auto-refresh every few minutes

5. ✅ **Admin panel works without backend**
   - Static mode only
   - No API errors
   - Shows sample data

6. ✅ **Professional business news design**
   - Clean, modern, trustworthy
   - Not overly colorful or casual
   - Proper typography and spacing

7. ✅ **Fully responsive**
   - Works perfectly on all devices
   - Mobile-friendly navigation

8. ✅ **SEO optimized**
   - Proper meta tags
   - Semantic HTML
   - Fast loading

---

## 🔐 Admin Credentials

**Default Login:**
- Username: `admin`
- Password: `admin123`

**Security Note:** Change credentials in production by editing admin-login.html authentication logic.

---

## 📞 Social Media Integration

**YouTube Channel:** @bizz_short
- URL: https://youtube.com/@bizz_short
- Display in footer and about page

**Instagram Account:** @bizz_short
- URL: https://www.instagram.com/bizz_short
- Display in footer and about page

**Video Sources:**
- Fetch videos from both platforms
- Use actual video IDs provided
- Auto-generate thumbnails from YouTube
- Instagram thumbnails from embed

---

## 🎨 Color Scheme Reference

```css
/* Primary Colors */
--primary-red: #e74c3c;
--primary-dark: #c0392b;

/* Secondary Colors */
--blue: #3498db;
--green: #27ae60;
--yellow: #f39c12;
--orange: #e67e22;

/* Neutrals */
--dark-gray: #2c3e50;
--medium-gray: #7f8c8d;
--light-gray: #ecf0f1;
--white: #ffffff;

/* Backgrounds */
--bg-light: #f8f9fa;
--bg-card: #ffffff;

/* Text */
--text-primary: #2c3e50;
--text-secondary: #7f8c8d;
--text-light: #95a5a6;
```

---

## ⚡ Important Notes

1. **No Backend Server Required**
   - Completely static website
   - All data stored in JavaScript arrays
   - No database, no API calls

2. **Cache Management**
   - Use version parameters (?v=3.0)
   - Increment version on updates
   - Document cache clearing for users

3. **Video Integration**
   - Use YouTube embed API
   - Instagram embed via iframe
   - Handle both formats seamlessly

4. **Content Strategy**
   - Videos appear as news articles
   - Professional business focus
   - Clear categorization
   - Engaging thumbnails

5. **User Experience**
   - Fast loading
   - Intuitive navigation
   - Clear call-to-actions
   - Mobile-optimized

---

## 🎓 Additional Requirements

### Analytics Integration:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"></script>
```

### Newsletter Integration:
- Email capture form in footer
- Mailchimp/SendGrid ready
- Privacy policy link

### Error Handling:
- 404 page with helpful navigation
- Broken video fallback
- Network error messages
- Form validation

---

This prompt provides everything needed to build BizzShort from 0% to 100% exactly as required. Follow all specifications carefully for a professional, production-ready business news website.
