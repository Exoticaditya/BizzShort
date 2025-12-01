// BizzShort - Multi-Language Support System

class LanguageManager {
    constructor() {
        this.currentLanguage = this.getSavedLanguage() || 'en';
        this.translations = {};
        this.supportedLanguages = {
            'en': { name: 'English', flag: '🇬🇧' },
            'hi': { name: 'हिंदी', flag: '🇮🇳' },
            'es': { name: 'Español', flag: '🇪🇸' },
            'fr': { name: 'Français', flag: '🇫🇷' },
            'de': { name: 'Deutsch', flag: '🇩🇪' },
            'zh': { name: '中文', flag: '🇨🇳' }
        };
        this.init();
    }

    async init() {
        await this.loadTranslations(this.currentLanguage);
        this.createLanguageSwitcher();
        this.translatePage();
        this.setupLanguageChangeListeners();
    }

    async loadTranslations(language) {
        try {
            // In production, this would fetch from an API
            // For now, we'll use inline translations
            this.translations = await this.getTranslations(language);
            return true;
        } catch (error) {
            console.error('Error loading translations:', error);
            return false;
        }
    }

    getTranslations(language) {
        const translations = {
            'en': {
                // Navigation
                'nav.home': 'Home',
                'nav.blog': 'Blog',
                'nav.events': 'Events',
                'nav.about': 'About',
                'nav.contact': 'Contact',
                'nav.analytics': 'Analytics',
                'nav.advertise': 'Advertise',
                
                // Common
                'common.readMore': 'Read More',
                'common.viewAll': 'View All',
                'common.loadMore': 'Load More',
                'common.search': 'Search',
                'common.subscribe': 'Subscribe',
                'common.submit': 'Submit',
                'common.cancel': 'Cancel',
                'common.close': 'Close',
                'common.save': 'Save',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
                
                // Home Page
                'home.hero.title': 'Latest Business News & Market Insights',
                'home.hero.subtitle': 'Stay updated with breaking news, market analysis, and industry trends',
                'home.trending': 'Trending Now',
                'home.latest': 'Latest Articles',
                'home.popular': 'Most Popular',
                
                // Footer
                'footer.about': 'About BizzShort',
                'footer.description': 'Your premier source for business news, market insights, and industry analysis.',
                'footer.quickLinks': 'Quick Links',
                'footer.contact': 'Contact',
                'footer.followUs': 'Follow Us',
                'footer.copyright': '© 2025 BizzShort. All rights reserved.',
                
                // Newsletter
                'newsletter.title': 'Subscribe to Our Newsletter',
                'newsletter.description': 'Get the latest business news delivered to your inbox',
                'newsletter.placeholder': 'Enter your email',
                'newsletter.success': 'Thank you for subscribing!',
                
                // Contact
                'contact.title': 'Get in Touch',
                'contact.name': 'Your Name',
                'contact.email': 'Email Address',
                'contact.phone': 'Phone Number',
                'contact.message': 'Your Message',
                'contact.send': 'Send Message',
                'contact.success': 'Message sent successfully!',
                
                // Analytics
                'analytics.dashboard': 'Analytics Dashboard',
                'analytics.visitors': 'Total Visitors',
                'analytics.pageViews': 'Page Views',
                'analytics.avgSession': 'Avg. Session Time',
                'analytics.bounceRate': 'Bounce Rate',
                'analytics.traffic': 'Traffic Overview',
                'analytics.sources': 'Traffic Sources',
                'analytics.categories': 'Content Categories'
            },
            'hi': {
                // Navigation
                'nav.home': 'मुख्य पृष्ठ',
                'nav.blog': 'ब्लॉग',
                'nav.events': 'आयोजन',
                'nav.about': 'हमारे बारे में',
                'nav.contact': 'संपर्क करें',
                'nav.analytics': 'विश्लेषण',
                'nav.advertise': 'विज्ञापन',
                
                // Common
                'common.readMore': 'और पढ़ें',
                'common.viewAll': 'सभी देखें',
                'common.loadMore': 'और लोड करें',
                'common.search': 'खोजें',
                'common.subscribe': 'सदस्यता लें',
                'common.submit': 'जमा करें',
                'common.cancel': 'रद्द करें',
                'common.close': 'बंद करें',
                'common.save': 'सहेजें',
                'common.delete': 'हटाएं',
                'common.edit': 'संपादित करें',
                
                // Home Page
                'home.hero.title': 'नवीनतम व्यापार समाचार और बाजार अंतर्दृष्टि',
                'home.hero.subtitle': 'ब्रेकिंग न्यूज, बाजार विश्लेषण और उद्योग के रुझानों के साथ अपडेट रहें',
                'home.trending': 'ट्रेंडिंग',
                'home.latest': 'नवीनतम लेख',
                'home.popular': 'सबसे लोकप्रिय',
                
                // Footer
                'footer.about': 'BizzShort के बारे में',
                'footer.description': 'व्यापार समाचार, बाजार अंतर्दृष्टि और उद्योग विश्लेषण के लिए आपका प्रमुख स्रोत।',
                'footer.quickLinks': 'त्वरित लिंक',
                'footer.contact': 'संपर्क करें',
                'footer.followUs': 'हमें फॉलो करें',
                'footer.copyright': '© 2025 BizzShort। सर्वाधिकार सुरक्षित।',
                
                // Newsletter
                'newsletter.title': 'हमारे न्यूज़लेटर की सदस्यता लें',
                'newsletter.description': 'अपने इनबॉक्स में नवीनतम व्यापार समाचार प्राप्त करें',
                'newsletter.placeholder': 'अपना ईमेल दर्ज करें',
                'newsletter.success': 'सदस्यता के लिए धन्यवाद!',
                
                // Contact
                'contact.title': 'संपर्क में रहें',
                'contact.name': 'आपका नाम',
                'contact.email': 'ईमेल पता',
                'contact.phone': 'फोन नंबर',
                'contact.message': 'आपका संदेश',
                'contact.send': 'संदेश भेजें',
                'contact.success': 'संदेश सफलतापूर्वक भेजा गया!',
                
                // Analytics
                'analytics.dashboard': 'विश्लेषण डैशबोर्ड',
                'analytics.visitors': 'कुल विज़िटर',
                'analytics.pageViews': 'पेज व्यूज़',
                'analytics.avgSession': 'औसत सत्र समय',
                'analytics.bounceRate': 'बाउंस दर',
                'analytics.traffic': 'ट्रैफ़िक अवलोकन',
                'analytics.sources': 'ट्रैफ़िक स्रोत',
                'analytics.categories': 'सामग्री श्रेणियाँ'
            },
            'es': {
                // Navigation
                'nav.home': 'Inicio',
                'nav.blog': 'Blog',
                'nav.events': 'Eventos',
                'nav.about': 'Acerca de',
                'nav.contact': 'Contacto',
                'nav.analytics': 'Análisis',
                'nav.advertise': 'Anunciar',
                
                // Common
                'common.readMore': 'Leer más',
                'common.viewAll': 'Ver todo',
                'common.loadMore': 'Cargar más',
                'common.search': 'Buscar',
                'common.subscribe': 'Suscribirse',
                'common.submit': 'Enviar',
                'common.cancel': 'Cancelar',
                'common.close': 'Cerrar',
                'common.save': 'Guardar',
                'common.delete': 'Eliminar',
                'common.edit': 'Editar'
            },
            'fr': {
                'nav.home': 'Accueil',
                'nav.blog': 'Blog',
                'nav.events': 'Événements',
                'nav.about': 'À propos',
                'nav.contact': 'Contact',
                'common.readMore': 'Lire plus',
                'common.search': 'Rechercher'
            },
            'de': {
                'nav.home': 'Startseite',
                'nav.blog': 'Blog',
                'nav.events': 'Veranstaltungen',
                'nav.about': 'Über uns',
                'nav.contact': 'Kontakt',
                'common.readMore': 'Mehr lesen',
                'common.search': 'Suchen'
            },
            'zh': {
                'nav.home': '首页',
                'nav.blog': '博客',
                'nav.events': '活动',
                'nav.about': '关于',
                'nav.contact': '联系',
                'common.readMore': '阅读更多',
                'common.search': '搜索'
            }
        };

        return Promise.resolve(translations[language] || translations['en']);
    }

    createLanguageSwitcher() {
        // Check if already exists
        if (document.querySelector('.language-switcher')) return;

        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="language-btn" aria-label="Change Language">
                <span class="current-lang-flag">${this.supportedLanguages[this.currentLanguage].flag}</span>
                <span class="current-lang-name">${this.supportedLanguages[this.currentLanguage].name}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="language-dropdown">
                ${Object.entries(this.supportedLanguages).map(([code, lang]) => `
                    <button class="language-option ${code === this.currentLanguage ? 'active' : ''}" 
                            data-lang="${code}">
                        <span class="lang-flag">${lang.flag}</span>
                        <span class="lang-name">${lang.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Add to header-main after navigation
        const headerContent = document.querySelector('.header-main .header-content');
        if (headerContent) {
            const mobileToggle = headerContent.querySelector('.mobile-menu-toggle');
            if (mobileToggle) {
                headerContent.insertBefore(switcher, mobileToggle);
            } else {
                headerContent.appendChild(switcher);
            }
        }

        this.addLanguageSwitcherStyles();
    }

    addLanguageSwitcherStyles() {
        if (document.getElementById('language-switcher-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'language-switcher-styles';
        styles.textContent = `
            .language-switcher {
                position: relative;
                margin-left: 20px;
                display: flex;
                align-items: center;
            }

            .language-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, #0066CC 0%, #00A3FF 100%);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2);
            }

            .language-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
            }

            .current-lang-flag {
                font-size: 18px;
                line-height: 1;
            }

            .current-lang-name {
                font-weight: 600;
            }

            .language-btn i {
                font-size: 12px;
                transition: transform 0.3s ease;
            }

            .language-switcher:hover .language-btn i {
                transform: rotate(180deg);
            }

            .language-dropdown {
                position: absolute;
                top: calc(100% + 12px);
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                padding: 8px;
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 10000;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }

            .language-switcher:hover .language-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .language-option {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
                padding: 10px 14px;
                border: none;
                background: transparent;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                color: #374151;
                transition: all 0.2s ease;
                text-align: left;
            }

            .language-option:hover {
                background: #F3F4F6;
                color: #0066CC;
            }

            .language-option.active {
                background: #EFF6FF;
                color: #0066CC;
                font-weight: 600;
            }

            .lang-flag {
                font-size: 20px;
            }

            .lang-name {
                flex: 1;
            }

            /* Responsive Styles */
            @media (max-width: 1200px) {
                .language-switcher {
                    margin-left: 15px;
                }
            }

            @media (max-width: 1023px) {
                .language-switcher {
                    order: -1;
                    margin-left: 0;
                    margin-right: auto;
                }
                
                .language-btn {
                    padding: 6px 12px;
                    font-size: 13px;
                }
                
                .current-lang-name {
                    display: none;
                }
                
                .language-dropdown {
                    right: auto;
                    left: 0;
                }
            }

            @media (max-width: 768px) {
                .language-btn {
                    padding: 6px 10px;
                }
                
                .current-lang-flag {
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    setupLanguageChangeListeners() {
        document.addEventListener('click', (e) => {
            const languageOption = e.target.closest('.language-option');
            if (languageOption) {
                const newLang = languageOption.dataset.lang;
                this.changeLanguage(newLang);
            }
        });
    }

    async changeLanguage(language) {
        if (language === this.currentLanguage) return;

        this.currentLanguage = language;
        this.saveLanguage(language);
        
        await this.loadTranslations(language);
        this.translatePage();
        this.updateLanguageSwitcher();
        
        // Notify other scripts
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language } 
        }));
    }

    translatePage() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.translations[key];
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Translate elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            const translation = this.translations[key];
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Update document title if available
        const titleKey = document.querySelector('meta[name="i18n-title"]');
        if (titleKey) {
            const translation = this.translations[titleKey.content];
            if (translation) {
                document.title = translation;
            }
        }

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    updateLanguageSwitcher() {
        const currentFlag = document.querySelector('.current-lang-flag');
        const currentName = document.querySelector('.current-lang-name');
        
        if (currentFlag && currentName) {
            const lang = this.supportedLanguages[this.currentLanguage];
            currentFlag.textContent = lang.flag;
            currentName.textContent = lang.name;
        }

        // Update active state
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === this.currentLanguage);
        });
    }

    translate(key, fallback = '') {
        return this.translations[key] || fallback || key;
    }

    saveLanguage(language) {
        localStorage.setItem('bizzshort_language', language);
    }

    getSavedLanguage() {
        return localStorage.getItem('bizzshort_language');
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize language manager
let languageManager;
document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
