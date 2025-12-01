# 🚀 BizzShort Setup Guide

Complete guide for setting up BizzShort with multi-language support and backend API.

---

## 📋 Prerequisites

- **Node.js** >= 14.0.0 ([Download](https://nodejs.org/))
- **npm** >= 6.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)

---

## 🎯 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Exoticaditya/BizzShort.git
cd BizzShort
```

### 2. Install Backend Dependencies

```bash
npm install
```

This will install:
- express
- cors
- morgan
- body-parser
- multer
- dotenv

### 3. Create Uploads Directory

```bash
mkdir uploads
```

### 4. Start the Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start at: `http://localhost:3000`

### 5. Open the Website

Open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080

# Using VS Code Live Server
# Install Live Server extension and click "Go Live"
```

Website will be available at: `http://localhost:8080`

---

## 🌍 Multi-Language Support

### Supported Languages

1. **English** (en) 🇬🇧
2. **Hindi** (hi) 🇮🇳
3. **Spanish** (es) 🇪🇸
4. **French** (fr) 🇫🇷
5. **German** (de) 🇩🇪
6. **Chinese** (zh) 🇨🇳

### How to Use

1. **Automatic Detection**: The language switcher appears in the header
2. **Change Language**: Click the language button and select your preferred language
3. **Persistent**: Selected language is saved in localStorage

### Adding Translations

Edit `assets/js/language.js`:

```javascript
getTranslations(language) {
    const translations = {
        'your_language_code': {
            'nav.home': 'Your Translation',
            'nav.blog': 'Your Translation',
            // Add more translations
        }
    };
}
```

### Using i18n in HTML

Add `data-i18n` attribute to any element:

```html
<a href="#" data-i18n="nav.home">Home</a>
<button data-i18n="common.submit">Submit</button>
<input data-i18n-placeholder="common.search" placeholder="Search">
```

---

## 📡 Backend API Integration

### API Configuration

The API automatically detects the environment:

- **Development**: `http://localhost:3000`
- **Production**: `https://api.bizzshort.com`

### Using the API in Your Code

```javascript
// Initialize API client (already done in api.js)
const api = new BizzShortAPI();

// Get articles
const articles = await api.getArticles({ page: 1, limit: 10 });
console.log(articles);

// Subscribe to newsletter
const result = await api.subscribeNewsletter('user@example.com');

// Upload advertisement
const file = document.querySelector('input[type="file"]').files[0];
const upload = await api.uploadAdvertisement(file, {
    title: 'My Ad',
    link: 'https://example.com'
});

// Get analytics
const analytics = await api.getAnalytics('7d');

// Search
const searchResults = await api.search('startup');
```

### API Endpoints

See full documentation in [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

**Key Endpoints:**
- `GET /api/articles` - Get all articles
- `GET /api/analytics` - Get analytics data
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/contact` - Submit contact form
- `GET /api/events` - Get events
- `GET /api/search` - Search content

---

## 🔧 Configuration

### Backend Configuration

Create `.env` file in root directory:

```env
PORT=3000
NODE_ENV=development

# Database (when implemented)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bizzshort
DB_USER=your_user
DB_PASS=your_password

# Email (when implemented)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# JWT Secret (when auth is implemented)
JWT_SECRET=your-secret-key-here

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Frontend Configuration

Edit `assets/js/api.js` to change API base URL:

```javascript
getAPIBaseURL() {
    // Custom API URL
    return 'https://your-custom-api.com';
}
```

---

## 📱 Features Setup

### 1. Newsletter Subscription

Already integrated! Form submission automatically calls the API:

```javascript
// In your code
const form = document.querySelector('.newsletter-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    const result = await api.subscribeNewsletter(email);
    if (result.success) {
        alert('Subscribed successfully!');
    }
});
```

### 2. Contact Form

Integrated with API validation:

```javascript
const result = await api.submitContact({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    message: 'Hello!'
});
```

### 3. Analytics Dashboard

Real-time data from API:

```javascript
// Fetch analytics data
const data = await api.getAnalytics('7d');
// Update charts with real data
```

### 4. Event Registration

```javascript
const result = await api.registerForEvent(eventId, {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    company: 'Tech Corp'
});
```

---

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Get articles
curl http://localhost:3000/api/articles

# Subscribe (POST request)
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Test Frontend

1. Open browser console (F12)
2. Test API calls:

```javascript
// Test API connection
const health = await api.request('/api/health');
console.log(health);

// Test getting articles
const articles = await api.getArticles();
console.log(articles);

// Test language switching
languageManager.changeLanguage('hi'); // Switch to Hindi
```

---

## 🚀 Deployment

### Backend Deployment (Node.js)

#### Option 1: Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create bizzshort-api

# Deploy
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

#### Option 2: DigitalOcean / AWS / Azure

1. Set up a VPS
2. Install Node.js
3. Clone repository
4. Install dependencies: `npm install --production`
5. Use PM2 to keep server running:

```bash
npm install -g pm2
pm2 start server.js --name bizzshort-api
pm2 save
pm2 startup
```

### Frontend Deployment

#### Option 1: GitHub Pages

```bash
# Push to GitHub
git add .
git commit -m "Deploy"
git push origin main

# Enable GitHub Pages in repository settings
```

#### Option 2: Netlify

1. Connect repository to Netlify
2. Build command: (leave empty)
3. Publish directory: `/`
4. Deploy!

#### Option 3: Vercel

```bash
npm install -g vercel
vercel
```

---

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **API Keys**: Store in environment variables
3. **Input Validation**: Always validate user input
4. **Rate Limiting**: Implement rate limiting in production
5. **HTTPS**: Use HTTPS in production
6. **CORS**: Configure CORS properly
7. **File Uploads**: Validate file types and sizes

---

## 📊 Monitoring

### Backend Monitoring

```javascript
// Check server health
GET /api/health

// Response
{
  "status": "ok",
  "timestamp": "2025-12-01T10:00:00.000Z",
  "service": "BizzShort API",
  "version": "1.0.0"
}
```

### Frontend Monitoring

Check browser console for:
- API connection status
- Language loading status
- Performance metrics

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Server won't start
```bash
# Check if port is already in use
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change PORT in .env
```

**Problem**: API returns 404
- Check if server is running
- Verify API endpoint URL
- Check CORS configuration

### Frontend Issues

**Problem**: Language switcher not appearing
- Check if `language.js` is loaded
- Check browser console for errors
- Verify header structure in HTML

**Problem**: API calls failing
- Check if backend server is running
- Verify API base URL in `api.js`
- Check browser console for CORS errors

---

## 📚 Additional Resources

- [API Documentation](API_DOCUMENTATION.md)
- [README](README_NEW.md)
- [GitHub Repository](https://github.com/Exoticaditya/BizzShort)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 💡 Next Steps

1. ✅ Set up development environment
2. ✅ Test backend API
3. ✅ Test multi-language support
4. 🔄 Add database integration (MongoDB/PostgreSQL)
5. 🔄 Implement user authentication
6. 🔄 Add email notifications
7. 🔄 Set up automated testing
8. 🔄 Deploy to production

---

## 📞 Support

Need help? Reach out:

- **Email**: info@bizzshort.com
- **Phone**: +91 9876543210
- **GitHub Issues**: [Create an issue](https://github.com/Exoticaditya/BizzShort/issues)
- **Documentation**: [Read the docs](https://github.com/Exoticaditya/BizzShort)

---

**Happy Coding! 🚀**

*Last Updated: December 1, 2025*
