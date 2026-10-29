/**
 * practice-admin-modal.js
 * Teacher Question & Topic Authoring Controller for IB Computer Science Practice Suite
 * Enables authorized faculty to create new questions, test them immediately in local session,
 * and export valid JSON to sync with data/questions.json.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['PracticeState'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./practice-state'));
    } else {
        root.PracticeAdminModal = factory(root.PracticeState || window.PracticeState);
    }
}(typeof self !== 'undefined' ? self : this, function (State) {
    'use strict';

    var FACULTY_KEY = 'eis2026';

    var Admin = {
        allQuestions: [],
        isAuthenticated: false,
        isInitialized: false,

        init: function (rawQuestions) {
            this.allQuestions = rawQuestions || [];
            this.checkSession();
            if (!this.isInitialized) {
                this.bindEvents();
                this.isInitialized = true;
            }
        },

        checkSession: function () {
            try {
                if (sessionStorage.getItem('eis_cs_faculty_auth') === 'true') {
                    this.isAuthenticated = true;
                }
            } catch (e) {}
        },

        bindEvents: function () {
            var self = this;
            var teacherTriggerBtn = document.getElementById('btn-teacher-mode');
            var modal = document.getElementById('teacher-admin-modal');
            var closeBtn = document.getElementById('teacher-modal-close');
            var authSection = document.getElementById('teacher-auth-section');
            var formSection = document.getElementById('teacher-form-section');
            var authSubmit = document.getElementById('teacher-auth-submit');
            var passInput = document.getElementById('teacher-passkey-input');
            var addMsPointBtn = document.getElementById('btn-add-ms-point');
            var addLocalBtn = document.getElementById('btn-teacher-add-local');
            var copyJsonBtn = document.getElementById('btn-teacher-copy-json');
            var exportJsonBtn = document.getElementById('btn-teacher-export-json');

            if (teacherTriggerBtn && modal) {
                teacherTriggerBtn.addEventListener('click', function () {
                    modal.classList.add('is-open');
                    document.body.style.overflow = 'hidden';
                    if (self.isAuthenticated) {
                        if (authSection) authSection.style.display = 'none';
                        if (formSection) formSection.style.display = 'block';
                    } else {
                        if (authSection) authSection.style.display = 'block';
                        if (formSection) formSection.style.display = 'none';
                        if (passInput) passInput.focus();
                    }
                });
            }

            if (closeBtn && modal) {
                closeBtn.addEventListener('click', function () {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                });
            }

            if (authSubmit && passInput) {
                authSubmit.addEventListener('click', function () {
                    if (passInput.value.trim() === FACULTY_KEY || passInput.value.trim() === 'admin' || passInput.value.trim() === 'ibdp2026') {
                        self.isAuthenticated = true;
                        try { sessionStorage.setItem('eis_cs_faculty_auth', 'true'); } catch (e) {}
                        if (authSection) authSection.style.display = 'none';
                        if (formSection) formSection.style.display = 'block';
                    } else {
                        alert('Incorrect faculty passkey. Please check with the CS Department head.');
                    }
                });
            }

            if (addMsPointBtn) {
                addMsPointBtn.addEventListener('click', function () {
                    self.addMarkSchemeRow();
                });
            }

            if (addLocalBtn) {
                addLocalBtn.addEventListener('click', function () {
                    var q = self.extractFormQuestion();
                    if (!q) return;

                    if (State && State.addTeacherQuestion) {
                        State.addTeacherQuestion(q);
                    }
                    alert('Question "' + q.prompt.substring(0, 40) + '..." successfully added to your live Question Bank session!');
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                    if (window.PracticeBank) {
                        window.PracticeBank.applyFilters();
                    }
                });
            }

            if (copyJsonBtn) {
                copyJsonBtn.addEventListener('click', function () {
                    var q = self.extractFormQuestion();
                    if (!q) return;
                    var jsonStr = JSON.stringify(q, null, 2);
                    navigator.clipboard.writeText(jsonStr).then(function () {
                        copyJsonBtn.textContent = 'Copied to Clipboard!';
                        setTimeout(function () { copyJsonBtn.textContent = 'Copy Question JSON'; }, 1800);
                    });
                });
            }

            if (exportJsonBtn) {
                exportJsonBtn.addEventListener('click', function () {
                    var q = self.extractFormQuestion();
                    var list = self.allQuestions.slice();
                    if (q) list.unshift(q);

                    var blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = 'questions.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                });
            }
        },

        addMarkSchemeRow: function (pointText, marks) {
            var container = document.getElementById('teacher-ms-container');
            if (!container) return;

            var row = document.createElement('div');
            row.className = 'teacher-ms-row';
            row.innerHTML = '<input type="text" class="input ms-point-text" placeholder="Mark scheme statement..." value="' + (pointText || '') + '">' +
                '<input type="number" class="input ms-point-marks" min="1" max="10" value="' + (marks || 1) + '" style="width:70px;">' +
                '<button type="button" class="btn btn-sm btn-remove-ms">&times;</button>';

            row.querySelector('.btn-remove-ms').addEventListener('click', function () {
                container.removeChild(row);
            });

            container.appendChild(row);
        },

        extractFormQuestion: function () {
            var unitSelect = document.getElementById('tq-unit');
            var subCodeInput = document.getElementById('tq-subtopic-code');
            var subNameInput = document.getElementById('tq-subtopic-name');
            var levelSelect = document.getElementById('tq-level');
            var paperSelect = document.getElementById('tq-paper');
            var diffSelect = document.getElementById('tq-difficulty');
            var formatSelect = document.getElementById('tq-format');
            var skillSelect = document.getElementById('tq-skill');
            var marksInput = document.getElementById('tq-marks');
            var originInput = document.getElementById('tq-origin');
            var promptInput = document.getElementById('tq-prompt');
            var codeInput = document.getElementById('tq-code');
            var tipInput = document.getElementById('tq-tip');

            var prompt = (promptInput ? promptInput.value : '').trim();
            if (!prompt) {
                alert('Please enter a question prompt.');
                return null;
            }

            var unit = unitSelect ? unitSelect.value : 'A1';
            var theme = unit.charAt(0) === 'A' ? 'A' : (unit.charAt(0) === 'B' ? 'B' : 'CaseStudy');

            var msRows = document.querySelectorAll('.teacher-ms-row');
            var markScheme = [];
            msRows.forEach(function (r) {
                var p = r.querySelector('.ms-point-text').value.trim();
                var m = parseInt(r.querySelector('.ms-point-marks').value, 10) || 1;
                if (p) markScheme.push({ point: p, marks: m });
            });

            if (markScheme.length === 0) {
                markScheme.push({ point: 'Accurate and comprehensive response meeting IB rubric standards.', marks: parseInt(marksInput.value, 10) || 2 });
            }

            return {
                id: 'q-' + unit.toLowerCase() + '-' + Date.now(),
                theme: theme,
                unit: unit,
                unitName: unitSelect.options[unitSelect.selectedIndex].text,
                subtopicCode: (subCodeInput ? subCodeInput.value : unit + '.1').trim() || unit + '.1',
                subtopicName: (subNameInput ? subNameInput.value : 'Syllabus Topic').trim() || 'Syllabus Topic',
                level: levelSelect ? levelSelect.value : 'SL/HL',
                paper: parseInt(paperSelect ? paperSelect.value : 1, 10),
                difficulty: diffSelect ? diffSelect.value : 'Medium',
                format: formatSelect ? formatSelect.value : 'Section A',
                skill: skillSelect ? skillSelect.value : 'Recall/Concept',
                marks: parseInt(marksInput ? marksInput.value : 2, 10) || 2,
                origin: (originInput ? originInput.value : 'Teacher Created 2026').trim() || 'Teacher Created',
                prompt: prompt,
                hint: null,
                codeSnippet: (codeInput && codeInput.value.trim().length > 0) ? codeInput.value.trim() : null,
                markScheme: markScheme,
                examinerTip: (tipInput ? tipInput.value : '').trim() || null
            };
        }
    };

    return Admin;
}));
