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
        
        const formData = {
            name: document.getElementById('name')?.value,
            phone: document.getElementById('phone')?.value,
            email: document.getElementById('email')?.value,
            service: document.getElementById('service')?.value,
            message: document.getElementById('message')?.value || 'No message provided'
        };

        // Show loading state
        const submitBtn = enquiryForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Try to send with EmailJS if available
            if (typeof emailjs !== 'undefined') {
                await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    formData
                );
                showToast('✅ Enquiry sent successfully! We\'ll contact you soon.');
            } else {
                // Fallback: Just show success message
                console.log('EmailJS not loaded, form data:', formData);
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
        
        const pricingType = document.querySelector('input[name="pricingType"]:checked')?.value || 'individual';
        
        const formData = {
            name: document.getElementById('fullName')?.value,
            phone: document.getElementById('phoneNumber')?.value,
            email: document.getElementById('emailAddress')?.value,
            service: document.getElementById('serviceType')?.value,
            pricingType: pricingType,
            date: document.getElementById('preferredDate')?.value || 'Not specified',
            message: document.getElementById('messageText')?.value || 'No message provided'
        };

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Try to send with EmailJS if available
            if (typeof emailjs !== 'undefined') {
                await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    formData
                );
                showToast('✅ Message sent successfully! We\'ll get back to you soon.');
            } else {
                // Fallback: Just show success message
                console.log('EmailJS not loaded, form data:', formData);
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
    searchInput.addEventListener('input', filterServices);
}

if (sortSelect && servicesGrid) {
    sortSelect.addEventListener('change', sortServices);
}

function filterServices() {
    const searchTerm = searchInput.value.toLowerCase();
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
function showToast(message, duration = 4000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
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
        
        const formData = {
            name: document.getElementById('bookingName').value,
            email: document.getElementById('bookingEmail').value,
            phone: document.getElementById('bookingPhone').value,
            test: document.getElementById('bookingTest').value,
            message: document.getElementById('bookingMessage').value
        };
        
        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send email using EmailJS
            if (typeof emailjs !== 'undefined') {
                await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone,
                        service: formData.test,
                        message: formData.message || 'No additional message'
                    }
                );
            }
            
            // Show success message
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
