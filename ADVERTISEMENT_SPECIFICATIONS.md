# BizzShort Advertisement Sizes & Specifications

## 📐 Advertisement Banner Sizes

### 1. **Top Header Banner**
- **Size:** 970 x 90 pixels
- **Location:** Top of page, right of logo
- **Format:** Leaderboard
- **File:** JPG, PNG, GIF
- **Max File Size:** 150 KB

### 2. **Left Sidebar Ad (Main)**
- **Size:** 300 x 600 pixels
- **Location:** Left side of page (sticky)
- **Format:** Half Page / Large Skyscraper
- **File:** JPG, PNG, GIF
- **Max File Size:** 150 KB

### 3. **Left Sidebar Ad (Secondary)**
- **Size:** 300 x 250 pixels
- **Location:** Left side below main ad
- **Format:** Medium Rectangle
- **File:** JPG, PNG, GIF
- **Max File Size:** 100 KB

### 4. **Right Sidebar Ad (Main)**
- **Size:** 300 x 600 pixels
- **Location:** Right side of page (sticky)
- **Format:** Half Page / Large Skyscraper
- **File:** JPG, PNG, GIF
- **Max File Size:** 150 KB

### 5. **Right Sidebar Ad (Secondary)**
- **Size:** 300 x 250 pixels
- **Location:** Right side below main ad
- **Format:** Medium Rectangle
- **File:** JPG, PNG, GIF
- **Max File Size:** 100 KB

---

## 🎬 Video Player Specifications

### Breaking News Video Players
- **Main Player:** YouTube iframe embed (16:9 aspect ratio)
- **Card Thumbnails:** 600 x 400 pixels
- **Total Cards:** 3 cards below main player

### Latest Updates Video Grid
- **Grid Layout:** 3 columns (responsive)
- **Thumbnails:** YouTube maxresdefault (1280 x 720 pixels)
- **Total Videos:** 9-12 videos per page
- **Category Filters:** All, Business, Markets, Technology, Industry Update

### Interview Section Videos
- **Grid Layout:** 3 columns
- **Video Players:** YouTube iframe embeds
- **Total Interviews:** 3-6 featured interviews

---

## 📊 Admin Panel Advertisement Positions

Available ad positions for admin panel:
1. `top-banner` - Top header leaderboard (970x90)
2. `left-sidebar-main` - Left main ad (300x600)
3. `left-sidebar-secondary` - Left secondary ad (300x250)
4. `right-sidebar-main` - Right main ad (300x600)
5. `right-sidebar-secondary` - Right secondary ad (300x250)

---

## 🎯 Admin Panel Functionality Required

### Advertisement Management
- ✅ Add new advertisement with image upload
- ✅ Select position from dropdown
- ✅ Set ad status (active/inactive)
- ✅ Track impressions and clicks
- ✅ View CTR (Click-Through Rate)
- ✅ Edit existing ads
- ✅ Delete ads

### Video Management
- ✅ Add YouTube video by URL or ID
- ✅ Set video category (Business, Markets, Technology, Industry)
- ✅ Set featured position (Breaking News, Latest Updates, Interviews)
- ✅ Add video title and description
- ✅ Set publish status
- ✅ Edit existing videos
- ✅ Delete videos
- ✅ Bulk import from YouTube channel

---

## 🔧 Technical Implementation

### Advertisement HTML Structure
```html
<aside class="side-ad left-ad">
    <div class="ad-sticky">
        <div class="ad-label">Advertisement</div>
        <!-- 300x600 Main Ad -->
        <img src="[AD_IMAGE_URL]" alt="Advertisement" class="ad-300x600">
        <!-- 300x250 Secondary Ad -->
        <div class="ad-space">
            <img src="[AD_IMAGE_URL]" alt="Advertisement" class="ad-300x250">
        </div>
    </div>
</aside>
```

### Video Embed Structure
```html
<div class="news-video-card-large">
    <div class="video-player-wrapper">
        <img src="[YOUTUBE_THUMBNAIL]" alt="[VIDEO_TITLE]" class="video-thumbnail-img">
        <div class="play-button-overlay">
            <i class="fab fa-youtube"></i>
        </div>
    </div>
    <div class="video-card-content">
        <span class="video-category-badge [CATEGORY]">[CATEGORY_NAME]</span>
        <h3 class="video-title">[VIDEO_TITLE]</h3>
        <p class="video-excerpt">[VIDEO_DESCRIPTION]</p>
        <div class="video-meta-info">
            <span><i class="fab fa-youtube"></i> YouTube</span>
            <span><i class="far fa-calendar"></i> [PUBLISH_DATE]</span>
        </div>
    </div>
</div>
```

---

## 📱 Responsive Sizes

### Desktop (1200px+)
- All ad sizes as specified above

### Tablet (768px - 1199px)
- Top banner: 728 x 90 pixels
- Sidebar ads: Hidden (full-width content)

### Mobile (<768px)
- All sidebar ads: Hidden
- Top banner: Hidden or 320 x 50 pixels
- Focus on content and video players

---

## 🎨 Design Guidelines

### Advertisement Design
- High contrast for visibility
- Clear call-to-action
- Brand colors consistent
- Professional imagery
- Readable fonts

### Video Thumbnails
- High resolution (1280x720 minimum)
- Clear subject matter
- Branded overlay optional
- Engaging visuals
- Text overlay maximum 20% of image

---

## 🚀 API Endpoints

### Advertisements
- `GET /api/advertisements` - Fetch all ads
- `POST /api/advertisements` - Create new ad
- `PUT /api/advertisements/:id` - Update ad
- `DELETE /api/advertisements/:id` - Delete ad
- `POST /api/advertisements/:id/click` - Track click
- `POST /api/advertisements/:id/impression` - Track impression

### Videos
- `GET /api/videos` - Fetch all videos
- `POST /api/videos` - Create new video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `GET /api/videos?category=[CATEGORY]` - Filter by category
- `GET /api/videos?featured=true` - Get featured videos

---

## ✅ Testing Checklist

### Advertisement Testing
- [ ] Upload ad image successfully
- [ ] Ad displays in correct position
- [ ] Ad tracks impressions
- [ ] Ad tracks clicks
- [ ] CTR calculation correct
- [ ] Ad can be edited
- [ ] Ad can be deleted
- [ ] Multiple ads in same position handled correctly

### Video Testing
- [ ] Add YouTube video by URL
- [ ] Video embeds correctly
- [ ] Category filter works
- [ ] Featured videos display in Breaking News
- [ ] Latest Updates grid populates
- [ ] Interview section shows videos
- [ ] Video modal opens on click
- [ ] Autoplay works in modal
- [ ] Mobile responsiveness works
