/* ── SRTV Navigation + Progress Bar + Slide Overview ── */
(function () {
    'use strict';

    /* ── Presentation order ──
       Position (1..total) in the talk  →  actual slide-NN folder on disk.
       This lets us reorder the narrative without renaming any folder. */
    const order = [
        1, 2, 4, 5, 36, 8, 37, 38, 39, 28, 40, 41,
        24, 25, 26, 27,
        20, 35, 43, 15, 18, 22,
        34,
        30, 31, 42, 32
    ];

    const path       = window.location.pathname;
    const match      = path.match(/slide-(\d+)/);
    const folderNum  = match ? parseInt(match[1], 10) : 0;
    const current    = folderNum ? (order.indexOf(folderNum) + 1) : 0;
    const isRoot     = !match && (path.endsWith('index.html') || path.endsWith('/'));
    const total      = order.length;

    function slideUrl(n) {
        const folder = order[n - 1];
        return `slide-${String(folder).padStart(2, '0')}/index.html`;
    }

    function goToSlide(n) {
        if (n < 1 || n > total) return;
        const direction = n > current ? 'forward' : 'back';
        const target = isRoot ? slideUrl(n) : `../${slideUrl(n)}`;
        if (window.__playTransition) {
            window.__playTransition(target, direction);
        } else {
            window.location.href = target;
        }
    }

    /* ── Slide Overview (ESC) ── */
    let overviewOpen = false;
    let selectedSlide = current || 1;

    const slideTitles = [
        "Couverture", "Sommaire",
        "Organisme d'accueil", "Contexte : opportunité touristique",
        "Problématique", "Étude comparative",
        "Notre solution : SRTV + Lina",
        "Qu'est-ce que Lina ?", "Ce que Lina sait faire", "Interface Lina",
        "Lina en action : Briefing proactif", "Lina en action : Réservation taxi",
        "Interface Livestream", "Interface Reels", "Interface Shopping", "Interface Restaurant",
        "Architecture du Projet SRTV", "Orchestration d'agents IA (n8n)",
        "Besoins & Exigences", "Méthodologie Scrum", "Stack Technique & Environnement",
        "Pipeline CI / CD SRTV",
        "Démonstration",
        "Bilan", "Perspectives", "Vision & Impact", "Merci"
    ];

    const overview = document.createElement('div');
    overview.id = 'srtv-overview';
    overview.style.cssText = [
        'position:fixed;inset:0;z-index:9500;',
        'background:rgba(15,23,42,0.96);backdrop-filter:blur(16px);',
        'display:none;flex-direction:column;align-items:center;justify-content:flex-start;',
        'padding:40px 48px;box-sizing:border-box;overflow:hidden;'
    ].join('');

    const header = document.createElement('div');
    header.style.cssText = 'width:100%;max-width:1320px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;';
    header.innerHTML = '<h2 style="margin:0;color:#fff;font:600 24px Outfit,Inter,sans-serif;letter-spacing:-0.3px;">Toutes les slides</h2><span style="color:#94a3b8;font:14px Inter,sans-serif;">Échap pour fermer · Cliquez ou ↑↓←→ + Entrée pour naviguer</span>';
    overview.appendChild(header);

    const grid = document.createElement('div');
    grid.style.cssText = [
        'display:grid;grid-template-columns:repeat(auto-fill,256px);',
        'gap:20px;width:100%;max-width:1320px;max-height:calc(100vh - 140px);',
        'overflow-y:auto;padding:8px 4px 40px;justify-content:center;'
    ].join('');
    overview.appendChild(grid);

    function thumbUrl(n) {
        return isRoot ? slideUrl(n) : `../${slideUrl(n)}`;
    }

    for (let i = 1; i <= total; i++) {
        const card = document.createElement('div');
        card.className = 'srtv-overview-card';
        card.dataset.slide = i;
        card.style.cssText = [
            'width:256px;height:144px;border-radius:12px;overflow:hidden;',
            'cursor:pointer;position:relative;transition:all 0.2s ease;',
            'background:#0f172a;border:2px solid rgba(255,255,255,0.08);',
            'box-shadow:0 4px 20px rgba(0,0,0,0.25);'
        ].join('');
        if (i === current) {
            card.style.borderColor = '#10b981';
            card.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.25), 0 4px 20px rgba(0,0,0,0.25)';
        }

        const iframe = document.createElement('iframe');
        iframe.src = thumbUrl(i);
        iframe.loading = 'lazy';
        iframe.sandbox = 'allow-same-origin';
        iframe.title = `Aperçu slide ${i}`;
        iframe.style.cssText = [
            'width:1280px;height:720px;border:none;transform:scale(0.2);',
            'transform-origin:top left;pointer-events:none;'
        ].join('');
        card.appendChild(iframe);

        const label = document.createElement('div');
        label.style.cssText = [
            'position:absolute;bottom:0;left:0;right:0;padding:10px 12px;',
            'background:linear-gradient(transparent,rgba(0,0,0,0.85));',
            'color:#fff;font:13px/1.3 Inter,sans-serif;'
        ].join('');
        label.innerHTML = `<span style="font-weight:700;color:#6366f1;margin-right:8px;">${String(i).padStart(2, '0')}</span>${slideTitles[i - 1]}`;
        card.appendChild(label);

        card.addEventListener('mouseenter', function () {
            card.style.transform = 'translateY(-4px)';
            card.style.borderColor = i === current ? '#10b981' : 'rgba(255,255,255,0.25)';
            card.style.background = i === current ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = 'none';
            card.style.borderColor = i === current ? '#10b981' : 'rgba(255,255,255,0.08)';
            card.style.background = '#0f172a';
        });
        card.addEventListener('click', function () {
            closeOverview();
            goToSlide(i);
        });

        grid.appendChild(card);
    }

    document.body.appendChild(overview);

    function openOverview() {
        overviewOpen = true;
        selectedSlide = current || 1;
        overview.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateSelection();
        const card = grid.querySelector(`[data-slide="${selectedSlide}"]`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function closeOverview() {
        overviewOpen = false;
        overview.style.display = 'none';
        document.body.style.overflow = '';
    }

    function toggleOverview() {
        overviewOpen ? closeOverview() : openOverview();
    }

    function updateSelection() {
        grid.querySelectorAll('.srtv-overview-card').forEach(function (c) {
            const n = parseInt(c.dataset.slide, 10);
            c.style.transform = n === selectedSlide ? 'translateY(-4px)' : 'none';
            c.style.borderColor = n === selectedSlide ? '#10b981' : (n === current ? '#10b981' : 'rgba(255,255,255,0.08)');
            c.style.background = n === selectedSlide ? 'rgba(16,185,129,0.15)' : '#0f172a';
        });
    }

    function moveOverviewSelection(dir) {
        selectedSlide = Math.max(1, Math.min(total, selectedSlide + dir));
        updateSelection();
        const card = grid.querySelector(`[data-slide="${selectedSlide}"]`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ── Keyboard navigation ── */
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (overviewOpen) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeOverview();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                moveOverviewSelection(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                moveOverviewSelection(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                closeOverview();
                goToSlide(selectedSlide);
            }
            return;
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            openOverview();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault(); goToSlide(current + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault(); goToSlide(current - 1);
        } else if (e.key === 'Home') {
            e.preventDefault(); goToSlide(1);
        } else if (e.key === 'End') {
            e.preventDefault(); goToSlide(total);
        }
    });

    /* ── Touch / swipe navigation ── */
    let touchStartX = 0;
    document.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', function (e) {
        const dx = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 60) { dx > 0 ? goToSlide(current + 1) : goToSlide(current - 1); }
    }, { passive: true });

    /* ── Mouse click navigation ── */
    /* Left click → previous slide | Right click → next slide */
    function isInteractive(el) {
        return !!el.closest('button, a, input, textarea, select, label, [data-slide], iframe');
    }

    document.addEventListener('click', function (e) {
        if (overviewOpen) return;
        if (isInteractive(e.target)) return;
        // If this slide has a gallery, delegate to it
        if (typeof window.__galleryHandleClick === 'function') {
            const handled = window.__galleryHandleClick();
            if (handled) return;
        }
        e.preventDefault();
        goToSlide(current - 1);
    });

    document.addEventListener('contextmenu', function (e) {
        if (overviewOpen) return;
        e.preventDefault();
        goToSlide(current + 1);
    });

    /* ── SRTV logo (all slides except cover) ── */
    if (match && current > 1) {
        const logo = document.createElement('img');
        logo.className = 'slide-logo';
        logo.src = '../assets/logosrtv.png';
        logo.alt = 'SRTV';
        document.body.appendChild(logo);
    }

    /* ── Progress bar ── */
    if (match && current >= 1) {
        const bar = document.createElement('div');
        bar.id = 'srtv-progress';
        bar.style.cssText = [
            'position:fixed;bottom:0;left:0;height:3px;z-index:9000;',
            'background:linear-gradient(90deg,#0077cc,#6366f1,#10b981);',
            'border-radius:0 3px 3px 0;',
            'transition:width 0.6s cubic-bezier(0.22,1,0.36,1);',
            'opacity:0;'
        ].join('');
        document.body.appendChild(bar);

        /* Animate in after a short delay */
        setTimeout(function () {
            bar.style.opacity = '1';
            bar.style.width = ((current / total) * 100) + '%';
        }, 400);
    }

    /* ── Nav counter: replace "02 / 34" format with styled version ── */
    document.addEventListener('DOMContentLoaded', function () {
        const navEl = document.querySelector('.nav-year');
        if (!navEl || !match) return;
        navEl.innerHTML = `<span class="nav-current">${current}</span><span class="nav-sep"> / </span><span class="nav-total">${total}</span>`;
    });
})();
