/* ========================================
   GENOMICS CENTRE - MODERN JAVASCRIPT
   Multi-Page Website Functionality
   ======================================== */

// ===== EmailJS Configuration =====
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_t13tbif',
    TEMPLATE_ID: 'template_2vv929a',
    PUBLIC_KEY: 'PZaAM_z7Us2HNlzbJ'
};

// Initialize EmailJS when available
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navSearchInput = document.querySelector('.nav-search-input');
let navSearchResults;

// Master list of services for quick availability checks
const SERVICES_LIST = [
    'DNA Wellness Test',
    'Sample Viability',
    'STR Analysis',
    'Paternity Test',
    'Prenatal Paternity',
    'Maternity Test',
    'Siblings Test',
    'Grandparentage Test',
    'Avuncular Test',
    'YSTR Analysis',
    'mtDNA Analysis',
    'Legal/Transplant Autosomal Analysis',
    'Legal/Transplant YSTR Analysis',
    'Legal/Transplant mtDNA Analysis',
    'Prenatal Paternity + NIPT',
    'Whole Genome Sequencing',
    'Infertility NGS Panel',
    'Chromosomal Microarray (CMA)',
    'Karyotyping (H & F)',
    'POC by NGS',
    'Embrology by NGS',
    'Heredatory Panel',
    'Multigene Panel (72 Gene)',
    'Multigene Panel (350 Gene)',
    'Multigene Panel (1212 Gene)',
    'NIPT'
];
const scrollTopBtn = document.getElementById('scrollTop');

// ===== Navigation Toggle (Mobile) =====
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ===== Sticky Navbar =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll Down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll Up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }

    lastScroll = currentScroll;
});

// ===== Scroll to Top Button =====
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for # only links
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// ===== Form Submission (Homepage Enquiry) =====
const enquiryForm = document.getElementById('enquiryForm');

if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        const submitBtn = enquiryForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            if (typeof emailjs !== 'undefined') {
                await emailjs.sendForm(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    enquiryForm
                );
                showToast('✅ Enquiry sent successfully! We\'ll contact you soon.');
            } else {
                console.log('EmailJS not loaded, form data via FormData');
                showToast('✅ Enquiry received! We\'ll contact you soon.');
            }
            enquiryForm.reset();
        } catch (error) {
            console.error('Error:', error);
            showToast('❌ Failed to send enquiry. Please try again or call us directly.');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Form Submission (Contact Page) =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Pre-fill form based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const testName = urlParams.get('test');
    const individualPrice = urlParams.get('price');
    const partnerPrice = urlParams.get('partner');

    if (testName) {
        const serviceSelect = document.getElementById('serviceType');
        if (serviceSelect) {
            serviceSelect.value = testName;
            
            // Show pricing options if both prices exist
            if (individualPrice && partnerPrice) {
                const pricingGroup = document.getElementById('pricingTypeGroup');
                const individualLabel = document.getElementById('individualPriceLabel');
                const partnerLabel = document.getElementById('partnerPriceLabel');
                
                if (pricingGroup && individualLabel && partnerLabel) {
                    pricingGroup.style.display = 'block';
                    individualLabel.textContent = `Individual (₹${parseInt(individualPrice).toLocaleString('en-IN')})`;
                    partnerLabel.textContent = `Partner (₹${parseInt(partnerPrice).toLocaleString('en-IN')})`;
                }
            }
        }
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ensure pricingType field exists for sendForm
        const pricingType = document.querySelector('input[name="pricingType"]:checked');
        if (!pricingType) {
            const hiddenPricing = document.createElement('input');
            hiddenPricing.type = 'hidden';
            hiddenPricing.name = 'pricingType';
            hiddenPricing.value = 'individual';
            contactForm.appendChild(hiddenPricing);
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            if (typeof emailjs !== 'undefined') {
                await emailjs.sendForm(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    contactForm
                );
                showToast('✅ Message sent successfully! We\'ll get back to you soon.');
            } else {
                console.log('EmailJS not loaded, form data via FormData');
                showToast('✅ Message received! We\'ll get back to you soon.');
            }
            
            contactForm.reset();
            // Hide pricing group after reset
            const pricingGroup = document.getElementById('pricingTypeGroup');
            if (pricingGroup) {
                pricingGroup.style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('❌ Failed to send message. Please try again or call us directly.');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Services Search and Sort =====
const searchInput = document.getElementById('searchTests');
const sortSelect = document.getElementById('sortTests');
const servicesGrid = document.getElementById('servicesGrid');

if (searchInput && servicesGrid) {
    searchInput.addEventListener('input', () => filterServices());
}

if (sortSelect && servicesGrid) {
    sortSelect.addEventListener('change', sortServices);
}

function applyServiceSearch(term) {
    if (searchInput) {
        searchInput.value = term;
    }
    filterServices(term);
}

// Sync header search with services filtering and support redirect from other pages
function getServiceMatches(term) {
    if (!term) return [];
    const lower = term.toLowerCase();
    return SERVICES_LIST.filter(name => name.toLowerCase().includes(lower));
}

function ensureNavSearchResults() {
    if (!navSearchInput) return null;
    if (navSearchResults) return navSearchResults;
    const container = document.createElement('div');
    container.className = 'nav-search-results';
    navSearchInput.parentElement.appendChild(container);
    navSearchResults = container;
    return navSearchResults;
}

function renderNavSearchResults(term) {
    const container = ensureNavSearchResults();
    if (!container) return;

    container.innerHTML = '';
    if (!term || term.length < 2) {
        container.classList.remove('show');
        return;
    }

    const matches = getServiceMatches(term);
    if (matches.length === 0) {
        const noResult = document.createElement('div');
        noResult.className = 'nav-search-result no-result';
        noResult.textContent = 'No matching service';
        container.appendChild(noResult);
    } else {
        matches.slice(0, 5).forEach(name => {
            const item = document.createElement('div');
            item.className = 'nav-search-result';
            item.textContent = name;
            item.addEventListener('click', () => {
                navSearchInput.value = name;
                handleNavSearch();
            });
            container.appendChild(item);
        });
    }

    container.classList.add('show');
}

function handleNavSearch() {
    if (!navSearchInput) return;
    const term = navSearchInput.value.trim();
    if (!term) return;

    const matches = getServiceMatches(term);
    if (matches.length === 0) {
        showToast(`No matching service for "${term}"`);
        renderNavSearchResults(term);
        return;
    }

    const onServicesPage = Boolean(servicesGrid);
    if (onServicesPage) {
        applyServiceSearch(term);
    } else {
        window.location.href = `services.html?search=${encodeURIComponent(term)}`;
    }
}

if (navSearchInput) {
    navSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleNavSearch();
        }
    });

    navSearchInput.addEventListener('input', () => {
        renderNavSearchResults(navSearchInput.value.trim());
        if (servicesGrid) {
            applyServiceSearch(navSearchInput.value);
        }
    });

    navSearchInput.addEventListener('focus', () => {
        renderNavSearchResults(navSearchInput.value.trim());
    });

    navSearchInput.addEventListener('blur', () => {
        setTimeout(() => {
            if (navSearchResults) navSearchResults.classList.remove('show');
        }, 150);
    });
}

function filterServices(term) {
    const searchTerm = (term ?? searchInput?.value ?? '').toLowerCase().trim();
    const serviceCards = servicesGrid.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const description = card.querySelector('.service-description').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function sortServices() {
    const sortValue = sortSelect.value;
    const serviceCards = Array.from(servicesGrid.querySelectorAll('.service-card'));
    
    serviceCards.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
            case 'price-high':
                return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
            case 'name':
                return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
            default:
                return 0;
        }
    });
    
    // Reorder in DOM
    serviceCards.forEach(card => servicesGrid.appendChild(card));
}

// ===== Toast Notification =====
function ensureToast() {
    let toast = document.getElementById('toast');
    let toastMessage = document.getElementById('toastMessage');

    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.id = 'toast';

        const icon = document.createElement('i');
        icon.className = 'fas fa-check-circle';

        toastMessage = document.createElement('span');
        toastMessage.id = 'toastMessage';

        toast.appendChild(icon);
        toast.appendChild(toastMessage);
        document.body.appendChild(toast);
    } else if (!toastMessage) {
        toastMessage = document.createElement('span');
        toastMessage.id = 'toastMessage';
        toast.appendChild(toastMessage);
    }

    return { toast, toastMessage };
}

function showToast(message, duration = 4000) {
    const { toast, toastMessage } = ensureToast();

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

// ===== File Validation =====
// ===== Floating Action Buttons =====
function createFloatingActions() {
    if (document.querySelector('.floating-actions')) return;

    const actions = [
        {
            key: 'whatsapp',
            label: 'WhatsApp Us',
            icon: 'fab fa-whatsapp',
            href: 'https://wa.me/918572851031?text=Hi%20Genomics%20Centre%2C%20I%27d%20like%20to%20enquire%20about%20tests.',
            target: '_blank'
        },
        {
            key: 'enquiry',
            label: 'Enquire Now',
            icon: 'fas fa-comments',
            href: '#enquiry'
        },
        {
            key: 'call',
            label: 'Call Us',
            icon: 'fas fa-phone',
            href: 'tel:+918572851031'
        }
    ];

    const container = document.createElement('div');
    container.className = 'floating-actions';

    actions.forEach(action => {
        const link = document.createElement('a');
        link.className = `fab-btn ${action.key}`;
        link.href = action.href;
        link.setAttribute('aria-label', action.label);
        if (action.target) {
            link.target = action.target;
            link.rel = 'noopener';
        }

        const iconEl = document.createElement('i');
        iconEl.className = action.icon;

        const labelEl = document.createElement('span');
        labelEl.className = 'fab-label';
        labelEl.textContent = action.label;

        link.appendChild(iconEl);
        link.appendChild(labelEl);

        if (action.key === 'enquiry') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById('enquiry') || document.getElementById('contact-form');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.location.href = 'contact.html#contact-form';
                }
            });
        }

        container.appendChild(link);
    });

    document.body.appendChild(container);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .about-card, .contact-card, .info-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    createFloatingActions();

    // Apply search term from URL when landing on services page via header search
    if (servicesGrid && searchInput) {
        const params = new URLSearchParams(window.location.search);
        const presetSearch = params.get('search');
        if (presetSearch) {
            searchInput.value = presetSearch;
            filterServices(presetSearch);
            // Keep nav search in sync when present
            if (navSearchInput) {
                navSearchInput.value = presetSearch;
            }
        }
    }
});

// ===== Active Nav Link Highlighting =====
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Call on page load
setActiveNavLink();

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate stat numbers when they come into view
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            
            if (!isNaN(number)) {
                entry.target.classList.add('animated');
                animateCounter(entry.target, number, 2000);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statObserver.observe(stat);
});

// ===== Image Lazy Loading =====
document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
});

// ===== Form Validation Enhancement =====
function enhanceFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.validity.valid) {
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '#10b981';
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = '#2563eb';
        });
    });
}

// Apply to all forms
document.querySelectorAll('form').forEach(enhanceFormValidation);

// ===== Parallax Effect for Hero =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== Console Welcome Message =====
console.log('%c🧬 Genomics Research & Diagnostics Centre', 'font-size: 20px; color: #2563eb; font-weight: bold;');
console.log('%cWebsite developed with modern technologies', 'font-size: 12px; color: #6b7280;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #2563eb;');

// ===== Performance Monitoring =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    });
}

// ===== Service Worker Registration (Progressive Web App) =====
if ('serviceWorker' in navigator) {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register('/sw.js').then(() => {
    //     console.log('Service Worker registered');
    // });
}

// ===== Booking Modal (Services Page) =====
const bookingModal = document.getElementById('bookingModal');
const modalClose = document.getElementById('modalClose');
const bookingForm = document.getElementById('bookingForm');
const bookingTestInput = document.getElementById('bookingTest');
const pricingTypeGroup = document.getElementById('pricingTypeGroup');
const individualPriceLabel = document.getElementById('individualPriceLabel');
const partnerPriceLabel = document.getElementById('partnerPriceLabel');
const pricingIndividual = document.getElementById('pricingIndividual');
const pricingPartner = document.getElementById('pricingPartner');

// Handle Book Now button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('book-now-btn') || e.target.closest('.book-now-btn')) {
        e.preventDefault();
        const btn = e.target.classList.contains('book-now-btn') ? e.target : e.target.closest('.book-now-btn');
        const testName = btn.dataset.test;
        const price = btn.dataset.price;
        const partnerPrice = btn.dataset.partner;
        
        // Format the test display with pricing
        let testDisplay = testName;
        if (price && partnerPrice) {
            testDisplay += ` (Individual - ₹${parseInt(price).toLocaleString('en-IN')})`;
        } else if (price) {
            testDisplay += ` - ₹${parseInt(price).toLocaleString('en-IN')}`;
        }

        bookingTestInput.value = testDisplay;

        if (pricingTypeGroup && individualPriceLabel && partnerPriceLabel && pricingIndividual && pricingPartner) {
            pricingIndividual.checked = true;
            pricingIndividual.disabled = false;
            individualPriceLabel.textContent = price ? `Individual (₹${parseInt(price).toLocaleString('en-IN')})` : 'Individual';

            if (partnerPrice) {
                pricingPartner.disabled = false;
                partnerPriceLabel.textContent = `Partner (₹${parseInt(partnerPrice).toLocaleString('en-IN')})`;
            } else {
                pricingPartner.disabled = true;
                pricingPartner.checked = false;
                partnerPriceLabel.textContent = 'Partner (not available)';
            }
        }

        bookingModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
});

// Close modal
if (modalClose) {
    modalClose.addEventListener('click', () => {
        bookingModal.classList.remove('show');
        document.body.style.overflow = '';
    });
}

// Close modal on backdrop click
if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

// Handle booking form submission
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ensure pricingType exists
        const pricingType = document.querySelector('input[name="pricingType"]:checked');
        if (!pricingType) {
            const hiddenPricing = document.createElement('input');
            hiddenPricing.type = 'hidden';
            hiddenPricing.name = 'pricingType';
            hiddenPricing.value = 'individual';
            bookingForm.appendChild(hiddenPricing);
        }

        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            if (typeof emailjs !== 'undefined') {
                await emailjs.sendForm(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    bookingForm
                );
            }
            
            showToast('Booking request sent successfully! We will contact you soon.');
            bookingModal.classList.remove('show');
            document.body.style.overflow = '';
            bookingForm.reset();
        } catch (error) {
            console.error('Booking error:', error);
            showToast('Failed to send booking request. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

console.log('✅ All scripts loaded successfully');
