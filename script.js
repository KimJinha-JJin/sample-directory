// ===== Navigation Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Navigation Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Stat Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateCounters() {
    statNumbers.forEach(statEl => {
        const target = parseInt(statEl.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            statEl.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                statEl.textContent = target;
            }
        }

        requestAnimationFrame(updateCount);
    });
}

// ===== Timeline Animation =====
const timelineItems = document.querySelectorAll('.timeline-item');

function checkTimelineVisibility() {
    timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            item.classList.add('visible');
        }
    });
}

// ===== Intersection Observer for Stats =====
const statsSection = document.getElementById('stats');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateCounters();
        }
    });
}, { threshold: 0.3 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== Gallery Filter =====
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ===== Quotes Slider =====
const quotes = document.querySelectorAll('.quote-slide');
const dotsContainer = document.getElementById('quoteDots');
let currentQuote = 0;
let quoteInterval;

// Create dots
quotes.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('quote-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToQuote(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.quote-dot');

function goToQuote(index) {
    quotes[currentQuote].classList.remove('active');
    dots[currentQuote].classList.remove('active');

    currentQuote = index;

    quotes[currentQuote].classList.add('active');
    dots[currentQuote].classList.add('active');

    resetQuoteInterval();
}

function nextQuote() {
    const next = (currentQuote + 1) % quotes.length;
    goToQuote(next);
}

function resetQuoteInterval() {
    clearInterval(quoteInterval);
    quoteInterval = setInterval(nextQuote, 4000);
}

// Start auto-sliding
quoteInterval = setInterval(nextQuote, 4000);

// ===== Scroll Event Listener =====
window.addEventListener('scroll', () => {
    checkTimelineVisibility();
});

// ===== Initial Check =====
document.addEventListener('DOMContentLoaded', () => {
    checkTimelineVisibility();
    updateActiveNav();
});
