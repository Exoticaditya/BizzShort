// Advertisement Manager - Security-focused ad handling
// BizzShort Advertisement Management System

class AdManager {
    constructor() {
        this.hiddenAds = this.loadHiddenAds();
        this.adPreferences = this.loadAdPreferences();
        this.init();
    }

    init() {
        this.applyHiddenAds();
        this.setupEventListeners();
        this.setupSecurityMeasures();
    }

    // Load hidden ads from secure storage
    loadHiddenAds() {
        try {
            const stored = localStorage.getItem('bizzshort_hidden_ads');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Error loading hidden ads:', error);
            return [];
        }
    }

    // Load ad preferences securely
    loadAdPreferences() {
        try {
            const stored = localStorage.getItem('bizzshort_ad_preferences');
            return stored ? JSON.parse(stored) : {
                showPersonalizedAds: true,
                showSidebarAds: true,
                showBannerAds: true,
                frequency: 'normal'
            };
        } catch (error) {
            console.warn('Error loading ad preferences:', error);
            return {
                showPersonalizedAds: true,
                showSidebarAds: true,
                showBannerAds: true,
                frequency: 'normal'
            };
        }
    }

    // Save hidden ads securely
    saveHiddenAds() {
        try {
            localStorage.setItem('bizzshort_hidden_ads', JSON.stringify(this.hiddenAds));
        } catch (error) {
            console.warn('Error saving hidden ads:', error);
        }
    }

    // Save ad preferences securely
    saveAdPreferences() {
        try {
            localStorage.setItem('bizzshort_ad_preferences', JSON.stringify(this.adPreferences));
        } catch (error) {
            console.warn('Error saving ad preferences:', error);
        }
    }

    // Apply hidden ads on page load
    applyHiddenAds() {
        this.hiddenAds.forEach(adId => {
            const adElement = document.getElementById(adId);
            if (adElement) {
                this.hideAdElement(adElement);
            }
        });
    }

    // Hide advertisement with animation
    hideAdElement(element) {
        if (!element) return;
        
        element.style.transition = 'opacity 0.3s ease, height 0.3s ease';
        element.style.opacity = '0';
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.marginTop = '0';
        element.style.marginBottom = '0';
        element.style.padding = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
            element.setAttribute('aria-hidden', 'true');
        }, 300);
    }

    // Show advertisement
    showAdElement(element) {
        if (!element) return;
        
        element.style.display = '';
        element.style.transition = 'opacity 0.3s ease, height 0.3s ease';
        element.removeAttribute('aria-hidden');
        
        // Reset styles
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.height = '';
            element.style.overflow = '';
            element.style.margin = '';
            element.style.padding = '';
        }, 50);
    }

    // Setup security measures
    setupSecurityMeasures() {
        // Prevent XSS in ad content
        this.sanitizeAdContent();
        
        // Rate limiting for ad interactions
        this.setupRateLimiting();
        
        // Monitor for malicious ad behavior
        this.setupAdMonitoring();
    }

    // Sanitize advertisement content
    sanitizeAdContent() {
        const adElements = document.querySelectorAll('.ad-widget, .ad-banner, .ad-placeholder');
        adElements.forEach(element => {
            // Remove any script tags or dangerous attributes
            const scripts = element.querySelectorAll('script');
            scripts.forEach(script => script.remove());
            
            // Sanitize href attributes
            const links = element.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !this.isValidURL(href)) {
                    link.removeAttribute('href');
                    link.style.cursor = 'not-allowed';
                    link.title = 'Invalid link removed for security';
                }
            });
        });
    }

    // Validate URL security
    isValidURL(url) {
        try {
            const urlObj = new URL(url, window.location.origin);
            // Only allow http/https protocols
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
            return false;
        }
    }

    // Rate limiting for ad interactions
    setupRateLimiting() {
        this.adInteractions = new Map();
        this.rateLimitWindow = 60000; // 1 minute
        this.maxInteractionsPerWindow = 10;
    }

    // Check if user can interact with ads (rate limiting)
    canInteract(userId = 'anonymous') {
        const now = Date.now();
        const userInteractions = this.adInteractions.get(userId) || [];
        
        // Remove old interactions
        const recentInteractions = userInteractions.filter(
            timestamp => now - timestamp < this.rateLimitWindow
        );
        
        if (recentInteractions.length >= this.maxInteractionsPerWindow) {
            console.warn('Ad interaction rate limit exceeded');
            return false;
        }
        
        recentInteractions.push(now);
        this.adInteractions.set(userId, recentInteractions);
        return true;
    }

    // Monitor for malicious ad behavior
    setupAdMonitoring() {
        // Monitor for excessive DOM manipulation
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.target.closest('.ad-widget, .ad-banner')) {
                    this.validateAdBehavior(mutation.target);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    // Validate ad behavior for security
    validateAdBehavior(element) {
        // Check for suspicious modifications
        const suspiciousPatterns = [
            /javascript:/i,
            /data:text\/html/i,
            /vbscript:/i,
            /<script/i,
            /onclick=/i,
            /onload=/i
        ];

        const elementHTML = element.innerHTML;
        suspiciousPatterns.forEach(pattern => {
            if (pattern.test(elementHTML)) {
                console.warn('Suspicious ad behavior detected, removing element');
                element.remove();
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Escape key to show ad preferences
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && e.ctrlKey) {
                this.showAdPreferences();
            }
        });
    }
}

// Global functions for ad management
function hideAd(adId) {
    if (!window.adManager) {
        console.warn('Ad manager not initialized');
        return;
    }

    // Rate limiting check
    if (!window.adManager.canInteract()) {
        showNotification('Too many ad interactions. Please wait a moment.', 'warning');
        return;
    }

    const adElement = document.getElementById(adId);
    if (!adElement) {
        console.warn(`Ad element with ID ${adId} not found`);
        return;
    }

    // Add to hidden ads list
    if (!window.adManager.hiddenAds.includes(adId)) {
        window.adManager.hiddenAds.push(adId);
        window.adManager.saveHiddenAds();
    }

    // Hide the ad with animation
    window.adManager.hideAdElement(adElement);

    // Show notification
    showNotification('Advertisement hidden. You can manage ad preferences in settings.', 'success');

    // Track ad hiding for analytics
    trackAdInteraction('hide', adId);
}

function showAdPreferences() {
    if (!window.adManager) return;

    const modal = document.createElement('div');
    modal.className = 'ad-preferences-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Advertisement Preferences</h3>
                <button class="close-modal" onclick="this.closest('.ad-preferences-modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="preference-section">
                    <h4>Ad Display Settings</h4>
                    <label class="preference-item">
                        <input type="checkbox" id="showBannerAds" ${window.adManager.adPreferences.showBannerAds ? 'checked' : ''}>
                        <span>Show banner advertisements</span>
                    </label>
                    <label class="preference-item">
                        <input type="checkbox" id="showSidebarAds" ${window.adManager.adPreferences.showSidebarAds ? 'checked' : ''}>
                        <span>Show sidebar advertisements</span>
                    </label>
                    <label class="preference-item">
                        <input type="checkbox" id="showPersonalizedAds" ${window.adManager.adPreferences.showPersonalizedAds ? 'checked' : ''}>
                        <span>Show personalized advertisements</span>
                    </label>
                </div>
                
                <div class="preference-section">
                    <h4>Hidden Advertisements</h4>
                    <div class="hidden-ads-list">
                        ${window.adManager.hiddenAds.length > 0 ? 
                            window.adManager.hiddenAds.map(adId => `
                                <div class="hidden-ad-item">
                                    <span>${adId}</span>
                                    <button onclick="unhideAd('${adId}')" class="unhide-btn">Unhide</button>
                                </div>
                            `).join('') : 
                            '<p>No hidden advertisements</p>'
                        }
                    </div>
                </div>
                
                <div class="preference-section">
                    <h4>Privacy & Security</h4>
                    <p>We respect your privacy and implement security measures to protect against malicious advertisements.</p>
                    <button onclick="clearAdData()" class="clear-data-btn">Clear All Ad Data</button>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="saveAdPreferences()" class="save-btn">Save Preferences</button>
                <button onclick="this.closest('.ad-preferences-modal').remove()" class="cancel-btn">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function unhideAd(adId) {
    if (!window.adManager) return;

    const adElement = document.getElementById(adId);
    if (adElement) {
        window.adManager.showAdElement(adElement);
    }

    // Remove from hidden ads list
    window.adManager.hiddenAds = window.adManager.hiddenAds.filter(id => id !== adId);
    window.adManager.saveHiddenAds();

    // Update the preferences modal
    const modal = document.querySelector('.ad-preferences-modal');
    if (modal) {
        modal.remove();
        showAdPreferences();
    }

    showNotification('Advertisement restored', 'success');
    trackAdInteraction('unhide', adId);
}

function saveAdPreferences() {
    if (!window.adManager) return;

    // Get form values
    const showBannerAds = document.getElementById('showBannerAds').checked;
    const showSidebarAds = document.getElementById('showSidebarAds').checked;
    const showPersonalizedAds = document.getElementById('showPersonalizedAds').checked;

    // Update preferences
    window.adManager.adPreferences = {
        showBannerAds,
        showSidebarAds,
        showPersonalizedAds,
        frequency: window.adManager.adPreferences.frequency
    };

    window.adManager.saveAdPreferences();

    // Apply preferences
    applyAdPreferences();

    // Close modal
    document.querySelector('.ad-preferences-modal').remove();

    showNotification('Advertisement preferences saved', 'success');
    trackAdInteraction('preferences_saved');
}

function applyAdPreferences() {
    if (!window.adManager) return;

    const prefs = window.adManager.adPreferences;

    // Hide/show banner ads
    const bannerAds = document.querySelectorAll('.ad-banner-section');
    bannerAds.forEach(ad => {
        if (prefs.showBannerAds) {
            window.adManager.showAdElement(ad);
        } else {
            window.adManager.hideAdElement(ad);
        }
    });

    // Hide/show sidebar ads
    const sidebarAds = document.querySelectorAll('.sidebar-ads');
    sidebarAds.forEach(ad => {
        if (prefs.showSidebarAds) {
            window.adManager.showAdElement(ad);
        } else {
            window.adManager.hideAdElement(ad);
        }
    });
}

function clearAdData() {
    if (!window.adManager) return;

    if (confirm('Are you sure you want to clear all advertisement data? This will reset all your preferences and hidden ads.')) {
        localStorage.removeItem('bizzshort_hidden_ads');
        localStorage.removeItem('bizzshort_ad_preferences');
        
        // Reinitialize with defaults
        window.adManager = new AdManager();
        
        document.querySelector('.ad-preferences-modal').remove();
        showNotification('All advertisement data cleared', 'success');
        trackAdInteraction('data_cleared');
    }
}

function trackAdInteraction(action, adId = null) {
    // Track ad interactions for analytics (GDPR compliant)
    const interaction = {
        action,
        adId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 100), // Truncated for privacy
        url: window.location.pathname
    };

    // Store locally for analytics (no external tracking)
    try {
        const interactions = JSON.parse(localStorage.getItem('bizzshort_ad_interactions') || '[]');
        interactions.push(interaction);
        
        // Keep only last 100 interactions for privacy
        if (interactions.length > 100) {
            interactions.splice(0, interactions.length - 100);
        }
        
        localStorage.setItem('bizzshort_ad_interactions', JSON.stringify(interactions));
    } catch (error) {
        console.warn('Error tracking ad interaction:', error);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `ad-notification ad-notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Content sanitization for security
function sanitizeContent() {
    // Remove any potential XSS vectors from dynamic content
    const userContentElements = document.querySelectorAll('[data-user-content]');
    userContentElements.forEach(element => {
        const content = element.innerHTML;
        // Basic XSS prevention
        const sanitized = content
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '');
        element.innerHTML = sanitized;
    });
}

// Initialize ad manager when DOM is ready
function initAdManager() {
    if (!window.adManager) {
        window.adManager = new AdManager();
    }
    
    // Apply user preferences
    applyAdPreferences();
    
    console.log('BizzShort Ad Manager initialized with security features');
}