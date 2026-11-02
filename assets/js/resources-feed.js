/**
 * IB Computer Science | Emirates International School Meadows
 * resources-feed.js - Teacher Drops Stream, Inline Upload Studio & ManageBac Integration
 * Supports offline-first persistence via DataService + live Firebase RTDB sync.
 */
(function () {
    'use strict';

    const BASE = document.documentElement.getAttribute('data-base') || '';
    const SAVED_DROPS_KEY = 'eis_saved_resource_ids';
    const VIEW_MODE_KEY = 'eis_resources_view_mode';

    // DOM Elements: Feed & Filters
    const feedContainer = document.getElementById('teacher-drops-container');
    const searchInput = document.getElementById('resource-search-input');
    const clearSearchBtn = document.getElementById('btn-clear-drop-search');
    const topicChips = document.querySelectorAll('.topic-chip');
    const cohortSelect = document.getElementById('filter-cohort-select');
    const formatSelect = document.getElementById('filter-format-select');
    const sortBtn = document.getElementById('sort-toggle-btn');
    const sortLabel = document.getElementById('sort-order-label');
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const tabBtns = document.querySelectorAll('.resources-tab-btn');
    const dropsTabPane = document.getElementById('tab-pane-drops');
    const archiveTabPane = document.getElementById('tab-pane-archive');
    const dropsCountBadge = document.getElementById('drops-count-badge');
    const savedDropsCountEl = document.getElementById('saved-drops-count');
    const searchSummary = document.getElementById('resource-search-summary');
    const archiveBridge = document.getElementById('cross-archive-bridge');
    const archiveBridgeText = document.getElementById('cross-archive-bridge-text');
    const jumpArchiveBtn = document.getElementById('btn-jump-archive-search');

    // DOM Elements: Faculty Studio & ManageBac
    const facultyBadge = document.getElementById('faculty-mode-badge');
    const lockFacultyBtn = document.getElementById('btn-lock-faculty');
    const openStudioBtn = document.getElementById('btn-open-drop-studio');
    const studioDrawer = document.getElementById('faculty-drop-studio');
    const studioAuthGate = document.getElementById('studio-auth-gate');
    const studioAuthForm = document.getElementById('studio-auth-form');
    const studioPasskeyInput = document.getElementById('studio-passkey-input');
    const studioAuthError = document.getElementById('studio-auth-error');
    const closeAuthStudioBtn = document.getElementById('btn-close-auth-studio');
    const studioComposer = document.getElementById('studio-composer-body');
    const closeStudioBtn = document.getElementById('btn-close-studio');
    const cancelDropBtn = document.getElementById('btn-cancel-drop');
    const studioFormHeading = document.getElementById('studio-form-heading');
    const sourceTabs = document.querySelectorAll('.studio-source-tab');
    const fileZoneWrap = document.getElementById('studio-file-zone-wrap');
    const mbParserWrap = document.getElementById('studio-mb-parser');
    const parseMbBtn = document.getElementById('btn-parse-mb-text');
    const mbRawPaste = document.getElementById('mb-raw-paste');
    const dropzone = document.getElementById('studio-dropzone');
    const fileInput = document.getElementById('studio-file-input');
    const dropzonePrimary = document.getElementById('dropzone-primary-text');
    const dropzoneSecondary = document.getElementById('dropzone-secondary-text');
    const dropForm = document.getElementById('resource-drop-form');
    const publishCopyMbBtn = document.getElementById('btn-publish-and-copy-mb');
    const studioStatusMsg = document.getElementById('studio-status-msg');
    const archiveDatalist = document.getElementById('archive-files-datalist');

    // Form Inputs
    const inputEditId = document.getElementById('drop-edit-id');
    const inputTitle = document.getElementById('drop-title-input');
    const inputDate = document.getElementById('drop-date-input');
    const selectTheme = document.getElementById('drop-theme-select');
    const selectUnit = document.getElementById('drop-unit-select');
    const inputCode = document.getElementById('drop-code-input');
    const selectCohort = document.getElementById('drop-cohort-select');
    const inputUrl = document.getElementById('drop-url-input');
    const platformPill = document.getElementById('detected-platform-pill');
    const selectFormat = document.getElementById('drop-format-select');
    const inputSize = document.getElementById('drop-size-input');
    const selectMbType = document.getElementById('drop-mb-type-select');
    const inputMbUrl = document.getElementById('drop-mb-url-input');
    const selectDeadline = document.getElementById('drop-deadline-select');
    const inputSecUrl = document.getElementById('drop-secondary-url');
    const inputSecLabel = document.getElementById('drop-secondary-label');
    const inputNote = document.getElementById('drop-note-input');
    const checkSpotlight = document.getElementById('drop-spotlight-check');

    // ManageBac Menu Elements
    const mbToggleBtn = document.getElementById('btn-managebac-toggle');
    const mbPopover = document.getElementById('managebac-popover');
    const mbLinkPortal = document.getElementById('mb-link-portal');
    const mbPortalDomain = document.getElementById('mb-portal-domain');
    const mbLinkIa = document.getElementById('mb-link-ia');
    const exportMbCsvBtn = document.getElementById('btn-export-mb-csv');
    const exportDropsJsonBtn = document.getElementById('btn-export-drops-json');
    const configMbUrlsBtn = document.getElementById('btn-config-mb-urls');
    const mbConfigForm = document.getElementById('mb-config-form');
    const mbInputPortal = document.getElementById('mb-input-portal');
    const mbInputIa = document.getElementById('mb-input-ia');
    const cancelMbConfigBtn = document.getElementById('btn-cancel-mb-config');

    // Preview Modal & Toast
    const previewModal = document.getElementById('res-preview-modal');
    const previewCode = document.getElementById('res-preview-code');
    const previewFormat = document.getElementById('res-preview-format');
    const previewTitle = document.getElementById('res-preview-title');
    const previewOpenBtn = document.getElementById('res-preview-open-btn');
    const previewCloseBtn = document.getElementById('res-preview-close');
    const previewBody = document.getElementById('res-preview-body');
    const toastEl = document.getElementById('res-toast');

    // State (1:1 with Practice & Syllabus)
    const SYLLABUS_UNITS = [
        { code: 'A1', name: 'Computer Fundamentals', theme: 'theme-a' },
        { code: 'A2', name: 'Networks', theme: 'theme-a' },
        { code: 'A3', name: 'Databases', theme: 'theme-a' },
        { code: 'A4', name: 'Machine Learning', theme: 'theme-a' },
        { code: 'B1', name: 'Computational Thinking', theme: 'theme-b' },
        { code: 'B2', name: 'Programming', theme: 'theme-b' },
        { code: 'B3', name: 'Object-Oriented Programming', theme: 'theme-b' },
        { code: 'B4', name: 'Abstract Data Types (ADTs)', theme: 'theme-b' },
        { code: 'CS', name: '2027 Case Study (Paper 1 Section B)', theme: 'theme-a' },
        { code: 'IA', name: 'Internal Assessment', theme: 'coursework' }
    ];

    let allDrops = [];
    let deadlinesMap = new Map();
    let archiveFlatFiles = [];
    let savedIds = new Set();
    let unitStates = {}; // code -> 'none' | 'included' | 'excluded'
    let matchMode = 'any'; // 'any' | 'within'
    let activePapers = new Set();
    let activeCohorts = new Set();
    let activeFormats = new Set();
    let statusFilter = 'all'; // 'all' | 'saved' | 'pinned'
    let searchQuery = '';
    let sortMode = 'newest'; // 'newest' | 'oldest' | 'code'
    let viewMode = localStorage.getItem(VIEW_MODE_KEY) || 'cards'; // 'cards' | 'table'
    let isFaculty = false;
    let toastTimer = null;

    // Unit -> Folder Path Mapping for automatic local file path suggestions
    const UNIT_FOLDER_PATHS = {
        'A1': '../resources/Theme A/A1 _Computer Fundamentals/',
        'A2': '../resources/Theme A/A2 _ Networks/',
        'A3': '../resources/Theme A/A3 _ Database/',
        'A4': '../resources/Theme A/',
        'B1': '../resources/Theme B/B1  _ Computational Thinking/',
        'B2': '../resources/Theme B/B2- Programming/',
        'B3': '../resources/Theme B/B3 oops/',
        'B4': '../resources/Theme B/',
        'IA': '../resources/IA/',
        'CS': '../resources/Curriculum/',
        'Revision': '../resources/Revision Folder/',
        'External': '../resources/'
    };

    function loadSavedIds() {
        try {
            const raw = localStorage.getItem(SAVED_DROPS_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            savedIds = new Set(Array.isArray(arr) ? arr : []);
        } catch (e) {
            savedIds = new Set();
        }
        updateSavedBadge();
    }

    function toggleSaveDrop(id) {
        if (!id) return;
        if (savedIds.has(id)) {
            savedIds.delete(id);
            showToast('Removed from saved resources');
        } else {
            savedIds.add(id);
            showToast('Saved resource for quick access');
        }
        try {
            localStorage.setItem(SAVED_DROPS_KEY, JSON.stringify(Array.from(savedIds)));
        } catch (e) {}
        updateSavedBadge();
        renderFeed();
    }

    function updateSavedBadge() {
        if (savedDropsCountEl) {
            savedDropsCountEl.textContent = String(savedIds.size);
        }
    }

    function showToast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.hidden = false;
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.hidden = true;
        }, 2800);
    }

    function sanitize(str) {
        return String(str || '').replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

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
            return pastDays === 1 ? 'Past due (1d ago)' : `Past due (${pastDays}d ago)`;
        }
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `Due in ${diffDays}d`;
    }

    function inferUnitFromDrop(drop) {
        if (drop.unit) return drop.unit;
        const code = (drop.topicCode || '').toUpperCase();
        const m = code.match(/\b(A[1-4]|B[1-4])\b/);
        if (m) return m[1];
        if (code.includes('A.1')) return 'A1';
        if (code.includes('A.2')) return 'A2';
        if (code.includes('A.3')) return 'A3';
        if (code.includes('A.4')) return 'A4';
        if (code.includes('B.1')) return 'B1';
        if (code.includes('B.2')) return 'B2';
        if (code.includes('B.3')) return 'B3';
        if (code.includes('B.4')) return 'B4';
        if ((drop.topic || '').toUpperCase().includes('IA') || code.includes('CRIT')) return 'IA';
        if ((drop.topic || '').toLowerCase().includes('case')) return 'CS';
        if ((drop.topic || '').toLowerCase().includes('revision')) return 'Revision';
        return drop.topic || 'General';
    }

    function classifyFormatGroup(drop) {
        const ft = (drop.fileType || '').toLowerCase();
        const url = (drop.fileUrl || '').toLowerCase();
        if (ft.includes('ppt') || ft.includes('slide') || url.endsWith('.pptx') || url.endsWith('.ppt')) return 'slide';
        if (ft.includes('lab') || ft.includes('py') || ft.includes('sql') || ft.includes('code') || ft.includes('colab') || ft.includes('github') || url.endsWith('.html') || url.endsWith('.py') || url.endsWith('.sql')) return 'lab';
        if (ft.includes('managebac') || ft.includes('drive') || ft.includes('external') || ft.includes('video') || ft.includes('link') || /^https?:\/\//i.test(url)) return 'external';
        return 'doc';
    }

    function getDropTopics(drop) {
        const topics = new Set();
        const unit = (drop.unit || inferUnitFromDrop(drop) || '').toUpperCase();
        if (unit) topics.add(unit);

        const code = (drop.topicCode || '').toUpperCase();
        const matches = code.match(/\b([AB][1-4])\b/g);
        if (matches) {
            matches.forEach(m => topics.add(m));
        }

        if (code.includes('IA') || code.includes('CRIT') || (drop.topic || '').toUpperCase().includes('IA')) {
            topics.add('IA');
        }
        if (code.includes('CS') || (drop.topic || '').toUpperCase().includes('CASE')) {
            topics.add('CS');
        }

        return topics;
    }

    function renderTopicTagsHtml(codeStr, fallbackUnit) {
        const raw = (codeStr || fallbackUnit || '').toString().trim();
        if (!raw) return '';

        const parts = raw.split(/(\s*&\s*|\s*\/\s*|\s*,\s*)/);
        const rendered = parts.map(part => {
            const trimmed = part.trim();
            if (!trimmed || part === '&' || part === '/' || part === ',') {
                return `<span class="topic-tag-sep" style="opacity:0.6;font-size:0.75rem;padding:0 2px;">${sanitize(part)}</span>`;
            }

            // Unit or subtopic (e.g. A1, A2.3, B3, B4.1)
            const unitMatch = trimmed.match(/^([AB][1-4])(?:\.\d+)?$/i);
            if (unitMatch) {
                const u = unitMatch[1].toLowerCase();
                return `<a href="curriculum.html#${u}" class="topic-tag-code topic-tag-link" target="_blank" rel="noopener" title="Open Unit ${unitMatch[1].toUpperCase()} in Syllabus">${sanitize(trimmed)}</a>`;
            }

            // IA
            if (/^IA\b/i.test(trimmed) || /Crit\b/i.test(trimmed)) {
                return `<a href="ia.html" class="topic-tag-code topic-tag-link" target="_blank" rel="noopener" title="Open Internal Assessment (IA) Hub">${sanitize(trimmed)}</a>`;
            }

            // Case Study
            if (/^CS\b/i.test(trimmed) || /Case\s*Study/i.test(trimmed)) {
                return `<a href="case-study.html" class="topic-tag-code topic-tag-link" target="_blank" rel="noopener" title="Open 2027 Case Study Hub">${sanitize(trimmed)}</a>`;
            }

            // Contains A1..B4 inside
            const innerUnit = trimmed.match(/\b([AB][1-4])\b/i);
            if (innerUnit) {
                const u = innerUnit[1].toLowerCase();
                return `<a href="curriculum.html#${u}" class="topic-tag-code topic-tag-link" target="_blank" rel="noopener" title="Open Unit ${innerUnit[1].toUpperCase()} in Syllabus">${sanitize(trimmed)}</a>`;
            }

            return `<span class="topic-tag-code">${sanitize(trimmed)}</span>`;
        });

        return `<span class="topic-tags-wrapper" style="display:inline-flex;align-items:center;gap:3px;flex-wrap:wrap;">${rendered.join('')}</span>`;
    }

    function updateActiveFiltersBadge() {
        let count = 0;
        count += activePapers.size;
        count += activeCohorts.size;
        count += activeFormats.size;
        if (statusFilter !== 'all') count += 1;
        const totalUnitFilters = Object.values(unitStates).filter(s => s !== 'none').length;
        count += totalUnitFilters;

        const badge = document.getElementById('active-filters-count');
        if (badge) {
            if (count > 0) {
                badge.textContent = String(count);
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
        const savedCountEl = document.getElementById('saved-segment-count');
        if (savedCountEl) {
            savedCountEl.textContent = String(savedIds.size);
        }
    }

    /* ----------------------------------------------------------------------
       ManageBac Snippet Formatter & Clipboard Export
       ---------------------------------------------------------------------- */
    function buildManageBacSnippet(drop) {
        const code = drop.topicCode || drop.unit || drop.topic || 'CS';
        const mbType = drop.managebacType || 'Coursework Resource';
        const cohort = drop.cohort || 'All Cohorts';
        const absUrl = new URL(drop.fileUrl || 'resources.html', window.location.href).href;

        const lines = [
            `[${code}] ${drop.title}`,
            `Category: ${drop.topic || 'IB Computer Science'} (${mbType}) | Cohort: ${cohort} | Format: ${drop.fileType || 'Resource'}`,
            ''
        ];
        if (drop.note) {
            lines.push(`Instructions: ${drop.note}`);
            lines.push('');
        }
        lines.push(`Direct Resource Link: ${absUrl}`);
        if (drop.secondaryUrl) {
            const absSec = new URL(drop.secondaryUrl, window.location.href).href;
            lines.push(`${drop.secondaryLabel || 'Companion File'}: ${absSec}`);
        }
        if (drop.managebacUrl) {
            lines.push(`ManageBac Task: ${drop.managebacUrl}`);
        }
        if (drop.connectedDeadlineId && deadlinesMap.has(drop.connectedDeadlineId)) {
            const dl = deadlinesMap.get(drop.connectedDeadlineId);
            lines.push(`Linked Assessment: ${dl.title} (Due: ${formatDate(dl.date)})`);
        }
        return lines.join('\n');
    }

    function copyManageBacForDrop(drop) {
        const text = buildManageBacSnippet(drop);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(`Copied ManageBac task block for "${drop.title.slice(0, 32)}..."`);
            }).catch(() => {
                fallbackCopyText(text);
            });
        } else {
            fallbackCopyText(text);
        }
    }

    function fallbackCopyText(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showToast('Copied ManageBac task block to clipboard');
        } catch (e) {}
        document.body.removeChild(ta);
    }

    /* ----------------------------------------------------------------------
       In-Page Quick Preview Modal (Split Left: Guidance & Syllabus / Right: Viewer)
       ---------------------------------------------------------------------- */
    function openPreviewModal(drop) {
        if (!previewModal || !previewBody) return;
        const unit = inferUnitFromDrop(drop);
        const code = drop.topicCode || unit;

        if (previewCode) {
            previewCode.textContent = code;
            const primaryUnit = (unit || 'a1').toLowerCase();
            if (/^[ab][1-4]$/i.test(primaryUnit)) {
                previewCode.href = `curriculum.html#${primaryUnit}`;
            } else if (primaryUnit === 'ia') {
                previewCode.href = 'ia.html';
            } else if (primaryUnit === 'cs') {
                previewCode.href = 'case-study.html';
            } else {
                previewCode.href = 'curriculum.html';
            }
        }
        if (previewFormat) previewFormat.textContent = drop.fileType || 'FILE';
        if (previewTitle) previewTitle.textContent = drop.title || 'Resource Preview';

        const fileUrl = drop.fileUrl || '#';
        if (previewOpenBtn) {
            previewOpenBtn.href = fileUrl;
            const isPreviewable = /\.(pdf|html?)$/i.test(fileUrl) || /^https?:\/\//i.test(fileUrl);
            if (isPreviewable) {
                previewOpenBtn.setAttribute('target', '_blank');
                previewOpenBtn.removeAttribute('download');
                previewOpenBtn.innerHTML = `<span>Open in New Tab</span><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12L12 4M6 4h6v6"/></svg>`;
            } else {
                previewOpenBtn.setAttribute('download', '');
                previewOpenBtn.innerHTML = `<span>Download File</span><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v10M4 9l4 4 4-4"/></svg>`;
            }
        }

        previewBody.innerHTML = '';

        // Left Sidebar: Teacher Guidance & Aligned Syllabus Statements
        const sidebar = document.createElement('div');
        sidebar.className = 'res-preview-sidebar';

        // 1. Meta specs card
        const metaCard = document.createElement('div');
        metaCard.className = 'preview-sidebar-card';
        metaCard.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;font-family:var(--font-mono);font-size:0.75rem;color:var(--text-3);margin-bottom:6px;">
                <span>${sanitize(formatDate(drop.date))}</span>
                <span class="cohort-tag-code">${sanitize(drop.cohort || 'All Cohorts')}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;color:var(--text-2);">
                <span class="format-chip">${sanitize(drop.fileType || 'FILE')}</span>
                ${drop.fileSize ? `<span>&bull; ${sanitize(drop.fileSize)}</span>` : ''}
            </div>
        `;
        sidebar.appendChild(metaCard);

        // 2. Teacher Guidance card
        const guidanceCard = document.createElement('div');
        guidanceCard.className = 'preview-sidebar-card';
        guidanceCard.innerHTML = `
            <div class="preview-card-label">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M2 3h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 3V4a1 1 0 0 1 1-1z"/>
                </svg>
                <span>Teacher Guidance</span>
            </div>
            <p class="preview-guidance-content">${sanitize(drop.note || 'No specific instructor notes attached. Please refer to syllabus alignment below.')}</p>
        `;
        sidebar.appendChild(guidanceCard);

        // 3. Aligned Syllabus Statements card
        if (window.DataService && typeof window.DataService.getSyllabus === 'function') {
            const unitObj = window.DataService.getSyllabus({ unitCode: unit });
            if (unitObj && Array.isArray(unitObj.subtopics)) {
                const targetCode = (drop.topicCode || '').trim().toUpperCase();
                const matchingSubs = unitObj.subtopics.filter(st =>
                    targetCode.includes(st.code.toUpperCase()) || st.code.toUpperCase().includes(targetCode)
                );
                const subsToShow = matchingSubs.length ? matchingSubs : unitObj.subtopics.slice(0, 2);
                const stItems = [];
                subsToShow.forEach(sub => {
                    (sub.statements || []).slice(0, 4).forEach(s => {
                        stItems.push(`<li><a href="curriculum.html#${unit.toLowerCase()}" target="_blank" rel="noopener" class="preview-statement-code" title="View in Syllabus">${sanitize(s.code)} (${sanitize(s.level)}):</a> ${sanitize(s.statement)}</li>`);
                    });
                });
                if (stItems.length) {
                    const syllabusCard = document.createElement('div');
                    syllabusCard.className = 'preview-sidebar-card';
                    syllabusCard.innerHTML = `
                        <div class="preview-card-label">
                            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <circle cx="8" cy="8" r="6"/>
                                <path d="M8 5v3l2 2"/>
                            </svg>
                            <span>Aligned IB 2027 Syllabus Statements</span>
                        </div>
                        <ul class="preview-statements-list">
                            ${stItems.join('')}
                        </ul>
                    `;
                    sidebar.appendChild(syllabusCard);
                }
            }
        }

        // 4. Linked Assessment
        if (drop.connectedDeadlineId && deadlinesMap.has(drop.connectedDeadlineId)) {
            const dl = deadlinesMap.get(drop.connectedDeadlineId);
            const targetUrl = `${BASE}pages/deadlines.html?id=${encodeURIComponent(drop.connectedDeadlineId)}`;
            const dlCard = document.createElement('div');
            dlCard.className = 'preview-sidebar-card';
            dlCard.innerHTML = `
                <div class="preview-card-label">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                    <span>Linked Assessment</span>
                </div>
                <a href="${targetUrl}" class="resource-connected-box" style="margin-top:4px;">
                    <span class="resource-connected-title">${sanitize(dl.title)}</span>
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                </a>
            `;
            sidebar.appendChild(dlCard);
        }

        previewBody.appendChild(sidebar);

        // Right Viewport: Interactive viewer or fallback
        const viewport = document.createElement('div');
        viewport.className = 'res-preview-viewport';

        const canIframe = /\.(pdf|html?)$/i.test(fileUrl) || fileUrl.startsWith('data:application/pdf') || fileUrl.startsWith('data:text/html');
        if (canIframe) {
            const iframe = document.createElement('iframe');
            iframe.className = 'res-preview-iframe';
            iframe.src = fileUrl;
            iframe.title = drop.title || 'Resource preview';
            viewport.appendChild(iframe);
        } else {
            const fallback = document.createElement('div');
            fallback.className = 'res-preview-fallback';
            fallback.innerHTML = `
                <svg class="res-preview-fallback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <h3>${sanitize(drop.title)}</h3>
                <p>This ${sanitize(drop.fileType || 'document')} cannot be previewed directly inside an embedded frame. Open or download the file to inspect with your native desktop application.</p>
                <a href="${sanitize(fileUrl)}" download class="btn-res-primary" style="margin-top:8px;display:inline-flex;align-items:center;gap:6px;">
                    <span>Download File</span>
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v10M4 9l4 4 4-4"/></svg>
                </a>
            `;
            viewport.appendChild(fallback);
        }

        previewBody.appendChild(viewport);
        previewModal.hidden = false;
    }

    /* ----------------------------------------------------------------------
       Card & Table Row Renderers
       ---------------------------------------------------------------------- */
    function createDropCard(drop) {
        const card = document.createElement('article');
        card.className = 'resource-card' + (drop.isSpotlight ? ' is-spotlight' : '');
        card.setAttribute('data-id', drop.id || '');
        if (drop.id) card.id = 'drop-' + drop.id;

        const formattedDate = formatDate(drop.date);
        const unit = inferUnitFromDrop(drop);
        const isSaved = savedIds.has(drop.id);

        const formatBadge = drop.fileType ? `<span class="format-chip">${sanitize(drop.fileType)}</span>` : '';
        const topicCode = renderTopicTagsHtml(drop.topicCode || unit, unit);
        const cohortTag = drop.cohort ? `<span class="cohort-tag-code">${sanitize(drop.cohort)}</span>` : '';
        const mbTypeChip = drop.managebacType ? `<span class="mb-type-chip">${sanitize(drop.managebacType)}</span>` : '';
        const spotlightTag = drop.isSpotlight ? `<span class="spotlight-tag-code">${sanitize(drop.badgeText || 'Pinned')}</span>` : '';

        // Connected Assessment / Announcement / ManageBac Stack
        const connectedItems = [];
        if (drop.connectedDeadlineId && deadlinesMap.has(drop.connectedDeadlineId)) {
            const dl = deadlinesMap.get(drop.connectedDeadlineId);
            const countdown = calculateCountdown(dl.date);
            const targetUrl = `${BASE}pages/deadlines.html?id=${encodeURIComponent(drop.connectedDeadlineId)}`;
            connectedItems.push(`
                <a class="resource-connected-box" href="${targetUrl}" title="Open linked assessment in Deadlines">
                    <div class="resource-connected-info">
                        <span class="resource-connected-prefix">Assessment:</span>
                        <span class="resource-connected-title">${sanitize(dl.title)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${countdown ? `<span class="resource-countdown-mono">${sanitize(countdown)}</span>` : ''}
                        <span class="resource-connected-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>
                    </div>
                </a>
            `);
        }

        if (drop.managebacUrl) {
            connectedItems.push(`
                <a class="resource-connected-box" href="${sanitize(drop.managebacUrl)}" target="_blank" rel="noopener" title="Open directly in ManageBac">
                    <div class="resource-connected-info">
                        <span class="resource-connected-prefix" style="color: var(--info);">ManageBac:</span>
                        <span class="resource-connected-title">Open Linked ManageBac Task / Dropbox</span>
                    </div>
                    <span class="resource-connected-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12L12 4M6 4h6v6"/></svg></span>
                </a>
            `);
        }

        if (drop.connectedAnnouncementId) {
            const anUrl = `${BASE}pages/deadlines.html?tab=announcements&id=${encodeURIComponent(drop.connectedAnnouncementId)}`;
            connectedItems.push(`
                <a class="resource-connected-box" href="${anUrl}" title="View linked faculty bulletin">
                    <div class="resource-connected-info">
                        <span class="resource-connected-prefix">Bulletin:</span>
                        <span class="resource-connected-title">Notice #${sanitize(drop.connectedAnnouncementId)}</span>
                    </div>
                    <span class="resource-connected-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>
                </a>
            `);
        }

        const connectedHtml = connectedItems.length
            ? `<div class="resource-connected-stack">${connectedItems.join('')}</div>`
            : '';

        // Primary & Secondary File Actions
        const fileUrl = drop.fileUrl || '#';
        const isExternal = /^https?:\/\//i.test(fileUrl);
        const isInteractive = drop.fileType === 'Interactive Lab' || /\.html?$/i.test(fileUrl);
        const openAttr = isExternal || isInteractive || drop.fileType === 'PDF' ? 'target="_blank" rel="noopener"' : 'download';
        const defaultActionLabel = isInteractive ? 'Launch Lab' : (isExternal ? 'Open Link' : (drop.fileType === 'PDF' ? 'Open PDF' : 'Download'));
        const actionLabel = drop.primaryLabel || defaultActionLabel;

        let facultyBtnsHtml = '';
        if (isFaculty) {
            facultyBtnsHtml = `
                <button type="button" class="btn-resource-action btn-faculty-inline" data-action="edit" title="Edit this resource drop">Edit</button>
                <button type="button" class="btn-resource-action btn-faculty-inline" data-action="pin" title="Toggle pinned spotlight status">${drop.isSpotlight ? 'Unpin' : 'Pin'}</button>
                <button type="button" class="btn-resource-action btn-faculty-inline is-danger" data-action="delete" title="Delete this resource drop">Delete</button>
            `;
        }

        card.innerHTML = `
            <header class="resource-card-header">
                <div class="resource-meta-stamp">
                    <time datetime="${sanitize(drop.date)}" class="resource-stamp-date">${formattedDate}</time>
                    <span class="meta-sep">&bull;</span>
                    ${topicCode}
                    ${cohortTag}
                    ${mbTypeChip}
                    ${spotlightTag}
                </div>
                <div class="resource-header-right">
                    ${formatBadge}
                    <button type="button" class="btn-bookmark-resource${isSaved ? ' is-saved' : ''}" data-action="save" aria-label="${isSaved ? 'Remove from saved' : 'Save resource'}" title="${isSaved ? 'Saved (click to remove)' : 'Save resource for quick revision'}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                </div>
            </header>

            <h3 class="resource-card-title">${sanitize(drop.title)}</h3>
            ${drop.note ? `<p class="resource-card-note">${sanitize(drop.note)}</p>` : ''}

            ${connectedHtml}

            <footer class="resource-card-footer">
                <div class="resource-file-meta">
                    <span>${sanitize(drop.topic || 'Coursework')}</span>
                    ${drop.subtopicName ? `<span class="meta-sep">&bull;</span><span>${sanitize(drop.subtopicName)}</span>` : ''}
                    ${drop.fileSize ? `<span class="meta-sep">&bull;</span><span>${sanitize(drop.fileSize)}</span>` : ''}
                </div>

                <div class="resource-actions-row">
                    ${facultyBtnsHtml}
                    <button type="button" class="btn-resource-action" data-action="preview" title="Preview document &amp; aligned syllabus objectives">
                        <span>Preview</span>
                    </button>
                    ${drop.secondaryUrl ? `
                        <a class="btn-resource-download btn-resource-secondary" href="${sanitize(drop.secondaryUrl)}" download>
                            <span>${sanitize(drop.secondaryLabel || 'Mark Scheme')}</span>
                        </a>
                    ` : ''}
                    <a class="btn-resource-download is-primary-dl" href="${sanitize(fileUrl)}" ${openAttr}>
                        <span>${sanitize(actionLabel)}</span>
                        <span class="btn-res-arrow" aria-hidden="true">${isExternal || isInteractive ? '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12L12 4M6 4h6v6"/></svg>' : '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v10M4 9l4 4 4-4"/></svg>'}</span>
                    </a>
                </div>
            </footer>
        `;

        bindCardActions(card, drop);
        return card;
    }

    function createTableView(drops) {
        const wrap = document.createElement('div');
        wrap.className = 'resources-table-wrap';

        const table = document.createElement('table');
        table.className = 'resources-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Unit</th>
                    <th>Resource &amp; Guidance</th>
                    <th>Cohort</th>
                    <th>Format</th>
                    <th style="text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');

        drops.forEach(drop => {
            const tr = document.createElement('tr');
            const unit = inferUnitFromDrop(drop);
            const fileUrl = drop.fileUrl || '#';
            const isExternal = /^https?:\/\//i.test(fileUrl);
            const isInteractive = drop.fileType === 'Interactive Lab' || /\.html?$/i.test(fileUrl);
            const openAttr = isExternal || isInteractive || drop.fileType === 'PDF' ? 'target="_blank" rel="noopener"' : 'download';
            const isSaved = savedIds.has(drop.id);

            tr.innerHTML = `
                <td class="table-date-cell">${sanitize(formatDate(drop.date))}</td>
                <td>${renderTopicTagsHtml(drop.topicCode || unit, unit)}</td>
                <td class="table-title-cell">
                    <a class="table-title-link" href="${sanitize(fileUrl)}" ${openAttr}>
                        ${drop.isSpotlight ? '<span style="color:var(--accent);margin-right:4px;">[Pinned]</span>' : ''}${sanitize(drop.title)}
                    </a>
                    ${drop.note ? `<span class="table-note-sub">${sanitize(drop.note)}</span>` : ''}
                </td>
                <td><span class="cohort-tag-code">${sanitize(drop.cohort || 'All')}</span></td>
                <td><span class="format-chip">${sanitize(drop.fileType || 'FILE')}</span></td>
                <td class="table-actions-cell">
                    <div class="table-actions-group">
                        ${isFaculty ? `<button type="button" class="btn-file-quick" data-action="edit">Edit</button>` : ''}
                        <button type="button" class="btn-file-quick" data-action="preview" title="Preview">Preview</button>
                        <button type="button" class="btn-file-quick" data-action="save" title="Bookmark">${isSaved ? 'Saved' : 'Save'}</button>
                        <a class="btn-file-quick" style="color:var(--accent);border-color:color-mix(in srgb, var(--accent) 35%, var(--line));display:inline-flex;align-items:center;gap:4px;" href="${sanitize(fileUrl)}" ${openAttr}>
                            <span>Open</span>
                            ${isExternal || isInteractive ? '<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12L12 4M6 4h6v6"/></svg>' : '<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v10M4 9l4 4 4-4"/></svg>'}
                        </a>
                    </div>
                </td>
            `;

            bindCardActions(tr, drop);
            tbody.appendChild(tr);
        });

        wrap.appendChild(table);
        return wrap;
    }

    function bindCardActions(node, drop) {
        node.querySelectorAll('.topic-tag-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        node.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                if (action === 'save') {
                    toggleSaveDrop(drop.id);
                } else if (action === 'preview') {
                    openPreviewModal(drop);
                } else if (action === 'edit') {
                    openStudioForEdit(drop);
                } else if (action === 'pin') {
                    const updated = Object.assign({}, drop, { isSpotlight: !drop.isSpotlight });
                    if (window.DataService && typeof window.DataService.saveTeacherResource === 'function') {
                        window.DataService.saveTeacherResource(updated);
                        showToast(updated.isSpotlight ? 'Pinned resource to top' : 'Unpinned resource');
                    }
                } else if (action === 'delete') {
                    if (confirm(`Remove "${drop.title}" from the teacher drops feed?`)) {
                        if (window.DataService && typeof window.DataService.deleteTeacherResource === 'function') {
                            window.DataService.deleteTeacherResource(drop.id);
                            showToast('Resource drop removed');
                        }
                    }
                }
            });
        });
    }

    /* ----------------------------------------------------------------------
       Main Feed Filtering, Cross-Archive Bridge & Rendering
       ---------------------------------------------------------------------- */
    function renderTopicPills() {
        const container = document.getElementById('topics-pill-container');
        if (!container) return;
        container.innerHTML = '';

        const ICONS = {
            plus: '<span class="pill-badge">+</span>',
            check: '<span class="pill-badge" style="color:var(--accent);">&#10003;</span>',
            ban: '<span class="pill-badge" style="color:var(--danger);">&#8856;</span>'
        };

        SYLLABUS_UNITS.forEach(unit => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'topic-pill';
            btn.setAttribute('data-unit', unit.code);

            const st = unitStates[unit.code] || 'none';
            if (st === 'included') btn.classList.add('is-included');
            else if (st === 'excluded') btn.classList.add('is-excluded');

            const iconHtml = st === 'included' ? ICONS.check : (st === 'excluded' ? ICONS.ban : ICONS.plus);
            btn.innerHTML = `<span class="pill-code">${unit.code}</span> <span>${unit.name}</span> ${iconHtml}`;

            btn.addEventListener('click', () => {
                const current = unitStates[unit.code] || 'none';
                if (current === 'none') {
                    unitStates[unit.code] = 'included';
                } else if (current === 'included') {
                    unitStates[unit.code] = 'excluded';
                } else {
                    delete unitStates[unit.code];
                }
                renderTopicPills();
                updateActiveFiltersBadge();
                renderFeed();
            });

            container.appendChild(btn);
        });

        const activeCount = Object.keys(unitStates).length;
        const badge = document.getElementById('topics-count-badge');
        if (badge) {
            badge.textContent = activeCount > 0 ? `(${activeCount} active)` : '';
        }
    }

    /* ----------------------------------------------------------------------
       Main Feed Filtering, Cross-Archive Bridge & Rendering
       ---------------------------------------------------------------------- */
    function renderFeed() {
        if (!feedContainer) return;

        const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

        if (clearSearchBtn) {
            clearSearchBtn.hidden = !searchQuery.length;
        }

        const includedUnits = Object.keys(unitStates).filter(k => unitStates[k] === 'included');
        const excludedUnits = Object.keys(unitStates).filter(k => unitStates[k] === 'excluded');

        const filtered = allDrops.filter(drop => {
            const dropTopics = getDropTopics(drop);

            // 1. Topic Pills Exclusions
            if (excludedUnits.length > 0) {
                if (excludedUnits.some(u => dropTopics.has(u))) {
                    return false;
                }
            }

            // 2. Topic Pills Inclusions
            if (includedUnits.length > 0) {
                if (matchMode === 'any') {
                    if (!includedUnits.some(u => dropTopics.has(u))) return false;
                } else {
                    // stay within: drop must only touch the included units
                    const dropUnitsOnly = Array.from(dropTopics).filter(t => /^[AB][1-4]$/i.test(t) || t === 'CS' || t === 'IA');
                    if (dropUnitsOnly.length === 0 || !dropUnitsOnly.every(u => includedUnits.includes(u))) {
                        return false;
                    }
                }
            }

            // 3. Papers / Themes Filter
            if (activePapers.size > 0) {
                let matchesPaper = false;
                if (activePapers.has('theme-a')) {
                    if (['A1', 'A2', 'A3', 'A4', 'CS'].some(t => dropTopics.has(t))) matchesPaper = true;
                }
                if (activePapers.has('theme-b')) {
                    if (['B1', 'B2', 'B3', 'B4'].some(t => dropTopics.has(t))) matchesPaper = true;
                }
                if (!matchesPaper) return false;
            }

            // 4. Cohort Filter
            if (activeCohorts.size > 0) {
                const c = (drop.cohort || '').toLowerCase();
                const l = (drop.level || '').toLowerCase();
                let matchesCohort = false;
                if (activeCohorts.has('Year 1') && (c.includes('year 1') || c.includes('dp1') || c.includes('both') || c.includes('all'))) matchesCohort = true;
                if (activeCohorts.has('Year 2') && (c.includes('year 2') || c.includes('dp2') || c.includes('both') || c.includes('all'))) matchesCohort = true;
                if (activeCohorts.has('HL') && (c.includes('hl only') || l === 'hl')) matchesCohort = true;
                if (!matchesCohort) return false;
            }

            // 5. Format Filter
            if (activeFormats.size > 0) {
                const group = classifyFormatGroup(drop);
                if (!activeFormats.has(group)) return false;
            }

            // 6. Status Filter
            if (statusFilter === 'saved') {
                if (!savedIds.has(drop.id)) return false;
            } else if (statusFilter === 'pinned') {
                if (!drop.isSpotlight) return false;
            }

            // 7. Search Query
            if (terms.length) {
                let dlTitle = '';
                if (drop.connectedDeadlineId && deadlinesMap.has(drop.connectedDeadlineId)) {
                    dlTitle = deadlinesMap.get(drop.connectedDeadlineId).title || '';
                }
                const haystack = `${drop.title || ''} ${drop.note || ''} ${drop.topic || ''} ${drop.topicCode || ''} ${Array.from(dropTopics).join(' ')} ${drop.subtopicName || ''} ${drop.cohort || ''} ${drop.fileType || ''} ${dlTitle}`.toLowerCase();
                if (!terms.every(t => haystack.includes(t))) return false;
            }

            return true;
        });

        // Sort: Pinned items stay first unless sorting by oldest/code
        filtered.sort((a, b) => {
            if (sortMode === 'newest') {
                if (Boolean(a.isSpotlight) !== Boolean(b.isSpotlight)) {
                    return a.isSpotlight ? -1 : 1;
                }
                return (b.date || '').localeCompare(a.date || '');
            }
            if (sortMode === 'oldest') {
                return (a.date || '').localeCompare(b.date || '');
            }
            const codeA = a.topicCode || inferUnitFromDrop(a);
            const codeB = b.topicCode || inferUnitFromDrop(b);
            return codeA.localeCompare(codeB);
        });

        if (dropsCountBadge) {
            dropsCountBadge.textContent = String(allDrops.length);
        }

        if (searchSummary) {
            const isFiltered = terms.length > 0 || Object.keys(unitStates).length > 0 || activePapers.size > 0 || activeCohorts.size > 0 || activeFormats.size > 0 || statusFilter !== 'all';
            searchSummary.textContent = isFiltered
                ? `Showing ${filtered.length} of ${allDrops.length} drops`
                : `${allDrops.length} drops available`;
        }

        // Cross-Archive Search Bridge
        updateCrossArchiveBridge(terms);

        feedContainer.textContent = '';

        if (!filtered.length) {
            const empty = document.createElement('div');
            empty.className = 'res-empty-state';
            empty.innerHTML = `
                <p>No resources match the active filters.</p>
                <button type="button" class="btn-res-secondary btn-res-sm" id="reset-feed-filters-btn">Reset All Filters</button>
            `;
            feedContainer.appendChild(empty);

            const resetBtn = empty.querySelector('#reset-feed-filters-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', resetAllFilters);
            }
            return;
        }

        if (viewMode === 'table') {
            feedContainer.appendChild(createTableView(filtered));
        } else {
            filtered.forEach(drop => {
                feedContainer.appendChild(createDropCard(drop));
            });
        }
    }

    function updateCrossArchiveBridge(terms) {
        if (!archiveBridge || !archiveBridgeText) return;
        const activeUnitCodes = Object.keys(unitStates).filter(k => unitStates[k] === 'included');
        const effectiveTerms = terms.length ? terms : (activeUnitCodes.length ? activeUnitCodes.map(u => u.toLowerCase()) : []);
        if (!effectiveTerms.length || !archiveFlatFiles.length) {
            archiveBridge.hidden = true;
            return;
        }
        const matchCount = archiveFlatFiles.filter(f =>
            effectiveTerms.every(t => f.haystack.includes(t))
        ).length;

        if (matchCount > 0) {
            const queryLabel = searchQuery || activeUnitCodes.join(', ');
            const totalArchive = archiveFlatFiles.length || 131;
            archiveBridgeText.textContent = `${matchCount} file${matchCount === 1 ? '' : 's'} in the ${totalArchive}-file Department Archive also match "${queryLabel}".`;
            archiveBridge.hidden = false;
        } else {
            archiveBridge.hidden = true;
        }
    }

    function resetAllFilters() {
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        unitStates = {};
        activePapers.clear();
        activeCohorts.clear();
        activeFormats.clear();
        statusFilter = 'all';

        document.querySelectorAll('#filters-drawer input[type="checkbox"]').forEach(c => { c.checked = false; });
        document.querySelectorAll('#filter-status-segment .status-segment-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.status === 'all');
        });

        renderTopicPills();
        updateActiveFiltersBadge();
        renderFeed();
    }

    /* ----------------------------------------------------------------------
       Faculty Studio: Auth, File Drag & Drop, Auto-Detection & Publishing
       ---------------------------------------------------------------------- */
    function syncFacultyState() {
        isFaculty = window.DataService && typeof window.DataService.isFacultyUnlocked === 'function'
            ? window.DataService.isFacultyUnlocked()
            : false;

        if (facultyBadge) {
            facultyBadge.hidden = !isFaculty;
        }
        if (studioAuthGate && studioComposer) {
            studioAuthGate.hidden = isFaculty;
            studioComposer.hidden = !isFaculty;
        }
        renderFeed();
    }

    function openStudio(presetUnit, presetTheme) {
        if (!studioDrawer) return;
        studioDrawer.hidden = false;
        syncFacultyState();

        if (!isFaculty) {
            if (studioPasskeyInput) studioPasskeyInput.focus();
            studioDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
        }

        if (inputEditId && !inputEditId.value) {
            if (studioFormHeading) studioFormHeading.textContent = 'Drop Coursework or Topic Resource';
            if (inputDate && !inputDate.value) {
                inputDate.value = new Date().toISOString().split('T')[0];
            }
        }

        if (presetTheme && selectTheme) selectTheme.value = presetTheme;
        if (presetUnit && selectUnit) {
            selectUnit.value = presetUnit;
            if (inputCode && !inputCode.value) inputCode.value = presetUnit;
        }

        studioDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (inputTitle) inputTitle.focus();
    }

    function openStudioForEdit(drop) {
        if (!studioDrawer) return;
        studioDrawer.hidden = false;
        syncFacultyState();
        if (!isFaculty) return;

        if (studioFormHeading) studioFormHeading.textContent = `Edit Resource: ${drop.title}`;
        if (inputEditId) inputEditId.value = drop.id || '';
        if (inputTitle) inputTitle.value = drop.title || '';
        if (inputDate) inputDate.value = drop.date || new Date().toISOString().split('T')[0];
        if (selectTheme) selectTheme.value = drop.topic || 'Theme A';
        if (selectUnit) selectUnit.value = inferUnitFromDrop(drop);
        if (inputCode) inputCode.value = drop.topicCode || '';
        if (selectCohort) selectCohort.value = drop.cohort || 'Year 1 (SL/HL)';
        if (inputUrl) inputUrl.value = drop.fileUrl || '';
        if (selectFormat) selectFormat.value = drop.fileType || 'PDF';
        if (inputSize) inputSize.value = drop.fileSize || '';
        if (selectMbType) selectMbType.value = drop.managebacType || 'Unit Resource';
        if (inputMbUrl) inputMbUrl.value = drop.managebacUrl || '';
        if (selectDeadline) selectDeadline.value = drop.connectedDeadlineId || '';
        if (inputSecUrl) inputSecUrl.value = drop.secondaryUrl || '';
        if (inputSecLabel) inputSecLabel.value = drop.secondaryLabel || '';
        if (inputNote) inputNote.value = drop.note || '';
        if (checkSpotlight) checkSpotlight.checked = Boolean(drop.isSpotlight);

        detectPlatformFromUrl(drop.fileUrl || '');
        studioDrawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function closeStudio() {
        if (!studioDrawer) return;
        studioDrawer.hidden = true;
        resetStudioForm();
    }

    function resetStudioForm() {
        if (dropForm) dropForm.reset();
        if (inputEditId) inputEditId.value = '';
        if (inputDate) inputDate.value = new Date().toISOString().split('T')[0];
        if (studioFormHeading) studioFormHeading.textContent = 'Drop Coursework or Topic Resource';
        if (dropzonePrimary) {
            dropzonePrimary.innerHTML = 'Drag &amp; drop a classroom file here, or <span class="dropzone-browse-link">browse computer</span>';
        }
        if (dropzoneSecondary) {
            dropzoneSecondary.textContent = 'Supports PDF, DOCX, PPTX, XLSX, Python (.py), SQL, HTML simulators, and ZIP archives';
        }
        if (platformPill) platformPill.hidden = true;
    }

    // Expose helper for Department Archive section headers
    window.openFacultyDropForUnit = function (unitCode, themeName) {
        const dropsTabBtn = document.querySelector('[data-tab="drops"]');
        if (dropsTabBtn) dropsTabBtn.click();
        openStudio(unitCode, themeName);
    };

    window.openResourcePreviewModal = function (dropOrFile) {
        openPreviewModal(dropOrFile);
    };

    function handleSelectedFile(file) {
        if (!file) return;
        const rawName = file.name;
        const ext = (rawName.split('.').pop() || '').toLowerCase();

        // Clean human-readable title
        const cleanTitle = rawName
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (inputTitle && !inputTitle.value) {
            inputTitle.value = cleanTitle;
        }

        // Format size
        const sizeStr = file.size < 1024
            ? `${file.size} B`
            : file.size < 1024 * 1024
                ? `${Math.round(file.size / 1024)} KB`
                : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        if (inputSize) inputSize.value = sizeStr;

        // Map extension to format dropdown
        const extMap = {
            pdf: 'PDF',
            doc: 'DOCX',
            docx: 'DOCX',
            ppt: 'PPTX',
            pptx: 'PPTX',
            xls: 'XLSX',
            xlsx: 'XLSX',
            csv: 'XLSX',
            py: 'PY',
            ipynb: 'PY',
            sql: 'SQL',
            html: 'Interactive Lab',
            htm: 'Interactive Lab',
            zip: 'ZIP'
        };
        if (selectFormat && extMap[ext]) {
            selectFormat.value = extMap[ext];
        }

        // Auto-detect unit & subtopic code from filename
        autoClassifyFromText(cleanTitle);

        const unit = selectUnit ? selectUnit.value : 'A1';
        const baseFolder = UNIT_FOLDER_PATHS[unit] || '../resources/';
        const suggestedPath = baseFolder + rawName;

        if (dropzonePrimary) {
            dropzonePrimary.textContent = `Selected: ${rawName} (${sizeStr})`;
        }
        if (dropzoneSecondary) {
            dropzoneSecondary.textContent = `Target path: ${suggestedPath}`;
        }

        // For files <= 1.5MB, read DataURL so browser preview & download work immediately in local session
        if (file.size <= 1.5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                if (inputUrl) {
                    inputUrl.value = suggestedPath;
                    inputUrl.dataset.dataUrl = ev.target.result || '';
                }
            };
            reader.readAsDataURL(file);
        } else if (inputUrl) {
            inputUrl.value = suggestedPath;
            delete inputUrl.dataset.dataUrl;
        }

        detectPlatformFromUrl(suggestedPath);
    }

    function autoClassifyFromText(text) {
        if (!text) return;
        const upper = text.toUpperCase();
        const subMatch = upper.match(/\b([AB][1-4]\.[1-5])\b/);
        const unitMatch = upper.match(/\b([AB][1-4])\b/);

        let detectedUnit = null;
        if (subMatch) {
            if (inputCode) inputCode.value = subMatch[1];
            detectedUnit = subMatch[1].slice(0, 2);
        } else if (unitMatch) {
            detectedUnit = unitMatch[1];
            if (inputCode && !inputCode.value) inputCode.value = detectedUnit;
        } else if (/NETWORK|PACKET|ROUTING|OSI|TCP/i.test(text)) {
            detectedUnit = 'A2';
        } else if (/DATABASE|SQL|NORMALIZ|3NF|ERD/i.test(text)) {
            detectedUnit = 'A3';
        } else if (/MACHINE LEARNING|NEURAL|CNN|BIAS/i.test(text)) {
            detectedUnit = 'A4';
        } else if (/CPU|ALU|REGISTER|BOOLEAN|TRUTH TABLE|LOGIC GATE/i.test(text)) {
            detectedUnit = 'A1';
        } else if (/OOP|INHERITANCE|POLYMORPHISM|ENCAPSULATION|CLASS/i.test(text)) {
            detectedUnit = 'B3';
        } else if (/LINKED LIST|BINARY SEARCH TREE|BST|ADT/i.test(text)) {
            detectedUnit = 'B4';
        } else if (/PYTHON|TRACE TABLE|RECURSION|BIG-O|SEARCH|SORT/i.test(text)) {
            detectedUnit = 'B2';
        } else if (/CRITERION|INTERNAL ASSESSMENT|\bIA\b/i.test(text)) {
            detectedUnit = 'IA';
        }

        if (detectedUnit && selectUnit && selectTheme) {
            selectUnit.value = detectedUnit;
            if (detectedUnit.startsWith('A')) selectTheme.value = 'Theme A';
            else if (detectedUnit.startsWith('B')) selectTheme.value = 'Theme B';
            else if (detectedUnit === 'IA') selectTheme.value = 'IA';
            if (inputCode && !inputCode.value) inputCode.value = detectedUnit;
        }
    }

    function detectPlatformFromUrl(url) {
        if (!platformPill) return;
        const u = (url || '').trim().toLowerCase();
        if (!u) {
            platformPill.hidden = true;
            return;
        }
        platformPill.hidden = false;
        if (u.includes('managebac.com')) {
            platformPill.textContent = 'ManageBac';
            if (selectFormat) selectFormat.value = 'ManageBac';
        } else if (u.includes('drive.google.com') || u.includes('docs.google.com')) {
            platformPill.textContent = 'Google Drive';
            if (selectFormat) selectFormat.value = 'Drive';
        } else if (u.includes('github.com') || u.includes('gist.github.com')) {
            platformPill.textContent = 'GitHub';
            if (selectFormat) selectFormat.value = 'GitHub';
        } else if (u.includes('colab.research.google.com')) {
            platformPill.textContent = 'Google Colab';
            if (selectFormat) selectFormat.value = 'PY';
        } else if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('loom.com')) {
            platformPill.textContent = 'Video Lecture';
            if (selectFormat) selectFormat.value = 'Video';
        } else if (u.endsWith('.html') || u.endsWith('.htm')) {
            platformPill.textContent = 'Browser Simulator';
            if (selectFormat) selectFormat.value = 'Interactive Lab';
        } else if (/^https?:\/\//i.test(u)) {
            platformPill.textContent = 'External Link';
        } else {
            platformPill.textContent = 'Repository File';
        }
    }

    function extractDropFromForm() {
        const title = (inputTitle ? inputTitle.value : '').trim();
        const date = (inputDate ? inputDate.value : '') || new Date().toISOString().split('T')[0];
        const topic = selectTheme ? selectTheme.value : 'Theme A';
        const unit = selectUnit ? selectUnit.value : 'A1';
        const topicCode = (inputCode && inputCode.value.trim()) ? inputCode.value.trim() : unit;
        const cohort = selectCohort ? selectCohort.value : 'Year 1 (SL/HL)';
        const fileUrl = (inputUrl ? inputUrl.value : '').trim();
        const fileType = selectFormat ? selectFormat.value : 'PDF';
        const fileSize = (inputSize ? inputSize.value : '').trim() || null;
        const managebacType = selectMbType ? selectMbType.value : 'Unit Resource';
        const managebacUrl = (inputMbUrl ? inputMbUrl.value : '').trim() || null;
        const connectedDeadlineId = (selectDeadline && selectDeadline.value) ? selectDeadline.value : null;
        const secondaryUrl = (inputSecUrl ? inputSecUrl.value : '').trim() || null;
        const secondaryLabel = (inputSecLabel ? inputSecLabel.value : '').trim() || (secondaryUrl ? 'Mark Scheme' : null);
        const note = (inputNote ? inputNote.value : '').trim();
        const isSpotlight = Boolean(checkSpotlight && checkSpotlight.checked);
        const editId = (inputEditId && inputEditId.value) ? inputEditId.value : ('res-drop-' + Date.now());

        if (!title || !fileUrl || !note) return null;

        return {
            id: editId,
            date,
            title,
            topic,
            unit,
            topicCode,
            cohort,
            level: cohort.includes('HL Only') ? 'HL' : 'SL/HL',
            fileType,
            fileSize,
            fileUrl,
            managebacType,
            managebacUrl,
            connectedDeadlineId,
            secondaryUrl,
            secondaryLabel,
            note,
            isSpotlight,
            badgeText: isSpotlight ? managebacType : null
        };
    }

    function submitDropForm(alsoCopyMb) {
        const drop = extractDropFromForm();
        if (!drop) {
            showToast('Please fill in Title, File/URL, and Teacher Instructions');
            return;
        }

        if (window.DataService && typeof window.DataService.saveTeacherResource === 'function') {
            window.DataService.saveTeacherResource(drop);
        } else {
            const idx = allDrops.findIndex(d => d.id === drop.id);
            if (idx !== -1) allDrops[idx] = drop;
            else allDrops.unshift(drop);
            renderFeed();
        }

        if (alsoCopyMb) {
            copyManageBacForDrop(drop);
        } else {
            showToast(`Published "${drop.title}" to Resources stream`);
        }

        closeStudio();
    }

    /* ----------------------------------------------------------------------
       Export Helpers (ManageBac CSV & teacher-resources.json)
       ---------------------------------------------------------------------- */
    function exportManageBacCsv() {
        const headers = ['Date', 'Theme', 'Unit', 'Subtopic Code', 'Title', 'Cohort', 'ManageBac Classification', 'Format', 'File URL', 'ManageBac URL', 'Linked Deadline', 'Teacher Instructions'];
        const rows = allDrops.map(d => {
            const dl = (d.connectedDeadlineId && deadlinesMap.has(d.connectedDeadlineId))
                ? deadlinesMap.get(d.connectedDeadlineId).title
                : '';
            return [
                d.date || '',
                d.topic || '',
                inferUnitFromDrop(d),
                d.topicCode || '',
                d.title || '',
                d.cohort || '',
                d.managebacType || 'Unit Resource',
                d.fileType || '',
                d.fileUrl || '',
                d.managebacUrl || '',
                dl,
                (d.note || '').replace(/\r?\n/g, ' ')
            ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eis-cs-managebac-resources-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported ManageBac CSV spreadsheet');
    }

    function exportDropsJson() {
        const jsonStr = JSON.stringify(allDrops, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'teacher-resources.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Downloaded teacher-resources.json');
    }

    /* ----------------------------------------------------------------------
       Archive Files Indexing (for Cross-Search & Studio Autocomplete)
       ---------------------------------------------------------------------- */
    function indexArchiveManifest(manifest) {
        if (!manifest || !manifest.tree) return;
        archiveFlatFiles = [];

        function walk(folder, trail) {
            (folder.files || []).forEach(f => {
                const fullPath = '../resources/' + f.path;
                const trailStr = trail.join(' / ');
                archiveFlatFiles.push({
                    title: f.title || f.name,
                    name: f.name,
                    path: fullPath,
                    trail: trailStr,
                    haystack: `${f.title || ''} ${f.name || ''} ${trailStr}`.toLowerCase()
                });
            });
            (folder.folders || []).forEach(sub => {
                if (sub.name === 'Weekly Unit planning') return;
                walk(sub, trail.concat(sub.title || sub.name));
            });
        }
        walk(manifest.tree, []);

        if (archiveDatalist) {
            archiveDatalist.innerHTML = archiveFlatFiles.map(f =>
                `<option value="${sanitize(f.path)}">${sanitize(f.title)} (${sanitize(f.trail || 'Root')})</option>`
            ).join('');
        }
    }

    /* ----------------------------------------------------------------------
       Event Listeners & Initialization
       ---------------------------------------------------------------------- */
    function populateDeadlineSelect() {
        if (!selectDeadline) return;
        selectDeadline.innerHTML = '<option value="">None (Standalone Resource)</option>';
        deadlinesMap.forEach(dl => {
            const opt = document.createElement('option');
            opt.value = dl.id;
            opt.textContent = `[${dl.cohort || 'All'}] ${dl.title} (${formatDate(dl.date)})`;
            selectDeadline.appendChild(opt);
        });
    }

    function applyManageBacConfigUI() {
        if (!window.DataService || typeof window.DataService.getManageBacConfig !== 'function') return;
        const cfg = window.DataService.getManageBacConfig();
        if (mbLinkPortal) mbLinkPortal.href = cfg.portalUrl || 'https://eis.managebac.com';
        if (mbPortalDomain) {
            try {
                mbPortalDomain.textContent = new URL(cfg.portalUrl).hostname;
            } catch (e) {
                mbPortalDomain.textContent = cfg.portalUrl;
            }
        }
        if (mbLinkIa) mbLinkIa.href = cfg.iaDropboxUrl || (cfg.portalUrl + '/student/ib/activity/ia');
        if (mbInputPortal) mbInputPortal.value = cfg.portalUrl || 'https://eis.managebac.com';
        if (mbInputIa) mbInputIa.value = cfg.iaDropboxUrl || '';
    }

    function setupEventListeners() {
        // Primary Tab Switching
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

        // Search Input
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                searchQuery = searchInput.value.trim();
                renderFeed();
            });
        }
        if (clearSearchBtn && searchInput) {
            clearSearchBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchQuery = '';
                renderFeed();
                searchInput.focus();
            });
        }

        // Cross-Archive Jump Button
        if (jumpArchiveBtn) {
            jumpArchiveBtn.addEventListener('click', () => {
                const archiveBtn = document.querySelector('[data-tab="archive"]');
                if (archiveBtn) archiveBtn.click();
                const archiveSearch = archiveTabPane ? archiveTabPane.querySelector('input[type="search"]') : null;
                if (archiveSearch) {
                    archiveSearch.value = searchQuery || (currentTopic !== 'all' ? currentTopic : '');
                    archiveSearch.dispatchEvent(new Event('input', { bubbles: true }));
                    archiveSearch.focus();
                }
            });
        }

        // Topic Pills & Tri-State Filtering
        renderTopicPills();

        const resetTopicsBtn = document.getElementById('reset-topics-btn');
        if (resetTopicsBtn) {
            resetTopicsBtn.addEventListener('click', () => {
                unitStates = {};
                renderTopicPills();
                updateActiveFiltersBadge();
                renderFeed();
            });
        }

        document.querySelectorAll('.match-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.match-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                matchMode = btn.dataset.mode || 'any';
                renderFeed();
            });
        });

        // Collapsible Filters Drawer
        const toggleDrawerBtn = document.getElementById('toggle-filters-drawer');
        const drawerEl = document.getElementById('filters-drawer');
        if (toggleDrawerBtn && drawerEl) {
            toggleDrawerBtn.addEventListener('click', () => {
                const isOpen = drawerEl.classList.toggle('open');
                toggleDrawerBtn.setAttribute('aria-expanded', String(isOpen));
            });
        }

        document.querySelectorAll('#filters-drawer input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', () => {
                activePapers.clear();
                activeCohorts.clear();
                activeFormats.clear();

                document.querySelectorAll('#filters-drawer input[name="filter-paper"]:checked').forEach(c => activePapers.add(c.value));
                document.querySelectorAll('#filters-drawer input[name="filter-cohort"]:checked').forEach(c => activeCohorts.add(c.value));
                document.querySelectorAll('#filters-drawer input[name="filter-format"]:checked').forEach(c => activeFormats.add(c.value));

                updateActiveFiltersBadge();
                renderFeed();
            });
        });

        document.querySelectorAll('#filter-status-segment .status-segment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#filter-status-segment .status-segment-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                statusFilter = btn.dataset.status || 'all';
                updateActiveFiltersBadge();
                renderFeed();
            });
        });

        const resetDrawerBtn = document.getElementById('reset-drawer-filters');
        if (resetDrawerBtn) {
            resetDrawerBtn.addEventListener('click', () => {
                document.querySelectorAll('#filters-drawer input[type="checkbox"]').forEach(c => { c.checked = false; });
                activePapers.clear();
                activeCohorts.clear();
                activeFormats.clear();
                document.querySelectorAll('#filter-status-segment .status-segment-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.status === 'all');
                });
                statusFilter = 'all';
                updateActiveFiltersBadge();
                renderFeed();
            });
        }

        // Sort Cycle (Newest <-> Oldest)
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                if (sortMode === 'newest') {
                    sortMode = 'oldest';
                    if (sortLabel) sortLabel.textContent = 'Oldest First';
                } else {
                    sortMode = 'newest';
                    if (sortLabel) sortLabel.textContent = 'Newest First';
                }
                renderFeed();
            });
        }

        // View Mode Switcher (Cards vs Table)
        viewModeBtns.forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.view === viewMode);
            btn.addEventListener('click', () => {
                viewMode = btn.dataset.view || 'cards';
                try { localStorage.setItem(VIEW_MODE_KEY, viewMode); } catch (e) {}
                viewModeBtns.forEach(b => b.classList.toggle('is-active', b === btn));
                renderFeed();
            });
        });

        // ManageBac Popover Menu
        if (mbToggleBtn && mbPopover) {
            mbToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = !mbPopover.hidden;
                mbPopover.hidden = isOpen;
                mbToggleBtn.setAttribute('aria-expanded', String(!isOpen));
            });
            document.addEventListener('click', (e) => {
                if (!mbPopover.hidden && !mbPopover.contains(e.target) && e.target !== mbToggleBtn) {
                    mbPopover.hidden = true;
                    mbToggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        if (exportMbCsvBtn) exportMbCsvBtn.addEventListener('click', exportManageBacCsv);
        if (exportDropsJsonBtn) exportDropsJsonBtn.addEventListener('click', exportDropsJson);

        if (configMbUrlsBtn && mbConfigForm) {
            configMbUrlsBtn.addEventListener('click', () => {
                mbConfigForm.hidden = !mbConfigForm.hidden;
            });
        }
        if (cancelMbConfigBtn && mbConfigForm) {
            cancelMbConfigBtn.addEventListener('click', () => {
                mbConfigForm.hidden = true;
            });
        }
        if (mbConfigForm) {
            mbConfigForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (window.DataService && typeof window.DataService.saveManageBacConfig === 'function') {
                    window.DataService.saveManageBacConfig({
                        portalUrl: (mbInputPortal ? mbInputPortal.value : '').trim() || 'https://eis.managebac.com',
                        iaDropboxUrl: (mbInputIa ? mbInputIa.value : '').trim()
                    });
                    applyManageBacConfigUI();
                    mbConfigForm.hidden = true;
                    showToast('Updated ManageBac integration links');
                }
            });
        }

        // Faculty Studio Open / Close / Auth
        if (openStudioBtn) {
            openStudioBtn.addEventListener('click', () => {
                if (studioDrawer && !studioDrawer.hidden) {
                    closeStudio();
                } else {
                    const unitPreset = /^[AB][1-4]$/i.test(currentTopic) ? currentTopic.toUpperCase() : null;
                    openStudio(unitPreset, null);
                }
            });
        }
        if (closeStudioBtn) closeStudioBtn.addEventListener('click', closeStudio);
        if (closeAuthStudioBtn) closeAuthStudioBtn.addEventListener('click', closeStudio);
        if (cancelDropBtn) cancelDropBtn.addEventListener('click', closeStudio);

        if (lockFacultyBtn) {
            lockFacultyBtn.addEventListener('click', () => {
                if (window.DataService && typeof window.DataService.setFacultyUnlocked === 'function') {
                    window.DataService.setFacultyUnlocked(false);
                }
                syncFacultyState();
                closeStudio();
                showToast('Locked Faculty Mode');
            });
        }

        if (studioAuthForm) {
            studioAuthForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const pass = (studioPasskeyInput ? studioPasskeyInput.value : '').trim().toLowerCase();
                if (pass === 'power' || pass === 'eis2026' || pass === 'admin' || pass === 'ibdp2026') {
                    if (window.DataService && typeof window.DataService.setFacultyUnlocked === 'function') {
                        window.DataService.setFacultyUnlocked(true);
                    }
                    if (studioAuthError) studioAuthError.hidden = true;
                    if (studioPasskeyInput) studioPasskeyInput.value = '';
                    syncFacultyState();
                    showToast('Faculty Mode unlocked');
                } else {
                    if (studioAuthError) studioAuthError.hidden = false;
                }
            });
        }

        // Studio Source Mode Tabs
        sourceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                sourceTabs.forEach(t => {
                    t.classList.toggle('is-active', t === tab);
                    t.setAttribute('aria-selected', String(t === tab));
                });
                const mode = tab.dataset.sourceMode;
                if (fileZoneWrap) fileZoneWrap.hidden = mode !== 'file';
                if (mbParserWrap) mbParserWrap.hidden = mode !== 'managebac';
                if (mode === 'external' && inputUrl) {
                    inputUrl.placeholder = 'https://drive.google.com/... or https://github.com/... or https://colab.research.google.com/...';
                    inputUrl.focus();
                } else if (mode === 'file' && inputUrl) {
                    inputUrl.placeholder = '../resources/Theme A/... (or drag & drop a file above)';
                }
            });
        });

        // ManageBac Text Quick Parser
        if (parseMbBtn && mbRawPaste) {
            parseMbBtn.addEventListener('click', () => {
                const raw = mbRawPaste.value.trim();
                if (!raw) return;
                const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                if (lines.length && inputTitle) {
                    inputTitle.value = lines[0].replace(/^\[.*?\]\s*/, '');
                }
                if (lines.length > 1 && inputNote) {
                    inputNote.value = lines.slice(1).join(' ');
                }
                autoClassifyFromText(raw);
                if (/year 2|dp2|y13/i.test(raw) && selectCohort) {
                    selectCohort.value = /hl only/i.test(raw) ? 'Year 2 (HL Only)' : 'Year 2 (SL/HL)';
                } else if (/year 1|dp1|y12/i.test(raw) && selectCohort) {
                    selectCohort.value = /hl only/i.test(raw) ? 'Year 1 (HL Only)' : 'Year 1 (SL/HL)';
                }
                const urlMatch = raw.match(/https?:\/\/[^\s)]+/i);
                if (urlMatch) {
                    if (urlMatch[0].includes('managebac.com') && inputMbUrl) {
                        inputMbUrl.value = urlMatch[0];
                    }
                    if (inputUrl && !inputUrl.value) {
                        inputUrl.value = urlMatch[0];
                        detectPlatformFromUrl(urlMatch[0]);
                    }
                }
                showToast('Parsed ManageBac fields into composer');
            });
        }

        // Drag and Drop Zone Events
        if (dropzone && fileInput) {
            dropzone.addEventListener('click', () => fileInput.click());
            dropzone.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInput.click();
                }
            });
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('is-dragover');
            });
            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('is-dragover');
            });
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('is-dragover');
                if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleSelectedFile(e.dataTransfer.files[0]);
                }
            });
            fileInput.addEventListener('change', () => {
                if (fileInput.files && fileInput.files[0]) {
                    handleSelectedFile(fileInput.files[0]);
                }
            });
        }

        // Auto-sync Theme <-> Unit selects & URL detection
        if (selectUnit && selectTheme) {
            selectUnit.addEventListener('change', () => {
                const u = selectUnit.value;
                if (u.startsWith('A')) selectTheme.value = 'Theme A';
                else if (u.startsWith('B')) selectTheme.value = 'Theme B';
                else if (u === 'IA') selectTheme.value = 'IA';
                else if (u === 'CS') selectTheme.value = 'Case Study';
                else if (u === 'Revision') selectTheme.value = 'Revision';
                else if (u === 'External') selectTheme.value = 'External';
                if (inputCode && (!inputCode.value || /^[AB][1-4]$/.test(inputCode.value))) {
                    inputCode.value = u;
                }
            });
        }
        if (inputTitle) {
            inputTitle.addEventListener('blur', () => {
                autoClassifyFromText(inputTitle.value);
            });
        }
        if (inputUrl) {
            inputUrl.addEventListener('input', () => {
                detectPlatformFromUrl(inputUrl.value);
            });
        }

        // Studio Form Submit
        if (dropForm) {
            dropForm.addEventListener('submit', (e) => {
                e.preventDefault();
                submitDropForm(false);
            });
        }
        if (publishCopyMbBtn) {
            publishCopyMbBtn.addEventListener('click', () => {
                submitDropForm(true);
            });
        }

        // Preview Modal Close
        if (previewCloseBtn && previewModal) {
            previewCloseBtn.addEventListener('click', () => { previewModal.hidden = true; previewBody.innerHTML = ''; });
            previewModal.addEventListener('click', (e) => {
                if (e.target === previewModal) {
                    previewModal.hidden = true;
                    previewBody.innerHTML = '';
                }
            });
        }

        // Keyboard Shortcuts ('/' for search, 'n' for Drop Studio, 'Escape' to close modals, 'power' sequence)
        let keySeq = '';
        window.addEventListener('keydown', (e) => {
            const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
            const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable);

            if (e.key === 'Escape') {
                if (previewModal && !previewModal.hidden) {
                    previewModal.hidden = true;
                    previewBody.innerHTML = '';
                } else if (mbPopover && !mbPopover.hidden) {
                    mbPopover.hidden = true;
                } else if (studioDrawer && !studioDrawer.hidden) {
                    closeStudio();
                }
                return;
            }

            if (isTyping) return;

            if (e.key === '/') {
                e.preventDefault();
                const activeSearch = (!archiveTabPane || archiveTabPane.hidden)
                    ? searchInput
                    : archiveTabPane.querySelector('input[type="search"]');
                if (activeSearch) activeSearch.focus();
            } else if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                openStudio(null, null);
            }

            if (e.key && e.key.length === 1) {
                keySeq = (keySeq + e.key.toLowerCase()).slice(-12);
                if (keySeq.endsWith('power')) {
                    keySeq = '';
                    if (window.DataService && typeof window.DataService.setFacultyUnlocked === 'function') {
                        window.DataService.setFacultyUnlocked(true);
                    }
                    syncFacultyState();
                    showToast('Faculty Mode unlocked');
                }
            }
        });

        // URL Query Parameter Hydration (?tab=archive, ?topic=Theme A, ?unit=A2, ?search=...)
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const paramTab = urlParams.get('tab');
            const paramTopic = urlParams.get('topic') || urlParams.get('unit');
            const paramSearch = urlParams.get('search') || urlParams.get('q');

            if (paramTab === 'archive' || window.location.hash === '#archive') {
                const archiveBtn = document.querySelector('[data-tab="archive"]');
                if (archiveBtn) archiveBtn.click();
            }

            if (paramTopic) {
                const u = paramTopic.toUpperCase();
                unitStates[u] = 'included';
                renderTopicPills();
                updateActiveFiltersBadge();
            }

            if (paramSearch) {
                searchQuery = paramSearch.trim();
                if (searchInput) searchInput.value = searchQuery;
            }
        } catch (e) {}
    }

    function handleResourceDeepLink() {
        try {
            const hash = window.location.hash || '';
            const params = new URLSearchParams(window.location.search);
            const previewId = params.get('preview') || (hash.indexOf('#drop-') === 0 ? decodeURIComponent(hash.substring(6)) : null);

            if (hash === '#faculty-drop-studio') {
                setTimeout(() => {
                    openStudio(null, null);
                }, 100);
            } else if (previewId) {
                setTimeout(() => {
                    const targetDrop = (allDrops || []).find(d => String(d.id) === String(previewId));
                    if (targetDrop && typeof openPreviewModal === 'function') {
                        openPreviewModal(targetDrop);
                    }
                    const targetEl = document.getElementById('drop-' + previewId) || document.querySelector(`[data-id="${previewId}"]`);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetEl.classList.add('highlight-pulse');
                        setTimeout(() => targetEl.classList.remove('highlight-pulse'), 2500);
                    }
                }, 150);
            } else if (hash === '#archive' || params.get('tab') === 'archive') {
                const archiveBtn = document.querySelector('[data-tab="archive"]');
                if (archiveBtn) archiveBtn.click();
            }
        } catch (e) {}
    }

    function markResourcesAsSeen() {
        try {
            const dropIds = (allDrops || []).map(d => d.id).filter(Boolean);
            if (dropIds.length > 0) {
                localStorage.setItem('eis_seen_resources_ids', JSON.stringify(dropIds));
            }
        } catch (e) {}
    }

    function init() {
        loadSavedIds();
        setupEventListeners();
        applyManageBacConfigUI();

        if (window.DataService) {
            allDrops = window.DataService.getTeacherResources() || [];
            const dls = window.DataService.getDeadlines() || [];
            deadlinesMap = new Map();
            dls.forEach(dl => { if (dl.id) deadlinesMap.set(dl.id, dl); });
            populateDeadlineSelect();
            syncFacultyState();
            markResourcesAsSeen();

            const cachedTree = window.DataService.getResourcesTree();
            if (cachedTree) indexArchiveManifest(cachedTree);
            else if (window.DataService.ready) {
                window.DataService.ready.then(() => {
                    const tree = window.DataService.getResourcesTree();
                    if (tree) indexArchiveManifest(tree);
                    renderFeed();
                    handleResourceDeepLink();
                });
            }

            window.DataService.subscribe('teacherResources', (updatedDrops) => {
                allDrops = updatedDrops || [];
                renderFeed();
                handleResourceDeepLink();
            });
            window.DataService.subscribe('deadlines', (updatedDls) => {
                deadlinesMap = new Map();
                (updatedDls || []).forEach(dl => { if (dl.id) deadlinesMap.set(dl.id, dl); });
                populateDeadlineSelect();
                renderFeed();
            });
        } else {
            renderFeed();
        }

        handleResourceDeepLink();
        window.addEventListener('hashchange', handleResourceDeepLink);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
