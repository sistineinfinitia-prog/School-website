/**
 * practice-progress.js
 * Progress Analytics Controller for IB Computer Science Practice Suite
 * Renders real-time topic breakdown progress bars, accuracy stats, and study recommendations.
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

    var Progress = {
        allQuestions: [],
        isInitialized: false,

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
        },

        render: function () {
            if (!State) return;
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
            var units = metrics.units;
            var unitKeys = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'CS'];

            unitKeys.forEach(function (code) {
                var u = units[code] || { name: code, total: 0, completed: 0, completionPercent: 0, accuracyPercent: 0 };
                var row = document.createElement('div');
                row.className = 'prog-topic-row';

                var barFillWidth = u.completionPercent + '%';

                row.innerHTML = '<div class="prog-row-info">' +
                    '<div class="prog-row-title-wrap">' +
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
                    '<a href="#bank" class="prog-jump-link" data-jump-unit="' + code + '">Practice this topic &rarr;</a>' +
                '</div>';

                var jumpBtn = row.querySelector('.prog-jump-link');
                if (jumpBtn) {
                    jumpBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        if (window.PracticeNav) {
                            window.PracticeNav.switchTab('bank');
                        }
                        if (window.PracticeBank) {
                            window.PracticeBank.resetTopics();
                            window.PracticeBank.unitStates[code] = 'included';
                            window.PracticeBank.renderTopicPills();
                            window.PracticeBank.applyFilters();
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }

                container.appendChild(row);
            });
        }
    };

    return Progress;
}));
