/* Slide 22 : CI/CD Pipeline SRTV */

document.addEventListener('DOMContentLoaded', function () {

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ═══════════════════════════════════════════════════════════
       JENKINS OVERLAY – step system
       First → : show overlay
       Second → : navigate to next slide
       ═══════════════════════════════════════════════════════════ */
    const overlay   = document.getElementById('jenkins-overlay');
    const thumb     = document.getElementById('jenkins-thumb');
    const closeBtn  = document.getElementById('jenkins-close');
    let   overlayOpen = false;

    function openOverlay() {
        overlayOpen = true;
        overlay.classList.add('is-open');
    }
    function closeOverlay() {
        overlayOpen = false;
        overlay.classList.remove('is-open');
    }

    thumb.addEventListener('click', openOverlay);
    closeBtn.addEventListener('click', closeOverlay);
    overlay.querySelector('.jenkins-overlay__backdrop').addEventListener('click', closeOverlay);

    /* Intercept nav.js keyboard BEFORE it handles it */
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'Escape' && overlayOpen) {
            e.preventDefault();
            e.stopImmediatePropagation();
            closeOverlay();
            return;
        }

        /* Right/Space/Down: first press opens overlay, second press navigates */
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            if (!overlayOpen) {
                e.preventDefault();
                e.stopImmediatePropagation();
                openOverlay();
                return;
            }
            /* overlay is open → let nav.js handle next navigation */
            closeOverlay();
            /* fall through to nav.js */
        }

        /* Left/Up: close overlay if open, otherwise nav.js handles it */
        if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && overlayOpen) {
            e.preventDefault();
            e.stopImmediatePropagation();
            closeOverlay();
        }
    }, true); /* capture phase – fires before nav.js listener */

    /* ═══════════════════════════════════════════════════════════
       ENTRANCE SEQUENCE
       ═══════════════════════════════════════════════════════════ */
    if (prefersReduced) {
        document.querySelectorAll(
            '.slide__header,.slide__eyebrow,.slide__title,.slide__subtitle,' +
            '.pipeline,.lane-label,.pipe-row,.pipe-node,.pipe-arrow,' +
            '.connector-vps,.jenkins-thumb,.navigation'
        ).forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    function reveal(el, delay, dur, ease) {
        if (!el) return;
        dur  = dur  || 650;
        ease = ease || 'cubic-bezier(0.22,1,0.36,1)';
        setTimeout(function () {
            el.style.transition = 'opacity ' + dur + 'ms ' + ease + ', transform ' + dur + 'ms ' + ease;
            el.style.opacity    = '1';
            el.style.transform  = 'none';
        }, delay);
    }

    var rows  = document.querySelectorAll('.pipe-row');
    var vpsConnector = document.querySelector('.connector-vps');
    var lanes = document.querySelectorAll('.lane-label');

    /* Header */
    reveal(document.querySelector('.slide__header'),   120, 700);
    reveal(document.querySelector('.slide__eyebrow'),  200, 500, 'ease');
    reveal(document.querySelector('.slide__title'),    320, 750);
    reveal(document.querySelector('.slide__subtitle'), 500, 550, 'ease');

    /* Pipeline wrapper */
    reveal(document.querySelector('.pipeline'), 600, 500, 'ease');

    /* CI lane label */
    reveal(lanes[0], 700, 500, 'ease');

    /* Row 1: nodes left-to-right, arrows between */
    reveal(rows[0], 780, 500, 'ease');
    var ciNodes  = rows[0] ? rows[0].querySelectorAll('.pipe-node')  : [];
    var ciArrows = rows[0] ? rows[0].querySelectorAll('.pipe-arrow') : [];
    ciNodes.forEach(function (n, i)  { reveal(n, 860 + i * 100, 520); });
    ciArrows.forEach(function (a, i) {
        var delay = 920 + i * 100;
        reveal(a, delay, 380, 'ease');
        setTimeout(function () {
            a.classList.add('is-animated');
            var dot = a.querySelector('.dot');
            if (dot) dot.style.animationDelay = (i * 0.4) + 's';
        }, delay + 400);
    });

    /* Central VPS connector (Hub → VPS → Pull) */
    reveal(vpsConnector, 1480, 550, 'ease');

    /* VPS row */
    reveal(rows[1], 1600, 560);
    reveal(rows[1] ? rows[1].querySelector('.pipe-node') : null, 1680, 600);

    /* CD lane label */
    reveal(lanes[1], 1960, 500, 'ease');

    /* Row 3: CD nodes */
    reveal(rows[2], 2020, 500, 'ease');
    var cdNodes  = rows[2] ? rows[2].querySelectorAll('.pipe-node')  : [];
    var cdArrows = rows[2] ? rows[2].querySelectorAll('.pipe-arrow') : [];
    cdNodes.forEach(function (n, i)  { reveal(n, 2100 + i * 110, 520); });
    cdArrows.forEach(function (a, i) {
        var delay = 2160 + i * 110;
        reveal(a, delay, 380, 'ease');
        setTimeout(function () {
            a.classList.add('is-animated');
            var dot = a.querySelector('.dot');
            if (dot) dot.style.animationDelay = (i * 0.5) + 's';
        }, delay + 400);
    });

    /* Jenkins thumbnail */
    reveal(document.querySelector('.jenkins-thumb'), 2700, 600);

    /* Nav pill */
    reveal(document.querySelector('.navigation'), 2800, 500, 'ease');
});
