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
let articlesDB = [];
let eventsDB = [];
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
