// ============================================
// VIDEO DETAIL PAGE FUNCTIONALITY
// ============================================

// Get video ID from URL
function getVideoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Complete Video Database with Full Articles
const videosDatabase = {
    '1': {
        id: '1',
        title: 'Business News Today | Latest Market Updates & Analysis',
        category: 'Markets',
        source: 'youtube',
        videoId: 'fH8Ir7doWGk',
        thumbnail: 'https://img.youtube.com/vi/fH8Ir7doWGk/maxresdefault.jpg',
        description: 'Stay updated with today\'s breaking business news, market movements, and expert analysis on India\'s economic landscape.',
        views: '2.5K',
        date: 'Dec 11, 2025',
        tags: ['Business News', 'Market', 'Economy', 'Today'],
        article: `
            <h3>Historic Market Milestone</h3>
            <p>The Indian stock market reached an unprecedented milestone today as the Nifty 50 index crossed the 25,000 mark for the first time. This represents over 18% year-to-date growth and reflects strong investor confidence in India's economic trajectory.</p>
            
            <h3>Key Drivers Behind the Rally</h3>
            <ul>
                <li><strong>Strong Corporate Earnings:</strong> Q2 FY2025 results showed robust earnings growth, with IT, Banking, and Consumer Goods sectors leading.</li>
                <li><strong>FII Inflows:</strong> Foreign Institutional Investors invested ₹45,000 crores last quarter.</li>
                <li><strong>GDP Growth:</strong> India's GDP grew at 7.6% in Q2, surpassing expectations.</li>
                <li><strong>Stable Macro Environment:</strong> Lower inflation and favorable government policies boosted confidence.</li>
            </ul>
            
            <h3>Sectoral Performance</h3>
            <p><strong>IT Sector:</strong> Technology stocks led with 24% YTD gains. TCS, Infosys, and HCL Tech reported strong order books.</p>
            <p><strong>Banking:</strong> HDFC Bank, ICICI Bank, and SBI showed excellent performance with NPAs at decade-lows and 15%+ credit growth.</p>
            <p><strong>Consumer Goods:</strong> Rural demand recovery and strong urban consumption drove growth.</p>
            
            <h3>Investment Strategy</h3>
            <p><strong>For New Investors:</strong></p>
            <ul>
                <li>Start SIPs instead of lump sum investments</li>
                <li>Diversify across market caps</li>
                <li>Maintain 60-70% equity for aggressive goals</li>
                <li>Keep 20-25% in debt for stability</li>
            </ul>
            
            <p><strong>For Existing Investors:</strong></p>
            <ul>
                <li>Book partial profits in stocks with 50%+ gains</li>
                <li>Rebalance to maintain target allocation</li>
                <li>Look for underperforming sector opportunities</li>
            </ul>
            
            <h3>Risk Factors</h3>
            <ul>
                <li>Nifty PE at 22x vs 20x long-term average</li>
                <li>Global economic uncertainty</li>
                <li>Geopolitical tensions</li>
                <li>Rising oil prices impacting current account</li>
            </ul>
            
            <h3>Market Outlook</h3>
            <p>Analysts project Nifty could reach 26,000 by March 2026 if earnings momentum continues. However, near-term consolidation between 24,000-25,500 is expected.</p>
            
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <strong>⚠️ Disclaimer:</strong> This is for educational purposes only. Consult a SEBI-registered advisor before investing.
            </div>
        `
    },
    '2': {
        id: '2',
        title: 'Top 5 Unicorn Startups of 2025: Success Stories & Business Models',
        category: 'Startups',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_2',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        description: 'Deep dive into India\'s newest unicorns, their funding journey, business strategies, and lessons for aspiring entrepreneurs.',
        views: '12.8K',
        date: 'Dec 9, 2025',
        tags: ['Startups', 'Unicorn', 'Funding', 'Entrepreneurship'],
        article: `
            <h3>India's Unicorn Revolution</h3>
            <p>2025 has witnessed the birth of 15 new unicorns in India, taking the total count to over 125. These billion-dollar startups span diverse sectors from fintech to health-tech, showcasing India's entrepreneurial prowess.</p>
            
            <h3>Top 5 Unicorns of 2025</h3>
            
            <h4>1. HealthifyPro - AI-Powered Health Tech</h4>
            <p><strong>Valuation:</strong> $1.2 Billion | <strong>Founded:</strong> 2020</p>
            <p>HealthifyPro revolutionized personal fitness with AI-powered nutritionists and trainers. Their subscription model reached 5 million paid users, with 80% retention rate.</p>
            <p><strong>Funding Journey:</strong> Raised $220M across Series C and D from Sequoia, Accel, and Khosla Ventures.</p>
            
            <h4>2. UrbanCart - Quick Commerce Platform</h4>
            <p><strong>Valuation:</strong> $1.5 Billion | <strong>Founded:</strong> 2021</p>
            <p>UrbanCart disrupted grocery delivery with 10-minute delivery promises across 25 cities. They achieved ₹2,500 crore annual revenue with improving unit economics.</p>
            <p><strong>Key Innovation:</strong> Dark store network and AI-powered inventory management.</p>
            
            <h4>3. LendingBridge - B2B Fintech</h4>
            <p><strong>Valuation:</strong> $1.1 Billion | <strong>Founded:</strong> 2019</p>
            <p>Providing working capital loans to MSMEs using alternative credit scoring. Disbursed over ₹10,000 crores with NPA below 2%.</p>
            <p><strong>Backers:</strong> Tiger Global, Peak XV Partners, and Lightspeed Venture Partners.</p>
            
            <h4>4. EduVerse - EdTech Platform</h4>
            <p><strong>Valuation:</strong> $1.3 Billion | <strong>Founded:</strong> 2020</p>
            <p>Metaverse-based education platform offering immersive learning experiences. Partnered with 500+ schools and reached 2 million students.</p>
            <p><strong>USP:</strong> Combining VR/AR with curriculum-aligned content.</p>
            
            <h4>5. GreenLogistics - Sustainable Supply Chain</h4>
            <p><strong>Valuation:</strong> $1.0 Billion | <strong>Founded:</strong> 2021</p>
            <p>EV-based logistics platform for last-mile delivery. Operating 10,000 electric vehicles across 50 cities, reducing carbon footprint by 60%.</p>
            
            <h3>Common Success Factors</h3>
            <ul>
                <li><strong>Problem-Solution Fit:</strong> All addressed significant market gaps</li>
                <li><strong>Tech Integration:</strong> Heavy use of AI, ML, and data analytics</li>
                <li><strong>Unit Economics:</strong> Path to profitability within 18-24 months</li>
                <li><strong>Scalability:</strong> Asset-light models enabling rapid expansion</li>
                <li><strong>Talent:</strong> Teams with experience from top companies</li>
            </ul>
            
            <h3>Funding Trends</h3>
            <p>Indian startups raised $24 billion in 2025, down from pandemic highs but showing quality over quantity. Average ticket size increased to $45M as investors became more selective.</p>
            
            <h3>Lessons for Aspiring Entrepreneurs</h3>
            <ol>
                <li><strong>Focus on Unit Economics:</strong> Profitability matters more than growth at any cost</li>
                <li><strong>Build for India:</strong> Solutions tailored to Indian market dynamics succeed</li>
                <li><strong>Customer Retention:</strong> High LTV/CAC ratio is crucial</li>
                <li><strong>Choose Investors Wisely:</strong> Smart money adds more value than just capital</li>
                <li><strong>Governance:</strong> Strong compliance and corporate governance from day one</li>
            </ol>
            
            <h3>Sector-Wise Breakdown</h3>
            <ul>
                <li>Fintech: 25% of new unicorns</li>
                <li>E-commerce & D2C: 20%</li>
                <li>Health-tech: 18%</li>
                <li>Ed-tech: 15%</li>
                <li>Logistics & Supply Chain: 12%</li>
                <li>Others: 10%</li>
            </ul>
            
            <h3>Future Outlook</h3>
            <p>India is projected to have 150+ unicorns by 2026. Focus is shifting to Tier-2 and Tier-3 cities, with vernacular and sustainability-focused startups gaining traction.</p>
            
            <p><em>"The next wave of unicorns will come from deep tech, climate tech, and solutions addressing Bharat, not just India."</em> - Venture Capitalist Insight</p>
        `
    },
    '3': {
        id: '3',
        title: 'RBI Rate Decision Impact: What It Means for Your EMI & Savings',
        category: 'Economy',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_3',
        thumbnail: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800',
        description: 'Comprehensive analysis of RBI\'s repo rate decision and its direct impact on home loans, car loans, and savings accounts.',
        views: '18.5K',
        date: 'Dec 8, 2025',
        tags: ['RBI', 'Interest Rates', 'EMI', 'Banking', 'Loans'],
        article: `
            <h3>Policy Update</h3>
            <p>The Reserve Bank of India maintained the repo rate, balancing inflation control with growth support. Borrowers may see stable EMIs, while deposit rates could remain attractive.</p>
        `
    },
    '4': {
        id: '4',
        title: 'Green Energy Stocks: Top Investment Opportunities in Renewable Sector',
        category: 'Energy',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_4',
        thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800',
        description: 'Analyzing India\'s renewable energy revolution and the best stocks to invest in solar, wind, and electric vehicle sectors.',
        views: '11.2K',
        date: 'Dec 7, 2025',
        tags: ['Solar Energy', 'Green Energy', 'Renewable', 'Stocks', 'Investment'],
        article: `
            <h3>Why Renewable Now</h3>
            <p>Government incentives and falling solar costs are driving adoption. Top picks include leaders in solar modules, wind turbines, and grid storage.</p>
        `
    },
    '5': {
        id: '5',
        title: 'Crypto Tax Rules 2025: Everything You Need to Know',
        category: 'Cryptocurrency',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_5',
        thumbnail: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d241?w=800',
        description: 'Complete guide to cryptocurrency taxation in India, VDA rules, TDS requirements, and compliance strategies.',
        views: '14.7K',
        date: 'Dec 6, 2025',
        tags: ['Cryptocurrency', 'Bitcoin', 'Tax', 'Regulations', 'VDA'],
        article: `
            <h3>Tax Rules Simplified</h3>
            <p>Crypto gains taxed at 30%, 1% TDS on transfers above threshold, and reporting under VDA rules. Keep clean records and use compliant exchanges.</p>
        `
    },
    '6': {
        id: '6',
        title: 'Make in India: Electronics Manufacturing Success Story',
        category: 'Manufacturing',
        source: 'instagram',
        videoId: 'YOUR_VIDEO_ID_6',
        thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
        description: 'How India is becoming a global electronics manufacturing hub with PLI scheme benefits and export achievements.',
        views: '9.3K',
        date: 'Dec 5, 2025',
        tags: ['Manufacturing', 'Make in India', 'PLI', 'Electronics', 'Export'],
        article: `
            <h3>PLI Scheme Impact</h3>
            <p>PLI incentives have accelerated capacity additions in semiconductors, mobiles, and components. Exports rising, job creation improving.</p>
        `
    },
    '7': {
        id: '7',
        title: 'Quick Commerce War: Blinkit vs Zepto vs Swiggy Instamart',
        category: 'E-commerce',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_7',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        description: 'Deep dive into the 10-minute delivery battle, business models, profitability challenges, and future of quick commerce in India.',
        views: '16.8K',
        date: 'Dec 4, 2025',
        tags: ['E-commerce', 'Quick Commerce', 'Blinkit', 'Zepto', 'Delivery'],
        article: `
            <h3>Unit Economics</h3>
            <p>Dark store density, AOV uplift, and private labels are key levers. Watch burn rates vs contribution margins.</p>
        `
    },
    '8': {
        id: '8',
        title: 'Healthcare IPOs: Should You Invest in Medical Tech Stocks?',
        category: 'Healthcare',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_8',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        description: 'Analysis of upcoming healthcare and medical technology IPOs, valuation, growth potential, and investment risks.',
        views: '8.9K',
        date: 'Dec 3, 2025',
        tags: ['Healthcare', 'IPO', 'Medical Tech', 'Investment', 'Pharma'],
        article: `
            <h3>Valuation Watch</h3>
            <p>Look for revenue visibility, R&D pipeline, and regulatory risk. Compare EV/S to global comps.</p>
        `
    },
    '9': {
        id: '9',
        title: 'UPI Crosses 12 Billion Transactions: Digital Payment Revolution',
        category: 'Banking',
        source: 'instagram',
        videoId: 'YOUR_VIDEO_ID_9',
        thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        description: 'Milestone analysis of UPI achieving record 12 billion monthly transactions and its impact on India\'s digital economy.',
        views: '13.4K',
        date: 'Dec 2, 2025',
        tags: ['UPI', 'Digital Payments', 'Banking', 'Fintech', 'NPCI'],
        article: `
            <h3>Fintech Flywheel</h3>
            <p>UPI volume growth drives merchant adoption and credit overlays. Watch for MDR policy changes and cross-border pilots.</p>
        `
    },
    '10': {
        id: '10',
        title: 'Tesla Entry in India: Impact on EV Market & Auto Stocks',
        category: 'Markets',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_10',
        thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
        description: 'Analyzing Tesla\'s planned India entry, government policy changes, impact on domestic EV makers, and stock market implications.',
        views: '19.2K',
        date: 'Dec 1, 2025',
        tags: ['Tesla', 'EV', 'Auto Sector', 'Stocks', 'Investment'],
        article: `
            <h3>EV Market Shift</h3>
            <p>Tesla's entry could accelerate EV adoption, pressure pricing, and boost charging infra. Domestic OEMs likely to respond with new launches.</p>
        `
    }
};

// Load video content
function loadVideoContent() {
    const videoId = getVideoIdFromURL();
    
    if (!videoId || !videosDatabase[videoId]) {
        // Show error or redirect to home
        document.getElementById('video-title').textContent = 'Video not found';
        return;
    }
    
    const video = videosDatabase[videoId];
    
    // Update page title
    document.title = `${video.title} - BizzShort`;
    
    // Update breadcrumb
    document.getElementById('breadcrumb-title').textContent = video.title;
    
    // Update video player
    loadVideoPlayer(video);
    
    // Update video info
    document.getElementById('video-category').innerHTML = `<i class="fas fa-tag"></i> <span>${video.category}</span>`;
    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-date').textContent = video.date;
    document.getElementById('view-count').textContent = video.views;
    
    // Update source badge
    const sourceBadge = document.getElementById('video-source');
    if (video.source === 'youtube') {
        sourceBadge.innerHTML = '<i class="fab fa-youtube"></i> YouTube';
        sourceBadge.classList.add('youtube');
    } else if (video.source === 'instagram') {
        sourceBadge.innerHTML = '<i class="fab fa-instagram"></i> Instagram';
        sourceBadge.classList.add('instagram');
    }
    
    // Update description and article
    document.getElementById('video-description').innerHTML = `<p>${video.description}</p>`;
    document.getElementById('article-text').innerHTML = video.article;
    
    // Update tags
    const tagsContainer = document.getElementById('video-tags');
    tagsContainer.innerHTML = video.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    // Load related videos
    loadRelatedVideos(videoId, video.category);
    
    // Load latest news
    loadLatestNews();
}

// Load video player
function loadVideoPlayer(video) {
    const playerContainer = document.getElementById('video-player');
    const videoUrl = video.source === 'youtube' 
        ? `https://www.youtube.com/watch?v=${video.videoId}`
        : `https://www.instagram.com/bizz_short/`;
    
    // Show thumbnail with play button that opens YouTube/Instagram
    playerContainer.innerHTML = `
        <div class="video-thumbnail-wrapper" onclick="window.open('${videoUrl}', '_blank')" style="cursor: pointer;">
            <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; height: 100%; object-fit: cover;">
            <div class="video-play-overlay">
                <div class="video-play-button">
                    <i class="fab fa-${video.source === 'youtube' ? 'youtube' : 'instagram'}"></i>
                </div>
                <p class="click-to-watch">Click to watch on ${video.source === 'youtube' ? 'YouTube' : 'Instagram'}</p>
            </div>
        </div>
    `;
    playerContainer.style.cursor = 'pointer';
}

// Load related videos
function loadRelatedVideos(currentVideoId, category) {
    const relatedContainer = document.getElementById('related-videos');
    
    // Get videos from same category, excluding current video
    const relatedVideos = Object.values(videosDatabase)
        .filter(v => v.id !== currentVideoId && (v.category === category || Math.random() > 0.5))
        .slice(0, 5);
    
    relatedContainer.innerHTML = relatedVideos.map(video => `
        <div class="related-video-item" onclick="navigateToVideo('${video.id}')">
            <img src="${video.thumbnail}" alt="${video.title}" class="related-video-thumb">
            <div class="related-video-info">
                <h4>${video.title}</h4>
                <div class="meta">
                    <span><i class="far fa-eye"></i> ${video.views}</span>
                    <span><i class="far fa-clock"></i> ${video.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load latest news
function loadLatestNews() {
    const newsContainer = document.getElementById('latest-news');
    
    const latestNews = [
        {
            title: 'IT Sector Shows Strong Growth in Q4',
            date: 'Dec 9, 2025'
        },
        {
            title: 'New Startup Policy Announced',
            date: 'Dec 8, 2025'
        },
        {
            title: 'Foreign Investment Reaches Record High',
            date: 'Dec 7, 2025'
        },
        {
            title: 'Manufacturing Index Shows Improvement',
            date: 'Dec 6, 2025'
        }
    ];
    
    newsContainer.innerHTML = latestNews.map(news => `
        <div class="news-item" onclick="window.location.href='article-detail.html'">
            <h4>${news.title}</h4>
            <div class="meta">${news.date}</div>
        </div>
    `).join('');
}

// Navigate to video
function navigateToVideo(videoId) {
    window.location.href = `video-detail.html?id=${videoId}`;
}

// Share video function
function shareVideo(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.getElementById('video-title').textContent);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadVideoContent();
});
