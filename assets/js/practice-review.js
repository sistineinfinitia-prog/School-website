/**
 * practice-review.js
 * Review Tab Controller for IB Computer Science Practice Suite
 * Handles targeted review buckets (Wrong, Saved, Done, Notes),
 * interactive re-assessment, and clean SVG celebration empty state.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['PracticeState'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./practice-state'));
    } else {
        root.PracticeReview = factory(root.PracticeState || window.PracticeState);
    }
}(typeof self !== 'undefined' ? self : this, function (State) {
    'use strict';

    var Review = {
        allQuestions: [],
        currentBucket: 'wrong', // 'wrong', 'saved', 'done', 'notes'
        isInitialized: false,

        init: function (rawQuestions) {
            this.allQuestions = rawQuestions || [];
            if (!this.isInitialized) {
                this.bindEvents();
                this.isInitialized = true;
            }
            this.render();
        },

        bindEvents: function () {
            var self = this;

            var bucketBtns = document.querySelectorAll('.rv-bucket-btn');
            bucketBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    bucketBtns.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    self.currentBucket = btn.getAttribute('data-bucket') || 'wrong';
                    self.render();
                });
            });

            window.addEventListener('practice:statechange', function () {
                self.render();
            });
        },

        render: function () {
            this.updateBucketCounters();
            var container = document.getElementById('review-questions-container');
            var emptyCard = document.getElementById('review-empty-state');
            if (!container || !emptyCard) return;

            var self = this;
            var teacherQs = (State && State.getTeacherQuestions) ? State.getTeacherQuestions() : [];
            var fullPool = teacherQs.concat(this.allQuestions);

            var matches = fullPool.filter(function (q) {
                if (!State) return false;
                var st = State.getStatus(q.id);
                var isB = State.isBookmarked(q.id);
                var hasN = State.getNote(q.id).trim().length > 0;

                if (self.currentBucket === 'wrong') return st === 'wrong';
                if (self.currentBucket === 'saved') return isB;
                if (self.currentBucket === 'done') return st === 'correct';
                if (self.currentBucket === 'notes') return hasN;
                return false;
            });

            container.innerHTML = '';

            if (matches.length === 0) {
                emptyCard.style.display = 'block';
                if (this.currentBucket === 'wrong') {
                    document.getElementById('review-empty-title').textContent = 'Nothing wrong right now';
                    document.getElementById('review-empty-desc').textContent = "You've resolved all questions you'd previously missed. Questions appear here when marked wrong, and clear once mastered.";
                } else if (this.currentBucket === 'saved') {
                    document.getElementById('review-empty-title').textContent = 'No bookmarked questions';
                    document.getElementById('review-empty-desc').textContent = 'Bookmark challenging questions in the Question Bank to build your customized revision queue.';
                } else if (this.currentBucket === 'done') {
                    document.getElementById('review-empty-title').textContent = 'No completed questions yet';
                    document.getElementById('review-empty-desc').textContent = 'Attempt questions in the Question Bank and mark them correct to track your completion.';
                } else {
                    document.getElementById('review-empty-title').textContent = 'No question notes';
                    document.getElementById('review-empty-desc').textContent = 'Use the scratchpad icon on any question to record code traces, ideas, or working.';
                }
                return;
            }

            emptyCard.style.display = 'none';

            var bank = window.PracticeBank;
            matches.forEach(function (q, i) {
                if (bank && typeof bank.createQuestionCard === 'function') {
                    var card = bank.createQuestionCard(q, i + 1);
                    container.appendChild(card);
                }
            });
        },

        updateBucketCounters: function () {
            if (!State) return;
            var statuses = State.getAllStatuses();
            var bookmarks = State.getBookmarks();
            var notes = State.getAllNotes();

            var wrongCount = 0;
            var doneCount = 0;
            Object.keys(statuses).forEach(function (k) {
                if (statuses[k] === 'wrong') wrongCount += 1;
                if (statuses[k] === 'correct') doneCount += 1;
            });

            var countWrong = document.getElementById('count-bucket-wrong');
            var countSaved = document.getElementById('count-bucket-saved');
            var countDone = document.getElementById('count-bucket-done');
            var countNotes = document.getElementById('count-bucket-notes');

            if (countWrong) countWrong.textContent = wrongCount;
            if (countSaved) countSaved.textContent = bookmarks.length;
            if (countDone) countDone.textContent = doneCount;
            if (countNotes) countNotes.textContent = Object.keys(notes).length;
        }
    };

    return Review;
}));
