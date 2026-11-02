/**
 * practice-progress.js
 * Progress Analytics Controller for IB Computer Science Practice Suite
 * Renders real-time topic breakdown progress bars, accuracy stats, study recommendations,
 * and multi-select topic practice batching.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['PracticeState'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./practice-state'));
    } else {
        root.PracticeProgress = factory(root.PracticeState || window.PracticeState);
    }
}(typeof self !== 'undefined' ? self : this, function (State) {
    'use strict';

    var ICONS = {
        check: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        arrow: '<svg class="prog-arrow-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
    };

    var Progress = {
        allQuestions: [],
        isInitialized: false,
        isSelectMode: false,
        selectedUnits: {}, // code -> boolean

        init: function (rawQuestions) {
            this.allQuestions = rawQuestions || [];
            this.render();
            if (!this.isInitialized) {
                this.bindEvents();
                this.isInitialized = true;
            }
        },

        bindEvents: function () {
            var self = this;
            window.addEventListener('practice:statechange', function () {
                self.render();
            });

            // Toggle select mode button in breakdown header
            var modeBtn = document.getElementById('prog-btn-select-mode');
            if (modeBtn) {
                modeBtn.addEventListener('click', function () {
                    self.setSelectMode(!self.isSelectMode);
                });
            }

            // Floating bar actions
            var cancelBtn = document.getElementById('prog-floating-cancel');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function () {
                    self.setSelectMode(false);
                });
            }

            var selectAllBtn = document.getElementById('prog-floating-select-all');
            if (selectAllBtn) {
                selectAllBtn.addEventListener('click', function () {
                    var unitKeys = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'CS'];
                    var allSelected = unitKeys.every(function (k) { return !!self.selectedUnits[k]; });
                    unitKeys.forEach(function (k) {
                        self.selectedUnits[k] = !allSelected;
                    });
                    self.updateSelectionUI();
                });
            }

            var practiceBtn = document.getElementById('prog-floating-practice-btn');
            if (practiceBtn) {
                practiceBtn.addEventListener('click', function () {
                    var picked = Object.keys(self.selectedUnits).filter(function (k) {
                        return self.selectedUnits[k];
                    });
                    if (picked.length === 0) return;

                    // Switch to Question Bank tab
                    if (window.PracticeNav) {
                        window.PracticeNav.switchTab('bank');
                    }
                    if (window.PracticeBank) {
                        window.PracticeBank.resetTopics();
                        picked.forEach(function (code) {
                            window.PracticeBank.unitStates[code] = 'included';
                        });
                        window.PracticeBank.renderTopicPills();
                        window.PracticeBank.applyFilters();
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        },

        setSelectMode: function (active) {
            this.isSelectMode = active;
            var container = document.getElementById('prog-topics-breakdown-list');
            var modeBtn = document.getElementById('prog-btn-select-mode');
            var modeText = document.getElementById('prog-select-mode-text');
            var bar = document.getElementById('prog-floating-bar');

            if (container) {
                container.classList.toggle('select-active', active);
            }

            if (modeBtn) {
                modeBtn.classList.toggle('btn-primary', active);
            }
            if (modeText) {
                modeText.textContent = active ? 'Close Selection' : 'Select Multiple';
            }

            if (!active) {
                this.selectedUnits = {};
                if (bar) bar.style.display = 'none';
            } else {
                if (bar) bar.style.display = 'block';
            }

            this.updateSelectionUI();
        },

        toggleUnitSelection: function (code) {
            this.selectedUnits[code] = !this.selectedUnits[code];
            this.updateSelectionUI();
        },

        updateSelectionUI: function () {
            var self = this;
            var rows = document.querySelectorAll('.prog-topic-row');
            rows.forEach(function (row) {
                var code = row.getAttribute('data-unit-code');
                var isSelected = !!self.selectedUnits[code];
                row.classList.toggle('is-selected', isSelected);
                row.classList.toggle('select-mode', self.isSelectMode);

                var cb = row.querySelector('.prog-row-checkbox');
                if (cb) {
                    cb.innerHTML = isSelected ? ICONS.check : '';
                }
            });

            var unitKeys = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'CS'];
            var count = unitKeys.filter(function (k) {
                return !!self.selectedUnits[k];
            }).length;

            var allSelected = count === unitKeys.length;
            var selectAllBtn = document.getElementById('prog-floating-select-all');
            if (selectAllBtn) {
                selectAllBtn.textContent = allSelected ? 'Deselect All' : 'Select All';
            }

            var countEl = document.getElementById('prog-floating-count');
            if (countEl) {
                countEl.textContent = count + ' topic' + (count === 1 ? '' : 's') + ' selected';
            }

            var practiceBtn = document.getElementById('prog-floating-practice-btn');
            if (practiceBtn) {
                practiceBtn.disabled = count === 0;
            }
        },

        render: function () {
            if (!State) return;
            var self = this;
            var metrics = State.calculateMetrics(this.allQuestions);

            var accuracyVal = document.getElementById('prog-stat-accuracy');
            var completedVal = document.getElementById('prog-stat-completed');
            var wrongVal = document.getElementById('prog-stat-wrong');
            var savedVal = document.getElementById('prog-stat-saved');

            if (accuracyVal) accuracyVal.textContent = metrics.accuracyPercent + '%';
            if (completedVal) completedVal.textContent = metrics.completed + ' / ' + metrics.totalQuestions;
            if (wrongVal) wrongVal.textContent = metrics.wrong;
            if (savedVal) savedVal.textContent = metrics.bookmarkedCount;

            var container = document.getElementById('prog-topics-breakdown-list');
            if (!container) return;

            container.innerHTML = '';
            if (this.isSelectMode) {
                container.classList.add('select-active');
            } else {
                container.classList.remove('select-active');
            }

            var units = metrics.units;
            var unitKeys = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'CS'];

            unitKeys.forEach(function (code) {
                var u = units[code] || { name: code, total: 0, completed: 0, completionPercent: 0, accuracyPercent: 0 };
                var row = document.createElement('div');
                row.className = 'prog-topic-row' + (self.isSelectMode ? ' select-mode' : '') + (self.selectedUnits[code] ? ' is-selected' : '');
                row.setAttribute('data-unit-code', code);

                var barFillWidth = u.completionPercent + '%';

                row.innerHTML = '<div class="prog-row-info">' +
                    '<div class="prog-row-title-wrap" style="display:flex; align-items:center;">' +
                        '<span class="prog-row-checkbox" aria-hidden="true">' + (self.selectedUnits[code] ? ICONS.check : '') + '</span>' +
                        '<span class="prog-unit-code">' + code + '</span>' +
                        '<span class="prog-unit-name">' + u.name + '</span>' +
                    '</div>' +
                    '<div class="prog-row-meta">' +
                        '<span class="prog-fraction">' + u.completed + ' / ' + u.total + ' completed</span>' +
                        '<span class="prog-percent-badge">' + u.completionPercent + '%</span>' +
                    '</div>' +
                '</div>' +
                '<div class="prog-bar-track">' +
                    '<div class="prog-bar-fill" style="width: ' + barFillWidth + ';"></div>' +
                '</div>' +
                '<div class="prog-row-footer">' +
                    '<span class="prog-acc-badge">Accuracy: ' + (u.completed > 0 ? u.accuracyPercent + '%' : 'N/A') + '</span>' +
                '</div>';

                // Row click: toggles selection in select mode (or auto-enables select mode on click)
                row.addEventListener('click', function () {
                    if (!self.isSelectMode) {
                        self.setSelectMode(true);
                    }
                    self.toggleUnitSelection(code);
                });

                container.appendChild(row);
            });

            this.updateSelectionUI();
        }
    };

    return Progress;
}));
