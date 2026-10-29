/**
 * practice-state.js
 * Central client-side state management for IB Computer Science Practice Suite
 * Handles localStorage persistence, progress tracking, and reactive cross-module events.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PracticeState = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var STORAGE_KEYS = {
        STATUS: 'eis_practice_v1_status',
        BOOKMARKS: 'eis_practice_v1_bookmarks',
        NOTES: 'eis_practice_v1_notes',
        CUSTOM_CARDS: 'eis_practice_v1_custom_cards',
        COMPLETED_CARDS: 'eis_practice_v1_completed_cards',
        SAVED_TESTS: 'eis_practice_v1_tests',
        TEACHER_QUESTIONS: 'eis_practice_v1_teacher_questions'
    };

    function safeLoadJSON(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('[PracticeState] Failed to parse key:', key, e);
            return fallback;
        }
    }

    function safeSaveJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('[PracticeState] Failed to persist key:', key, e);
        }
    }

    function emitChange(type, detail) {
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new CustomEvent('practice:statechange', {
                detail: Object.assign({ type: type, timestamp: Date.now() }, detail || {})
            }));
        }
    }

    var State = {
        getStatus: function (questionId) {
            var statuses = safeLoadJSON(STORAGE_KEYS.STATUS, {});
            return statuses[questionId] || 'not_done';
        },

        setStatus: function (questionId, status) {
            var statuses = safeLoadJSON(STORAGE_KEYS.STATUS, {});
            if (status === 'not_done') {
                delete statuses[questionId];
            } else {
                statuses[questionId] = status; // 'correct' or 'wrong'
            }
            safeSaveJSON(STORAGE_KEYS.STATUS, statuses);
            emitChange('status', { id: questionId, status: status });
            return status;
        },

        toggleStatus: function (questionId, targetStatus) {
            var current = this.getStatus(questionId);
            var next = (current === targetStatus) ? 'not_done' : targetStatus;
            return this.setStatus(questionId, next);
        },

        getAllStatuses: function () {
            return safeLoadJSON(STORAGE_KEYS.STATUS, {});
        },

        isBookmarked: function (questionId) {
            var bookmarks = safeLoadJSON(STORAGE_KEYS.BOOKMARKS, []);
            return bookmarks.indexOf(questionId) !== -1;
        },

        toggleBookmark: function (questionId) {
            var bookmarks = safeLoadJSON(STORAGE_KEYS.BOOKMARKS, []);
            var idx = bookmarks.indexOf(questionId);
            var isSaved = false;
            if (idx === -1) {
                bookmarks.push(questionId);
                isSaved = true;
            } else {
                bookmarks.splice(idx, 1);
                isSaved = false;
            }
            safeSaveJSON(STORAGE_KEYS.BOOKMARKS, bookmarks);
            emitChange('bookmark', { id: questionId, saved: isSaved });
            return isSaved;
        },

        getBookmarks: function () {
            return safeLoadJSON(STORAGE_KEYS.BOOKMARKS, []);
        },

        getNote: function (questionId) {
            var notes = safeLoadJSON(STORAGE_KEYS.NOTES, {});
            return notes[questionId] || '';
        },

        saveNote: function (questionId, noteText) {
            var notes = safeLoadJSON(STORAGE_KEYS.NOTES, {});
            var text = (noteText || '').trim();
            if (text.length === 0) {
                delete notes[questionId];
            } else {
                notes[questionId] = text;
            }
            safeSaveJSON(STORAGE_KEYS.NOTES, notes);
            emitChange('note', { id: questionId, text: text });
            return text;
        },

        getAllNotes: function () {
            return safeLoadJSON(STORAGE_KEYS.NOTES, {});
        },

        getCustomCards: function () {
            return safeLoadJSON(STORAGE_KEYS.CUSTOM_CARDS, []);
        },

        saveCustomCard: function (card) {
            var cards = safeLoadJSON(STORAGE_KEYS.CUSTOM_CARDS, []);
            if (!card.id) card.id = 'custom-fc-' + Date.now();
            cards.unshift(card);
            safeSaveJSON(STORAGE_KEYS.CUSTOM_CARDS, cards);
            emitChange('flashcard_added', { card: card });
            return card;
        },

        deleteCustomCard: function (cardId) {
            var cards = safeLoadJSON(STORAGE_KEYS.CUSTOM_CARDS, []);
            cards = cards.filter(function (c) { return c.id !== cardId; });
            safeSaveJSON(STORAGE_KEYS.CUSTOM_CARDS, cards);
            emitChange('flashcard_deleted', { id: cardId });
        },

        getCompletedCards: function () {
            return safeLoadJSON(STORAGE_KEYS.COMPLETED_CARDS, []);
        },

        isCardCompleted: function (cardId) {
            if (!cardId) return false;
            var list = this.getCompletedCards();
            return list.indexOf(cardId) !== -1;
        },

        setCardCompleted: function (cardId, isCompleted) {
            if (!cardId) return false;
            var list = this.getCompletedCards();
            var idx = list.indexOf(cardId);
            var changed = false;

            if (isCompleted && idx === -1) {
                list.push(cardId);
                changed = true;
            } else if (!isCompleted && idx !== -1) {
                list.splice(idx, 1);
                changed = true;
            }

            if (changed) {
                safeSaveJSON(STORAGE_KEYS.COMPLETED_CARDS, list);
                emitChange('flashcard_completed_changed', { cardId: cardId, completed: isCompleted, totalCompleted: list.length });
            }
            return isCompleted;
        },

        toggleCardCompleted: function (cardId) {
            var current = this.isCardCompleted(cardId);
            return this.setCardCompleted(cardId, !current);
        },

        resetCompletedCards: function () {
            safeSaveJSON(STORAGE_KEYS.COMPLETED_CARDS, []);
            emitChange('flashcards_completed_reset', { totalCompleted: 0 });
        },

        getSavedTests: function () {
            return safeLoadJSON(STORAGE_KEYS.SAVED_TESTS, []);
        },

        saveTestResult: function (testSession) {
            var tests = safeLoadJSON(STORAGE_KEYS.SAVED_TESTS, []);
            tests.unshift(testSession);
            safeSaveJSON(STORAGE_KEYS.SAVED_TESTS, tests);
            emitChange('test_saved', { test: testSession });
            return testSession;
        },

        getTeacherQuestions: function () {
            return safeLoadJSON(STORAGE_KEYS.TEACHER_QUESTIONS, []);
        },

        addTeacherQuestion: function (question) {
            var list = safeLoadJSON(STORAGE_KEYS.TEACHER_QUESTIONS, []);
            if (!question.id) question.id = 'tq-' + Date.now();
            list.unshift(question);
            safeSaveJSON(STORAGE_KEYS.TEACHER_QUESTIONS, list);
            emitChange('teacher_question_added', { question: question });
            return question;
        },

        clearTeacherQuestions: function () {
            safeSaveJSON(STORAGE_KEYS.TEACHER_QUESTIONS, []);
            emitChange('teacher_questions_cleared');
        },

        calculateMetrics: function (allQuestions) {
            var statuses = this.getAllStatuses();
            var bookmarks = this.getBookmarks();
            var notes = this.getAllNotes();

            var total = allQuestions.length;
            var completed = 0;
            var correct = 0;
            var wrong = 0;

            var unitMap = {
                'A1': { name: 'Computer Fundamentals', theme: 'A', total: 0, completed: 0, correct: 0, wrong: 0 },
                'A2': { name: 'Networks', theme: 'A', total: 0, completed: 0, correct: 0, wrong: 0 },
                'A3': { name: 'Databases', theme: 'A', total: 0, completed: 0, correct: 0, wrong: 0 },
                'A4': { name: 'Machine Learning', theme: 'A', total: 0, completed: 0, correct: 0, wrong: 0 },
                'B1': { name: 'Computational Thinking', theme: 'B', total: 0, completed: 0, correct: 0, wrong: 0 },
                'B2': { name: 'Programming', theme: 'B', total: 0, completed: 0, correct: 0, wrong: 0 },
                'B3': { name: 'Object-Oriented Programming', theme: 'B', total: 0, completed: 0, correct: 0, wrong: 0 },
                'B4': { name: 'Abstract Data Types', theme: 'B', total: 0, completed: 0, correct: 0, wrong: 0 },
                'CS': { name: 'HL Case Study', theme: 'CaseStudy', total: 0, completed: 0, correct: 0, wrong: 0 }
            };

            allQuestions.forEach(function (q) {
                var st = statuses[q.id] || 'not_done';
                var u = q.unit || 'A1';
                if (!unitMap[u]) {
                    unitMap[u] = { name: q.unitName || u, theme: q.theme || 'A', total: 0, completed: 0, correct: 0, wrong: 0 };
                }
                unitMap[u].total += 1;

                if (st === 'correct') {
                    completed += 1;
                    correct += 1;
                    unitMap[u].completed += 1;
                    unitMap[u].correct += 1;
                } else if (st === 'wrong') {
                    completed += 1;
                    wrong += 1;
                    unitMap[u].completed += 1;
                    unitMap[u].wrong += 1;
                }
            });

            var accuracy = completed > 0 ? Math.round((correct / completed) * 100) : 0;
            var progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

            // Unit percentages
            Object.keys(unitMap).forEach(function (key) {
                var u = unitMap[key];
                u.completionPercent = u.total > 0 ? Math.round((u.completed / u.total) * 100) : 0;
                u.accuracyPercent = u.completed > 0 ? Math.round((u.correct / u.completed) * 100) : 0;
            });

            return {
                totalQuestions: total,
                completed: completed,
                correct: correct,
                wrong: wrong,
                bookmarkedCount: bookmarks.length,
                notesCount: Object.keys(notes).length,
                accuracyPercent: accuracy,
                progressPercent: progressPercent,
                units: unitMap
            };
        }
    };

    return State;
}));
