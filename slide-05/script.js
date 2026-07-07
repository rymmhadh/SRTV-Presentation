/* Slide 04 : Introduction au projet SRTV */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ═══════════════════════════════════════════════════════════
       SMOOTH BACKGROUND
       ═══════════════════════════════════════════════════════════ */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, tick = 0;
    let mouse = { x: null, y: null };
    const particles = [];
    const orbs = [];
    const PARTICLE_COUNT = 55;
    const LINK_DIST = 180;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    // Soft floating particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            originX: Math.random() * w,
            originY: Math.random() * h,
            vx: 0,
            vy: 0,
            r: Math.random() * 1.8 + 0.6,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.008 + 0.003,
            amp: Math.random() * 20 + 10,
        });
    }

    // Large soft orbs drifting in background
    const orbColors = [
        { r: 0, g: 119, b: 204 },
        { r: 99, g: 102, b: 241 },
        { r: 16, g: 185, b: 129 },
        { r: 139, g: 92, b: 246 },
    ];
    for (let i = 0; i < 5; i++) {
        const c = orbColors[i % orbColors.length];
        orbs.push({
            x: Math.random() * w,
            y: Math.random() * h,
            radius: Math.random() * 180 + 120,
            color: c,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            speedX: Math.random() * 0.0008 + 0.0003,
            speedY: Math.random() * 0.0006 + 0.0002,
            ampX: Math.random() * 60 + 40,
            ampY: Math.random() * 60 + 40,
        });
    }

    function drawOrb(o, t) {
        const ox = o.x + Math.sin(t * o.speedX + o.phaseX) * o.ampX;
        const oy = o.y + Math.cos(t * o.speedY + o.phaseY) * o.ampY;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.radius);
        g.addColorStop(0, `rgba(${o.color.r},${o.color.g},${o.color.b},0.045)`);
        g.addColorStop(0.5, `rgba(${o.color.r},${o.color.g},${o.color.b},0.015)`);
        g.addColorStop(1, `rgba(${o.color.r},${o.color.g},${o.color.b},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, o.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        tick++;
        const t = tick;

        // Very soft clear : creates subtle motion blur trail
        ctx.fillStyle = 'rgba(248, 250, 252, 0.18)';
        ctx.fillRect(0, 0, w, h);

        // Draw soft orbs first (behind everything)
        for (const o of orbs) drawOrb(o, t);

        // Update & draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Gentle sine-wave drift around origin
            const targetX = p.originX + Math.sin(t * p.speed + p.phase) * p.amp;
            const targetY = p.originY + Math.cos(t * p.speed * 0.7 + p.phase) * p.amp;

            // Smooth lerp toward target
            p.x += (targetX - p.x) * 0.012;
            p.y += (targetY - p.y) * 0.012;

            // Gentle mouse repulsion
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 220 && dist > 1) {
                    const force = (220 - dist) / 220 * 0.015;
                    p.x += (dx / dist) * force * 60;
                    p.y += (dy / dist) * force * 60;
                }
            }

            // Wrap around edges softly
            if (p.x < -40) { p.originX += w + 80; p.x += w + 80; }
            if (p.x > w + 40) { p.originX -= w + 80; p.x -= w + 80; }
            if (p.y < -40) { p.originY += h + 80; p.y += h + 80; }
            if (p.y > h + 40) { p.originY -= h + 80; p.y -= h + 80; }

            // Draw particle with soft glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r + 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 119, 204, ${0.06})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 119, 204, ${0.14})`;
            ctx.fill();

            // Links : only to nearby particles, very soft
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < LINK_DIST * LINK_DIST) {
                    const dist = Math.sqrt(distSq);
                    const alpha = 0.035 * (1 - dist / LINK_DIST);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(0, 119, 204, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }
    animate();

    /* ═══════════════════════════════════════════════════════════
       GALLERY
       ═══════════════════════════════════════════════════════════ */
    const gallery      = document.getElementById('gallery');
    const galleryImgs  = gallery.querySelectorAll('.gallery__img');
    const dotsEl       = document.getElementById('gallery-dots');
    const dots         = dotsEl ? dotsEl.querySelectorAll('.gallery__dot') : [];
    const btnPrev      = document.getElementById('gallery-prev');
    const btnNext      = document.getElementById('gallery-next');
    const btnClose     = document.getElementById('gallery-close');
    const TOTAL_IMGS   = galleryImgs.length;

    let galleryActive = false;
    let currentIndex  = 0;

    function updateGalleryUI() {
        galleryImgs.forEach((img, i) => {
            img.classList.remove('is-active', 'is-exit');
            if (i === currentIndex) {
                img.classList.add('is-active');
            } else if (i < currentIndex) {
                img.classList.add('is-exit');
            }
        });
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));
        btnPrev.classList.toggle('is-disabled', currentIndex === 0);
        btnNext.classList.toggle('is-disabled', currentIndex === TOTAL_IMGS - 1);
        syncLinaWithGallery();
    }

    function openGallery() {
        galleryActive = true;
        currentIndex = 0;
        gallery.classList.add('is-active');
        updateGalleryUI();
    }

    function closeGallery() {
        galleryActive = false;
        gallery.classList.remove('is-active');
        // Reset images for next open
        setTimeout(() => {
            galleryImgs.forEach(img => img.classList.remove('is-active', 'is-exit'));
        }, 500);
    }

    function nextImage() {
        if (currentIndex < TOTAL_IMGS - 1) {
            currentIndex++;
            updateGalleryUI();
            return true; // handled
        }
        return false; // at last image, let nav handle it
    }

    function prevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            updateGalleryUI();
            return true; // handled
        }
        closeGallery();
        return true; // handled (closed gallery instead of going to prev slide)
    }

    // Dot click: jump to image
    dots.forEach((dot, i) => dot.addEventListener('click', () => { currentIndex = i; updateGalleryUI(); }));

    // Click handlers
    btnClose.addEventListener('click', closeGallery);
    btnNext.addEventListener('click', () => nextImage());
    btnPrev.addEventListener('click', () => prevImage());
    gallery.querySelector('.gallery__backdrop').addEventListener('click', closeGallery);

    // Hook for nav.js click navigation
    window.__galleryHandleClick = function () {
        if (!galleryActive) {
            openGallery();
            return true; // handled
        }
        if (nextImage()) {
            return true; // advanced image
        }
        closeGallery();
        return false; // at end — let nav.js go to next slide
    };

    /* ═══════════════════════════════════════════════════════════
       LINA AUDIO NARRATION (synchronized with gallery images)
       ═══════════════════════════════════════════════════════════ */
    const LINA_TRACKS = [
        '../LINA/Slide1.mp3',
        '../LINA/Slide2.mp3',
        '../LINA/Slide3.mp3',
    ];

    let linaAudio = null;

    function stopLina() {
        if (linaAudio) {
            linaAudio.pause();
            linaAudio.onended = null;
            linaAudio = null;
        }
    }

    function playLinaTrack(trackIndex) {
        stopLina();
        if (trackIndex < 0 || trackIndex >= LINA_TRACKS.length) return;
        linaAudio = new Audio(LINA_TRACKS[trackIndex]);
        linaAudio.volume = 1;
        linaAudio.play().catch(() => {}); // ignore autoplay block
    }

    // Narration Lina désactivée : plus aucune voix ne se joue dans la galerie
    function syncLinaWithGallery() {
        stopLina();
    }

    // Stop audio if gallery is manually closed
    btnClose.addEventListener('click', stopLina);
    gallery.querySelector('.gallery__backdrop').addEventListener('click', stopLina);

    /* ═══════════════════════════════════════════════════════════
       KEYBOARD INTERCEPT (capture phase : before nav.js)
       ═══════════════════════════════════════════════════════════ */
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Right arrow / Down / Space
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            if (!galleryActive) {
                // Not in gallery: open it instead of changing slide
                e.preventDefault();
                e.stopImmediatePropagation();
                openGallery();
                return;
            }
            // In gallery: try next image; if at end, let nav.js take over
            if (nextImage()) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            // If nextImage() returned false (at end), do nothing => nav.js will navigate to next slide
        }

        // Left arrow / Up
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (galleryActive) {
                e.preventDefault();
                e.stopImmediatePropagation();
                prevImage();
            }
            // If gallery not active, let nav.js go to previous slide
        }

        // Escape: close gallery
        if (e.key === 'Escape') {
            if (galleryActive) {
                e.preventDefault();
                e.stopImmediatePropagation();
                closeGallery();
            }
        }
    }, true); // capture phase

    /* ═══════════════════════════════════════════════════════════
       ENTRANCE SEQUENCE
       ═══════════════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════════════
       ANIMATED STAT COUNTERS
       ═══════════════════════════════════════════════════════════ */
    function animateCounter(el, duration = 1400) {
        const target = parseFloat(el.dataset.target || '0');
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    if (prefersReduced) {
        document.querySelectorAll('[data-count]').forEach((el) => {
            el.textContent = (el.dataset.target || '0') + (el.dataset.suffix || '');
        });
        return;
    }

    const header    = document.querySelector('.slide__header');
    const title     = document.querySelector('.slide__title');
    const subtitle  = document.querySelector('.slide__subtitle');
    const statStrip = document.querySelector('.stat-strip');
    const nav       = document.querySelector('.navigation');

    const setTransition = (el, props, delay) => {
        setTimeout(() => {
            el.style.transition = props;
            el.style.opacity = '1';
            el.style.transform = 'none';
        }, delay);
    };

    // 1. Header
    setTransition(header,
        'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)', 150);

    // 2. Title
    setTransition(title,
        'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)', 400);

    // 3. Subtitle
    setTransition(subtitle,
        'opacity 0.7s ease, transform 0.7s ease', 700);

    // 4. Stat strip + counters
    if (statStrip) {
        setTransition(statStrip, 'opacity 0.7s ease, transform 0.7s ease', 950);
        setTimeout(() => {
            statStrip.querySelectorAll('[data-count]').forEach((el) => animateCounter(el));
        }, 1000);
    }

    // 5. Footer
    setTransition(nav,
        'opacity 0.8s ease, transform 0.8s ease', 1200);
});
