# BizzShort - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js v14+ installed
- MongoDB database (local or cloud)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BizzShort
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random string (min 32 chars)
   - `SETUP_KEY`: A secure setup key
   - `CORS_ORIGIN`: Your domain(s)

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   - Website: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin-login.html`
   - Default Admin: username: `admin`, password: `admin123`

---

## 🔐 First-Time Setup

### Option 1: Using Setup Route (Recommended)
Visit: `http://localhost:3000/api/setup-production?key=YOUR_SETUP_KEY`

This will:
- Create/reset the admin user
- Seed initial data (articles, events, interviews)
- Set up the database

### Option 2: Manual Admin Creation
The admin user will be auto-created on first login attempt with `admin/admin123`

---

## 📝 Admin Panel Features

1. **Dashboard**: View statistics and overview
2. **Articles**: Manage blog posts and news articles
3. **Videos**: Manage video content from YouTube/Instagram
4. **Events**: Manage business events and conferences
5. **Interviews**: Manage executive interviews
6. **Advertisements**: Manage ad placements
7. **Clients**: Manage partner companies
8. **Users**: Manage admin users
9. **YouTube Converter**: Convert YouTube videos to articles

---

## 🛡️ Security Features

✅ Helmet.js security headers  
✅ Rate limiting (100 req/15min general, 5 req/15min auth)  
✅ CORS whitelist protection  
✅ NoSQL injection prevention  
✅ XSS attack prevention  
✅ JWT authentication  
✅ Input validation & sanitization  
✅ Secure password hashing (bcrypt)

---

## 📊 Live Market Data

Market data automatically updates every 30 seconds during market hours:
- **Market Hours**: Monday-Friday, 9:15 AM - 3:30 PM IST
- **Indices**: Nifty 50, Sensex, Bank Nifty, Nifty IT
- **Data**: Current price, change %, high, low, volume

---

## 🔧 Configuration

### Database
Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bizzshort
```

### Security
Update these in `.env`:
```
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
SETUP_KEY=your_secure_setup_key
```

### CORS
Add allowed origins in `.env`:
```
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

---

## 📱 API Endpoints

### Public Endpoints
- `GET /api/articles` - Get all articles
- `GET /api/events` - Get all events
- `GET /api/interviews` - Get all interviews
- `GET /api/news` - Get breaking news
- `GET /api/industry` - Get industry updates
- `GET /api/clients` - Get client list
- `GET /api/videos` - Get video list
- `GET /api/advertisements` - Get active ads

### Protected Endpoints (Require Auth Token)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify-session` - Verify session
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- *(Similar routes for events, interviews, etc.)*

---

## 🧪 Testing

### Test Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Rate Limiting
Make 6+ rapid requests to `/api/admin/login` to trigger rate limit.

### Test CORS
Try accessing from unauthorized origin - should be blocked.

---

## 🚀 Deployment

### Deploy to Render/Heroku/etc.

1. Set environment variables in platform dashboard
2. Connect GitHub repository
3. Set build command: (none needed)
4. Set start command: `npm start`
5. Deploy

### Environment Variables to Set:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `CORS_ORIGIN`
- `NODE_ENV=production`
- `SETUP_KEY`
- `PORT` (usually auto-set)

---

## 📁 Project Structure

```
BizzShort/
├── assets/
│   ├── css/          # Stylesheets
│   ├── js/           # Frontend JavaScript
│   └── images/       # Static images
├── config/
│   └── db.js         # Database connection
├── models/           # Mongoose models
├── docs/             # Documentation
├── uploads/          # User uploaded files
├── server.js         # Main server file
├── package.json      # Dependencies
└── .env              # Environment variables (not in repo)
```

---

## ⚠️ Important Notes

1. **Change default admin password** after first login
2. **Never commit `.env` file** to version control
3. **Use strong JWT_SECRET** in production (min 32 characters)
4. **Set NODE_ENV=production** for production deployment
5. **Configure CORS_ORIGIN** with your actual domain
6. **Regular database backups** recommended

---

## 🐛 Troubleshooting

### Server won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Run `npm install` to ensure dependencies are installed

### Admin login fails
- Check console for errors
- Verify MongoDB is connected
- Try using setup route to reset admin
- Check JWT_SECRET is set

### Market data not showing
- Check browser console for errors
- Verify live-market-data.js is loaded
- Check HTML has correct data attributes

### CORS errors
- Add your domain to CORS_ORIGIN in .env
- For development, set NODE_ENV=development

---

## 📞 Support & Documentation

- Full security documentation: `SECURITY_FIXES.md`
- Deployment guide: `DEPLOYMENT_GUIDE.md`
- Admin panel guide: `docs/ADMIN_PANEL_GUIDE.md`

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Server starts without errors
- [ ] Admin login works
- [ ] Dashboard shows statistics
- [ ] Market data displays on homepage
- [ ] Can create/edit/delete articles
- [ ] All admin sections accessible
- [ ] Security headers present (check with browser DevTools)
- [ ] Rate limiting works (test rapid requests)

---

**Version:** 2.0  
**Last Updated:** December 26, 2025  
**Status:** ✅ Production Ready
