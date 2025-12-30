# BizzShort - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - The `.env` file is already created
   - **IMPORTANT**: Update `MONGO_URI` with your MongoDB connection string:
     
     **For Local MongoDB:**
     ```
     MONGO_URI=mongodb://localhost:27017/bizzshort
     ```
     
     **For MongoDB Atlas (Cloud):**
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bizzshort?retryWrites=true&w=majority
     ```

3. **Start MongoDB (if using local)**
   ```bash
   mongod
   ```

4. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin-login.html
   - Default Admin Credentials:
     - Username: `admin`
     - Password: `admin123`

### Initial Setup

After starting the server for the first time, visit:
```
http://localhost:3000/api/setup-production?key=bizzshort_setup_key_2025_change_in_production
```

This will:
- Create the admin user
- Seed sample data (articles, events, interviews)

---

## 📁 Project Structure

```
BizzShort/
├── server.js                  # Express server & API routes
├── package.json               # Dependencies
├── .env                       # Environment variables (CREATED)
├── config/
│   └── db.js                  # MongoDB connection
├── models/                    # Mongoose schemas
│   ├── Article.js
│   ├── Event.js
│   ├── Interview.js
│   ├── News.js
│   ├── Video.js
│   ├── Advertisement.js
│   └── User.js
├── assets/
│   ├── css/                   # Stylesheets (ALL CREATED/FIXED)
│   │   ├── main-style.css
│   │   ├── admin.css          # ✅ CREATED
│   │   ├── video-cards.css    # ✅ CREATED
│   │   ├── consistency-fixes.css # ✅ CREATED
│   │   └── ...
│   └── js/                    # JavaScript files (UPDATED)
│       ├── config.js          # ✅ CREATED - API URL configuration
│       ├── api.js             # ✅ FIXED - Dynamic API URLs
│       ├── admin-enhanced.js  # ✅ FIXED
│       ├── admin-streamlined.js # ✅ FIXED
│       └── ...
├── index.html                 # Homepage (UPDATED)
├── admin.html                 # Admin Panel (UPDATED)
├── admin-login.html           # Admin Login (UPDATED)
└── docs/                      # Documentation
```

---

## 🔧 Configuration Details

### Environment Variables (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | **REQUIRED** |
| `JWT_SECRET` | JWT signing secret | **Change in production** |
| `JWT_EXPIRE` | Token expiration | `30d` |
| `CORS_ORIGIN` | Allowed origins | Multiple origins |
| `SETUP_KEY` | Setup route key | **Change in production** |

### API URL Configuration (NEW!)

The application now automatically detects the environment:
- **Local Development**: Uses `http://localhost:3000`
- **Production**: Uses configured production URL
- **Dynamic Detection**: Works seamlessly in both environments

---

## 🛠️ Features Fixed

### ✅ Issues Resolved

1. **Missing CSS Files** - Created:
   - `admin.css` - Complete admin panel styling
   - `video-cards.css` - Video display components
   - `consistency-fixes.css` - UI consistency improvements

2. **Environment Configuration**
   - Created `.env` file with all required variables
   - Added proper MongoDB URI placeholder

3. **API Configuration**
   - Created `assets/js/config.js` for dynamic API URL detection
   - Updated all JavaScript files to use dynamic URLs:
     - `api.js`
     - `admin-enhanced.js`
     - `admin-streamlined.js`
     - `latest-updates-loader.js`
     - `admin-login.html`

4. **Script Loading Order**
   - Added `config.js` to HTML files before other scripts
   - Updated version tags for cache busting

### ✅ New Features Added

1. **Automatic Environment Detection**
   - Works seamlessly on localhost and production
   - No manual configuration needed

2. **Improved Error Handling**
   - Better error messages in API calls
   - Console logging for debugging

3. **Admin Panel Enhancements**
   - Complete styling with professional UI
   - Responsive design
   - Modal forms for content management

---

## 📊 Admin Panel Features

### Dashboard
- View statistics (Videos, Events, Ads, Views)
- Visual charts and analytics

### Videos Management
- Add YouTube videos
- Edit video details
- Delete videos
- Featured positioning

### Events Management
- Create/Edit events
- Upload event images
- Manage event details

### Advertisements
- Upload ad images
- Set ad positions
- Track ad performance

---

## 🌐 API Endpoints

### Public Endpoints
```
GET  /api/health              # Health check
GET  /api/articles            # Get articles
GET  /api/events              # Get events
GET  /api/videos              # Get videos
GET  /api/interviews          # Get interviews
GET  /api/industry            # Get industry updates
```

### Admin Endpoints (Require Authentication)
```
POST   /api/admin/login       # Admin login
GET    /api/stats             # Get statistics
POST   /api/articles          # Create article
PUT    /api/articles/:id      # Update article
DELETE /api/articles/:id      # Delete article
(Similar for events, videos, advertisements, etc.)
```

---

## 🚀 Deployment

### Deploy to Render.com (Recommended)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up/Login

2. **Create Web Service**
   - New → Web Service
   - Connect your GitHub repository
   - Configure:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: Node

3. **Add Environment Variables**
   - Add all variables from `.env` file
   - **IMPORTANT**: Set production MongoDB URI
   - Update `SETUP_KEY` to a secure value
   - Update `JWT_SECRET` to a secure random string

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment

5. **Initial Setup**
   - Visit: `https://your-app.onrender.com/api/setup-production?key=YOUR_SETUP_KEY`

### Deploy to Other Platforms

The application works on:
- Heroku
- Vercel (with serverless functions)
- AWS EC2
- DigitalOcean
- Any Node.js hosting

---

## 🔒 Security Recommendations

### For Production:

1. **Change Default Credentials**
   ```javascript
   // After first login, change admin password immediately
   ```

2. **Update Environment Variables**
   - Generate a strong `JWT_SECRET` (min 32 characters)
   - Change `SETUP_KEY` to something unique
   - Use strong MongoDB credentials

3. **Enable HTTPS**
   - Use SSL certificates (Let's Encrypt recommended)

4. **Update CORS Settings**
   - Set `CORS_ORIGIN` to your actual domain

5. **Database Security**
   - Use MongoDB Atlas with IP whitelisting
   - Enable authentication
   - Use strong passwords

---

## 🧪 Testing

### Test Database Connection
```bash
npm test
```

### Test API Health
```bash
curl http://localhost:3000/api/health
```

### Test Admin Login
1. Go to http://localhost:3000/admin-login.html
2. Enter credentials (admin/admin123)
3. Should redirect to admin panel

---

## 📝 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check if MongoDB is running: `mongod`
- Verify `MONGO_URI` in `.env` file
- For Atlas, check network access settings

### Issue: "API calls failing"
**Solution**:
- Check console for API URL being used
- Verify server is running on correct port
- Check CORS settings in `.env`

### Issue: "Admin login not working"
**Solution**:
- Run setup route first
- Check if `JWT_SECRET` is set in `.env`
- Clear browser localStorage and try again

### Issue: "CSS/JS not loading"
**Solution**:
- Hard refresh browser (Ctrl+F5 / Cmd+Shift+R)
- Check browser console for errors
- Verify file paths are correct

---

## 🔄 Development Workflow

### Adding New Content

1. **Via Admin Panel** (Recommended)
   - Login to admin panel
   - Use the UI to add videos, events, etc.

2. **Via API**
   - Use Postman or curl
   - Include authentication token

### Updating Frontend

1. Edit HTML/CSS/JS files
2. Clear browser cache (Ctrl+F5)
3. Test changes

### Updating Backend

1. Edit `server.js` or model files
2. Restart server
3. Test API endpoints

---

## 📈 Next Steps

1. **Set up MongoDB** (local or Atlas)
2. **Update `.env` file** with your MongoDB URI
3. **Start the server** with `npm start`
4. **Run initial setup** via the setup route
5. **Login to admin panel** and start adding content
6. **Deploy to production** when ready

---

## 💡 Tips

- Use `npm run dev` during development for auto-reload
- Check browser console for debugging
- Monitor MongoDB connections
- Regular backups of database
- Keep dependencies updated

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review console logs
3. Check MongoDB connection
4. Verify environment variables

---

## ✅ Checklist Before Going Live

- [ ] MongoDB URI updated
- [ ] JWT_SECRET changed to random string
- [ ] SETUP_KEY changed to unique value
- [ ] Admin password changed
- [ ] CORS_ORIGIN updated to production domain
- [ ] All environment variables set
- [ ] Database backup strategy in place
- [ ] SSL certificate configured
- [ ] Domain configured correctly
- [ ] Testing completed

---

**Your BizzShort website is now fully configured and ready to use! 🎉**
