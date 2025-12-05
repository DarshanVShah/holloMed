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
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
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
class ProductViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.animationId = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized || !this.container || typeof THREE === 'undefined') return;
        
        // Remove placeholder if it exists
        const placeholder = this.container.querySelector('.product-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Set up Three.js scene
        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 500;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xF0F8FF);

        // Camera
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(5, 5, 5);
        directionalLight1.castShadow = true;
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-5, -5, -5);
        this.scene.add(directionalLight2);

        // Add subtle rotation animation for empty scene
        this.animate();
        this.isInitialized = true;
    }

    async loadModel(glbPath) {
        if (!this.isInitialized) {
            this.init();
        }

        if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
            console.error('Three.js or GLTFLoader not available');
            return Promise.reject('Three.js or GLTFLoader not available');
        }

        return new Promise((resolve, reject) => {
            // Remove existing model
            if (this.model) {
                this.scene.remove(this.model);
            }

            const loader = new THREE.GLTFLoader();
            loader.load(
                glbPath,
                (gltf) => {
                    const object = gltf.scene;
                    
                    // Center and scale the model
                    const box = new THREE.Box3().setFromObject(object);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 2 / maxDim;

                    object.scale.multiplyScalar(scale);
                    object.position.sub(center.multiplyScalar(scale));

                    // Enhance materials
                    object.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            if (child.material) {
                                child.material.metalness = 0.3;
                                child.material.roughness = 0.4;
                            }
                        }
                    });

                    this.model = object;
                    this.scene.add(object);
                    resolve(object);
                },
                (progress) => {
                    // Loading progress
                    if (progress.total > 0) {
                        const percent = (progress.loaded / progress.total) * 100;
                        console.log('Loading model:', percent.toFixed(2) + '%');
                    }
                },
                (error) => {
                    console.error('Error loading GLB model:', error);
                    reject(error);
                }
            );
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.model) {
            this.model.rotation.y += 0.005;
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize() {
        if (!this.isInitialized || !this.container) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 500;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Initialize product viewer
const productViewer = new ProductViewer('product-showcase');

// Handle window resize
window.addEventListener('resize', () => {
    if (productViewer) {
        productViewer.onResize();
    }
});

// Auto-load the GLB model on page load
document.addEventListener('DOMContentLoaded', () => {
    if (productViewer && document.getElementById('product-showcase')) {
        setTimeout(() => {
            productViewer.init();
            productViewer.loadModel('assets/RubiksCube.glb').catch(err => {
                console.error('Error loading 3D model:', err);
            });
        }, 100);
    }
});

// Function to load model manually if needed
// Usage: loadProductModel('path/to/model.glb')
window.loadProductModel = function(glbPath) {
    if (productViewer) {
        productViewer.init();
        productViewer.loadModel(glbPath).catch(err => {
            console.error('Error loading 3D model:', err);
        });
    }
};

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
});

