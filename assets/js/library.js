/**
 * IB Computer Science | Emirates International School (EIS) — Resource Library
 *
 * Reads data/resources.json (built by scripts/build-resources.mjs) and renders
 * file lists into any element with a data-library attribute:
 *
 *   data-library="full"                     Searchable library (resources page)
 *   data-library="scope" data-paths="A|B"   Grouped lists for the given folders
 *
 * Also supports data-scope="resources/Theme A" and optional data-search="true"
 * on scoped containers.
 */
(function () {
    'use strict';

    var BASE = document.documentElement.getAttribute('data-base') || '';

    // Teacher-only planning documents stay out of the student library.
    var STAFF_ONLY = ['Weekly Unit planning'];

    // Order of top-level groups in the full library.
    var ORDER = ['Theme A', 'Theme B', 'Revision Folder', 'Overall Practice Papers', 'IA', 'Curriculum', ''];

    var KINDS = {
        slides: { label: 'Slides', exts: ['ppt', 'pptx', 'key', 'odp'] },
        docs: { label: 'Documents', exts: ['doc', 'docx', 'odt', 'rtf', 'txt'] },
        pdf: { label: 'PDFs', exts: ['pdf'] },
        sheets: { label: 'Spreadsheets', exts: ['xls', 'xlsx', 'csv', 'ods'] },
        other: { label: 'Other', exts: [] }
    };

    var OPEN_IN_BROWSER = ['pdf', 'html', 'htm', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'txt'];

    function kindOf(ext) {
        for (var k in KINDS) {
            if (KINDS[k].exts.indexOf(ext) !== -1) return k;
        }
        return 'other';
    }

    function slug(path) {
        return (path || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function fileUrl(path) {
        return BASE + 'resources/' + path.split('/').map(encodeURIComponent).join('/');
    }

    function formatSize(bytes) {
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
        if (!terms.length) {
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

    function fileRow(file, terms, showPath) {
        var li = el('li');
        var a = el('a', 'file');
        a.href = fileUrl(file.path);
        if (OPEN_IN_BROWSER.indexOf(file.ext) !== -1) {
            a.target = '_blank';
            a.rel = 'noopener';
        } else {
            a.setAttribute('download', file.name);
        }

        a.appendChild(el('span', 'file-type', file.ext || 'file'));

        var name = el('span', 'file-name');
        name.appendChild(highlight(file.title, terms || []));
        if (showPath && file.trail) {
            name.appendChild(el('span', 'file-path', file.trail));
        }
        a.appendChild(name);

        a.appendChild(el('span', 'file-size', formatSize(file.size)));
        a.setAttribute('aria-label', file.title + ', ' + (file.ext || 'file').toUpperCase() + ', ' + formatSize(file.size));
        li.appendChild(a);
        return li;
    }

    function fileList(files, terms, showPath) {
        var ul = el('ul', 'files');
        files.forEach(function (f) { ul.appendChild(fileRow(f, terms, showPath)); });
        return ul;
    }

    function plural(n, word) {
        return n + ' ' + word + (n === 1 ? '' : 's');
    }

    /* --- Scoped lists (theme pages, curriculum, admin) ------------------- */

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
                    sub.appendChild(fileList(matched, terms, false));
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

    /* --- Full library --------------------------------------------------- */

    function ensureFullSkeleton(host) {
        if (host.querySelector('.library-results')) return;
        host.textContent = '';

        var tools = el('div', 'library-tools vault-toolbar');
        var wrap = el('div', 'search-wrap');
        wrap.innerHTML = '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"></circle><path d="M13 13l4 4" stroke-linecap="round"></path></svg>';
        var input = el('input', 'search-input');
        input.type = 'search';
        input.placeholder = 'Search 131 files by topic, code (A1, B2, SQL, OOP), or filename...';
        input.setAttribute('aria-label', 'Search department resource files');
        wrap.appendChild(input);
        tools.appendChild(wrap);

        var filterBar = el('div', 'filters filter-pills');
        filterBar.setAttribute('role', 'toolbar');
        filterBar.setAttribute('aria-label', 'Filter by file format');
        tools.appendChild(filterBar);

        var metaRow = el('div', 'vault-meta');
        var summary = el('span', 'library-summary');
        summary.setAttribute('role', 'status');
        summary.setAttribute('aria-live', 'polite');
        metaRow.appendChild(summary);
        tools.appendChild(metaRow);

        var indexNav = el('nav', 'library-index');
        indexNav.setAttribute('aria-label', 'Resource collections');
        var indexList = el('ul', 'filter-pills');
        indexNav.appendChild(indexList);
        tools.appendChild(indexNav);

        var results = el('div', 'library-results');
        host.appendChild(tools);
        host.appendChild(results);
    }

    function renderFull(host, manifest) {
        ensureFullSkeleton(host);

        var groups = [];
        ORDER.forEach(function (path) {
            if (path === '') {
                if (manifest.tree.files.length) {
                    groups.push({ path: '', title: 'General Reference', folder: { files: manifest.tree.files, folders: [], count: manifest.tree.files.length } });
                }
                return;
            }
            var folder = findFolder(manifest.tree, path);
            if (folder && folder.count) groups.push({ path: path, title: folder.title, folder: folder });
        });
        manifest.tree.folders.forEach(function (folder) {
            if (STAFF_ONLY.indexOf(folder.path) !== -1) return;
            if (ORDER.indexOf(folder.path) === -1 && folder.count) {
                groups.splice(groups.length - 1, 0, { path: folder.path, title: folder.title, folder: folder });
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

        var tools = host.querySelector('.library-tools');
        var input = host.querySelector('input[type="search"]');
        var filterBar = host.querySelector('.filters');
        var index = host.querySelector('.library-index ul');
        var results = host.querySelector('.library-results');
        var summary = host.querySelector('.library-summary');
        if (tools) tools.hidden = false;

        var state = { query: '', kind: 'all' };

        var counts = { all: all.length };
        all.forEach(function (f) { counts[f.kind] = (counts[f.kind] || 0) + 1; });
        var kinds = ['all'].concat(Object.keys(KINDS).filter(function (k) { return counts[k]; }));

        kinds.forEach(function (k) {
            var b = el('button', 'filter filter-pill');
            b.type = 'button';
            b.dataset.kind = k;
            b.setAttribute('aria-pressed', String(k === 'all'));
            b.appendChild(document.createTextNode((k === 'all' ? 'All' : KINDS[k].label) + ' (' + counts[k] + ')'));
            filterBar.appendChild(b);
        });

        filterBar.addEventListener('click', function (e) {
            var b = e.target.closest('.filter');
            if (!b) return;
            state.kind = b.dataset.kind;
            Array.prototype.forEach.call(filterBar.children, function (x) {
                x.setAttribute('aria-pressed', String(x === b));
            });
            render();
        });

        groups.forEach(function (g) {
            var li = el('li');
            var a = el('a', 'index-link');
            a.href = '#' + g.id;
            a.textContent = g.title + ' (' + g.folder.count + ')';
            li.appendChild(a);
            index.appendChild(li);
        });

        function render() {
            var terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
            var searching = terms.length > 0;
            results.textContent = '';

            var matches = all.filter(function (f) {
                if (state.kind !== 'all' && f.kind !== state.kind) return false;
                return terms.every(function (t) { return f.haystack.indexOf(t) !== -1; });
            });

            if (summary) {
                summary.textContent = searching || state.kind !== 'all'
                    ? plural(matches.length, 'file') + ' found'
                    : plural(all.length, 'file') + ' across ' + plural(groups.length, 'collection');
            }

            if (!matches.length) {
                var empty = el('div', 'empty');
                empty.appendChild(el('p', null, searching
                    ? 'No files match \u201c' + state.query.trim() + '\u201d.'
                    : 'No files of this type yet.'));
                var reset = el('button', 'btn btn-sm', 'Clear search and filters');
                reset.type = 'button';
                reset.addEventListener('click', function () {
                    input.value = '';
                    state.query = '';
                    filterBar.querySelector('[data-kind="all"]').click();
                    input.focus();
                });
                empty.appendChild(reset);
                results.appendChild(empty);
                return;
            }

            if (searching) {
                var group = el('section', 'file-group');
                group.appendChild(fileList(matches, terms, true));
                results.appendChild(group);
                return;
            }

            groups.forEach(function (g) {
                var section = el('section', 'file-group');
                section.id = g.id;
                var visible = 0;
                var subs = [];

                g.sections.forEach(function (s) {
                    var files = s.files.filter(function (f) { return state.kind === 'all' || f.kind === state.kind; });
                    if (!files.length) return;
                    visible += files.length;
                    var sub = el('div', 'file-sub');
                    if (s.trail.length) sub.appendChild(el('h3', 'file-sub-title', s.trail.join(' / ')));
                    sub.appendChild(fileList(files));
                    subs.push(sub);
                });

                if (!visible) return;
                section.appendChild(el('h2', 'h2', g.title));
                section.appendChild(el('p', 'group-meta', plural(visible, 'file')));
                subs.forEach(function (s) { section.appendChild(s); });
                results.appendChild(section);
            });
        }

        var debounce = 0;
        input.addEventListener('input', function () {
            clearTimeout(debounce);
            debounce = setTimeout(function () {
                state.query = input.value;
                render();
            }, 80);
        });

        var params = new URLSearchParams(location.search);
        if (params.get('q')) {
            input.value = params.get('q');
            state.query = input.value;
        }

        render();

        if (location.hash) {
            var target = document.getElementById(location.hash.slice(1));
            if (target) target.scrollIntoView();
        }
    }

    /* --- Boot ----------------------------------------------------------- */

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
