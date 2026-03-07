/* ================================================
   GEORGE RUSSELL FAN SITE — SCRIPTS
   ================================================ */

/* ---------- LOADING SCREEN ---------- */
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 1800);
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
