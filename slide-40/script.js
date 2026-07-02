/* Slide : Lina en action — Briefing proactif — generic content-grid entrance */
document.addEventListener('DOMContentLoaded', () => {

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, tick = 0;
    let mouse = { x: null, y: null };
    const particles = [];
    const orbs = [];
    const PARTICLE_COUNT = 50;
    const LINK_DIST = 180;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * w, y: Math.random() * h,
            originX: Math.random() * w, originY: Math.random() * h,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.008 + 0.003,
            amp: Math.random() * 20 + 10,
            r: Math.random() * 1.8 + 0.6,
        });
    }

    const orbColors = [
        { r: 16, g: 185, b: 129 }, { r: 0, g: 119, b: 204 },
        { r: 99, g: 102, b: 241 }, { r: 139, g: 92, b: 246 },
    ];
    for (let i = 0; i < 5; i++) {
        const c = orbColors[i % orbColors.length];
        orbs.push({
            x: Math.random() * w, y: Math.random() * h,
            radius: Math.random() * 180 + 120, color: c,
            phaseX: Math.random() * Math.PI * 2, phaseY: Math.random() * Math.PI * 2,
            speedX: Math.random() * 0.0008 + 0.0003, speedY: Math.random() * 0.0006 + 0.0002,
            ampX: Math.random() * 60 + 40, ampY: Math.random() * 60 + 40,
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
        ctx.fillStyle = 'rgba(248, 250, 252, 0.18)';
        ctx.fillRect(0, 0, w, h);
        for (const o of orbs) drawOrb(o, t);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const targetX = p.originX + Math.sin(t * p.speed + p.phase) * p.amp;
            const targetY = p.originY + Math.cos(t * p.speed * 0.7 + p.phase) * p.amp;
            p.x += (targetX - p.x) * 0.012;
            p.y += (targetY - p.y) * 0.012;
            if (mouse.x !== null) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 220 && dist > 1) {
                    const force = (220 - dist) / 220 * 0.015;
                    p.x += (dx / dist) * force * 60;
                    p.y += (dy / dist) * force * 60;
                }
            }
            if (p.x < -40) { p.originX += w + 80; p.x += w + 80; }
            if (p.x > w + 40) { p.originX -= w + 80; p.x -= w + 80; }
            if (p.y < -40) { p.originY += h + 80; p.y += h + 80; }
            if (p.y > h + 40) { p.originY -= h + 80; p.y -= h + 80; }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r + 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, 0.06)`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, 0.14)`;
            ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x, dy = p.y - q.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < LINK_DIST * LINK_DIST) {
                    const dist = Math.sqrt(distSq);
                    const alpha = 0.035 * (1 - dist / LINK_DIST);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    if (prefersReduced) return;

    const header    = document.querySelector('.slide__header');
    const title     = document.querySelector('.slide__title');
    const subtitle  = document.querySelector('.slide__subtitle');
    const modLabel  = document.querySelector('.modules__label');
    const modCards  = document.querySelectorAll('.module__card');
    const nav       = document.querySelector('.navigation');

    const setTransition = (el, props, delay) => {
        if (!el) return;
        setTimeout(() => {
            el.style.transition = props;
            el.style.opacity = '1';
            el.style.transform = 'none';
        }, delay);
    };

    setTransition(header, 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)', 150);
    setTransition(title, 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)', 400);
    setTransition(subtitle, 'opacity 0.7s ease, transform 0.7s ease', 700);
    setTransition(modLabel, 'opacity 0.6s ease, transform 0.6s ease', 1000);
    modCards.forEach((card, i) => {
        setTransition(card, 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)', 1100 + i * 120);
    });
    setTransition(nav, 'opacity 0.8s ease, transform 0.8s ease', 1800);
});
