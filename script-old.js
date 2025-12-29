/* ========================================
   GENOMICS CENTRE - JAVASCRIPT
   Interactive features and EmailJS integration
   ======================================== */

// ===== HERO BUTTON FUNCTIONS (MUST BE FIRST) =====
window.scrollToBooking = function() {
    console.log('📋 Book a Test clicked!');
    const bookingSection = document.getElementById('booking-form');
    if (bookingSection) {
        const offsetTop = bookingSection.offsetTop - 80; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

window.scrollToTests = function() {
    console.log('🧪 View Tests clicked!');
    const testsSection = document.getElementById('tests');
    if (testsSection) {
        const offsetTop = testsSection.offsetTop - 80; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

// ===== EmailJS Configuration =====
// TODO: Replace with your actual EmailJS credentials
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_t13tbif',      // Replace with your EmailJS service ID
    TEMPLATE_ID: 'template_2vv929a',    // Replace with your EmailJS template ID
    PUBLIC_KEY: 'PZaAM_z7Us2HNlzbJ'       // Replace with your EmailJS public key
};

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const scrollTopBtn = document.getElementById('scrollTop');
const bookingForm = document.getElementById('bookingForm');
const modalBookingForm = document.getElementById('modalBookingForm');
const bookingModal = document.getElementById('bookingModal');
const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const searchInput = document.getElementById('searchTests');
const sortSelect = document.getElementById('sortTests');
const testsGrid = document.getElementById('testsGrid');
const noResults = document.getElementById('noResults');

// ===== Navigation Functionality =====

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        scrollTopBtn.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        scrollTopBtn.classList.remove('visible');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== FAQ Accordion =====
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
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

// Scroll to top button
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Statistics Counter Animation =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (counter.textContent === '0') {
                    animateCounter(counter);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// ===== Test Cards - Search and Sort Functionality =====

let testCardsArray = Array.from(document.querySelectorAll('.test-card'));

// Search functionality
searchInput.addEventListener('input', (e) => {
    filterAndSortTests();
});

// Sort functionality
sortSelect.addEventListener('change', () => {
    filterAndSortTests();
});

function filterAndSortTests() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const sortValue = sortSelect.value;
    
    // Filter tests based on search
    let filteredTests = testCardsArray.filter(card => {
        const testName = card.getAttribute('data-name').toLowerCase();
        const testDescription = card.querySelector('.test-description').textContent.toLowerCase();
        return testName.includes(searchTerm) || testDescription.includes(searchTerm);
    });
    
    // Sort tests
    if (sortValue === 'price-low') {
        filteredTests.sort((a, b) => {
            return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
        });
    } else if (sortValue === 'price-high') {
        filteredTests.sort((a, b) => {
            return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
        });
    } else if (sortValue === 'name') {
        filteredTests.sort((a, b) => {
            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
        });
    }
    
    // Clear grid
    testsGrid.innerHTML = '';
    
    // Show filtered and sorted tests
    if (filteredTests.length > 0) {
        filteredTests.forEach(card => {
            testsGrid.appendChild(card);
        });
        noResults.style.display = 'none';
    } else {
        noResults.style.display = 'block';
    }
}

// ===== Modal Functionality =====

// Open booking modal with pre-filled test name
window.openBookingModal = function(testName, price) {
    const modalTestInput = document.getElementById('modalTestName');
    modalTestInput.value = `${testName} - ₹${price}`;
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Open DNA Wellness modal with add-ons
window.openDNAWellnessModal = function() {
    // Get selected pricing type
    const pricingRadio = document.querySelector('input[name="dna-pricing"]:checked');
    const pricingType = pricingRadio.value === 'individual' ? 'Individual' : 'Partner';
    const basePrice = parseInt(pricingRadio.dataset.price);
    const addonPrice = parseInt(pricingRadio.dataset.addonPrice);
    
    // Get selected add-ons
    const checkboxes = document.querySelectorAll('.addon-checkbox');
    const selectedAddons = [];
    let totalPrice = basePrice;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedAddons.push(checkbox.dataset.addon);
            totalPrice += addonPrice;
        }
    });
    
    // Build test details string
    let testDetails = `DNA Wellness Test (${pricingType})`;
    if (selectedAddons.length > 0) {
        testDetails += ` + ${selectedAddons.join(', ')}`;
    }
    
    const modalTestInput = document.getElementById('modalTestName');
    modalTestInput.value = `${testDetails} - ₹${totalPrice.toLocaleString('en-IN')}`;
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Open booking modal for tests with pricing type selector
window.openTestWithPricing = function(testName, radioName) {
    const pricingRadio = document.querySelector(`input[name="${radioName}"]:checked`);
    const pricingType = pricingRadio.value === 'individual' ? 'Individual' : 'Partner';
    const price = parseInt(pricingRadio.dataset.price);
    
    const modalTestInput = document.getElementById('modalTestName');
    modalTestInput.value = `${testName} (${pricingType}) - ₹${price.toLocaleString('en-IN')}`;
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Close booking modal
window.closeBookingModal = function() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalBookingForm.reset();
};

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
        closeBookingModal();
    }
});

// ===== Form Validation =====

function validateForm(form) {
    let isValid = true;
    const formData = {};
    
    // Get all required fields
    const fullName = form.querySelector('[name="fullName"]');
    const email = form.querySelector('[name="email"]');
    const mobile = form.querySelector('[name="mobile"]');
    const testName = form.querySelector('[name="testName"]');
    const message = form.querySelector('[name="message"]');
    
    // Clear previous error messages
    form.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
    form.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
        field.style.borderColor = '';
    });
    
    // Validate Full Name
    if (!fullName.value.trim()) {
        showError(fullName, 'Please enter your full name');
        isValid = false;
    } else if (fullName.value.trim().length < 3) {
        showError(fullName, 'Name must be at least 3 characters');
        isValid = false;
    } else {
        formData.fullName = fullName.value.trim();
    }
    
    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'Please enter your email address');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        formData.email = email.value.trim();
    }
    
    // Validate Mobile
    const mobileRegex = /^[+]?[0-9]{10,13}$/;
    if (!mobile.value.trim()) {
        showError(mobile, 'Please enter your mobile number');
        isValid = false;
    } else if (!mobileRegex.test(mobile.value.trim().replace(/\s/g, ''))) {
        showError(mobile, 'Please enter a valid mobile number');
        isValid = false;
    } else {
        formData.mobile = mobile.value.trim();
    }
    
    // Validate Test Name
    if (!testName.value) {
        showError(testName, 'Please select a test');
        isValid = false;
    } else {
        formData.testName = testName.value;
    }
    
    // Message (optional)
    formData.message = message.value.trim() || 'No additional message';
    
    return isValid ? formData : null;
}

function showError(field, message) {
    const errorSpan = field.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = message;
    }
    field.style.borderColor = 'var(--secondary-red)';
    
    // Scroll to first error
    if (field.getBoundingClientRect().top < 100) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ===== EmailJS Form Submission =====

// Main booking form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = validateForm(bookingForm);
    
    if (formData) {
        await sendEmail(formData, bookingForm);
    }
});

// Modal booking form submission
modalBookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = validateForm(modalBookingForm);
    
    if (formData) {
        await sendEmail(formData, modalBookingForm);
        setTimeout(() => {
            closeBookingModal();
        }, 2000);
    }
});

// Send email using EmailJS
async function sendEmail(formData, form) {
    // Show loading overlay
    loadingOverlay.classList.add('active');
    
    // Disable submit button
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        // EmailJS template parameters
        const templateParams = {
            to_name: 'Genomics Centre Team',
            from_name: formData.fullName,
            from_email: formData.email,
            from_mobile: formData.mobile,
            test_name: formData.testName,
            message: formData.message,
            reply_to: formData.email
        };
        
        // Send email via EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('Email sent successfully:', response);
        
        // Success handling
        showToast('Enquiry sent successfully! We will contact you soon.', 'success');
        form.reset();
        
        // Track successful submission (optional - for analytics)
        trackFormSubmission('success', formData.testName);
        
    } catch (error) {
        console.error('Email sending failed:', error);
        
        // Error handling
        showToast('Failed to send enquiry. Please try again or call us directly.', 'error');
        
        // Track failed submission (optional - for analytics)
        trackFormSubmission('error', formData.testName);
    } finally {
        // Hide loading overlay
        loadingOverlay.classList.remove('active');
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// ===== Toast Notification =====

function showToast(message, type = 'success') {
    toast.classList.remove('show');
    
    // Set toast style based on type
    if (type === 'success') {
        toast.style.background = 'var(--success-green)';
        toast.querySelector('i').className = 'fas fa-check-circle';
    } else {
        toast.style.background = 'var(--secondary-red)';
        toast.querySelector('i').className = 'fas fa-exclamation-circle';
    }
    
    toastMessage.textContent = message;
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// ===== Analytics Tracking (Optional) =====

function trackFormSubmission(status, testName) {
    // This is a placeholder for analytics tracking
    // You can integrate Google Analytics, Facebook Pixel, etc.
    console.log(`Form submission ${status} for test: ${testName}`);
    
    // Example: Google Analytics tracking
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'form_submission', {
    //         'event_category': 'engagement',
    //         'event_label': testName,
    //         'value': status
    //     });
    // }
}

// ===== Intersection Observer for Animations =====

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Add animation classes to elements
document.querySelectorAll('.test-card, .feature-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

// ===== Accessibility Enhancements =====

// Trap focus within modal when open
bookingModal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && bookingModal.classList.contains('active')) {
        const focusableElements = bookingModal.querySelectorAll(
            'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// ===== Page Load Optimizations =====

// Lazy load images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Console Welcome Message =====

console.log('%c🧬 Genomics Research & Diagnostics Centre', 
    'font-size: 20px; font-weight: bold; color: #0066cc;');
console.log('%cTrusted Diagnostic & Pathology Services', 
    'font-size: 14px; color: #6c757d;');
console.log('%c📞 Contact: +91 8572851031', 
    'font-size: 12px; color: #495057;');
console.log('%c📧 Email: Info.genomicscentre@gmail.com', 
    'font-size: 12px; color: #495057;');
console.log('%c📍 Location: Karnal, Haryana', 
    'font-size: 12px; color: #495057;');

// ===== Service Worker Registration (Optional - for PWA) =====

// Uncomment to enable Progressive Web App features
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then(reg => console.log('Service Worker registered'))
//             .catch(err => console.log('Service Worker registration failed'));
//     });
// }

// ===== Error Handling =====

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can send error reports to your server here
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send error reports to your server here
});

// ===== Initialize =====

console.log('✅ Genomics Centre website loaded successfully!');
console.log('⚠️ Remember to configure EmailJS credentials in script.js');
