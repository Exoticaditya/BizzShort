# BizzShort Article System Documentation

## Overview
The BizzShort article system allows you to publish and manage business news articles with full SEO optimization, social media sharing, and analytics tracking.

## Features
- ✅ Responsive article cards matching the website design
- ✅ Dedicated SEO-optimized article pages
- ✅ Dynamic content loading from backend API
- ✅ Article view tracking and analytics
- ✅ Social media meta tags (Open Graph, Twitter Cards)
- ✅ JSON-LD structured data for search engines
- ✅ Mobile-responsive design
- ✅ Categories, tags, and author information

## Files Created/Modified

### New Files
1. **assets/js/article-loader.js** - Loads articles dynamically from API
2. **article.html** - SEO-optimized article detail page
3. **populate-articles.js** - Script to add sample articles to database
4. **ARTICLE_SYSTEM_README.md** - This documentation

### Modified Files
1. **index.html** - Added Featured Articles section between Client Feature and Interview & Podcast
2. **assets/css/main-style.css** - Added article card and modal styles
3. **server.js** - Added endpoints for fetching single article and tracking views
4. **sitemap.xml** - Added article.html page

## Usage

### 1. Populate Sample Articles
Run this command to add sample articles to your database:

```bash
node populate-articles.js
```

This will add 6 sample articles across different categories:
- Business
- Startups
- Markets
- Technology
- Finance
- Economy

### 2. View Articles on Homepage
Visit your homepage and scroll to the "Featured Articles" section between "Client Feature" and "Interview & Podcast" sections.

### 3. Add New Articles

#### Via Admin Panel (if available)
Use your admin panel to create new articles through the UI.

#### Via API
```javascript
POST /api/articles
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "title": "Your Article Title",
  "slug": "your-article-title",
  "category": "BUSINESS",
  "excerpt": "Brief description of the article",
  "content": "Full article content...",
  "image": "https://example.com/image.jpg",
  "author": {
    "name": "Author Name",
    "bio": "Author bio"
  },
  "tags": ["tag1", "tag2"],
  "readTime": 5
}
```

#### Programmatically
```javascript
const Article = require('./models/Article');

const newArticle = await Article.create({
  title: "Your Article Title",
  slug: "your-article-title",
  category: "BUSINESS",
  excerpt: "Brief description",
  content: "Full article content here...",
  image: "https://example.com/image.jpg",
  author: {
    name: "Author Name",
    avatar: "",
    bio: "Author bio"
  },
  tags: ["Business", "News", "India"],
  status: "PUBLISHED",
  readTime: 5
});
```

## API Endpoints

### Get All Articles
```
GET /api/articles?limit=6&status=PUBLISHED
```

### Get Single Article
```
GET /api/articles/:id_or_slug
```

### Track Article View
```
POST /api/articles/:id_or_slug/view
```

### Create Article (Protected)
```
POST /api/articles
```

### Update Article (Protected)
```
PUT /api/articles/:id
```

### Delete Article (Protected)
```
DELETE /api/articles/:id
```

## Article Schema

```javascript
{
  title: String (required),
  slug: String (unique),
  category: String (required),
  excerpt: String,
  content: String (required),
  image: String,
  author: {
    name: String,
    avatar: String,
    bio: String
  },
  tags: [String],
  status: String (PUBLISHED/DRAFT/ARCHIVED),
  views: Number,
  likes: Number,
  readTime: Number,
  publishedAt: Date,
  updatedAt: Date
}
```

## SEO Features

### Meta Tags
Each article page includes:
- Dynamic page title
- Meta description
- Keywords from tags
- Canonical URL
- Author information

### Open Graph Tags
For Facebook and LinkedIn sharing:
- og:type = "article"
- og:title, og:description, og:image
- article:published_time
- article:author

### Twitter Cards
For Twitter sharing:
- twitter:card = "summary_large_image"
- Dynamic title, description, and image
- Author attribution

### JSON-LD Structured Data
Search engines can parse article information:
- Article schema
- Author information
- Publisher details
- Publish and modified dates

## Categories
Available categories:
- BUSINESS
- MARKETS
- STARTUPS
- TECHNOLOGY
- FINANCE
- ECONOMY
- INDUSTRY

Each category has a distinct color in the UI.

## Customization

### Change Card Styles
Edit `assets/css/main-style.css` in the "ARTICLE NEWS SECTION STYLES" section.

### Modify Article Layout
Edit `article.html` to change the article page layout.

### Update Loading Logic
Modify `assets/js/article-loader.js` to change how articles are loaded and displayed.

## Analytics

Article views are automatically tracked when:
1. Users view an article on the dedicated article page
2. The view count increments in the database
3. View count is displayed in the article meta information

## Best Practices

1. **Image Optimization**: Use optimized images (max 800KB) for faster loading
2. **Content Length**: Aim for 500-1500 words for optimal readability
3. **SEO**: Include relevant keywords in title, excerpt, and content
4. **Tags**: Use 3-7 relevant tags per article
5. **Categories**: Choose the most appropriate category
6. **Excerpt**: Write compelling excerpts (120-160 characters)
7. **Author Bio**: Include author information for credibility

## Troubleshooting

### Articles Not Loading
- Check MongoDB connection
- Verify API endpoint is accessible
- Check browser console for errors
- Ensure articles have status="PUBLISHED"

### SEO Tags Not Updating
- Clear browser cache
- Check article.html meta tag IDs
- Verify JavaScript is loading correctly

### Images Not Displaying
- Verify image URLs are accessible
- Check CORS settings
- Use HTTPS URLs for production

## Future Enhancements

Potential improvements:
- [ ] Article comments system
- [ ] Related articles suggestions
- [ ] Social sharing buttons
- [ ] Reading progress indicator
- [ ] Save/bookmark functionality
- [ ] Article search and filtering
- [ ] RSS feed generation
- [ ] Email newsletter integration

## Support

For issues or questions:
- Check server logs: `npm start`
- Review browser console
- Verify database connectivity
- Test API endpoints directly

## License
Part of the BizzShort platform. All rights reserved.
