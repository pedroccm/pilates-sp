// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
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

// ===== MOBILE NAVIGATION =====
class MobileNavigation {
    constructor() {
        this.navToggle = $('#nav-toggle');
        this.navMenu = $('#nav-menu');
        this.navLinks = $$('.nav-link');
        this.body = document.body;
        
        this.init();
    }
    
    init() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-container') && this.navMenu.classList.contains('active')) {
                    this.closeMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                    this.closeMenu();
                }
            });
            
            // Handle window resize
            window.addEventListener('resize', debounce(() => {
                if (window.innerWidth > 1024) {
                    this.closeMenu();
                }
            }, 250));
        }
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        this.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.body.style.overflow = '';
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle all anchor links
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = $(targetId);
                
                if (targetElement) {
                    const headerOffset = $('.header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== HEADER SCROLL EFFECTS =====
class HeaderScrollEffects {
    constructor() {
        this.header = $('.header');
        this.scrollThreshold = 100;
        this.init();
    }
    
    init() {
        if (this.header) {
            window.addEventListener('scroll', throttle(() => {
                this.handleScroll();
            }, 10));
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        if (scrollY > this.scrollThreshold) {
            this.header.style.background = 'rgba(255, 255, 255, 0.98)';
            this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.header.style.background = 'rgba(255, 255, 255, 0.95)';
            this.header.style.boxShadow = 'none';
        }
    }
}

// ===== BACK TO TOP BUTTON =====
class BackToTop {
    constructor() {
        this.button = $('#backToTop');
        this.scrollThreshold = 300;
        this.init();
    }
    
    init() {
        if (this.button) {
            window.addEventListener('scroll', throttle(() => {
                this.handleScroll();
            }, 100));
            
            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        if (scrollY > this.scrollThreshold) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.elements = $$('[data-animate]');
        this.observer = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );
            
            // Add animation classes to elements
            this.elements.forEach(element => {
                const animation = element.dataset.animate || 'fade-in-up';
                element.classList.add(`animate-${animation}`);
                element.style.opacity = '0';
                this.observer.observe(element);
            });
            
            // Fallback for elements without data-animate
            $$('.service-card, .team-member, .testimonial-card, .pricing-card').forEach((element, index) => {
                if (!element.dataset.animate) {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    element.style.transitionDelay = `${index * 0.1}s`;
                    this.observer.observe(element);
                }
            });
        }
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.dataset.animate) {
                    element.style.opacity = '1';
                    element.classList.add('animate-fade-in-up');
                } else {
                    // Fallback animation
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                
                this.observer.unobserve(element);
            }
        });
    }
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.form = $('#contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateSubmission(data);
            
            // Show success message
            this.showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.form.reset();
            
        } catch (error) {
            // Show error message
            this.showMessage('Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.', 'error');
            console.error('Form submission error:', error);
            
        } finally {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    simulateSubmission(data) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve(data);
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
    }
    
    showMessage(text, type = 'info') {
        // Remove existing messages
        $$('.form-message').forEach(msg => msg.remove());
        
        const message = document.createElement('div');
        message.className = `form-message form-message--${type}`;
        message.textContent = text;
        
        // Style the message
        Object.assign(message.style, {
            padding: '1rem',
            marginTop: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500'
        });
        
        if (type === 'success') {
            Object.assign(message.style, {
                background: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb'
            });
        } else if (type === 'error') {
            Object.assign(message.style, {
                background: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb'
            });
        }
        
        this.form.appendChild(message);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// ===== TESTIMONIALS CAROUSEL =====
class TestimonialsCarousel {
    constructor() {
        this.container = $('.testimonials-grid');
        this.cards = $$('.testimonial-card');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isAutoPlaying = false;
        
        // Only initialize if we have testimonials and on mobile
        if (this.cards.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Only activate carousel on mobile devices
        if (window.innerWidth <= 768) {
            this.setupCarousel();
            this.startAutoPlay();
        }
        
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth <= 768 && !this.isAutoPlaying) {
                this.setupCarousel();
                this.startAutoPlay();
            } else if (window.innerWidth > 768 && this.isAutoPlaying) {
                this.destroyCarousel();
            }
        }, 250));
    }
    
    setupCarousel() {
        // Add carousel controls if not exist
        if (!$('.testimonials .carousel-controls')) {
            const controls = document.createElement('div');
            controls.className = 'carousel-controls';
            controls.innerHTML = `
                <button class="carousel-btn carousel-prev">‹</button>
                <div class="carousel-indicators"></div>
                <button class="carousel-btn carousel-next">›</button>
            `;
            
            $('.testimonials .container').appendChild(controls);
            
            // Add indicators
            const indicators = $('.carousel-indicators');
            this.cards.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
                indicator.dataset.index = index;
                indicators.appendChild(indicator);
            });
            
            // Add event listeners
            $('.carousel-prev').addEventListener('click', () => this.prevSlide());
            $('.carousel-next').addEventListener('click', () => this.nextSlide());
            
            $$('.carousel-indicator').forEach(indicator => {
                indicator.addEventListener('click', (e) => {
                    this.goToSlide(parseInt(e.target.dataset.index));
                });
            });
        }
        
        this.updateCarousel();
    }
    
    destroyCarousel() {
        if ($('.testimonials .carousel-controls')) {
            $('.testimonials .carousel-controls').remove();
        }
        this.stopAutoPlay();
        
        // Reset styles
        this.cards.forEach(card => {
            card.style.display = '';
            card.style.transform = '';
        });
    }
    
    updateCarousel() {
        this.cards.forEach((card, index) => {
            card.style.display = index === this.currentIndex ? 'block' : 'none';
        });
        
        // Update indicators
        $$('.carousel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentIndex = this.currentIndex === 0 ? this.cards.length - 1 : this.currentIndex - 1;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            this.isAutoPlaying = false;
        }
    }
}

// ===== LAZY LOADING =====
class LazyLoading {
    constructor() {
        this.images = $$('img[data-src]');
        this.observer = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    rootMargin: '50px 0px'
                }
            );
            
            this.images.forEach(img => this.observer.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => this.loadImage(img));
        }
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    loadImage(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
    }
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            this.monitorWebVitals();
        }
        
        // Monitor page load time
        window.addEventListener('load', () => {
            this.monitorPageLoad();
        });
    }
    
    monitorPageLoad() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            // Send to analytics if needed
            // analytics.track('page_load_time', { duration: loadTime });
        }
    }
    
    monitorWebVitals() {
        // This would integrate with web-vitals library if available
        // getCLS(console.log);
        // getFID(console.log);
        // getFCP(console.log);
        // getLCP(console.log);
        // getTTFB(console.log);
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.enhanceKeyboardNavigation();
        this.addSkipLink();
        this.improveScreenReaderSupport();
    }
    
    enhanceKeyboardNavigation() {
        // Focus management for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }
    
    handleTabNavigation(e) {
        const activeElement = document.activeElement;
        const navMenu = $('#nav-menu');
        
        // Trap focus within mobile menu when open
        if (navMenu && navMenu.classList.contains('active')) {
            const focusableElements = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    addSkipLink() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        
        // Style the skip link
        Object.assign(skipLink.style, {
            position: 'absolute',
            top: '-40px',
            left: '6px',
            background: '#000',
            color: '#fff',
            padding: '8px',
            textDecoration: 'none',
            zIndex: '9999',
            transition: 'top 0.3s'
        });
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main ID if not exists
        const main = $('main');
        if (main && !main.id) {
            main.id = 'main';
        }
    }
    
    improveScreenReaderSupport() {
        // Add aria-labels to interactive elements without text
        $$('button, a').forEach(element => {
            if (!element.textContent.trim() && !element.getAttribute('aria-label')) {
                // Add appropriate aria-labels based on context
                if (element.classList.contains('nav-toggle')) {
                    element.setAttribute('aria-label', 'Menu de navegação');
                }
                if (element.classList.contains('back-to-top')) {
                    element.setAttribute('aria-label', 'Voltar ao topo');
                }
            }
        });
        
        // Announce dynamic content changes
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        Object.assign(liveRegion.style, {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            border: '0'
        });
        document.body.appendChild(liveRegion);
    }
}

// ===== ANALYTICS INTEGRATION =====
class Analytics {
    constructor() {
        this.isGALoaded = false;
        this.init();
    }
    
    init() {
        // Check if Google Analytics is loaded
        this.isGALoaded = typeof gtag !== 'undefined';
        
        this.trackInteractions();
    }
    
    trackInteractions() {
        // Track CTA clicks
        $$('.btn-primary, .nav-cta').forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('engagement', 'cta_click', button.textContent);
            });
        });
        
        // Track form submissions
        const form = $('#contact-form');
        if (form) {
            form.addEventListener('submit', () => {
                this.trackEvent('engagement', 'form_submit', 'contact_form');
            });
        }
        
        // Track phone clicks
        $$('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('engagement', 'phone_click', link.href);
            });
        });
        
        // Track WhatsApp clicks
        $$('a[href*="wa.me"], .whatsapp-float a').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('engagement', 'whatsapp_click', 'contact');
            });
        });
    }
    
    trackEvent(action, event_name, event_label) {
        if (this.isGALoaded) {
            gtag('event', event_name, {
                event_category: action,
                event_label: event_label
            });
        }
        
        // Console log for development
        console.log('Analytics Event:', { action, event_name, event_label });
    }
}

// ===== MAIN APPLICATION =====
class PilatesStudioApp {
    constructor() {
        this.components = [];
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initComponents());
        } else {
            this.initComponents();
        }
    }
    
    initComponents() {
        try {
            // Initialize all components
            this.components = [
                new MobileNavigation(),
                new SmoothScrolling(),
                new HeaderScrollEffects(),
                new BackToTop(),
                new ScrollAnimations(),
                new FormHandler(),
                new TestimonialsCarousel(),
                new LazyLoading(),
                new AccessibilityEnhancements(),
                new Analytics(),
                new PerformanceMonitor()
            ];
            
            console.log('Pilates Studio App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing components:', error);
        }
    }
    
    // Public API for external access
    getComponent(name) {
        return this.components.find(component => component.constructor.name === name);
    }
}

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            // Uncomment when service worker is available
            // const registration = await navigator.serviceWorker.register('/sw.js');
            // console.log('Service Worker registered successfully:', registration.scope);
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    });
}

// ===== INITIALIZE APPLICATION =====
const app = new PilatesStudioApp();

// Make app globally available for debugging
window.PilatesStudioApp = app;