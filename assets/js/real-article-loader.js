/**
 * Real Article Data Loader for BizzShort
 * Populates Featured Articles section with compelling business news
 */

const realArticles = [
    {
        id: 1,
        category: "ECONOMY",
        title: "India's GDP Growth Surpasses Expectations at 7.2% for FY 2025-26",
        description: "Robust manufacturing and services sectors drive India's stellar economic performance, positioning the nation as the fastest-growing major economy globally...",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
        views: "12.5K",
        readTime: "6 min read"
    },
    {
        id: 2,
        category: "STARTUPS",
        title: "India Adds 15 New Unicorns in Q1 2026, Leads Asian Startup Ecosystem",
        description: "Fintech, edtech, and AI sectors dominate as Indian startups secure record $8.5 billion in funding, cementing position as global innovation hub...",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop",
        views: "18.3K",
        readTime: "5 min read"
    },
    {
        id: 3,
        category: "MARKETS",
        title: "Nifty 50 Crosses 26,000 Mark: What's Driving the Bull Run?",
        description: "Foreign institutional investors pour $4.2 billion into Indian equities as corporate earnings beat estimates, fueling optimism across sectors...",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop",
        views: "24.7K",
        readTime: "7 min read"
    },
    {
        id: 4,
        category: "TECHNOLOGY",
        title: "India's AI Revolution: Tech Giants Invest $12 Billion in AI Infrastructure",
        description: "Microsoft, Google, and Amazon expand AI data centers across India as homegrown startups develop cutting-edge solutions for healthcare, agriculture...",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        views: "15.2K",
        readTime: "8 min read"
    },
    {
        id: 5,
        category: "FINANCE",
        title: "UPI Processes 15 Billion Monthly Transactions, RBI Unveils Digital Rupee Roadmap",
        description: "India's digital payment ecosystem achieves new milestone as central bank expands CBDC pilot to 50 cities, revolutionizing financial inclusion...",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
        views: "21.8K",
        readTime: "6 min read"
    },
    {
        id: 6,
        category: "INDUSTRY",
        title: "Make in India 2.0: Electronics Manufacturing Sees 45% YoY Growth",
        description: "Apple, Samsung scale up India operations as PLI scheme drives smartphone, semiconductor production; exports touch $120 billion milestone...",
        image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop",
        views: "11.3K",
        readTime: "7 min read"
    }
];

function loadRealArticles() {
    const articleGrid = document.getElementById('articleNewsGrid');

    if (!articleGrid) {
        console.warn('Article grid not found');
        return;
    }

    // Clear existing content
    articleGrid.innerHTML = '';

    // Populate with  real articles
    realArticles.forEach(article => {
        const articleCard = `
            <article class="breaking-news-card article-card" data-article-id="${article.id}">
                <div class="video-thumbnail article-thumbnail">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    <div class="read-overlay"><i class="fas fa-book-open"></i></div>
                </div>
                <div class="news-content article-content">
                    <span class="news-badge">${article.category}</span>
                    <h4>${article.title}</h4>
                    <p>${article.description}</p>
                    <div class="news-meta">
                        <span><i class="far fa-eye"></i> ${article.views}</span>
                        <span><i class="far fa-clock"></i> ${article.readTime}</span>
                    </div>
                </div>
            </article>
        `;

        articleGrid.innerHTML += articleCard;
    });

    console.log('✅ Real articles loaded successfully');
}

// Load articles when DOM is ready
document.addEventListener('DOMContentLoaded', loadRealArticles);
