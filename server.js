// BizzShort Backend API Server
// Simple Node.js + Express API for BizzShort platform

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// ============ Mock Database ============
let articlesDB = [
    {
        id: 1,
        title: 'Indian Stock Market Hits New All-Time High',
        slug: 'indian-stock-market-hits-new-all-time-high',
        category: 'Market Updates',
        excerpt: 'Sensex crosses 85,000 mark for the first time driven by strong quarterly earnings from major tech companies.',
        content: '<p>Full article content here...</p>',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200',
        author: { name: 'Rajesh Kumar', avatar: '/avatars/rajesh.jpg' },
        publishedAt: '2025-11-30T10:00:00Z',
        views: 45234,
        likes: 892,
        readTime: 5,
        tags: ['Stock Market', 'Sensex', 'IT Sector', 'Investment']
    },
    {
        id: 2,
        title: 'Indian Startups Raise Record $12B in Funding This Quarter',
        slug: 'indian-startups-raise-record-funding',
        category: 'Business News',
        excerpt: 'Unprecedented growth in Indian startup ecosystem with record-breaking funding rounds.',
        content: '<p>Full article content here...</p>',
        image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=1200',
        author: { name: 'Priya Sharma', avatar: '/avatars/priya.jpg' },
        publishedAt: '2025-11-29T09:00:00Z',
        views: 38192,
        likes: 756,
        readTime: 4,
        tags: ['Startups', 'Funding', 'Venture Capital', 'Technology']
    }
];

let eventsDB = [
    {
        id: 1,
        title: 'India Business Summit 2025',
        slug: 'india-business-summit-2025',
        description: 'Annual gathering of business leaders, entrepreneurs, and investors.',
        date: '2025-12-15',
        endDate: '2025-12-17',
        location: 'Mumbai Convention Center',
        city: 'Mumbai',
        category: 'Conference',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
        attendees: 500,
        maxAttendees: 1000,
        price: 5000,
        currency: 'INR'
    }
];

let analyticsDB = {
    visitors: { total: 245382, growth: 12.5 },
    pageViews: { total: 1200000, growth: 18.3 },
    avgSessionTime: { value: '4:32', growth: 8.7 },
    bounceRate: { value: 32.4, growth: -5.2 }
};

// ============ API Routes ============

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'BizzShort API',
        version: '1.0.0'
    });
});

// -------- Articles Endpoints --------

// Get all articles
app.get('/api/articles', (req, res) => {
    const { page = 1, limit = 10, category, search } = req.query;
    
    let filtered = [...articlesDB];
    
    // Filter by category
    if (category) {
        filtered = filtered.filter(a => a.category === category);
    }
    
    // Search
    if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(a => 
            a.title.toLowerCase().includes(query) ||
            a.excerpt.toLowerCase().includes(query)
        );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginated = filtered.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        data: {
            articles: paginated,
            total: filtered.length,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(filtered.length / limit)
        }
    });
});

// Get single article
app.get('/api/articles/:id', (req, res) => {
    const article = articlesDB.find(a => a.id == req.params.id);
    
    if (!article) {
        return res.status(404).json({ 
            success: false, 
            error: 'Article not found' 
        });
    }
    
    // Increment views
    article.views++;
    
    res.json({ success: true, data: article });
});

// Get trending articles
app.get('/api/articles/trending', (req, res) => {
    const trending = [...articlesDB]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    
    res.json({ success: true, data: trending });
});

// Get popular articles
app.get('/api/articles/popular', (req, res) => {
    const popular = [...articlesDB]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);
    
    res.json({ success: true, data: popular });
});

// Get latest articles
app.get('/api/articles/latest', (req, res) => {
    const { limit = 10 } = req.query;
    const latest = [...articlesDB]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, parseInt(limit));
    
    res.json({ success: true, data: latest });
});

// Get categories
app.get('/api/categories', (req, res) => {
    const categories = [...new Set(articlesDB.map(a => a.category))];
    res.json({ success: true, data: categories });
});

// -------- Analytics Endpoints --------

app.get('/api/analytics', (req, res) => {
    const { period = '7d' } = req.query;
    
    res.json({ 
        success: true, 
        data: {
            ...analyticsDB,
            period
        }
    });
});

app.get('/api/analytics/traffic', (req, res) => {
    const trafficData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        visitors: [32000, 35000, 38000, 42000, 39000, 45000, 48000],
        pageViews: [128000, 140000, 152000, 168000, 156000, 180000, 192000]
    };
    
    res.json({ success: true, data: trafficData });
});

app.get('/api/analytics/sources', (req, res) => {
    const sources = {
        direct: 45000,
        google: 38000,
        social: 28000,
        referral: 15000,
        email: 12000
    };
    
    res.json({ success: true, data: sources });
});

// -------- Newsletter Endpoint --------

app.post('/api/newsletter/subscribe', (req, res) => {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid email address' 
        });
    }
    
    // In production, save to database
    console.log('Newsletter subscription:', email);
    
    res.json({ 
        success: true, 
        message: 'Successfully subscribed to newsletter!' 
    });
});

// -------- Contact Endpoint --------

app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            error: 'Name, email, and message are required' 
        });
    }
    
    // In production, save to database and send email
    console.log('Contact form submission:', { name, email, phone, message });
    
    res.json({ 
        success: true, 
        message: 'Your message has been sent successfully!' 
    });
});

// -------- Events Endpoints --------

app.get('/api/events', (req, res) => {
    const { category, city } = req.query;
    
    let filtered = [...eventsDB];
    
    if (category) {
        filtered = filtered.filter(e => e.category === category);
    }
    
    if (city) {
        filtered = filtered.filter(e => e.city === city);
    }
    
    res.json({ success: true, data: filtered });
});

app.get('/api/events/:id', (req, res) => {
    const event = eventsDB.find(e => e.id == req.params.id);
    
    if (!event) {
        return res.status(404).json({ 
            success: false, 
            error: 'Event not found' 
        });
    }
    
    res.json({ success: true, data: event });
});

app.post('/api/events/:id/register', (req, res) => {
    const { name, email, phone, company } = req.body;
    const event = eventsDB.find(e => e.id == req.params.id);
    
    if (!event) {
        return res.status(404).json({ 
            success: false, 
            error: 'Event not found' 
        });
    }
    
    if (event.attendees >= event.maxAttendees) {
        return res.status(400).json({ 
            success: false, 
            error: 'Event is full' 
        });
    }
    
    // In production, save registration
    event.attendees++;
    console.log('Event registration:', { eventId: event.id, name, email });
    
    res.json({ 
        success: true, 
        message: 'Successfully registered for event!' 
    });
});

// -------- Advertisement Endpoints --------

app.post('/api/advertisements/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            error: 'No file uploaded' 
        });
    }
    
    const adData = {
        id: Date.now(),
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        title: req.body.title || 'Untitled Ad',
        link: req.body.link || '',
        uploadedAt: new Date().toISOString()
    };
    
    res.json({ 
        success: true, 
        data: adData,
        message: 'Advertisement uploaded successfully!' 
    });
});

// -------- Search Endpoint --------

app.get('/api/search', (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ 
            success: false, 
            error: 'Search query required' 
        });
    }
    
    const query = q.toLowerCase();
    const results = articlesDB.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    res.json({ 
        success: true, 
        data: {
            query: q,
            results,
            total: results.length
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: err.message || 'Internal server error' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Endpoint not found' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 BizzShort API Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📰 Articles: http://localhost:${PORT}/api/articles`);
});

module.exports = app;
