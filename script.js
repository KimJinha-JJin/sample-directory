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

// ===== Hand Gesture Nickname Interaction =====
(function () {
    'use strict';

    // --- DOM references (elements already in HTML) ---
    const handCanvas      = document.getElementById('hand-canvas');
    const video           = document.getElementById('gesture-video');
    const toggleBtn       = document.getElementById('gesture-toggle');
    const statusEl        = document.getElementById('gesture-status');
    const scrollUpZone    = document.getElementById('gesture-scroll-up');
    const scrollDownZone  = document.getElementById('gesture-scroll-down');
    const swipeHintEl     = document.getElementById('gesture-swipe-hint');

    if (!handCanvas || !video || !toggleBtn) return;

    const hCtx = handCanvas.getContext('2d');

    // Resize canvas to cover full viewport
    function resizeCanvas() {
        handCanvas.width  = window.innerWidth;
        handCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- Per-word physics state ---
    const words = Array.from(document.querySelectorAll('.wc-word'));
    const physics = new Map();
    words.forEach(w => physics.set(w, { x: 0, y: 0, vx: 0, vy: 0, flying: false, grabbed: false }));

    // --- Constants ---
    const GRAVITY         = 0.38;
    const AIR_FRICTION    = 0.985;
    const FLOOR_FRICTION  = 0.78;
    const BOUNCE          = 0.52;
    const PINCH_THRESHOLD = 0.065; // normalised distance between thumb & index

    // Scroll zone
    const SCROLL_PX_PER_FRAME = 10;

    // Finger-gesture scroll
    const GESTURE_HOLD_FRAMES = 6;    // consecutive frames gesture must be held
    const GESTURE_COOLDOWN_MS = 800;  // min ms between gesture triggers

    // --- State ---
    let gestureActive   = false;
    let mediapipeReady  = false;
    let handsInstance   = null;
    let grabbedWord     = null;
    let pinchVelX       = 0;
    let pinchVelY       = 0;
    let prevPinchX      = 0;
    let prevPinchY      = 0;
    let processingFrame = false;

    // Continuous scroll state
    let scrollRafId  = null;
    let scrollDir    = 0;   // -1 up, 0 stopped, 1 down

    // Finger-gesture detection state
    let gestureHoldCount = 0;
    let lastGestureMs    = 0;
    let currentGesture   = null;   // 'one' | 'v' | null
    let gestureHintTimer = null;

    // --- Continuous scroll helpers ---
    function startContinuousScroll(dir) {
        if (scrollDir === dir) return;
        stopContinuousScroll();
        scrollDir = dir;
        function tick() {
            if (scrollDir === 0) return;
            window.scrollBy(0, scrollDir * SCROLL_PX_PER_FRAME);
            scrollRafId = requestAnimationFrame(tick);
        }
        scrollRafId = requestAnimationFrame(tick);
    }

    function stopContinuousScroll() {
        scrollDir = 0;
        if (scrollRafId) { cancelAnimationFrame(scrollRafId); scrollRafId = null; }
    }

    // Check if index finger tip (ix, iy) is inside a scroll zone
    function checkScrollZones(ix, iy, pinching) {
        if (pinching || grabbedWord) {
            scrollUpZone.classList.remove('hovered');
            scrollDownZone.classList.remove('hovered');
            stopContinuousScroll();
            return;
        }
        const upR   = scrollUpZone.getBoundingClientRect();
        const downR = scrollDownZone.getBoundingClientRect();
        const inUp   = ix >= upR.left && ix <= upR.right && iy >= upR.top && iy <= upR.bottom;
        const inDown = ix >= downR.left && ix <= downR.right && iy >= downR.top && iy <= downR.bottom;

        scrollUpZone.classList.toggle('hovered', inUp);
        scrollDownZone.classList.toggle('hovered', inDown);

        if      (inUp)   startContinuousScroll(-1);
        else if (inDown) startContinuousScroll(1);
        else             stopContinuousScroll();
    }

    // --- Finger-gesture scroll helpers ---
    function isExtended(tip, pip) {
        // Normalised coords: Y increases downward → tip above pip means extended
        return tip.y < pip.y;
    }

    function classifyGesture(lm) {
        const indexUp  = isExtended(lm[8],  lm[6]);   // index tip vs index PIP
        const middleUp = isExtended(lm[12], lm[10]);  // middle tip vs middle PIP
        const ringUp   = isExtended(lm[16], lm[14]);  // ring tip vs ring PIP
        const pinkyUp  = isExtended(lm[20], lm[18]);  // pinky tip vs pinky PIP

        if (indexUp && !middleUp && !ringUp && !pinkyUp) return 'one'; // ☝️ 위 스크롤
        if (indexUp &&  middleUp && !ringUp && !pinkyUp) return 'v';   // ✌️ 아래 스크롤
        return null;
    }

    function detectFingerGesture(lm, pinching) {
        if (pinching || grabbedWord) {
            gestureHoldCount = 0;
            currentGesture   = null;
            return;
        }

        const now       = performance.now();
        const candidate = classifyGesture(lm);

        if (candidate && candidate === currentGesture) {
            gestureHoldCount++;
        } else {
            currentGesture   = candidate;
            gestureHoldCount = candidate ? 1 : 0;
        }

        if (
            gestureHoldCount >= GESTURE_HOLD_FRAMES &&
            now - lastGestureMs >= GESTURE_COOLDOWN_MS &&
            currentGesture
        ) {
            const dir = currentGesture === 'one' ? -1 : 1;
            window.scrollBy({ top: dir * window.innerHeight * 0.55, behavior: 'smooth' });
            lastGestureMs    = now;
            gestureHoldCount = 0;
            flashGestureHint(currentGesture === 'one' ? '☝️' : '✌️');
        }
    }

    function flashGestureHint(symbol) {
        swipeHintEl.textContent = symbol;
        swipeHintEl.classList.add('visible');
        clearTimeout(gestureHintTimer);
        gestureHintTimer = setTimeout(() => swipeHintEl.classList.remove('visible'), 600);
    }

    // --- Physics loop (always running, acts only on flying words) ---
    function physicsLoop() {
        hCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);

        words.forEach(word => {
            const s = physics.get(word);
            if (!s.flying) return;

            s.vx *= AIR_FRICTION;
            s.vy  = s.vy * AIR_FRICTION + GRAVITY;
            s.x  += s.vx;
            s.y  += s.vy;

            const w = word.offsetWidth;
            const h = word.offsetHeight;

            // Wall bounces
            if (s.x < 0)                       { s.x = 0;                        s.vx =  Math.abs(s.vx) * BOUNCE; }
            if (s.x + w > window.innerWidth)    { s.x = window.innerWidth - w;   s.vx = -Math.abs(s.vx) * BOUNCE; }
            if (s.y < 0)                        { s.y = 0;                        s.vy =  Math.abs(s.vy) * BOUNCE; }
            if (s.y + h > window.innerHeight)   {
                s.y  = window.innerHeight - h;
                s.vy = -Math.abs(s.vy) * BOUNCE;
                s.vx *= FLOOR_FRICTION;

                // Come to rest
                if (Math.abs(s.vy) < 1.2) {
                    s.vy = 0;
                    if (Math.abs(s.vx) < 0.4) {
                        s.vx = 0;
                        s.flying = false;
                        setTimeout(() => restoreWord(word), 2500);
                        return;
                    }
                }
            }

            word.style.left = s.x + 'px';
            word.style.top  = s.y + 'px';
        });

        requestAnimationFrame(physicsLoop);
    }
    requestAnimationFrame(physicsLoop);

    // --- Restore word to original layout position ---
    function restoreWord(word) {
        const s = physics.get(word);
        if (s.grabbed) return; // grabbed again before restore

        word.classList.remove('wc-grabbed', 'wc-flying');
        // Restore original inline style (CSS custom properties)
        const orig = word.dataset.origStyle;
        if (orig !== undefined) {
            word.setAttribute('style', orig);
        }
        s.flying  = false;
        s.grabbed = false;
    }

    // --- Grab a word at screen position (x, y) ---
    function grabWord(word, x, y) {
        const s = physics.get(word);

        // Save original inline style once
        if (word.dataset.origStyle === undefined) {
            word.dataset.origStyle = word.getAttribute('style') || '';
        }

        const rect = word.getBoundingClientRect();
        word.dataset.grabOffsetX = x - rect.left;
        word.dataset.grabOffsetY = y - rect.top;

        s.x       = rect.left;
        s.y       = rect.top;
        s.vx      = 0;
        s.vy      = 0;
        s.grabbed = true;
        s.flying  = false;

        word.classList.add('wc-grabbed');
        word.classList.remove('wc-flying');

        // Override inline style for grabbed state
        word.style.cssText =
            word.dataset.origStyle +
            ';position:fixed;left:' + s.x + 'px;top:' + s.y + 'px' +
            ';animation:none;transform:scale(1.28) rotate(0deg);z-index:9500;transition:none';

        grabbedWord = word;
        prevPinchX  = x;
        prevPinchY  = y;
        pinchVelX   = 0;
        pinchVelY   = 0;
    }

    // --- Move grabbed word to (x, y) ---
    function moveGrabbedWord(x, y) {
        if (!grabbedWord) return;
        const s    = physics.get(grabbedWord);
        const offX = parseFloat(grabbedWord.dataset.grabOffsetX) || 0;
        const offY = parseFloat(grabbedWord.dataset.grabOffsetY) || 0;

        pinchVelX = x - prevPinchX;
        pinchVelY = y - prevPinchY;
        prevPinchX = x;
        prevPinchY = y;

        s.x = x - offX;
        s.y = y - offY;
        grabbedWord.style.left = s.x + 'px';
        grabbedWord.style.top  = s.y + 'px';
    }

    // --- Release word — apply throw velocity ---
    function releaseWord() {
        if (!grabbedWord) return;
        const word = grabbedWord;
        const s    = physics.get(word);

        s.vx      = pinchVelX * 1.6;
        s.vy      = pinchVelY * 1.6;
        s.grabbed = false;
        s.flying  = true;

        word.classList.remove('wc-grabbed');
        word.classList.add('wc-flying');

        // Apply a small random spin via inline style
        const spin = (Math.random() - 0.5) * 28;
        word.style.cssText =
            word.dataset.origStyle +
            ';position:fixed;left:' + s.x + 'px;top:' + s.y + 'px' +
            ';animation:none;transform:rotate(' + spin + 'deg);z-index:8990;transition:none;pointer-events:none';

        grabbedWord = null;
        pinchVelX   = 0;
        pinchVelY   = 0;
    }

    // --- Find word element at viewport position ---
    function wordAtPoint(x, y) {
        for (const word of words) {
            const r = word.getBoundingClientRect();
            if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return word;
        }
        return null;
    }

    // --- MediaPipe results callback ---
    let isPinching = false;

    function onHandResults(results) {
        if (!gestureActive) return;

        hCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);

        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            if (isPinching) { isPinching = false; releaseWord(); }
            return;
        }

        const lm    = results.multiHandLandmarks[0];
        const thumb = lm[4];   // thumb tip
        const index = lm[8];   // index finger tip

        // Draw skeleton
        drawHandSkeleton(lm);

        // Pinch distance (normalised)
        const dist        = Math.hypot(thumb.x - index.x, thumb.y - index.y);
        const pinchNow    = dist < PINCH_THRESHOLD;

        // Map to mirrored screen coords (x flipped for selfie-mirror feel)
        const midNX = (thumb.x + index.x) / 2;
        const midNY = (thumb.y + index.y) / 2;
        const sx    = (1 - midNX) * window.innerWidth;
        const sy    = midNY       * window.innerHeight;

        drawPinchIndicator(sx, sy, pinchNow, dist);

        if (pinchNow && !isPinching) {
            // Pinch start
            isPinching = true;
            const target = wordAtPoint(sx, sy);
            if (target) grabWord(target, sx, sy);
            prevPinchX = sx;
            prevPinchY = sy;

        } else if (pinchNow && isPinching) {
            // Pinch held — drag
            if (grabbedWord) moveGrabbedWord(sx, sy);

        } else if (!pinchNow && isPinching) {
            // Pinch released — throw
            isPinching = false;
            releaseWord();
        }

        // --- Finger-gesture scroll: ☝️(1자)=위 · ✌️(브이)=아래 ---
        detectFingerGesture(lm, pinchNow);

        // Draw index finger cursor when not pinching
        const indexSX = (1 - index.x) * window.innerWidth;
        const indexSY = index.y       * window.innerHeight;
        if (!pinchNow) {
            hCtx.beginPath();
            hCtx.arc(indexSX, indexSY, 14, 0, Math.PI * 2);
            hCtx.strokeStyle = 'rgba(255,255,255,0.35)';
            hCtx.lineWidth = 1.5;
            hCtx.stroke();
        }
    }

    // --- Draw hand skeleton on canvas ---
    const CONNECTIONS = [
        [0,1],[1,2],[2,3],[3,4],
        [0,5],[5,6],[6,7],[7,8],
        [0,9],[9,10],[10,11],[11,12],
        [0,13],[13,14],[14,15],[15,16],
        [0,17],[17,18],[18,19],[19,20],
        [5,9],[9,13],[13,17]
    ];

    function drawHandSkeleton(lm) {
        const W = handCanvas.width;
        const H = handCanvas.height;

        hCtx.strokeStyle = 'rgba(225, 6, 0, 0.55)';
        hCtx.lineWidth   = 2;
        CONNECTIONS.forEach(([a, b]) => {
            hCtx.beginPath();
            hCtx.moveTo((1 - lm[a].x) * W, lm[a].y * H);
            hCtx.lineTo((1 - lm[b].x) * W, lm[b].y * H);
            hCtx.stroke();
        });

        lm.forEach((pt, i) => {
            const x  = (1 - pt.x) * W;
            const y  = pt.y * H;
            const big = i === 4 || i === 8;
            hCtx.beginPath();
            hCtx.arc(x, y, big ? 8 : 4, 0, Math.PI * 2);
            hCtx.fillStyle = big ? '#ffd700' : 'rgba(255,255,255,0.7)';
            hCtx.fill();
        });
    }

    // --- Draw pinch indicator circle ---
    function drawPinchIndicator(x, y, active, dist) {
        const r = Math.max(12, dist * 280);
        hCtx.beginPath();
        hCtx.arc(x, y, r, 0, Math.PI * 2);
        hCtx.strokeStyle = active ? '#ffd700' : 'rgba(225,6,0,0.75)';
        hCtx.lineWidth   = active ? 3 : 2;
        hCtx.stroke();
        if (active) {
            hCtx.fillStyle = 'rgba(255,215,0,0.18)';
            hCtx.fill();
        }
    }

    // --- [Bug1] 공유 프레임 루프 ---
    async function processFrame() {
        if (!gestureActive) return;
        if (!processingFrame) {
            processingFrame = true;
            try { await handsInstance.send({ image: video }); } catch (_) {}
            processingFrame = false;
        }
        requestAnimationFrame(processFrame);
    }

    function startFrameLoop() {
        requestAnimationFrame(processFrame);
    }

    // --- [Bug2] 스트림 정지 / 재시작 ---
    function stopStream() {
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(t => t.stop());
            video.srcObject = null;
        }
    }

    async function restartStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            });
            video.srcObject = stream;
            await video.play();
        } catch (err) {
            setStatus('❌ 웹캠 접근 실패');
            gestureActive = false;
            toggleBtn.classList.remove('active');
            return;
        }
        setStatus('✋ 핀치=별명잡기 · ☝️=위스크롤 · ✌️=아래스크롤');
        startFrameLoop();
    }

    // --- Initialise MediaPipe Hands + getUserMedia ---
    async function initHandTracking() {
        setStatus('웹캠 권한 요청 중…');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            });
            video.srcObject = stream;
            await video.play();
        } catch (err) {
            setStatus('❌ 웹캠 접근 실패');
            toggleBtn.textContent = '❌ 웹캠 오류';
            gestureActive = false;
            toggleBtn.classList.remove('active');
            return;
        }

        if (typeof Hands === 'undefined') {
            setStatus('❌ MediaPipe 로드 실패');
            return;
        }

        setStatus('모델 로딩 중…');
        handsInstance = new Hands({
            locateFile: file =>
                'https://cdn.jsdelivr.net/npm/@mediapipe/hands/' + file
        });
        handsInstance.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5
        });
        handsInstance.onResults(onHandResults);

        // Warm-up send to trigger model download
        try { await handsInstance.send({ image: video }); } catch (_) {}

        mediapipeReady = true;
        setStatus('✋ 핀치=별명잡기 · ☝️=위스크롤 · ✌️=아래스크롤');
        startFrameLoop();
    }

    // --- Status text helper ---
    function setStatus(msg) {
        statusEl.textContent = msg;
    }

    // --- Toggle button click ---
    toggleBtn.addEventListener('click', async () => {
        gestureActive = !gestureActive;

        if (gestureActive) {
            toggleBtn.classList.add('active');
            toggleBtn.innerHTML = '<span class="gesture-icon">✋</span> 손 제스처 ON';
            handCanvas.style.display = 'block';
            video.style.display      = 'block';
            statusEl.style.display   = 'block';
            swipeHintEl.style.display = 'block';

            if (!mediapipeReady) {
                await initHandTracking();
            } else {
                // MediaPipe 이미 초기화됨 — 스트림만 재시작
                await restartStream();
            }
        } else {
            toggleBtn.classList.remove('active');
            toggleBtn.innerHTML = '<span class="gesture-icon">✋</span> 손 제스처';
            handCanvas.style.display  = 'none';
            video.style.display       = 'none';
            statusEl.style.display    = 'none';
            swipeHintEl.style.display = 'none';

            hCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);
            stopStream();   // 웹캠 LED 끄기

            // 제스처 상태 초기화
            gestureHoldCount = 0;
            currentGesture   = null;

            if (isPinching) { isPinching = false; releaseWord(); }
        }
    });

})();
