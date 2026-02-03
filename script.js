document.addEventListener('DOMContentLoaded', () => {
    // 1. Enable JS-dependent styles (progressive enhancement)
    document.body.classList.add('js-enabled');

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Change icon based on state
            mobileMenuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
            });
        });
    }

    // 3. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 5. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // 6. Scroll Spy (Active Nav Link)
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    const scrollSpyOptions = {
        rootMargin: '-30% 0px -70% 0px' // Trigger when section is near the top of viewport
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all links
                navItems.forEach(link => link.classList.remove('active'));
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    // 7. Dynamic Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 8. Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');

            // Update icons
            if (isDark) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
                localStorage.setItem('theme', 'dark');
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 9. Show More/Less for Testimonials
    const showMoreBtns = document.querySelectorAll('.show-more-btn');

    showMoreBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.testimonial-card');
            const text = card.querySelector('.testimonial-text');

            if (text.classList.contains('collapsed')) {
                // Expand
                text.classList.remove('collapsed');
                this.textContent = 'Show Less';
            } else {
                // Collapse
                text.classList.add('collapsed');
                this.textContent = 'Show More';
                // Scroll card into view smoothly
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // 10. Testimonials Carousel
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const indicators = document.querySelectorAll('.indicator-dot');

    if (track && prevBtn && nextBtn) {
        let currentSlide = 0;
        const totalCards = document.querySelectorAll('.testimonial-card').length;

        // Calculate slides per view based on screen width
        function getSlidesPerView() {
            return 1; // Always show 1 testimonial at a time
        }

        // Calculate total slides
        function getTotalSlides() {
            const slidesPerView = getSlidesPerView();
            return Math.ceil(totalCards / slidesPerView);
        }

        // Update carousel position
        function updateCarousel() {
            const slidesPerView = getSlidesPerView();
            const slideWidth = 100 / slidesPerView;
            const offset = currentSlide * slideWidth;
            track.style.transform = `translateX(-${offset}%)`;

            // Update button states
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide >= getTotalSlides() - 1;

            // Update indicators
            indicators.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        // Navigate to specific slide
        function goToSlide(slideIndex) {
            currentSlide = Math.max(0, Math.min(slideIndex, getTotalSlides() - 1));
            updateCarousel();
        }

        // Previous button
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        });

        // Next button
        nextBtn.addEventListener('click', () => {
            if (currentSlide < getTotalSlides() - 1) {
                goToSlide(currentSlide + 1);
            }
        });

        // Indicator dots
        indicators.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Only navigate if carousel is in viewport
            const carouselSection = document.querySelector('.testimonials');
            if (!carouselSection) return;

            const rect = carouselSection.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

            if (isInViewport) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    goToSlide(currentSlide - 1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    goToSlide(currentSlide + 1);
                }
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Reset to first slide on resize to prevent layout issues
                currentSlide = 0;
                updateCarousel();
            }, 250);
        });

        // Initialize carousel
        updateCarousel();
    }
});

// 7. Lightbox Functionality (Global functions for onclick events)
function openLightbox(src, alt) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const captionText = document.getElementById("caption");

    if (lightbox && lightboxImg && captionText) {
        lightbox.style.display = "block";
        lightboxImg.src = src;
        captionText.innerHTML = alt;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.style.display = "none";
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
