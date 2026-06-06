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
// VIRTUAL VIK CHATBOT LOGIC — v2.0
// ==========================================

// Configuration
const CHATBOT_CONFIG = {
    openRouterKey: window.CHATBOT_SECRETS ? window.CHATBOT_SECRETS.openRouterKey : "",
    backendUrl: "https://portfolio-chat-proxy.bandaruvikranth.workers.dev",
    siteUrl: window.location.href,
    siteTitle: "Vikranth Bandaru Portfolio"
};

// State
let chatHistory = [];
let portfolioContext = "";
let isSending = false;

// Initialize Chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
});

function initChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const chatWindow = document.querySelector('.chatbot-window');
    const chatContainer = document.getElementById('chatbot-container');
    const sendBtn = document.getElementById('chatbot-send');
    const inputField = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    const suggestions = document.querySelectorAll('.suggestion-chip');
    const alertBadge = document.querySelector('.chatbot-alert');

    // Extract Context from the live DOM
    portfolioContext = extractPortfolioContext();

    // Toggle chatbot open/close
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            alertBadge.style.display = 'none';
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
            inputField.value = chip.textContent.replace(/^[\u{1F4BC}\u{1F6E0}\u{FE0F}\u{1F680}\u{1F4E9}\s]+/u, '').trim();
            sendMessage();
        });
    });

    function sendMessage() {
        const text = inputField.value.trim();
        if (!text || isSending) return;
        isSending = true;

        addMessage(text, 'user');
        inputField.value = '';
        inputField.disabled = true;
        sendBtn.disabled = true;
        showTypingIndicator();
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
        removeTypingIndicator();
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.id = 'typing-indicator';
        div.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
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

    function unlockInput() {
        isSending = false;
        inputField.disabled = false;
        sendBtn.disabled = false;
        inputField.focus();
    }

    // ── Build the system prompt ──
    function buildSystemPrompt() {
        return `You are "Virtual Vik", a warm and knowledgeable AI assistant on Vikranth Bandaru's portfolio website. You speak as if you personally know Vikranth.

RULES:
- Answer ONLY from the CONTEXT below. Never invent facts.
- Be concise (3-5 sentences). Use bullet points for lists.
- Use **bold** for emphasis. Never start with "Based on the context".
- Refer to Vikranth in third person. Be enthusiastic but professional.
- If you don't know, say: "I don't have that info — reach Vikranth at bandaruvikranth@gmail.com or LinkedIn!"
- Vikranth is actively seeking full-time AI/ML roles. If asked about hiring, confirm enthusiastically.

CONTEXT:
${portfolioContext}

Respond naturally and helpfully.`;
    }

    // ── API call with model fallback ──
    async function fetchResponse(userMessage) {
        try {
            // Best free models, ordered by quality
            const models = [
                "google/gemini-2.5-flash:free",
                "meta-llama/llama-4-maverick:free",
                "google/gemma-3-27b-it:free",
                "mistralai/mistral-small-3.1-24b-instruct:free"
            ];

            const systemPrompt = buildSystemPrompt();

            const makeRequest = async (model) => {
                const backendUrl = CHATBOT_CONFIG.backendUrl;
                let url, headers;

                if (backendUrl) {
                    url = backendUrl;
                    headers = { "Content-Type": "application/json" };
                } else {
                    url = "https://openrouter.ai/api/v1/chat/completions";
                    headers = {
                        "Authorization": `Bearer ${CHATBOT_CONFIG.openRouterKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": window.location.href,
                        "X-Title": "Portfolio Chatbot"
                    };
                }

                return fetch(url, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        model,
                        max_tokens: 500,
                        temperature: 0.7,
                        messages: [
                            { role: "system", content: systemPrompt },
                            ...chatHistory.slice(-10),
                            { role: "user", content: userMessage }
                        ]
                    })
                });
            };

            let response, lastError, lastStatus;

            for (const model of models) {
                try {
                    console.log(`[VirtualVik] Trying: ${model}`);
                    response = await makeRequest(model);

                    if (response.ok) {
                        console.log(`[VirtualVik] Success with: ${model}`);
                        break;
                    }

                    lastStatus = response.status;
                    lastError = await response.json().catch(() => ({}));
                    console.warn(`[VirtualVik] ${model} → ${response.status}`);
                } catch (e) {
                    console.error(`[VirtualVik] Network error (${model}):`, e);
                    lastStatus = 0;
                }
            }

            if (!response || !response.ok) {
                // Differentiated error messages
                if (lastStatus === 429) {
                    throw { type: 'rate_limit' };
                } else if (lastStatus === 0) {
                    throw { type: 'network' };
                } else {
                    throw { type: 'server', status: lastStatus, detail: lastError };
                }
            }

            const data = await response.json();
            if (!data.choices?.[0]?.message?.content) {
                throw { type: 'format' };
            }

            const botReply = data.choices[0].message.content;

            // Update conversation history
            chatHistory.push({ role: "user", content: userMessage });
            chatHistory.push({ role: "assistant", content: botReply });

            // Keep history manageable
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(-16);
            }

            removeTypingIndicator();
            addMessage(botReply, 'bot');

        } catch (error) {
            console.error("[VirtualVik] Error:", error);
            removeTypingIndicator();

            let errorMsg;
            if (error.type === 'rate_limit') {
                errorMsg = "I'm getting a lot of questions right now! 😅 Please try again in a moment.";
            } else if (error.type === 'network') {
                errorMsg = "Looks like there's a connection issue. Please check your internet and try again.";
            } else if (error.type === 'format') {
                errorMsg = "I got a bit confused there. Could you rephrase your question?";
            } else {
                errorMsg = "Something went wrong on my end. Try again in a few seconds! 🙏";
            }
            addMessage(errorMsg, 'bot');
        } finally {
            unlockInput();
        }
    }

    // ── Enhanced markdown-to-HTML formatter ──
    function formatMessage(text) {
        if (!text) return "";

        // Escape HTML first (except for bot messages we're constructing)
        let html = text;

        // Bold: **text**
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Italic: *text* (but not inside bold)
        html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

        // Inline code: `code`
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // URLs to clickable links
        html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:var(--accent-primary)">$1</a>');

        // Unordered lists: lines starting with - or *
        html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
        html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

        // Numbered lists: lines starting with 1. 2. etc.
        html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
        // Wrap consecutive <li> not already in <ul> into <ol>
        html = html.replace(/(?<!<\/ul>)((?:<li>.*<\/li>\s*)+)(?!<\/ul>)/g, (match) => {
            // Only wrap if not already wrapped
            if (!match.includes('<ul>')) return '<ol>' + match + '</ol>';
            return match;
        });

        // Line breaks: double newline → paragraph break
        html = html.replace(/\n{2,}/g, '<br><br>');
        // Single newline → line break (but not inside lists)
        html = html.replace(/(?<!<\/li>)\n(?!<)/g, '<br>');

        return html;
    }
}

// ── Extract portfolio context from the live DOM ──
function extractPortfolioContext() {
    let context = "=== VIKRANTH BANDARU — PORTFOLIO ===\n\n";

    // Hero
    const heroTitle = document.querySelector('.hero-title')?.innerText || "";
    const heroDesc = document.querySelector('.hero-description')?.innerText ||
        document.querySelector('.hero-subtitle')?.innerText || "";
    context += `NAME: ${heroTitle}\nROLE: ${heroDesc}\n\n`;

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

    // ── SKILLS (FIXED: uses .skill-box and .skill-icon-item) ──
    context += "TECHNICAL SKILLS:\n";
    const skillBoxes = document.querySelectorAll('.skill-box');
    if (skillBoxes.length > 0) {
        skillBoxes.forEach(box => {
            const title = box.querySelector('.skill-box-title')?.innerText || '';
            const skills = Array.from(box.querySelectorAll('.skill-icon-item span'))
                .map(s => s.innerText.trim())
                .filter(s => s.length > 0)
                .join(', ');
            if (title && skills) context += `  ${title}: ${skills}\n`;
        });
    } else {
        // Fallback: try legacy selectors
        const skillCategories = Array.from(document.querySelectorAll('.skill-category')).map(cat => {
            const title = cat.querySelector('.skill-category-title')?.innerText || '';
            const tags = Array.from(cat.querySelectorAll('.skill-tag')).map(t => t.innerText).join(', ');
            return `${title}: ${tags}`;
        }).join('\n  ');
        if (skillCategories) context += `  ${skillCategories}\n`;
    }
    context += "\n";

    // Experience
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

    // Education
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

    // Testimonials
    context += "TESTIMONIALS:\n";
    document.querySelectorAll('.testimonial-card').forEach(card => {
        const name = card.querySelector('.testimonial-name')?.innerText || '';
        const role = card.querySelector('.testimonial-role')?.innerText || '';
        const meta = card.querySelector('.testimonial-meta, .testimonial-date')?.innerText || '';
        const text = card.querySelector('.testimonial-text')?.innerText || '';
        if (name && text) {
            context += `  - ${name} (${role}${meta ? ', ' + meta : ''}): "${text.trim()}"\n`;
        }
    });
    context += "\n";

    // Projects
    context += "PROJECTS:\n";
    document.querySelectorAll('.project-card').forEach(card => {
        const title = card.querySelector('.project-title')?.innerText || '';
        const desc = card.querySelector('.project-description')?.innerText || '';
        const tech = Array.from(card.querySelectorAll('.tech-tag')).map(t => t.innerText).join(', ');
        const features = Array.from(card.querySelectorAll('.project-features li')).map(li => li.innerText).join('; ');
        if (title) {
            context += `  - ${title}: ${desc}`;
            if (tech) context += ` | Tech: ${tech}`;
            if (features) context += ` | Features: ${features}`;
            context += "\n";
        }
    });
    context += "\n";

    // Certifications
    context += "CERTIFICATIONS:\n";
    document.querySelectorAll('.certification-card').forEach(card => {
        const title = card.querySelector('.cert-title')?.innerText || '';
        const issuer = card.querySelector('.cert-issuer')?.innerText || '';
        const date = card.querySelector('.cert-date')?.innerText || '';
        if (title) context += `  - ${title} by ${issuer} (${date})\n`;
    });
    context += "\n";

    // Publications
    const pubCard = document.querySelector('.publication-card');
    if (pubCard) {
        context += `PUBLICATIONS: ${pubCard.innerText || ''}\n\n`;
    }

    // Awards
    context += "AWARDS:\n";
    document.querySelectorAll('.award-card').forEach(card => {
        const title = card.querySelector('.award-title')?.innerText || '';
        const meta = card.querySelector('.award-meta')?.innerText || '';
        const desc = card.querySelector('.award-description')?.innerText || '';
        if (title) context += `  - ${title} (${meta})${desc ? ': ' + desc.substring(0, 150) : ''}\n`;
    });
    context += "\n";

    // Contact
    const contactIntro = document.querySelector('.contact-intro')?.innerText || '';
    context += `AVAILABILITY & CONTACT: ${contactIntro} | Email: bandaruvikranth@gmail.com | Location: New York, USA | LinkedIn: linkedin.com/in/vikranthbandaru | GitHub: github.com/vikranthbandaru\n`;

    console.log("[VirtualVik] Context extracted:", context.length, "chars");
    return context;
}

// Global helper to close chatbot from link
window.closeChatbot = function () {
    const cw = document.querySelector('.chatbot-window');
    if (cw) cw.classList.add('hidden');
};

