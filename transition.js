/* ── Cinematic Slide Transition ── */
(function () {
    'use strict';

    /* ── Exit Veil ── */
    const veil = document.createElement('div');
    veil.id = 'srtv-veil';
    veil.style.cssText = [
        'position:fixed;inset:0;z-index:9998;pointer-events:none;',
        'background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);',
        'transform:translateX(100%);',
        'transition:transform 0.55s cubic-bezier(0.76,0,0.24,1);',
        'will-change:transform;'
    ].join('');
    document.body.appendChild(veil);

    /* ── Sweep Line ── */
    const sweep = document.createElement('div');
    sweep.id = 'srtv-sweep';
    sweep.style.cssText = [
        'position:fixed;top:0;bottom:0;width:3px;z-index:9999;pointer-events:none;',
        'background:linear-gradient(180deg,#0077cc,#6366f1,#10b981);',
        'box-shadow:0 0 18px rgba(0,119,204,0.8),0 0 40px rgba(99,102,241,0.5);',
        'opacity:0;transition:opacity 0.1s;'
    ].join('');
    document.body.appendChild(sweep);

    /* ── EXIT: called before navigating away ── */
    window.__playTransition = function (url, direction) {
        if (document.body.classList.contains('srtv-leaving')) return;
        document.body.classList.add('srtv-leaving');

        const dir = direction === 'back' ? -1 : 1;
        try { sessionStorage.setItem('srtv-dir', dir > 0 ? 'forward' : 'back'); } catch(e) {}

        /* Slide veil in from the appropriate side */
        veil.style.transition = 'transform 0.55s cubic-bezier(0.76,0,0.24,1)';
        veil.style.transform = dir > 0 ? 'translateX(0)' : 'translateX(0)';
        if (dir < 0) veil.style.transform = 'translateX(-100%)';
        /* Reset to correct starting side then animate in */
        veil.style.transform = dir > 0 ? 'translateX(100%)' : 'translateX(-100%)';
        void veil.offsetWidth; /* reflow */
        veil.style.transform = 'translateX(0)';

        /* Animate sweep line */
        sweep.style.left = dir > 0 ? 'auto' : '0';
        sweep.style.right = dir > 0 ? '0' : 'auto';
        sweep.style.opacity = '1';
        sweep.style.transition = `left 0.55s cubic-bezier(0.76,0,0.24,1), right 0.55s cubic-bezier(0.76,0,0.24,1), opacity 0.1s`;

        /* Dim + shrink existing content */
        document.body.style.transition = 'transform 0.45s cubic-bezier(0.4,0,1,1), filter 0.45s ease';
        document.body.style.transform = `scale(0.93) translateX(${dir * -30}px)`;
        document.body.style.filter = 'blur(6px) brightness(0.4)';

        setTimeout(function () {
            window.location.href = url;
        }, 520);
    };

    /* ── ENTER: run when new page loads ── */
    function doEnter() {
        let dir = 'forward';
        try { dir = sessionStorage.getItem('srtv-dir') || 'forward'; sessionStorage.removeItem('srtv-dir'); } catch(e) {}

        const isForward = dir !== 'back';

        /* Place veil covering the screen on the entry side, then lift it */
        veil.style.transition = 'none';
        veil.style.transform = 'translateX(0)';
        void veil.offsetWidth;

        /* Lift veil off to the opposite side */
        veil.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1)';
        veil.style.transform = isForward ? 'translateX(-100%)' : 'translateX(100%)';

        /* Sweep line entering */
        sweep.style.left = isForward ? '0' : 'auto';
        sweep.style.right = isForward ? 'auto' : '0';
        sweep.style.opacity = '1';
        setTimeout(function () {
            sweep.style.transition = 'opacity 0.4s ease';
            sweep.style.opacity = '0';
        }, 550);

        /* Ensure body is clean */
        document.body.style.transform = '';
        document.body.style.filter = '';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doEnter);
    } else {
        doEnter();
    }
})();
