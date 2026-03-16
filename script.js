document.addEventListener('DOMContentLoaded', () => {
    // 1. Visitor Tracking & Email Notification System
    const EMAILJS_CONFIG = {
        publicKey: 'c1ZTVnNennlmuc6CB',
        serviceID: 'service_izhabmr',
        templateID: 'template_qj24pmq',
        enabled: true  // ✅ ACTIVATED!
    };

    // Initialize EmailJS
    if (EMAILJS_CONFIG.enabled && typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);

        // Send visitor notification
        sendVisitorNotification();
    }


    function sendVisitorNotification() {
        // Get visitor information first
        const visitorInfo = {
            page_url: window.location.href,
            visit_time: new Date().toLocaleString('en-US', {
                timeZone: 'America/New_York',
                dateStyle: 'full',
                timeStyle: 'long'
            }),
            referrer: document.referrer || 'Direct visit',
            device_type: getDeviceType(),
            location: 'Fetching...',
            total_visits: 'Check Google Analytics',
            to_email: 'bandaruvikranth@gmail.com'
        };

        // Get location using ip-api.com (more reliable, free for non-commercial use)
        fetch('http://ip-api.com/json/?fields=city,regionName,country')
            .then(response => response.json())
            .then(data => {
                if (data.city) {
                    visitorInfo.location = `${data.city}, ${data.regionName || ''} ${data.country || ''}`.trim();
                } else {
                    visitorInfo.location = 'Location not available';
                }
                sendEmail(visitorInfo);
            })
            .catch(() => {
                // Fallback: try ipinfo.io
                fetch('https://ipinfo.io/json?token=')
                    .then(response => response.json())
                    .then(data => {
                        visitorInfo.location = `${data.city || 'Unknown'}, ${data.region || ''} ${data.country || ''}`.trim();
                        sendEmail(visitorInfo);
                    })
                    .catch(() => {
                        visitorInfo.location = 'Location not available';
                        sendEmail(visitorInfo);
                    });
            });
    }

    function sendEmail(visitorInfo) {
        emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, visitorInfo)
            .then(response => {
                console.log('✅ Visitor notification sent successfully!', response.status, response.text);
            })
            .catch(error => {
                console.error('❌ Failed to send visitor notification:', error);
            });
    }

    function getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const screenWidth = window.innerWidth;

        if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
            return screenWidth < 768 ? '📱 Mobile' : '📱 Tablet';
        }
        return '💻 Desktop';
    }

    // 2. Enable JS-dependent styles (progressive enhancement)
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

// ==========================================
// VIRTUAL VIK CHATBOT LOGIC
// ==========================================

// Configuration
const CHATBOT_CONFIG = {
    // Key loaded from config.js (gitignored) - Optional if using proxy
    openRouterKey: window.CHATBOT_SECRETS ? window.CHATBOT_SECRETS.openRouterKey : "",
    // Secured Backend Proxy (Public URL)
    backendUrl: "https://portfolio-chat-proxy.bandaruvikranth.workers.dev",
    model: "openrouter/free", // Auto-selects best available free model
    siteUrl: window.location.href,
    siteTitle: "Vikranth Bandaru Portfolio"
};

// State
let chatHistory = [];
let portfolioContext = "";

// Initialize Chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
});

function initChatbot() {
    // DOM Elements
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const chatWindow = document.querySelector('.chatbot-window');
    const chatContainer = document.getElementById('chatbot-container');
    const sendBtn = document.getElementById('chatbot-send');
    const inputField = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    const suggestions = document.querySelectorAll('.suggestion-chip');
    const alertBadge = document.querySelector('.chatbot-alert');

    // Extract Context
    portfolioContext = extractPortfolioContext();

    // Event Listeners
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            alertBadge.style.display = 'none'; // Hide alert on open
            if (!chatWindow.classList.contains('hidden')) {
                chatContainer.classList.add('chatbot-open');
                setTimeout(() => inputField.focus(), 100);
                scrollToBottom();
            } else {
                chatContainer.classList.remove('chatbot-open');
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            chatContainer.classList.remove('chatbot-open');
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    suggestions.forEach(chip => {
        chip.addEventListener('click', () => {
            const text = chip.textContent;
            inputField.value = text;
            sendMessage();
        });
    });

    function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        // Add User Message
        addMessage(text, 'user');
        inputField.value = '';

        // Show Typing Indicator
        showTypingIndicator();

        // Call API
        fetchResponse(text);
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}-message`;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        div.innerHTML = `
            <div class="message-content">${formatMessage(text)}</div>
            <span class="message-time">${timestamp}</span>
        `;

        messagesContainer.appendChild(div);
        scrollToBottom();
    }

    function showTypingIndicator() {
        // Remove existing indicator if any
        removeTypingIndicator();

        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.id = 'typing-indicator';
        div.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(div);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function scrollToBottom() {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async function fetchResponse(userMessage) {
        try {
            console.log("Sending request to OpenRouter...");

            // List of free models to try in order
            const models = [
                "openrouter/free", // Auto-selects best available free model
                "google/gemma-2-9b-it:free",
                "meta-llama/llama-3.2-3b-instruct:free",
                "mistralai/mistral-7b-instruct:free"
            ];

            const systemPrompt = `You are "Virtual Vik", a friendly and enthusiastic AI assistant embedded in Vikranth Bandaru's portfolio website.

CRITICAL RULES:
1. ONLY answer based on the PORTFOLIO CONTEXT below. Do NOT make up information.
2. If the context doesn't contain the answer, say "I don't have that info, but you can reach Vikranth directly at bandaruvikranth@gmail.com!"
3. Keep answers concise (2-4 sentences max). Be professional, friendly, and enthusiastic.
4. When citing experience, use exact company names, roles, and dates from the context.
5. When asked about testimonials/what people say, quote directly from the TESTIMONIALS section.
6. For recent/current employment, refer to the most recent entry in EXPERIENCE.
7. Always refer to Vikranth in third person ("Vikranth", "he", "his").
8. NEVER start responses with phrases like "Based on the portfolio context", "Based on the context provided", "According to the portfolio", or similar meta-references. Just answer the question directly and naturally as if you personally know Vikranth.
9. Vikranth is actively looking for full-time opportunities in AI/ML and Data Science. If asked about hiring, availability, or whether he's open to work, enthusiastically confirm this and suggest reaching out via email or LinkedIn.
10. If asked about his background, mention he's a recent graduate with a Master's degree in Artificial Intelligence from University at Buffalo - SUNY with a strong foundation in AI/ML, and highlight his relevant internships, Full-time experience and projects.
11. If asked about his skills, mention his proficiency in Python, Java, C++, SQL, Machine Learning, Deep Learning, Natural Language Processing, Computer Vision, and Data Science.
12. If asked about his projects, highlight his relevant projects from the projects section.
13. If asked about his internships, highlight his relevant internships from the Experience section.
14. If asked about his full-time experience, highlight his relevant full-time experience from the Experience section.
15. If asked about his education, highlight his relevant education from the Education section.
16. If asked about his certifications, highlight his relevant certifications from the Certifications section.
17. If asked about his volunteering, highlight his relevant volunteering from the Volunteering section.
18. If asked about his hackathons, highlight his relevant hackathons from the Hackathons section.
19. If asked about his publications, highlight his relevant publications from the Publications section.
20. If asked about his awards, highlight his relevant awards from the Awards section.


PORTFOLIO CONTEXT:
${portfolioContext}

END OF CONTEXT.
Answer naturally and directly. Never reference "the portfolio" or "the context" in your responses.`;

            const makeRequest = async (model) => {
                // Use configured backend URL (Proxy) or local secret
                const backendUrl = CHATBOT_CONFIG.backendUrl || (window.CHATBOT_SECRETS ? window.CHATBOT_SECRETS.backendUrl : "");

                let url = "https://openrouter.ai/api/v1/chat/completions";
                let headers = {
                    "Authorization": `Bearer ${CHATBOT_CONFIG.openRouterKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.href,
                    "X-Title": "Portfolio Chatbot"
                };

                // Switch to Proxy if available
                if (backendUrl) {
                    url = backendUrl;
                    headers = {
                        "Content-Type": "application/json"
                    };
                }

                return fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        "model": model,
                        "messages": [
                            {
                                "role": "system",
                                "content": systemPrompt
                            },
                            ...chatHistory.slice(-6),
                            {
                                "role": "user",
                                "content": userMessage
                            }
                        ]
                    })
                });
            };

            let response;
            let lastError;

            // Try models in sequence
            for (const model of models) {
                try {
                    console.log(`Trying model: ${model}`);
                    response = await makeRequest(model);

                    if (response.ok) {
                        break; // Success!
                    } else {
                        console.warn(`Model ${model} failed: ${response.status}`);
                        lastError = await response.json().catch(() => ({}));
                    }
                } catch (e) {
                    console.error(`Network error with ${model}:`, e);
                }
            }

            if (!response || !response.ok) {
                let errorDetails = response ? response.status : 'Network Error';
                if (lastError && lastError.error) {
                    errorDetails += ` (${lastError.error})`;
                } else if (lastError && lastError.message) {
                    errorDetails += ` (${lastError.message})`;
                }
                throw new Error(`All models failed. Last error: ${errorDetails}`);
            }

            const data = await response.json();
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error("Invalid response format");
            }

            const botReply = data.choices[0].message.content;

            // Update History
            chatHistory.push({ role: "user", content: userMessage });
            chatHistory.push({ role: "assistant", content: botReply });

            // Display Reply
            removeTypingIndicator();
            addMessage(botReply, 'bot');

        } catch (error) {
            console.error("Chatbot Error:", error);
            removeTypingIndicator();
            addMessage(`Thinking error: ${error.message}. Please try again later.`, 'bot');
        }
    }

    // Helper: basic markdown-like formatting for links/bold
    function formatMessage(text) {
        if (!text) return "";
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color:var(--accent-primary)">$1</a>');
        // Convert **text** to bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return text;
    }
}

// Extract text from portfolio sections to build context
function extractPortfolioContext() {
    let context = "=== VIKRANTH BANDARU - PORTFOLIO CONTEXT ===\n\n";

    // Hero / Intro
    const heroTitle = document.querySelector('.hero-title')?.innerText || "";
    const heroDesc = document.querySelector('.hero-description')?.innerText ||
        document.querySelector('.hero-subtitle')?.innerText || "";
    context += `TITLE: ${heroTitle}\nINTRO: ${heroDesc}\n\n`;

    // About
    const aboutLead = document.querySelector('.about-lead')?.innerText || "";
    const aboutTexts = Array.from(document.querySelectorAll('.about-text')).map(el => el.innerText).join(' ');
    const aboutCards = Array.from(document.querySelectorAll('.about-card')).map(card => {
        const title = card.querySelector('h3')?.innerText || '';
        const desc = card.querySelector('p')?.innerText || '';
        return `${title}: ${desc}`;
    }).join('\n  ');
    context += `ABOUT:\n  ${aboutLead} ${aboutTexts}\n  ${aboutCards}\n\n`;

    // Stats
    const stats = Array.from(document.querySelectorAll('.stat-card')).map(card => {
        const num = card.querySelector('.stat-number')?.innerText || '';
        const label = card.querySelector('.stat-label')?.innerText || '';
        return `${num} ${label}`;
    }).join(', ');
    if (stats) context += `KEY STATS: ${stats}\n\n`;

    // Skills
    const skillCategories = Array.from(document.querySelectorAll('.skill-category')).map(cat => {
        const title = cat.querySelector('.skill-category-title')?.innerText || '';
        const tags = Array.from(cat.querySelectorAll('.skill-tag')).map(t => t.innerText).join(', ');
        return `${title}: ${tags}`;
    }).join('\n  ');
    if (skillCategories) {
        context += `SKILLS:\n  ${skillCategories}\n\n`;
    } else {
        const allTags = Array.from(document.querySelectorAll('.skill-tag')).map(t => t.innerText).join(', ');
        context += `SKILLS: ${allTags}\n\n`;
    }

    // Experience (FIXED selectors)
    context += "WORK EXPERIENCE:\n";
    document.querySelectorAll('.experience-card').forEach(card => {
        const role = card.querySelector('.exp-title')?.innerText || card.querySelector('h3')?.innerText || '';
        const company = card.querySelector('.exp-company')?.innerText || '';
        const date = card.querySelector('.exp-date')?.innerText || '';
        const highlights = Array.from(card.querySelectorAll('.exp-highlights li'))
            .map(li => li.innerText).join('; ');
        context += `  - ${role} at ${company} (${date}): ${highlights}\n`;
    });
    context += "\n";

    // Education (NEW)
    context += "EDUCATION:\n";
    document.querySelectorAll('.education-card').forEach(card => {
        const degree = card.querySelector('.edu-title')?.innerText || card.querySelector('h3')?.innerText || '';
        const school = card.querySelector('.edu-institution')?.innerText || '';
        const date = card.querySelector('.edu-date')?.innerText || '';
        const coursework = card.querySelector('.edu-coursework')?.innerText || '';
        const highlights = Array.from(card.querySelectorAll('.exp-highlights li, .edu-highlights li'))
            .map(li => li.innerText).join('; ');
        context += `  - ${degree} from ${school} (${date})`;
        if (coursework) context += `. ${coursework}`;
        if (highlights) context += `. Achievements: ${highlights}`;
        context += "\n";
    });
    context += "\n";

    // Testimonials (NEW)
    context += "TESTIMONIALS (What people say about Vikranth):\n";
    document.querySelectorAll('.testimonial-card').forEach(card => {
        const name = card.querySelector('.testimonial-name')?.innerText || '';
        const role = card.querySelector('.testimonial-role')?.innerText || '';
        const meta = card.querySelector('.testimonial-meta')?.innerText || '';
        const text = card.querySelector('.testimonial-text')?.innerText || '';
        if (name && text) {
            context += `  - ${name} (${role}${meta ? ', ' + meta : ''}): "${text}"\n`;
        }
    });
    context += "\n";

    // Projects
    context += "PROJECTS:\n";
    document.querySelectorAll('.project-card').forEach(card => {
        const title = card.querySelector('.project-title')?.innerText || '';
        const desc = card.querySelector('.project-description')?.innerText || '';
        const tech = Array.from(card.querySelectorAll('.tech-tag')).map(t => t.innerText).join(', ');
        if (title) context += `  - ${title}: ${desc} (Tech: ${tech})\n`;
    });
    context += "\n";

    // Certifications (NEW)
    context += "CERTIFICATIONS:\n";
    document.querySelectorAll('.certification-card').forEach(card => {
        const title = card.querySelector('.cert-title')?.innerText || '';
        const issuer = card.querySelector('.cert-issuer')?.innerText || '';
        const date = card.querySelector('.cert-date')?.innerText || '';
        if (title) context += `  - ${title} by ${issuer} (${date})\n`;
    });
    context += "\n";

    // Publications (NEW)
    const pubCard = document.querySelector('.publication-card');
    if (pubCard) {
        const pubText = pubCard.innerText || '';
        context += `PUBLICATIONS: ${pubText}\n\n`;
    }

    // Awards (NEW)
    context += "AWARDS:\n";
    document.querySelectorAll('.award-card').forEach(card => {
        const title = card.querySelector('.award-title')?.innerText || '';
        const meta = card.querySelector('.award-meta')?.innerText || '';
        if (title) context += `  - ${title} (${meta})\n`;
    });
    context += "\n";

    // Contact Info + Availability
    const contactIntro = document.querySelector('.contact-intro')?.innerText || '';
    context += `AVAILABILITY & CONTACT: ${contactIntro} | Email: bandaruvikranth@gmail.com | Location: New York, USA | LinkedIn: https://www.linkedin.com/in/vikranthbandaru/ | GitHub: https://github.com/vikranthbandaru\n`;

    console.log("Portfolio context extracted:", context.length, "chars");
    return context;
}

// Global helper to close chatbot from link
window.closeChatbot = function () {
    const cw = document.querySelector('.chatbot-window');
    if (cw) cw.classList.add('hidden');
};

