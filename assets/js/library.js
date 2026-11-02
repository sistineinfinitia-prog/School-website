/**
 * IB Computer Science | Emirates International School Meadows (EIS)
 * Department Resource Vault & Archive
 *
 * Reads data/resources.json (built by scripts/build-resources.mjs) and renders
 * file lists into any element with a data-library attribute:
 *
 *   data-library="full"                     Full searchable archive workspace (resources page)
 *   data-library="scope" data-paths="A|B"   Grouped lists for specified folders (curriculum, etc.)
 */
(function () {
    'use strict';

    var BASE = document.documentElement.getAttribute('data-base') || '';

    // Teacher-only planning documents stay out of the student library.
    var STAFF_ONLY = ['Weekly Unit planning'];

    // Order of top-level groups in the full library.
    var ORDER = ['Theme A', 'Theme B', 'Revision Folder', 'IA', 'Curriculum', ''];

    var KINDS = {
        slides: { label: 'Slides', exts: ['ppt', 'pptx', 'key', 'odp'] },
        docs: { label: 'Documents', exts: ['doc', 'docx', 'odt', 'rtf', 'txt'] },
        pdf: { label: 'PDFs', exts: ['pdf'] },
        sheets: { label: 'Spreadsheets', exts: ['xls', 'xlsx', 'csv', 'ods'] },
        other: { label: 'Other', exts: [] }
    };

    var OPEN_IN_BROWSER = ['pdf', 'html', 'htm', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'txt'];

    // Map top-level collections to IB 2027 unit codes for the "+ Drop File" action
    var COLLECTION_UNIT_MAP = {
        'Theme A': 'A1',
        'Theme B': 'B1',
        'Revision Folder': 'Revision',
        'Overall Practice Papers': 'Revision',
        'IA': 'IA',
        'Curriculum': 'General Reference',
        'General Reference': 'General Reference'
    };

    function kindOf(ext) {
        var cleanExt = (ext || '').toLowerCase();
        for (var k in KINDS) {
            if (KINDS[k].exts.indexOf(cleanExt) !== -1) return k;
        }
        return 'other';
    }

    function slug(path) {
        return (path || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function fileUrl(path) {
        return BASE + 'resources/' + path.split('/').map(encodeURIComponent).join('/');
    }

    function absoluteFileUrl(path) {
        var rel = fileUrl(path);
        try {
            return new URL(rel, window.location.href).href;
        } catch (e) {
            return window.location.origin + '/' + rel.replace(/^\//, '');
        }
    }

    function formatSize(bytes) {
        if (!bytes || isNaN(bytes)) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function normalizePath(p) {
        return (p || '').replace(/^\/+|\/+$/g, '').replace(/^resources\//i, '');
    }

    function findFolder(tree, rawPath) {
        var path = normalizePath(rawPath);
        if (!path) return tree;
        var parts = path.split('/');
        var node = tree;
        for (var i = 0; i < parts.length && node; i++) {
            node = node.folders.filter(function (f) { return f.name === parts[i]; })[0];
        }
        return node || null;
    }

    /** Flattens a folder into sections of { trail, files }, depth first. */
    function sections(folder, trail) {
        var out = [];
        if (folder.files.length) out.push({ trail: trail, files: folder.files });
        folder.folders.forEach(function (child) {
            out = out.concat(sections(child, trail.concat(child.title)));
        });
        return out;
    }

    function highlight(text, terms) {
        var frag = document.createDocumentFragment();
        if (!terms || !terms.length) {
            frag.appendChild(document.createTextNode(text));
            return frag;
        }
        var escaped = terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
        var re = new RegExp('(' + escaped.join('|') + ')', 'gi');
        text.split(re).forEach(function (part, i) {
            if (!part) return;
            frag.appendChild(i % 2 ? el('mark', null, part) : document.createTextNode(part));
        });
        return frag;
    }

    function plural(n, word) {
        return n + ' ' + word + (n === 1 ? '' : 's');
    }

    function showToast(msg) {
        var toast = document.getElementById('res-toast');
        if (toast) {
            toast.textContent = msg;
            toast.hidden = false;
            toast.classList.add('is-visible');
            clearTimeout(toast._timeout);
            toast._timeout = setTimeout(function () {
                toast.classList.remove('is-visible');
                setTimeout(function () { toast.hidden = true; }, 200);
            }, 2400);
        }
    }

    function copyToClipboard(text, successMsg) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showToast(successMsg || 'Copied to clipboard');
            }).catch(function () {
                fallbackCopy(text, successMsg);
            });
        } else {
            fallbackCopy(text, successMsg);
        }
    }

    function fallbackCopy(text, successMsg) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showToast(successMsg || 'Copied to clipboard');
        } catch (e) {
            window.prompt('Copy to clipboard:', text);
        }
        document.body.removeChild(ta);
    }

    /* --- Scoped lists (curriculum, admin) ------------------------------- */

    function renderScope(host, manifest) {
        var raw = host.getAttribute('data-paths') || host.getAttribute('data-scope') || '';
        var paths = raw.split('|').map(normalizePath).filter(Boolean);
        var withSearch = host.getAttribute('data-search') === 'true';
        host.textContent = '';

        var groups = [];
        paths.forEach(function (path) {
            var folder = findFolder(manifest.tree, path);
            if (!folder || !folder.count) return;
            groups.push({
                path: path,
                title: host.getAttribute('data-title-' + slug(path)) || folder.title,
                folder: folder,
                sections: sections(folder, [])
            });
        });

        if (!groups.length) {
            host.appendChild(el('p', 'empty', 'No files have been added here yet.'));
            return;
        }

        var searchInput = null;
        if (withSearch) {
            var toolbar = el('div', 'vault-toolbar');
            var wrap = el('div', 'search-wrap');
            wrap.innerHTML = '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"></circle><path d="M13 13l4 4" stroke-linecap="round"></path></svg>';
            searchInput = el('input', 'search-input');
            searchInput.type = 'search';
            searchInput.placeholder = 'Filter files by topic or filename...';
            searchInput.setAttribute('aria-label', 'Filter files by topic or filename');
            wrap.appendChild(searchInput);
            toolbar.appendChild(wrap);
            host.appendChild(toolbar);
        }

        var results = el('div', 'library-results');
        host.appendChild(results);

        function drawScope(query) {
            var terms = (query || '').toLowerCase().split(/\s+/).filter(Boolean);
            results.textContent = '';
            var totalShown = 0;

            groups.forEach(function (g) {
                var group = el('section', 'file-group');
                if (groups.length > 1) {
                    group.appendChild(el('h3', 'h3', g.title));
                }

                var subNodes = [];
                var groupCount = 0;

                g.sections.forEach(function (s) {
                    var trailText = s.trail.join(' / ');
                    var matched = s.files.filter(function (f) {
                        if (!terms.length) return true;
                        var hay = (f.title + ' ' + f.name + ' ' + trailText).toLowerCase();
                        return terms.every(function (t) { return hay.indexOf(t) !== -1; });
                    });
                    if (!matched.length) return;
                    groupCount += matched.length;
                    totalShown += matched.length;

                    var sub = el('div', 'file-sub');
                    if (s.trail.length) sub.appendChild(el('h4', 'file-sub-title', trailText));

                    var ul = el('ul', 'files');
                    matched.forEach(function (f) {
                        var li = el('li');
                        var a = el('a', 'file');
                        a.href = fileUrl(f.path);
                        if (OPEN_IN_BROWSER.indexOf(f.ext) !== -1) {
                            a.target = '_blank';
                            a.rel = 'noopener';
                        } else {
                            a.setAttribute('download', f.name);
                        }
                        a.appendChild(el('span', 'file-type', f.ext || 'file'));
                        var name = el('span', 'file-name');
                        name.appendChild(highlight(f.title, terms));
                        a.appendChild(name);
                        a.appendChild(el('span', 'file-size', formatSize(f.size)));
                        li.appendChild(a);
                        ul.appendChild(li);
                    });

                    sub.appendChild(ul);
                    subNodes.push(sub);
                });

                if (groupCount > 0) {
                    group.appendChild(el('p', 'group-meta', plural(groupCount, 'file')));
                    subNodes.forEach(function (n) { group.appendChild(n); });
                    results.appendChild(group);
                }
            });

            if (totalShown === 0) {
                results.appendChild(el('p', 'empty', 'No files match "' + (query || '').trim() + '".'));
            }
        }

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                drawScope(searchInput.value);
            });
        }

        drawScope('');
    }

    /* --- Full Department Archive Workspace ------------------------------ */

    function createFullWorkspaceSkeleton(host) {
        host.textContent = '';

        var workspace = el('div', 'archive-workspace');

        // Sidebar Directory
        var sidebar = el('aside', 'archive-sidebar');
        var sidebarTitle = el('div', 'archive-sidebar-title', 'Collections');
        var navList = el('ul', 'archive-nav-list');
        navList.setAttribute('role', 'navigation');
        navList.setAttribute('aria-label', 'Department resource collections');
        sidebar.appendChild(sidebarTitle);
        sidebar.appendChild(navList);

        // Main Content Area
        var main = el('div', 'archive-main');

        var tools = el('div', 'library-tools vault-toolbar');

        // Top toolbar: search bar + expand/collapse toggle
        var topRow = el('div', 'vault-toolbar-top');
        var searchWrap = el('div', 'search-wrap');
        searchWrap.innerHTML = '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"></circle><path d="M13 13l4 4" stroke-linecap="round"></path></svg>';
        var input = el('input', 'search-input');
        input.type = 'search';
        input.placeholder = 'Search files by topic, code (A1, B2, SQL, OOP), or filename...';
        input.setAttribute('aria-label', 'Search department resource files');
        searchWrap.appendChild(input);
        topRow.appendChild(searchWrap);

        var toggleAllBtn = el('button', 'btn-res-secondary btn-sm', 'Collapse All');
        toggleAllBtn.type = 'button';
        toggleAllBtn.id = 'archive-toggle-all-btn';
        toggleAllBtn.setAttribute('aria-label', 'Collapse or expand all sections');
        topRow.appendChild(toggleAllBtn);

        tools.appendChild(topRow);

        // Bottom toolbar: format filter pills + summary count
        var bottomRow = el('div', 'vault-toolbar-bottom');
        var filterBar = el('div', 'filters filter-pills');
        filterBar.setAttribute('role', 'toolbar');
        filterBar.setAttribute('aria-label', 'Filter files by format');
        bottomRow.appendChild(filterBar);

        var metaRow = el('div', 'vault-meta');
        var summary = el('span', 'library-summary');
        summary.setAttribute('role', 'status');
        summary.setAttribute('aria-live', 'polite');
        metaRow.appendChild(summary);
        bottomRow.appendChild(metaRow);

        tools.appendChild(bottomRow);

        var results = el('div', 'library-results');

        main.appendChild(tools);
        main.appendChild(results);

        workspace.appendChild(sidebar);
        workspace.appendChild(main);
        host.appendChild(workspace);

        return {
            sidebarNav: navList,
            searchInput: input,
            filterBar: filterBar,
            summary: summary,
            results: results,
            toggleAllBtn: toggleAllBtn
        };
    }

    function createArchiveFileRow(file, terms, showPath, unitCode) {
        var li = el('li', 'file-item');
        var row = el('div', 'file-row-wrap');

        // File format tag
        var extClean = (file.ext || 'FILE').toUpperCase();
        var typeBadge = el('span', 'file-type', extClean);
        row.appendChild(typeBadge);

        // Title and optional path trail
        var infoWrap = el('div', 'file-info-col');
        var a = el('a', 'file-name');
        var url = fileUrl(file.path);
        a.href = url;
        var isOpenInBrowser = OPEN_IN_BROWSER.indexOf(file.ext) !== -1;
        if (isOpenInBrowser) {
            a.target = '_blank';
            a.rel = 'noopener';
        } else {
            a.setAttribute('download', file.name);
        }
        a.appendChild(highlight(file.title, terms));

        if (showPath && file.trail) {
            var pathSpan = el('span', 'file-path', file.trail);
            a.appendChild(pathSpan);
        }
        infoWrap.appendChild(a);
        row.appendChild(infoWrap);

        // File size
        var sizeSpan = el('span', 'file-size', formatSize(file.size));
        row.appendChild(sizeSpan);

        // Action buttons
        var actions = el('div', 'file-row-actions');

        // 1. Copy Direct Link
        var copyLinkBtn = el('button', 'btn-file-quick btn-copy-link', 'Copy Link');
        copyLinkBtn.type = 'button';
        copyLinkBtn.title = 'Copy direct URL to file';
        copyLinkBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var absUrl = absoluteFileUrl(file.path);
            copyToClipboard(absUrl, 'Copied file link to clipboard');
            copyLinkBtn.textContent = 'Copied!';
            setTimeout(function () { copyLinkBtn.textContent = 'Copy Link'; }, 1500);
        });
        actions.appendChild(copyLinkBtn);

        // 3. In-Page Preview (if available)
        var previewBtn = el('button', 'btn-file-quick btn-preview-file', 'Preview');
        previewBtn.type = 'button';
        previewBtn.title = 'Preview syllabus alignment and file in drawer';
        previewBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (typeof window.openResourcePreviewModal === 'function') {
                window.openResourcePreviewModal({
                    id: file.path,
                    title: file.title,
                    fileUrl: fileUrl(file.path),
                    fileType: extClean,
                    topicCode: unitCode || 'Archive',
                    description: file.trail ? 'Archive Folder: ' + file.trail : 'Department Resource Archive'
                });
            } else {
                window.open(url, '_blank');
            }
        });
        actions.appendChild(previewBtn);

        // 4. Open / Download
        var openA = el('a', 'btn-file-quick btn-open-file');
        openA.href = url;
        if (isOpenInBrowser) {
            openA.target = '_blank';
            openA.rel = 'noopener';
            openA.innerHTML = '<span>Open</span><svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-left:4px;"><path d="M4 12L12 4M6 4h6v6"/></svg>';
        } else {
            openA.setAttribute('download', file.name);
            openA.innerHTML = '<span>Download</span><svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-left:4px;"><path d="M8 3v10M4 9l4 4 4-4"/></svg>';
        }
        actions.appendChild(openA);

        row.appendChild(actions);
        li.appendChild(row);
        return li;
    }

    function renderFull(host, manifest) {
        var dom = createFullWorkspaceSkeleton(host);

        var groups = [];
        ORDER.forEach(function (path) {
            if (path === '') {
                if (manifest.tree.files.length) {
                    groups.push({
                        path: '',
                        title: 'General Reference',
                        unitCode: 'General Reference',
                        folder: { files: manifest.tree.files, folders: [], count: manifest.tree.files.length }
                    });
                }
                return;
            }
            var folder = findFolder(manifest.tree, path);
            if (folder && folder.count) {
                groups.push({
                    path: path,
                    title: folder.title,
                    unitCode: COLLECTION_UNIT_MAP[folder.title] || 'General Reference',
                    folder: folder
                });
            }
        });

        manifest.tree.folders.forEach(function (folder) {
            if (STAFF_ONLY.indexOf(folder.path) !== -1) return;
            if (ORDER.indexOf(folder.path) === -1 && folder.count) {
                groups.splice(groups.length - 1, 0, {
                    path: folder.path,
                    title: folder.title,
                    unitCode: COLLECTION_UNIT_MAP[folder.title] || 'General Reference',
                    folder: folder
                });
            }
        });

        var all = [];
        groups.forEach(function (g) {
            g.id = slug(g.path);
            g.sections = sections(g.folder, []);
            g.sections.forEach(function (s) {
                s.files.forEach(function (f) {
                    f.group = g;
                    f.kind = kindOf(f.ext);
                    f.trail = [g.title].concat(s.trail).join(' / ');
                    f.haystack = (f.title + ' ' + f.name + ' ' + f.trail).toLowerCase();
                    all.push(f);
                });
            });
        });

        if (dom.searchInput) {
            dom.searchInput.placeholder = 'Search ' + all.length + ' files by topic, code (A1, B2, SQL, OOP), or filename...';
        }

        var state = {
            query: '',
            kind: 'all',
            activeGroup: null,
            allCollapsed: false
        };

        // Populate Sidebar
        var allSidebarLi = el('li');
        var allSidebarLink = el('a', 'archive-nav-link is-active');
        allSidebarLink.href = '#';
        allSidebarLink.innerHTML = '<span>All Collections</span><span class="archive-nav-count">' + all.length + '</span>';
        allSidebarLink.addEventListener('click', function (e) {
            e.preventDefault();
            state.activeGroup = null;
            updateSidebarActive();
            render();
        });
        allSidebarLi.appendChild(allSidebarLink);
        dom.sidebarNav.appendChild(allSidebarLi);

        var sidebarLinks = [allSidebarLink];

        groups.forEach(function (g) {
            var li = el('li');
            var a = el('a', 'archive-nav-link');
            a.href = '#' + g.id;
            a.dataset.groupId = g.id;
            a.innerHTML = '<span class="archive-nav-name">' + g.title + '</span><span class="archive-nav-count">' + g.folder.count + '</span>';
            a.addEventListener('click', function (e) {
                e.preventDefault();
                state.activeGroup = g.id;
                updateSidebarActive();
                render();
                var target = document.getElementById(g.id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            li.appendChild(a);
            dom.sidebarNav.appendChild(li);
            sidebarLinks.push(a);
        });

        function updateSidebarActive() {
            sidebarLinks.forEach(function (link) {
                if (!state.activeGroup) {
                    link.classList.toggle('is-active', link === allSidebarLink);
                } else {
                    link.classList.toggle('is-active', link.dataset.groupId === state.activeGroup);
                }
            });
        }

        // Format Filter Buttons
        var counts = { all: all.length };
        all.forEach(function (f) { counts[f.kind] = (counts[f.kind] || 0) + 1; });
        var kinds = ['all'].concat(Object.keys(KINDS).filter(function (k) { return counts[k]; }));

        kinds.forEach(function (k) {
            var b = el('button', 'filter filter-pill');
            b.type = 'button';
            b.dataset.kind = k;
            b.setAttribute('aria-pressed', String(k === 'all'));
            b.textContent = (k === 'all' ? 'All' : KINDS[k].label) + ' (' + counts[k] + ')';
            dom.filterBar.appendChild(b);
        });

        dom.filterBar.addEventListener('click', function (e) {
            var b = e.target.closest('.filter');
            if (!b) return;
            state.kind = b.dataset.kind;
            Array.prototype.forEach.call(dom.filterBar.children, function (x) {
                x.setAttribute('aria-pressed', String(x === b));
            });
            render();
        });

        // Toggle All Collapse/Expand
        dom.toggleAllBtn.addEventListener('click', function () {
            state.allCollapsed = !state.allCollapsed;
            dom.toggleAllBtn.textContent = state.allCollapsed ? 'Expand All' : 'Collapse All';
            var allGroups = dom.results.querySelectorAll('.file-group');
            allGroups.forEach(function (sec) {
                sec.classList.toggle('is-collapsed', state.allCollapsed);
                var hdr = sec.querySelector('.file-group-header');
                if (hdr) hdr.setAttribute('aria-expanded', String(!state.allCollapsed));
            });
        });

        function render() {
            var terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
            var searching = terms.length > 0;
            dom.results.textContent = '';

            var matches = all.filter(function (f) {
                if (state.kind !== 'all' && f.kind !== state.kind) return false;
                if (state.activeGroup && f.group.id !== state.activeGroup) return false;
                return terms.every(function (t) { return f.haystack.indexOf(t) !== -1; });
            });

            if (dom.summary) {
                dom.summary.textContent = searching || state.kind !== 'all' || state.activeGroup
                    ? plural(matches.length, 'file') + ' found'
                    : plural(all.length, 'file') + ' across ' + plural(groups.length, 'collection');
            }

            if (!matches.length) {
                var empty = el('div', 'empty');
                empty.appendChild(el('p', null, searching
                    ? 'No files match \u201c' + state.query.trim() + '\u201d.'
                    : 'No files match the selected filters.'));
                var reset = el('button', 'btn-res-secondary btn-sm', 'Clear search and filters');
                reset.type = 'button';
                reset.addEventListener('click', function () {
                    dom.searchInput.value = '';
                    state.query = '';
                    state.activeGroup = null;
                    updateSidebarActive();
                    dom.filterBar.querySelector('[data-kind="all"]').click();
                    dom.searchInput.focus();
                });
                empty.appendChild(reset);
                dom.results.appendChild(empty);
                return;
            }

            // Searching view: flat list sorted by relevance
            if (searching) {
                var groupSec = el('section', 'file-group');
                var groupHdr = el('header', 'file-group-header');
                groupHdr.innerHTML = '<div class="file-group-title-wrap"><h2 class="file-group-title">Search Results</h2><span class="file-group-count">' + plural(matches.length, 'match') + '</span></div>';
                groupSec.appendChild(groupHdr);

                var groupBody = el('div', 'file-group-body');
                var ul = el('ul', 'files');
                matches.forEach(function (f) {
                    ul.appendChild(createArchiveFileRow(f, terms, true, f.group ? f.group.unitCode : ''));
                });
                groupBody.appendChild(ul);
                groupSec.appendChild(groupBody);
                dom.results.appendChild(groupSec);
                return;
            }

            // Hierarchical Collections View
            groups.forEach(function (g) {
                if (state.activeGroup && g.id !== state.activeGroup) return;

                var section = el('section', 'file-group');
                section.id = g.id;
                section.dataset.groupPath = g.path;
                if (state.allCollapsed) section.classList.add('is-collapsed');

                var visibleCount = 0;
                var subNodes = [];

                g.sections.forEach(function (s) {
                    var files = s.files.filter(function (f) {
                        return state.kind === 'all' || f.kind === state.kind;
                    });
                    if (!files.length) return;
                    visibleCount += files.length;

                    var sub = el('div', 'file-sub');
                    if (s.trail.length) {
                        sub.appendChild(el('h3', 'file-sub-title', s.trail.join(' / ')));
                    }

                    var subUl = el('ul', 'files');
                    files.forEach(function (f) {
                        subUl.appendChild(createArchiveFileRow(f, terms, false, g.unitCode));
                    });
                    sub.appendChild(subUl);
                    subNodes.push(sub);
                });

                if (!visibleCount) return;

                // Collapsible Header
                var header = el('header', 'file-group-header');
                header.setAttribute('role', 'button');
                header.setAttribute('tabindex', '0');
                header.setAttribute('aria-expanded', String(!state.allCollapsed));

                var titleWrap = el('div', 'file-group-title-wrap');
                titleWrap.innerHTML = '<svg class="file-group-chevron" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
                titleWrap.appendChild(el('h2', 'file-group-title', g.title));
                titleWrap.appendChild(el('span', 'file-group-count', plural(visibleCount, 'file')));
                header.appendChild(titleWrap);

                // Toggle collapse on header click
                header.addEventListener('click', function () {
                    section.classList.toggle('is-collapsed');
                    header.setAttribute('aria-expanded', String(!section.classList.contains('is-collapsed')));
                });
                header.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        header.click();
                    }
                });

                section.appendChild(header);

                var body = el('div', 'file-group-body');
                subNodes.forEach(function (sn) { body.appendChild(sn); });
                section.appendChild(body);

                dom.results.appendChild(section);
            });
        }

        var debounceTimer = 0;
        dom.searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                state.query = dom.searchInput.value;
                render();
            }, 90);
        });

        // Check for URL query parameter ?q=
        var params = new URLSearchParams(window.location.search);
        if (params.get('q')) {
            dom.searchInput.value = params.get('q');
            state.query = dom.searchInput.value;
        }

        render();

        if (window.location.hash) {
            var target = document.getElementById(window.location.hash.slice(1));
            if (target) {
                setTimeout(function () {
                    target.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }

    /* --- Boot & Manifest Loader ----------------------------------------- */

    function fail(hosts) {
        hosts.forEach(function (host) {
            var results = host.querySelector('.library-results') || host;
            results.textContent = '';
            results.appendChild(el('p', 'empty', 'The file list could not be loaded. Please refresh the page or try again later.'));
        });
    }

    var hosts = Array.prototype.slice.call(document.querySelectorAll('[data-library]'));
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-library-count]'));
    if (!hosts.length && !counters.length) return;

    var manifestCache = null;

    function renderManifest(manifest) {
        if (!manifest || !manifest.tree) return;
        counters.forEach(function (node) {
            var path = node.getAttribute('data-library-count');
            var folder = path === '*'
                ? { count: manifest.tree.count - STAFF_ONLY.reduce(function (n, p) {
                    var f = findFolder(manifest.tree, p);
                    return n + (f ? f.count : 0);
                }, 0) }
                : findFolder(manifest.tree, path);
            if (folder) node.textContent = plural(folder.count, 'file');
        });
        hosts.forEach(function (host) {
            if (host.getAttribute('data-library') === 'full') renderFull(host, manifest);
            else renderScope(host, manifest);
        });
    }

    function loadManifest() {
        if (manifestCache) return Promise.resolve(manifestCache);
        if (typeof window !== 'undefined' && window.DataService && typeof window.DataService.getResourcesTree === 'function') {
            var cachedTree = window.DataService.getResourcesTree();
            if (cachedTree) {
                manifestCache = cachedTree;
                return Promise.resolve(manifestCache);
            }
        }
        return fetch(BASE + 'data/resources.json')
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            })
            .then(function (manifest) {
                manifestCache = manifest;
                return manifest;
            });
    }

    loadManifest()
        .then(renderManifest)
        .catch(function (err) {
            console.warn('[Library] Failed to load resources manifest:', err);
            fail(hosts);
        });
})();
