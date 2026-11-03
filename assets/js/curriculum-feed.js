/**
 * assets/js/curriculum-feed.js
 * Emirates International School (EIS) IB DP Computer Science
 * Dynamic Curriculum Renderer & Controller (Requirement R3)
 *
 * Renders all 8 syllabus units, 25 subtopics, and 112 learning statements
 * dynamically from DataService / syllabus.json while strictly preserving
 * deep-link anchor IDs (#a1 through #b4), segmented tab navigation, and search.
 */

(function () {
    'use strict';

    var syllabusData = [];
    var activeLevel = 'all';
    var activeCohort = 'all';
    var activeTheme = 'all';
    var searchQuery = '';

    // Cache DOM Elements
    var container = document.getElementById('syllabus-container');
    var searchInput = document.getElementById('syllabus-search');
    var visibleStatementCountEl = document.getElementById('visible-statement-count');
    var totalStatementCountEl = document.getElementById('total-statement-count');
    var tabSyllabusBadgeEl = document.querySelector('#tab-syllabus .rv-tab-badge');
    var visibleUnitCountEl = document.getElementById('visible-unit-count');
    var tabButtons = document.querySelectorAll('.rv-tabs-nav .rv-tab-btn, .segmented-control .segmented-btn');
    var sectionTabs = document.querySelectorAll('.curriculum-section-tab');
    var btnTopicToggle = document.getElementById('btn-toggle-units') || document.getElementById('btn-expand-all');
    var btnSubtopicToggle = document.getElementById('btn-toggle-subtopics') || document.getElementById('btn-collapse-all');

    // New 1:1 Filters Drawer Elements
    var drawerToggleBtn = document.getElementById('toggle-filters-drawer');
    var filterDrawer = document.getElementById('filters-drawer');
    var activeFiltersBadge = document.getElementById('active-filters-count');
    var resetFiltersBtn = document.getElementById('reset-drawer-filters');
    var headerLevelButtons = document.querySelectorAll('.rv-level-switch .level-toggle-btn');
    var drawerLevelButtons = document.querySelectorAll('#filter-level-group .status-segment-btn, #filter-level-group .filter-btn');
    var themeCheckboxes = document.querySelectorAll('input[name="filter-theme"]');
    var levelCheckboxes = document.querySelectorAll('input[name="filter-level"]');
    var cohortCheckboxes = document.querySelectorAll('input[name="filter-cohort"]');
    var scopeCheckboxes = document.querySelectorAll('input[name="filter-scope"]');

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 1. Render a single syllabus unit
    function renderUnitHtml(unit) {
        var themeClass = (unit.theme && unit.theme.indexOf('Theme A') !== -1) ? 'theme-a' : 'theme-b';
        var cohortCode = (unit.cohort && unit.cohort.indexOf('DP1') !== -1) ? 'dp1' : 'dp2';
        var levelCode = unit.isHLOnly ? 'hl' : 'sl hl';

        var subtopics = unit.subtopics || [];
        var statementCount = subtopics.reduce(function (sum, st) {
            return sum + (st.statements ? st.statements.length : 0);
        }, 0);

        var subtopicsHtml = subtopics.map(function (st) {
            var stLevelClass = st.isHLOnly ? 'subtopic-hl' : 'subtopic-sl';
            var stTagBadge = st.isHLOnly ? '<span class="pill pill-hl">HL Extension</span>' : '<span class="pill">Core Subtopic</span>';
            var stStatements = st.statements || [];

            var stmtsHtml = stStatements.map(function (stmt) {
                var isHL = stmt.level === 'HL';
                var stmtClass = isHL ? 'stmt-hl' : 'stmt-sl';
                var stmtLevelPill = isHL ? '<span class="pill pill-hl">HL Only</span>' : '<span class="pill pill-sl">SL &amp; HL</span>';
                var cohortTag = cohortCode.toUpperCase();

                return '<li class="statement-item ' + stmtClass + '" data-level="' + stmt.level.toLowerCase() + '" data-cohort="' + cohortCode + '" data-theme="' + themeClass + '" data-code="' + (stmt.code || '').toLowerCase() + '">' +
                    '<div class="statement-col-code"><span class="statement-code">' + escapeHtml(stmt.code) + '</span></div>' +
                    '<div class="statement-col-text"><p class="statement-text">' + escapeHtml(stmt.statement) + '</p></div>' +
                    '<div class="statement-col-meta">' + stmtLevelPill + '<span class="pill pill-cohort">' + cohortTag + '</span></div>' +
                '</li>';
            }).join('');

            return '<details class="subtopic-block ' + stLevelClass + '" data-subtopic="' + escapeHtml(st.code) + '">' +
                '<summary class="subtopic-bar" title="Click to collapse or expand ' + escapeHtml(st.code) + ' statements">' +
                    '<div class="subtopic-title-wrap">' +
                        '<span class="subtopic-code-badge">' + escapeHtml(st.code) + '</span>' +
                        '<h3 class="subtopic-title">' + escapeHtml(st.title || st.name) + '</h3>' +
                    '</div>' +
                    '<div class="subtopic-tags">' +
                        stTagBadge +
                        '<span class="subtopic-count-pill">' + stStatements.length + ' Objectives</span>' +
                        '<span class="subtopic-chev" aria-hidden="true"></span>' +
                    '</div>' +
                '</summary>' +
                '<ul class="statements-list">' + stmtsHtml + '</ul>' +
            '</details>';
        }).join('');

        var hoursText = unit.isHLOnly
            ? 'HL Only: ' + (unit.hoursHL || 0) + 'h'
            : 'SL: ' + (unit.hoursSL || 0) + 'h &bull; HL: ' + (unit.hoursHL || 0) + 'h';

        var cleanTheme = unit.theme ? unit.theme.split(':')[0].trim() : 'Theme A';

        return '<details class="unit" id="' + unit.id + '" data-unit="' + unit.id + '" data-theme="' + themeClass + '" data-cohort="' + cohortCode + '" data-level="' + levelCode + '">' +
            '<summary>' +
                '<span class="unit-code">' + escapeHtml(unit.code) + '</span>' +
                '<div class="unit-info">' +
                    '<span class="unit-name">' + escapeHtml(unit.name) + '</span>' +
                    '<span class="unit-theme">' + escapeHtml(unit.theme) + ' &bull; <strong style="color:var(--accent);">' + escapeHtml(unit.cohort) + '</strong></span>' +
                '</div>' +
                '<div class="unit-meta">' +
                    '<span class="pill pill-accent">' + escapeHtml(unit.paper || 'Paper 1') + '</span>' +
                    '<span class="pill">' + hoursText + '</span>' +
                    '<span class="pill">' + statementCount + ' Statements</span>' +
                    '<span class="chev" aria-hidden="true"></span>' +
                '</div>' +
            '</summary>' +
            '<div class="unit-body">' +
                '<div class="unit-desc-row">' +
                    '<p class="unit-desc">' + escapeHtml(unit.description) + '</p>' +
                '</div>' +
                subtopicsHtml +
            '</div>' +
        '</details>';
    }

    // 2. Render all units into DOM
    function renderSyllabus() {
        if (!container) return;
        if (!syllabusData || syllabusData.length === 0) {
            container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-3); font-family:var(--font-mono);">No syllabus units found.</div>';
            return;
        }

        var html = syllabusData.map(renderUnitHtml).join('');
        container.innerHTML = html;

        var totalStatements = container.querySelectorAll('.statement-item').length;
        if (totalStatementCountEl) totalStatementCountEl.textContent = totalStatements;
        if (tabSyllabusBadgeEl) tabSyllabusBadgeEl.textContent = totalStatements;

        // Apply filters & router immediately
        applyFilters();
        handleCurriculumHash();
        updateButtonsState();
    }

    // 3. Segmented Section Switcher
    function switchSection(targetId) {
        tabButtons.forEach(function (btn) {
            var isMatch = (btn.getAttribute('data-tab') === targetId);
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        if (targetId === 'all') {
            sectionTabs.forEach(function (sec) { sec.classList.remove('tab-hidden'); });
        } else {
            sectionTabs.forEach(function (sec) {
                if (sec.id === targetId) {
                    sec.classList.remove('tab-hidden');
                } else {
                    sec.classList.add('tab-hidden');
                }
            });
        }
    }

    // 4. Hash Deep-Link Router (strictly preserves #a1 through #b4)
    function handleCurriculumHash() {
        var rawHash = (window.location.hash || '').replace(/^#/, '');
        if (!rawHash) {
            switchSection('sec-syllabus');
            return;
        }
        var currentHash = rawHash.toLowerCase();

        // 1. Check for Syllabus Unit Deep-Links (a1..a4, b1..b4)
        var unitRegex = /^[ab][1-4]$/i;
        if (unitRegex.test(currentHash)) {
            switchSection('sec-syllabus');
            var unitEl = document.getElementById(currentHash);
            if (unitEl) {
                unitEl.open = true;
                if (unitEl.classList.contains('is-hidden')) {
                    unitEl.classList.remove('is-hidden');
                }
                setTimeout(function () {
                    unitEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
            }
            return;
        }

        // 2. Check for Theme Shortcuts (#theme-a, #theme-b)
        if (currentHash === 'theme-b') {
            switchSection('sec-syllabus');
            var b1 = document.getElementById('b1');
            if (b1) {
                b1.open = true;
                setTimeout(function () { b1.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
            }
            return;
        }
        if (currentHash === 'theme-a') {
            switchSection('sec-syllabus');
            var a1 = document.getElementById('a1');
            if (a1) {
                a1.open = true;
                setTimeout(function () { a1.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
            }
            return;
        }

        // 3. Check for Section Tabs (sec-syllabus, sec-assessment, sec-roadmap, sec-docs, all)
        var matchingTab = document.querySelector('.rv-tabs-nav .rv-tab-btn[data-tab="' + currentHash + '"], .segmented-control .segmented-btn[data-tab="' + currentHash + '"]');
        var matchingSection = document.querySelector('.curriculum-section-tab#' + currentHash);
        if (matchingTab || matchingSection || currentHash === 'all') {
            switchSection(currentHash);
            return;
        }

        // 4. Fallback for any other valid element ID on the page
        var targetEl = document.getElementById(rawHash);
        if (targetEl) {
            var parentSec = targetEl.closest('.curriculum-section-tab');
            if (parentSec) switchSection(parentSec.id);
            if (typeof targetEl.open !== 'undefined') targetEl.open = true;
            setTimeout(function () { targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
        } else {
            switchSection('sec-syllabus');
        }
    }

    // 5. Interactive Syllabus Filtering, Cohort Toggling, and Live Search
    function applyFilters() {
        var units = document.querySelectorAll('.syllabus-units-container .unit');
        var q = searchQuery.trim().toLowerCase();
        var visibleStatements = 0;
        var visibleUnits = 0;

        units.forEach(function (unit) {
            var unitCohort = unit.getAttribute('data-cohort');
            var unitTheme = unit.getAttribute('data-theme');
            var unitMatchesTheme = (activeTheme === 'all' || unitTheme === activeTheme);
            var unitMatchesCohort = (activeCohort === 'all' || unitCohort === activeCohort);
            var unitVisibleStatements = 0;

            var unitSubtopics = unit.querySelectorAll('.subtopic-block');
            unitSubtopics.forEach(function (subBlock) {
                var subItems = subBlock.querySelectorAll('.statement-item');
                var subVisibleCount = 0;

                subItems.forEach(function (item) {
                    var itemLvl = item.getAttribute('data-level');
                    var itemCohort = item.getAttribute('data-cohort');
                    var itemTheme = item.getAttribute('data-theme');
                    var itemCode = (item.getAttribute('data-code') || '').toLowerCase();
                    var textEl = item.querySelector('.statement-text');
                    var itemText = textEl ? textEl.textContent.toLowerCase() : '';

                    var matchesLevel = true;
                    if (activeLevel === 'sl') {
                        matchesLevel = (itemLvl === 'sl');
                    } else if (activeLevel === 'hl') {
                        matchesLevel = (itemLvl === 'hl');
                    }

                    var matchesCohort = (activeCohort === 'all' || itemCohort === activeCohort);
                    var matchesTheme = (activeTheme === 'all' || itemTheme === activeTheme);

                    var matchesSearch = true;
                    if (q.length > 0) {
                        matchesSearch = itemCode.indexOf(q) !== -1 || itemText.indexOf(q) !== -1;
                    }

                    if (matchesLevel && matchesCohort && matchesTheme && matchesSearch) {
                        item.classList.remove('is-hidden');
                        subVisibleCount++;
                        unitVisibleStatements++;
                        visibleStatements++;
                    } else {
                        item.classList.add('is-hidden');
                    }
                });

                if (subVisibleCount > 0) {
                    subBlock.classList.remove('is-hidden');
                    if (q.length > 0) {
                        subBlock.setAttribute('open', '');
                    }
                } else {
                    subBlock.classList.add('is-hidden');
                }
            });

            if (unitVisibleStatements > 0 && unitMatchesTheme && unitMatchesCohort) {
                unit.classList.remove('is-hidden');
                if (q.length > 0) {
                    unit.setAttribute('open', '');
                }
                visibleUnits++;
            } else {
                unit.classList.add('is-hidden');
            }
        });

        if (visibleStatementCountEl) visibleStatementCountEl.textContent = visibleStatements;
        if (visibleUnitCountEl) visibleUnitCountEl.textContent = visibleUnits;
        updateButtonsState();
    }

    // 6. Topics & Subtopics Expand / Collapse Buttons
    function getVisibleUnits() {
        var units = document.querySelectorAll('.syllabus-units-container .unit');
        return Array.from(units).filter(function (u) {
            return !u.classList.contains('is-hidden');
        });
    }

    function getVisibleSubtopics() {
        var subtopics = document.querySelectorAll('.subtopic-block');
        return Array.from(subtopics).filter(function (st) {
            return !st.classList.contains('is-hidden');
        });
    }

    function updateButtonsState() {
        var curUnits = getVisibleUnits();
        if (curUnits.length > 0 && btnTopicToggle) {
            var openUnits = curUnits.filter(function (u) { return u.hasAttribute('open'); }).length;
            var currentTopicAction = btnTopicToggle.getAttribute('data-action');

            if (openUnits === curUnits.length) {
                btnTopicToggle.textContent = 'Collapse All Topics';
                btnTopicToggle.setAttribute('data-action', 'collapse');
                btnTopicToggle.setAttribute('aria-label', 'Collapse all topics');
            } else if (openUnits === 0) {
                btnTopicToggle.textContent = 'Expand All Topics';
                btnTopicToggle.setAttribute('data-action', 'expand');
                btnTopicToggle.setAttribute('aria-label', 'Expand all topics');
            } else if (!currentTopicAction) {
                var shouldCollapse = openUnits >= Math.ceil(curUnits.length / 2);
                btnTopicToggle.textContent = openUnits > 0 ? (shouldCollapse ? 'Collapse All Topics' : 'Expand All Topics') : 'Expand All Topics';
                btnTopicToggle.setAttribute('data-action', shouldCollapse ? 'collapse' : 'expand');
                btnTopicToggle.setAttribute('aria-label', shouldCollapse ? 'Collapse all topics' : 'Expand all topics');
            }
        }

        var curSubtopics = getVisibleSubtopics();
        if (curSubtopics.length > 0 && btnSubtopicToggle) {
            var openSubtopics = curSubtopics.filter(function (st) { return st.hasAttribute('open'); }).length;
            var currentSubtopicAction = btnSubtopicToggle.getAttribute('data-action');

            if (openSubtopics === curSubtopics.length) {
                btnSubtopicToggle.textContent = 'Collapse All Subtopics';
                btnSubtopicToggle.setAttribute('data-action', 'collapse');
                btnSubtopicToggle.setAttribute('aria-label', 'Collapse all subtopics');
            } else if (openSubtopics === 0) {
                btnSubtopicToggle.textContent = 'Expand All Subtopics';
                btnSubtopicToggle.setAttribute('data-action', 'expand');
                btnSubtopicToggle.setAttribute('aria-label', 'Expand all subtopics');
            } else if (!currentSubtopicAction) {
                var shouldCollapseSub = openSubtopics >= Math.ceil(curSubtopics.length / 2);
                btnSubtopicToggle.textContent = openSubtopics > 0 ? (shouldCollapseSub ? 'Collapse All Subtopics' : 'Expand All Subtopics') : 'Expand All Subtopics';
                btnSubtopicToggle.setAttribute('data-action', shouldCollapseSub ? 'collapse' : 'expand');
                btnSubtopicToggle.setAttribute('aria-label', shouldCollapseSub ? 'Collapse all subtopics' : 'Expand all subtopics');
            }
        }
    }

    // 7. Update Filter Badge and Sync All Filter Controls
    function updateActiveFilterBadge() {
        if (!activeFiltersBadge) return;
        var count = 0;
        if (activeLevel !== 'all') count++;
        if (activeCohort !== 'all') count++;
        if (activeTheme !== 'all') count++;

        var checkedBoxes = document.querySelectorAll('#filters-drawer input[type="checkbox"]:checked');
        if (checkedBoxes.length > 0) {
            // Count unique active checkbox categories
            var hasThemeCb = Array.from(themeCheckboxes).some(function (c) { return c.checked; });
            var hasLevelCb = Array.from(levelCheckboxes).some(function (c) { return c.checked; });
            var hasCohortCb = Array.from(cohortCheckboxes).some(function (c) { return c.checked; });
            var hasScopeCb = Array.from(scopeCheckboxes).some(function (c) { return c.checked; });
            count = (hasThemeCb ? 1 : 0) + (hasLevelCb ? 1 : 0) + (hasCohortCb ? 1 : 0) + (hasScopeCb ? 1 : 0);
        }

        if (searchQuery && searchQuery.trim().length > 0) count++;

        if (count > 0) {
            activeFiltersBadge.textContent = count;
            activeFiltersBadge.style.display = 'inline-block';
        } else {
            activeFiltersBadge.style.display = 'none';
        }
    }

    function setFilterLevel(level) {
        activeLevel = level;

        // Sync header level buttons
        headerLevelButtons.forEach(function (btn) {
            var match = (btn.getAttribute('data-level') === level);
            btn.classList.toggle('active', match);
        });

        // Sync drawer level segment buttons
        drawerLevelButtons.forEach(function (btn) {
            var btnLevel = btn.getAttribute('data-filter-level') || btn.getAttribute('data-level');
            var match = (btnLevel === level);
            btn.classList.toggle('active', match);
            btn.setAttribute('aria-pressed', match ? 'true' : 'false');
        });

        // Sync level checkboxes
        levelCheckboxes.forEach(function (cb) {
            if (level === 'all') {
                cb.checked = false;
            } else if (level === 'sl') {
                cb.checked = (cb.value === 'sl');
            } else if (level === 'hl') {
                cb.checked = (cb.value === 'hl');
            }
        });

        updateActiveFilterBadge();
        applyFilters();
    }

    function syncFromCheckboxes() {
        // Theme / Papers
        var checkedThemes = Array.from(themeCheckboxes).filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
        var checkedScopes = Array.from(scopeCheckboxes).filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
        var allSelectedThemes = checkedThemes.concat(checkedScopes);

        var hasA = allSelectedThemes.indexOf('theme-a') !== -1;
        var hasB = allSelectedThemes.indexOf('theme-b') !== -1;

        if (hasA && !hasB) {
            activeTheme = 'theme-a';
        } else if (hasB && !hasA) {
            activeTheme = 'theme-b';
        } else {
            activeTheme = 'all';
        }

        // Difficulty / Level
        var checkedLevels = Array.from(levelCheckboxes).filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
        var hasSL = checkedLevels.indexOf('sl') !== -1;
        var hasHL = checkedLevels.indexOf('hl') !== -1;

        if (hasSL && !hasHL) {
            activeLevel = 'sl';
        } else if (hasHL && !hasSL) {
            activeLevel = 'hl';
        } else {
            activeLevel = 'all';
        }

        // Sync buttons with current level
        headerLevelButtons.forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-level') === activeLevel);
        });
        drawerLevelButtons.forEach(function (btn) {
            var btnLvl = btn.getAttribute('data-filter-level') || btn.getAttribute('data-level');
            btn.classList.toggle('active', btnLvl === activeLevel);
            btn.setAttribute('aria-pressed', btnLvl === activeLevel ? 'true' : 'false');
        });

        // Cohort & Year
        var checkedCohorts = Array.from(cohortCheckboxes).filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
        var hasDP1 = checkedCohorts.indexOf('dp1') !== -1;
        var hasDP2 = checkedCohorts.indexOf('dp2') !== -1;

        if (hasDP1 && !hasDP2) {
            activeCohort = 'dp1';
        } else if (hasDP2 && !hasDP1) {
            activeCohort = 'dp2';
        } else {
            activeCohort = 'all';
        }

        updateActiveFilterBadge();
        applyFilters();
    }

    // 8. Bind All Event Listeners
    function setupEvents() {
        tabButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var targetId = btn.getAttribute('data-tab');
                switchSection(targetId);
                if (targetId !== 'all') {
                    history.replaceState(null, '', '#' + targetId);
                } else {
                    history.replaceState(null, '', window.location.pathname);
                }
            });
        });

        window.addEventListener('hashchange', handleCurriculumHash);

        // Header Level Switcher
        headerLevelButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var lvl = btn.getAttribute('data-level');
                setFilterLevel(lvl);
            });
        });

        // Drawer Segmented Level Switcher
        drawerLevelButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var lvl = btn.getAttribute('data-filter-level') || btn.getAttribute('data-level');
                setFilterLevel(lvl);
            });
        });

        // Drawer Toggle Bar
        if (drawerToggleBtn && filterDrawer) {
            drawerToggleBtn.addEventListener('click', function () {
                var isOpen = filterDrawer.classList.toggle('open');
                drawerToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        }

        // Checkbox listeners in Drawer
        var allCheckboxes = [themeCheckboxes, levelCheckboxes, cohortCheckboxes, scopeCheckboxes];
        allCheckboxes.forEach(function (nodeList) {
            nodeList.forEach(function (cb) {
                cb.addEventListener('change', syncFromCheckboxes);
            });
        });

        // Reset Filters Button
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function () {
                themeCheckboxes.forEach(function (cb) { cb.checked = false; });
                levelCheckboxes.forEach(function (cb) { cb.checked = false; });
                cohortCheckboxes.forEach(function (cb) { cb.checked = false; });
                scopeCheckboxes.forEach(function (cb) { cb.checked = false; });
                if (searchInput) searchInput.value = '';
                searchQuery = '';
                activeTheme = 'all';
                activeCohort = 'all';
                setFilterLevel('all');
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = searchInput.value;
                updateActiveFilterBadge();
                applyFilters();
            });
        }

        if (btnTopicToggle) {
            btnTopicToggle.addEventListener('click', function () {
                var curUnits = getVisibleUnits();
                var action = btnTopicToggle.getAttribute('data-action');
                if (!action) {
                    var anyOpen = curUnits.some(function (u) { return u.hasAttribute('open'); });
                    action = anyOpen ? 'collapse' : 'expand';
                }

                if (action === 'collapse') {
                    curUnits.forEach(function (u) { u.removeAttribute('open'); });
                    btnTopicToggle.textContent = 'Expand All Topics';
                    btnTopicToggle.setAttribute('data-action', 'expand');
                    btnTopicToggle.setAttribute('aria-label', 'Expand all topics');
                } else {
                    curUnits.forEach(function (u) { u.setAttribute('open', ''); });
                    btnTopicToggle.textContent = 'Collapse All Topics';
                    btnTopicToggle.setAttribute('data-action', 'collapse');
                    btnTopicToggle.setAttribute('aria-label', 'Collapse all topics');
                }
            });
        }

        if (btnSubtopicToggle) {
            btnSubtopicToggle.addEventListener('click', function () {
                var curSubtopics = getVisibleSubtopics();
                var action = btnSubtopicToggle.getAttribute('data-action');
                if (!action) {
                    var anyOpen = curSubtopics.some(function (st) { return st.hasAttribute('open'); });
                    action = anyOpen ? 'collapse' : 'expand';
                }

                if (action === 'collapse') {
                    curSubtopics.forEach(function (st) { st.removeAttribute('open'); });
                    btnSubtopicToggle.textContent = 'Expand All Subtopics';
                    btnSubtopicToggle.setAttribute('data-action', 'expand');
                    btnSubtopicToggle.setAttribute('aria-label', 'Collapse all subtopics');
                } else {
                    curSubtopics.forEach(function (st) { st.setAttribute('open', ''); });
                    var curUnits = getVisibleUnits();
                    curUnits.forEach(function (u) { u.setAttribute('open', ''); });
                    if (btnTopicToggle) {
                        btnTopicToggle.textContent = 'Collapse All Topics';
                        btnTopicToggle.setAttribute('data-action', 'collapse');
                        btnTopicToggle.setAttribute('aria-label', 'Collapse all topics');
                    }
                    btnSubtopicToggle.textContent = 'Collapse All Subtopics';
                    btnSubtopicToggle.setAttribute('data-action', 'collapse');
                    btnSubtopicToggle.setAttribute('aria-label', 'Collapse all subtopics');
                }
            });
        }

        if (container) {
            container.addEventListener('toggle', updateButtonsState, true);
        }
    }

    // 8. Initialization
    
    // Dynamic Roadmap Renderer
    function renderRoadmap(roadmapData) {
        var grid = document.getElementById('curriculum-timeline-grid');
        if (!grid || !roadmapData) return;
        var dp1 = roadmapData.dp1;
        var dp2 = roadmapData.dp2;
        if (!dp1 || !dp2) return;

        function renderCol(colData, defaultPill, defaultBadge) {
            var termsHtml = (colData.terms || []).map(function (t) {
                var pillsHtml = (t.topics || []).map(function (top) {
                    var isHl = top.indexOf('(HL)') !== -1;
                    var isGreen = top.indexOf('IA') !== -1 || top.indexOf('Exams') !== -1 || top.indexOf('Papers') !== -1;
                    var pillClass = isHl ? 'timeline-pill pill-amber' : (isGreen ? 'timeline-pill pill-emerald' : 'timeline-pill');
                    return '<span class="' + pillClass + '">' + escapeHtml(top) + '</span>';
                }).join('');

                var badgeClass = t.milestoneType ? ('timeline-milestone-badge ' + t.milestoneType) : 'timeline-milestone-badge';
                var milestoneHtml = t.milestone ? ('<div class="' + badgeClass + '">' + escapeHtml(t.milestone) + '</div>') : '';

                return '<div class="timeline-card">' +
                    '<div class="timeline-node"><div class="timeline-node-inner"></div></div>' +
                    '<div class="timeline-card-head">' +
                        '<span class="timeline-term-tag">' + escapeHtml(t.term || 'Term') + '</span>' +
                        '<span class="timeline-date-tag">' + escapeHtml(t.date || '') + '</span>' +
                    '</div>' +
                    '<h4 class="timeline-card-title">' + escapeHtml(t.title || '') + '</h4>' +
                    '<div class="timeline-topic-pills">' + pillsHtml + '</div>' +
                    '<p class="timeline-card-desc">' + escapeHtml(t.description || '') + '</p>' +
                    milestoneHtml +
                '</div>';
            }).join('');

            return '<div class="timeline-cohort-col">' +
                '<div class="timeline-cohort-header">' +
                    '<div>' +
                        '<span class="cohort-badge-main">' + escapeHtml(colData.cohortBadge || defaultBadge) + '</span>' +
                        '<h3 class="cohort-title-main">' + escapeHtml(colData.cohortTitle || '') + '</h3>' +
                    '</div>' +
                    '<span class="pill ' + (defaultPill === 'Year 12' ? 'pill-sl' : 'pill-hl') + '">' + escapeHtml(colData.yearPill || defaultPill) + '</span>' +
                '</div>' +
                '<div class="timeline-track">' + termsHtml + '</div>' +
            '</div>';
        }

        grid.innerHTML = renderCol(dp1, 'Year 12', 'DP1 • Class of 2027') + renderCol(dp2, 'Year 13', 'DP2 • Class of 2026/2027');
    }

    function initCurriculumFeed() {
        if (typeof window !== 'undefined' && window.DataService && typeof window.DataService.getRoadmap === 'function') {
            var rm = window.DataService.getRoadmap();
            if (rm) renderRoadmap(rm);
            window.DataService.subscribe('roadmap', function (updated) {
                if (updated) renderRoadmap(updated);
            });
        } else {
            fetch('../data/roadmap.json').then(function (r) { return r.json(); }).then(function (rm) {
                if (rm) renderRoadmap(rm);
            }).catch(function () {});
        }

        setupEvents();

        if (typeof window !== 'undefined' && window.DataService && typeof window.DataService.getSyllabus === 'function') {
            syllabusData = window.DataService.getSyllabus();
            renderSyllabus();

            window.DataService.subscribe('syllabus', function (updated) {
                syllabusData = updated;
                renderSyllabus();
            });
        } else {
            fetch('../data/syllabus.json')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    syllabusData = data || [];
                    renderSyllabus();
                })
                .catch(function () {
                    if (container) {
                        container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-3); font-family:var(--font-mono);">Syllabus offline cache ready.</div>';
                    }
                });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCurriculumFeed);
    } else {
        initCurriculumFeed();
    }
})();
