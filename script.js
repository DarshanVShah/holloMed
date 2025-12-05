// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Newsletter Form Submission
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Here you would typically send this to a backend
        console.log('Newsletter subscription:', email);
        
        // Show success message
        const button = e.target.querySelector('.submit-button');
        const originalText = button.textContent;
        button.textContent = 'Subscribed! ✓';
        button.style.background = '#10b981';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
            e.target.reset();
        }, 2000);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
        navbar.classList.add('scrolled');
    } else {
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.06)';
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.mission-card, .feature-item, .media-card, .update-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 3D Model Loader - Ready for .glb file
// Model-viewer event listeners
document.addEventListener('DOMContentLoaded', () => {
    const modelViewer = document.querySelector('model-viewer');
    
    if (modelViewer) {
        modelViewer.addEventListener('load', () => {
            console.log('3D model loaded successfully');
        });
        
        modelViewer.addEventListener('error', (event) => {
            console.error('Error loading 3D model:', event.detail);
        });
        
        modelViewer.addEventListener('ar-status', (event) => {
            if (event.detail.status === 'not-presenting') {
                console.log('AR session ended');
            }
        });
    }
});


// CTA Button click handler
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const newsletterSection = document.querySelector('.newsletter-section');
        if (newsletterSection) {
            newsletterSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Waitlist Form Submission
const waitlistForm = document.getElementById('waitlist-form');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send this to a backend
        console.log('Waitlist submission:', data);
        
        // Show success message
        const button = e.target.querySelector('.submit-button');
        const originalText = button.textContent;
        button.textContent = 'Thank You! ✓';
        button.style.background = '#10b981';
        button.disabled = true;
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.style.cssText = 'margin-top: 1rem; padding: 1rem; background: #d1fae5; color: #065f46; border-radius: 10px; text-align: center;';
        successMessage.textContent = 'Thank you for joining our waitlist! We\'ll be in touch soon.';
        e.target.appendChild(successMessage);
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
            successMessage.remove();
            e.target.reset();
        }, 5000);
    });
}

// Animate team members on scroll
document.addEventListener('DOMContentLoaded', () => {
    const teamMembers = document.querySelectorAll('.team-member');
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                teamObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    teamMembers.forEach(member => {
        teamObserver.observe(member);
    });

    // Animate founders and advisory board separately for staggered effect
    const founders = document.querySelectorAll('.founder');
    const advisory = document.querySelectorAll('.advisory');
    
    const foundersObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
                foundersObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    founders.forEach(member => {
        foundersObserver.observe(member);
    });

    const advisoryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                advisoryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    advisory.forEach(member => {
        advisoryObserver.observe(member);
    });
});

