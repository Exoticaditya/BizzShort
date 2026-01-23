# BizzShort Bug Catching & Resolution Checklist

This document serves as a living checklist for catching and resolving bugs in the BizzShort codebase.

---

## 🔴 Critical Issues (Must Fix Before Launch)

### Placeholder Values
- [ ] **AdSense Publisher ID** (`index.html:60`)
  - Current: `ca-pub-XXXXXXXXXXXXXXXX`
  - Action: Replace with real AdSense ID or remove script entirely
  
- [ ] **Google Analytics ID** (`index.html:65`)
  - Current: `G-XXXXXXXXXX`
  - Action: Replace with real GA4 Measurement ID or remove script

### Duplicate Meta Tags (`index.html`)
- [x] ~~Remove duplicate `<meta name="description">` (lines 15 and 64)~~ ✅ Fixed
- [x] ~~Remove duplicate `<meta name="author">` tag~~ ✅ Fixed
- [x] ~~Remove duplicate `<meta name="robots">` tag~~ ✅ Fixed
- [x] ~~Remove duplicate `<link rel="canonical">`~~ ✅ Fixed (kept www.bizzshort.com)
- [x] ~~Remove duplicate Open Graph tags~~ ✅ Fixed
- [x] ~~Remove duplicate Twitter Card tags~~ ✅ Fixed

### Instagram Integration (`instagram-thumbnail-fetcher.js`)
- [x] ~~Remove or fix `YOUR_TOKEN` placeholder~~ ✅ Fixed (removed, using public API only)
- [x] ~~Add rate limit handling~~ ✅ Fixed

---

## 🟡 Medium Priority Issues

### Missing API Endpoint
- [x] ~~**`/api/synced-videos`**: Referenced in `bizzshort-video-loader.js:15` but not implemented~~ ✅ Fixed (added to server.js)

### Code Quality
- [ ] Replace `setTimeout` in `instagram-thumbnail-fetcher.js:107,115` with custom event
- [ ] Review `bizzshort-video-loader.js` for hardcoded video IDs that should come from database

---

## 🟢 Low Priority / Cleanup

### Potentially Unused Files
Review these files to determine if they can be removed:
- [ ] `assets/js/latest-updates-loader.js` - May be superseded by `bizzshort-video-loader.js`
- [ ] `assets/js/advertise.js` - Verify if still in use

### File Consolidation
- [ ] Consider merging similar JS loader files
- [ ] Review CSS files for unused styles

---

## 📋 Testing Checklist

### Page Load Tests
- [ ] `index.html` - No console errors
- [ ] `about.html` - No console errors
- [ ] `contact.html` - No console errors
- [ ] `advertise.html` - No console errors
- [ ] `events.html` - No console errors
- [ ] `admin.html` - No console errors
- [ ] `admin-login.html` - No console errors
- [ ] `market-chart.html` - No console errors

### Functional Tests
- [ ] Breaking News grid loads with videos
- [ ] Latest Updates section populates
- [ ] Category filters work correctly
- [ ] Client Feature section loads
- [ ] Interview & Podcasts section loads
- [ ] Market sidebar shows data
- [ ] Video modal opens on click (YouTube)
- [ ] Instagram reel modal opens on click
- [ ] Mobile navigation works
- [ ] Footer links are functional
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Admin CRUD operations work

### API Tests
Run these with `curl` or Postman:
```bash
# Health check
curl http://localhost:3000/api/health

# Get videos
curl http://localhost:3000/api/videos

# Get market data
curl http://localhost:3000/api/market-data

# Get articles
curl http://localhost:3000/api/articles

# Get events
curl http://localhost:3000/api/events
```

---

## 🛠 Resolution Log

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-01-20 | Created plan | Initial audit complete | ✅ |
| | | | |

---

## 📝 Notes

- The project uses MongoDB for data storage
- Backend runs on Express.js with JWT authentication
- Frontend is static HTML with vanilla JS
- Video content syncs from YouTube (@bizz_short) and Instagram (bizz_short)
- Market data fetches from Yahoo Finance API with fallback
