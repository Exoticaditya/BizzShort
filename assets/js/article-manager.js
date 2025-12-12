// Dynamic Article Content Manager
// Loads different articles based on URL parameters

class ArticleManager {
    constructor() {
        this.articles = {
            '1': {
                category: 'Business',
                categoryClass: 'business',
                title: 'Indian Startups Raise $12B in 2025, Surpassing Last Year\'s Record',
                author: 'Rahul Verma',
                date: 'December 12, 2025',
                views: '15,240',
                readTime: '6 min',
                comments: '42',
                videoId: 'fH8Ir7doWGk',
                caption: 'Indian startup ecosystem reaches new heights with record funding',
                content: `
                    <p class="lead-paragraph">
                        The Indian startup ecosystem has demonstrated remarkable resilience and growth in 2025, with total funding reaching an unprecedented $12 billion, surpassing all previous records. This milestone reflects increasing investor confidence in India's digital economy and the innovative solutions emerging from Indian entrepreneurs.
                    </p>

                    <h2>Record-Breaking Year for Indian Startups</h2>
                    <p>
                        The funding landscape in 2025 has been characterized by larger deal sizes, more unicorns, and increasing participation from global investors. Fintech, e-commerce, and SaaS sectors led the funding rounds, with several companies achieving valuations exceeding $1 billion.
                    </p>

                    <h2>Key Sectors Driving Growth</h2>
                    <h3>1. Fintech Revolution</h3>
                    <p>
                        Financial technology continues to dominate the funding landscape, with digital payment solutions, neo-banking platforms, and wealth management apps attracting significant investments. The sector accounted for nearly 30% of total funding in 2025.
                    </p>

                    <h3>2. E-commerce and Quick Commerce</h3>
                    <p>
                        Quick commerce startups focusing on 10-15 minute delivery windows have seen explosive growth, with funding rounds averaging $50-100 million. The sector is transforming urban retail and consumer behavior across major metros.
                    </p>

                    <h3>3. Enterprise SaaS</h3>
                    <p>
                        Indian SaaS companies are increasingly targeting global markets, with several achieving ARR (Annual Recurring Revenue) milestones of $100 million+. The sector's global-first approach has attracted significant interest from international VCs.
                    </p>

                    <blockquote>
                        <p>"India's startup ecosystem is maturing rapidly. We're seeing not just more funding, but smarter capital allocation and sustainable business models."</p>
                        <cite>- Priya Sharma, Managing Partner, Venture Capital Insights</cite>
                    </blockquote>

                    <h2>The Unicorn Club Expands</h2>
                    <p>
                        2025 saw the birth of 23 new unicorns, bringing India's total unicorn count to over 130. These companies span diverse sectors from healthcare tech to clean energy, showcasing the breadth of innovation in the ecosystem.
                    </p>

                    <h2>Challenges and Opportunities Ahead</h2>
                    <p>
                        Despite the positive momentum, startups face challenges including:</p>
                    <ul>
                        <li><strong>Profitability Pressure:</strong> Investors increasingly demand clear paths to profitability</li>
                        <li><strong>Regulatory Compliance:</strong> Evolving regulations require robust compliance frameworks</li>
                        <li><strong>Talent Retention:</strong> Competition for skilled professionals remains intense</li>
                        <li><strong>Global Competition:</strong> Indian startups must compete with well-funded global players</li>
                    </ul>

                    <h2>Looking Forward</h2>
                    <p>
                        With strong fundamentals, supportive government policies, and a large addressable market, India's startup ecosystem is poised for continued growth. Experts predict 2026 could see even higher funding numbers as more sectors embrace digital transformation.
                    </p>
                `
            },
            '2': {
                category: 'Markets',
                categoryClass: 'markets',
                title: 'Nifty 50 Crosses 24,500 Mark on Strong IT Sector Performance',
                author: 'Sneha Kapoor',
                date: 'December 12, 2025',
                views: '22,180',
                readTime: '7 min',
                comments: '68',
                videoId: 'dHFaUxh_sBE',
                caption: 'Indian stock markets hit fresh all-time highs driven by IT and banking sectors',
                content: `
                    <p class="lead-paragraph">
                        Indian equity markets reached new milestones today as the Nifty 50 index crossed the 24,500 mark for the first time, driven by strong performances in the IT and banking sectors. The rally reflects positive investor sentiment around India's economic growth prospects and corporate earnings.
                    </p>

                    <h2>Market Performance Highlights</h2>
                    <p>
                        The Nifty 50 closed at 24,567.80, up 2.45% from the previous session, while the BSE Sensex gained 875 points to close at 81,234.50. Both indices hit fresh all-time highs during intraday trading, with strong buying interest across sectors.
                    </p>

                    <h2>IT Sector Leads the Rally</h2>
                    <p>
                        Technology stocks were the biggest gainers, with the Nifty IT index surging 4.2%. Major IT companies reported strong Q3 earnings, with deal wins in AI and cloud transformation projects driving optimism about future growth prospects.
                    </p>

                    <h3>Top IT Performers:</h3>
                    <ul>
                        <li><strong>TCS:</strong> +5.1% on large deal announcements</li>
                        <li><strong>Infosys:</strong> +4.8% after beating earnings estimates</li>
                        <li><strong>Wipro:</strong> +3.9% on strong digital revenue growth</li>
                        <li><strong>HCL Tech:</strong> +4.2% following strategic partnerships</li>
                    </ul>

                    <blockquote>
                        <p>"The IT sector's performance is a testament to India's position as a global technology hub. Strong demand for digital transformation is driving sustainable growth."</p>
                        <cite>- Vikram Mehta, Chief Market Strategist, Securities Firm</cite>
                    </blockquote>

                    <h2>Banking Sector Momentum</h2>
                    <p>
                        Banking stocks also contributed significantly to the rally, with the Bank Nifty index gaining 2.1%. Improved asset quality, strong credit growth, and healthy NIMs (Net Interest Margins) are supporting valuations in the sector.
                    </p>

                    <h2>FII and DII Activity</h2>
                    <p>
                        Foreign Institutional Investors (FIIs) were net buyers for the fifth consecutive session, pumping in ₹3,450 crores. Domestic Institutional Investors (DIIs) added ₹2,890 crores, demonstrating broad-based buying interest.
                    </p>

                    <h2>Market Outlook</h2>
                    <p>
                        Analysts remain bullish on Indian markets, citing strong macroeconomic fundamentals, robust corporate earnings, and continued foreign investment inflows. However, they advise caution around global factors and potential profit-taking at higher levels.
                    </p>

                    <h2>Key Levels to Watch</h2>
                    <ul>
                        <li><strong>Nifty Support:</strong> 24,200 - 24,000</li>
                        <li><strong>Nifty Resistance:</strong> 24,750 - 25,000</li>
                        <li><strong>Sensex Support:</strong> 80,500 - 80,000</li>
                        <li><strong>Sensex Resistance:</strong> 82,000 - 82,500</li>
                    </ul>
                `
            },
            '3': {
                category: 'Technology',
                categoryClass: 'technology',
                title: 'AI Adoption Accelerates: 70% of Indian Enterprises Deploy AI Solutions',
                author: 'Amit Patel',
                date: 'December 11, 2025',
                views: '18,920',
                readTime: '8 min',
                comments: '53',
                videoId: 'TXoQOkT8FiQ',
                caption: 'Survey reveals rapid AI adoption across Indian businesses',
                content: `
                    <p class="lead-paragraph">
                        A comprehensive survey of 500+ Indian enterprises reveals that 70% have deployed AI solutions across various business functions, marking a significant acceleration in artificial intelligence adoption. The trend is transforming how businesses operate, make decisions, and serve customers.
                    </p>

                    <h2>AI Adoption Reaches Critical Mass</h2>
                    <p>
                        The survey conducted by Tech Research Institute shows that AI adoption has more than doubled from 32% in 2023 to 70% in 2025. Companies are leveraging AI for customer service, data analytics, process automation, and predictive maintenance.
                    </p>

                    <h2>Key Use Cases Driving Adoption</h2>
                    
                    <h3>1. Customer Service Automation</h3>
                    <p>
                        AI-powered chatbots and virtual assistants are handling up to 60% of customer queries in leading enterprises, reducing response times from hours to seconds and significantly improving customer satisfaction scores.
                    </p>

                    <h3>2. Predictive Analytics</h3>
                    <p>
                        Businesses are using AI models to forecast demand, optimize inventory, and predict customer behavior with accuracy rates exceeding 85%. This is transforming supply chain management and business planning.
                    </p>

                    <h3>3. Process Automation</h3>
                    <p>
                        Robotic Process Automation (RPA) combined with AI is automating repetitive tasks in finance, HR, and operations, delivering cost savings of 30-40% while improving accuracy and speed.
                    </p>

                    <blockquote>
                        <p>"AI is no longer a futuristic concept—it's a present-day necessity for businesses looking to stay competitive in the digital age."</p>
                        <cite>- Dr. Rajesh Kumar, AI Research Lead</cite>
                    </blockquote>

                    <h2>Sector-Wise Adoption Rates</h2>
                    <ul>
                        <li><strong>Financial Services:</strong> 85% adoption rate</li>
                        <li><strong>E-commerce & Retail:</strong> 78% adoption rate</li>
                        <li><strong>Healthcare:</strong> 68% adoption rate</li>
                        <li><strong>Manufacturing:</strong> 65% adoption rate</li>
                        <li><strong>Telecom:</strong> 72% adoption rate</li>
                    </ul>

                    <h2>Investment in AI Capabilities</h2>
                    <p>
                        Indian enterprises are investing heavily in AI infrastructure, with average AI budgets increasing by 60% year-over-year. Major focus areas include cloud computing platforms, data infrastructure, and AI talent acquisition.
                    </p>

                    <h2>Challenges in AI Implementation</h2>
                    <ul>
                        <li><strong>Data Quality:</strong> 45% cite poor data quality as a major barrier</li>
                        <li><strong>Skill Gap:</strong> 52% struggle to find qualified AI professionals</li>
                        <li><strong>Integration:</strong> 38% face challenges integrating AI with legacy systems</li>
                        <li><strong>ROI Measurement:</strong> 35% find it difficult to measure AI ROI</li>
                    </ul>

                    <h2>Future Outlook</h2>
                    <p>
                        Experts predict that by 2027, over 90% of Indian enterprises will have some form of AI deployment. The focus is shifting from experimentation to scaling AI solutions across the organization for maximum business impact.
                    </p>
                `
            },
            'default': {
                category: 'Business',
                categoryClass: 'business',
                title: 'Latest Business News and Market Updates',
                author: 'BizzShort Team',
                date: 'December 12, 2025',
                views: '10,500',
                readTime: '5 min',
                comments: '28',
                videoId: 'fH8Ir7doWGk',
                caption: 'Stay updated with the latest business news and market insights',
                content: `
                    <p class="lead-paragraph">
                        Welcome to BizzShort's latest business news coverage. Stay informed about market movements, startup ecosystem updates, technology trends, and economic developments shaping India's business landscape.
                    </p>

                    <h2>Today's Top Stories</h2>
                    <p>
                        Indian markets continue their upward momentum with both Nifty and Sensex reaching new all-time highs. The startup ecosystem is witnessing record funding, while technology adoption accelerates across enterprises.
                    </p>

                    <h2>Market Overview</h2>
                    <p>
                        Equity markets are showing strong performance driven by positive corporate earnings, sustained foreign investment, and optimistic economic outlook. The IT and banking sectors are leading the rally.
                    </p>

                    <h2>Startup Ecosystem</h2>
                    <p>
                        India's startup ecosystem continues to thrive with increasing funding activity, new unicorn formations, and expanding global footprints. Fintech and SaaS sectors remain investor favorites.
                    </p>

                    <h2>Technology Trends</h2>
                    <p>
                        Artificial Intelligence, cloud computing, and digital transformation are driving business innovation. Enterprises are increasing their technology investments to stay competitive in the digital economy.
                    </p>

                    <p>
                        For more detailed coverage, explore our extensive collection of articles, videos, and market analysis on BizzShort.
                    </p>
                `
            }
        };

        this.init();
    }

    init() {
        // Load articles from localStorage
        this.loadStoredArticles();
        
        // Get article ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id') || 'default';
        
        // Load article content
        this.loadArticle(articleId);
    }
    
    loadStoredArticles() {
        // Load articles added via YouTube converter
        const stored = localStorage.getItem('bizzshortArticles');
        if (stored) {
            try {
                const storedArticles = JSON.parse(stored);
                // Merge stored articles with existing articles
                this.articles = { ...this.articles, ...storedArticles };
            } catch (e) {
                console.error('Error loading stored articles:', e);
            }
        }
    }

    loadArticle(articleId) {
        const article = this.articles[articleId] || this.articles['default'];
        
        // Update article category
        const categoryElement = document.querySelector('.article-category');
        if (categoryElement) {
            categoryElement.className = `article-category ${article.categoryClass}`;
            categoryElement.textContent = article.category;
        }

        // Update article title
        const titleElement = document.querySelector('.article-title');
        if (titleElement) {
            titleElement.textContent = article.title;
            document.title = `${article.title} - BizzShort`;
        }

        // Update author info
        const authorNameElement = document.querySelector('.author-name');
        if (authorNameElement) {
            authorNameElement.textContent = article.author;
        }

        const authorAvatarElement = document.querySelector('.author-avatar');
        if (authorAvatarElement) {
            authorAvatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=e74c3c&color=fff`;
        }

        // Update date
        const dateElement = document.querySelector('.publish-date');
        if (dateElement) {
            dateElement.innerHTML = `<i class="far fa-clock"></i> ${article.date}`;
        }

        // Update stats
        const statsElements = document.querySelectorAll('.article-stats span');
        if (statsElements.length >= 3) {
            statsElements[0].innerHTML = `<i class="far fa-eye"></i> ${article.views} views`;
            statsElements[1].innerHTML = `<i class="far fa-clock"></i> ${article.readTime} read`;
            statsElements[2].innerHTML = `<i class="far fa-comment"></i> ${article.comments} comments`;
        }

        // Update video
        const videoIframe = document.querySelector('.featured-image iframe');
        if (videoIframe && article.videoId) {
            videoIframe.src = `https://www.youtube.com/embed/${article.videoId}`;
        }

        // Update caption
        const captionElement = document.querySelector('.image-caption');
        if (captionElement) {
            captionElement.textContent = article.caption;
        }

        // Update article body
        const articleBody = document.querySelector('.article-body');
        if (articleBody) {
            articleBody.innerHTML = article.content;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ArticleManager());
} else {
    new ArticleManager();
}
