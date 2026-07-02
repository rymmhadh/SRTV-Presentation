/* Section divider background */
document.addEventListener('DOMContentLoaded', () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
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

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 2 + 0.6,
        });
    }

    const style = getComputedStyle(document.body);
    const accent = style.getPropertyValue('--accent-start').trim() || '#0077cc';
    const rgba = (opacity) => {
        const rgb = accent.startsWith('#') ? accent.replace('#','') : '0077cc';
        const r = parseInt(rgb.substring(0,2), 16);
        const g = parseInt(rgb.substring(2,4), 16);
        const b = parseInt(rgb.substring(4,6), 16);
        return `rgba(${r},${g},${b},${opacity})`;
    };

    const shapeColors = [rgba(0.08), 'rgba(255,255,255,0.05)', rgba(0.06)];
    for (let i = 0; i < 7; i++) {
        shapes.push({
            x: Math.random() * w, y: Math.random() * h,
            size: Math.random() * 16 + 8,
            type: ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)],
            color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
            speed: Math.random() * 0.2 + 0.05,
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
        if (prefersReduced) return;
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
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = rgba(0.18); ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = rgba(0.06 * (1 - dist/MAX_DIST));
                    ctx.lineWidth = 1; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
});
