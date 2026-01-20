/**
 * Schema.org JSON-LD Generator
 * Generates structured data for articles, videos, and organization
 */

const SchemaGenerator = {
    // Organization Schema
    getOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "BizzShort",
            "alternateName": "BizzShort - Business News in 60 Seconds",
            "url": "https://bizzshort.com",
            "logo": {
                "@type": "ImageObject",
                "url": "https://bizzshort.com/assets/images/logo.png",
                "width": 600,
                "height": 60
            },
            "description": "India's Premier Business News Platform - Latest Business News, Market Updates, and Industry Insights in 60 Seconds",
            "sameAs": [
                "https://www.youtube.com/@bizz_short",
                "https://www.instagram.com/bizz_short",
                "https://www.facebook.com/bizzshort",
                "https://twitter.com/bizzshort"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-XXX-XXX-XXXX",
                "contactType": "customer service",
                "email": "contact@bizzshort.com",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
            }
        };
    },

    // WebSite Schema
    getWebSiteSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BizzShort",
            "url": "https://bizzshort.com",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://bizzshort.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        };
    },

    // Article Schema
    getArticleSchema(article) {
        return {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "image": [
                article.image || "https://bizzshort.com/assets/images/default-article.jpg"
            ],
            "datePublished": article.datePublished || new Date().toISOString(),
            "dateModified": article.dateModified || new Date().toISOString(),
            "author": {
                "@type": "Organization",
                "name": "BizzShort",
                "url": "https://bizzshort.com"
            },
            "publisher": {
                "@type": "Organization",
                "name": "BizzShort",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://bizzshort.com/assets/images/logo.png"
                }
            },
            "description": article.description || article.title,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": article.url || window.location.href
            }
        };
    },

    // Video Schema (YouTube/Instagram)
    getVideoSchema(video) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": video.title,
            "description": video.description || video.title,
            "thumbnailUrl": video.thumbnail,
            "uploadDate": video.uploadDate || new Date().toISOString(),
            "duration": video.duration || "PT1M", // Default 1 minute
            "contentUrl": video.url,
            "embedUrl": video.embedUrl
        };

        // Add view count if available
        if (video.views) {
            schema.interactionStatistic = {
                "@type": "InteractionCounter",
                "interactionType": { "@type": "WatchAction" },
                "userInteractionCount": video.views
            };
        }

        return schema;
    },

    // Breadcrumb Schema
    getBreadcrumbSchema(items) {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        };
    },

    // Inject schema into page
    injectSchema(schemaData) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaData);
        document.head.appendChild(script);
    },

    // Initialize schemas on page load
    init() {
        // Add Organization schema (homepage only)
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            this.injectSchema(this.getOrganizationSchema());
            this.injectSchema(this.getWebSiteSchema());
        }

        // Add breadcrumb for non-homepage
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            const breadcrumbs = this.generateBreadcrumbs();
            if (breadcrumbs.length > 1) {
                this.injectSchema(this.getBreadcrumbSchema(breadcrumbs));
            }
        }

        console.log('✅ Schema.org structured data injected');
    },

    // Generate breadcrumbs from URL
    generateBreadcrumbs() {
        const pathArray = window.location.pathname.split('/').filter(p => p);
        const breadcrumbs = [
            { name: 'Home', url: 'https://bizzshort.com' }
        ];

        let currentPath = 'https://bizzshort.com';
        pathArray.forEach((segment, index) => {
            currentPath += '/' + segment;
            const name = segment.replace('.html', '').replace(/-/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            breadcrumbs.push({ name, url: currentPath });
        });

        return breadcrumbs;
    }
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SchemaGenerator.init());
} else {
    SchemaGenerator.init();
}

// Export for use in other scripts
window.SchemaGenerator = SchemaGenerator;
