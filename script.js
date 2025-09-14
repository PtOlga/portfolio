// ===== PORTFOLIO JAVASCRIPT =====

class Portfolio {
    constructor() {
        this.currentLanguage = 'en';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupTypewriter();
        this.setupParallax();
        this.setupCounter();
        this.loadInitialLanguage();
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Active navigation highlighting
        window.addEventListener('scroll', this.handleNavHighlight.bind(this));
        
        // Language switcher
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', this.handleLanguageSwitch.bind(this));
        });

        // Mobile menu toggle (if needed)
        this.setupMobileMenu();

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));

        // Theme toggle (optional)
        this.setupThemeToggle();
    }

    // ===== SMOOTH SCROLLING =====
    handleSmoothScroll(e) {
        e.preventDefault();
        const target = document.querySelector(e.currentTarget.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Update URL without jumping
            history.pushState(null, null, e.currentTarget.getAttribute('href'));
        }
    }

    // ===== NAVIGATION HIGHLIGHTING =====
    handleNavHighlight() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Add scroll-based header effects
        const header = document.querySelector('.nav');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.skill-category, .timeline-item, .project-card, .section-title'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Add specific animations based on element type
        if (element.classList.contains('timeline-item')) {
            element.classList.add('animate-slide-left');
        } else if (element.classList.contains('skill-category')) {
            element.classList.add('animate-slide-up');
        } else if (element.classList.contains('project-card')) {
            element.classList.add('animate-fade-in');
        }
    }

    // ===== TYPEWRITER EFFECT =====
    setupTypewriter() {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            const text = subtitle.textContent;
            subtitle.textContent = '';
            
            let i = 0;
            const typewriter = () => {
                if (i < text.length) {
                    subtitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typewriter, 50);
                }
            };
            
            // Start typewriter after a delay
            setTimeout(typewriter, 1000);
        }
    }

    // ===== PARALLAX EFFECTS =====
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // ===== COUNTER ANIMATION =====
    setupCounter() {
        const counters = document.querySelectorAll('[data-counter]');
        const observerOptions = {
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    // ===== LANGUAGE SWITCHING =====
    handleLanguageSwitch(e) {
        const lang = e.target.dataset.lang || e.target.textContent.toLowerCase();
        this.switchLanguage(lang);
    }

    loadInitialLanguage() {
        // Get language from URL or localStorage
        const urlLang = new URLSearchParams(window.location.search).get('lang');
        const storedLang = localStorage.getItem('preferred-language');
        const browserLang = navigator.language.split('-')[0];
        
        const language = urlLang || storedLang || browserLang || 'en';
        this.switchLanguage(language);
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update active button
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase() === lang || btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });

        // Load translations
        this.loadTranslations(lang);
        
        // Store preference
        localStorage.setItem('preferred-language', lang);
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
    }

    async loadTranslations(lang) {
        try {
            // In a real implementation, you would load from external JSON files
            const translations = await this.getTranslations(lang);
            this.applyTranslations(translations);
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    async getTranslations(lang) {
        // Mock translations - in real app, load from JSON files
        const translations = {
            en: {
                "Python AI Developer & ERP/CRM Consultant": "Python AI Developer & ERP/CRM Consultant",
                "About": "About",
                "Skills": "Skills",
                "Experience": "Experience",
                "Projects": "Projects",
                "Education": "Education",
                "Contact": "Contact",
                "About Me": "About Me",
                "Core Competencies": "Core Competencies",
                "Work Experience": "Work Experience",
                "Featured Projects": "Featured Projects",
                "Education & Certifications": "Education & Certifications",
                "Get In Touch": "Get In Touch",
                "Charlottenberg, Sweden": "Charlottenberg, Sweden"
            },
            sv: {
                "Python AI Developer & ERP/CRM Consultant": "Python AI-utvecklare & ERP/CRM-konsult",
                "About": "Om mig",
                "Skills": "Kompetenser",
                "Experience": "Erfarenhet",
                "Projects": "Projekt",
                "Education": "Utbildning",
                "Contact": "Kontakt",
                "About Me": "Om mig",
                "Core Competencies": "Kärnkompetenser",
                "Work Experience": "Arbetslivserfarenhet",
                "Featured Projects": "Utvalda projekt",
                "Education & Certifications": "Utbildning & Certifieringar",
                "Get In Touch": "Kom i kontakt",
                "Charlottenberg, Sweden": "Charlottenberg, Sverige"
            },
            ru: {
                "Python AI Developer & ERP/CRM Consultant": "Python AI-разработчик и ERP/CRM-консультант",
                "About": "Обо мне",
                "Skills": "Навыки",
                "Experience": "Опыт",
                "Projects": "Проекты",
                "Education": "Образование",
                "Contact": "Контакты",
                "About Me": "Обо мне",
                "Core Competencies": "Ключевые компетенции",
                "Work Experience": "Опыт работы",
                "Featured Projects": "Избранные проекты",
                "Education & Certifications": "Образование и сертификаты",
                "Get In Touch": "Связаться со мной",
                "Charlottenberg, Sweden": "Чарлоттенберг, Швеция"
            }
        };

        return translations[lang] || translations.en;
    }

    applyTranslations(translations) {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.textContent.trim();
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    }

    // ===== MOBILE MENU =====
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });

            // Close menu when clicking links
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                });
            });
        }
    }

    // ===== KEYBOARD NAVIGATION =====
    handleKeyboard(e) {
        // ESC key to close modals or menus
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            const activeMobileMenu = document.querySelector('.mobile-menu.active');
            
            if (activeModal) {
                activeModal.classList.remove('active');
            }
            
            if (activeMobileMenu) {
                activeMobileMenu.classList.remove('active');
                document.querySelector('.mobile-menu-btn').classList.remove('active');
            }
        }
    }

    // ===== THEME TOGGLE =====
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
            
            // Load saved theme
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // ===== CONTACT FORM =====
    setupContactForm() {
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }
    }

    async handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // In a real implementation, send to your backend
            await this.sendContactMessage(data);
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            e.target.reset();
        } catch (error) {
            // Show error message
            this.showNotification('Error sending message. Please try again.', 'error');
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendContactMessage(data) {
        // Mock API call - replace with your actual endpoint
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // ===== UTILITY METHODS =====
    
    // Lazy loading images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Preload critical resources
    preloadResources() {
        const criticalResources = [
            '/styles.css',
            '/fonts/inter-v12-latin-regular.woff2',
            '/fonts/poppins-v20-latin-600.woff2'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.endsWith('.css') ? 'style' : 'font';
            link.href = resource;
            if (link.as === 'font') {
                link.type = 'font/woff2';
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }

    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // In production, send to error tracking service
        if (window.analytics && typeof window.analytics.track === 'function') {
            window.analytics.track('JavaScript Error', {
                error: error.message,
                context: context,
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        }
    }
}

// ===== INITIALIZE ON DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        new Portfolio();
    } catch (error) {
        console.error('Failed to initialize portfolio:', error);
    }
});

// ===== ADDITIONAL UTILITIES =====

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

// Format date
function formatDate(date, locale = 'en-US') {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Detect device type
function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}