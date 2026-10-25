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
    var USER_MODE_KEY = 'eis_cs_user_mode';
    var FOCUS_KEY = 'eis_cs_focus';
    var DENSITY_KEY = 'eis_cs_density';

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
    var initialUserMode = localStorage.getItem(USER_MODE_KEY) || 'system';
    root.setAttribute('data-user-mode', initialUserMode);
    var resolvedInitialMode = initialUserMode;
    if (initialUserMode === 'system') {
        resolvedInitialMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    root.setAttribute('data-mode', resolvedInitialMode);

    var initialFocus = localStorage.getItem(FOCUS_KEY) || 'false';
    root.setAttribute('data-focus', initialFocus);

    var initialDensity = localStorage.getItem(DENSITY_KEY) || 'standard';
    root.setAttribute('data-density', initialDensity);

    /* ------------------------------------------------------------------
       1. Reusable Origin-Aware Dropdown Animation Engine
       Computes the exact center of the trigger button relative to the popover
       and blooms the dropdown out from the button's exact coordinates.
       ------------------------------------------------------------------ */
    function openDropdownFromTrigger(triggerEl, popoverEl) {
        if (!triggerEl || !popoverEl) return;

        // Immediately close any other open dropdowns without exit lag
        document.querySelectorAll('.menu-popover, .config-popover').forEach(function (p) {
            if (p !== popoverEl && !p.hidden) {
                var otherTrigger = document.querySelector('[aria-controls="' + p.id + '"]');
                closeDropdownFromTrigger(otherTrigger, p, true);
            }
        });

        popoverEl.hidden = false;
        popoverEl.classList.remove('dropdown-animating-out');

        // Measure geometry
        var tRect = triggerEl.getBoundingClientRect();
        var pRect = popoverEl.getBoundingClientRect();

        var originX = (tRect.left + tRect.width / 2) - pRect.left;
        var originY = (tRect.top + tRect.height / 2) - pRect.top;

        popoverEl.style.transformOrigin = originX + 'px ' + originY + 'px';

        // Trigger bloom-in animation
        popoverEl.classList.remove('dropdown-animating-in');
        void popoverEl.offsetWidth; // Force reflow
        popoverEl.classList.add('dropdown-animating-in');

        triggerEl.setAttribute('aria-expanded', 'true');
    }

    function closeDropdownFromTrigger(triggerEl, popoverEl, instant) {
        if (!popoverEl || popoverEl.hidden) return;

        var trigger = triggerEl || document.querySelector('[aria-controls="' + popoverEl.id + '"]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');

        if (instant) {
            popoverEl.hidden = true;
            popoverEl.classList.remove('dropdown-animating-in', 'dropdown-animating-out');
            return;
        }

        popoverEl.classList.remove('dropdown-animating-in');
        popoverEl.classList.add('dropdown-animating-out');

        var closed = false;
        function done() {
            if (closed) return;
            closed = true;
            popoverEl.hidden = true;
            popoverEl.classList.remove('dropdown-animating-out');
            popoverEl.removeEventListener('animationend', done);
        }

        popoverEl.addEventListener('animationend', done, { once: true });
        setTimeout(done, 150); // Fallback
    }

    window.openDropdownFromTrigger = openDropdownFromTrigger;
    window.closeDropdownFromTrigger = closeDropdownFromTrigger;
    // Backward compatibility aliases
    window.openPopoverFromTrigger = openDropdownFromTrigger;
    window.closePopover = closeDropdownFromTrigger;

    /* ------------------------------------------------------------------
       2. Header System: Website Config Dropdown & Navigation Popover
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

        /* -------------------------------------------------------------
           A. Website Config Dropdown (Image 1 reference)
           ------------------------------------------------------------- */
        var configWrap = document.createElement('div');
        configWrap.className = 'config-dropdown';

        var configBtn = document.createElement('button');
        configBtn.type = 'button';
        configBtn.className = 'config-trigger';
        configBtn.id = 'config-trigger-btn';
        configBtn.setAttribute('aria-expanded', 'false');
        configBtn.setAttribute('aria-haspopup', 'true');
        configBtn.setAttribute('aria-controls', 'header-config-popover');
        configBtn.setAttribute('aria-label', 'Website display settings');
        configBtn.setAttribute('title', 'Website display settings');
        configBtn.innerHTML =
            '<svg class="icon-system" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>' +
            '<svg class="icon-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>' +
            '<svg class="icon-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"></path></svg>';

        var configPopover = document.createElement('div');
        configPopover.className = 'config-popover';
        configPopover.id = 'header-config-popover';
        configPopover.setAttribute('role', 'dialog');
        configPopover.setAttribute('aria-label', 'Website configuration');
        configPopover.hidden = true;

        var userMode = localStorage.getItem(USER_MODE_KEY) || 'system';

        function applyMode(mode) {
            userMode = mode;
            store(USER_MODE_KEY, mode);
            root.setAttribute('data-user-mode', mode);

            var resolvedMode = mode;
            if (mode === 'system') {
                resolvedMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
            }
            root.setAttribute('data-mode', resolvedMode);
            store(MODE_KEY, resolvedMode);
            if (ribbons) ribbons.refresh();

            configPopover.querySelectorAll('.theme-segment-btn').forEach(function (b) {
                var isActive = b.getAttribute('data-set-mode') === mode;
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-pressed', String(isActive));
            });
        }

        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
            if (userMode === 'system') applyMode('system');
        });

        configPopover.innerHTML =
            '<div class="config-section">' +
                '<span class="config-label">Theme Mode</span>' +
                '<div class="theme-segment" role="group" aria-label="Theme selection">' +
                    '<button type="button" class="theme-segment-btn' + (userMode === 'system' ? ' active' : '') + '" data-set-mode="system">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>' +
                        '<span>System</span>' +
                    '</button>' +
                    '<button type="button" class="theme-segment-btn' + (userMode === 'light' ? ' active' : '') + '" data-set-mode="light">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>' +
                        '<span>Light</span>' +
                    '</button>' +
                    '<button type="button" class="theme-segment-btn' + (userMode === 'dark' ? ' active' : '') + '" data-set-mode="dark">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"></path></svg>' +
                        '<span>Dark</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="config-section">' +
                '<span class="config-label">Accent Palette</span>' +
                '<div class="palette-grid" role="radiogroup" aria-label="Accent palette"></div>' +
            '</div>' +
            '<div class="config-section">' +
                '<span class="config-label">Background &amp; Motion</span>' +
                '<div class="config-toggle-row">' +
                    '<div class="config-toggle-info">' +
                        '<span class="config-toggle-title">Ribbon waves flow</span>' +
                        '<span class="config-toggle-sub">Animated canvas inertia</span>' +
                    '</div>' +
                    '<label class="switch-control">' +
                        '<input type="checkbox" id="cfg-waves-toggle"' + (root.getAttribute('data-texture') !== 'static' ? ' checked' : '') + '>' +
                        '<span class="switch-slider"></span>' +
                    '</label>' +
                '</div>' +
                '<div class="config-toggle-row">' +
                    '<div class="config-toggle-info">' +
                        '<span class="config-toggle-title">Focus / Exam mode</span>' +
                        '<span class="config-toggle-sub">Max contrast &amp; zero distractions</span>' +
                    '</div>' +
                    '<label class="switch-control">' +
                        '<input type="checkbox" id="cfg-focus-toggle"' + (root.getAttribute('data-focus') === 'true' ? ' checked' : '') + '>' +
                        '<span class="switch-slider"></span>' +
                    '</label>' +
                '</div>' +
            '</div>' +
            '<div class="config-section">' +
                '<span class="config-label">Typography &amp; Layout</span>' +
                '<div class="config-toggle-row">' +
                    '<div class="config-toggle-info">' +
                        '<span class="config-toggle-title">Comfortable reading</span>' +
                        '<span class="config-toggle-sub">Larger text &amp; relaxed line height</span>' +
                    '</div>' +
                    '<label class="switch-control">' +
                        '<input type="checkbox" id="cfg-density-toggle"' + (root.getAttribute('data-density') === 'comfortable' ? ' checked' : '') + '>' +
                        '<span class="switch-slider"></span>' +
                    '</label>' +
                '</div>' +
            '</div>';

        configPopover.querySelectorAll('.theme-segment-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                applyMode(btn.getAttribute('data-set-mode'));
            });
        });

        var paletteGrid = configPopover.querySelector('.palette-grid');
        var currentTheme = root.getAttribute('data-theme') || 'lilac';
        THEMES.forEach(function (theme) {
            var sBtn = document.createElement('button');
            sBtn.type = 'button';
            sBtn.className = 'palette-swatch-btn' + (theme.id === currentTheme ? ' active' : '');
            sBtn.setAttribute('data-palette-id', theme.id);
            sBtn.setAttribute('title', theme.name);
            sBtn.setAttribute('aria-label', theme.name);
            sBtn.innerHTML = '<span class="palette-swatch-inner" style="background:' + theme.accent + ';"></span>';

            sBtn.addEventListener('click', function () {
                root.setAttribute('data-theme', theme.id);
                store(THEME_KEY, theme.id);
                paletteGrid.querySelectorAll('.palette-swatch-btn').forEach(function (el) {
                    el.classList.toggle('active', el === sBtn);
                });
                if (ribbons) ribbons.refresh();
            });

            paletteGrid.appendChild(sBtn);
        });

        var wavesInput = configPopover.querySelector('#cfg-waves-toggle');
        wavesInput.addEventListener('change', function () {
            var val = wavesInput.checked ? 'animated' : 'static';
            root.setAttribute('data-texture', val);
            store(TEXTURE_KEY, val);
            if (ribbons) ribbons.refresh();
        });

        var focusInput = configPopover.querySelector('#cfg-focus-toggle');
        focusInput.addEventListener('change', function () {
            var val = focusInput.checked ? 'true' : 'false';
            root.setAttribute('data-focus', val);
            store(FOCUS_KEY, val);
            if (ribbons) ribbons.refresh();
        });

        var densityInput = configPopover.querySelector('#cfg-density-toggle');
        densityInput.addEventListener('change', function () {
            var val = densityInput.checked ? 'comfortable' : 'standard';
            root.setAttribute('data-density', val);
            store(DENSITY_KEY, val);
        });

        configBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (configPopover.hidden) {
                openDropdownFromTrigger(configBtn, configPopover);
            } else {
                closeDropdownFromTrigger(configBtn, configPopover);
            }
        });

        configWrap.appendChild(configBtn);
        configWrap.appendChild(configPopover);
        tools.appendChild(configWrap);

        /* -------------------------------------------------------------
           B. '=' Navigation Popover
           ------------------------------------------------------------- */
        var menuWrap = document.createElement('div');
        menuWrap.className = 'menu-dropdown';

        var menuBtn = document.createElement('button');
        menuBtn.type = 'button';
        menuBtn.className = 'menu-trigger';
        menuBtn.id = 'menu-trigger-btn';
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-haspopup', 'true');
        menuBtn.setAttribute('aria-controls', 'header-menu-popover');
        menuBtn.setAttribute('aria-label', 'Explore more pages');
        menuBtn.setAttribute('title', 'More pages');
        menuBtn.innerHTML = '<span class="menu-icon-lines" aria-hidden="true"></span>';

        var menuPopover = document.createElement('div');
        menuPopover.className = 'menu-popover';
        menuPopover.id = 'header-menu-popover';
        menuPopover.setAttribute('role', 'menu');
        menuPopover.hidden = true;

        menuPopover.innerHTML =
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

        menuPopover.querySelectorAll('.popover-link').forEach(function (link) {
            var pageTarget = link.getAttribute('data-page');
            if (currentPath.endsWith(pageTarget) || (pageTarget === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')))) {
                link.setAttribute('aria-current', 'page');
            }
        });

        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (menuPopover.hidden) {
                openDropdownFromTrigger(menuBtn, menuPopover);
            } else {
                closeDropdownFromTrigger(menuBtn, menuPopover);
            }
        });

        menuWrap.appendChild(menuBtn);
        menuWrap.appendChild(menuPopover);
        tools.appendChild(menuWrap);

        /* -------------------------------------------------------------
           C. Universal Keyboard & Outside Click Listeners
           ------------------------------------------------------------- */
        document.addEventListener('click', function (e) {
            if (!configWrap.contains(e.target)) closeDropdownFromTrigger(configBtn, configPopover);
            if (!menuWrap.contains(e.target)) closeDropdownFromTrigger(menuBtn, menuPopover);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (!configPopover.hidden) {
                    closeDropdownFromTrigger(configBtn, configPopover);
                    configBtn.focus();
                }
                if (!menuPopover.hidden) {
                    closeDropdownFromTrigger(menuBtn, menuPopover);
                    menuBtn.focus();
                }
            }
        });

        menuPopover.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeDropdownFromTrigger(menuBtn, menuPopover);
        });
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
       3. Mark Scheme Reveal Toggle (Practice Questions)
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
        initHeader(ribbons);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
