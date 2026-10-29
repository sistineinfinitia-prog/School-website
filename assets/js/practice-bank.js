/**
 * practice-bank.js
 * Question Bank Controller for IB Computer Science Practice Suite
 * Handles tri-state topic filtering, subtopics, query param aliasing,
 * 10-question pagination, browse/practice modes, and SVG interactive card actions.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['PracticeState'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./practice-state'));
    } else {
        root.PracticeBank = factory(root.PracticeState || window.PracticeState);
    }
}(typeof self !== 'undefined' ? self : this, function (State) {
    'use strict';

    var PAGE_SIZE = 10;

    // Clean SVGs for card actions and pills
    var ICONS = {
        check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        ban: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>',
        plus: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        lightbulb: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.3 4.7 3.3 6 .6.4 1 1.1 1.1 1.8h5.2c.1-.7.5-1.4 1.1-1.8 2-1.3 3.3-3.5 3.3-6a7 7 0 0 0-7-7Z"></path></svg>',
        scratchpad: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>',
        bookmark: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>',
        cross: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        correct: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        arrowRight: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
    };

    // Official Syllabus Structure strictly matching curriculum.html
    var SYLLABUS_UNITS = [
        {
            code: 'A1',
            name: 'Computer Fundamentals',
            theme: 'A',
            subtopics: [
                { code: 'A1.1', name: 'Computer hardware and operation' },
                { code: 'A1.2', name: 'Data representation and computer logic' },
                { code: 'A1.3', name: 'Operating systems and control systems' },
                { code: 'A1.4', name: 'Translation (HL only)' }
            ]
        },
        {
            code: 'A2',
            name: 'Networks',
            theme: 'A',
            subtopics: [
                { code: 'A2.1', name: 'Network fundamentals' },
                { code: 'A2.2', name: 'Network architecture' },
                { code: 'A2.3', name: 'Data transmissions' },
                { code: 'A2.4', name: 'Network security' }
            ]
        },
        {
            code: 'A3',
            name: 'Databases',
            theme: 'A',
            subtopics: [
                { code: 'A3.1', name: 'Database fundamentals' },
                { code: 'A3.2', name: 'Database design' },
                { code: 'A3.3', name: 'Database programming' },
                { code: 'A3.4', name: 'Alternative databases and data warehouses (HL only)' }
            ]
        },
        {
            code: 'A4',
            name: 'Machine Learning',
            theme: 'A',
            subtopics: [
                { code: 'A4.1', name: 'Machine learning fundamentals' },
                { code: 'A4.2', name: 'Data preprocessing (HL only)' },
                { code: 'A4.3', name: 'Machine learning approaches (HL only)' },
                { code: 'A4.4', name: 'Ethical considerations' }
            ]
        },
        {
            code: 'B1',
            name: 'Computational Thinking',
            theme: 'B',
            subtopics: [
                { code: 'B1.1', name: 'Approaches to computational thinking' }
            ]
        },
        {
            code: 'B2',
            name: 'Programming',
            theme: 'B',
            subtopics: [
                { code: 'B2.1', name: 'Programming fundamentals' },
                { code: 'B2.2', name: 'Data structures' },
                { code: 'B2.3', name: 'Programming constructs' },
                { code: 'B2.4', name: 'Programming algorithms' },
                { code: 'B2.5', name: 'File processing' }
            ]
        },
        {
            code: 'B3',
            name: 'Object-Oriented Programming',
            theme: 'B',
            subtopics: [
                { code: 'B3.1', name: 'Fundamentals of OOP for a single class' },
                { code: 'B3.2', name: 'Fundamentals of OOP for multiple classes (HL only)' }
            ]
        },
        {
            code: 'B4',
            name: 'Abstract Data Types',
            theme: 'B',
            subtopics: [
                { code: 'B4.1', name: 'Fundamentals of ADTs' }
            ]
        },
        {
            code: 'CS',
            name: 'HL Case Study',
            theme: 'CaseStudy',
            subtopics: [
                { code: 'CS.1', name: 'Scenario Analysis & System Specifications' },
                { code: 'CS.2', name: 'Technical Evaluation & Recommendations' }
            ]
        }
    ];

    // Aliases from index.html and theme pages
    var TOPIC_ALIASES = {
        'architecture': 'A1',
        'systems': 'A1',
        'hardware': 'A1',
        'networks': 'A2',
        'databases': 'A3',
        'sql': 'A3',
        'machine-learning': 'A4',
        'ai': 'A4',
        'computational-thinking': 'B1',
        'algorithms': 'B2',
        'programming': 'B2',
        'python': 'B2',
        'oop': 'B3',
        'adts': 'B4',
        'adt': 'B4',
        'case-study': 'CS',
        'casestudy': 'CS'
    };

    var Bank = {
        allQuestions: [],
        filteredQuestions: [],
        renderedCount: 0,
        currentMode: 'practice', // 'browse' or 'practice'
        
        // Filter states
        selectedLevel: 'all', // 'all', 'sl', 'hl'
        unitStates: {}, // unitCode -> 'included' | 'excluded' | 'none'
        selectedSubtopics: {}, // subtopicCode -> boolean
        topicMatchMode: 'any', // 'any' or 'within'
        
        // Drawer filter states
        filterPapers: [], // [1, 2, 3]
        filterDifficulties: [], // ['Easy', 'Medium', 'Hard']
        filterStatus: 'all', // 'all', 'correct', 'wrong', 'not_done'
        filterFormats: [], // ['Section A', 'Section B', 'Coding/Query']
        filterSkills: [], // ['Recall/Concept', 'Tracing/Dry Run', 'Code Implementation', 'Evaluation/Discussion']
        searchQuery: '',
        isInitialized: false,

        init: function (rawQuestions) {
            this.allQuestions = rawQuestions || [];
            this.parseUrlParams();
            this.renderTopicPills();
            if (!this.isInitialized) {
                this.bindEvents();
                this.isInitialized = true;
            }
            this.applyFilters();
        },

        parseUrlParams: function () {
            if (typeof window === 'undefined') return;
            var params = new URLSearchParams(window.location.search);
            
            // Level
            var lvl = params.get('level');
            if (lvl && (lvl.toLowerCase() === 'sl' || lvl.toLowerCase() === 'hl')) {
                this.selectedLevel = lvl.toLowerCase();
            }

            // Topic / Unit
            var t = params.get('topic');
            if (t) {
                var cleanT = t.toLowerCase();
                var targetUnit = TOPIC_ALIASES[cleanT] || cleanT.toUpperCase();
                var exists = SYLLABUS_UNITS.some(function (u) { return u.code === targetUnit; });
                if (exists) {
                    this.unitStates[targetUnit] = 'included';
                }
            }

            // Subtopic
            var sub = params.get('subtopic');
            if (sub) {
                var cleanSub = sub.toUpperCase();
                this.selectedSubtopics[cleanSub] = true;
                var parentCode = cleanSub.split('.')[0];
                if (parentCode) this.unitStates[parentCode] = 'included';
            }

            // Mode
            var m = params.get('mode');
            if (m === 'browse' || m === 'practice') {
                this.currentMode = m;
            }
        },

        renderTopicPills: function () {
            var container = document.getElementById('topics-pill-container');
            if (!container) return;
            var self = this;
            container.innerHTML = '';

            SYLLABUS_UNITS.forEach(function (unit) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'topic-pill';
                btn.setAttribute('data-unit', unit.code);
                
                var st = self.unitStates[unit.code] || 'none';
                if (st === 'included') {
                    btn.classList.add('is-included');
                } else if (st === 'excluded') {
                    btn.classList.add('is-excluded');
                }

                var iconHtml = st === 'included' ? ICONS.check : (st === 'excluded' ? ICONS.ban : ICONS.plus);

                btn.innerHTML = '<span class="pill-code">' + unit.code + '</span>' +
                                '<span class="pill-name">' + unit.name + '</span>' +
                                '<span class="pill-badge" aria-hidden="true">' + iconHtml + '</span>';

                btn.addEventListener('click', function () {
                    self.cycleUnitState(unit.code);
                });

                container.appendChild(btn);
            });

            this.renderSubtopicsPills();
            this.updateTopicSelectionHeader();
        },

        cycleUnitState: function (unitCode) {
            var curr = this.unitStates[unitCode] || 'none';
            if (curr === 'none') {
                this.unitStates[unitCode] = 'included';
            } else if (curr === 'included') {
                this.unitStates[unitCode] = 'excluded';
            } else {
                delete this.unitStates[unitCode];
                var self = this;
                Object.keys(this.selectedSubtopics).forEach(function (sub) {
                    if (sub.indexOf(unitCode) === 0) {
                        delete self.selectedSubtopics[sub];
                    }
                });
            }
            this.renderTopicPills();
            this.applyFilters();
        },

        resetTopics: function () {
            this.unitStates = {};
            this.selectedSubtopics = {};
            this.renderTopicPills();
            this.applyFilters();
        },

        renderSubtopicsPills: function () {
            var container = document.getElementById('subtopics-pill-container');
            var wrap = document.getElementById('subtopics-wrapper');
            if (!container || !wrap) return;

            var self = this;
            var activeUnits = Object.keys(this.unitStates).filter(function (k) {
                return self.unitStates[k] === 'included';
            });

            if (activeUnits.length === 0) {
                wrap.style.display = 'none';
                container.innerHTML = '';
                return;
            }

            wrap.style.display = 'block';
            container.innerHTML = '';

            activeUnits.forEach(function (uCode) {
                var unitObj = SYLLABUS_UNITS.filter(function (u) { return u.code === uCode; })[0];
                if (!unitObj || !unitObj.subtopics) return;

                unitObj.subtopics.forEach(function (sub) {
                    var isSelected = !!self.selectedSubtopics[sub.code];
                    var subBtn = document.createElement('button');
                    subBtn.type = 'button';
                    subBtn.className = 'subtopic-pill' + (isSelected ? ' active' : '');
                    subBtn.innerHTML = '<span class="sub-code">' + sub.code + '</span> ' + sub.name;
                    subBtn.addEventListener('click', function () {
                        if (self.selectedSubtopics[sub.code]) {
                            delete self.selectedSubtopics[sub.code];
                        } else {
                            self.selectedSubtopics[sub.code] = true;
                        }
                        self.renderSubtopicsPills();
                        self.applyFilters();
                    });
                    container.appendChild(subBtn);
                });
            });
        },

        updateTopicSelectionHeader: function () {
            var headerSpan = document.getElementById('topics-count-badge');
            if (!headerSpan) return;
            var self = this;
            var included = Object.keys(this.unitStates).filter(function (k) { return self.unitStates[k] === 'included'; }).length;
            var excluded = Object.keys(this.unitStates).filter(function (k) { return self.unitStates[k] === 'excluded'; }).length;
            
            var text = '';
            if (included > 0 || excluded > 0) {
                text = '(' + included + ' included' + (excluded > 0 ? ', ' + excluded + ' excluded' : '') + ')';
            }
            headerSpan.textContent = text;
        },

        bindEvents: function () {
            var self = this;

            // Target ONLY header Level Switch (All, HL, SL)
            var levelBtns = document.querySelectorAll('.rv-header-actions .level-toggle-btn');
            levelBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    levelBtns.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    self.selectedLevel = btn.getAttribute('data-level') || 'all';
                    self.applyFilters();
                });
            });

            // Browse vs Practice mode
            var modeBtns = document.querySelectorAll('.mode-toggle-btn');
            modeBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    modeBtns.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    self.currentMode = btn.getAttribute('data-mode') || 'practice';
                    self.renderBatch(true);
                });
            });

            // Match Mode Toggle (Any vs Within)
            var matchBtns = document.querySelectorAll('.match-mode-btn');
            matchBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    matchBtns.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    self.topicMatchMode = btn.getAttribute('data-mode') || 'any';
                    self.applyFilters();
                });
            });

            // Topic Reset
            var resetTopicsBtn = document.getElementById('reset-topics-btn');
            if (resetTopicsBtn) {
                resetTopicsBtn.addEventListener('click', function () {
                    self.resetTopics();
                });
            }

            // Filters Drawer Toggle
            var drawerToggleBtn = document.getElementById('toggle-filters-drawer');
            var filterDrawer = document.getElementById('filters-drawer');
            if (drawerToggleBtn && filterDrawer) {
                drawerToggleBtn.addEventListener('click', function () {
                    var isOpen = filterDrawer.classList.toggle('open');
                    drawerToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                });
            }

            // Checkboxes in Drawer: Papers
            var paperCheckboxes = document.querySelectorAll('input[name="filter-paper"]');
            paperCheckboxes.forEach(function (cb) {
                cb.addEventListener('change', function () {
                    self.filterPapers = Array.prototype.slice.call(paperCheckboxes)
                        .filter(function (c) { return c.checked; })
                        .map(function (c) { return parseInt(c.value, 10); });
                    self.applyFilters();
                });
            });

            // Checkboxes in Drawer: Difficulties
            var diffCheckboxes = document.querySelectorAll('input[name="filter-difficulty"]');
            diffCheckboxes.forEach(function (cb) {
                cb.addEventListener('change', function () {
                    self.filterDifficulties = Array.prototype.slice.call(diffCheckboxes)
                        .filter(function (c) { return c.checked; })
                        .map(function (c) { return c.value; });
                    self.applyFilters();
                });
            });

            // Checkboxes in Drawer: Format
            var formatCheckboxes = document.querySelectorAll('input[name="filter-format"]');
            formatCheckboxes.forEach(function (cb) {
                cb.addEventListener('change', function () {
                    self.filterFormats = Array.prototype.slice.call(formatCheckboxes)
                        .filter(function (c) { return c.checked; })
                        .map(function (c) { return c.value; });
                    self.applyFilters();
                });
            });

            // Checkboxes in Drawer: Skill
            var skillCheckboxes = document.querySelectorAll('input[name="filter-skill"]');
            skillCheckboxes.forEach(function (cb) {
                cb.addEventListener('change', function () {
                    self.filterSkills = Array.prototype.slice.call(skillCheckboxes)
                        .filter(function (c) { return c.checked; })
                        .map(function (c) { return c.value; });
                    self.applyFilters();
                });
            });

            // Status Segment: All | Right | Wrong | Not done
            var statusBtns = document.querySelectorAll('#filters-drawer .status-segment-btn');
            statusBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    statusBtns.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    self.filterStatus = btn.getAttribute('data-status') || 'all';
                    self.applyFilters();
                });
            });

            // Reset Drawer Filters
            var resetDrawerBtn = document.getElementById('reset-drawer-filters');
            if (resetDrawerBtn) {
                resetDrawerBtn.addEventListener('click', function () {
                    paperCheckboxes.forEach(function (c) { c.checked = false; });
                    diffCheckboxes.forEach(function (c) { c.checked = false; });
                    formatCheckboxes.forEach(function (c) { c.checked = false; });
                    skillCheckboxes.forEach(function (c) { c.checked = false; });
                    statusBtns.forEach(function (b) { b.classList.remove('active'); });
                    var defaultStatus = document.querySelector('.status-segment-btn[data-status="all"]');
                    if (defaultStatus) defaultStatus.classList.add('active');

                    self.filterPapers = [];
                    self.filterDifficulties = [];
                    self.filterFormats = [];
                    self.filterSkills = [];
                    self.filterStatus = 'all';
                    self.applyFilters();
                });
            }

            // Search Input with debounce
            var searchInput = document.getElementById('question-search');
            var searchTimer = 0;
            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    clearTimeout(searchTimer);
                    searchTimer = setTimeout(function () {
                        self.searchQuery = searchInput.value.toLowerCase().trim();
                        self.applyFilters();
                    }, 150);
                });
            }

            // Load More Button
            var loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', function () {
                    self.renderBatch(false);
                });
            }

            // Reactive State Changes
            window.addEventListener('practice:statechange', function () {
                self.updateHeaderProgress();
                self.syncCardStates();
            });
        },

        applyFilters: function () {
            var self = this;
            var includedUnits = Object.keys(this.unitStates).filter(function (k) { return self.unitStates[k] === 'included'; });
            var excludedUnits = Object.keys(this.unitStates).filter(function (k) { return self.unitStates[k] === 'excluded'; });
            var activeSubtopics = Object.keys(this.selectedSubtopics);

            var teacherQs = (State && State.getTeacherQuestions) ? State.getTeacherQuestions() : [];
            var fullPool = teacherQs.concat(this.allQuestions);

            this.filteredQuestions = fullPool.filter(function (q) {
                // 1. Level Filter
                if (self.selectedLevel === 'sl') {
                    if (q.level === 'HL') return false;
                } else if (self.selectedLevel === 'hl') {
                    if (q.level === 'SL') return false;
                }

                // 2. Excluded Units Check
                if (excludedUnits.indexOf(q.unit) !== -1) {
                    return false;
                }

                // 3. Included Units / Subtopics Check
                if (includedUnits.length > 0) {
                    if (self.topicMatchMode === 'within') {
                        if (includedUnits.indexOf(q.unit) === -1) return false;
                    } else {
                        if (includedUnits.indexOf(q.unit) === -1) return false;
                    }
                }

                if (activeSubtopics.length > 0) {
                    if (activeSubtopics.indexOf(q.subtopicCode) === -1) return false;
                }

                // 4. Paper
                if (self.filterPapers.length > 0) {
                    if (self.filterPapers.indexOf(q.paper) === -1) return false;
                }

                // 5. Difficulty
                if (self.filterDifficulties.length > 0) {
                    if (self.filterDifficulties.indexOf(q.difficulty) === -1) return false;
                }

                // 6. Format
                if (self.filterFormats.length > 0) {
                    if (self.filterFormats.indexOf(q.format) === -1) return false;
                }

                // 7. Skill
                if (self.filterSkills.length > 0) {
                    if (self.filterSkills.indexOf(q.skill) === -1) return false;
                }

                // 8. Status
                if (self.filterStatus !== 'all' && State) {
                    var st = State.getStatus(q.id);
                    if (self.filterStatus === 'correct' && st !== 'correct') return false;
                    if (self.filterStatus === 'wrong' && st !== 'wrong') return false;
                    if (self.filterStatus === 'not_done' && st !== 'not_done') return false;
                }

                // 9. Search query
                if (self.searchQuery) {
                    var text = (q.prompt + ' ' + (q.subtopicName || '') + ' ' + (q.unitName || '') + ' ' + (q.origin || '') + ' ' + (q.codeSnippet || '')).toLowerCase();
                    if (text.indexOf(self.searchQuery) === -1) return false;
                }

                return true;
            });

            this.renderedCount = 0;
            this.renderBatch(true);
            this.updateHeaderProgress();
        },

        renderBatch: function (isReset) {
            var container = document.getElementById('questions-container');
            var loadMoreWrap = document.getElementById('load-more-wrap');
            var loadMoreBtn = document.getElementById('load-more-btn');
            var resultsCount = document.getElementById('results-count');
            if (!container) return;

            if (isReset) {
                container.innerHTML = '';
                this.renderedCount = 0;
            }

            var total = this.filteredQuestions.length;
            var start = this.renderedCount;
            var end = Math.min(start + PAGE_SIZE, total);

            if (total === 0) {
                container.innerHTML = '<div class="empty-state-card">' +
                    '<div class="empty-state-icon">' +
                    '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
                    '</div>' +
                    '<h3 class="empty-state-title">No questions found</h3>' +
                    '<p class="empty-state-desc">Try clearing some filters or searching for another keyword.</p>' +
                    '</div>';
                if (loadMoreWrap) loadMoreWrap.style.display = 'none';
                if (resultsCount) resultsCount.textContent = 'Showing 0 questions';
                return;
            }

            var slice = this.filteredQuestions.slice(start, end);
            var self = this;

            slice.forEach(function (q, index) {
                var card = self.createQuestionCard(q, start + index + 1);
                container.appendChild(card);
            });

            this.renderedCount = end;

            // Update footer pagination
            if (resultsCount) {
                resultsCount.textContent = 'Showing ' + this.renderedCount + ' of ' + total + ' question' + (total === 1 ? '' : 's');
            }

            if (loadMoreWrap && loadMoreBtn) {
                var remaining = total - this.renderedCount;
                if (remaining > 0) {
                    loadMoreWrap.style.display = 'flex';
                    loadMoreBtn.textContent = 'Load ' + Math.min(PAGE_SIZE, remaining) + ' more question' + (remaining === 1 ? '' : 's') + ' (' + remaining + ' left)';
                } else {
                    loadMoreWrap.style.display = 'none';
                }
            }
        },

        createQuestionCard: function (q, questionNum) {
            var card = document.createElement('article');
            card.className = 'rv-question-card';
            card.id = 'card-' + q.id;
            card.setAttribute('data-id', q.id);

            var status = State ? State.getStatus(q.id) : 'not_done';
            var bookmarked = State ? State.isBookmarked(q.id) : false;
            var note = State ? State.getNote(q.id) : '';

            if (status === 'correct') card.classList.add('status-correct');
            if (status === 'wrong') card.classList.add('status-wrong');

            // Difficulty Dot Color
            var diffClass = 'diff-medium';
            if (q.difficulty === 'Easy') diffClass = 'diff-easy';
            if (q.difficulty === 'Hard') diffClass = 'diff-hard';

            var html = '';

            // Card Top Row
            html += '<div class="rv-card-top">' +
                        '<div class="rv-card-title-group">' +
                            '<span class="rv-q-number">Question ' + questionNum + '</span>' +
                            '<span class="rv-q-origin">' + (q.origin || 'IB CS Specimen') + ' &bull; Paper ' + q.paper + ' &bull; ' + q.level + '</span>' +
                        '</div>' +
                        '<div class="rv-card-syllabus-badge">' +
                            '<span class="unit-notes-tag">' + q.unit + ': ' + (q.subtopicName || q.unitName) + '</span>' +
                        '</div>' +
                    '</div>';

            // Card Meta & Actions Row (Clean SVG Action Buttons)
            html += '<div class="rv-card-bar">' +
                        '<div class="rv-card-tags">' +
                            '<span class="rv-tag rv-tag-format">' + q.format + '</span>' +
                            '<span class="rv-tag rv-tag-subtopic">' + q.subtopicCode + '</span>' +
                            '<span class="rv-tag rv-tag-diff ' + diffClass + '">' +
                                '<span class="diff-dot"></span>' + q.difficulty +
                            '</span>' +
                            '<span class="rv-tag rv-tag-marks">' + q.marks + ' Mark' + (q.marks === 1 ? '' : 's') + '</span>' +
                        '</div>' +
                        '<div class="rv-card-actions">' +
                            '<button type="button" class="rv-action-btn btn-hint" title="Show Guiding Hint" aria-label="Show hint">' + ICONS.lightbulb + '</button>' +
                            '<button type="button" class="rv-action-btn btn-scratchpad' + (note ? ' has-note' : '') + '" title="Open Scratchpad / Notes" aria-label="Notes">' + ICONS.scratchpad + '</button>' +
                            '<button type="button" class="rv-action-btn btn-bookmark' + (bookmarked ? ' is-active' : '') + '" title="Bookmark Question" aria-label="Bookmark">' + ICONS.bookmark + '</button>' +
                            '<button type="button" class="rv-action-btn btn-wrong' + (status === 'wrong' ? ' is-active' : '') + '" title="Mark Incorrect / Needs Review" aria-label="Mark wrong">' + ICONS.cross + '</button>' +
                            '<button type="button" class="rv-action-btn btn-correct' + (status === 'correct' ? ' is-active' : '') + '" title="Mark Correct / Mastered" aria-label="Mark correct">' + ICONS.correct + '</button>' +
                            '<button type="button" class="rv-ans-toggle" aria-expanded="false">Ans</button>' +
                        '</div>' +
                    '</div>';

            // Card Body (Prompt & Code)
            html += '<div class="rv-card-body">' +
                        '<div class="rv-card-prompt">' + this.formatPrompt(q.prompt) + '</div>';

            if (q.codeSnippet) {
                html += '<div class="rv-code-block-wrap">' +
                            '<div class="rv-code-head">' +
                                '<span class="code-lang">Python</span>' +
                                '<button type="button" class="btn-copy-code" title="Copy code">Copy</button>' +
                            '</div>' +
                            '<pre class="rv-code-snippet"><code>' + this.escapeHtml(q.codeSnippet) + '</code></pre>' +
                        '</div>';
            }

            // Scratchpad Drawer
            html += '<div class="rv-scratchpad-drawer" style="display:' + (note ? 'block' : 'none') + ';">' +
                        '<label class="scratchpad-label">Your Scratchpad &amp; Working Notes:</label>' +
                        '<textarea class="rv-scratchpad-input" placeholder="Draft your answer, pseudocode, or steps here...">' + this.escapeHtml(note) + '</textarea>' +
                        '<div class="scratchpad-saved-badge">Autosaved to browser storage</div>' +
                    '</div>';

            // Hint Drawer
            if (q.hint) {
                html += '<div class="rv-hint-drawer" style="display:none;">' +
                            '<strong>Guiding Hint:</strong> ' + this.escapeHtml(q.hint) +
                        '</div>';
            }

            // Mark Scheme Drawer
            html += '<div class="rv-mark-scheme-drawer" style="display:none;">' +
                        '<div class="mark-scheme-header">' +
                            '<span>Official Marking Scheme [Max ' + q.marks + ' Mark' + (q.marks === 1 ? '' : 's') + ']</span>' +
                        '</div>' +
                        '<ul class="mark-scheme-list">';
            if (q.markScheme && q.markScheme.length > 0) {
                q.markScheme.forEach(function (pt) {
                    html += '<li>' + pt.point + ' <span class="mark-val">[' + pt.marks + 'm]</span></li>';
                });
            }
            html +=     '</ul>';

            if (q.examinerTip) {
                html += '<div class="rv-examiner-tip">' +
                            '<strong>Examiner Advice:</strong> ' + this.escapeHtml(q.examinerTip) +
                        '</div>';
            }

            html += '</div>'; // End Mark Scheme Drawer
            html += '</div>'; // End Card Body

            card.innerHTML = html;

            this.bindCardInteractions(card, q);
            return card;
        },

        bindCardInteractions: function (card, q) {
            var ansBtn = card.querySelector('.rv-ans-toggle');
            var markSchemeDrawer = card.querySelector('.rv-mark-scheme-drawer');
            var hintBtn = card.querySelector('.btn-hint');
            var hintDrawer = card.querySelector('.rv-hint-drawer');
            var scratchBtn = card.querySelector('.btn-scratchpad');
            var scratchDrawer = card.querySelector('.rv-scratchpad-drawer');
            var scratchInput = card.querySelector('.rv-scratchpad-input');
            var bookmarkBtn = card.querySelector('.btn-bookmark');
            var correctBtn = card.querySelector('.btn-correct');
            var wrongBtn = card.querySelector('.btn-wrong');
            var copyBtn = card.querySelector('.btn-copy-code');

            // Ans toggle
            if (ansBtn && markSchemeDrawer) {
                ansBtn.addEventListener('click', function () {
                    var isHidden = markSchemeDrawer.style.display === 'none';
                    markSchemeDrawer.style.display = isHidden ? 'block' : 'none';
                    ansBtn.classList.toggle('active', isHidden);
                    ansBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
                });
            }

            // Hint toggle
            if (hintBtn && hintDrawer) {
                hintBtn.addEventListener('click', function () {
                    var isHidden = hintDrawer.style.display === 'none';
                    hintDrawer.style.display = isHidden ? 'block' : 'none';
                    hintBtn.classList.toggle('is-active', isHidden);
                });
            }

            // Scratchpad toggle
            if (scratchBtn && scratchDrawer) {
                scratchBtn.addEventListener('click', function () {
                    var isHidden = scratchDrawer.style.display === 'none';
                    scratchDrawer.style.display = isHidden ? 'block' : 'none';
                    scratchBtn.classList.toggle('is-active', isHidden);
                    if (isHidden && scratchInput) scratchInput.focus();
                });
            }

            // Scratchpad input auto-save
            if (scratchInput && State) {
                var saveTimer = 0;
                scratchInput.addEventListener('input', function () {
                    clearTimeout(saveTimer);
                    saveTimer = setTimeout(function () {
                        State.saveNote(q.id, scratchInput.value);
                        if (scratchBtn) {
                            scratchBtn.classList.toggle('has-note', scratchInput.value.trim().length > 0);
                        }
                    }, 300);
                });
            }

            // Bookmark toggle
            if (bookmarkBtn && State) {
                bookmarkBtn.addEventListener('click', function () {
                    var saved = State.toggleBookmark(q.id);
                    bookmarkBtn.classList.toggle('is-active', saved);
                });
            }

            // Correct toggle
            if (correctBtn && State) {
                correctBtn.addEventListener('click', function () {
                    var newStatus = State.toggleStatus(q.id, 'correct');
                    card.classList.toggle('status-correct', newStatus === 'correct');
                    card.classList.remove('status-wrong');
                    correctBtn.classList.toggle('is-active', newStatus === 'correct');
                    if (wrongBtn) wrongBtn.classList.remove('is-active');
                });
            }

            // Wrong toggle
            if (wrongBtn && State) {
                wrongBtn.addEventListener('click', function () {
                    var newStatus = State.toggleStatus(q.id, 'wrong');
                    card.classList.toggle('status-wrong', newStatus === 'wrong');
                    card.classList.remove('status-correct');
                    wrongBtn.classList.toggle('is-active', newStatus === 'wrong');
                    if (correctBtn) correctBtn.classList.remove('is-active');
                });
            }

            // Copy code
            if (copyBtn && q.codeSnippet) {
                copyBtn.addEventListener('click', function () {
                    navigator.clipboard.writeText(q.codeSnippet).then(function () {
                        copyBtn.textContent = 'Copied!';
                        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1500);
                    });
                });
            }
        },

        updateHeaderProgress: function () {
            if (!State) return;
            var metrics = State.calculateMetrics(this.allQuestions);
            var completedCount = document.getElementById('completed-count-text');
            var progressFill = document.getElementById('completed-progress-fill');
            var reviewTabBadge = document.getElementById('review-tab-badge');

            if (completedCount) {
                completedCount.textContent = metrics.completed + ' / ' + metrics.totalQuestions + ' completed';
            }
            if (progressFill) {
                progressFill.style.width = metrics.progressPercent + '%';
            }
            if (reviewTabBadge) {
                reviewTabBadge.textContent = metrics.wrong > 0 ? metrics.wrong : '';
                reviewTabBadge.style.display = metrics.wrong > 0 ? 'inline-flex' : 'none';
            }
        },

        syncCardStates: function () {
            if (!State) return;
            var cards = document.querySelectorAll('.rv-question-card');
            cards.forEach(function (card) {
                var qId = card.getAttribute('data-id');
                if (!qId) return;

                var st = State.getStatus(qId);
                var isB = State.isBookmarked(qId);

                card.classList.toggle('status-correct', st === 'correct');
                card.classList.toggle('status-wrong', st === 'wrong');

                var cBtn = card.querySelector('.btn-correct');
                var wBtn = card.querySelector('.btn-wrong');
                var bBtn = card.querySelector('.btn-bookmark');

                if (cBtn) cBtn.classList.toggle('is-active', st === 'correct');
                if (wBtn) wBtn.classList.toggle('is-active', st === 'wrong');
                if (bBtn) bBtn.classList.toggle('is-active', isB);
            });
        },

        formatPrompt: function (text) {
            if (!text) return '';
            return text.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
        },

        escapeHtml: function (str) {
            if (!str) return '';
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
    };

    return Bank;
}));
