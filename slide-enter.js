/* ═══════════════════════════════════════════════════════════
   SRTV – Shared Slide Entrance & Parallax
   Included in every slide BEFORE nav.js / transition.js
   ═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Utility: smoothly reveal an element after `delay` ms ── */
    function reveal(el, delay, duration, easing) {
        if (!el) return;
        duration = duration || 800;
        easing   = easing   || 'cubic-bezier(0.22,1,0.36,1)';
        setTimeout(function () {
            el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
            el.style.opacity    = '1';
            el.style.transform  = 'none';
        }, delay);
    }

    /* ── Mouse-parallax on ambient orbs ── */
    function initOrbParallax() {
        if (prefersReduced) return;
        const orbs = document.querySelectorAll('.ambient-orb');
        if (!orbs.length) return;
        let raf = null;
        let targetX = 0, targetY = 0, curX = 0, curY = 0;

        document.addEventListener('mousemove', function (e) {
            targetX = (e.clientX / window.innerWidth  - 0.5) * 30;
            targetY = (e.clientY / window.innerHeight - 0.5) * 20;
        });

        function loop() {
            curX += (targetX - curX) * 0.06;
            curY += (targetY - curY) * 0.06;
            orbs.forEach(function (orb, i) {
                const factor = 1 + i * 0.4;
                orb.style.transform = `translate(${curX * factor}px, ${curY * factor}px)`;
            });
            raf = requestAnimationFrame(loop);
        }
        loop();

        document.addEventListener('mouseleave', function () {
            targetX = 0; targetY = 0;
        });
    }

    /* ── Standard entrance sequence ── */
    function runEntrance() {
        if (prefersReduced) {
            /* Immediately show everything */
            document.querySelectorAll('[data-sr]').forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        /* Header elements */
        reveal(document.querySelector('.slide__eyebrow'),  200, 600, 'ease');
        reveal(document.querySelector('.slide__header'),   250, 900);
        reveal(document.querySelector('.slide__title'),    400, 900);
        reveal(document.querySelector('.slide__subtitle'), 650, 700, 'ease');

        /* Cover-specific */
        reveal(document.querySelector('.cover__header'),   200, 800);
        reveal(document.querySelector('.cover__main'),     500, 1000);
        reveal(document.querySelector('.cover__footer'),   900, 800, 'ease');

        /* Plan slide */
        reveal(document.querySelector('.plan__header'),    200, 900);
        reveal(document.querySelector('.plan__connector'), 500, 600, 'ease');
        const planCards = document.querySelectorAll('.plan__card');
        planCards.forEach(function (el, i) { reveal(el, 600 + i * 80, 600); });

        /* Section divider */
        reveal(document.querySelector('.section__label'),  200, 700, 'ease');
        reveal(document.querySelector('.section__title'),  400, 900);
        reveal(document.querySelector('.section__subtitle'), 700, 700, 'ease');

        /* Generic content areas */
        ['content-wrapper','content-split','content-grid',
         'needs-table','scrum-visual','diagram-panel',
         'advantages-panel','uc-section','roadmap',
         'arch-panel','gallery__panel','interface-showcase',
         'cicd-panel','releases'].forEach(function (cls) {
            reveal(document.querySelector('.' + cls), 900, 800);
        });

        /* Data-delay children (staggered) */
        document.querySelectorAll('[data-delay]').forEach(function (el) {
            const d = parseInt(el.getAttribute('data-delay'), 10) || 0;
            reveal(el, 700 + d * 150, 650);
        });

        /* Navigation pill */
        reveal(document.querySelector('.navigation'), 1800, 700, 'ease');
    }

    /* ── Init ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initOrbParallax();
            runEntrance();
        });
    } else {
        initOrbParallax();
        runEntrance();
    }
})();
