/* Slide 09 : Diagramme de cas d'utilisation global */

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
            if (s.y > h + 50) s.y = -50;
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
       ENTRANCE SEQUENCE
       ═══════════════════════════════════════════════════════════ */
    if (prefersReduced) return;

    const header    = document.querySelector('.slide__header');
    const title     = document.querySelector('.slide__title');
    const subtitle  = document.querySelector('.slide__subtitle');
    const ucSection = document.querySelector('.uc-section');
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
        'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)', 500);

    // 3. Subtitle
    setTransition(subtitle,
        'opacity 0.7s ease, transform 0.7s ease', 750);

    // 4. Use Case Diagram
    setTransition(ucSection,
        'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)', 1000);

    // 5. Footer
    setTransition(nav,
        'opacity 0.8s ease, transform 0.8s ease', 1800);

    /* ═══════════════════════════════════════════════════════════
       ZOOM & PAN
       ═══════════════════════════════════════════════════════════ */
    const zoomWrapper = document.getElementById('zoomWrapper');
    const container   = document.querySelector('.uc-container');
    let scale = 1;
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    // Wheel zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        scale = Math.max(1, Math.min(4, scale + delta));
        zoomWrapper.style.transform = `scale(${scale})`;
        zoomWrapper.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
    }, { passive: false });

    // Click to toggle zoom
    container.addEventListener('click', (e) => {
        if (isDragging) return;
        if (scale === 1) {
            scale = 2.2;
            zoomWrapper.style.transform = `scale(${scale})`;
            zoomWrapper.style.cursor = 'grab';
        } else {
            scale = 1;
            zoomWrapper.style.transform = `scale(${scale})`;
            zoomWrapper.style.cursor = 'zoom-in';
            // Reset scroll when zooming out
            container.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
    });

    // Pan (drag to scroll)
    container.addEventListener('mousedown', (e) => {
        if (scale <= 1) return;
        isDragging = false;
        startX = e.pageX - container.offsetLeft;
        startY = e.pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        scrollTop  = container.scrollTop;
        zoomWrapper.classList.add('panning');
    });

    container.addEventListener('mousemove', (e) => {
        if (!zoomWrapper.classList.contains('panning')) return;
        e.preventDefault();
        isDragging = true;
        const x = e.pageX - container.offsetLeft;
        const y = e.pageY - container.offsetTop;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;
        container.scrollLeft = scrollLeft - walkX;
        container.scrollTop  = scrollTop  - walkY;
    });

    container.addEventListener('mouseup', () => {
        zoomWrapper.classList.remove('panning');
        setTimeout(() => { isDragging = false; }, 50);
    });

    container.addEventListener('mouseleave', () => {
        zoomWrapper.classList.remove('panning');
    });
});
