/**
 * IB Computer Science | Emirates International School (EIS)
 * Shared behaviour across all pages:
 *  1. Mobile navigation toggle
 *  2. Undulating Ribbon Waves background engine (canvas)
 *  3. Appearance controls in the footer (5 palettes + background motion toggle)
 *  3b. Light / dark mode toggle in the header
 *  4. Exam question mark-scheme reveal helper
 */
(function () {
    'use strict';

    var root = document.documentElement;
    var THEME_KEY = 'eis_cs_theme';
    var TEXTURE_KEY = 'eis_cs_texture';
    var MODE_KEY = 'eis_cs_mode';

    var THEMES = [
        { id: 'lilac', name: 'Soft Slate & Lilac', bg: '#111218', accent: '#c4b5fd' },
        { id: 'monochrome', name: 'Monochrome', bg: '#080808', accent: '#ecebe8' },
        { id: 'crimson', name: 'Crimson', bg: '#fbf8f7', accent: '#800000' },
        { id: 'matcha', name: 'Matcha', bg: '#f4f5f1', accent: '#385542' },
        { id: 'clay', name: 'Clay', bg: '#f8f5f1', accent: '#944833' }
    ];

    function store(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* storage disabled */ }
    }

    root.classList.add('js');
    if (!root.getAttribute('data-theme')) {
        root.setAttribute('data-theme', 'lilac');
    }
    if (!root.getAttribute('data-texture')) {
        root.setAttribute('data-texture', 'animated');
    }
    if (!root.getAttribute('data-mode')) {
        var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        root.setAttribute('data-mode', prefersLight ? 'light' : 'dark');
    }

    /* ------------------------------------------------------------------
       1. Header System: Navigation, Floating Popover & Theme Mode Toggle
       ------------------------------------------------------------------ */
    function initHeader(ribbons) {
        var header = document.querySelector('.site-header');
        if (!header) return;
        var bar = header.querySelector('.wrap');
        if (!bar) return;

        var base = document.documentElement.getAttribute('data-base') || './';
        var currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';

        // Ensure header-right container exists
        var rightGroup = bar.querySelector('.header-right');
        if (!rightGroup) {
            rightGroup = document.createElement('div');
            rightGroup.className = 'header-right';
            var nav = bar.querySelector('.site-nav');
            if (nav) rightGroup.appendChild(nav);
            bar.appendChild(rightGroup);
        }

        // Find or create header-tools
        var tools = bar.querySelector('.header-tools');
        if (!tools) {
            tools = document.createElement('div');
            tools.className = 'header-tools';
            rightGroup.appendChild(tools);
        }
        tools.innerHTML = '';

        // 1. Minimalist Borderless Dark / Light mode toggle
        var modeBtn = document.createElement('button');
        modeBtn.type = 'button';
        modeBtn.className = 'theme-toggle';
        modeBtn.innerHTML =
            '<svg class="icon-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>' +
            '<svg class="icon-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"></path></svg>';

        function syncMode() {
            var light = root.getAttribute('data-mode') === 'light';
            var label = light ? 'Switch to dark mode' : 'Switch to light mode';
            modeBtn.setAttribute('aria-label', label);
            modeBtn.setAttribute('title', label);
        }

        modeBtn.addEventListener('click', function () {
            var next = root.getAttribute('data-mode') === 'light' ? 'dark' : 'light';
            root.setAttribute('data-mode', next);
            store(MODE_KEY, next);
            syncMode();
            if (ribbons) ribbons.refresh();
        });

        syncMode();
        tools.appendChild(modeBtn);

        // 2. '=' Dropdown Trigger and Floating Popover
        var dropdownWrap = document.createElement('div');
        dropdownWrap.className = 'menu-dropdown';

        var menuBtn = document.createElement('button');
        menuBtn.type = 'button';
        menuBtn.className = 'menu-trigger';
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-haspopup', 'true');
        menuBtn.setAttribute('aria-label', 'Explore more pages');
        menuBtn.setAttribute('title', 'More pages');
        menuBtn.innerHTML = '<span class="menu-icon-lines" aria-hidden="true"></span>';

        var popover = document.createElement('div');
        popover.className = 'menu-popover';
        popover.id = 'header-menu-popover';
        popover.setAttribute('role', 'menu');
        popover.hidden = true;

        popover.innerHTML =
            '<div class="popover-group popover-group-core">' +
                '<div class="popover-heading">Core Navigation</div>' +
                '<a href="' + base + 'index.html" class="popover-link" data-page="index.html"><span>Homepage</span></a>' +
                '<a href="' + base + 'pages/practice.html" class="popover-link" data-page="practice.html"><span>Practice Bank</span><span class="popover-tag">12 Qs</span></a>' +
                '<a href="' + base + 'pages/courses.html" class="popover-link" data-page="courses.html"><span>Courses Overview</span></a>' +
                '<a href="' + base + 'pages/resources.html" class="popover-link" data-page="resources.html"><span>Resources Vault</span><span class="popover-tag">151 Files</span></a>' +
            '</div>' +
            '<div class="popover-group">' +
                '<div class="popover-heading">Syllabus & Specializations</div>' +
                '<a href="' + base + 'pages/curriculum.html" class="popover-link" data-page="curriculum.html"><span>Curriculum & Pacing</span></a>' +
                '<a href="' + base + 'pages/theme-a.html" class="popover-link" data-page="theme-a.html"><span>Theme A: Systems & Hardware</span></a>' +
                '<a href="' + base + 'pages/theme-b.html" class="popover-link" data-page="theme-b.html"><span>Theme B: Thinking & Python</span></a>' +
                '<a href="' + base + 'pages/ia.html" class="popover-link" data-page="ia.html"><span>Internal Assessment (IA)</span><span class="popover-tag">30 Marks</span></a>' +
                '<a href="' + base + 'pages/case-study.html" class="popover-link" data-page="case-study.html"><span>Paper 3 Case Study</span><span class="popover-tag">HL</span></a>' +
                '<a href="' + base + 'pages/about-us.html" class="popover-link" data-page="about-us.html"><span>About the Faculty</span></a>' +
            '</div>' +
            '<div class="popover-group">' +
                '<div class="popover-heading">Administration</div>' +
                '<a href="' + base + 'pages/admin.html" class="popover-link" data-page="admin.html"><span>Faculty Portal</span></a>' +
            '</div>';

        // Mark active item in popover
        var popoverLinks = popover.querySelectorAll('.popover-link');
        popoverLinks.forEach(function (link) {
            var pageTarget = link.getAttribute('data-page');
            if (currentPath.endsWith(pageTarget) || (pageTarget === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')))) {
                link.setAttribute('aria-current', 'page');
            }
        });

        function setMenuOpen(open) {
            menuBtn.setAttribute('aria-expanded', String(open));
            popover.hidden = !open;
        }

        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
            setMenuOpen(!isOpen);
        });

        document.addEventListener('click', function (e) {
            if (!dropdownWrap.contains(e.target)) {
                setMenuOpen(false);
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
                setMenuOpen(false);
                menuBtn.focus();
            }
        });

        popover.addEventListener('click', function (e) {
            if (e.target.closest('a')) {
                setMenuOpen(false);
            }
        });

        dropdownWrap.appendChild(menuBtn);
        dropdownWrap.appendChild(popover);
        tools.appendChild(dropdownWrap);
    }

    /* ------------------------------------------------------------------
       2. Undulating Ribbon Waves Engine
       Sixteen translucent silk ribbons drift continuously and part around
       the cursor with laminar inertia. Pauses only when hidden or when the
       visitor explicitly sets data-texture="static".
       ------------------------------------------------------------------ */
    function initRibbons() {
        var canvas = document.querySelector('.ribbons') || document.getElementById('interactive-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'interactive-canvas';
            canvas.className = 'ribbons';
            canvas.setAttribute('aria-hidden', 'true');
            document.body.prepend(canvas);
        }
        if (!canvas.getContext) return null;

        var ctx = canvas.getContext('2d');

        var width = 0;
        var height = 0;
        var dpr = 1;
        var veilRgb = '196, 181, 253';
        var crestRgb = '221, 214, 254';
        var strength = 1.25;
        var frame = 0;
        var running = false;

        var targetX = 0, targetY = 0;
        var mouseX = 0, mouseY = 0;
        var smoothX = 0, smoothY = 0;
        var mouseAlpha = 0;
        var mouseActive = false;

        function isStill() {
            return root.getAttribute('data-texture') === 'static';
        }

        function readColour() {
            var styles = getComputedStyle(root);
            veilRgb = (styles.getPropertyValue('--ribbon') || '196, 181, 253').trim();
            crestRgb = (styles.getPropertyValue('--ribbon-crest') || veilRgb).trim();
            strength = parseFloat(styles.getPropertyValue('--ribbon-strength')) || 1.2;
        }

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (!mouseActive) {
                targetX = mouseX = smoothX = width / 2;
                targetY = mouseY = smoothY = height / 2;
            }
        }

        function veilColour(alpha) {
            return 'rgba(' + veilRgb + ', ' + Math.min(1, alpha * strength).toFixed(4) + ')';
        }

        function crestColour(alpha) {
            return 'rgba(' + crestRgb + ', ' + Math.min(1, alpha * strength).toFixed(4) + ')';
        }

        function trace(points) {
            ctx.moveTo(points[0].x, points[0].y);
            for (var j = 0; j < points.length - 1; j++) {
                var xc = (points[j].x + points[j + 1].x) * 0.5;
                var yc = (points[j].y + points[j + 1].y) * 0.5;
                ctx.quadraticCurveTo(points[j].x, points[j].y, xc, yc);
            }
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        }

        function draw(now) {
            var still = isStill();
            var count = width < 640 ? 12 : 16;
            var slowTime = still ? 100 : now * 0.00055;

            mouseX += (targetX - mouseX) * 0.12;
            mouseY += (targetY - mouseY) * 0.12;
            smoothX += (mouseX - smoothX) * 0.07;
            smoothY += (mouseY - smoothY) * 0.07;
            mouseAlpha += (((mouseActive && !still) ? 1 : 0) - mouseAlpha) * 0.05;

            ctx.clearRect(0, 0, width, height);

            var spacing = height / (count + 1);
            var step = width < 640 ? 18 : 14;

            for (var i = 1; i <= count; i++) {
                var baseY = i * spacing;
                var ribbonProgress = i / count;

                var waveFreq1 = 0.0018 + i * 0.00012;
                var waveFreq2 = 0.0034 + i * 0.00020;
                var waveSpeed1 = slowTime * (0.65 + i * 0.035);
                var waveSpeed2 = slowTime * (0.45 + i * 0.025);

                var baseAmp1 = 14 + ribbonProgress * 16;
                var baseAmp2 = 7 + ribbonProgress * 9;

                var points = [];

                for (var x = 0; x <= width + step; x += step) {
                    var y = baseY +
                        Math.sin(x * waveFreq1 + waveSpeed1) * baseAmp1 +
                        Math.cos(x * waveFreq2 - waveSpeed2) * baseAmp2;

                    if (mouseAlpha > 0.01) {
                        var dx = x - smoothX;
                        var dy = baseY - smoothY;
                        var distNorm = Math.hypot(dx / 240, dy / 150);
                        if (distNorm < 1.0) {
                            var t = 1 - distNorm;
                            var ease = t * t * (3 - 2 * t);
                            var pushY = (dy / (Math.abs(dy) + 26)) * ease * 42 * mouseAlpha;
                            y += pushY;
                        }
                    }

                    points.push({ x: x, y: y });
                }

                if (points.length < 2) continue;

                // Volumetric silk ribbon veil
                var veilHeight = spacing * 1.5;
                var fillAlpha = 0.016 + ribbonProgress * 0.038;

                ctx.beginPath();
                trace(points);
                ctx.lineTo(width, baseY + veilHeight);
                ctx.lineTo(0, baseY + veilHeight);
                ctx.closePath();

                var grad = ctx.createLinearGradient(0, baseY - 20, 0, baseY + veilHeight);
                grad.addColorStop(0, veilColour(fillAlpha * 1.65));
                grad.addColorStop(0.5, veilColour(fillAlpha * 0.48));
                grad.addColorStop(1, veilColour(0));
                ctx.fillStyle = grad;
                ctx.fill();

                // Crisp crest hairline stroke
                ctx.beginPath();
                trace(points);
                var baseStrokeAlpha = 0.08 + ribbonProgress * 0.22;
                ctx.strokeStyle = crestColour(baseStrokeAlpha);
                ctx.lineWidth = 0.85 + ribbonProgress * 0.45;
                ctx.stroke();
            }
        }

        function loop(now) {
            draw(now);
            frame = running ? requestAnimationFrame(loop) : 0;
        }

        function start() {
            if (running || isStill() || document.hidden) return;
            running = true;
            frame = requestAnimationFrame(loop);
        }

        function stop() {
            running = false;
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
        }

        function refresh() {
            readColour();
            if (isStill()) {
                stop();
                mouseAlpha = 0;
                draw(0);
            } else {
                draw(performance.now());
                start();
            }
        }

        function onCursorMove(e) {
            targetX = e.clientX;
            targetY = e.clientY;
            mouseActive = true;
        }

        window.addEventListener('mousemove', onCursorMove, { passive: true });
        window.addEventListener('pointermove', onCursorMove, { passive: true });

        window.addEventListener('mouseleave', function () {
            mouseActive = false;
        });

        document.documentElement.addEventListener('pointerleave', function () {
            mouseActive = false;
        });

        window.addEventListener('resize', function () {
            resize();
            readColour();
            if (isStill()) draw(0);
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop(); else start();
        });

        resize();
        refresh();
        return { refresh: refresh };
    }

    /* ------------------------------------------------------------------
       3. Appearance controls
       ------------------------------------------------------------------ */
    function initAppearance(ribbons) {
        var slot = document.querySelector('[data-appearance]');
        if (!slot) return;

        var current = root.getAttribute('data-theme') || 'lilac';
        if (!THEMES.some(function (t) { return t.id === current; })) current = 'lilac';

        var group = document.createElement('div');
        group.className = 'swatches';
        group.setAttribute('role', 'radiogroup');
        group.setAttribute('aria-label', 'Colour palette');

        THEMES.forEach(function (theme) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'swatch';
            b.setAttribute('role', 'radio');
            b.setAttribute('aria-label', theme.name);
            b.setAttribute('title', theme.name);
            b.setAttribute('aria-checked', String(theme.id === current));
            b.tabIndex = theme.id === current ? 0 : -1;
            b.dataset.theme = theme.id;
            b.style.setProperty('--swatch-bg', theme.bg);
            b.style.setProperty('--swatch-accent', theme.accent);
            group.appendChild(b);
        });

        function select(button, focus) {
            var id = button.dataset.theme;
            root.setAttribute('data-theme', id);
            store(THEME_KEY, id);
            Array.prototype.forEach.call(group.children, function (el) {
                var on = el === button;
                el.setAttribute('aria-checked', String(on));
                el.tabIndex = on ? 0 : -1;
            });
            if (focus) button.focus();
            if (ribbons) ribbons.refresh();
        }

        group.addEventListener('click', function (e) {
            var b = e.target.closest('.swatch');
            if (b) select(b, false);
        });

        group.addEventListener('keydown', function (e) {
            var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
            if (!(e.key in keys)) return;
            e.preventDefault();
            var items = Array.prototype.slice.call(group.children);
            var index = items.indexOf(document.activeElement);
            var next = items[(index + keys[e.key] + items.length) % items.length];
            select(next, true);
        });

        var motion = document.createElement('button');
        motion.type = 'button';
        motion.className = 'motion-toggle';
        motion.innerHTML = '<span class="dot" aria-hidden="true"></span><span>Background flow</span>';

        function syncMotion() {
            motion.setAttribute('aria-pressed', String(root.getAttribute('data-texture') !== 'static'));
        }

        motion.addEventListener('click', function () {
            var next = root.getAttribute('data-texture') === 'static' ? 'animated' : 'static';
            root.setAttribute('data-texture', next);
            store(TEXTURE_KEY, next);
            syncMotion();
            if (ribbons) ribbons.refresh();
        });

        syncMotion();
        slot.appendChild(group);
        slot.appendChild(motion);
    }

    /* ------------------------------------------------------------------
       4. Mark Scheme Reveal Toggle (Practice Questions)
       ------------------------------------------------------------------ */
    window.toggleScheme = function (btn) {
        if (!btn) return;
        var scheme = btn.nextElementSibling;
        if (!scheme) return;
        var isOpen = scheme.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.innerHTML = isOpen
            ? '<span>Hide Mark Scheme</span><span aria-hidden="true">&#9650;</span>'
            : '<span>Show Mark Scheme</span><span aria-hidden="true">&#9660;</span>';
    };


    function init() {
        var ribbons = initRibbons();
        initAppearance(ribbons);
        initHeader(ribbons);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
