# BizzShort Backend API Documentation

## 📡 API Overview

Base URL: 
- **Development**: `http://localhost:3000`
- **Production**: `https://api.bizzshort.com`

All API responses follow this format:
```json
{
  "success": true/false,
  "data": { ... },
  "error": "Error message if failed"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.0.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

The API will be available at `http://localhost:3000`

---

## 📚 API Endpoints

### Health Check

#### GET `/api/health`
Check if the API is running

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T10:00:00.000Z",
  "service": "BizzShort API",
  "version": "1.0.0"
}
```

---

## 📰 Articles

### Get All Articles

#### GET `/api/articles`

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `category` (string, optional) - Filter by category
- `search` (string, optional) - Search query

**Example:**
```
GET /api/articles?page=1&limit=10&category=Business News
```

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "Article Title",
        "slug": "article-slug",
        "category": "Business News",
        "excerpt": "Short description...",
        "content": "<p>Full content...</p>",
        "image": "https://example.com/image.jpg",
        "author": {
          "name": "Author Name",
          "avatar": "/avatars/author.jpg"
        },
        "publishedAt": "2025-11-30T10:00:00Z",
        "views": 1234,
        "likes": 89,
        "readTime": 5,
        "tags": ["tag1", "tag2"]
      }
    ],
    "total": 250,
    "page": 1,
    "limit": 10,
    "pages": 25
  }
}
```

### Get Single Article

#### GET `/api/articles/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Article Title",
    ...
  }
}
```

### Get Trending Articles

#### GET `/api/articles/trending`

Returns top 5 most viewed articles

### Get Popular Articles

#### GET `/api/articles/popular`

Returns top 5 most liked articles

### Get Latest Articles

#### GET `/api/articles/latest`

**Query Parameters:**
- `limit` (number, default: 10) - Number of articles

### Get Categories

#### GET `/api/categories`

**Response:**
```json
{
  "success": true,
  "data": ["Business News", "Market Updates", "Tech News"]
}
```

---

## 📊 Analytics

### Get Analytics Overview

#### GET `/api/analytics`

**Query Parameters:**
- `period` (string, default: '7d') - Time period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "visitors": { "total": 245382, "growth": 12.5 },
    "pageViews": { "total": 1200000, "growth": 18.3 },
    "avgSessionTime": { "value": "4:32", "growth": 8.7 },
    "bounceRate": { "value": 32.4, "growth": -5.2 },
    "period": "7d"
  }
}
```

### Get Traffic Data

#### GET `/api/analytics/traffic`

**Query Parameters:**
- `period` (string) - Time period

**Response:**
```json
{
  "success": true,
  "data": {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "visitors": [32000, 35000, 38000, 42000, 39000, 45000, 48000],
    "pageViews": [128000, 140000, 152000, 168000, 156000, 180000, 192000]
  }
}
```

### Get Traffic Sources

#### GET `/api/analytics/sources`

**Response:**
```json
{
  "success": true,
  "data": {
    "direct": 45000,
    "google": 38000,
    "social": 28000,
    "referral": 15000,
    "email": 12000
  }
}
```

---

## 📧 Newsletter

### Subscribe to Newsletter

#### POST `/api/newsletter/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter!"
}
```

---

## 💬 Contact

### Submit Contact Form

#### POST `/api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your message has been sent successfully!"
}
```

---

## 📅 Events

### Get All Events

#### GET `/api/events`

**Query Parameters:**
- `category` (string, optional) - Filter by category
- `city` (string, optional) - Filter by city

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "India Business Summit 2025",
      "slug": "india-business-summit-2025",
      "description": "Annual gathering...",
      "date": "2025-12-15",
      "endDate": "2025-12-17",
      "location": "Mumbai Convention Center",
      "city": "Mumbai",
      "category": "Conference",
      "image": "https://example.com/event.jpg",
      "attendees": 500,
      "maxAttendees": 1000,
      "price": 5000,
      "currency": "INR"
    }
  ]
}
```

### Get Single Event

#### GET `/api/events/:id`

### Register for Event

#### POST `/api/events/:id/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "company": "Tech Corp"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered for event!"
}
```

---

## 📢 Advertisements

### Upload Advertisement

#### POST `/api/advertisements/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (file, required) - Image file (max 5MB, jpg/png/gif/webp)
- `title` (string, optional) - Ad title
- `link` (string, optional) - Ad link URL

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1234567890,
    "filename": "ad-12345-67890.jpg",
    "url": "/uploads/ad-12345-67890.jpg",
    "title": "My Advertisement",
    "link": "https://example.com",
    "uploadedAt": "2025-12-01T10:00:00.000Z"
  },
  "message": "Advertisement uploaded successfully!"
}
```

---

## 🔍 Search

### Search Content

#### GET `/api/search`

**Query Parameters:**
- `q` (string, required) - Search query

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "startup",
    "results": [
      {
        "id": 2,
        "title": "Indian Startups Raise Record Funding",
        ...
      }
    ],
    "total": 5
  }
}
```

---

## 🔐 Authentication (Coming Soon)

Future endpoints will include:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

---

## ❌ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 📝 Rate Limiting (Future)

Rate limiting will be implemented:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

---

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Get articles
curl http://localhost:3000/api/articles

# Subscribe to newsletter
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Using JavaScript (fetch)

```javascript
// Get articles
const response = await fetch('http://localhost:3000/api/articles');
const data = await response.json();
console.log(data);

// Subscribe to newsletter
const response = await fetch('http://localhost:3000/api/newsletter/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
});
const data = await response.json();
```

---

## 🚀 Deployment

### Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=production
DB_CONNECTION_STRING=your_database_url
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Production Deployment

```bash
# Install production dependencies only
npm install --production

# Start server
npm start
```

---

## 📞 Support

For API support, contact:
- **Email:** api@bizzshort.com
- **Documentation:** https://docs.bizzshort.com
- **GitHub Issues:** https://github.com/Exoticaditya/BizzShort/issues

---

**Last Updated:** December 1, 2025  
**API Version:** 1.0.0
