/**
 * YouTube to Article Converter
 * Converts YouTube videos into articles for the BizzShort website
 */

let currentArticle = null;
let nextArticleId = 4; // Starting from 4 since we have 3 existing articles

/**
 * Extract ID from various URL formats (YouTube & Instagram)
 */
function extractSocialId(url) {
    // YouTube
    const ytPatterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of ytPatterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }

    // Instagram
    // https://www.instagram.com/p/CODE/ or reel/CODE/
    const instaPattern = /(?:instagram\.com\/(?:p|reel)\/)([^/?#&]+)/;
    const instaMatch = url.match(instaPattern);
    if (instaMatch && instaMatch[1]) return instaMatch[1];

    return null;
}

function getSocialType(url) {
    if (url.includes('instagram.com')) return 'instagram';
    return 'youtube';
}

/**
 * Convert YouTube URL to article
 */
async function convertYouTubeToArticle() {
    const urlInput = document.getElementById('youtubeUrl');
    const titleInput = document.getElementById('articleTitle');
    const categoryInput = document.getElementById('articleCategory');
    const authorInput = document.getElementById('articleAuthor');
    const previewDiv = document.getElementById('articlePreview');
    const previewContent = document.getElementById('previewContent');
    const convertBtn = document.querySelector('.btn-primary');

    const url = urlInput.value.trim();

    if (!url) {
        alert('Please enter a YouTube or Instagram URL');
        return;
    }

    const videoId = extractSocialId(url); // Updated function name
    const type = getSocialType(url);

    if (!videoId) {
        alert('Invalid URL. Please enter a valid YouTube or Instagram URL.');
        return;
    }

    // Show loading state
    convertBtn.disabled = true;
    convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';

    try {
        // Generate article content
        const articleData = {
            id: nextArticleId,
            videoId: videoId,
            type: type, // 'youtube' or 'instagram'
            title: titleInput.value.trim() || `${type === 'youtube' ? 'Video' : 'Post'} Analysis: Business Insights`,
            category: categoryInput.value || 'Business',
            author: authorInput.value.trim() || 'BizzShort Team',
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            views: Math.floor(Math.random() * 5000) + 1000,
            readTime: '3 min',
            comments: 0,
            content: generateArticleContent(videoId, titleInput.value.trim(), type)
        };

        currentArticle = articleData;

        // Display preview
        displayPreview(articleData);
        previewDiv.style.display = 'block';

        // Reset button state
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<i class="fas fa-magic"></i> Convert to Article & Add to Website';

        // Add to recent conversions
        addToRecentConversions(articleData);

    } catch (error) {
        console.error('Conversion error:', error);
        alert('An error occurred during conversion. Please try again.');
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<i class="fas fa-magic"></i> Convert to Article & Add to Website';
    }
}

/**
 * Generate article content with proper formatting
 */
function generateArticleContent(videoId, customTitle, type = 'youtube') {
    const title = customTitle || 'Business Insights from Expert Analysis';
    const source = type === 'youtube' ? 'video' : 'social media post';

    return `
        <p>In this comprehensive update, we explore the key business insights and market trends that are shaping today's economic landscape. This ${source} offers valuable perspectives from our official channels.</p>
        
        <h3>Key Highlights</h3>
        <p>The discussion covers critical aspects of current market conditions, providing viewers with actionable insights for navigating today's complex business environment. Expert analysis helps break down complex economic concepts into understandable segments.</p>
        
        <h3>Market Analysis</h3>
        <p>Understanding market dynamics is crucial for making informed business decisions. This video delves into recent market movements, examining factors that influence investor sentiment and business strategy. From sector-specific trends to broader economic indicators, the analysis provides a comprehensive view of the current landscape.</p>
        
        <h3>Strategic Implications</h3>
        <p>For business leaders and investors, staying ahead of market trends is essential. This presentation outlines strategic considerations for various stakeholders, from individual investors to corporate decision-makers. The insights provided can help inform both short-term tactical decisions and long-term strategic planning.</p>
        
        <h3>Expert Perspectives</h3>
        <p>Drawing from years of industry experience, the analysis offers nuanced perspectives on emerging trends and potential market shifts. Understanding these dynamics can provide a competitive advantage in today's fast-paced business environment.</p>
        
        <h3>Practical Takeaways</h3>
        <p>The video concludes with actionable recommendations for viewers to apply in their own business contexts. Whether you're an entrepreneur, investor, or business professional, these insights can help inform your decision-making process and strategic planning.</p>
        
        <p><strong>Watch the full analysis in the video above to gain deeper insights into these critical business topics.</strong></p>
    `;
}

/**
 * Display article preview
 */
function displayPreview(article) {
    const previewContent = document.getElementById('previewContent');

    const previewHTML = `
        <div class="preview-article">
            <div class="preview-header">
                <span class="badge badge-${getCategoryColor(article.category)}">${article.category}</span>
                <h2>${article.title}</h2>
                <div class="preview-meta">
                    <span><i class="fas fa-user"></i> ${article.author}</span>
                    <span><i class="fas fa-calendar"></i> ${article.date}</span>
                    <span><i class="fas fa-clock"></i> ${article.readTime} read</span>
                    <span><i class="fas fa-eye"></i> ${article.views} views</span>
                </div>
            </div>
            
            <div class="preview-video">
                ${article.type === 'instagram' ?
            `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/${article.videoId}/" data-instgrm-version="14" style=" max-width:540px; min-width:326px; width:99%; margin: 0 auto; border: 1px solid #dbdbdb; border-radius: 3px; box-shadow: none;"></blockquote><script async src="//www.instagram.com/embed.js"></script>`
            :
            `<iframe 
                    width="100%" 
                    height="400" 
                    src="https://www.youtube.com/embed/${article.videoId}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>`}
            </div>
            
            <div class="preview-content">
                ${article.content}
            </div>
        </div>
    `;

    previewContent.innerHTML = previewHTML;
}

/**
 * Get category badge color
 */
function getCategoryColor(category) {
    const colors = {
        'Business': 'info',
        'Markets': 'blue',
        'Technology': 'success',
        'Startups': 'warning',
        'Economy': 'danger'
    };
    return colors[category] || 'info';
}

/**
 * Publish article to website
 */
function publishArticle() {
    if (!currentArticle) {
        alert('Please convert a YouTube video first');
        return;
    }

    // Add article to article-manager.js
    if (typeof ArticleManager !== 'undefined' && ArticleManager.articles) {
        ArticleManager.articles[currentArticle.id] = currentArticle;

        // Save to localStorage for persistence
        saveArticleToStorage(currentArticle);

        alert(`Article "${currentArticle.title}" has been published successfully!\n\nArticle ID: ${currentArticle.id}\nYou can view it at: article-detail.html?id=${currentArticle.id}`);

        // Increment article ID for next conversion
        nextArticleId++;

        // Reset the converter
        resetConverter();
    } else {
        // Fallback: Save to localStorage
        saveArticleToStorage(currentArticle);
        alert(`Article "${currentArticle.title}" has been saved!\n\nArticle ID: ${currentArticle.id}\nView at: article-detail.html?id=${currentArticle.id}`);
        nextArticleId++;
        resetConverter();
    }
}

/**
 * Save article to localStorage
 */
function saveArticleToStorage(article) {
    let articles = JSON.parse(localStorage.getItem('bizzshortArticles')) || {};
    articles[article.id] = article;
    localStorage.setItem('bizzshortArticles', JSON.stringify(articles));
}

/**
 * Load articles from localStorage
 */
function loadArticlesFromStorage() {
    const stored = localStorage.getItem('bizzshortArticles');
    if (stored) {
        const articles = JSON.parse(stored);
        Object.keys(articles).forEach(id => {
            const articleId = parseInt(id);
            if (articleId >= nextArticleId) {
                nextArticleId = articleId + 1;
            }
        });
    }
}

/**
 * Reset converter form
 */
function resetConverter() {
    document.getElementById('youtubeUrl').value = '';
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleCategory').value = 'Business';
    document.getElementById('articleAuthor').value = 'BizzShort Team';
    document.getElementById('articlePreview').style.display = 'none';
    document.getElementById('previewContent').innerHTML = '';
    currentArticle = null;
}

/**
 * Add to recent conversions
 */
function addToRecentConversions(article) {
    const recentDiv = document.getElementById('recentConversions');

    // Get existing conversions
    let conversions = JSON.parse(localStorage.getItem('recentConversions')) || [];

    // Add new conversion at the beginning
    conversions.unshift({
        id: article.id,
        title: article.title,
        category: article.category,
        videoId: article.videoId,
        date: new Date().toISOString()
    });

    // Keep only last 5 conversions
    conversions = conversions.slice(0, 5);

    // Save to localStorage
    localStorage.setItem('recentConversions', JSON.stringify(conversions));

    // Display conversions
    displayRecentConversions(conversions);
}

/**
 * Display recent conversions
 */
function displayRecentConversions(conversions) {
    const recentDiv = document.getElementById('recentConversions');

    if (conversions.length === 0) {
        recentDiv.innerHTML = '<p style="text-align: center; color: #6B7280;">No recent conversions yet</p>';
        return;
    }

    let html = '';
    conversions.forEach(conv => {
        const date = new Date(conv.date).toLocaleString();
        html += `
            <div class="conversion-item">
                <div class="conversion-info">
                    <h4>${conv.title}</h4>
                    <p><span class="badge badge-${getCategoryColor(conv.category)}">${conv.category}</span></p>
                    <small>${date}</small>
                </div>
                <div class="conversion-actions">
                    <a href="../article-detail.html?id=${conv.id}" target="_blank" class="btn-small btn-view">View</a>
                </div>
            </div>
        `;
    });

    recentDiv.innerHTML = html;
}

/**
 * Initialize converter on page load
 */
document.addEventListener('DOMContentLoaded', function () {
    // Load next article ID
    loadArticlesFromStorage();

    // Display recent conversions
    const conversions = JSON.parse(localStorage.getItem('recentConversions')) || [];
    displayRecentConversions(conversions);
});
