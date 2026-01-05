# 🚀 BizzShort - Quick Start & Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running Locally](#running-locally)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### Required Accounts
- MongoDB Atlas account (free tier available)
- (Optional) GitHub account for deployment
- (Optional) Render/Netlify/Vercel account for hosting

---

## Installation

### Step 1: Clone or Download the Project
```bash
git clone <your-repo-url>
cd BizzShort
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Installation Check
```bash
npm run install-check
```

This will verify all dependencies and directory structure.

---

## Configuration

### Method 1: Automated Setup (Recommended)
```bash
node setup.js
```

Follow the prompts to configure:
- MongoDB URI
- JWT Secret
- Admin Setup Key
- CORS Origins

### Method 2: Manual Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and configure:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bizzshort
   JWT_SECRET=your_super_secret_key_min_32_characters
   SETUP_KEY=your_secure_setup_key
   PORT=3000
   NODE_ENV=production
   ```

### Getting MongoDB URI

#### Option A: MongoDB Atlas (Cloud - Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

#### Option B: Local MongoDB
```env
MONGO_URI=mongodb://localhost:27017/bizzshort
```

---

## Running Locally

### Step 1: Start the Server
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 3000 (MongoDB Mode)
```

### Step 2: Initialize Database
1. Open browser and visit:
   ```
   http://localhost:3000/api/setup-production?key=YOUR_SETUP_KEY
   ```
   (Replace `YOUR_SETUP_KEY` with the value from your `.env` file)

2. You should see "Setup Complete 🚀"

### Step 3: Access Admin Panel
1. Visit: `http://localhost:3000/admin-login.html`
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`

3. **⚠️ IMPORTANT:** Change the admin password immediately!

### Step 4: Access the Website
Visit `http://localhost:3000/index.html` to see your website

---

## Deployment

### Option 1: Render (Recommended)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### Step 2: Deploy on Render
1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** bizzshort
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

#### Step 3: Add Environment Variables
Add these in Render dashboard:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SETUP_KEY=your_setup_key
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-app.onrender.com
```

#### Step 4: Deploy
Click "Create Web Service" and wait for deployment

#### Step 5: Initialize Database
Visit: `https://your-app.onrender.com/api/setup-production?key=YOUR_SETUP_KEY`

---

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

---

### Option 3: Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

---

## Troubleshooting

### Issue: "MONGO_URI is missing"
**Solution:** Check your `.env` file and ensure `MONGO_URI` is set (NOT `MONGODB_URI`)

### Issue: "Cannot connect to MongoDB"
**Solutions:**
1. Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for all IPs)
2. Verify username/password in connection string
3. Ensure database user has read/write permissions

### Issue: "JWT_SECRET is not defined"
**Solution:** Add `JWT_SECRET` to your `.env` file (minimum 32 characters)

### Issue: "Admin login not working"
**Solutions:**
1. Visit setup URL first: `/api/setup-production?key=YOUR_SETUP_KEY`
2. Check console for errors
3. Verify MongoDB connection is working

### Issue: "API requests failing"
**Solutions:**
1. Check browser console for errors
2. Verify `baseURL` in API calls
3. For local development, backend should run on port 3000
4. Check CORS settings in `.env`

### Issue: "Port 3000 already in use"
**Solution:** 
1. Change PORT in `.env` file
2. Or kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <process_id> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   ```

### Issue: "Images/uploads not showing"
**Solution:** Ensure `uploads/` directory exists and has proper permissions

### Issue: "Module not found" errors
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Testing the Installation

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45
}
```

### 2. Test API Endpoints
```bash
# Get articles
curl http://localhost:3000/api/articles

# Get events
curl http://localhost:3000/api/events

# Get videos
curl http://localhost:3000/api/videos
```

---

## Default Admin Credentials

⚠️ **SECURITY NOTICE:** Change these immediately after first login!

- **Username:** `admin`
- **Password:** `admin123`

---

## Important URLs

- **Website:** `http://localhost:3000/`
- **Admin Login:** `http://localhost:3000/admin-login.html`
- **Admin Panel:** `http://localhost:3000/admin.html`
- **Setup Route:** `http://localhost:3000/api/setup-production?key=YOUR_KEY`
- **Health Check:** `http://localhost:3000/api/health`

---

## Support & Documentation

- **Setup Guide:** `SETUP_COMPLETE_GUIDE.md`
- **Admin Panel Guide:** `ADMIN_PANEL_COMPLETE.md`
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md`

---

## 🎉 Congratulations!

Your BizzShort platform is now ready! If you encounter any issues, refer to the troubleshooting section above.
