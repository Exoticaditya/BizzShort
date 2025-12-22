# Verification Plan

## 1. CSS Conflict Resolution
- [x] Verified `wirecable-grid.css` `max-width` is now 1500px, consistent with `main-style.css`. `video-cards.css` relies on default which is now consistent.

## 2. Video Manager Implementation
### Backend
- [ ] Verify `server.js` listens on `/api/videos` (GET, POST, PUT, DELETE).
- [ ] Verify `models/Video.js` exists and is imported.

### Admin Panel
- [ ] Verify `admin.html` has the new Video Manager UI (Form + Table).
- [ ] Verify `assets/js/admin-enhanced.js` has the logic to `loadVideos`, `saveVideo`, `deleteVideo`.

### Frontend
- [ ] Verify `assets/js/video-manager.js` attempts to `fetch('/api/videos')`.
- [ ] Verify fallback mechanism works (if API fails, static data is used).

## 3. Manual Test Steps for User
1.  **Login to Admin Panel:** Navigate to `/admin-login.html` and login.
2.  **Go to Video Manager:** Click on "Video Manager" in the sidebar.
3.  **Add Video:** Click "Add Video", fill in details (use a YouTube URL), and save.
4.  **Verify Listing:** Check if the new video appears in the table.
5.  **Check Homepage:** Go to `index.html` (refresh) and verify the new video appears in the grid.
