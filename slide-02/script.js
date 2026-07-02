/* Slide 02 : Plan / Roadmap */

document.addEventListener('DOMContentLoaded', () => {
    /* ── Rich Background (Slide 01 style) ── */
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
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
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
            speed: Math.random() * 0.3 + 0.1,
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

    /* ── Entrance Animations ── */
    const header    = document.querySelector('.plan__header');
    const cards     = document.querySelectorAll('.plan__card');
    const connector = document.querySelector('.plan__connector');
    const nav       = document.querySelector('.navigation');

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
        if (header) {
            setTimeout(() => {
                header.style.transition = 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)';
                header.style.opacity = '1';
                header.style.transform = 'translateY(0) scale(1)';
            }, 250);
        }

        if (connector) {
            setTimeout(() => {
                connector.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
                connector.style.opacity = '1';
                connector.style.transform = 'translateY(0) scale(1)';
            }, 500);
        }

        cards.forEach((card, idx) => {
            const delay = 600 + idx * 200;
            setTimeout(() => {
                card.style.transition = 'opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1), transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translate(0, 0) rotateX(0) rotateY(0) scale(1)';
            }, delay);
        });

        if (nav) {
            setTimeout(() => {
                nav.style.transition = 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)';
                nav.style.opacity = '1';
                nav.style.transform = 'translateY(0) scale(1)';
            }, 1600);
        }
    }

    /* Inject dot pulse keyframes */
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dotPulse {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.3); }
        }
    `;
    document.head.appendChild(style);
});
