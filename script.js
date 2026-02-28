// ===== Custom Cursor Animation =====
const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
document.body.appendChild(cursorDot);

const cursorOutline = document.createElement('div');
cursorOutline.classList.add('cursor-outline');
document.body.appendChild(cursorOutline);

let mouseX = 0;
let mouseY = 0;
let dotX = 0;
let dotY = 0;
let outlineX = 0;
let outlineY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    
    // Smooth trailing effect for outline
    outlineX += (mouseX - outlineX) * 0.3;
    outlineY += (mouseY - outlineY) * 0.3;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
});

// Cursor effects on interactive elements
const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .stat-card, .about-card, .gallery-item, .filter-btn');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('active');
        cursorOutline.classList.add('active');
    });
    
    el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('active');
        cursorOutline.classList.remove('active');
    });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
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

window.addEventListener('scroll', updateScrollProgress);

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

// ===== Leaflet Memorial Map =====
const mapLocations = [
    {
        lat: 50.9307, lng: 5.3317,
        title: "출생지",
        location: "Hasselt, Belgium",
        desc: "1997년 9월 30일, 막스 베르스타펜이 태어난 곳",
        icon: "🏠"
    },
    {
        lat: -37.8497, lng: 144.9680,
        title: "F1 데뷔 (2015 호주 GP)",
        location: "Albert Park Circuit, Melbourne",
        desc: "17세의 나이로 역대 최연소 F1 드라이버로 데뷔",
        icon: "🏎️"
    },
    {
        lat: 47.5789, lng: 19.2486,
        title: "첫 포디엄 (2015 헝가리 GP)",
        location: "Hungaroring, Budapest",
        desc: "데뷔 시즌 첫 포디엄 피니시",
        icon: "🥉"
    },
    {
        lat: 41.5700, lng: 2.2610,
        title: "첫 우승 (2016 스페인 GP)",
        location: "Circuit de Catalunya, Barcelona",
        desc: "18세 228일 — 역대 최연소 F1 우승 기록",
        icon: "🏆"
    },
    {
        lat: 52.0406, lng: -0.7594,
        title: "Red Bull Racing 공장",
        location: "Milton Keynes, UK",
        desc: "Oracle Red Bull Racing 본사 및 제조 시설",
        icon: "🏭"
    },
    {
        lat: 24.4672, lng: 54.6031,
        title: "첫 월드챔피언십 (2021)",
        location: "Yas Marina Circuit, Abu Dhabi",
        desc: "마지막 랩 극적인 역전으로 첫 월드 챔피언 등극",
        icon: "⭐"
    },
    {
        lat: 34.8431, lng: 136.5406,
        title: "2번째 월드챔피언십 (2022)",
        location: "Suzuka Circuit, Japan",
        desc: "스즈카에서 2연속 월드 챔피언십 확정",
        icon: "⭐"
    },
    {
        lat: 36.1699, lng: -115.1398,
        title: "4번째 월드챔피언십 (2024)",
        location: "Las Vegas Strip Circuit, USA",
        desc: "라스베가스 스트리트 서킷에서 4번째 타이틀 획득",
        icon: "⭐"
    }
];

const verstappenMap = L.map('verstappen-map', {
    scrollWheelZoom: false,
    zoomControl: true
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(verstappenMap);

const bounds = [];

mapLocations.forEach(loc => {
    const markerIcon = L.divIcon({
        className: '',
        html: `<div class="custom-marker"><div class="custom-marker-inner">${loc.icon}</div></div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -40]
    });

    const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon }).addTo(verstappenMap);
    marker.bindPopup(`
        <div class="map-popup-title">${loc.title}</div>
        <div class="map-popup-location">${loc.location}</div>
        <div class="map-popup-desc">${loc.desc}</div>
    `);
    bounds.push([loc.lat, loc.lng]);
});

verstappenMap.fitBounds(bounds, { padding: [40, 40] });

// ===== Initial Check =====
document.addEventListener('DOMContentLoaded', () => {
    checkTimelineVisibility();
    updateActiveNav();
    
    // Re-add cursor effects to dynamically loaded elements
    const allInteractiveElements = document.querySelectorAll('a, button, input, textarea, select, .stat-card, .about-card, .gallery-item, .filter-btn');
    allInteractiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('active');
            cursorOutline.classList.add('active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('active');
            cursorOutline.classList.remove('active');
        });
    });
});
