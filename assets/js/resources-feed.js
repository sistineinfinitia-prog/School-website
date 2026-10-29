/**
 * Highwood / EIS Computer Science: Teacher Drops Feed & Resource Hub
 * Renders chronological teacher-uploaded resources, cross-links to Deadlines,
 * handles live Firebase Realtime Database sync, topic filtering, and tab switching.
 * Completely resilient to offline / file:// protocol loading.
 */
(function () {
    'use strict';

    const BASE = document.documentElement.getAttribute('data-base') || '';

    // Elements
    const feedContainer = document.getElementById('teacher-drops-container');
    const searchInput = document.getElementById('resource-search-input');
    const topicChips = document.querySelectorAll('.topic-chip');
    const sortBtn = document.getElementById('sort-toggle-btn');
    const sortLabel = document.getElementById('sort-order-label');
    const tabBtns = document.querySelectorAll('.resources-tab-btn');
    const dropsTabPane = document.getElementById('tab-pane-drops');
    const archiveTabPane = document.getElementById('tab-pane-archive');
    const dropsCountBadge = document.getElementById('drops-count-badge');
    const searchSummary = document.getElementById('resource-search-summary');

    // Bundled fallback teacher drops (ensures instant zero-latency load in all environments)
    const STATIC_DROPS = [
        {
            id: 'res-spotlight-01',
            date: '2026-10-26',
            title: '85-Min Interactive Networks Lab & Protocol Simulator',
            topic: 'Theme A',
            topicCode: 'A.2 Networks',
            cohort: 'Year 1 (SL/HL)',
            fileType: 'Interactive Lab',
            fileSize: 'Simulation',
            fileUrl: '../resources/Theme A/A2 _ Networks/networking_lesson_85min.html',
            note: 'Simulate packet switching, IP addressing, OSI layers, topologies, routing protocols, and firewall packet inspection in an interactive browser lab.',
            isSpotlight: true,
            badgeText: 'Core Lab',
            primaryLabel: 'Launch Simulator',
            connectedDeadlineId: 'dl-01',
            connectedAnnouncementId: null
        },
        {
            id: 'res-drop-01',
            date: '2026-10-25',
            title: 'A1.1 Computer Fundamentals & CPU Bus Schematics Workbook',
            topic: 'Theme A',
            topicCode: 'A.1',
            cohort: 'Year 1 (SL/HL)',
            fileType: 'DOCX',
            fileSize: '28 KB',
            fileUrl: '../resources/Theme A/Theory Questions -B1,B2.docx',
            note: 'Complete problems 1 through 14 prior to Thursday\'s revision clinic. Focus especially on pipeline registers (MAR, MDR, CIR) and memory bus traffic during the fetch stage.',
            connectedDeadlineId: 'dl-01',
            connectedAnnouncementId: 'midterm-schedule-clinics'
        },
        {
            id: 'res-spotlight-02',
            date: '2026-10-24',
            title: 'IB Python 2026 Master Handbook (Paper 2 & OOP)',
            topic: 'Theme B',
            topicCode: 'B.1 & B.2',
            cohort: 'Both Cohorts',
            fileType: 'DOCX',
            fileSize: '1.4 MB',
            fileUrl: '../resources/Theme B/IB Python 2026.docx',
            note: 'Complete handbook for Paper 2: syntax, trace tables, arrays, recursion, and Object-Oriented Programming (OOP) paradigms.',
            isSpotlight: true,
            badgeText: 'Master Guide',
            primaryLabel: 'Download Python Guide',
            connectedDeadlineId: 'dl-03',
            connectedAnnouncementId: 'ia-criterion-b-c'
        },
        {
            id: 'res-drop-02',
            date: '2026-10-22',
            title: 'Criterion B System Architecture & Test Plan Blueprint',
            topic: 'IA',
            topicCode: 'Criterion B',
            cohort: 'Year 2 (SL/HL)',
            fileType: 'PDF',
            fileSize: '1.4 MB',
            fileUrl: '../resources/IA/Computer Science Assessed Student Work 2027 (1).pdf',
            note: 'Official high-scoring sample showing how system decomposition diagrams, test matrices, and boundary value cases must map directly back to Criterion A success criteria.',
            connectedDeadlineId: 'dl-02',
            connectedAnnouncementId: 'crit-b-peer-review'
        },
        {
            id: 'res-spotlight-03',
            date: '2026-10-21',
            title: 'Theory Questions & Official Teacher Marking Scheme Pack',
            topic: 'Revision',
            topicCode: 'Exam Prep',
            cohort: 'Both Cohorts',
            fileType: 'DOCX Pack',
            fileSize: '76 KB',
            fileUrl: '../resources/Theme A/Theory Questions -B1,B2.docx',
            secondaryUrl: '../resources/Theme A/answers_.docx',
            secondaryLabel: 'Mark Scheme',
            primaryLabel: 'Questions',
            note: 'Comprehensive Paper 1 questions covering Theme A & Theme B concepts paired directly with official teacher mark scheme solutions.',
            isSpotlight: true,
            badgeText: 'Exam Prep',
            connectedDeadlineId: 'dl-01',
            connectedAnnouncementId: null
        },
        {
            id: 'res-drop-03',
            date: '2026-10-18',
            title: 'Python Debugging & Syntax Error Diagnostic Handbook',
            topic: 'Theme B',
            topicCode: 'B.2',
            cohort: 'Both Cohorts',
            fileType: 'PDF',
            fileSize: '2.8 MB',
            fileUrl: '../resources/Error log - Python Programming.pdf',
            note: 'Required reference for Paper 2 programming and IA Criterion C implementation. Includes error logs, exception handling patterns, and common algorithmic pitfalls.',
            connectedDeadlineId: 'dl-03',
            connectedAnnouncementId: 'ia-criterion-b-c'
        },
        {
            id: 'res-spotlight-04',
            date: '2026-10-16',
            title: 'Mini Project & IA Coursework Submission Walkthrough',
            topic: 'IA',
            topicCode: 'IA Milestone',
            cohort: 'Year 1 (SL/HL)',
            fileType: 'PPTX',
            fileSize: '2.4 MB',
            fileUrl: '../resources/Theme A/Mini Project/Mini Project and IA Submission .pptx',
            note: 'Hands-on simulation deck connecting architecture and database theory directly into IB Internal Assessment coursework.',
            isSpotlight: true,
            badgeText: 'Coursework Deck',
            primaryLabel: 'Download Deck',
            connectedDeadlineId: 'dl-02',
            connectedAnnouncementId: 'crit-b-peer-review'
        },
        {
            id: 'res-drop-04',
            date: '2026-10-14',
            title: 'Relational vs Non-Relational Database Scenarios & Worked Answers',
            topic: 'Theme A',
            topicCode: 'A.3',
            cohort: 'Year 1 (SL/HL)',
            fileType: 'PDF',
            fileSize: '204 KB',
            fileUrl: '../resources/Revision Folder/Theme A/A1 -Database/Activity- Relational vs NonRelational Scenarios.pdf',
            note: 'Case-based scenario exercises distinguishing ACID SQL models from document/key-value NoSQL schemas. Recommended revision for unit tests.',
            connectedDeadlineId: 'dl-01',
            connectedAnnouncementId: null
        },
        {
            id: 'res-drop-05',
            date: '2026-10-09',
            title: 'Comprehensive IB Computer Science Core Practice Paper',
            topic: 'Revision',
            topicCode: 'Core Practice',
            cohort: 'Both Cohorts',
            fileType: 'DOCX',
            fileSize: '29 KB',
            fileUrl: '../resources/Overall Practice Papers/IB Computer Science Worksheet.docx',
            note: 'Multi-topic past paper consolidation set covering computer fundamentals, logic circuits, network topology, and Python trace tables.',
            connectedDeadlineId: 'dl-01',
            connectedAnnouncementId: null
        },
        {
            id: 'res-drop-06',
            date: '2026-10-05',
            title: 'Theme A & B Core Theory Worked Answers & Mark Schemes',
            topic: 'Revision',
            topicCode: 'A.1 & B.1',
            cohort: 'Both Cohorts',
            fileType: 'DOCX',
            fileSize: '48 KB',
            fileUrl: '../resources/Theme A/answers_.docx',
            note: 'Exemplar responses with teacher annotations explaining common command term deductions (e.g. outline vs explain vs evaluate).',
            connectedDeadlineId: 'dl-00',
            connectedAnnouncementId: 'syllabus-2027-resources'
        },
        {
            id: 'res-drop-07',
            date: '2026-09-28',
            title: 'Lesson 2: Git Version Control & Deployment Slide Deck',
            topic: 'Theme B',
            topicCode: 'B.2',
            cohort: 'Year 1 (SL/HL)',
            fileType: 'PPTX',
            fileSize: '253 KB',
            fileUrl: '../resources/Lesson2_GitHub_Deployment.pptx',
            note: 'Presentation slides covering branch workflows, pull requests, semantic commits, and hosting project documentation online.',
            connectedDeadlineId: null,
            connectedAnnouncementId: null
        }
    ];

    // Fallback deadlines for immediate cross-linking
    const STATIC_DEADLINES = [
        { id: 'dl-00', title: 'Paper 1 Diagnostic Assessment: Logic Gates & Truth Tables', date: '2026-10-15' },
        { id: 'dl-01', title: 'Paper 1 Unit Test: Computer Fundamentals & Networks', date: '2026-11-05' },
        { id: 'dl-02', title: 'IA Milestone 1: Client Problem Definition & Success Criteria (Criterion A)', date: '2026-11-12' },
        { id: 'dl-03', title: 'Paper 2 Unit Test: Python Algorithms & Trace Tables', date: '2026-11-26' },
        { id: 'dl-04', title: 'IA Milestone 2: System Architecture & Test Plan (Criterion B)', date: '2026-12-03' },
        { id: 'dl-05', title: 'Term 1 Mock Examinations (Paper 1 & Paper 2)', date: '2026-12-10' }
    ];

    let allDrops = [...STATIC_DROPS];
    let deadlinesMap = new Map();
    STATIC_DEADLINES.forEach(dl => deadlinesMap.set(dl.id, dl));

    let currentTopic = 'all';
    let searchQuery = '';
    let sortDescending = true; // Newest first

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        if (Number.isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    function calculateCountdown(targetDateStr) {
        if (!targetDateStr) return null;
        const target = new Date(targetDateStr + 'T23:59:59');
        const now = new Date();
        const diffMs = target.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            const pastDays = Math.abs(diffDays);
            return pastDays === 1 ? 'Past due (yesterday)' : `Past due (${pastDays}d ago)`;
        }
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `Due in ${diffDays} days`;
    }

    function sanitize(str) {
        return (str || '').replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

    async function loadDeadlinesAsync() {
        try {
            const res = await fetch(BASE + 'data/deadlines.json', { cache: 'no-cache' });
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data)) {
                data.forEach(dl => deadlinesMap.set(dl.id, dl));
                renderFeed();
            }
        } catch (e) {
            // Silently maintain STATIC_DEADLINES
        }
    }

    async function loadFallbackDropsAsync() {
        try {
            const res = await fetch(BASE + 'data/teacher-resources.json', { cache: 'no-cache' });
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data) && data.length) {
                // Merge static items with fetched items
                const map = new Map();
                data.forEach(item => { if (item.id) map.set(item.id, item); });
                allDrops.forEach(item => { if (!map.has(item.id)) map.set(item.id, item); });
                allDrops = Array.from(map.values());
                renderFeed();
            }
        } catch (e) {
            // Silently maintain STATIC_DROPS
        }
    }

    function createDropCard(drop) {
        const card = document.createElement('article');
        card.className = 'resource-card' + (drop.isSpotlight ? ' is-spotlight' : '');
        card.setAttribute('data-id', drop.id || '');

        const formattedDate = formatDate(drop.date);
        const formatBadge = drop.fileType ? `<span class="format-chip">${sanitize(drop.fileType)}</span>` : '';
        const topicCode = drop.topicCode ? `<span class="topic-tag-code">${sanitize(drop.topicCode)}</span>` : '';
        const cohortTag = drop.cohort ? `<span class="cohort-tag-code">${sanitize(drop.cohort)}</span>` : '';
        const spotlightTag = drop.isSpotlight ? `<span class="spotlight-tag-code">★ ${sanitize(drop.badgeText || 'Spotlight')}</span>` : '';

        // Connected Assessment / Announcement Box
        let connectedHtml = '';
        if (drop.connectedDeadlineId && deadlinesMap.has(drop.connectedDeadlineId)) {
            const dl = deadlinesMap.get(drop.connectedDeadlineId);
            const countdown = calculateCountdown(dl.date);
            const targetUrl = `${BASE}pages/deadlines.html?id=${encodeURIComponent(drop.connectedDeadlineId)}`;

            connectedHtml = `
                <a class="resource-connected-box" href="${targetUrl}" title="View linked assessment in Deadlines">
                    <div class="resource-connected-info">
                        <span class="resource-connected-prefix">Linked Assessment //</span>
                        <span class="resource-connected-title">${sanitize(dl.title)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        ${countdown ? `<span class="resource-countdown-mono">${sanitize(countdown)}</span>` : ''}
                        <span class="resource-connected-arrow" aria-hidden="true">&rarr;</span>
                    </div>
                </a>
            `;
        } else if (drop.connectedDeadlineId) {
            const targetUrl = `${BASE}pages/deadlines.html?id=${encodeURIComponent(drop.connectedDeadlineId)}`;
            connectedHtml = `
                <a class="resource-connected-box" href="${targetUrl}" title="View linked assessment">
                    <div class="resource-connected-info">
                        <span class="resource-connected-prefix">Linked Assessment //</span>
                        <span class="resource-connected-title">${sanitize(drop.connectedDeadlineId)}</span>
                    </div>
                    <span class="resource-connected-arrow" aria-hidden="true">&rarr;</span>
                </a>
            `;
        }

        // File URL & download handling
        let fileUrl = drop.fileUrl || '#';
        const isExternal = /^https?:\/\//i.test(fileUrl);
        const isInteractive = drop.fileType === 'Interactive Lab' || /\.html?$/i.test(fileUrl);
        const openAttr = isExternal || isInteractive || drop.fileType === 'PDF' ? 'target="_blank" rel="noopener"' : 'download';
        const defaultActionLabel = isInteractive ? 'Launch Simulator' : (isExternal ? 'Open Document' : (drop.fileType === 'PDF' ? 'View PDF' : 'Download File'));
        const actionLabel = drop.primaryLabel || defaultActionLabel;

        // Action Buttons (supports secondary links e.g. Questions + Mark Scheme)
        let actionsHtml = '';
        if (drop.secondaryUrl) {
            actionsHtml = `
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <a class="btn-resource-download" href="${sanitize(fileUrl)}" download>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span>${sanitize(actionLabel)}</span>
                    </a>
                    <a class="btn-resource-download btn-resource-secondary" href="${sanitize(drop.secondaryUrl)}" download>
                        <span>${sanitize(drop.secondaryLabel || 'Mark Scheme')}</span>
                    </a>
                </div>
            `;
        } else {
            actionsHtml = `
                <a class="btn-resource-download" href="${sanitize(fileUrl)}" ${openAttr}>
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>${sanitize(actionLabel)}</span>
                </a>
            `;
        }

        card.innerHTML = `
            <header class="resource-card-header">
                <div class="resource-meta-stamp">
                    <time datetime="${sanitize(drop.date)}" class="resource-stamp-date">${formattedDate}</time>
                    <span style="opacity: 0.4;">|</span>
                    ${topicCode}
                    ${cohortTag}
                    ${spotlightTag}
                </div>
                ${formatBadge}
            </header>

            <h3 class="resource-card-title">${sanitize(drop.title)}</h3>
            ${drop.note ? `<p class="resource-card-note">${sanitize(drop.note)}</p>` : ''}

            ${connectedHtml}

            <footer class="resource-card-footer">
                <div class="resource-file-meta">
                    ${drop.fileSize ? `<span>${sanitize(drop.fileSize)}</span>` : ''}
                    ${drop.topic ? `<span style="opacity: 0.4;">&bull;</span><span>${sanitize(drop.topic)}</span>` : ''}
                </div>
                ${actionsHtml}
            </footer>
        `;

        return card;
    }

    function renderFeed() {
        if (!feedContainer) return;

        const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

        const filtered = allDrops.filter(drop => {
            // Topic filter
            if (currentTopic !== 'all') {
                const topic = (drop.topic || '').toLowerCase();
                const code = (drop.topicCode || '').toLowerCase();
                const target = currentTopic.toLowerCase();
                if (!topic.includes(target) && !code.includes(target)) {
                    return false;
                }
            }

            // Search query filter
            if (terms.length) {
                let dlTitle = '';
                if (drop.connectedDeadlineId && deadlinesMap.has(drop.connectedDeadlineId)) {
                    dlTitle = deadlinesMap.get(drop.connectedDeadlineId).title || '';
                }
                const haystack = `${drop.title || ''} ${drop.note || ''} ${drop.topic || ''} ${drop.topicCode || ''} ${drop.cohort || ''} ${drop.fileType || ''} ${dlTitle}`.toLowerCase();
                const matches = terms.every(t => haystack.includes(t));
                if (!matches) return false;
            }

            return true;
        });

        // Sorting
        filtered.sort((a, b) => {
            const dateA = a.date || '';
            const dateB = b.date || '';
            return sortDescending ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
        });

        // Update counts
        if (dropsCountBadge) {
            dropsCountBadge.textContent = allDrops.length;
        }

        if (searchSummary) {
            if (terms.length || currentTopic !== 'all') {
                searchSummary.textContent = `Showing ${filtered.length} of ${allDrops.length} drops`;
            } else {
                searchSummary.textContent = `${allDrops.length} drops available`;
            }
        }

        feedContainer.textContent = '';

        if (!filtered.length) {
            const empty = document.createElement('div');
            empty.className = 'panel';
            empty.style.textAlign = 'center';
            empty.style.padding = '40px 20px';
            empty.innerHTML = `
                <p class="sub" style="margin: 0 0 12px 0;">No teacher drops matched your current filter.</p>
                <button type="button" class="btn btn-sm" id="reset-feed-filters-btn">Clear Search &amp; Filters</button>
            `;
            feedContainer.appendChild(empty);

            const resetBtn = empty.querySelector('#reset-feed-filters-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    searchQuery = '';
                    if (searchInput) searchInput.value = '';
                    currentTopic = 'all';
                    topicChips.forEach(c => c.classList.toggle('is-active', c.dataset.topic === 'all'));
                    renderFeed();
                });
            }
            return;
        }

        filtered.forEach(drop => {
            feedContainer.appendChild(createDropCard(drop));
        });
    }

    function setupEventListeners() {
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                tabBtns.forEach(b => {
                    const isActive = b === btn;
                    b.classList.toggle('is-active', isActive);
                    b.classList.toggle('active', isActive);
                    b.setAttribute('aria-selected', String(isActive));
                });

                if (target === 'drops') {
                    if (dropsTabPane) dropsTabPane.hidden = false;
                    if (archiveTabPane) archiveTabPane.hidden = true;
                } else if (target === 'archive') {
                    if (dropsTabPane) dropsTabPane.hidden = true;
                    if (archiveTabPane) archiveTabPane.hidden = false;
                }
            });
        });

        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                searchQuery = searchInput.value.trim();
                renderFeed();
            });
        }

        // Topic Chips
        topicChips.forEach(chip => {
            chip.addEventListener('click', () => {
                topicChips.forEach(c => c.classList.remove('is-active'));
                chip.classList.add('is-active');
                currentTopic = chip.dataset.topic || 'all';
                renderFeed();
            });
        });

        // Sort toggle
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                sortDescending = !sortDescending;
                if (sortLabel) {
                    sortLabel.textContent = sortDescending ? 'Newest First' : 'Oldest First';
                }
                renderFeed();
            });
        }

        // Handle URL hash and query params on initial load
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const paramTab = urlParams.get('tab');
            const paramTopic = urlParams.get('topic');
            const paramSearch = urlParams.get('search');

            if (paramTab === 'archive' || window.location.hash === '#archive') {
                const archiveBtn = document.querySelector('[data-tab="archive"]');
                if (archiveBtn) archiveBtn.click();
            }

            if (paramTopic) {
                topicChips.forEach(chip => {
                    const isMatch = (chip.dataset.topic || '').toLowerCase() === paramTopic.toLowerCase();
                    chip.classList.toggle('is-active', isMatch);
                    if (isMatch) currentTopic = chip.dataset.topic;
                });
            }

            if (paramSearch) {
                searchQuery = paramSearch.trim();
                if (searchInput) searchInput.value = searchQuery;
            }
        } catch (e) {
            if (window.location.hash === '#archive') {
                const archiveBtn = document.querySelector('[data-tab="archive"]');
                if (archiveBtn) archiveBtn.click();
            }
        }
    }

    // Optional background Firebase sync (never blocks initial render)
    function initFirebaseBackgroundSync() {
        if (window.location.protocol === 'file:') return; // Skip under file://
        try {
            import('./config.js').then(({ db, ref }) => {
                import('https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js').then(({ onValue }) => {
                    const dropsRef = ref(db, 'teacher_resources');
                    onValue(dropsRef, (snapshot) => {
                        const val = snapshot.val();
                        if (!val) return;
                        const live = Object.keys(val).map(k => ({ id: k, ...val[k] }));
                        const liveMap = new Map();
                        live.forEach(item => { if (item.id) liveMap.set(item.id, item); });

                        const merged = [...live];
                        STATIC_DROPS.forEach(item => {
                            if (!liveMap.has(item.id)) merged.push(item);
                        });
                        allDrops = merged;
                        renderFeed();
                    }, (err) => {
                        console.warn('Firebase RTDB read note (using static cache):', err.message || err);
                    });
                }).catch(() => {});
            }).catch(() => {});
        } catch (e) {
            // Firebase optional
        }
    }

    function init() {
        setupEventListeners();
        renderFeed(); // Instant zero-latency render!
        loadDeadlinesAsync();
        loadFallbackDropsAsync();
        initFirebaseBackgroundSync();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
