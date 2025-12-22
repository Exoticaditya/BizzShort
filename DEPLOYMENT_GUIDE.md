# Deployment Guide - BizzShort

This guide outlines how to deploy the BizzShort application (Backend + Frontend) to a live server.

## Recommended Platform: Render.com (Free Tier Available)
Render is effectively the new Heroku. It allows you to deploy Node.js web services easily and supports MongoDB.

### Prerequisites
1.  **GitHub Account**: Your code must be pushed to a GitHub repository.
2.  **MongoDB Atlas Account**: You need a cloud database connection URI.

### Step 1: Prepare Database (MongoDB Atlas)
1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  In "Database Access", create a user (e.g., `admin`) and password.
4.  In "Network Access", allow access from anywhere (`0.0.0.0/0`) or specific IPs.
5.  Click **Connect** -> **Drivers** -> **Node.js** and copy the connection string.
    *   Example: `mongodb+srv://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<password>` with your actual password.

### Step 2: Push Code to GitHub
Ensure your project root (containing `server.js` and `package.json`) is the root of your repository.
```bash
git init
git add .
git commit -m "Deployment ready"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 3: Deploy to Render
1.  Sign up/Login to [Render](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `bizzshort-app`
    *   **Region**: Closest to you (e.g., Singapore/Ohio).
    *   **Branch**: `main`.
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Plan**: Free
5.  **Environment Variables** (Crucial Step):
    *   Scroll down to "Advanced" or "Environment Variables".
    *   Add Key: `MONGO_URI` | Value: (Your MongoDB Atlas connection string from Step 1).
    *   Add Key: `JWT_SECRET` | Value: (A long random string, e.g., `mysecretkey123`).
    *   Add Key: `NODE_ENV` | Value: `production`.
6.  Click **Create Web Service**.

### Step 4: Verification
Render will start building your app. Watch the logs.
- Look for: `✅ MongoDB Connected`.
- Look for: `Server running on port ...`.

Once deployed, Render will give you a URL (e.g., `https://bizzshort.onrender.com`).
- Open that URL to see your live Admin Panel/Website.
- Go to `/admin.html` to log in.

## Alternative: Vercel (Frontend only or Serverless)
Since BizzShort uses a custom Express server for API + Static files, **Render is better** because it supports long-running Node processes. Vercel requires converting Express routes to Serverless functions (`/api/*`), which would require code restructuring.

**Stick to Render or Heroku for this project structure.**

## Local Production Test
To test "production" mode locally before deploying:
1.  Create a `.env` file with your real MongoDB Atlas URI.
2.  Run:
    ```bash
    npm install
    node server.js
    ```
3.  Open `http://localhost:3000` in your browser.
