/* Slide 35 : Orchestration d'agents n8n */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ═══════════════════════════════════════════════════════════
       RICH BACKGROUND
       ═══════════════════════════════════════════════════════════ */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, mouse = { x: null, y: null };
    const particles = [];
    const shapes = [];
    const PARTICLE_COUNT = 80;
    const MAX_DIST = 160;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            r: Math.random() * 2.2 + 0.8,
        });
    }

    const shapeColors = ['rgba(0,119,204,0.06)', 'rgba(99,102,241,0.05)', 'rgba(139,92,246,0.05)', 'rgba(6,182,212,0.05)'];
    for (let i = 0; i < 8; i++) {
        shapes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 18 + 10,
            type: ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)],
            color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
            speed: Math.random() * 0.15 + 0.05,
            angle: Math.random() * Math.PI * 2,
        });
    }

    function drawShape(s) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        if (s.type === 'circle') {
            ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        } else if (s.type === 'triangle') {
            ctx.moveTo(0, -s.size);
            ctx.lineTo(s.size, s.size);
            ctx.lineTo(-s.size, s.size);
            ctx.closePath();
        } else {
            ctx.rect(-s.size / 2, -s.size / 2, s.size, s.size);
        }
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
        grad.addColorStop(0, 'rgba(240,245,255,0.4)');
        grad.addColorStop(0.5, 'rgba(248,250,252,0.2)');
        grad.addColorStop(1, 'rgba(248,250,252,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        for (const s of shapes) {
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            if (s.x < -50) s.x = w + 50;
            if (s.x > w + 50) s.x = -50;
            if (s.y < -50) s.y = h + 50;
            if (s.y > w + 50) s.y = -50;
            drawShape(s);
        }

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            if (mouse.x !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    p.x += dx * 0.002;
                    p.y += dy * 0.002;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 119, 204, 0.2)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(0, 119, 204, ${0.07 * (1 - dist / MAX_DIST)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    /* ═══════════════════════════════════════════════════════════
       GALLERY (6 workflows)
       ═══════════════════════════════════════════════════════════ */
    const gallery      = document.getElementById('gallery');
    const galleryImgs  = gallery.querySelectorAll('.gallery__img');
    const counterEl    = document.getElementById('gallery-counter');
    const progressEl   = document.getElementById('gallery-progress');
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
        counterEl.textContent = `${currentIndex + 1} / ${TOTAL_IMGS}`;
        progressEl.style.width = `${((currentIndex + 1) / TOTAL_IMGS) * 100}%`;
        btnPrev.classList.toggle('is-disabled', currentIndex === 0);
        btnNext.classList.toggle('is-disabled', currentIndex === TOTAL_IMGS - 1);
    }

    function openGalleryAt(i) {
        galleryActive = true;
        currentIndex = i || 0;
        gallery.classList.add('is-active');
        updateGalleryUI();
    }

    function closeGallery() {
        galleryActive = false;
        gallery.classList.remove('is-active');
        setTimeout(() => {
            galleryImgs.forEach(img => img.classList.remove('is-active', 'is-exit'));
        }, 500);
    }

    function nextImage() {
        if (currentIndex < TOTAL_IMGS - 1) {
            currentIndex++;
            updateGalleryUI();
            return true;
        }
        return false;
    }

    function prevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            updateGalleryUI();
            return true;
        }
        closeGallery();
        return true;
    }

    btnClose.addEventListener('click', closeGallery);
    btnNext.addEventListener('click', () => nextImage());
    btnPrev.addEventListener('click', () => prevImage());
    gallery.querySelector('.gallery__backdrop').addEventListener('click', closeGallery);

    // Hook pour nav.js (clic gauche/droit)
    window.__galleryHandleClick = function () {
        if (!galleryActive) { openGalleryAt(0); return true; }
        if (nextImage()) { return true; }
        closeGallery(); return false;
    };

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            if (!galleryActive) {
                e.preventDefault();
                e.stopImmediatePropagation();
                openGalleryAt(0);
                return;
            }
            if (nextImage()) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (galleryActive) {
                e.preventDefault();
                e.stopImmediatePropagation();
                prevImage();
            }
        }

        if (e.key === 'Escape') {
            if (galleryActive) {
                e.preventDefault();
                e.stopImmediatePropagation();
                closeGallery();
            }
        }
    }, true);

    /* Cliquer sur une carte ouvre la galerie a la bonne image */
    document.querySelectorAll('.wf-card').forEach((card, i) => {
        card.addEventListener('click', () => openGalleryAt(i));
    });

    /* ═══════════════════════════════════════════════════════════
       ENTRANCE SEQUENCE
       ═══════════════════════════════════════════════════════════ */
    if (prefersReduced) return;

    const header  = document.querySelector('.slide__header');
    const title   = document.querySelector('.slide__title');
    const subtitle = document.querySelector('.slide__subtitle');
    const cards   = document.querySelectorAll('.wf-card');
    const nav     = document.querySelector('.navigation');

    const setTransition = (el, props, delay) => {
        if (!el) return;
        setTimeout(() => {
            el.style.transition = props;
            el.style.opacity = '1';
            el.style.transform = 'none';
        }, delay);
    };

    setTransition(header,
        'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)', 150);

    setTransition(title,
        'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)', 400);

    setTransition(subtitle,
        'opacity 0.6s ease, transform 0.6s ease', 650);

    cards.forEach((card, i) => {
        setTransition(card,
            'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)', 850 + i * 130);
    });

    setTransition(nav,
        'opacity 0.8s ease, transform 0.8s ease', 1900);
});
