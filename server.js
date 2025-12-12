// BizzShort Backend API Server - Complete Version
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Only image files allowed!'));
    }
});

// Mock Database
let articlesDB = [
    {
        id: 1,
        title: 'Nifty 50 Crosses Historic 25,000 Mark: Complete Market Analysis',
        slug: 'nifty-50-crosses-25000-market-analysis',
        category: 'Markets',
        excerpt: 'The Indian stock market reached an unprecedented milestone as Nifty 50 crossed 25,000 for the first time. Analysis of sectoral performance and investment strategies.',
        content: '<h3>Historic Market Milestone</h3><p>The Indian stock market reached an unprecedented milestone today as the Nifty 50 index crossed the 25,000 mark for the first time in its history. This represents a gain of over 18% year-to-date and reflects strong investor confidence in India\'s economic growth story.</p><h3>Key Drivers Behind the Rally</h3><p>Several factors have contributed to this remarkable market performance: Strong Corporate Earnings showing robust growth across sectors, Foreign Institutional Investors pumping in ₹45,000 crores in the last quarter, India\'s GDP growing at 7.6% in Q2, and a stable macro environment with lower inflation and favorable government policies.</p>',
        image: 'https://img.youtube.com/vi/fH8Ir7doWGk/maxresdefault.jpg',
        author: { name: 'BizzShort Market Team', avatar: 'https://ui-avatars.com/api/?name=Market+Team&background=3498db&color=fff' },
        publishedAt: '2025-12-11T09:00:00Z',
        views: 2547,
        likes: 189,
        readTime: 8,
        tags: ['Markets', 'Nifty', 'Stock Market', 'Investment']
    },
    {
        id: 2,
        title: 'Indian Economy Update: 7.6% GDP Growth Beats Expectations',
        slug: 'indian-economy-gdp-growth-update',
        category: 'Economy',
        excerpt: 'India maintains its position as the fastest-growing major economy with Q2 GDP growth of 7.6%, surpassing analyst expectations and global trends.',
        content: '<h3>Economic Resilience</h3><p>India\'s economy demonstrated remarkable resilience with a 7.6% GDP growth rate in Q2 2025, outperforming analyst estimates and maintaining the country\'s status as the world\'s fastest-growing major economy.</p><h3>Sectoral Contributions</h3><p>The services sector led the growth with 8.2% expansion, followed by manufacturing at 6.8% and agriculture at 4.5%. Government infrastructure spending and private consumption remained key drivers.</p><h3>Future Outlook</h3><p>Economists project full-year growth between 7.2-7.8%, supported by strong domestic demand, increasing digitalization, and government reforms.</p>',
        image: 'https://img.youtube.com/vi/TXoQOkT8FiQ/maxresdefault.jpg',
        author: { name: 'Economics Desk', avatar: 'https://ui-avatars.com/api/?name=Economics+Desk&background=27ae60&color=fff' },
        publishedAt: '2025-12-10T10:30:00Z',
        views: 3124,
        likes: 245,
        readTime: 6,
        tags: ['Economy', 'GDP', 'Growth', 'India']
    },
    {
        id: 3,
        title: 'Startup Funding Boom: $2.3 Billion Invested in Q4 2025',
        slug: 'startup-funding-boom-q4-2025',
        category: 'Startups',
        excerpt: 'Indian startups raised $2.3 billion in Q4 2025, marking a 45% increase from previous quarter. Fintech and AI sectors lead the funding rounds.',
        content: '<h3>Funding Renaissance</h3><p>The Indian startup ecosystem witnessed a remarkable funding revival in Q4 2025, with venture capital investments reaching $2.3 billion across 287 deals, representing a 45% quarter-on-quarter increase.</p><h3>Sector-wise Breakdown</h3><p>Fintech startups attracted 32% of total funding at $736 million, followed by AI/ML companies at 24% ($552 million), e-commerce at 18% ($414 million), and healthcare tech at 15% ($345 million).</p><h3>Mega Deals</h3><p>Five startups achieved unicorn status this quarter, with valuations exceeding $1 billion. Notable funding rounds include a $150 million Series D for a fintech platform and $120 million Series C for an AI-powered logistics company.</p>',
        image: 'https://img.youtube.com/vi/ZZND7BcDA_c/maxresdefault.jpg',
        author: { name: 'Startup Reporter', avatar: 'https://ui-avatars.com/api/?name=Startup+Reporter&background=e74c3c&color=fff' },
        publishedAt: '2025-12-09T14:15:00Z',
        views: 4521,
        likes: 367,
        readTime: 7,
        tags: ['Startups', 'Funding', 'Unicorn', 'Investment']
    },
    {
        id: 4,
        title: 'Technology Sector Surges: AI Adoption Drives Growth',
        slug: 'technology-sector-ai-adoption-growth',
        category: 'Technology',
        excerpt: 'India\'s IT sector reports 24% YTD gains as companies accelerate AI integration. TCS, Infosys lead with strong order books and margin expansion.',
        content: '<h3>Tech Transformation</h3><p>India\'s technology sector is experiencing unprecedented growth, with the sector index gaining 24% year-to-date, driven primarily by increased adoption of artificial intelligence and cloud computing solutions across global enterprises.</p><h3>Industry Leaders</h3><p>Major IT services companies reported stellar Q2 results. TCS posted 12.5% revenue growth with improved margins, Infosys signed deals worth $4.2 billion, and HCL Tech expanded its product portfolio with three strategic acquisitions.</p><h3>AI Revolution</h3><p>Over 65% of Indian tech companies have integrated AI into their operations, focusing on generative AI, machine learning, and automation solutions. This transition is creating 200,000+ high-skilled jobs.</p>',
        image: 'https://img.youtube.com/vi/B8ulzu1X8Y8/maxresdefault.jpg',
        author: { name: 'Tech Analyst', avatar: 'https://ui-avatars.com/api/?name=Tech+Analyst&background=9b59b6&color=fff' },
        publishedAt: '2025-12-08T11:45:00Z',
        views: 2890,
        likes: 198,
        readTime: 5,
        tags: ['Technology', 'AI', 'IT Sector', 'Innovation']
    },
    {
        id: 5,
        title: 'Banking Sector Strength: NPAs Hit Decade Low',
        slug: 'banking-sector-npa-lowest-decade',
        category: 'Banking',
        excerpt: 'Indian banks report lowest NPA levels in a decade at 2.8%, coupled with 15%+ credit growth. Digital lending and strong corporate demand fuel expansion.',
        content: '<h3>Banking Health Improves</h3><p>The Indian banking sector has achieved a remarkable turnaround, with Non-Performing Assets (NPAs) declining to 2.8%, the lowest level in over a decade. This improvement reflects better risk management and economic recovery.</p><h3>Credit Growth Accelerates</h3><p>Bank credit grew 15.2% year-on-year, driven by retail loans (housing, auto, personal) growing at 17% and corporate lending at 12%. Digital lending platforms processed 45% of all new loans.</p><h3>Profitability Surge</h3><p>Public sector banks reported combined profits of ₹1.2 lakh crores in FY2025, while private banks maintained ROE above 16%. HDFC Bank, ICICI Bank, and SBI led the performance metrics.</p>',
        image: 'https://img.youtube.com/vi/Pq4wzBT0Fh4/maxresdefault.jpg',
        author: { name: 'Banking Correspondent', avatar: 'https://ui-avatars.com/api/?name=Banking+Correspondent&background=f39c12&color=fff' },
        publishedAt: '2025-12-07T09:20:00Z',
        views: 1876,
        likes: 142,
        readTime: 6,
        tags: ['Banking', 'NPA', 'Credit Growth', 'Finance']
    }
];
let eventsDB = [
    {
        id: 1,
        name: 'India Fintech Summit 2025',
        date: '2026-01-15',
        location: 'Mumbai, Maharashtra',
        description: 'Annual gathering of fintech leaders, investors, and innovators to discuss the future of digital finance in India.',
        status: 'upcoming',
        registrations: 450,
        maxAttendees: 1000,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Startup Pitch Day',
        date: '2026-01-22',
        location: 'Bangalore, Karnataka',
        description: 'Early-stage startups pitch to VCs and angel investors. Networking session and mentorship opportunities included.',
        status: 'upcoming',
        registrations: 120,
        maxAttendees: 200,
        createdAt: new Date().toISOString()
    }
];
let interviewsDB = [];
let newsDB = [];
let industryDB = [];
let clientsDB = [];
let usersDB = [
    { id: 1, name: 'John Doe', email: 'john@bizzshort.com', role: 'EDITOR', status: 'ACTIVE', joined: 'Jan 15, 2025' }
];
let analyticsDB = {
    totalArticles: 0,
    activeUsers: 45678,
    pageViews: 2300000,
    events: 0,
    articlesTrend: '+12%',
    usersTrend: '+8%',
    viewsTrend: '+15%',
    eventsTrend: 'Same',
    monthlyTraffic: [120000, 145000, 165000, 189000, 210000, 235000],
    contentDistribution: { articles: 45, videos: 30, interviews: 15, events: 10 }
};

// ============ API Routes ============

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// Analytics
app.get('/api/analytics', (req, res) => {
    analyticsDB.totalArticles = articlesDB.length;
    analyticsDB.events = eventsDB.length;
    res.json({ success: true, data: analyticsDB });
});

// Articles
app.get('/api/articles', (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;
    let filtered = category ? articlesDB.filter(a => a.category.toLowerCase() === category.toLowerCase()) : [...articlesDB];
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + parseInt(limit));
    res.json({
        success: true,
        data: paginated,
        pagination: { page: parseInt(page), limit: parseInt(limit), total: filtered.length, pages: Math.ceil(filtered.length / limit) }
    });
});

app.get('/api/articles/:id', (req, res) => {
    const article = articlesDB.find(a => a.id === parseInt(req.params.id));
    if (!article) return res.status(404).json({ success: false, error: 'Article not found' });
    res.json({ success: true, data: article });
});

app.post('/api/articles', upload.single('image'), (req, res) => {
    try {
        const { title, category, excerpt, content, author, tags } = req.body;
        const newArticle = {
            id: articlesDB.length + 1,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: category || 'Business',
            excerpt: excerpt || '',
            content: content || '',
            image: req.file ? `/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200',
            author: author ? JSON.parse(author) : { name: 'BizzShort Team', avatar: '/avatars/default.jpg' },
            publishedAt: new Date().toISOString(),
            views: 0,
            likes: 0,
            readTime: 5,
            tags: tags ? JSON.parse(tags) : []
        };
        articlesDB.push(newArticle);
        res.status(201).json({ success: true, data: newArticle, message: 'Article created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create article' });
    }
});

app.put('/api/articles/:id', upload.single('image'), (req, res) => {
    try {
        const index = articlesDB.findIndex(a => a.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ success: false, error: 'Article not found' });
        
        const { title, category, excerpt, content } = req.body;
        articlesDB[index] = {
            ...articlesDB[index],
            title: title || articlesDB[index].title,
            category: category || articlesDB[index].category,
            excerpt: excerpt || articlesDB[index].excerpt,
            content: content || articlesDB[index].content,
            image: req.file ? `/uploads/${req.file.filename}` : articlesDB[index].image,
            updatedAt: new Date().toISOString()
        };
        res.json({ success: true, data: articlesDB[index], message: 'Article updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update article' });
    }
});

app.delete('/api/articles/:id', (req, res) => {
    const index = articlesDB.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Article not found' });
    articlesDB.splice(index, 1);
    res.json({ success: true, message: 'Article deleted successfully' });
});

// Events
app.get('/api/events', (req, res) => {
    res.json({ success: true, data: eventsDB });
});

app.post('/api/events', (req, res) => {
    try {
        const { name, date, location, description, status } = req.body;
        const newEvent = {
            id: eventsDB.length + 1,
            name,
            date,
            location,
            description,
            status: status || 'upcoming',
            registrations: 0,
            createdAt: new Date().toISOString()
        };
        eventsDB.push(newEvent);
        res.status(201).json({ success: true, data: newEvent, message: 'Event created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create event' });
    }
});

app.put('/api/events/:id', (req, res) => {
    try {
        const index = eventsDB.findIndex(e => e.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ success: false, error: 'Event not found' });
        const { name, date, location, description, status } = req.body;
        eventsDB[index] = {
            ...eventsDB[index],
            name: name || eventsDB[index].name,
            date: date || eventsDB[index].date,
            location: location || eventsDB[index].location,
            description: description || eventsDB[index].description,
            status: status || eventsDB[index].status,
            updatedAt: new Date().toISOString()
        };
        res.json({ success: true, data: eventsDB[index], message: 'Event updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update event' });
    }
});

app.delete('/api/events/:id', (req, res) => {
    const index = eventsDB.findIndex(e => e.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Event not found' });
    eventsDB.splice(index, 1);
    res.json({ success: true, message: 'Event deleted successfully' });
});

// Interviews
app.get('/api/interviews', (req, res) => {
    res.json({ success: true, data: interviewsDB });
});

app.post('/api/interviews', upload.single('image'), (req, res) => {
    try {
        const { name, title, company, description } = req.body;
        const newInterview = {
            id: interviewsDB.length + 1,
            name, title, company, description,
            image: req.file ? `/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
            createdAt: new Date().toISOString()
        };
        interviewsDB.push(newInterview);
        res.status(201).json({ success: true, data: newInterview, message: 'Interview created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create interview' });
    }
});

app.delete('/api/interviews/:id', (req, res) => {
    const index = interviewsDB.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Interview not found' });
    interviewsDB.splice(index, 1);
    res.json({ success: true, message: 'Interview deleted successfully' });
});

// News, Industry, Clients
app.get('/api/news', (req, res) => res.json({ success: true, data: newsDB }));
app.get('/api/industry', (req, res) => res.json({ success: true, data: industryDB }));
app.get('/api/clients', (req, res) => res.json({ success: true, data: clientsDB }));
app.get('/api/users', (req, res) => res.json({ success: true, data: usersDB }));

// Contact & Newsletter
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, error: 'Missing required fields' });
    console.log('📧 Contact:', { name, email, subject });
    res.json({ success: true, message: 'Thank you! We will get back to you soon.' });
});

app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email' });
    }
    console.log('📬 Newsletter:', email);
    res.json({ success: true, message: 'Successfully subscribed!' });
});

// Error handlers
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: 'API endpoint not found', endpoint: req.originalUrl });
});

app.use((req, res) => {
    const file404 = path.join(__dirname, '404.html');
    fs.existsSync(file404) ? res.status(404).sendFile(file404) : res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 BizzShort API Server running on http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`📰 Articles: http://localhost:${PORT}/api/articles`);
    console.log(`🔐 Admin: http://localhost:${PORT}/admin-login.html\n`);
});

module.exports = app;
