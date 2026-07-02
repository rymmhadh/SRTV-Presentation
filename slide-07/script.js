/* Slide 04 : Étude de l'existant */

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
    const PARTICLE_COUNT = 70;
    const MAX_DIST = 150;

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
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            r: Math.random() * 2 + 0.6,
        });
    }

    const shapeColors = ['rgba(0,119,204,0.05)', 'rgba(99,102,241,0.04)', 'rgba(16,185,129,0.04)'];
    for (let i = 0; i < 6; i++) {
        shapes.push({
            x: Math.random() * w, y: Math.random() * h,
            size: Math.random() * 16 + 8,
            type: ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)],
            color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
            speed: Math.random() * 0.12 + 0.04,
            angle: Math.random() * Math.PI * 2,
        });
    }

    function drawShape(s) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        if (s.type === 'circle') ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        else if (s.type === 'triangle') { ctx.moveTo(0,-s.size); ctx.lineTo(s.size,s.size); ctx.lineTo(-s.size,s.size); ctx.closePath(); }
        else ctx.rect(-s.size/2, -s.size/2, s.size, s.size);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        for (const s of shapes) {
            s.x += Math.cos(s.angle) * s.speed; s.y += Math.sin(s.angle) * s.speed;
            if (s.x < -50) s.x = w + 50; if (s.x > w + 50) s.x = -50;
            if (s.y < -50) s.y = h + 50; if (s.y > h + 50) s.y = -50;
            drawShape(s);
        }
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            if (mouse.x !== null) {
                const dx = mouse.x - p.x, dy = mouse.y - p.y;
                if (Math.sqrt(dx*dx + dy*dy) < 180) { p.x += dx * 0.0015; p.y += dy * 0.0015; }
            }
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,119,204,0.18)'; ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(0,119,204,${0.06 * (1 - dist/MAX_DIST)})`;
                    ctx.lineWidth = 1; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    /* ═══════════════════════════════════════════════════════════
       ENTRANCE
       ═══════════════════════════════════════════════════════════ */
    if (prefersReduced) return;

    const setT = (el, props, delay) => {
        setTimeout(() => {
            el.style.transition = props;
            el.style.opacity = '1';
            el.style.transform = 'none';
        }, delay);
    };

    setT(document.querySelector('.slide__header'),
        'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)', 200);
    setT(document.querySelector('.slide__title'),
        'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)', 500);
    setT(document.querySelector('.slide__subtitle'),
        'opacity 0.7s ease, transform 0.7s ease', 800);

    document.querySelectorAll('.row--top .plat').forEach((c, i) => {
        setT(c, 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)', 1000 + i * 150);
    });

    document.querySelectorAll('.row--bottom .plat').forEach((c, i) => {
        setT(c, 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)', 1500 + i * 120);
    });

    setT(document.querySelector('.gap-card'),
        'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)', 1700);

    setT(document.querySelector('.navigation'),
        'opacity 0.8s ease, transform 0.8s ease', 2300);
});
