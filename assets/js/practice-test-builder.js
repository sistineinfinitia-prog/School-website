/**
 * practice-test-builder.js
 * Test Builder & Exam Runner Controller for IB Computer Science Practice Suite
 * Implements 4-step wizard, dynamic live match counter, interactive mock exam runner,
 * timer, scoring, and printable exam paper generation with SVG icons.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['PracticeState'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./practice-state'));
    } else {
        root.PracticeTestBuilder = factory(root.PracticeState || window.PracticeState);
    }
}(typeof self !== 'undefined' ? self : this, function (State) {
    'use strict';

    var SYLLABUS_UNITS = [
        { code: 'A1', name: 'Computer Fundamentals', theme: 'A' },
        { code: 'A2', name: 'Networks', theme: 'A' },
        { code: 'A3', name: 'Databases', theme: 'A' },
        { code: 'A4', name: 'Machine Learning', theme: 'A' },
        { code: 'B1', name: 'Computational Thinking', theme: 'B' },
        { code: 'B2', name: 'Programming', theme: 'B' },
        { code: 'B3', name: 'Object-Oriented Programming', theme: 'B' },
        { code: 'B4', name: 'Abstract Data Types', theme: 'B' },
        { code: 'CS', name: 'HL Case Study', theme: 'CaseStudy' }
    ];

    var Builder = {
        allQuestions: [],
        currentStep: 1, // 1, 2, 3, 4
        
        // Wizard configuration
        config: {
            level: 'all', // 'all', 'sl', 'hl'
            selectedUnits: [], // ['A1', 'A2', ...]
            papers: [], // [1, 2, 3]
            difficulties: [], // ['Easy', 'Medium', 'Hard']
            formats: [], // ['Section A', 'Section B', 'Coding/Query']
            questionCount: 10,
            isTimed: true,
            timePerQuestionMin: 5,
            testTitle: 'Custom IB Computer Science Practice Exam'
        },

        generatedTest: null,
        activeRunner: {
            test: null,
            currentIndex: 0,
            answers: {},
            grades: {},
            timeRemainingSec: 0,
            timerInterval: null
        },
        isInitialized: false,

        init: function (rawQuestions) {
            this.allQuestions = rawQuestions || [];
            this.config.selectedUnits = SYLLABUS_UNITS.map(function (u) { return u.code; });
            this.renderStepper();
            this.renderTopicsStep();
            if (!this.isInitialized) {
                this.bindEvents();
                this.isInitialized = true;
            }
            this.updateLiveMatchCount();
        },

        renderStepper: function () {
            var stepIndicators = document.querySelectorAll('.tb-stepper-item');
            var stepPanels = document.querySelectorAll('.tb-step-panel');
            var self = this;

            stepIndicators.forEach(function (el) {
                var s = parseInt(el.getAttribute('data-step'), 10);
                el.classList.toggle('active', s === self.currentStep);
                el.classList.toggle('completed', s < self.currentStep);
            });

            stepPanels.forEach(function (panel) {
                var s = parseInt(panel.getAttribute('data-step'), 10);
                panel.style.display = (s === self.currentStep) ? 'block' : 'none';
            });
        },

        goToStep: function (stepNum) {
            if (stepNum < 1 || stepNum > 4) return;
            this.currentStep = stepNum;
            this.renderStepper();
            this.updateLiveMatchCount();
        },

        renderTopicsStep: function () {
            var container = document.getElementById('tb-topics-picker');
            if (!container) return;
            var self = this;
            container.innerHTML = '';

            SYLLABUS_UNITS.forEach(function (u) {
                var isSelected = self.config.selectedUnits.indexOf(u.code) !== -1;
                var pill = document.createElement('button');
                pill.type = 'button';
                pill.className = 'tb-topic-pill' + (isSelected ? ' active' : '');
                pill.innerHTML = '<strong>' + u.code + '</strong> ' + u.name;
                pill.addEventListener('click', function () {
                    var idx = self.config.selectedUnits.indexOf(u.code);
                    if (idx === -1) {
                        self.config.selectedUnits.push(u.code);
                    } else {
                        self.config.selectedUnits.splice(idx, 1);
                    }
                    pill.classList.toggle('active', self.config.selectedUnits.indexOf(u.code) !== -1);
                    self.updateLiveMatchCount();
                });
                container.appendChild(pill);
            });
        },

        bindEvents: function () {
            var self = this;

            // Wizard navigation buttons
            var nextBtns = document.querySelectorAll('.tb-btn-next');
            nextBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    self.goToStep(self.currentStep + 1);
                });
            });

            var prevBtns = document.querySelectorAll('.tb-btn-prev');
            prevBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    self.goToStep(self.currentStep - 1);
                });
            });

            // Step 1: Level pills
            var levelPills = document.querySelectorAll('.tb-level-pill');
            levelPills.forEach(function (pill) {
                pill.addEventListener('click', function () {
                    levelPills.forEach(function (p) { p.classList.remove('active'); });
                    pill.classList.add('active');
                    self.config.level = pill.getAttribute('data-level') || 'all';
                    self.updateLiveMatchCount();
                });
            });

            // Step 2: Select all / Deselect all
            var selectAllBtn = document.getElementById('tb-topics-select-all');
            if (selectAllBtn) {
                selectAllBtn.addEventListener('click', function () {
                    self.config.selectedUnits = SYLLABUS_UNITS.map(function (u) { return u.code; });
                    self.renderTopicsStep();
                    self.updateLiveMatchCount();
                });
            }

            var clearAllBtn = document.getElementById('tb-topics-clear-all');
            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', function () {
                    self.config.selectedUnits = [];
                    self.renderTopicsStep();
                    self.updateLiveMatchCount();
                });
            }

            // Step 3: Checkboxes
            var paperCbs = document.querySelectorAll('input[name="tb-paper"]');
            paperCbs.forEach(function (cb) {
                cb.addEventListener('change', function () {
                    self.config.papers = Array.prototype.slice.call(paperCbs).filter(function (c) { return c.checked; }).map(function (c) { return parseInt(c.value, 10); });
                    self.updateLiveMatchCount();
                });
            });

            var diffCbs = document.querySelectorAll('input[name="tb-diff"]');
            diffCbs.forEach(function (cb) {
                cb.addEventListener('change', function () {
                    self.config.difficulties = Array.prototype.slice.call(diffCbs).filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
                    self.updateLiveMatchCount();
                });
            });

            // Step 4: Settings & Custom Question Chooser
            var countBtns = document.querySelectorAll('.tb-count-btn');
            var customWrap = document.getElementById('tb-custom-count-wrap');
            var customSlider = document.getElementById('tb-custom-count-slider');
            var customInput = document.getElementById('tb-custom-count-input');
            var testTitleInput = document.getElementById('tb-test-title');
            var shuffleCheckbox = document.getElementById('tb-shuffle-toggle');

            countBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    countBtns.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    var countType = btn.getAttribute('data-count');
                    if (countType === 'custom') {
                        if (customWrap) customWrap.style.display = 'block';
                        var val = parseInt(customInput ? customInput.value : 10, 10) || 10;
                        self.updateQuestionCountDisplay(val);
                    } else {
                        if (customWrap) customWrap.style.display = 'none';
                        self.updateQuestionCountDisplay(countType);
                    }
                });
            });

            if (customSlider && customInput) {
                customSlider.addEventListener('input', function () {
                    customInput.value = customSlider.value;
                    self.updateQuestionCountDisplay(customSlider.value);
                });
                customInput.addEventListener('input', function () {
                    var val = parseInt(customInput.value, 10);
                    if (!isNaN(val) && val > 0) {
                        customSlider.value = val;
                        self.updateQuestionCountDisplay(val);
                    }
                });
            }

            if (testTitleInput) {
                testTitleInput.addEventListener('input', function () {
                    self.config.testTitle = testTitleInput.value.trim() || 'Custom IB Computer Science Practice Exam';
                });
            }

            if (shuffleCheckbox) {
                shuffleCheckbox.addEventListener('change', function () {
                    self.config.shuffle = shuffleCheckbox.checked;
                });
            }

            var timedCheckbox = document.getElementById('tb-timed-toggle');
            if (timedCheckbox) {
                timedCheckbox.addEventListener('change', function () {
                    self.config.isTimed = timedCheckbox.checked;
                });
            }

            // Generate Test Action
            var generateBtn = document.getElementById('tb-btn-generate');
            if (generateBtn) {
                generateBtn.addEventListener('click', function () {
                    self.generateTest();
                });
            }

            // Preview Actions: Start Runner
            var startBtn = document.getElementById('tb-preview-start-btn');
            if (startBtn) {
                startBtn.addEventListener('click', function () {
                    if (self.generatedTest) {
                        self.startRunner(self.generatedTest);
                    }
                });
            }

            // Preview Actions: Print Sheet
            var printBtn = document.getElementById('tb-preview-print-btn');
            if (printBtn) {
                printBtn.addEventListener('click', function () {
                    if (self.generatedTest) {
                        self.printExamPaper(self.generatedTest);
                    }
                });
            }

            // Runner Modal Close
            var runnerCloseBtn = document.getElementById('runner-close-btn');
            if (runnerCloseBtn) {
                runnerCloseBtn.addEventListener('click', function () {
                    if (confirm('Are you sure you want to exit this examination? Your answers will be submitted.')) {
                        self.finishRunner();
                    }
                });
            }
        },

        getMatchingPool: function () {
            var self = this;
            var teacherQs = (State && State.getTeacherQuestions) ? State.getTeacherQuestions() : [];
            var fullPool = teacherQs.concat(this.allQuestions);

            return fullPool.filter(function (q) {
                if (self.config.level === 'sl' && q.level === 'HL') return false;
                if (self.config.level === 'hl' && q.level === 'SL') return false;

                if (self.config.selectedUnits.length > 0) {
                    if (self.config.selectedUnits.indexOf(q.unit) === -1) return false;
                }

                if (self.config.papers.length > 0) {
                    if (self.config.papers.indexOf(q.paper) === -1) return false;
                }

                if (self.config.difficulties.length > 0) {
                    if (self.config.difficulties.indexOf(q.difficulty) === -1) return false;
                }

                return true;
            });
        },

        updateQuestionCountDisplay: function (countVal) {
            var pool = this.getMatchingPool();
            var maxCount = Math.max(1, pool.length);
            var isAll = (countVal === 'all');
            var actualCount = isAll ? maxCount : Math.max(1, Math.min(parseInt(countVal, 10) || 10, maxCount));
            this.config.questionCount = isAll ? 'all' : actualCount;

            var estMarks = Math.round(actualCount * 3.5);
            var estMins = Math.round(estMarks * 1.25);
            var badge = document.getElementById('tb-count-estimate-badge');
            if (badge) {
                badge.textContent = '~' + estMarks + ' marks \u2022 ' + estMins + ' mins';
            }

            var slider = document.getElementById('tb-custom-count-slider');
            var numInput = document.getElementById('tb-custom-count-input');
            if (slider) {
                slider.max = maxCount;
                slider.value = actualCount;
            }
            if (numInput) {
                numInput.max = maxCount;
                numInput.value = actualCount;
            }

            this.updateLiveMatchCount();
        },

        updateLiveMatchCount: function () {
            var matching = this.getMatchingPool();
            var badge = document.getElementById('tb-match-count-badge');
            var subText = document.getElementById('tb-match-subtext');
            var previewEmpty = document.getElementById('tb-preview-empty');
            var previewReady = document.getElementById('tb-preview-ready');
            var slider = document.getElementById('tb-custom-count-slider');
            var numInput = document.getElementById('tb-custom-count-input');

            if (slider) slider.max = Math.max(1, matching.length);
            if (numInput) numInput.max = Math.max(1, matching.length);

            if (badge) {
                badge.textContent = matching.length + ' questions match';
            }
            if (subText) {
                subText.textContent = matching.length > 0 ?
                    'Your chosen settings can draw from ' + matching.length + ' syllabus-aligned questions.' :
                    'No questions match your current combination. Try enabling more topics.';
            }

            if (!this.generatedTest) {
                if (previewEmpty) previewEmpty.style.display = 'block';
                if (previewReady) previewReady.style.display = 'none';
            }
        },

        generateTest: function () {
            var pool = this.getMatchingPool();
            if (pool.length === 0) {
                alert('No questions match your selected configuration. Please select more topics or difficulty levels.');
                return;
            }

            var titleInput = document.getElementById('tb-test-title');
            if (titleInput && titleInput.value.trim()) {
                this.config.testTitle = titleInput.value.trim();
            }

            var questionsToUse = pool.slice();
            var shouldShuffle = (this.config.shuffle !== false);
            if (shouldShuffle) {
                questionsToUse.sort(function () { return 0.5 - Math.random(); });
            }

            var targetCount = (this.config.questionCount === 'all') ?
                questionsToUse.length :
                Math.min(parseInt(this.config.questionCount, 10) || 10, questionsToUse.length);

            var selectedQuestions = questionsToUse.slice(0, targetCount);
            var totalMarks = selectedQuestions.reduce(function (sum, q) { return sum + (q.marks || 2); }, 0);
            var estimatedTimeMin = Math.round(totalMarks * 1.25);

            this.generatedTest = {
                id: 'test-' + Date.now(),
                title: this.config.testTitle,
                level: this.config.level.toUpperCase(),
                questions: selectedQuestions,
                totalMarks: totalMarks,
                estimatedMinutes: estimatedTimeMin,
                createdAt: new Date().toISOString()
            };

            this.renderTestPreview();
        },

        renderTestPreview: function () {
            var previewEmpty = document.getElementById('tb-preview-empty');
            var previewReady = document.getElementById('tb-preview-ready');
            if (!previewReady) return;

            if (previewEmpty) previewEmpty.style.display = 'none';
            previewReady.style.display = 'block';

            var t = this.generatedTest;
            document.getElementById('tb-ready-title').textContent = t.title;
            document.getElementById('tb-ready-level').textContent = t.level === 'ALL' ? 'SL & HL' : t.level;
            document.getElementById('tb-ready-qcount').textContent = t.questions.length + ' Questions';
            document.getElementById('tb-ready-marks').textContent = t.totalMarks + ' Marks';
            document.getElementById('tb-ready-time').textContent = t.estimatedMinutes + ' Mins';

            var qList = document.getElementById('tb-ready-questions-list');
            if (qList) {
                qList.innerHTML = '';
                t.questions.forEach(function (q, i) {
                    var li = document.createElement('li');
                    li.className = 'tb-preview-qitem';
                    li.innerHTML = '<span class="qitem-num">Q' + (i + 1) + '</span>' +
                                   '<span class="qitem-unit">' + q.unit + ': ' + q.subtopicCode + '</span>' +
                                   '<span class="qitem-prompt">' + q.prompt.substring(0, 75) + '...</span>' +
                                   '<span class="qitem-mark">[' + q.marks + 'm]</span>';
                    qList.appendChild(li);
                });
            }
        },

        startRunner: function (test) {
            var modal = document.getElementById('exam-runner-modal');
            if (!modal) return;

            this.activeRunner = {
                test: test,
                currentIndex: 0,
                answers: {},
                grades: {},
                timeRemainingSec: test.estimatedMinutes * 60,
                timerInterval: null
            };

            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';

            this.renderRunnerNav();
            this.renderRunnerCurrentQuestion();
            this.startRunnerTimer();
        },

        renderRunnerNav: function () {
            var navContainer = document.getElementById('runner-question-nav');
            if (!navContainer) return;
            var self = this;
            navContainer.innerHTML = '';

            this.activeRunner.test.questions.forEach(function (q, i) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'runner-nav-bubble' + (i === self.activeRunner.currentIndex ? ' active' : '');
                btn.textContent = (i + 1);

                if (self.activeRunner.answers[q.id] && self.activeRunner.answers[q.id].trim().length > 0) {
                    btn.classList.add('answered');
                }

                btn.addEventListener('click', function () {
                    self.saveCurrentRunnerAnswer();
                    self.activeRunner.currentIndex = i;
                    self.renderRunnerNav();
                    self.renderRunnerCurrentQuestion();
                });

                navContainer.appendChild(btn);
            });
        },

        renderRunnerCurrentQuestion: function () {
            var r = this.activeRunner;
            var q = r.test.questions[r.currentIndex];
            if (!q) return;

            document.getElementById('runner-q-indicator').textContent = 'Question ' + (r.currentIndex + 1) + ' of ' + r.test.questions.length;
            document.getElementById('runner-q-marks').textContent = '[' + q.marks + ' Marks]';
            document.getElementById('runner-q-unit').textContent = q.unit + ': ' + (q.subtopicName || q.unitName);
            document.getElementById('runner-q-prompt').innerHTML = q.prompt.replace(/\n/g, '<br>');

            var codeBox = document.getElementById('runner-code-wrap');
            if (codeBox) {
                if (q.codeSnippet) {
                    codeBox.style.display = 'block';
                    codeBox.querySelector('code').textContent = q.codeSnippet;
                } else {
                    codeBox.style.display = 'none';
                }
            }

            var textarea = document.getElementById('runner-answer-textarea');
            if (textarea) {
                textarea.value = r.answers[q.id] || '';
            }

            var msBox = document.getElementById('runner-markscheme-box');
            var msToggle = document.getElementById('runner-markscheme-toggle');
            if (msBox && msToggle) {
                msBox.style.display = 'none';
                msToggle.textContent = 'Reveal Mark Scheme';
                msToggle.classList.remove('active');

                var msList = msBox.querySelector('.runner-ms-items');
                if (msList && q.markScheme) {
                    msList.innerHTML = '';
                    q.markScheme.forEach(function (pt) {
                        var li = document.createElement('li');
                        li.innerHTML = pt.point + ' <strong>[' + pt.marks + 'm]</strong>';
                        msList.appendChild(li);
                    });
                }
            }

            var prevBtn = document.getElementById('runner-btn-prev');
            var nextBtn = document.getElementById('runner-btn-next');
            if (prevBtn) prevBtn.disabled = (r.currentIndex === 0);
            if (nextBtn) {
                if (r.currentIndex === r.test.questions.length - 1) {
                    nextBtn.textContent = 'Review & Finish';
                } else {
                    nextBtn.textContent = 'Next Question';
                }
            }

            this.bindRunnerQuestionEvents();
        },

        saveCurrentRunnerAnswer: function () {
            var r = this.activeRunner;
            var q = r.test.questions[r.currentIndex];
            if (!q) return;
            var textarea = document.getElementById('runner-answer-textarea');
            if (textarea) {
                r.answers[q.id] = textarea.value;
            }
        },

        bindRunnerQuestionEvents: function () {
            var self = this;
            var prevBtn = document.getElementById('runner-btn-prev');
            var nextBtn = document.getElementById('runner-btn-next');
            var msToggle = document.getElementById('runner-markscheme-toggle');
            var msBox = document.getElementById('runner-markscheme-box');

            if (prevBtn) {
                prevBtn.onclick = function () {
                    self.saveCurrentRunnerAnswer();
                    if (self.activeRunner.currentIndex > 0) {
                        self.activeRunner.currentIndex -= 1;
                        self.renderRunnerNav();
                        self.renderRunnerCurrentQuestion();
                    }
                };
            }

            if (nextBtn) {
                nextBtn.onclick = function () {
                    self.saveCurrentRunnerAnswer();
                    if (self.activeRunner.currentIndex < self.activeRunner.test.questions.length - 1) {
                        self.activeRunner.currentIndex += 1;
                        self.renderRunnerNav();
                        self.renderRunnerCurrentQuestion();
                    } else {
                        self.finishRunner();
                    }
                };
            }

            if (msToggle && msBox) {
                msToggle.onclick = function () {
                    var isHidden = msBox.style.display === 'none';
                    msBox.style.display = isHidden ? 'block' : 'none';
                    msToggle.textContent = isHidden ? 'Hide Mark Scheme' : 'Reveal Mark Scheme';
                    msToggle.classList.toggle('active', isHidden);
                };
            }
        },

        startRunnerTimer: function () {
            var self = this;
            var timerDisplay = document.getElementById('runner-timer-display');
            clearInterval(this.activeRunner.timerInterval);

            this.activeRunner.timerInterval = setInterval(function () {
                if (self.activeRunner.timeRemainingSec <= 0) {
                    clearInterval(self.activeRunner.timerInterval);
                    alert('Exam time has expired! Your test will now be submitted.');
                    self.finishRunner();
                    return;
                }
                self.activeRunner.timeRemainingSec -= 1;
                var mins = Math.floor(self.activeRunner.timeRemainingSec / 60);
                var secs = self.activeRunner.timeRemainingSec % 60;
                if (timerDisplay) {
                    timerDisplay.textContent = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
                }
            }, 1000);
        },

        finishRunner: function () {
            this.saveCurrentRunnerAnswer();
            clearInterval(this.activeRunner.timerInterval);

            var r = this.activeRunner;
            var answeredCount = Object.keys(r.answers).filter(function (k) { return r.answers[k].trim().length > 0; }).length;

            if (State && State.saveTestResult) {
                State.saveTestResult({
                    id: r.test.id,
                    title: r.test.title,
                    timestamp: new Date().toISOString(),
                    totalQuestions: r.test.questions.length,
                    answeredQuestions: answeredCount,
                    totalMarks: r.test.totalMarks
                });
            }

            var modal = document.getElementById('exam-runner-modal');
            if (modal) modal.classList.remove('is-open');
            document.body.style.overflow = '';

            alert('Test completed and saved! You answered ' + answeredCount + ' of ' + r.test.questions.length + ' questions.');
        },

        printExamPaper: function (test) {
            var printWin = window.open('', '_blank');
            if (!printWin) {
                alert('Please allow popups to open the printable exam sheet.');
                return;
            }

            var html = '<!DOCTYPE html><html><head><title>' + test.title + '</title>' +
                '<style>' +
                '@page { size: A4; margin: 20mm; }' +
                'body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; color: #000; margin: 0; padding: 20px; }' +
                '.header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 24px; text-align: center; }' +
                '.header h1 { font-size: 18pt; margin: 0 0 8px 0; text-transform: uppercase; }' +
                '.candidate-info { display: flex; justify-content: space-between; margin-bottom: 24px; font-weight: bold; }' +
                '.instruction-box { border: 1px solid #000; padding: 12px; margin-bottom: 30px; font-size: 10pt; }' +
                '.question-block { page-break-inside: avoid; margin-bottom: 40px; }' +
                '.q-head { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 8px; }' +
                '.q-prompt { margin-bottom: 16px; }' +
                '.writing-lines { border-bottom: 1px dotted #888; height: 28px; margin-bottom: 6px; }' +
                '.page-break { page-break-before: always; }' +
                '</style></head><body>' +
                '<div class="header">' +
                '<h1>International Baccalaureate Diploma Programme</h1>' +
                '<h2>Computer Science &mdash; ' + test.title + '</h2>' +
                '<p>Level: ' + test.level + ' &bull; Duration: ' + test.estimatedMinutes + ' minutes &bull; Maximum Mark: ' + test.totalMarks + '</p>' +
                '</div>' +
                '<div class="candidate-info">' +
                '<span>Candidate Name: ___________________________</span>' +
                '<span>Candidate Session Number: ______________</span>' +
                '</div>' +
                '<div class="instruction-box">' +
                '<strong>INSTRUCTIONS TO CANDIDATES</strong><br>' +
                '&bull; Do not open this examination paper until instructed to do so.<br>' +
                '&bull; Answer all questions in the boxes or on the lined spaces provided.<br>' +
                '&bull; A clean copy of the Python reference syntax sheet may be used.' +
                '</div>';

            test.questions.forEach(function (q, i) {
                html += '<div class="question-block">' +
                    '<div class="q-head">' +
                    '<span>Question ' + (i + 1) + ' [' + q.unit + ': ' + q.subtopicCode + ']</span>' +
                    '<span>[' + q.marks + ' Marks]</span>' +
                    '</div>' +
                    '<div class="q-prompt">' + q.prompt.replace(/\n/g, '<br>') + '</div>';

                if (q.codeSnippet) {
                    html += '<pre style="background:#f4f4f4; padding:10px; border:1px solid #ccc; font-family:monospace;">' + q.codeSnippet + '</pre>';
                }

                var lineCount = Math.max(q.marks * 3, 4);
                for (var l = 0; l < lineCount; l++) {
                    html += '<div class="writing-lines"></div>';
                }
                html += '</div>';
            });

            html += '<div class="page-break"></div>' +
                '<div class="header">' +
                '<h1>Confidential Markscheme Appendix</h1>' +
                '<h2>' + test.title + '</h2>' +
                '</div>';

            test.questions.forEach(function (q, i) {
                html += '<div class="question-block">' +
                    '<div class="q-head">Question ' + (i + 1) + ' Markscheme [Maximum ' + q.marks + ' Marks]</div>' +
                    '<ul>';
                if (q.markScheme) {
                    q.markScheme.forEach(function (pt) {
                        html += '<li>' + pt.point + ' [' + pt.marks + 'm]</li>';
                    });
                }
                html += '</ul>';
                if (q.examinerTip) {
                    html += '<p><em>Examiner Tip: ' + q.examinerTip + '</em></p>';
                }
                html += '</div>';
            });

            html += '<script>window.onload = function() { window.print(); };</script></body></html>';

            printWin.document.open();
            printWin.document.write(html);
            printWin.document.close();
        }
    };

    return Builder;
}));
