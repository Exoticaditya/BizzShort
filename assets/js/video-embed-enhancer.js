/**
 * Video Embed Enhancer
 * Replaces all video thumbnails with proper YouTube iframes
 * Supports fullscreen and picture-in-picture modes
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        youtubeEmbedBase: 'https://www.youtube.com/embed/',
        defaultVideoId: 'dQw4w9WgXcQ', // Placeholder
        embedParams: 'enablejsapi=1&rel=0&modestbranding=1',
        iframeAttributes: {
            frameborder: '0',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
            allowfullscreen: true
        }
    };

    /**
     * Create iframe element with proper attributes
     */
    function createIframe(videoId, title) {
        const iframe = document.createElement('iframe');
        const embedUrl = `${CONFIG.youtubeEmbedBase}${videoId}?${CONFIG.embedParams}`;
        
        iframe.src = embedUrl;
        iframe.title = title || 'YouTube video player';
        iframe.setAttribute('frameborder', CONFIG.iframeAttributes.frameborder);
        iframe.setAttribute('allow', CONFIG.iframeAttributes.allow);
        if (CONFIG.iframeAttributes.allowfullscreen) {
            iframe.setAttribute('allowfullscreen', '');
        }
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        
        return iframe;
    }

    /**
     * Replace thumbnail with iframe embed
     */
    function replaceWithEmbed(card) {
        const thumbnail = card.querySelector('.video-thumbnail');
        if (!thumbnail) return;

        const videoId = card.dataset.videoId || CONFIG.defaultVideoId;
        const titleElement = card.querySelector('h3');
        const title = titleElement ? titleElement.textContent.trim() : 'Video';

        // Create wrapper for iframe with 16:9 aspect ratio
        const wrapper = document.createElement('div');
        wrapper.className = 'video-embed-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.paddingBottom = '56.25%'; // 16:9 aspect ratio
        wrapper.style.height = '0';
        wrapper.style.overflow = 'hidden';
        wrapper.style.borderRadius = '12px';

        // Create and append iframe
        const iframe = createIframe(videoId, title);
        wrapper.appendChild(iframe);

        // Replace thumbnail with wrapper
        thumbnail.parentNode.replaceChild(wrapper, thumbnail);
    }

    /**
     * Replace all video cards with embeds
     */
    function enhanceAllVideos() {
        // Select all video card types
        const selectors = [
            '.news-video-card',
            '.interview-video-card',
            '.news-video-card-large',
            '.news-card-large',
            '.interview-card'
        ];

        selectors.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            cards.forEach((card, index) => {
                // Add delay to prevent overwhelming the page
                setTimeout(() => {
                    replaceWithEmbed(card);
                }, index * 50);
            });
        });

        console.log('✅ All video thumbnails replaced with embeds');
    }

    /**
     * Add custom styles for video embed wrappers
     */
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .video-embed-wrapper {
                position: relative;
                padding-bottom: 56.25%; /* 16:9 */
                height: 0;
                overflow: hidden;
                border-radius: 12px;
                background: #000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .video-embed-wrapper iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 12px;
            }

            /* Breaking News Video Cards */
            .news-video-card .video-embed-wrapper {
                margin-bottom: 15px;
            }

            /* Latest Updates Large Cards */
            .news-video-card-large .video-embed-wrapper,
            .news-card-large .video-embed-wrapper {
                margin-bottom: 15px;
                border-radius: 12px 12px 0 0;
            }

            /* Interview Video Cards */
            .interview-video-card .video-embed-wrapper {
                margin-bottom: 15px;
            }

            /* Ensure proper spacing */
            .video-details,
            .interview-details,
            .card-content {
                padding: 15px;
            }

            /* Fullscreen button styling */
            .video-embed-wrapper::after {
                content: '⛶';
                position: absolute;
                bottom: 10px;
                right: 10px;
                font-size: 20px;
                color: white;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .video-embed-wrapper:hover::after {
                opacity: 0.8;
            }

            /* Picture-in-picture hint */
            .video-embed-wrapper::before {
                content: 'PiP';
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 11px;
                font-weight: 600;
                color: white;
                background: rgba(0, 0, 0, 0.7);
                padding: 4px 8px;
                border-radius: 4px;
                text-shadow: none;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1;
            }

            .video-embed-wrapper:hover::before {
                opacity: 1;
            }

            /* Loading state */
            .video-embed-wrapper.loading {
                background: linear-gradient(
                    90deg,
                    #f0f0f0 25%,
                    #e0e0e0 50%,
                    #f0f0f0 75%
                );
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
            }

            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .video-embed-wrapper {
                    border-radius: 8px;
                }

                .video-embed-wrapper::after,
                .video-embed-wrapper::before {
                    font-size: 16px;
                    padding: 3px 6px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize on DOM ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addCustomStyles();
                setTimeout(enhanceAllVideos, 100);
            });
        } else {
            addCustomStyles();
            setTimeout(enhanceAllVideos, 100);
        }
    }

    // Start the enhancement
    init();

    // Expose global function for dynamic content
    window.enhanceVideoCard = function(card) {
        replaceWithEmbed(card);
    };

    console.log('🎬 Video Embed Enhancer loaded');
})();
