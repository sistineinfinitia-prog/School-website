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
        { id: 'lilac', name: 'Soft Slate & Lilac', bg: '#0c0d14', accent: '#a78bfa' },
        { id: 'monochrome', name: 'Monochrome', bg: '#080808', accent: '#ecebe8' },
        { id: 'crimson', name: 'Crimson & Rose', bg: '#0f0a0c', accent: '#fb7185' },
        { id: 'matcha', name: 'Matcha & Jade', bg: '#090f0c', accent: '#34d399' },
        { id: 'clay', name: 'Terracotta & Clay', bg: '#110e0c', accent: '#fb923c' }
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
       and blooms the dropdown out smoothly from the button's exact coordinates.
       ------------------------------------------------------------------ */
    function openDropdownFromTrigger(triggerEl, popoverEl) {
        if (!triggerEl || !popoverEl) return;

        // Immediately close any other open dropdowns without delay
        document.querySelectorAll('.menu-popover, .config-popover').forEach(function (p) {
            if (p !== popoverEl && p.classList.contains('is-open')) {
                var otherTrigger = document.querySelector('[aria-controls="' + p.id + '"]');
                closeDropdownFromTrigger(otherTrigger, p, true);
            }
        });

        // Cancel any pending close animation
        if (popoverEl._anim) {
            popoverEl._anim.cancel();
            popoverEl._anim = null;
        }

        // Measure geometry while in clean layout
        var tRect = triggerEl.getBoundingClientRect();
        var pRect = popoverEl.getBoundingClientRect();

        var originX = (tRect.left + tRect.width / 2) - pRect.left;
        var originY = (tRect.top + tRect.height / 2) - pRect.top;

        popoverEl.style.transformOrigin = Math.round(originX) + 'px ' + Math.round(originY) + 'px';

        // Unhide and mark open state
        popoverEl.removeAttribute('hidden');
        popoverEl.classList.add('is-open');
        triggerEl.setAttribute('aria-expanded', 'true');
        popoverEl.style.visibility = 'visible';
        popoverEl.style.pointerEvents = 'auto';

        // Animate blooming outwards from the trigger button
        if (typeof popoverEl.animate === 'function') {
            popoverEl._anim = popoverEl.animate([
                { opacity: 0, transform: 'scale(0.72) translateY(-6px)', filter: 'blur(5px)' },
                { opacity: 1, transform: 'scale(1) translateY(0)', filter: 'blur(0px)' }
            ], {
                duration: 240,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                fill: 'both'
            });
        }
    }

    function closeDropdownFromTrigger(triggerEl, popoverEl, instant) {
        if (!popoverEl || !popoverEl.classList.contains('is-open')) return;

        var trigger = triggerEl || document.querySelector('[aria-controls="' + popoverEl.id + '"]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');

        popoverEl.classList.remove('is-open');
        popoverEl.style.pointerEvents = 'none';

        if (popoverEl._anim) {
            popoverEl._anim.cancel();
            popoverEl._anim = null;
        }

        if (instant || typeof popoverEl.animate !== 'function') {
            popoverEl.style.visibility = 'hidden';
            popoverEl.setAttribute('hidden', '');
            return;
        }

        var anim = popoverEl.animate([
            { opacity: 1, transform: 'scale(1) translateY(0)', filter: 'blur(0px)' },
            { opacity: 0, transform: 'scale(0.8) translateY(-4px)', filter: 'blur(2px)' }
        ], {
            duration: 150,
            easing: 'cubic-bezier(0.4, 0, 1, 1)',
            fill: 'both'
        });

        popoverEl._anim = anim;
        anim.onfinish = function () {
            if (!popoverEl.classList.contains('is-open')) {
                popoverEl.style.visibility = 'hidden';
                popoverEl.setAttribute('hidden', '');
                popoverEl._anim = null;
            }
        };
    }

    window.openDropdownFromTrigger = openDropdownFromTrigger;
    window.closeDropdownFromTrigger = closeDropdownFromTrigger;
    // Backward compatibility aliases
    window.openPopoverFromTrigger = openDropdownFromTrigger;
    window.closePopover = closeDropdownFromTrigger;

    /* ------------------------------------------------------------------
       1b. Global Command Palette (Ctrl+K / Cmd+K)
       ------------------------------------------------------------------ */
    function initCommandPalette(base) {
        var existing = document.getElementById('global-cmd-palette');
        if (existing) existing.remove();

        var isMac = /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent || navigator.platform || '');
        var shortcutLabel = isMac ? '⌘K' : 'Ctrl K';

        var palette = document.createElement('div');
        palette.className = 'cmd-palette-backdrop';
        palette.id = 'global-cmd-palette';
        palette.hidden = true;
        palette.innerHTML =
            '<div class="cmd-palette-dialog" role="dialog" aria-modal="true" aria-label="Global Search and Quick Navigation">' +
                '<div class="cmd-palette-header">' +
                    '<svg class="cmd-palette-search-icon" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"></circle><path d="M13 13l4 4" stroke-linecap="round"></path></svg>' +
                    '<input type="search" class="cmd-palette-input" id="cmd-palette-input" placeholder="Type a shortcut (e.g. ia, oop, sql, qbank) or topic..." aria-label="Search query" autocomplete="off" spellcheck="false">' +
                    '<button type="button" class="cmd-esc-btn" id="cmd-palette-close">ESC</button>' +
                '</div>' +
                '<div class="cmd-palette-body" id="cmd-palette-results" role="listbox"></div>' +
                '<div class="cmd-palette-footer">' +
                    '<div class="cmd-palette-footer-keys">' +
                        '<span><kbd class="header-search-kbd">↑</kbd> <kbd class="header-search-kbd">↓</kbd> navigate</span>' +
                        '<span><kbd class="header-search-kbd">↵</kbd> select</span>' +
                        '<span><kbd class="header-search-kbd">ESC</kbd> close</span>' +
                    '</div>' +
                    '<span>IB Computer Science EIS</span>' +
                '</div>' +
            '</div>';
        document.body.appendChild(palette);

        var input = palette.querySelector('#cmd-palette-input');
        var results = palette.querySelector('#cmd-palette-results');
        var closeBtn = palette.querySelector('#cmd-palette-close');
        var selectedIndex = 0;

        function showSiteToast(msg) {
            var existingToast = document.getElementById('site-cmd-toast');
            if (existingToast) existingToast.remove();
            var toast = document.createElement('div');
            toast.id = 'site-cmd-toast';
            toast.className = 'site-cmd-toast';
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(function () { toast.classList.add('is-visible'); }, 10);
            setTimeout(function () {
                toast.classList.remove('is-visible');
                setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
            }, 2200);
        }

        var STATIC_ENTRIES = [
            // --- Core Pages & Key Navigation ---
            {
                category: 'Pages & Key Guides',
                type: 'PAGE',
                tag: 'IA',
                title: 'Internal Assessment (IA) Guide',
                sub: 'Criteria A–E documentation, marks breakdown, and exemplar',
                url: base + 'pages/ia.html',
                keywords: ['ia', 'internal assessment', 'criterion', 'criteria', 'solution', 'computational solution', 'record of tasks', 'coursework', 'rubric', '30 marks', 'crit a', 'crit b', 'crit c', 'crit d', 'crit e', 'project']
            },
            {
                category: 'Pages & Key Guides',
                type: 'SECTION',
                tag: 'IA',
                title: 'IA Assessment Criteria (A to E Rubrics)',
                sub: 'Planning, Solution Overview, Development, Product, Evaluation',
                url: base + 'pages/ia.html#criteria',
                targetTab: 'criteria',
                keywords: ['ia criteria', 'criterion a', 'criterion b', 'criterion c', 'criterion d', 'criterion e', 'crit a', 'crit b', 'crit c', 'crit d', 'crit e', 'rubric', 'marks']
            },
            {
                category: 'Pages & Key Guides',
                type: 'SECTION',
                tag: 'IA',
                title: 'IA Submission Guide & Tech Stack Architecture',
                sub: 'Redesigned 2027 framework, client shift, golden chain, submission checklist',
                url: base + 'pages/ia.html#guide',
                targetTab: 'guide',
                keywords: ['ia guide', 'tech stack', 'golden chain', 'client shift', 'architecture', 'submission checklist', 'ia tech']
            },
            {
                category: 'Pages & Key Guides',
                type: 'SECTION',
                tag: 'IA',
                title: 'IA High-Scoring Student Exemplars',
                sub: 'Grade 7 exemplar documentation and verified solutions',
                url: base + 'pages/ia.html#exemplars',
                targetTab: 'exemplars',
                keywords: ['ia exemplars', 'exemplar', 'samples', 'grade 7 ia', 'past ia', 'ia exemplar']
            },
            {
                category: 'Pages & Key Guides',
                type: 'SECTION',
                tag: 'IA',
                title: 'IA Video Tutorials & Walkthroughs',
                sub: 'Criterion-by-criterion walkthrough videos from faculty',
                url: base + 'pages/ia.html#videos',
                targetTab: 'videos',
                keywords: ['ia videos', 'video guide', 'walkthrough', 'youtube', 'criterion video']
            },
            {
                category: 'Pages & Key Guides',
                type: 'PAGE',
                tag: 'SYLLABUS',
                title: 'Syllabus & Course Map',
                sub: 'Themes A & B, Units A1–A4 & B1–B4 syllabus statements',
                url: base + 'pages/curriculum.html',
                keywords: ['syllabus', 'curriculum', 'course map', 'roadmap', 'spec', 'topics', 'units', 'themes', 'theme a', 'theme b', 'standards', 'learning objectives']
            },
            {
                category: 'Pages & Key Guides',
                type: 'PAGE',
                tag: 'PRACTICE',
                title: 'Practice Question Bank',
                sub: 'Interactive specimen questions, mark schemes, and examiner tips',
                url: base + 'pages/practice.html',
                keywords: ['practice', 'questions', 'question bank', 'qb', 'qbank', 'exam', 'specimen', 'past papers', 'quiz', 'mark scheme', 'revision', 'ib questions']
            },
            {
                category: 'Practice & Study Tools',
                type: 'SECTION',
                tag: 'CARDS',
                title: 'Interactive Flashcards & Glossary',
                sub: 'Master CS key terms, definitions, and syllabus vocabulary',
                url: base + 'pages/practice.html?tab=flashcards',
                keywords: ['flashcards', 'cards', 'fc', 'vocab', 'definitions', 'glossary', 'terms', 'terminology', 'flash card', 'study cards']
            },
            {
                category: 'Practice & Study Tools',
                type: 'SECTION',
                tag: 'TEST',
                title: 'Timed Exam Simulation Mode',
                sub: 'Custom practice tests by topic, difficulty, and timer',
                url: base + 'pages/practice.html?tab=test',
                keywords: ['test', 'mock', 'exam mode', 'quiz mode', 'timed test', 'timed assessment', 'simulation']
            },
            {
                category: 'Pages & Key Guides',
                type: 'PAGE',
                tag: 'DATES',
                title: 'Deadlines & Term Milestones',
                sub: 'Assessment calendar, mock exams, and milestone dates',
                url: base + 'pages/deadlines.html?tab=deadlines',
                keywords: ['deadlines', 'calendar', 'dates', 'milestones', 'due dates', 'submissions', 'schedule', 'assessment dates']
            },
            {
                category: 'Pages & Key Guides',
                type: 'SECTION',
                tag: 'NOTICES',
                title: 'Faculty Bulletins & Announcements',
                sub: 'Live notifications, course updates, and exam alerts',
                url: base + 'pages/deadlines.html?tab=announcements',
                keywords: ['announcements', 'bulletin', 'notices', 'news', 'faculty notices', 'alerts', 'updates']
            },
            {
                category: 'Pages & Key Guides',
                type: 'PAGE',
                tag: 'DROPS',
                title: 'Coursework & Teacher Drops',
                sub: 'Direct uploads, worksheets, and ManageBac resources',
                url: base + 'pages/resources.html',
                keywords: ['drops', 'resources', 'teacher drops', 'coursework', 'files', 'materials', 'worksheets', 'slides', 'downloads']
            },
            {
                category: 'Pages & Key Guides',
                type: 'SECTION',
                tag: 'VAULT',
                title: 'Department Resource Vault (Archive)',
                sub: 'Search 151+ syllabus slides, past papers, and worksheets',
                url: base + 'pages/resources.html?tab=archive',
                keywords: ['vault', 'archive', '151 resources', 'past papers archive', 'google drive', 'slides archive', 'folder']
            },
            {
                category: 'Pages & Key Guides',
                type: 'PAGE',
                tag: 'CASE STUDY',
                title: 'Paper 1 Section B Case Study',
                sub: 'Context overview, secondary research, and practice scenarios',
                url: base + 'pages/case-study.html',
                keywords: ['case study', 'case', 'cs', 'paper 1', 'p1', 'section b', 'scenario', 'secondary research', 'drones', 'autonomous systems']
            },
            {
                category: 'Pages & Key Guides',
                type: 'PAGE',
                tag: 'ADMIN',
                title: 'Faculty Administration Portal',
                sub: 'Teacher resource publisher, deadline editor, and settings',
                url: base + 'pages/admin.html',
                keywords: ['admin', 'portal', 'faculty', 'teacher admin', 'login', 'passkey', 'upload studio', 'manage']
            },
            {
                category: 'Pages & Key Guides',
                type: 'PAGE',
                tag: 'ABOUT',
                title: 'About Department & Faculty',
                sub: 'Teaching team, curriculum philosophy, and contact info',
                url: base + 'pages/about-us.html',
                keywords: ['about', 'about us', 'faculty info', 'teachers', 'staff', 'contact', 'mr', 'department']
            },
            {
                category: 'Pages & Key Guides',
                type: 'PAGE',
                tag: 'HOME',
                title: 'Course Home & Dashboard',
                sub: 'EIS DP Computer Science learning hub',
                url: base + 'index.html',
                keywords: ['home', 'main', 'index', 'dashboard', 'welcome']
            },

            // --- Syllabus Units (Themes A & B) ---
            {
                category: 'Syllabus Units (Theme A & B)',
                type: 'SYLLABUS',
                tag: 'A1',
                unitId: 'a1',
                title: 'A1: Computer Fundamentals',
                sub: 'Theme A: Hardware architecture, CPU/GPU, logic gates, operating systems',
                url: base + 'pages/curriculum.html#a1',
                keywords: ['a1', 'cpu', 'gpu', 'hardware', 'von neumann', 'storage', 'registers', 'cache', 'ram', 'rom', 'logic gates', 'truth tables', 'operating system', 'os', 'interrupts', 'translation']
            },
            {
                category: 'Syllabus Units (Theme A & B)',
                type: 'SYLLABUS',
                tag: 'A2',
                unitId: 'a2',
                title: 'A2: Networks & Communication',
                sub: 'Theme A: Network topologies, TCP/IP stack, packet switching, security',
                url: base + 'pages/curriculum.html#a2',
                keywords: ['a2', 'net', 'network', 'networks', 'networking', 'tcp', 'ip', 'protocols', 'packet', 'switching', 'topology', 'dns', 'vpn', 'lan', 'wan', 'bandwidth', 'osi']
            },
            {
                category: 'Syllabus Units (Theme A & B)',
                type: 'SYLLABUS',
                tag: 'A3',
                unitId: 'a3',
                title: 'A3: Databases & Persistent Storage',
                sub: 'Theme A: Relational schemas, normalization (1NF–3NF), ERD, SQL queries',
                url: base + 'pages/curriculum.html#a3',
                keywords: ['a3', 'db', 'database', 'databases', 'sql', 'erd', 'relational', 'normalization', '1nf', '2nf', '3nf', 'schema', 'foreign key', 'primary key', 'query']
            },
            {
                category: 'Syllabus Units (Theme A & B)',
                type: 'SYLLABUS',
                tag: 'A4',
                unitId: 'a4',
                title: 'A4: Machine Learning & AI',
                sub: 'Theme A: ML paradigms, supervised/unsupervised, neural nets, ethics',
                url: base + 'pages/curriculum.html#a4',
                keywords: ['a4', 'ai', 'ml', 'machine learning', 'artificial intelligence', 'neural networks', 'models', 'deep learning', 'supervised', 'unsupervised', 'reinforcement', 'training', 'ethics']
            },
            {
                category: 'Syllabus Units (Theme A & B)',
                type: 'SYLLABUS',
                tag: 'B1',
                unitId: 'b1',
                title: 'B1: Computational Thinking & Algorithms',
                sub: 'Theme B: Pseudocode conventions, Big O complexity, trace tables',
                url: base + 'pages/curriculum.html#b1',
                keywords: ['b1', 'algo', 'algorithm', 'algorithms', 'pseudocode', 'big o', 'complexity', 'flowcharts', 'trace tables', 'linear search', 'binary search', 'bubble sort']
            },
            {
                category: 'Syllabus Units (Theme A & B)',
                type: 'SYLLABUS',
                tag: 'B2',
                unitId: 'b2',
                title: 'B2: Object-Oriented Programming (OOP)',
                sub: 'Theme B: Classes, objects, encapsulation, inheritance, polymorphism',
                url: base + 'pages/curriculum.html#b2',
                keywords: ['b2', 'oop', 'programming', 'python', 'java', 'classes', 'objects', 'inheritance', 'encapsulation', 'polymorphism', 'methods', 'instantiation']
            },
            {
                category: 'Syllabus Units (Theme A & B)',
                type: 'SYLLABUS',
                tag: 'B3',
                unitId: 'b3',
                title: 'B3: Abstract Data Structures (ADTs)',
                sub: 'Theme B: Stacks, queues, linked lists, binary search trees (BST)',
                url: base + 'pages/curriculum.html#b3',
                keywords: ['b3', 'adt', 'adts', 'data structures', 'stacks', 'queues', 'linked lists', 'trees', 'bst', 'binary search tree', 'nodes', 'pointers']
            },
            {
                category: 'Syllabus Units (Theme A & B)',
                type: 'SYLLABUS',
                tag: 'B4',
                unitId: 'b4',
                title: 'B4: Advanced Algorithms & Recursion',
                sub: 'Theme B (HL Only): Recursive traversals, sorting efficiency, tree recursion',
                url: base + 'pages/curriculum.html#b4',
                keywords: ['b4', 'recursion', 'recursive', 'hl', 'higher level', 'tree traversal', 'quicksort', 'mergesort', 'base case', 'recursive algorithms']
            },

            // --- Quick Actions ---
            {
                category: 'Quick Actions',
                type: 'ACTION',
                tag: 'STUDIO',
                title: 'Drop New Resource (Faculty Studio)',
                sub: 'Open teacher upload drawer to publish coursework or lab',
                action: 'drop-resource',
                keywords: ['drop', 'upload', 'new resource', 'add resource', 'faculty drop', 'publish', 'create drop']
            },
            {
                category: 'Quick Actions',
                type: 'ACTION',
                tag: 'LINK',
                title: 'ManageBac Portal',
                sub: 'Open Emirates International School ManageBac workspace',
                action: 'open-mb',
                keywords: ['managebac', 'mb', 'eis managebac', 'portal', 'grades', 'attendance']
            }
        ];

        function escapeHtml(str) {
            return String(str || '').replace(/[&<>"']/g, function (m) {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
            });
        }

        function highlightMatch(text, query) {
            if (!query || !text) return escapeHtml(text || '');
            var escapedText = escapeHtml(text);
            var escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            try {
                var regex = new RegExp('(' + escapedQuery + ')', 'gi');
                return escapedText.replace(regex, '<mark class="cmd-highlight">$1</mark>');
            } catch (e) {
                return escapedText;
            }
        }

        function openPalette() {
            palette.hidden = false;
            document.body.classList.add('cmd-palette-open');
            var trigger = document.getElementById('header-search-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'true');
            input.value = '';
            renderResults('');
            setTimeout(function () { input.focus(); }, 30);
        }

        function closePalette() {
            palette.hidden = true;
            document.body.classList.remove('cmd-palette-open');
            var trigger = document.getElementById('header-search-trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        }

        function renderResults(q) {
            var rawQuery = (q || '').trim();
            var query = rawQuery.toLowerCase();
            results.innerHTML = '';
            selectedIndex = 0;

            // Empty state: show suggestion tags and top links
            if (!query) {
                var emptyContainer = document.createElement('div');
                emptyContainer.className = 'cmd-empty-state';
                emptyContainer.innerHTML =
                    '<div class="cmd-empty-lead">Quick Recommendations &amp; Shortcuts</div>' +
                    '<div class="cmd-chip-grid">' +
                        '<button type="button" class="cmd-chip" data-search="ia"><span class="cmd-chip-kbd">ia</span> IA Guide</button>' +
                        '<button type="button" class="cmd-chip" data-search="oop"><span class="cmd-chip-kbd">oop</span> OOP</button>' +
                        '<button type="button" class="cmd-chip" data-search="sql"><span class="cmd-chip-kbd">sql</span> Databases</button>' +
                        '<button type="button" class="cmd-chip" data-search="a1"><span class="cmd-chip-kbd">a1</span> Hardware</button>' +
                        '<button type="button" class="cmd-chip" data-search="ai"><span class="cmd-chip-kbd">ai</span> Machine Learning</button>' +
                        '<button type="button" class="cmd-chip" data-search="qbank"><span class="cmd-chip-kbd">qb</span> Question Bank</button>' +
                        '<button type="button" class="cmd-chip" data-search="flashcards"><span class="cmd-chip-kbd">fc</span> Flashcards</button>' +
                        '<button type="button" class="cmd-chip" data-search="vault"><span class="cmd-chip-kbd">vault</span> Resource Vault</button>' +
                        '<button type="button" class="cmd-chip" data-search="deadlines"><span class="cmd-chip-kbd">dates</span> Deadlines</button>' +
                    '</div>';

                emptyContainer.querySelectorAll('.cmd-chip').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var term = btn.getAttribute('data-search');
                        input.value = term;
                        renderResults(term);
                        input.focus();
                    });
                });
                results.appendChild(emptyContainer);

                // Show default key bookmarks
                var defaultItems = [
                    STATIC_ENTRIES[0], // IA Guide
                    STATIC_ENTRIES[5], // Syllabus
                    STATIC_ENTRIES[6], // Practice
                    STATIC_ENTRIES[11], // Drops
                    STATIC_ENTRIES[12], // Vault
                    STATIC_ENTRIES[9]  // Deadlines
                ];

                var groupHeader = document.createElement('div');
                groupHeader.className = 'cmd-group-title';
                groupHeader.textContent = 'Essential Hubs';
                results.appendChild(groupHeader);

                defaultItems.forEach(function (item, idx) {
                    var row = createItemRow(item, idx, '');
                    results.appendChild(row);
                });

                updateSelection(0);
                return;
            }

            // Scored items array
            var scoredItems = [];

            // 1. Search Static Entries (Pages, Syllabus, Sections, Actions)
            STATIC_ENTRIES.forEach(function (entry) {
                var score = calculateScore(entry, query);
                if (score > 0) {
                    scoredItems.push({ item: entry, score: score });
                }
            });

            // 2. Search Live Teacher Drops
            var drops = [];
            if (window.DataService && typeof window.DataService.getTeacherResources === 'function') {
                drops = window.DataService.getTeacherResources() || [];
            }
            drops.forEach(function (d) {
                var dropEntry = {
                    category: 'Teacher Drops & Files',
                    type: 'DROP',
                    tag: d.unit || 'DROP',
                    title: d.title || 'Untitled Resource',
                    sub: (d.subtopicName || d.theme || '') + (d.fileType ? ' \u2022 ' + d.fileType.toUpperCase() : ''),
                    url: base + 'pages/resources.html#drop-' + encodeURIComponent(d.id),
                    drop: d,
                    keywords: [
                        (d.unit || '').toLowerCase(),
                        (d.fileType || '').toLowerCase(),
                        (d.theme || '').toLowerCase()
                    ]
                };
                var score = calculateScore(dropEntry, query);
                if (score > 0) {
                    scoredItems.push({ item: dropEntry, score: score });
                }
            });

            if (!scoredItems.length) {
                results.innerHTML =
                    '<div style="padding: 32px 16px; text-align: center; color: var(--text-3); font-size: 0.88rem;">' +
                        'No matches found for <strong style="color:var(--text);">&ldquo;' + escapeHtml(rawQuery) + '&rdquo;</strong>' +
                        '<div style="margin-top: 8px; font-size: 0.78rem;">Try shortcuts: <strong style="color:var(--accent);">ia</strong>, <strong style="color:var(--accent);">oop</strong>, <strong style="color:var(--accent);">sql</strong>, <strong style="color:var(--accent);">a1</strong>, or <strong style="color:var(--accent);">qbank</strong></div>' +
                    '</div>';
                return;
            }

            // Sort by score descending
            scoredItems.sort(function (a, b) { return b.score - a.score; });

            // Render with categorized group titles (up to 14 results)
            var displayed = scoredItems.slice(0, 14);
            var currentCategory = null;
            var actionIdx = 0;

            displayed.forEach(function (wrapper) {
                var item = wrapper.item;
                var cat = item.category || 'Results';
                if (cat !== currentCategory) {
                    currentCategory = cat;
                    var catEl = document.createElement('div');
                    catEl.className = 'cmd-group-title';
                    catEl.textContent = cat;
                    results.appendChild(catEl);
                }

                var row = createItemRow(item, actionIdx, query);
                results.appendChild(row);
                actionIdx++;
            });

            updateSelection(0);
        }

        function calculateScore(item, query) {
            var score = 0;
            var isShortQuery = query.length <= 2;
            var titleLower = (item.title || '').toLowerCase();
            var subLower = (item.sub || '').toLowerCase();
            var tagLower = (item.tag || '').toLowerCase();

            // 1. Tag / Code match (e.g. 'A1', 'B2', 'IA')
            if (tagLower === query) score += 950;
            else if (tagLower.indexOf(query) === 0) score += 500;

            // 2. Explicit Keywords & Shortcuts match
            var keywords = item.keywords || [];
            for (var k = 0; k < keywords.length; k++) {
                var kw = (keywords[k] || '').toLowerCase();
                if (kw === query) {
                    score += 1000; // Perfect acronym or shortcut match!
                    break;
                } else if (kw.indexOf(query) === 0) {
                    score += 650;
                } else if (!isShortQuery && kw.indexOf(query) !== -1) {
                    score += 350;
                }
            }

            // 3. Title matching
            if (titleLower === query) {
                score += 850;
            } else {
                var titleWords = titleLower.split(/\s+/);
                var hasWordMatch = false;
                for (var w = 0; w < titleWords.length; w++) {
                    var cleanW = titleWords[w].replace(/[():,.]/g, '');
                    if (cleanW === query) {
                        score += 600;
                        hasWordMatch = true;
                        break;
                    } else if (cleanW.indexOf(query) === 0) {
                        score += 400;
                        hasWordMatch = true;
                        break;
                    }
                }
                if (!hasWordMatch) {
                    if (isShortQuery) {
                        // Short queries (e.g. 'ia', 'db') do NOT match inside words like 'material'
                        return score;
                    }
                    if (titleLower.indexOf(query) !== -1) {
                        score += 200;
                    }
                }
            }

            // 4. Subtitle matching
            if (!isShortQuery && subLower.indexOf(query) !== -1) {
                score += 50;
            }

            // If no match was found, do not award any baseline bonus
            if (score === 0) return 0;

            // 5. Category/Type baseline bonuses - Main pages rank highest!
            if (item.type === 'PAGE') score += 500;
            else if (item.type === 'SYLLABUS') score += 400;
            else if (item.type === 'SECTION') score += 100;
            else if (item.type === 'ACTION') score += 50;
            else if (item.type === 'DROP') score += 20;

            return score;
        }

        function createItemRow(item, idx, query) {
            var row = document.createElement('div');
            row.className = 'cmd-item' + (idx === 0 ? ' is-selected' : '');
            row.setAttribute('role', 'option');
            row.setAttribute('aria-selected', String(idx === 0));

            var displayTitle = highlightMatch(item.title, query);
            var displaySub = highlightMatch(item.sub, query);

            var actionLabel = 'Jump \u2192';
            if (item.action === 'open-mb') actionLabel = 'Open \u2197';
            else if (item.action === 'drop-resource') actionLabel = 'Upload';
            else if (item.type === 'SECTION') actionLabel = 'View \u2193';
            else if (item.type === 'DROP') actionLabel = 'Preview';

            row.innerHTML =
                '<div class="cmd-item-left">' +
                    '<span class="cmd-item-tag">' + escapeHtml(item.tag || item.type) + '</span>' +
                    '<div class="cmd-item-text">' +
                        '<span class="cmd-item-title">' + displayTitle + '</span>' +
                        '<span class="cmd-item-sub">' + displaySub + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="cmd-item-right">' +
                    '<span class="cmd-item-action">' + actionLabel + '</span>' +
                '</div>';

            row.addEventListener('click', function () {
                executeItem(item);
            });
            return row;
        }

        function updateSelection(newIdx) {
            var rows = results.querySelectorAll('.cmd-item');
            if (!rows.length) return;
            if (newIdx < 0) newIdx = rows.length - 1;
            if (newIdx >= rows.length) newIdx = 0;
            selectedIndex = newIdx;
            rows.forEach(function (r, i) {
                r.classList.toggle('is-selected', i === selectedIndex);
                r.setAttribute('aria-selected', String(i === selectedIndex));
                if (i === selectedIndex) {
                    r.scrollIntoView({ block: 'nearest' });
                }
            });
        }

        function executeItem(item) {
            if (!item) return;
            closePalette();

            // 1. Action: drop-resource
            if (item.action === 'drop-resource') {
                if (window.location.pathname.indexOf('resources.html') !== -1) {
                    if (typeof window.openFacultyDropForUnit === 'function') {
                        window.openFacultyDropForUnit('A1', 'Theme A');
                    } else {
                        var openBtn = document.getElementById('btn-open-drop-studio');
                        if (openBtn) openBtn.click();
                    }
                } else {
                    window.location.href = base + 'pages/resources.html#faculty-drop-studio';
                }
                return;
            }

            // 2. Action: open-mb
            if (item.action === 'open-mb') {
                var cfg = (window.DataService && typeof window.DataService.getManageBacConfig === 'function')
                    ? window.DataService.getManageBacConfig()
                    : { schoolSubdomain: 'eis' };
                var mbUrl = (cfg && cfg.schoolSubdomain) ? 'https://' + cfg.schoolSubdomain + '.managebac.com' : 'https://managebac.com';
                window.open(mbUrl, '_blank', 'noopener');
                return;
            }

            // 3. Teacher Drop item
            if (item.type === 'DROP' && item.drop) {
                var dropId = item.drop.id;
                if (window.location.pathname.indexOf('resources.html') !== -1) {
                    // Already on resources page!
                    if (typeof window.openResourcePreviewModal === 'function') {
                        window.openResourcePreviewModal(item.drop);
                    }
                    var card = document.getElementById('drop-' + dropId) || document.querySelector('[data-id="' + dropId + '"]');
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.classList.add('highlight-pulse');
                        setTimeout(function () { card.classList.remove('highlight-pulse'); }, 2500);
                    }
                } else {
                    // Navigate to resources with preview param & hash
                    window.location.href = base + 'pages/resources.html?preview=' + encodeURIComponent(dropId) + '#drop-' + encodeURIComponent(dropId);
                }
                return;
            }

            // 4. Syllabus unit (A1-B4)
            if (item.type === 'SYLLABUS' && item.unitId) {
                var unitCode = item.unitId.toLowerCase();
                if (window.location.pathname.indexOf('curriculum.html') !== -1) {
                    // Already on curriculum page!
                    var unitEl = document.getElementById(unitCode);
                    if (unitEl) {
                        unitEl.open = true;
                        unitEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        unitEl.classList.add('highlight-pulse');
                        setTimeout(function () { unitEl.classList.remove('highlight-pulse'); }, 2500);
                        try { history.pushState(null, '', '#' + unitCode); } catch (e) {}
                    }
                } else {
                    window.location.href = base + 'pages/curriculum.html#' + unitCode;
                }
                return;
            }

            // 5. Section on IA page (Criteria, Guide, Exemplars, Videos)
            if (item.targetTab && window.location.pathname.indexOf('ia.html') !== -1) {
                var tabBtn = document.getElementById('tab-btn-' + item.targetTab) || document.querySelector('[data-tab="' + item.targetTab + '"]');
                if (tabBtn) tabBtn.click();
                var targetPane = document.getElementById('pane-' + item.targetTab);
                if (targetPane) targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
                try { history.pushState(null, '', '#' + item.targetTab); } catch (e) {}
                return;
            }

            // 6. Any other Page or Section URL
            if (item.url) {
                var curUrl = window.location.href.split('?')[0].split('#')[0].toLowerCase();
                var destUrlObj = new URL(item.url, window.location.href);
                var targetUrlClean = destUrlObj.href.split('?')[0].split('#')[0].toLowerCase();

                // Check if navigating to the same page without new query/hash
                if (curUrl === targetUrlClean && !destUrlObj.hash && !destUrlObj.search) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    showSiteToast('Already viewing this page');
                    return;
                }

                // If same page with hash
                if (curUrl === targetUrlClean && destUrlObj.hash) {
                    var hashId = destUrlObj.hash.replace(/^#/, '');
                    var el = document.getElementById(hashId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        el.classList.add('highlight-pulse');
                        setTimeout(function () { el.classList.remove('highlight-pulse'); }, 2500);
                    }
                    try { history.pushState(null, '', destUrlObj.hash); } catch (e) {}
                    return;
                }

                window.location.href = item.url;
            }
        }

        input.addEventListener('input', function () {
            renderResults(input.value);
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                updateSelection(selectedIndex + 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                updateSelection(selectedIndex - 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                var selectedRow = results.querySelector('.cmd-item.is-selected');
                if (selectedRow) selectedRow.click();
            } else if (e.key === 'Escape') {
                closePalette();
            }
        });

        closeBtn.addEventListener('click', closePalette);
        palette.addEventListener('click', function (e) {
            if (e.target === palette) closePalette();
        });

        // Global Keyboard shortcut: Ctrl+K or Cmd+K
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                if (palette.hidden) {
                    e.preventDefault();
                    openPalette();
                } else {
                    e.preventDefault();
                    closePalette();
                }
            }
        });

        window.openGlobalSearchPalette = openPalette;

        return {
            open: openPalette,
            close: closePalette
        };
    }

    /* ------------------------------------------------------------------
       2. Header System: Website Config Dropdown & Navigation Popover
       ------------------------------------------------------------------ */
    function initHeader(ribbons) {
        var header = document.querySelector('.site-header');
        if (!header) return;
        var bar = header.querySelector('.wrap');
        if (!bar) return;

        var baseAttr = document.documentElement.getAttribute('data-base');
        var isSubdir = window.location.pathname.replace(/\\/g, '/').toLowerCase().indexOf('/pages/') !== -1;
        var base = (baseAttr !== null && baseAttr !== undefined) ? (baseAttr || './') : (isSubdir ? '../' : './');
        var currentPath = window.location.pathname.replace(/\\/g, '/').replace(/\/$/, '') || '/index.html';

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
           0. Global Command Palette / Search Trigger Button
           ------------------------------------------------------------- */
        var cmdPalette = initCommandPalette(base);

        var isMac = /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent || navigator.platform || '');
        var shortcutLabel = isMac ? '⌘K' : 'Ctrl K';
        var shortcutAria = isMac ? 'Search resources, topics, and syllabus (Cmd+K)' : 'Search resources, topics, and syllabus (Ctrl+K)';

        var searchBtn = document.createElement('button');
        searchBtn.type = 'button';
        searchBtn.className = 'header-search-btn';
        searchBtn.id = 'header-search-trigger';
        searchBtn.setAttribute('aria-label', shortcutAria);
        searchBtn.setAttribute('title', isMac ? 'Search (Cmd+K)' : 'Search (Ctrl+K)');
        searchBtn.setAttribute('aria-haspopup', 'dialog');
        searchBtn.setAttribute('aria-expanded', 'false');
        searchBtn.setAttribute('aria-controls', 'global-cmd-palette');
        searchBtn.innerHTML =
            '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"></circle><path d="M13 13l4 4" stroke-linecap="round"></path></svg>' +
            '<span class="header-search-label">Search...</span>' +
            '<kbd class="header-search-kbd">' + shortcutLabel + '</kbd>';

        searchBtn.addEventListener('click', function () {
            if (cmdPalette) cmdPalette.open();
        });
        tools.appendChild(searchBtn);

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

        // Global Website Color Scheme (Theme Mode) Controller
        window.toggleScheme = function (explicitMode) {
            if (explicitMode && (explicitMode === 'dark' || explicitMode === 'light' || explicitMode === 'system')) {
                applyMode(explicitMode);
                return explicitMode;
            }
            var current = root.getAttribute('data-mode') || 'dark';
            var next = current === 'dark' ? 'light' : 'dark';
            applyMode(next);
            return next;
        };

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
            if (configPopover.classList.contains('is-open')) {
                closeDropdownFromTrigger(configBtn, configPopover);
            } else {
                openDropdownFromTrigger(configBtn, configPopover);
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
                '<a href="' + base + 'pages/deadlines.html" class="popover-link" data-page="deadlines.html"><span>Deadlines & Announcements</span><span class="popover-tag">Calendar</span></a>' +
                '<a href="' + base + 'pages/curriculum.html" class="popover-link" data-page="curriculum.html"><span>Syllabus</span></a>' +
                '<a href="' + base + 'pages/resources.html" class="popover-link" data-page="resources.html"><span>Resources</span></a>' +
            '</div>' +
            '<div class="popover-group">' +
                '<div class="popover-heading">Info</div>' +
                '<a href="' + base + 'pages/ia.html" class="popover-link" data-page="ia.html"><span>Internal Assessment (IA)</span><span class="popover-tag">30 Marks</span></a>' +
                '<a href="' + base + 'pages/case-study.html" class="popover-link" data-page="case-study.html"><span>Case Study (Paper 1)</span><span class="popover-tag">2027</span></a>' +
            '</div>' +
            '<div class="popover-group">' +
                '<div class="popover-heading">More</div>' +
                '<a href="' + base + 'pages/about-us.html" class="popover-link" data-page="about-us.html"><span>About Us</span></a>' +
                '<a href="' + base + 'pages/feedback.html" class="popover-link" data-page="feedback.html"><span>Feedback &amp; Requests</span></a>' +
                '<a href="' + base + 'pages/admin.html" class="popover-link" data-page="admin.html"><span>Admin</span></a>' +
            '</div>';

        menuPopover.querySelectorAll('.popover-link').forEach(function (link) {
            var pageTarget = link.getAttribute('data-page');
            if (
                currentPath.endsWith(pageTarget) ||
                (pageTarget === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')))
            ) {
                link.setAttribute('aria-current', 'page');
            }
        });

        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (menuPopover.classList.contains('is-open')) {
                closeDropdownFromTrigger(menuBtn, menuPopover);
            } else {
                openDropdownFromTrigger(menuBtn, menuPopover);
            }
        });

        menuWrap.appendChild(menuBtn);
        menuWrap.appendChild(menuPopover);
        tools.appendChild(menuWrap);

        var burgerGlow = document.createElement('div');
        burgerGlow.className = 'burger-radial-glow';
        burgerGlow.setAttribute('aria-hidden', 'true');
        menuWrap.appendChild(burgerGlow);

        var popoverHint = document.createElement('div');
        popoverHint.className = 'popover-lost-hint';
        popoverHint.id = 'popover-lost-hint';
        popoverHint.hidden = true;
        popoverHint.innerHTML =
            '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>' +
            '<span>Tip: You can use this burger menu anytime to jump to IA &amp; Case Study!</span>';
        menuPopover.insertBefore(popoverHint, menuPopover.firstChild);

        // Discovery trigger when navigating from the Resources "Lost?" helper
        try {
            var isFromLost = false;
            if (window.location.search && window.location.search.indexOf('from=lost') !== -1) {
                isFromLost = true;
            }
            if (isFromLost) {
                setTimeout(function () {
                    if (menuBtn && menuPopover) {
                        openDropdownFromTrigger(menuBtn, menuPopover);

                        if (burgerGlow) {
                            burgerGlow.classList.remove('is-pulsing');
                            void burgerGlow.offsetWidth; // Reflow to guarantee single fresh pulse
                            burgerGlow.classList.add('is-pulsing');
                        }
                        menuBtn.classList.add('is-hint-pulsing');

                        if (popoverHint) {
                            popoverHint.hidden = false;
                        }

                        // Remove pulsing classes after animation cycle finishes
                        setTimeout(function () {
                            if (burgerGlow) burgerGlow.classList.remove('is-pulsing');
                            if (menuBtn) menuBtn.classList.remove('is-hint-pulsing');
                        }, 1800);

                        // Clean up URL without page refresh so bookmarks/reloads stay clean
                        if (window.history && window.history.replaceState) {
                            var cleanUrl = window.location.pathname + window.location.hash;
                            window.history.replaceState(null, '', cleanUrl);
                        }
                    }
                }, 380);
            }
        } catch (e) {
            // Safe fallback
        }

        /* -------------------------------------------------------------
           C. Universal Keyboard & Outside Click Listeners
           ------------------------------------------------------------- */
        document.addEventListener('click', function (e) {
            if (!configWrap.contains(e.target)) closeDropdownFromTrigger(configBtn, configPopover);
            if (!menuWrap.contains(e.target)) closeDropdownFromTrigger(menuBtn, menuPopover);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (configPopover.classList.contains('is-open')) {
                    closeDropdownFromTrigger(configBtn, configPopover);
                    configBtn.focus();
                }
                if (menuPopover.classList.contains('is-open')) {
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
       2. Undulating Ribbon Waves Engine (Universal Zen Atelier Edition)
       Organic multi-harmonic silk ribbons with palette-adaptive reactive
       tracking, zero-lag exponential damping, continuous Gaussian parting,
       dynamic velocity wake, and subtle ambient crest accentuation across
       all five color palettes (Lilac, Monochrome, Crimson, Matcha, Clay)
       in both Dark and Light modes. Pauses when hidden or when static.
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
        var veilRgb = '167, 139, 250';
        var crestRgb = '196, 181, 253';
        var strength = 1.25;
        var isDarkMode = true;
        var frame = 0;
        var running = false;

        // Inertial Cursor & Velocity State
        var targetX = 0, targetY = 0;
        var currentX = 0, currentY = 0;
        var prevX = 0, prevY = 0;
        var vx = 0, vy = 0;
        var mouseAlpha = 0;
        var mouseActive = false;

        // Interactive Click / Tap Micro-Ripples
        var ripples = [];

        function isStill() {
            return root.getAttribute('data-texture') === 'static';
        }

        function readColour() {
            var styles = getComputedStyle(root);
            veilRgb = (styles.getPropertyValue('--ribbon') || '167, 139, 250').trim();
            crestRgb = (styles.getPropertyValue('--ribbon-crest') || veilRgb).trim();
            strength = parseFloat(styles.getPropertyValue('--ribbon-strength')) || 1.15;
            isDarkMode = (root.getAttribute('data-mode') || 'dark') !== 'light';
        }

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (!mouseActive) {
                targetX = currentX = prevX = width / 2;
                targetY = currentY = prevY = height / 2;
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
            // Visibly flowing slowTime rate (smooth, graceful laminar motion)
            var slowTime = still ? 100 : (now || performance.now()) * 0.0014;

            // Slower, gentle laminar inertia (luxurious relaxed response)
            currentX += (targetX - currentX) * 0.075;
            currentY += (targetY - currentY) * 0.075;
            var instVx = currentX - prevX;
            var instVy = currentY - prevY;
            vx += (instVx - vx) * 0.10;
            vy += (instVy - vy) * 0.10;
            prevX = currentX;
            prevY = currentY;
            var cursorSpeed = Math.hypot(vx, vy);

            mouseAlpha += (((mouseActive && !still) ? 1 : 0) - mouseAlpha) * 0.06;

            ctx.clearRect(0, 0, width, height);

            // Clean expired micro-ripples
            if (ripples.length > 0) {
                ripples = ripples.filter(function (r) {
                    return (now - r.startTime) < r.duration;
                });
            }

            var spacing = height / (count + 1);
            var step = width < 640 ? 16 : 12;

            for (var i = 1; i <= count; i++) {
                var baseY = i * spacing;
                var ribbonProgress = i / count;

                // Organic multi-harmonic frequencies with graceful continuous flow
                var freq1 = 0.0016 + i * 0.00009;
                var freq2 = 0.0031 + i * 0.00015;
                var freq3 = 0.0010 + i * 0.00006;

                var speed1 = slowTime * (0.85 + i * 0.035);
                var speed2 = slowTime * (0.55 + i * 0.025);
                var speed3 = slowTime * 0.35;

                var amp1 = 15 + ribbonProgress * 17;
                var amp2 = 7 + ribbonProgress * 9;
                var amp3 = 4 + ribbonProgress * 6;

                // Subtle proximity factor to cursor Y
                var ribbonDistY = Math.abs(baseY - currentY);
                var ribbonProxY = Math.max(0, 1 - ribbonDistY / 180) * mouseAlpha;

                var points = [];

                for (var x = 0; x <= width + step; x += step) {
                    // Coupled multi-harmonic wave formula with organic vertical breathing
                    var wave = Math.sin(x * freq1 + speed1) * amp1 +
                               Math.cos(x * freq2 - speed2 + Math.sin(x * freq3 + speed3)) * amp2 +
                               Math.sin(x * freq3 * 1.5 - speed3 * 0.7) * amp3;
                    var y = baseY + wave;

                    // Subtle, gentle fluid deflection (less prominent, silky glide)
                    if (mouseAlpha > 0.005) {
                        var dx = x - currentX;
                        var dy = y - currentY;
                        var normDistSq = (dx * dx) / (280 * 280) + (dy * dy) / (160 * 160);

                        if (normDistSq < 1.0) {
                            var t = 1.0 - Math.sqrt(normDistSq);
                            var bell = t * t * (3 - 2 * t); // Smooth Hermite curve

                            // Soft continuous tangent with gentle 20px peak deflection
                            var smoothSign = dy / (Math.abs(dy) + 55);
                            var pushDist = smoothSign * bell * 20 * mouseAlpha;
                            y += pushDist;

                            // Gentle, subtle velocity wake (low prominence)
                            if (cursorSpeed > 0.4) {
                                var wakeFactor = Math.max(0, -(dx * vx + dy * vy) / (Math.hypot(dx, dy) * cursorSpeed + 0.001));
                                if (wakeFactor > 0) {
                                    var wakeAmp = Math.min(cursorSpeed * 0.08, 1.0) * bell * wakeFactor * mouseAlpha;
                                    y += Math.sin(dx * 0.035 - now * 0.007) * 2.8 * wakeAmp;
                                }
                            }
                        }
                    }

                    // Click/Tap Soft Micro-Ripples
                    for (var r = 0; r < ripples.length; r++) {
                        var rip = ripples[r];
                        var rElapsed = now - rip.startTime;
                        if (rElapsed > 0 && rElapsed < rip.duration) {
                            var rProg = rElapsed / rip.duration;
                            var currR = rProg * rip.maxRadius;
                            var rDist = Math.hypot(x - rip.x, (y - rip.y) * 1.5);
                            var deltaR = Math.abs(rDist - currR);
                            if (deltaR < 60) {
                                var ringFactor = (1 - deltaR / 60) * (1 - rProg);
                                y += Math.sin(deltaR * 0.15) * 5 * ringFactor;
                            }
                        }
                    }

                    points.push({ x: x, y: y });
                }

                if (points.length < 2) continue;

                // Volumetric silk ribbon veil with understated luminance
                var veilHeight = spacing * 1.55;
                var baseFillAlpha = 0.016 + ribbonProgress * 0.036;
                var activeFillAlpha = isDarkMode
                    ? baseFillAlpha * (1 + ribbonProxY * 0.16)
                    : baseFillAlpha * (1 + ribbonProxY * 0.10);

                ctx.beginPath();
                trace(points);
                ctx.lineTo(width, baseY + veilHeight);
                ctx.lineTo(0, baseY + veilHeight);
                ctx.closePath();

                var grad = ctx.createLinearGradient(0, baseY - 20, 0, baseY + veilHeight);
                grad.addColorStop(0, veilColour(activeFillAlpha * 1.65));
                grad.addColorStop(0.5, veilColour(activeFillAlpha * 0.45));
                grad.addColorStop(1, veilColour(0));
                ctx.fillStyle = grad;
                ctx.fill();

                // Crisp crest hairline stroke with soft, restrained accentuation
                ctx.beginPath();
                trace(points);
                var baseStrokeAlpha = 0.09 + ribbonProgress * 0.24;
                var activeStrokeAlpha = isDarkMode
                    ? Math.min(1, baseStrokeAlpha * (1 + ribbonProxY * 0.20))
                    : Math.min(1, baseStrokeAlpha * (1 + ribbonProxY * 0.12));
                var activeLineWidth = (0.90 + ribbonProgress * 0.48) + ribbonProxY * 0.14;

                ctx.strokeStyle = crestColour(activeStrokeAlpha);
                ctx.lineWidth = activeLineWidth;
                ctx.stroke();
            }

            // Soft, understated ambient luminescence for Dark Mode
            if (isDarkMode && mouseAlpha > 0.01) {
                var glowRadius = Math.min(width, height) * 0.28;
                var glowGrad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, glowRadius);
                glowGrad.addColorStop(0, 'rgba(' + crestRgb + ', ' + (0.028 * mouseAlpha * strength).toFixed(4) + ')');
                glowGrad.addColorStop(0.40, 'rgba(' + veilRgb + ', ' + (0.009 * mouseAlpha * strength).toFixed(4) + ')');
                glowGrad.addColorStop(1, 'rgba(' + veilRgb + ', 0)');
                ctx.fillStyle = glowGrad;
                ctx.fillRect(currentX - glowRadius, currentY - glowRadius, glowRadius * 2, glowRadius * 2);
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

        function onTouchMove(e) {
            if (e.touches && e.touches[0]) {
                targetX = e.touches[0].clientX;
                targetY = e.touches[0].clientY;
                mouseActive = true;
            }
        }

        window.addEventListener('mousemove', onCursorMove, { passive: true });
        window.addEventListener('pointermove', onCursorMove, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });

        window.addEventListener('pointerdown', function (e) {
            if (isStill()) return;
            ripples.push({
                x: e.clientX,
                y: e.clientY,
                startTime: performance.now(),
                maxRadius: Math.min(width, 400),
                duration: 750
            });
            if (ripples.length > 4) ripples.shift();
        }, { passive: true });

        window.addEventListener('mouseleave', function () {
            mouseActive = false;
        });

        document.documentElement.addEventListener('pointerleave', function () {
            mouseActive = false;
        });

        window.addEventListener('touchend', function () {
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
       3. Academic Mark Scheme Reveal Helper (Fallback)
       ------------------------------------------------------------------ */
    window.toggleMarkScheme = function (btn) {
        if (!btn) return;
        var scheme = btn.nextElementSibling || (btn.closest && (btn.closest('.qotd-card') || btn.parentElement).querySelector('.mark-scheme-box'));
        if (!scheme) return;
        var isOpen = scheme.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.innerHTML = isOpen
            ? '<span>Hide Mark Scheme</span><span aria-hidden="true">&#9650;</span>'
            : '<span>Show Mark Scheme</span><span aria-hidden="true">&#9660;</span>';
    };

    /* ------------------------------------------------------------------
       4. Universal Tab Controller (Revision Village / Zen Atelier)
       ------------------------------------------------------------------ */
    window.initTabs = function (tabSelector, paneSelector, options) {
        var tabs = document.querySelectorAll(tabSelector || '.rv-tab-btn');
        var panes = document.querySelectorAll(paneSelector || '.tab-pane');
        var prefix = (options && options.prefix) || 'pane-';
        if (!tabs.length || !panes.length) return null;

        function switchTab(tabId) {
            tabs.forEach(function (btn) {
                var isTarget = btn.getAttribute('data-tab') === tabId;
                btn.classList.toggle('active', isTarget);
                btn.classList.toggle('is-active', isTarget);
                btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
            });

            panes.forEach(function (pane) {
                var isTarget = pane.id === prefix + tabId;
                pane.classList.toggle('active', isTarget);
            });
        }

        tabs.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tabId = this.getAttribute('data-tab');
                if (tabId) {
                    switchTab(tabId);
                    if (window.history && window.history.replaceState) {
                        window.history.replaceState(null, '', '#' + tabId);
                    }
                }
            });
        });

        var hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(prefix + hash)) {
            switchTab(hash);
        }

        return { switchTab: switchTab };
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
