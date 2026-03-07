/* ================================================
   GEORGE RUSSELL FAN SITE — SCRIPTS
   ================================================ */

/* ---------- LOADING SCREEN ---------- */
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 1200);
});

/* ---------- SCROLL ANIMATIONS (Intersection Observer) ---------- */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for grid children
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// Add staggered delays for grid/list items
document.querySelectorAll('.stats-grid .stat-card').forEach((el, i) => {
  el.dataset.delay = i * 120;
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

document.querySelectorAll('.gallery-item').forEach((el, i) => {
  el.dataset.delay = i * 80;
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

fadeEls.forEach(el => fadeObserver.observe(el));

/* ---------- COUNTER ANIMATION ---------- */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const statsSection = document.getElementById('stats');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
    });
  }
}, { threshold: 0.3 });

if (statsSection) {
  statsObserver.observe(statsSection);
}

/* ---------- NAVBAR SCROLL EFFECT ---------- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(10, 10, 10, 0.95)';
  } else {
    navbar.style.background = 'rgba(17, 17, 17, 0.85)';
  }
}, { passive: true });

/* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- HERO TYPING EFFECT ---------- */
const typingEl = document.getElementById('hero-typing');
const typingPhrases = [
  'Mr. Saturday',
  '#63 · Mercedes-AMG Petronas',
  '5x F1 Race Winner',
  '차세대 F1 에이스',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeWriter() {
  const phrase = typingPhrases[phraseIdx];
  typingEl.textContent = isDeleting
    ? phrase.substring(0, charIdx - 1)
    : phrase.substring(0, charIdx + 1);
  charIdx += isDeleting ? -1 : 1;

  let speed = isDeleting ? 55 : 95;
  if (!isDeleting && charIdx === phrase.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % typingPhrases.length;
    speed = 400;
  }
  setTimeout(typeWriter, speed);
}
setTimeout(typeWriter, 2100);

/* ---------- RACE RESULT FILTER ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const resultCards = document.querySelectorAll('.result-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    resultCards.forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.result === filter) ? '' : 'none';
    });
  });
});

/* ---------- DARK / LIGHT THEME TOGGLE ---------- */
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

if (localStorage.getItem('theme') === 'light') root.setAttribute('data-theme', 'light');

themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  if (isLight) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

/* ---------- HAMBURGER MENU ---------- */
const hamburger = document.getElementById('nav-hamburger');
const navLinksList = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksList.classList.toggle('open');
});

navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksList.classList.remove('open');
  });
});

/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ---------- GALLERY LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
const lbBackdrop = document.getElementById('lb-backdrop');

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let currentIndex = 0;

function openLightbox(index) {
  const item = galleryItems[index];
  const img = item.querySelector('img');
  if (!img) return;
  currentIndex = index;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = item.dataset.label || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(i);
    }
  });
});
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

/* ---------- TOTO CAROUSEL ---------- */
const totoSlides = document.querySelectorAll('.toto-slide');
const totoDots   = document.querySelectorAll('.toto-dot');
let totoIdx = 0, totoTimer;

function showTotoSlide(n) {
  totoSlides[totoIdx].classList.remove('active');
  totoDots[totoIdx].classList.remove('active');
  totoIdx = n;
  totoSlides[totoIdx].classList.add('active');
  totoDots[totoIdx].classList.add('active');
}

function startTotoTimer() {
  totoTimer = setInterval(() => showTotoSlide((totoIdx + 1) % totoSlides.length), 4000);
}

function resetTotoTimer() {
  clearInterval(totoTimer);
  startTotoTimer();
}

totoDots.forEach((dot, i) => dot.addEventListener('click', () => { showTotoSlide(i); resetTotoTimer(); }));
if (totoSlides.length) startTotoTimer();
