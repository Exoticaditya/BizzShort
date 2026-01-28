const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const validator = require('validator');

// Load env vars
dotenv.config();

// Connect to Database (non-blocking for faster server startup)
// This allows the server to start and respond to health checks while DB connects
connectDB().catch(err => console.error('Initial DB connection error:', err));

// Models
const Article = require('./models/Article');
const Event = require('./models/Event');
const Interview = require('./models/Interview');
const News = require('./models/News');
const IndustryUpdate = require('./models/IndustryUpdate');
const Client = require('./models/Client');
const User = require('./models/User');
const Advertisement = require('./models/Advertisement');
const Video = require('./models/Video');


const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
// Set security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'unsafe-hashes'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://www.googletagmanager.com", "https://pagead2.googlesyndication.com"],
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "https://bizzshort.onrender.com", "https://www.bizzshort.com", "https://www.google-analytics.com", "https://analytics.google.com"],
            frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://youtube.com", "https://www.instagram.com"],
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Stricter rate limit for authentication
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
});

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// CORS Configuration with whitelist
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);

if (allowedOrigins.length === 0) {
    // Default allowed origins if not configured
    allowedOrigins.push(
        'https://bizzshort.com',
        'https://www.bizzshort.com',
        'https://bizzshort.onrender.com',
        'http://localhost:3000'
    );
}

const corsOptions = {
    origin: '*', // Allow all origins (can be restricted later)
    credentials: false,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'session-id']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname))); // Serve Admin Panel

// Trust proxy (required for Render deployment)
app.set('trust proxy', true);

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
const conditionalUpload = (fieldName) => (req, res, next) => {
    if (req.is('json')) return next();
    return upload.single(fieldName)(req, res, next);
};


// ============ Helper Functions ============
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

// ============ Middleware ============
const protect = async (req, res, next) => {
    let token;

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, error: 'User not found' });
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    } else if (req.headers['session-id']) {
        // Backward compatibility for existing frontend using session-id header
        try {
            token = req.headers['session-id'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, error: 'User not found' });
            }

            next();
        } catch (error) {
            res.status(401).json({ success: false, error: 'Not authorized, invalid session' });
        }
    } else {
        res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
};

// ============ Setup Route (Emergency Seed) ============

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Check database connection
        const dbStatus = require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected';

        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: dbStatus,
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'production'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// ============ Instagram Thumbnail Proxy ============
// Cache for Instagram thumbnails (24 hour TTL)
const instagramCache = new Map();
const INSTAGRAM_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

app.get('/api/instagram-thumbnail/:reelId', async (req, res) => {
    const { reelId } = req.params;

    if (!reelId || reelId.length < 5) {
        return res.status(400).json({ success: false, error: 'Invalid reel ID' });
    }

    // Check cache first
    const cached = instagramCache.get(reelId);
    if (cached && (Date.now() - cached.timestamp) < INSTAGRAM_CACHE_TTL) {
        return res.json({ success: true, data: cached.data });
    }

    try {
        const reelUrl = `https://www.instagram.com/reel/${reelId}/`;
        const oEmbedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(reelUrl)}`;

        const response = await fetch(oEmbedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const result = {
                thumbnailUrl: data.thumbnail_url || null,
                title: data.title || null,
                authorName: data.author_name || 'bizz_short'
            };

            // Cache the result
            instagramCache.set(reelId, { data: result, timestamp: Date.now() });

            return res.json({ success: true, data: result });
        } else {
            console.log(`Instagram oEmbed failed for ${reelId}: ${response.status}`);
            return res.json({
                success: false,
                error: 'Instagram API unavailable',
                usePlaceholder: true
            });
        }
    } catch (error) {
        console.error(`Instagram thumbnail error for ${reelId}:`, error.message);
        return res.json({
            success: false,
            error: 'Failed to fetch thumbnail',
            usePlaceholder: true
        });
    }
});

// ============ News with Photos API (Currents API - Free) ============
// Cache for news articles (1 hour TTL)  
const newsCache = { data: null, timestamp: 0 };
const NEWS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

app.get('/api/news-with-images', async (req, res) => {
    // Check cache first
    if (newsCache.data && (Date.now() - newsCache.timestamp) < NEWS_CACHE_TTL) {
        console.log('📰 Returning cached news');
        return res.json({ success: true, data: newsCache.data, cached: true });
    }

    try {
        // Using Currents API (free tier - 600 requests/day)
        const apiKey = process.env.CURRENTS_API_KEY || 'bkG7YBkB8bS1TaIMbWHFzD8bDh4VcRnJWILU11YTEWAMpGW2';

        const apiUrl = `https://api.currentsapi.services/v1/search?` +
            `keywords=business,finance,economy,stock market,startup` +
            `&language=en` +
            `&country=IN` +
            `&apiKey=${apiKey}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Currents API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'ok' && data.news && data.news.length > 0) {
            const articlesWithImages = data.news
                .filter(article => article.image && article.image !== 'None' && article.image.startsWith('http'))
                .slice(0, 12)
                .map(article => ({
                    title: article.title,
                    description: article.description,
                    image: article.image,
                    url: article.url,
                    source: article.author || 'News Source',
                    category: article.category && article.category.length > 0 ? article.category[0] : 'Business',
                    publishedAt: article.published
                }));

            if (articlesWithImages.length > 0) {
                newsCache.data = articlesWithImages;
                newsCache.timestamp = Date.now();

                console.log(`📰 Fetched ${articlesWithImages.length} news articles with images`);
                return res.json({ success: true, data: articlesWithImages });
            }
        }

        const fallbackNews = getFallbackNewsArticles();
        newsCache.data = fallbackNews;
        newsCache.timestamp = Date.now();

        return res.json({ success: true, data: fallbackNews, fallback: true });

    } catch (error) {
        console.error('News API error:', error.message);
        const fallbackNews = getFallbackNewsArticles();
        return res.json({ success: true, data: fallbackNews, fallback: true, error: error.message });
    }
});

function getFallbackNewsArticles() {
    return [
        {
            title: "India's Economic Growth Surpasses Expectations in Q4 2025",
            description: "GDP growth reaches 7.8% driven by strong manufacturing and services sectors.",
            image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800",
            source: "Economic Times",
            category: "ECONOMY",
            publishedAt: new Date().toISOString()
        },
        {
            title: "Sensex Hits All-Time High Amid Global Market Rally",
            description: "Indian markets surge as foreign investors pour billions into equities.",
            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
            source: "Business Standard",
            category: "MARKETS",
            publishedAt: new Date().toISOString()
        },
        {
            title: "Tech Startups Raise Record $15 Billion in 2025",
            description: "Indian startup ecosystem sees unprecedented funding growth.",
            image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
            source: "Inc42",
            category: "STARTUPS",
            publishedAt: new Date().toISOString()
        },
        {
            title: "RBI Maintains Interest Rates, Signals Stable Outlook",
            description: "Central bank keeps repo rate unchanged citing inflation concerns.",
            image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
            source: "Mint",
            category: "FINANCE",
            publishedAt: new Date().toISOString()
        },
        {
            title: "AI Revolution Transforms Indian Banking Sector",
            description: "Major banks adopt artificial intelligence for customer service and fraud detection.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
            source: "Financial Express",
            category: "TECHNOLOGY",
            publishedAt: new Date().toISOString()
        },
        {
            title: "Make in India: Manufacturing Exports Hit Record High",
            description: "Electronics and pharmaceuticals lead India's export boom.",
            image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800",
            source: "Business Today",
            category: "INDUSTRY",
            publishedAt: new Date().toISOString()
        }
    ];
}

app.get('/api/setup-production', async (req, res) => {

    // Basic protection using query param from environment
    const setupKey = process.env.SETUP_KEY || 'secure_setup_123';

    if (req.query.key !== setupKey) {
        return res.status(403).send('Forbidden: Invalid Setup Key. Use ?key=YOUR_SETUP_KEY');
    }

    try {
        // 1. Create OR Update Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        let admin = await User.findOne({ name: 'admin' });
        if (!admin) {
            admin = await User.create({
                name: 'admin',
                email: 'admin@bizzshort.com',
                password: hashedPassword,
                role: 'ADMIN'
            });
            console.log('Setup: Admin Created');
        } else {
            // FORCE RESET PASSWORD
            admin.password = hashedPassword;
            await admin.save();
            console.log('Setup: Admin Password Reset');
        }

        // Helper to slugify
        const slugify = (text) => text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text

        // 2. Data to Seed
        const seedData = {
            articles: [
                {
                    title: "Tata Group and Intel Announce Strategic Alliance for Semiconductor Manufacturing",
                    slug: slugify("Tata Group and Intel Announce Strategic Alliance for Semiconductor Manufacturing"),
                    category: "Technology",
                    author: "Business Desk",
                    content: "Tata Group and Intel Corporation announced a strategic alliance to explore collaboration in consumer and enterprise hardware enablement, and semiconductor and systems manufacturing to support India's domestic semiconductor ecosystem.",
                    date: "2025-12-08"
                },
                {
                    title: "Microsoft Announces $17.5 Billion Investment in India's AI Infrastructure",
                    slug: slugify("Microsoft Announces $17.5 Billion Investment in India's AI Infrastructure"),
                    category: "Technology",
                    author: "Tech Reporter",
                    content: "Microsoft announced its largest investment in Asia, committing US$17.5 billion over four years (CY 2026 to 2029) to advance India's cloud and artificial intelligence (AI) infrastructure.",
                    date: "2025-12-12"
                },
                {
                    title: "Sensex Surges to 85,221 as Markets Break Three-Day Losing Streak",
                    slug: slugify("Sensex Surges to 85,221 as Markets Break Three-Day Losing Streak"),
                    category: "Markets",
                    author: "Market Analyst",
                    content: "Indian equity indices broke a three-day losing streak, with the Nifty closing near 25,900 and the Sensex at 84,818.13, both supported by positive global cues.",
                    date: "2025-12-12"
                },
                {
                    title: "India's Wealth Creation Reaches ₹148 Trillion from 2020-2025",
                    slug: slugify("India's Wealth Creation Reaches ₹148 Trillion from 2020-2025"),
                    category: "Economy",
                    author: "Economic Affairs",
                    content: "India's wealth creation reached ₹148 trillion from 2020-2025, with Bharti Airtel leading the wealth creation charts.",
                    date: "2025-12-10"
                }
            ],
            events: [
                {
                    name: "E-Summit 2025: Asia's Largest Business Conclave",
                    date: "2025-12-11",
                    location: "IIT Bombay, Mumbai",
                    description: "Asia's largest business conclave, focusing on groundbreaking ideas and visionary solutions.",
                },
                {
                    name: "Bengaluru Tech Summit 2025",
                    date: "2025-11-19",
                    location: "Bangalore Palace Grounds",
                    description: "A broad-based technology summit covering IT, innovation, IoT, and digital transformation.",
                }
            ],
            interviews: [
                {
                    intervieweeName: "Roshni Nadar Malhotra",
                    designation: "Chairperson",
                    company: "HCLTech",
                    title: "Discussing India's AI Future and Women's Leadership in Tech",
                    summary: "Discussing India's AI Future and Women's Leadership in Tech at Davos 2024."
                },
                {
                    intervieweeName: "Satya Nadella",
                    designation: "Chairman & CEO",
                    company: "Microsoft",
                    title: "Microsoft's Commitment to India's Digital Transformation",
                    summary: "Microsoft's Commitment to India's Digital Transformation and AI investment."
                }
            ],
            industry: [
                {
                    sector: "Semiconductor",
                    title: "India's Semiconductor Boom",
                    description: "With Tata-Intel alliance and government incentives, India is positioning itself as a major hub."
                }
            ],
            clients: [
                { name: "Tata Group", type: "Corporate" },
                { name: "Reliance Industries", type: "Corporate" }
            ]
        };

        // 3. Clear and Insert Data (Upsert style to avoid dupes or just simple insert?)
        // Let's check counts to be safe, or just insert. For setup, we'll try to insert if empty.

        let logs = [];

        // Articles
        const articleCount = await Article.countDocuments();
        if (articleCount === 0) {
            await Article.insertMany(seedData.articles);
            logs.push(`✅ Added ${seedData.articles.length} Articles`);
        } else {
            logs.push(`ℹ️ Articles already exist (${articleCount})`);
        }

        // Events
        const eventCount = await Event.countDocuments();
        if (eventCount === 0) {
            await Event.insertMany(seedData.events);
            logs.push(`✅ Added ${seedData.events.length} Events`);
        } else {
            logs.push(`ℹ️ Events already exist (${eventCount})`);
        }

        // Interviews
        const interviewCount = await Interview.countDocuments();
        if (interviewCount === 0) {
            await Interview.insertMany(seedData.interviews);
            logs.push(`✅ Added ${seedData.interviews.length} Interviews`);
        }

        // Industry 
        const indCount = await IndustryUpdate.countDocuments();
        if (indCount === 0) {
            await IndustryUpdate.insertMany(seedData.industry);
            logs.push(`✅ Added ${seedData.industry.length} Industry Updates`);
        }

        // Clients
        const clientCount = await Client.countDocuments();
        if (clientCount === 0) {
            await Client.insertMany(seedData.clients);
            logs.push(`✅ Added ${seedData.clients.length} Clients`);
        }

        res.send(`
            <h1>Setup Complete 🚀</h1>
            <p>Admin User: Verified/Created</p>
            <ul>
                ${logs.map(l => `<li>${l}</li>`).join('')}
            </ul>
            <p><a href="/admin-login.html">Login to Admin Panel</a></p>
        `);

    } catch (err) {
        console.error(err);
        res.status(500).send('Setup Failed: ' + err.message);
    }
});


// ============ API Routes ============

// Auth & Users
app.post('/api/admin/login', authLimiter, async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    // Sanitize inputs
    const sanitizedUsername = validator.escape(username.trim());

    if (!validator.isLength(sanitizedUsername, { min: 3, max: 50 })) {
        return res.status(400).json({ success: false, error: 'Invalid username length' });
    }

    try {
        let user = await User.findOne({
            $or: [
                { name: sanitizedUsername },
                { email: sanitizedUsername }
            ]
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Check if user is approved
            if (user.status === 'PENDING') {
                return res.status(403).json({ success: false, error: 'Your account is pending approval. Please wait for admin approval.' });
            }
            if (user.status === 'REJECTED') {
                return res.status(403).json({ success: false, error: 'Your account has been rejected. Please contact support.' });
            }

            res.json({
                success: true,
                sessionId: generateToken(user._id),
                user: { id: user._id, name: user.name, role: user.role, status: user.status }
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Admin Registration (First admin auto-approved, others pending)
app.post('/api/admin/register', async (req, res) => {
    const { name, email, password, setupKey } = req.body;

    try {
        // Check if any approved admin already exists
        const approvedAdminCount = await User.countDocuments({ role: 'ADMIN', status: 'APPROVED' });
        const isFirstAdmin = approvedAdminCount === 0;

        // Validate inputs
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and password are required'
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 8 characters'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { name }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User with this email or username already exists'
            });
        }

        // Create new admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: validator.escape(name.trim()),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: 'ADMIN',
            status: isFirstAdmin ? 'APPROVED' : 'PENDING' // First admin auto-approved
        });

        if (isFirstAdmin) {
            // First admin - auto-login
            res.status(201).json({
                success: true,
                message: 'Admin account created and approved successfully',
                sessionId: generateToken(user._id),
                user: { id: user._id, name: user.name, role: user.role, status: user.status }
            });
        } else {
            // Additional admin - pending approval
            res.status(201).json({
                success: true,
                message: 'Registration submitted. Awaiting admin approval.',
                requiresApproval: true
            });
        }

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to create admin account'
        });
    }
});

// Check if first admin exists
app.get('/api/admin/check-first-setup', async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: 'ADMIN', status: 'APPROVED' });
        res.json({
            success: true,
            requiresSetup: !adminExists
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// Get pending user registrations (admin only)
app.get('/api/admin/pending-users', protect, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const pendingUsers = await User.find({ status: 'PENDING' })
            .select('-password')
            .sort({ joinedAt: -1 });

        res.json({
            success: true,
            users: pendingUsers
        });
    } catch (err) {
        console.error('Error fetching pending users:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Approve user registration (admin only)
app.post('/api/admin/approve-user/:userId', protect, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (user.status !== 'PENDING') {
            return res.status(400).json({ success: false, error: 'User is not pending approval' });
        }

        user.status = 'APPROVED';
        user.approvedBy = req.user._id;
        user.approvedAt = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'User approved successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        });
    } catch (err) {
        console.error('Error approving user:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Reject user registration (admin only)
app.post('/api/admin/reject-user/:userId', protect, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const { reason } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (user.status !== 'PENDING') {
            return res.status(400).json({ success: false, error: 'User is not pending approval' });
        }

        user.status = 'REJECTED';
        user.rejectionReason = reason || 'No reason provided';
        await user.save();

        res.json({
            success: true,
            message: 'User rejected successfully'
        });
    } catch (err) {
        console.error('Error rejecting user:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get employee statistics (for employee panel)
app.get('/api/employee/my-stats', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        const videos = await Video.countDocuments({ createdBy: userId });
        const events = await Event.countDocuments({ createdBy: userId });
        const advertisements = await Advertisement.countDocuments({ createdBy: userId });

        res.json({
            success: true,
            stats: {
                videos,
                events,
                advertisements
            }
        });
    } catch (err) {
        console.error('Error fetching employee stats:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get all employees with their activity stats (admin only)
app.get('/api/admin/employees-progress', protect, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const employees = await User.find({ status: 'APPROVED' }).select('-password');

        const employeesWithStats = await Promise.all(employees.map(async (employee) => {
            const videos = await Video.countDocuments({ createdBy: employee._id });
            const events = await Event.countDocuments({ createdBy: employee._id });
            const advertisements = await Advertisement.countDocuments({ createdBy: employee._id });

            // Get recent activity
            const recentVideos = await Video.find({ createdBy: employee._id })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title createdAt');
            const recentEvents = await Event.find({ createdBy: employee._id })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name createdAt');
            const recentAds = await Advertisement.find({ createdBy: employee._id })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title createdAt');

            return {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                avatar: employee.avatar,
                joinedAt: employee.joinedAt,
                stats: {
                    videos,
                    events,
                    advertisements,
                    total: videos + events + advertisements
                },
                recentActivity: [
                    ...recentVideos.map(v => ({ type: 'video', title: v.title, date: v.createdAt })),
                    ...recentEvents.map(e => ({ type: 'event', title: e.name, date: e.createdAt })),
                    ...recentAds.map(a => ({ type: 'ad', title: a.title, date: a.createdAt }))
                ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
            };
        }));

        res.json({
            success: true,
            employees: employeesWithStats
        });
    } catch (err) {
        console.error('Error fetching employee progress:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get advertisement analytics (admin only)
app.get('/api/admin/advertisement-analytics', protect, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const ads = await Advertisement.find().populate('createdBy', 'name email');

        const totalImpressions = ads.reduce((sum, ad) => sum + (ad.metrics?.impressions || 0), 0);
        const totalClicks = ads.reduce((sum, ad) => sum + (ad.metrics?.clicks || 0), 0);
        const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

        const adsByPosition = {};
        ads.forEach(ad => {
            if (!adsByPosition[ad.position]) {
                adsByPosition[ad.position] = { count: 0, impressions: 0, clicks: 0 };
            }
            adsByPosition[ad.position].count++;
            adsByPosition[ad.position].impressions += ad.metrics?.impressions || 0;
            adsByPosition[ad.position].clicks += ad.metrics?.clicks || 0;
        });

        res.json({
            success: true,
            analytics: {
                totalAds: ads.length,
                activeAds: ads.filter(ad => ad.status === 'active').length,
                totalImpressions,
                totalClicks,
                avgCTR,
                adsByPosition,
                topPerformers: ads
                    .map(ad => ({
                        id: ad._id,
                        title: ad.title,
                        impressions: ad.metrics?.impressions || 0,
                        clicks: ad.metrics?.clicks || 0,
                        ctr: ad.ctr,
                        createdBy: ad.createdBy?.name || 'Unknown'
                    }))
                    .sort((a, b) => parseFloat(b.ctr) - parseFloat(a.ctr))
                    .slice(0, 10)
            }
        });
    } catch (err) {
        console.error('Error fetching ad analytics:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get website analytics (admin only)
app.get('/api/admin/website-analytics', protect, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const totalVideos = await Video.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalAds = await Advertisement.countDocuments();
        const totalUsers = await User.countDocuments({ status: 'APPROVED' });

        // Content by category
        const videosByCategory = await Video.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Recent content
        const recentVideos = await Video.find().sort({ createdAt: -1 }).limit(10).populate('createdBy', 'name');
        const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(10).populate('createdBy', 'name');

        // Monthly stats
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const videosThisMonth = await Video.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const eventsThisMonth = await Event.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const adsThisMonth = await Advertisement.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        res.json({
            success: true,
            analytics: {
                totals: {
                    videos: totalVideos,
                    events: totalEvents,
                    advertisements: totalAds,
                    users: totalUsers
                },
                thisMonth: {
                    videos: videosThisMonth,
                    events: eventsThisMonth,
                    advertisements: adsThisMonth
                },
                videosByCategory,
                recentContent: {
                    videos: recentVideos,
                    events: recentEvents
                }
            }
        });
    } catch (err) {
        console.error('Error fetching website analytics:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.get('/api/admin/verify-session', async (req, res) => {
    const token = req.headers['session-id'];
    if (!token) return res.json({ valid: false });

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ valid: false, error: 'Server configuration error' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
            res.json({ valid: true, user: { id: user._id, name: user.name } });
        } else {
            res.json({ valid: false });
        }
    } catch (error) {
        res.json({ valid: false });
    }
});

// Admin Stats
app.get('/api/stats', protect, async (req, res) => {
    try {
        const stats = {
            articles: await Article.countDocuments(),
            events: await Event.countDocuments(),
            interviews: await Interview.countDocuments(),
            users: await User.countDocuments(),
            videos: await Video.countDocuments(),
            advertisements: await Advertisement.countDocuments(),
            totalViews: 0 // Could be calculated from video views if needed
        };
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Articles
app.get('/api/articles', async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        const query = category ? { category: new RegExp(category, 'i') } : {};

        const articles = await Article.find(query)
            .sort({ publishedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Article.countDocuments(query);

        res.json({
            success: true,
            data: articles.map(a => ({ ...a._doc, id: a._id })),
            pagination: { page: +page, limit: +limit, total: count, pages: Math.ceil(count / limit) }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/articles', protect, conditionalUpload('image'), async (req, res) => {
    try {
        const { title, slug, category, excerpt, content, author, tags, videoUrl } = req.body;

        let parsedAuthor = author;
        if (typeof author === 'string') {
            try { parsedAuthor = JSON.parse(author); } catch { parsedAuthor = { name: author, avatar: '' }; }
        }
        if (!parsedAuthor) parsedAuthor = { name: req.user.name || 'BizzShort Team' };

        let parsedTags = tags;
        if (typeof tags === 'string') {
            try { parsedTags = JSON.parse(tags); } catch { parsedTags = []; }
        }

        const article = await Article.create({
            title,
            slug: slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined),
            category,
            excerpt,
            content,
            image: req.file ? `/uploads/${req.file.filename}` : undefined,
            author: parsedAuthor,
            tags: parsedTags,
            videoUrl
        });

        res.status(201).json({ success: true, data: { ...article._doc, id: article._id } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to create article: ' + err.message });
    }
});

app.put('/api/articles/:id', protect, upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = `/uploads/${req.file.filename}`;

        const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!article) return res.status(404).json({ success: false, error: 'Article not found' });

        res.json({ success: true, data: { ...article._doc, id: article._id } });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Update failed' });
    }
});

app.delete('/api/articles/:id', protect, async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Delete failed' });
    }
});

// Get single article by ID or slug
app.get('/api/articles/:id', async (req, res) => {
    try {
        const article = await Article.findOne({
            $or: [
                { _id: mongoose.Types.ObjectId.isValid(req.params.id) ? req.params.id : null },
                { slug: req.params.id }
            ]
        });

        if (!article) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }

        res.json({ ...article._doc, id: article._id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Track article view
app.post('/api/articles/:id/view', async (req, res) => {
    try {
        const article = await Article.findOneAndUpdate(
            {
                $or: [
                    { _id: mongoose.Types.ObjectId.isValid(req.params.id) ? req.params.id : null },
                    { slug: req.params.id }
                ]
            },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!article) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }

        res.json({ success: true, views: article.views });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Events
app.get('/api/events', async (req, res) => {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, data: events.map(e => ({ ...e._doc, id: e._id })) });
});

app.get('/api/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
        res.json({ success: true, data: { ...event._doc, id: event._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/events', protect, conditionalUpload('image'), async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, image: req.file ? `/uploads/${req.file.filename}` : undefined, createdBy: req.user._id });
        res.status(201).json({ success: true, data: { ...event._doc, id: event._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/events/:id', protect, conditionalUpload('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = `/uploads/${req.file.filename}`;

        const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

        res.json({ success: true, data: { ...event._doc, id: event._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/events/:id', protect, async (req, res) => {
    try { await Event.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
});

// Interviews
app.get('/api/interviews', async (req, res) => {
    try {
        const items = await Interview.find().sort({ publishedAt: -1 });
        res.json({ success: true, data: items.map(i => ({ ...i._doc, id: i._id })) });
    } catch (e) { res.status(500).json({ success: false }); }
});
app.post('/api/interviews', protect, conditionalUpload('image'), async (req, res) => {
    try {
        const item = await Interview.create({ ...req.body, image: req.file ? `/uploads/${req.file.filename}` : undefined });
        res.status(201).json({ success: true, data: { ...item._doc, id: item._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/interviews/:id', protect, conditionalUpload('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = `/uploads/${req.file.filename}`;

        const item = await Interview.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, data: { ...item._doc, id: item._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/interviews/:id', protect, async (req, res) => {
    try { await Interview.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
});

// News
app.get('/api/news', async (req, res) => {
    const items = await News.find().sort({ publishedAt: -1 });
    res.json({ success: true, data: items.map(n => ({ ...n._doc, id: n._id })) });
});
app.post('/api/news', protect, async (req, res) => {
    const item = await News.create(req.body);
    res.status(201).json({ success: true, data: { ...item._doc, id: item._id } });
});

app.put('/api/news/:id', protect, async (req, res) => {
    try {
        const item = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { ...item._doc, id: item._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/news/:id', protect, async (req, res) => {
    try { await News.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
});
// Industry
app.get('/api/industry', async (req, res) => {
    const items = await IndustryUpdate.find().sort({ updatedAt: -1 });
    res.json({ success: true, data: items.map(i => ({ ...i._doc, id: i._id })) });
});

app.post('/api/industry', protect, async (req, res) => {
    const item = await IndustryUpdate.create(req.body);
    res.status(201).json({ success: true, data: { ...item._doc, id: item._id } });
});

app.put('/api/industry/:id', protect, async (req, res) => {
    try {
        const item = await IndustryUpdate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { ...item._doc, id: item._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/industry/:id', protect, async (req, res) => {
    try { await IndustryUpdate.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
});

// Clients
app.get('/api/clients', async (req, res) => {
    const items = await Client.find({});
    res.json({ success: true, data: items.map(c => ({ ...c._doc, id: c._id })) });
});

app.post('/api/clients', protect, conditionalUpload('logo'), async (req, res) => {
    const item = await Client.create({ ...req.body, logo: req.file ? `/uploads/${req.file.filename}` : undefined });
    res.status(201).json({ success: true, data: { ...item._doc, id: item._id } });
});


app.put('/api/clients/:id', protect, conditionalUpload('logo'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.logo = `/uploads/${req.file.filename}`;

        const item = await Client.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, data: { ...item._doc, id: item._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/clients/:id', protect, async (req, res) => {
    try { await Client.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
});

// Users
app.get('/api/users', protect, async (req, res) => {
    const users = await User.find({}, '-password'); // Exclude password
    res.json({ success: true, data: users.map(u => ({ ...u._doc, id: u._id })) });
});

app.post('/api/users', protect, async (req, res) => {
    try {
        const user = await User.create(req.body); // Password hash hook handles encryption
        res.status(201).json({ success: true, data: { ...user._doc, id: user._id } });
    } catch (err) {
        res.status(500).json({ success: false, error: 'User creation failed' });
    }
});

app.put('/api/users/:id', protect, async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, data: { ...user._doc, id: user._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/users/:id', protect, async (req, res) => {
    try { await User.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
});

// Advertisements
app.get('/api/advertisements', async (req, res) => {
    const ads = await Advertisement.find({});
    res.json({ success: true, data: ads.map(a => ({ ...a._doc, id: a._id })) });
});

app.get('/api/advertisements/:id', async (req, res) => {
    try {
        const ad = await Advertisement.findById(req.params.id);
        if (!ad) return res.status(404).json({ success: false, error: 'Advertisement not found' });
        res.json({ success: true, data: { ...ad._doc, id: ad._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/advertisements', protect, conditionalUpload('image'), async (req, res) => {
    const ad = await Advertisement.create({ ...req.body, imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined, createdBy: req.user._id });
    res.status(201).json({ success: true, data: { ...ad._doc, id: ad._id } });
});

app.put('/api/advertisements/:id', protect, conditionalUpload('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

        const ad = await Advertisement.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!ad) return res.status(404).json({ success: false, error: 'Advertisement not found' });

        res.json({ success: true, data: { ...ad._doc, id: ad._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/advertisements/:id', protect, async (req, res) => {
    try { await Advertisement.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
});

// Videos
app.get('/api/videos', async (req, res) => {
    try {
        const { source, limit, category } = req.query;
        let query = {};

        if (source) query.source = source;
        if (category) query.category = new RegExp(category, 'i');

        let videosQuery = Video.find(query).sort({ createdAt: -1 });
        if (limit) videosQuery = videosQuery.limit(parseInt(limit));

        const videos = await videosQuery;
        res.json({ success: true, data: videos.map(v => ({ ...v._doc, id: v._id })) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/videos/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ success: false, error: 'Video not found' });
        res.json({ success: true, data: { ...video._doc, id: video._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/videos', protect, async (req, res) => {
    try {
        const video = await Video.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ success: true, data: { ...video._doc, id: video._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/videos/:id', protect, async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!video) return res.status(404).json({ success: false, error: 'Video not found' });
        res.json({ success: true, data: { ...video._doc, id: video._id } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/videos/:id', protect, async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Video deleted' });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Synced Videos API - Public endpoint for frontend video loader
// Returns videos in format expected by bizzshort-video-loader.js
app.get('/api/synced-videos', async (req, res) => {
    try {
        const { source, limit = 20, category } = req.query;
        let query = {};

        if (source) query.source = source;
        if (category) query.category = new RegExp(category, 'i');

        const videos = await Video.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        // Transform to format expected by frontend
        const formattedVideos = videos.map(v => ({
            videoId: v.videoId,
            title: v.title,
            category: v.category,
            source: v.source,
            thumbnail: v.thumbnail || (v.source === 'youtube'
                ? `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`
                : null),
            views: v.views || '0',
            date: v.date || new Date(v.createdAt).toLocaleDateString(),
            relativeTime: getRelativeTime(v.createdAt),
            featured: v.featured
        }));

        res.json({
            success: true,
            data: formattedVideos,
            count: formattedVideos.length,
            syncedAt: new Date().toISOString()
        });
    } catch (err) {
        console.error('Synced videos error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Helper function for relative time
function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// ============ Market Data API (Real-time NSE/BSE Data via Yahoo Finance) ============
app.get('/api/market-data', async (req, res) => {
    try {
        const https = require('https');

        // Yahoo Finance API - Free and supports Indian indices
        const fetchYahooFinance = (symbol) => {
            return new Promise((resolve, reject) => {
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
                const options = {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                };
                https.get(url, options, (response) => {
                    let data = '';
                    response.on('data', chunk => data += chunk);
                    response.on('end', () => {
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.chart && parsed.chart.result && parsed.chart.result[0]) {
                                const result = parsed.chart.result[0];
                                const meta = result.meta;
                                const quote = result.indicators.quote[0];

                                resolve({
                                    symbol: meta.symbol,
                                    price: meta.regularMarketPrice || meta.previousClose,
                                    previousClose: meta.previousClose || meta.chartPreviousClose,
                                    change: (meta.regularMarketPrice || meta.previousClose) - (meta.previousClose || meta.chartPreviousClose),
                                    changePercent: ((meta.regularMarketPrice || meta.previousClose) - (meta.previousClose || meta.chartPreviousClose)) / (meta.previousClose || meta.chartPreviousClose) * 100,
                                    high: quote.high ? quote.high[quote.high.length - 1] : meta.regularMarketPrice,
                                    low: quote.low ? quote.low[quote.low.length - 1] : meta.regularMarketPrice,
                                    volume: quote.volume ? quote.volume[quote.volume.length - 1] : 0
                                });
                            } else {
                                reject(new Error('Invalid response structure'));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                }).on('error', reject);
            });
        };

        try {
            // Fetch real-time data from Yahoo Finance
            const [niftyData, sensexData, bankNiftyData] = await Promise.all([
                fetchYahooFinance('^NSEI'),      // Nifty 50
                fetchYahooFinance('^BSESN'),     // Sensex
                fetchYahooFinance('^NSEBANK')    // Bank Nifty
            ]);

            console.log('✅ Real market data fetched from Yahoo Finance');

            return res.json({
                success: true,
                data: {
                    nifty: {
                        value: Math.round(niftyData.price * 100) / 100,
                        change: Math.round(niftyData.changePercent * 100) / 100,
                        changePoints: Math.round(niftyData.change * 100) / 100,
                        high: Math.round(niftyData.high * 100) / 100,
                        low: Math.round(niftyData.low * 100) / 100,
                        note: niftyData.changePercent > 0 ? 'Bullish Momentum' : niftyData.changePercent < 0 ? 'Bearish Trend' : 'Flat'
                    },
                    sensex: {
                        value: Math.round(sensexData.price * 100) / 100,
                        change: Math.round(sensexData.changePercent * 100) / 100,
                        changePoints: Math.round(sensexData.change * 100) / 100,
                        high: Math.round(sensexData.high * 100) / 100,
                        low: Math.round(sensexData.low * 100) / 100,
                        note: sensexData.changePercent > 0 ? 'Positive Sentiment' : sensexData.changePercent < 0 ? 'Cautious Trading' : 'Neutral'
                    },
                    bankNifty: {
                        value: Math.round(bankNiftyData.price * 100) / 100,
                        change: Math.round(bankNiftyData.changePercent * 100) / 100,
                        changePoints: Math.round(bankNiftyData.change * 100) / 100,
                        high: Math.round(bankNiftyData.high * 100) / 100,
                        low: Math.round(bankNiftyData.low * 100) / 100,
                        note: bankNiftyData.changePercent > 0 ? 'Banking Strong' : bankNiftyData.changePercent < 0 ? 'Banking Weak' : 'Stable'
                    }
                },
                source: 'yahoo_finance',
                timestamp: new Date().toISOString(),
                marketStatus: isMarketOpen() ? 'open' : 'closed'
            });
        } catch (yahooError) {
            console.log('⚠️ Yahoo Finance fetch failed, using fallback:', yahooError.message);

            // Fallback: Use realistic January 2026 values with time-based variation
            const now = new Date();
            const hour = now.getHours();
            const marketOpen = hour >= 9 && hour < 16;

            // Base values (realistic for Jan 2026 - Updated)
            const baseNifty = 25500;
            const baseSensex = 84000;
            const baseBankNifty = 53500;

            // Small intraday variation based on time
            const timeVariation = marketOpen ? (Math.sin(now.getMinutes() / 10) * 0.002) : 0;

            return res.json({
                success: true,
                data: {
                    nifty: {
                        value: Math.round(baseNifty * (1 + timeVariation) * 100) / 100,
                        change: Math.round(timeVariation * 10000) / 100,
                        changePoints: Math.round(baseNifty * timeVariation * 100) / 100,
                        note: timeVariation > 0 ? 'Bullish Momentum' : 'Consolidating'
                    },
                    sensex: {
                        value: Math.round(baseSensex * (1 + timeVariation) * 100) / 100,
                        change: Math.round(timeVariation * 10000) / 100,
                        changePoints: Math.round(baseSensex * timeVariation * 100) / 100,
                        note: timeVariation > 0 ? 'Positive Sentiment' : 'Range Bound'
                    },
                    bankNifty: {
                        value: Math.round(baseBankNifty * (1 + timeVariation * 1.1) * 100) / 100,
                        change: Math.round(timeVariation * 1.1 * 10000) / 100,
                        changePoints: Math.round(baseBankNifty * timeVariation * 1.1 * 100) / 100,
                        note: timeVariation > 0 ? 'Banking Strong' : 'Banking Neutral'
                    }
                },
                source: 'fallback_estimated',
                timestamp: new Date().toISOString(),
                marketStatus: marketOpen ? 'open' : 'closed'
            });
        }

    } catch (err) {
        console.error('❌ Market data API error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch market data' });
    }
});

// Helper function to check if market is open
function isMarketOpen() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();
    const day = istTime.getUTCDay();

    if (day === 0 || day === 6) return false;
    const currentMinutes = hours * 60 + minutes;
    return currentMinutes >= 555 && currentMinutes <= 930;
}

// ============ News Scraping API (The Economic Times) ============
app.get('/api/latest-news', async (req, res) => {
    try {
        const axios = require('axios');
        const cheerio = require('cheerio');

        // Scrape Economic Times Top News
        const response = await axios.get('https://economictimes.indiatimes.com/news/latest-news', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const articles = [];

        // Select news items (ET specific selectors)
        $('.eachStory').each((i, el) => {
            if (i >= 8) return false; // Limit to 8 items

            const title = $(el).find('h3 a').text().trim();
            const link = 'https://economictimes.indiatimes.com' + $(el).find('h3 a').attr('href');
            // Get description or use title as fallback
            const description = $(el).find('p').text().trim() || title;
            // ET uses data-original for lazy loaded images
            const image = $(el).find('img').attr('data-original') || $(el).find('img').attr('src');
            const time = $(el).find('time').text().trim();

            if (title && image) {
                articles.push({
                    id: 'et-' + i,
                    category: 'LATEST NEWS', // Default category
                    title: title,
                    description: description.substring(0, 100) + '...', // Truncate description
                    image: image,
                    url: link,
                    views: Math.floor(Math.random() * (15000 - 5000) + 5000) + 'K', // Simulated views
                    readTime: '3 min read',
                    time: time
                });
            }
        });

        console.log(`✅ Scraped ${articles.length} news articles from Economic Times`);
        res.json({ success: true, data: articles });

    } catch (error) {
        console.error('❌ News scraping error:', error.message);
        // Fallback to empty list or static data if needed (frontend handles empty)
        res.status(500).json({ success: false, error: 'Failed to fetch news' });
    }
});

// ============ Chart Data Cache ============
const chartDataCache = new Map();
const CHART_CACHE_DURATION = 300000; // 5 minutes

// ============ Chart Data API (Historical Data for Charts) ============
app.get('/api/chart-data/:symbol', async (req, res) => {
    try {
        const https = require('https');
        const { symbol } = req.params;
        const { range = '1d', interval = '5m' } = req.query;

        // Map symbols to Yahoo Finance format
        const symbolMap = {
            'nifty': '^NSEI',
            'sensex': '^BSESN',
            'banknifty': '^NSEBANK',
            'nifty50': '^NSEI'
        };

        const symbolKey = symbol.toLowerCase();
        const yahooSymbol = symbolMap[symbolKey] || symbol;
        const cacheKey = `${symbolKey}_${range}_${interval}`;

        // Check cache
        const cached = chartDataCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CHART_CACHE_DURATION) {
            console.log(`📊 Returning cached chart data for ${symbolKey}`);
            return res.json(cached.data);
        }

        const fetchChartData = () => {
            return new Promise((resolve, reject) => {
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${interval}&range=${range}`;

                const options = {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                };

                https.get(url, options, (response) => {
                    let data = '';
                    response.on('data', chunk => data += chunk);
                    response.on('end', () => {
                        try {
                            if (response.statusCode !== 200) {
                                console.error(`❌ Yahoo Finance API error: ${response.statusCode} for ${yahooSymbol}`);
                                return reject(new Error(`Yahoo Finance returned ${response.statusCode}`));
                            }

                            const parsed = JSON.parse(data);
                            if (parsed.chart && parsed.chart.result && parsed.chart.result[0]) {
                                const result = parsed.chart.result[0];
                                const timestamps = result.timestamp || [];
                                const indicators = result.indicators;

                                if (!indicators || !indicators.quote || !indicators.quote[0]) {
                                    return reject(new Error('Missing quote data in Yahoo response'));
                                }

                                const quote = indicators.quote[0];

                                const chartData = timestamps.map((timestamp, index) => ({
                                    time: timestamp * 1000, // Convert to milliseconds
                                    open: quote.open ? quote.open[index] : null,
                                    high: quote.high ? quote.high[index] : null,
                                    low: quote.low ? quote.low[index] : null,
                                    close: quote.close ? quote.close[index] : null,
                                    volume: quote.volume ? quote.volume[index] : null
                                })).filter(d => d.close !== null && d.close !== undefined); // Remove null values

                                resolve({
                                    symbol: yahooSymbol,
                                    data: chartData,
                                    meta: result.meta
                                });
                            } else {
                                const errorMsg = parsed.chart?.error?.description || 'Invalid chart data response';
                                reject(new Error(errorMsg));
                            }
                        } catch (e) {
                            console.error('❌ JSON Parse error in chart API:', e.message);
                            reject(e);
                        }
                    });
                }).on('error', (e) => {
                    console.error('❌ HTTPS request error in chart API:', e.message);
                    reject(e);
                });
            });
        };

        const chartData = await fetchChartData();

        const responseData = {
            success: true,
            symbol: symbol,
            yahooSymbol: yahooSymbol,
            range: range,
            interval: interval,
            dataPoints: chartData.data.length,
            data: chartData.data,
            meta: {
                currency: chartData.meta.currency,
                exchangeName: chartData.meta.exchangeName,
                instrumentType: chartData.meta.instrumentType,
                regularMarketPrice: chartData.meta.regularMarketPrice,
                previousClose: chartData.meta.previousClose
            }
        };

        // Cache the response
        chartDataCache.set(cacheKey, {
            timestamp: Date.now(),
            data: responseData
        });

        res.json(responseData);

    } catch (err) {
        console.error('❌ Chart data API error:', err.message);
        res.status(err.message.includes('404') ? 404 : 500).json({
            success: false,
            error: err.message,
            symbol: symbol,
            yahooSymbol: symbolMap[symbol.toLowerCase()] || symbol
        });
    }
});

// ============ Real-Time Market Data Stream (SSE) ============
// Cache to reduce Yahoo Finance API calls
let marketDataCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 60 seconds

app.get('/api/market-stream', async (req, res) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log('📡 New SSE client connected for market data stream');

    // Function to fetch and send market data
    const sendMarketUpdate = async () => {
        try {
            // Check cache first
            const now = Date.now();
            if (marketDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
                // Use cached data
                res.write(`data: ${JSON.stringify(marketDataCache)}\n\n`);
                console.log('📊 Market data streamed from cache');
                return;
            }

            const https = require('https');

            // Fetch from Yahoo Finance
            const fetchYahooFinance = (symbol) => {
                return new Promise((resolve, reject) => {
                    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
                    const options = {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    };

                    https.get(url, options, (response) => {
                        let data = '';
                        response.on('data', chunk => data += chunk);
                        response.on('end', () => {
                            try {
                                if (response.statusCode === 429) {
                                    return reject(new Error('Too Many Requests'));
                                }

                                if (response.statusCode !== 200) {
                                    return reject(new Error(`Yahoo Finance returned ${response.statusCode}`));
                                }

                                const parsed = JSON.parse(data);
                                if (parsed.chart && parsed.chart.result && parsed.chart.result[0]) {
                                    const result = parsed.chart.result[0];
                                    const meta = result.meta;
                                    const quote = result.indicators.quote[0];

                                    resolve({
                                        symbol: meta.symbol,
                                        price: meta.regularMarketPrice || meta.previousClose,
                                        previousClose: meta.previousClose || meta.chartPreviousClose,
                                        change: (meta.regularMarketPrice || meta.previousClose) - (meta.previousClose || meta.chartPreviousClose),
                                        changePercent: ((meta.regularMarketPrice || meta.previousClose) - (meta.previousClose || meta.chartPreviousClose)) / (meta.previousClose || meta.chartPreviousClose) * 100,
                                        high: quote.high ? quote.high[quote.high.length - 1] : meta.regularMarketPrice,
                                        low: quote.low ? quote.low[quote.low.length - 1] : meta.regularMarketPrice,
                                        volume: quote.volume ? quote.volume[quote.volume.length - 1] : 0
                                    });
                                } else {
                                    reject(new Error('Invalid response structure'));
                                }
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }).on('error', reject);
                });
            };

            // Fetch all three indices
            const [niftyData, sensexData, bankNiftyData] = await Promise.all([
                fetchYahooFinance('^NSEI'),
                fetchYahooFinance('^BSESN'),
                fetchYahooFinance('^NSEBANK')
            ]);

            const marketData = {
                nifty: {
                    value: Math.round(niftyData.price * 100) / 100,
                    change: Math.round(niftyData.changePercent * 100) / 100,
                    changePoints: Math.round(niftyData.change * 100) / 100,
                    high: Math.round(niftyData.high * 100) / 100,
                    low: Math.round(niftyData.low * 100) / 100,
                    note: niftyData.changePercent > 0 ? 'Bullish Momentum' : niftyData.changePercent < 0 ? 'Bearish Trend' : 'Flat'
                },
                sensex: {
                    value: Math.round(sensexData.price * 100) / 100,
                    change: Math.round(sensexData.changePercent * 100) / 100,
                    changePoints: Math.round(sensexData.change * 100) / 100,
                    high: Math.round(sensexData.high * 100) / 100,
                    low: Math.round(sensexData.low * 100) / 100,
                    note: sensexData.changePercent > 0 ? 'Positive Sentiment' : sensexData.changePercent < 0 ? 'Cautious Trading' : 'Neutral'
                },
                bankNifty: {
                    value: Math.round(bankNiftyData.price * 100) / 100,
                    change: Math.round(bankNiftyData.changePercent * 100) / 100,
                    changePoints: Math.round(bankNiftyData.change * 100) / 100,
                    high: Math.round(bankNiftyData.high * 100) / 100,
                    low: Math.round(bankNiftyData.low * 100) / 100,
                    note: bankNiftyData.changePercent > 0 ? 'Banking Strong' : bankNiftyData.changePercent < 0 ? 'Banking Weak' : 'Stable'
                }
            };

            // Prepare response
            const responseData = {
                success: true,
                data: marketData,
                source: 'yahoo_finance_stream',
                timestamp: new Date().toISOString(),
                marketStatus: isMarketOpen() ? 'open' : 'closed'
            };

            // Update cache
            marketDataCache = responseData;
            cacheTimestamp = Date.now();

            // Send as SSE event
            res.write(`data: ${JSON.stringify(responseData)}\n\n`);

            console.log('📊 Market data streamed to client (fresh from Yahoo Finance)');
        } catch (error) {
            console.error('❌ Error streaming market data:', error.message);

            // Use cache if available, even if expired, as fallback
            if (marketDataCache) {
                console.log('⚠️ Yahoo Finance fetch failed, using expired cache as fallback');
                res.write(`data: ${JSON.stringify(marketDataCache)}\n\n`);
                return;
            }

            // Send fallback data
            const now = new Date();
            const hour = now.getHours();
            const marketOpen = hour >= 9 && hour < 16;
            const timeVariation = marketOpen ? (Math.sin(now.getMinutes() / 10) * 0.002) : 0;

            res.write(`data: ${JSON.stringify({
                success: true,
                data: {
                    nifty: {
                        value: Math.round(25500 * (1 + timeVariation) * 100) / 100,
                        change: Math.round(timeVariation * 10000) / 100,
                        changePoints: Math.round(25500 * timeVariation * 100) / 100,
                        note: timeVariation > 0 ? 'Bullish Momentum' : 'Consolidating'
                    },
                    sensex: {
                        value: Math.round(84000 * (1 + timeVariation) * 100) / 100,
                        change: Math.round(timeVariation * 10000) / 100,
                        changePoints: Math.round(84000 * timeVariation * 100) / 100,
                        note: timeVariation > 0 ? 'Positive Sentiment' : 'Range Bound'
                    },
                    bankNifty: {
                        value: Math.round(53500 * (1 + timeVariation * 1.1) * 100) / 100,
                        change: Math.round(timeVariation * 1.1 * 10000) / 100,
                        changePoints: Math.round(53500 * timeVariation * 1.1 * 100) / 100,
                        note: timeVariation > 0 ? 'Banking Strong' : 'Banking Neutral'
                    }
                },
                source: 'fallback_stream',
                timestamp: new Date().toISOString(),
                marketStatus: marketOpen ? 'open' : 'closed'
            })}\n\n`);
        }
    };

    // Send initial data immediately
    await sendMarketUpdate();

    // Then send updates every 30 seconds (to avoid rate limiting)
    const intervalId = setInterval(sendMarketUpdate, 30000);

    // Clean up on client disconnect
    req.on('close', () => {
        clearInterval(intervalId);
        console.log('📡 SSE client disconnected from market stream');
    });
});


// ============ Daily Video Sync Scheduler ============
const videoSync = require('./utils/daily-video-sync');

// API: Get synced videos (with filtering)
app.get('/api/synced-videos', async (req, res) => {
    try {
        const { category, source, limit } = req.query;
        const videos = await videoSync.getVideosForAPI(
            category || null,
            source || null,
            parseInt(limit) || 20
        );
        res.json({ success: true, count: videos.length, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Manually trigger video sync (admin only)
app.post('/api/sync-videos', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        console.log(`📹 Manual video sync triggered by ${req.user.email}`);
        const result = await videoSync.runDailySync();
        res.json({ success: true, message: 'Video sync completed', data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Get sync status
app.get('/api/sync-status', async (req, res) => {
    try {
        const Video = require('./models/Video');
        const lastVideo = await Video.findOne().sort({ updatedAt: -1 });
        const totalVideos = await Video.countDocuments();
        const youtubeCount = await Video.countDocuments({ source: 'youtube' });
        const instagramCount = await Video.countDocuments({ source: 'instagram' });

        res.json({
            success: true,
            data: {
                totalVideos,
                youtube: youtubeCount,
                instagram: instagramCount,
                lastSync: lastVideo?.updatedAt || null,
                nextSync: '8:00 AM IST daily'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (MongoDB Mode)`);

    // Start the daily 8 AM video sync scheduler
    console.log('\n🎬 Starting BizzShort Video Sync Scheduler...');
    videoSync.scheduleDaily8AM();

    // Run initial sync on server start (optional - comment out if not needed)
    if (process.env.SYNC_ON_START === 'true') {
        console.log('📹 Running initial video sync...');
        videoSync.runDailySync().catch(err => console.error('Initial sync error:', err));
    }
});
