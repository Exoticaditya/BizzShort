# 📹 How to Add Your YouTube & Instagram Videos

## Quick Guide to Update Video Content

### Step 1: Get Your YouTube Video Information

1. **Go to your YouTube video** on [@bizz_short](https://youtube.com/@bizz_short?si=FZvH5iMI2v_J4vGE)
2. **Copy the Video URL** - Example: `https://www.youtube.com/watch?v=ABC123XYZ`
3. **Extract the Video ID** - It's the part after `v=` → `ABC123XYZ`
4. **Get the Thumbnail** - Use: `https://img.youtube.com/vi/ABC123XYZ/maxresdefault.jpg`

### Step 2: Open the Video File

Open: `assets/js/video-manager.js`

### Step 3: Replace Sample Videos with Your Real Videos

Find the `videoDatabase` array (starts around line 6) and replace the sample videos:

```javascript
const videoDatabase = [
    {
        id: '1',
        title: 'YOUR ACTUAL VIDEO TITLE FROM YOUTUBE',  // ← Change this
        category: 'Markets',  // ← Choose: Markets, Startups, Economy, Energy, etc.
        source: 'youtube',    // ← Keep as 'youtube' or change to 'instagram'
        videoId: 'ABC123XYZ', // ← YOUR REAL YOUTUBE VIDEO ID
        thumbnail: 'https://img.youtube.com/vi/ABC123XYZ/maxresdefault.jpg', // ← YOUR VIDEO THUMBNAIL
        description: 'Write a brief description of your video here...', // ← Update description
        views: '1.2K',        // ← Approximate view count
        date: 'Dec 9, 2025',  // ← Publication date
        duration: '5:30',     // ← Video duration
        featured: true        // ← true for homepage featured, false for normal
    },
    // Add more videos below...
];
```

### Step 4: For Instagram Reels

```javascript
{
    id: '2',
    title: 'YOUR INSTAGRAM REEL TITLE',
    category: 'Startups',
    source: 'instagram',  // ← Instagram source
    videoId: 'not_used_for_instagram',
    thumbnail: 'URL_TO_REEL_SCREENSHOT',  // ← Screenshot of your reel
    description: 'Brief description...',
    views: '5.2K',
    date: 'Dec 8, 2025',
    duration: '0:45',
    featured: false
}
```

## 📝 Complete Example with Real Video

Let's say you have a YouTube video about stock market:
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Title: "Nifty 50 Hits Record High - Market Analysis"
- Duration: 8 minutes 45 seconds

**Your entry should look like:**

```javascript
{
    id: '1',
    title: 'Nifty 50 Hits Record High - Market Analysis',
    category: 'Markets',
    source: 'youtube',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    description: 'Complete breakdown of today\'s market surge with expert insights on IT sector performance.',
    views: '12.5K',
    date: 'Dec 9, 2025',
    duration: '8:45',
    featured: true
}
```

## 🎯 Categories Available

Choose from these categories:
- `Markets` - Stock market, trading, indices
- `Startups` - Startup funding, unicorns, entrepreneurs
- `Economy` - RBI, inflation, GDP, economic policy
- `Energy` - Green energy, oil, renewable
- `Cryptocurrency` - Crypto regulations, blockchain
- `Manufacturing` - Make in India, production
- `E-commerce` - Online retail, digital commerce
- `Healthcare` - Medical, pharma, healthtech
- `Banking` - Finance, banks, digital banking

## 🚀 How It Works Now

### When Someone Clicks a Video Card:

1. **Thumbnail Click** → Opens YouTube/Instagram directly
2. **Card Content Click** → Goes to article page for reading

### On Video Detail Page:

1. **Big Thumbnail Shows** with YouTube/Instagram icon
2. **Click Thumbnail** → Opens video on YouTube/Instagram  
3. **Scroll Down** → Read full article content

## ⚡ Quick Update Steps

1. **Open** `assets/js/video-manager.js`
2. **Find** the video you want to update (by id number)
3. **Replace** the fake data with your real YouTube info
4. **Save** the file
5. **Refresh** browser (Ctrl + F5)

## 📹 Example: Adding 5 Real Videos

```javascript
const videoDatabase = [
    {
        id: '1',
        title: 'Stock Market Analysis: Nifty Crosses 24,500',
        category: 'Markets',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_1',
        thumbnail: 'https://img.youtube.com/vi/YOUR_VIDEO_ID_1/maxresdefault.jpg',
        description: 'In-depth analysis of today\'s market performance',
        views: '15.3K',
        date: 'Dec 9, 2025',
        duration: '10:25',
        featured: true
    },
    {
        id: '2',
        title: 'Top 5 Startups That Raised Funding This Week',
        category: 'Startups',
        source: 'youtube',
        videoId: 'YOUR_VIDEO_ID_2',
        thumbnail: 'https://img.youtube.com/vi/YOUR_VIDEO_ID_2/maxresdefault.jpg',
        description: 'Weekly roundup of startup funding news',
        views: '8.7K',
        date: 'Dec 8, 2025',
        duration: '6:15',
        featured: false
    },
    {
        id: '3',
        title: 'RBI Monetary Policy Explained in 60 Seconds',
        category: 'Economy',
        source: 'instagram',
        videoId: 'not_needed',
        thumbnail: 'https://your-reel-screenshot.jpg',
        description: 'Quick breakdown of RBI\'s latest policy decision',
        views: '22.1K',
        date: 'Dec 7, 2025',
        duration: '1:00',
        featured: false
    },
    // Add more videos...
];
```

## 🎨 Tips for Better Results

### Thumbnails
- Use high-quality thumbnails (1280x720 recommended)
- YouTube auto-generates thumbnails you can use
- For Instagram, take a screenshot of your reel

### Titles
- Keep under 60 characters
- Be specific and descriptive
- Use keywords for SEO

### Descriptions
- Write 100-150 characters
- Summarize the key point
- Make it compelling to click

### Views & Dates
- Update views periodically
- Keep dates current
- Shows freshness to visitors

## ✅ Testing Checklist

After updating videos:

- [ ] Video cards show on homepage
- [ ] Clicking thumbnail opens YouTube/Instagram
- [ ] Clicking card content opens article page
- [ ] Categories filter correctly
- [ ] Thumbnails load properly
- [ ] All information displays correctly

## 🔗 Your Social Media

Already linked throughout the site:
- **YouTube**: [@bizz_short](https://youtube.com/@bizz_short?si=FZvH5iMI2v_J4vGE)
- **Instagram**: [@bizz_short](https://www.instagram.com/bizz_short?igsh=NDVwdHJza2R3dnF0)

## 📞 Need Help?

Check the inline comments in `video-manager.js` for more guidance!

---

**File to Edit**: `assets/js/video-manager.js`
**Line**: Around line 6 (videoDatabase array)
**After Changes**: Save and refresh browser (Ctrl + F5)
