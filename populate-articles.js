// Sample Articles Populator for BizzShort
// This script adds sample articles to your MongoDB database

const mongoose = require('mongoose');
const Article = require('./models/Article');

// Sample articles data
const sampleArticles = [
    {
        title: "Understanding India's Economic Growth in 2026",
        slug: "understanding-india-economic-growth-2026",
        category: "BUSINESS",
        excerpt: "Detailed analysis of economic indicators and market trends shaping India's growth trajectory in 2026.",
        content: `India's economy continues to show robust growth in 2026, with GDP projections indicating a strong performance across multiple sectors. This comprehensive analysis explores the key drivers behind this growth and what it means for investors and businesses.

Economic Indicators
The Indian economy has demonstrated resilience through various challenges, with key indicators pointing towards sustained growth. Manufacturing, services, and agriculture sectors have all contributed to this positive trajectory.

Market Trends
Several emerging trends are shaping the economic landscape, including digital transformation, sustainable development initiatives, and increased foreign direct investment in key sectors.

Investment Opportunities
With a growing middle class and increasing consumer spending, India presents numerous opportunities for both domestic and international investors. The government's focus on infrastructure development and ease of doing business reforms has created a favorable investment climate.

Conclusion
As we progress through 2026, India's economic outlook remains positive, supported by strong fundamentals and progressive policy reforms.`,
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800",
        author: {
            name: "Rajesh Kumar",
            avatar: "",
            bio: "Senior Economic Analyst with over 15 years of experience in macroeconomic research and policy analysis."
        },
        tags: ["Economy", "GDP", "Investment", "India", "Growth"],
        status: "PUBLISHED",
        views: 5234,
        readTime: 7,
        publishedAt: new Date("2026-01-20")
    },
    {
        title: "Rise of Indian Unicorns: 2026 Edition",
        slug: "rise-indian-unicorns-2026",
        category: "STARTUPS",
        excerpt: "How Indian startups are revolutionizing global markets with innovative solutions and breaking valuation records.",
        content: `The Indian startup ecosystem has witnessed unprecedented growth in 2026, with numerous companies achieving unicorn status. This article explores the factors behind this surge and profiles some of the most promising startups.

The Unicorn Boom
India has become the third-largest startup ecosystem globally, producing unicorns across various sectors including fintech, edtech, healthtech, and e-commerce.

Success Stories
Several startups have not only achieved unicorn status but are also expanding internationally, bringing Indian innovation to global markets.

Investment Landscape
Venture capital funding has reached new heights, with both domestic and international investors showing strong interest in Indian startups. The ecosystem is maturing with better support infrastructure and mentorship programs.

Challenges and Opportunities
While the growth is impressive, startups face challenges including regulatory compliance, talent acquisition, and sustainable scaling. However, the opportunities far outweigh the challenges.

Future Outlook
The future looks bright for Indian startups, with predictions of more unicorns emerging in 2026 and beyond, especially in emerging sectors like AI, blockchain, and clean energy.`,
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
        author: {
            name: "Priya Sharma",
            avatar: "",
            bio: "Startup ecosystem expert and venture capital analyst specializing in Indian markets."
        },
        tags: ["Startups", "Unicorns", "Innovation", "Venture Capital", "Entrepreneurship"],
        status: "PUBLISHED",
        views: 8127,
        readTime: 8,
        publishedAt: new Date("2026-01-18")
    },
    {
        title: "Stock Market Strategies for Long-Term Investors",
        slug: "stock-market-strategies-long-term-investors",
        category: "MARKETS",
        excerpt: "Expert insights on building a robust investment portfolio in volatile markets with time-tested strategies.",
        content: `Long-term investing requires patience, discipline, and a well-thought-out strategy. This comprehensive guide provides insights into building and managing a portfolio for sustained growth.

Understanding Market Volatility
Market fluctuations are normal and should not deter long-term investors. Understanding the nature of volatility helps in making informed decisions rather than emotional ones.

Diversification Principles
A well-diversified portfolio across sectors, market caps, and asset classes is crucial for risk management and consistent returns.

Value Investing
Identifying undervalued stocks with strong fundamentals remains a time-tested approach for long-term wealth creation.

Growth vs. Value
Understanding when to invest in growth stocks versus value stocks can significantly impact portfolio performance.

Regular Portfolio Review
While long-term investing doesn't mean ignoring your portfolio, it's important to review and rebalance periodically to ensure alignment with financial goals.

Tax Efficiency
Utilizing tax-advantaged accounts and understanding capital gains implications can enhance overall returns.`,
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
        author: {
            name: "Amit Patel",
            avatar: "",
            bio: "Chartered Financial Analyst with 20 years of experience in equity markets and portfolio management."
        },
        tags: ["Stock Market", "Investment", "Portfolio", "Strategy", "Finance"],
        status: "PUBLISHED",
        views: 12345,
        readTime: 9,
        publishedAt: new Date("2026-01-15")
    },
    {
        title: "AI Transformation in Indian Businesses",
        slug: "ai-transformation-indian-businesses",
        category: "TECHNOLOGY",
        excerpt: "Exploring how artificial intelligence is reshaping traditional business models across Indian industries.",
        content: `Artificial Intelligence is no longer a futuristic concept but a present reality transforming businesses across India. This article examines the AI revolution and its impact on various sectors.

AI Adoption Trends
Indian businesses are increasingly adopting AI technologies for automation, customer service, data analysis, and decision-making processes.

Industry Applications
From banking and finance to healthcare and retail, AI is being deployed to solve complex problems and improve operational efficiency.

Chatbots and Customer Service
AI-powered chatbots are revolutionizing customer interactions, providing 24/7 support and personalized experiences.

Predictive Analytics
Businesses are leveraging AI for predictive analytics to forecast trends, manage inventory, and optimize pricing strategies.

Challenges in Implementation
While AI offers tremendous benefits, implementation challenges include data quality, skill gaps, and integration with existing systems.

The Road Ahead
As AI technology continues to evolve, Indian businesses that embrace this transformation early will have a significant competitive advantage.`,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        author: {
            name: "Dr. Sneha Reddy",
            avatar: "",
            bio: "AI researcher and technology consultant helping businesses navigate digital transformation."
        },
        tags: ["Artificial Intelligence", "Technology", "Innovation", "Digital Transformation", "Automation"],
        status: "PUBLISHED",
        views: 6789,
        readTime: 6,
        publishedAt: new Date("2026-01-22")
    },
    {
        title: "Banking Sector Reforms and Digital Finance",
        slug: "banking-sector-reforms-digital-finance",
        category: "FINANCE",
        excerpt: "Comprehensive guide to understanding recent banking reforms and the surge in digital payment adoption.",
        content: `The Indian banking sector is undergoing significant transformation with new reforms and the rapid adoption of digital finance solutions. This article provides a comprehensive overview of these changes.

Recent Banking Reforms
The government and RBI have introduced several reforms aimed at strengthening the banking sector, improving governance, and enhancing customer protection.

Digital Payment Revolution
UPI, digital wallets, and contactless payments have transformed how Indians transact, with digital payments becoming the norm rather than the exception.

Fintech Partnerships
Traditional banks are partnering with fintech companies to offer innovative products and services, creating a more competitive and customer-friendly ecosystem.

Financial Inclusion
Digital banking is playing a crucial role in bringing banking services to underserved populations, especially in rural areas.

Cybersecurity Concerns
With increased digital adoption comes the need for robust cybersecurity measures to protect customer data and prevent fraud.

Future of Banking
The future of banking in India is digital, with AI, blockchain, and other emerging technologies set to further transform the sector.`,
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
        author: {
            name: "Vikram Singh",
            avatar: "",
            bio: "Banking sector analyst and digital finance expert with expertise in fintech innovations."
        },
        tags: ["Banking", "Digital Finance", "UPI", "Fintech", "Financial Inclusion"],
        status: "PUBLISHED",
        views: 9432,
        readTime: 7,
        publishedAt: new Date("2026-01-19")
    },
    {
        title: "Export Growth and Trade Opportunities",
        slug: "export-growth-trade-opportunities",
        category: "ECONOMY",
        excerpt: "Analysis of India's export performance and emerging global trade partnerships creating new opportunities.",
        content: `India's export sector has shown remarkable resilience and growth, opening new opportunities for businesses. This article analyzes recent trends and future prospects.

Export Performance Overview
Indian exports have reached new highs across various sectors including pharmaceuticals, IT services, textiles, and engineering goods.

Key Export Markets
Traditional markets like the US and Europe continue to be important, while new opportunities are emerging in Africa, Latin America, and Southeast Asia.

Trade Agreements
Recent free trade agreements and bilateral partnerships are creating favorable conditions for Indian exporters.

Manufacturing Exports
The Make in India initiative has boosted manufacturing exports, with India becoming a preferred alternative to China for many global companies.

Services Exports
India's IT and business services exports continue to grow, with the country maintaining its position as a global technology hub.

Challenges and Support
While opportunities abound, exporters face challenges including logistics costs, compliance requirements, and currency fluctuations. Government support schemes are helping address these issues.`,
        image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800",
        author: {
            name: "Meera Desai",
            avatar: "",
            bio: "International trade expert and economist specializing in export promotion and trade policy."
        },
        tags: ["Exports", "Trade", "International Business", "Make in India", "Global Markets"],
        status: "PUBLISHED",
        views: 4856,
        readTime: 6,
        publishedAt: new Date("2026-01-21")
    }
];

// MongoDB connection and population
async function populateArticles() {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizzshort';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // Clear existing articles (optional - comment out if you want to keep existing)
        // await Article.deleteMany({});
        // console.log('🗑️  Cleared existing articles');

        // Insert sample articles
        const result = await Article.insertMany(sampleArticles);
        console.log(`✅ Added ${result.length} sample articles`);

        // Display added articles
        result.forEach((article, index) => {
            console.log(`\n${index + 1}. ${article.title}`);
            console.log(`   Category: ${article.category}`);
            console.log(`   Slug: ${article.slug}`);
            console.log(`   Views: ${article.views}`);
        });

        console.log('\n✨ Sample articles populated successfully!');
    } catch (error) {
        console.error('❌ Error populating articles:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the population script
if (require.main === module) {
    populateArticles();
}

module.exports = { sampleArticles, populateArticles };
