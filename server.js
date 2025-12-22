const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Models
const Article = require('./models/Article');
const Event = require('./models/Event');
const Interview = require('./models/Interview');
const News = require('./models/News');
const IndustryUpdate = require('./models/IndustryUpdate');
const Client = require('./models/Client');
const User = require('./models/User');
const Advertisement = require('./models/Advertisement');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname))); // Serve Admin Panel

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
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// ============ Middleware ============
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    } else if (req.headers['session-id']) {
        // Backward compatibility for existing frontend using session-id header
        try {
            token = req.headers['session-id'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ success: false, error: 'Not authorized, invalid session' });
        }
    } else {
        res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
};

// ============ Setup Route (Emergency Seed) ============
app.get('/api/setup-production', async (req, res) => {
    // Basic protection using query param
    // Usage: /api/setup-production?key=secure_setup_123
    if (req.query.key !== 'secure_setup_123') {
        return res.status(403).send('Forbidden: Invalid Setup Key. Use ?key=secure_setup_123');
    }

    try {
        // 1. Create Admin if not exists
        let admin = await User.findOne({ name: 'admin' });
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            admin = await User.create({
                name: 'admin',
                email: 'admin@bizzshort.com',
                password: hashedPassword,
                role: 'ADMIN'
            });
            console.log('Setup: Admin Created');
        } else {
            console.log('Setup: Admin already exists');
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
                    title: "E-Summit 2025: Asia's Largest Business Conclave",
                    date: "2025-12-11",
                    location: "IIT Bombay, Mumbai",
                    description: "Asia's largest business conclave, focusing on groundbreaking ideas and visionary solutions.",
                    category: "Conference",
                    maxAttendees: 500
                },
                {
                    title: "Bengaluru Tech Summit 2025",
                    date: "2025-11-19",
                    location: "Bangalore Palace Grounds",
                    description: "A broad-based technology summit covering IT, innovation, IoT, and digital transformation.",
                    category: "Summit",
                    maxAttendees: 2000
                }
            ],
            interviews: [
                {
                    name: "Roshni Nadar Malhotra",
                    designation: "Chairperson",
                    company: "HCLTech",
                    description: "Discussing India's AI Future and Women's Leadership in Tech at Davos 2024."
                },
                {
                    name: "Satya Nadella",
                    designation: "Chairman & CEO",
                    company: "Microsoft",
                    description: "Microsoft's Commitment to India's Digital Transformation and AI investment."
                }
            ],
            industry: [
                {
                    sector: "Semiconductor",
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
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ $or: [{ name: username }, { email: username }] });

        // DEV: Create default admin if DB is empty and credentials match hardcoded
        if (!user && username === 'admin' && password === 'admin123') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = await User.create({
                name: 'admin',
                email: 'admin@bizzshort.com',
                password: hashedPassword,
                role: 'ADMIN'
            });
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                success: true,
                sessionId: generateToken(user._id),
                user: { id: user._id, name: user.name, role: user.role }
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.get('/api/admin/verify-session', async (req, res) => {
    const token = req.headers['session-id'];
    if (!token) return res.json({ valid: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
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
            users: await User.countDocuments()
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
        const { title, category, excerpt, content, author, tags } = req.body;

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
            category,
            excerpt,
            content,
            image: req.file ? `/uploads/${req.file.filename}` : undefined,
            author: parsedAuthor,
            tags: parsedTags
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

// Events
app.get('/api/events', async (req, res) => {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, data: events.map(e => ({ ...e._doc, id: e._id })) });
});

app.post('/api/events', protect, conditionalUpload('image'), async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, image: req.file ? `/uploads/${req.file.filename}` : undefined });
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
app.post('/api/advertisements', protect, conditionalUpload('image'), async (req, res) => {
    const ad = await Advertisement.create({ ...req.body, imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined });
    res.status(201).json({ success: true, data: { ...ad._doc, id: ad._id } });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (MongoDB Mode)`);
});
