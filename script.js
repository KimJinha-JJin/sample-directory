// ===== Custom Cursor =====
const customCursor = document.createElement('div');
customCursor.classList.add('custom-cursor');
customCursor.innerHTML = `
    <svg class="cursor-arrow" xmlns="http://www.w3.org/2000/svg" width="22" height="26" viewBox="0 0 22 26">
        <path d="M1,1 L1,21 L6,16 L10,25 L14,23 L10,14 L17,14 Z"
              fill="#e10600" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
    <img class="cursor-car" src="F1.svg.png" alt="F1 race car cursor">`;
document.body.appendChild(customCursor);

document.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
});

document.addEventListener('mouseleave', () => {
    customCursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    customCursor.style.opacity = '1';
});

// ===== Loading Screen =====
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 2200);
});

// ===== Scroll Progress Bar =====
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
}

// ===== Navigation Scroll Effect =====
const navbar = document.getElementById('navbar');

function updateNavbarStyle() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

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

// ===== Unified Scroll Handler =====
window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNavbarStyle();
    updateActiveNav();
    checkTimelineVisibility();
});

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

// ===== Bar Chart Animation =====
const barChart = document.getElementById('barChart');
if (barChart) {
    const chartObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            barChart.classList.add('animated');
            chartObserver.disconnect();
        }
    }, { threshold: 0.2 });
    chartObserver.observe(barChart);
}

// ===== Scroll Reveal (appears on scroll down, disappears on scroll up) =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Quotes Carousel =====
(function () {
    const slides = document.querySelectorAll('.quote-slide');
    const dotsContainer = document.getElementById('quoteDots');
    const prevBtn = document.getElementById('quotePrev');
    const nextBtn = document.getElementById('quoteNext');

    if (!slides.length || !dotsContainer) return;

    let current = 0;
    let autoTimer = null;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Quote ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        slides[current].classList.remove('active');
        dotsContainer.children[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dotsContainer.children[current].classList.add('active');
        resetAuto();
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Swipe support (touch)
    let touchStartX = 0;
    const track = document.getElementById('quotesTrack');
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    resetAuto();
})();

// ===== Initial Check =====
document.addEventListener('DOMContentLoaded', () => {
    checkTimelineVisibility();
    updateActiveNav();
});
