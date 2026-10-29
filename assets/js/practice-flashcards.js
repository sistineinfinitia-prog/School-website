/**
 * practice-flashcards.js
 * Flashcards Controller for IB Computer Science Practice Suite
 * Clean Minimalist UX (Reference-Aligned with AnkiApp/Gizmo aesthetic)
 * 
 * Features:
 * - Clean toolbar with search pill, filter toggle, and soft lavender 'Study' button
 * - Clean expandable 'Write a card...' authoring form
 * - Responsive cards grid with bookmark stars, clean typography & hairline borders
 * - Focused Study Deck with top utility bar (star, topic, hairline progress bar, counter, close)
 * - Two-phase footer: 'Show answer (Space)' on front; [Previous] [Mark Complete ✓] [Next] on back
 * - Zero-dependency HTML5 canvas confetti engine (mini bursts on complete, celebration shower at end)
 * - Complete adaptation to light and dark theme palettes with zero vibe-code glow
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['PracticeState'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./practice-state'));
    } else {
        root.PracticeFlashcards = factory(root.PracticeState || window.PracticeState);
    }
}(typeof self !== 'undefined' ? self : this, function (State) {
    'use strict';

    /* ==========================================================================
       1. Zero-Dependency Canvas Confetti Engine
       ========================================================================== */
    var ConfettiEngine = {
        canvas: null,
        ctx: null,
        particles: [],
        animId: null,
        isRunning: false,

        colors: [
            '#8b5cf6', '#a78bfa', '#06b6d4', '#38bdf8',
            '#10b981', '#34d399', '#f59e0b', '#fbbf24'
        ],

        init: function (canvasEl) {
            this.canvas = canvasEl || document.getElementById('fc-confetti-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            var self = this;
            window.addEventListener('resize', function () {
                if (self.canvas) self.resize();
            });
        },

        resize: function () {
            if (!this.canvas) return;
            var rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
            var dpr = window.devicePixelRatio || 1;
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            if (this.ctx) {
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                this.ctx.scale(dpr, dpr);
            }
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            this.width = rect.width;
            this.height = rect.height;
        },

        burst: function (originX, originY, count, intensity) {
            if (!this.canvas) this.init();
            if (!this.canvas || !this.ctx) return;

            this.resize();
            var total = count || 36;
            var ox = originX !== undefined ? originX : this.width / 2;
            var oy = originY !== undefined ? originY : this.height / 2;
            var speedMult = intensity || 1;

            for (var i = 0; i < total; i++) {
                var angle = Math.random() * Math.PI * 2;
                var speed = (Math.random() * 7 + 3.5) * speedMult;
                this.particles.push({
                    x: ox,
                    y: oy,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - (2.5 * speedMult),
                    size: Math.random() * 5 + 3.5,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    shape: Math.random() > 0.4 ? 'rect' : 'circle',
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 12,
                    alpha: 1,
                    decay: Math.random() * 0.02 + 0.014,
                    gravity: 0.26
                });
            }

            if (!this.isRunning) {
                this.isRunning = true;
                this.render();
            }
        },

        grandCelebration: function () {
            if (!this.canvas) this.init();
            if (!this.canvas || !this.ctx) return;
            this.resize();

            var self = this;
            var w = this.width;
            var h = this.height;

            function launchCannons() {
                for (var i = 0; i < 65; i++) {
                    var angleLeft = -Math.PI / 4 + (Math.random() - 0.5) * 0.5;
                    var speedLeft = Math.random() * 13 + 9;
                    self.particles.push({
                        x: 20,
                        y: h - 30,
                        vx: Math.cos(angleLeft) * speedLeft,
                        vy: Math.sin(angleLeft) * speedLeft,
                        size: Math.random() * 7 + 4,
                        color: self.colors[Math.floor(Math.random() * self.colors.length)],
                        shape: Math.random() > 0.4 ? 'rect' : 'circle',
                        rotation: Math.random() * 360,
                        rotationSpeed: (Math.random() - 0.5) * 14,
                        alpha: 1,
                        decay: Math.random() * 0.012 + 0.008,
                        gravity: 0.3
                    });

                    var angleRight = -Math.PI * 0.75 + (Math.random() - 0.5) * 0.5;
                    var speedRight = Math.random() * 13 + 9;
                    self.particles.push({
                        x: w - 20,
                        y: h - 30,
                        vx: Math.cos(angleRight) * speedRight,
                        vy: Math.sin(angleRight) * speedRight,
                        size: Math.random() * 7 + 4,
                        color: self.colors[Math.floor(Math.random() * self.colors.length)],
                        shape: Math.random() > 0.4 ? 'rect' : 'circle',
                        rotation: Math.random() * 360,
                        rotationSpeed: (Math.random() - 0.5) * 14,
                        alpha: 1,
                        decay: Math.random() * 0.012 + 0.008,
                        gravity: 0.3
                    });
                }
            }

            launchCannons();
            setTimeout(function () { launchCannons(); }, 350);

            if (!this.isRunning) {
                this.isRunning = true;
                this.render();
            }
        },

        render: function () {
            var self = this;
            if (!this.ctx || !this.canvas) {
                this.isRunning = false;
                return;
            }

            this.ctx.clearRect(0, 0, this.width, this.height);

            for (var i = this.particles.length - 1; i >= 0; i--) {
                var p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= 0.985;
                p.rotation += p.rotationSpeed;
                p.alpha -= p.decay;

                if (p.alpha <= 0 || p.y > this.height + 40) {
                    this.particles.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.globalAlpha = Math.max(0, p.alpha);
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                this.ctx.restore();
            }

            if (this.particles.length > 0) {
                this.animId = requestAnimationFrame(function () { self.render(); });
            } else {
                this.isRunning = false;
                this.ctx.clearRect(0, 0, this.width, this.height);
            }
        },

        stop: function () {
            if (this.animId) cancelAnimationFrame(this.animId);
            this.particles = [];
            this.isRunning = false;
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.width, this.height);
            }
        }
    };

    /* ==========================================================================
       2. Flashcards Application Controller
       ========================================================================== */
    var Flashcards = {
        allCards: [],
        filteredCards: [],
        activeCategory: 'all',
        searchQuery: '',
        studySession: {
            deck: [],
            currentIndex: 0,
            isFlipped: false
        },
        isInitialized: false,

        init: function (rawCards) {
            this.allCards = rawCards || [];
            if (!this.isInitialized) {
                this.bindEvents();
                this.isInitialized = true;
            }
            this.applyFilters();
        },

        bindEvents: function () {
            var self = this;

            // Search input with '/' shortcut (Screenshot 1)
            var searchInput = document.getElementById('fc-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    self.searchQuery = searchInput.value.toLowerCase().trim();
                    self.applyFilters();
                });

                document.addEventListener('keydown', function (e) {
                    if (e.key === '/' && document.activeElement !== searchInput && !document.querySelector('.rv-modal.is-open')) {
                        e.preventDefault();
                        searchInput.focus();
                    }
                });
            }

            // Filter button toggle (Screenshot 1)
            var filterToggleBtn = document.getElementById('fc-filter-toggle-btn');
            var filterWrap = document.getElementById('fc-cat-filter-wrap');
            if (filterToggleBtn && filterWrap) {
                filterToggleBtn.addEventListener('click', function () {
                    var isHidden = filterWrap.style.display === 'none';
                    filterWrap.style.display = isHidden ? 'flex' : 'none';
                    filterToggleBtn.classList.toggle('is-open', isHidden);
                    filterToggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
                });
            }

            // Category filter pills
            var catBtns = document.querySelectorAll('.fc-cat-btn');
            catBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    catBtns.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    self.activeCategory = btn.getAttribute('data-cat') || 'all';
                    self.applyFilters();
                });
            });

            // Write Card accordion toggle (Screenshots 1 & 2)
            var writeCardToggle = document.getElementById('fc-write-card-toggle');
            var writeCardForm = document.getElementById('fc-write-card-form');
            var writeCancelBtn = document.getElementById('fc-write-cancel-btn');

            if (writeCardToggle && writeCardForm) {
                writeCardToggle.addEventListener('click', function () {
                    var isHidden = writeCardForm.style.display === 'none';
                    writeCardForm.style.display = isHidden ? 'block' : 'none';
                    if (isHidden) {
                        var frontInput = document.getElementById('fc-new-term');
                        if (frontInput) frontInput.focus();
                    }
                });
            }

            if (writeCancelBtn && writeCardForm) {
                writeCancelBtn.addEventListener('click', function () {
                    writeCardForm.style.display = 'none';
                });
            }

            // Save new card
            var saveCardBtn = document.getElementById('fc-btn-save-card');
            if (saveCardBtn) {
                saveCardBtn.addEventListener('click', function () {
                    var termInput = document.getElementById('fc-new-term');
                    var defInput = document.getElementById('fc-new-def');
                    var unitSelect = document.getElementById('fc-new-unit');

                    var term = (termInput ? termInput.value : '').trim();
                    var def = (defInput ? defInput.value : '').trim();
                    var unit = unitSelect ? unitSelect.value : 'A1';

                    if (!term || !def) {
                        alert('Please fill in both a term and a definition.');
                        return;
                    }

                    if (State && State.saveCustomCard) {
                        State.saveCustomCard({
                            id: 'custom-fc-' + Date.now(),
                            unit: unit,
                            unitName: 'Custom Card',
                            theme: unit.charAt(0) === 'A' ? 'A' : (unit.charAt(0) === 'B' ? 'B' : 'CaseStudy'),
                            term: term,
                            definition: def,
                            level: 'SL/HL',
                            isCustom: true
                        });
                    }

                    if (termInput) termInput.value = '';
                    if (defInput) defInput.value = '';
                    if (writeCardForm) writeCardForm.style.display = 'none';

                    self.applyFilters();
                });
            }

            // Study button (Screenshot 1: Soft Lavender button)
            var studyBtn = document.getElementById('fc-btn-study');
            if (studyBtn) {
                studyBtn.addEventListener('click', function () {
                    self.startStudySession();
                });
            }

            // Reset progress in main toolbar
            var resetBtn = document.getElementById('fc-reset-progress-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', function () {
                    if (confirm('Reset completion progress for all flashcards?')) {
                        if (State && State.resetCompletedCards) {
                            State.resetCompletedCards();
                        }
                        self.applyFilters();
                    }
                });
            }

            // Focused Study Deck Events (Screenshots 6, 7 & 8)
            var showAnswerBtn = document.getElementById('study-btn-show-answer');
            var prevBtn = document.getElementById('study-btn-prev');
            var nextBtn = document.getElementById('study-btn-next');
            var completeBtn = document.getElementById('study-btn-toggle-complete');
            var starBtn = document.getElementById('study-btn-star');
            var closeStudyBtn = document.getElementById('study-modal-close');
            var restartBtn = document.getElementById('study-btn-restart');
            var closeFinalBtn = document.getElementById('study-btn-close-final');
            var cardBox = document.getElementById('study-card-box');

            if (showAnswerBtn) {
                showAnswerBtn.addEventListener('click', function () {
                    self.flipToBack();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', function () {
                    self.prevStudyCard();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', function () {
                    self.nextStudyCard();
                });
            }

            if (completeBtn) {
                completeBtn.addEventListener('click', function (e) {
                    self.toggleStudyCardComplete(e);
                });
            }

            if (starBtn) {
                starBtn.addEventListener('click', function () {
                    self.toggleCurrentCardStar();
                });
            }

            if (cardBox) {
                cardBox.addEventListener('click', function () {
                    self.toggleStudyFlip();
                });
            }

            if (closeStudyBtn) closeStudyBtn.addEventListener('click', function () { self.closeStudyModal(); });
            if (restartBtn) restartBtn.addEventListener('click', function () { self.startStudySession(); });
            if (closeFinalBtn) closeFinalBtn.addEventListener('click', function () { self.closeStudyModal(); });

            // Keyboard Shortcuts inside Study Modal
            document.addEventListener('keydown', function (e) {
                var modal = document.getElementById('fc-study-modal');
                if (!modal || !modal.classList.contains('is-open')) return;

                if (e.code === 'Space') {
                    e.preventDefault();
                    self.toggleStudyFlip();
                } else if (e.code === 'ArrowLeft') {
                    e.preventDefault();
                    self.prevStudyCard();
                } else if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    self.nextStudyCard();
                } else if (e.key === 'c' || e.key === 'C' || e.code === 'Enter') {
                    e.preventDefault();
                    self.toggleStudyCardComplete();
                } else if (e.code === 'Escape') {
                    self.closeStudyModal();
                }
            });

            // React to external State events
            window.addEventListener('practice:statechange', function (e) {
                if (e.detail && e.detail.type && e.detail.type.indexOf('flashcard') !== -1) {
                    self.applyFilters();
                }
            });
        },

        applyFilters: function () {
            var customCards = (State && State.getCustomCards) ? State.getCustomCards() : [];
            var fullDeck = customCards.concat(this.allCards);
            var self = this;

            this.filteredCards = fullDeck.filter(function (card) {
                if (self.activeCategory !== 'all') {
                    if (self.activeCategory === 'custom' && !card.isCustom) return false;
                    if (self.activeCategory === 'theme-a' && card.theme !== 'A') return false;
                    if (self.activeCategory === 'theme-b' && card.theme !== 'B') return false;
                    if (self.activeCategory === 'case-study' && card.theme !== 'CaseStudy') return false;
                }

                if (self.searchQuery) {
                    var text = (card.term + ' ' + card.definition + ' ' + (card.example || '') + ' ' + card.unit).toLowerCase();
                    if (text.indexOf(self.searchQuery) === -1) return false;
                }

                return true;
            });

            this.renderCardGrid();
        },

        renderCardGrid: function () {
            var grid = document.getElementById('fc-cards-grid');
            var countLabel = document.getElementById('fc-count-label');
            var completedLabel = document.getElementById('fc-completed-label');
            var resetBtn = document.getElementById('fc-reset-progress-btn');
            if (!grid) return;

            grid.innerHTML = '';
            var total = this.filteredCards.length;
            var completedCount = 0;

            if (State && State.isCardCompleted) {
                this.filteredCards.forEach(function (card) {
                    if (State.isCardCompleted(card.id)) completedCount++;
                });
            }

            if (countLabel) countLabel.textContent = total + ' card' + (total === 1 ? '' : 's');
            if (completedLabel) completedLabel.textContent = completedCount + ' completed';
            if (resetBtn) resetBtn.style.display = completedCount > 0 ? 'inline-block' : 'none';

            if (total === 0) {
                grid.innerHTML = '<div class="fc-empty-state">No cards found matching your search. Try adjusting filters or create a card above.</div>';
                return;
            }

            var self = this;
            this.filteredCards.forEach(function (card) {
                var isCompleted = State && State.isCardCompleted ? State.isCardCompleted(card.id) : false;
                var isStarred = State && State.isBookmarked ? State.isBookmarked(card.id) : false;

                var cardEl = document.createElement('div');
                cardEl.className = 'fc-card-item' + (isCompleted ? ' is-completed' : '');
                cardEl.setAttribute('tabindex', '0');
                cardEl.setAttribute('role', 'button');
                cardEl.setAttribute('aria-label', card.term + ', ' + card.unit + '. Click to flip.');

                cardEl.innerHTML = '<div class="fc-card-inner">' +
                    '<div class="fc-card-front">' +
                        '<div class="fc-card-top-row">' +
                            '<div style="display:flex; align-items:center; gap:8px;">' +
                                '<button type="button" class="fc-star-btn' + (isStarred ? ' is-starred' : '') + '" title="Star card" aria-label="Star card">' +
                                    '<svg viewBox="0 0 24 24" width="15" height="15" fill="' + (isStarred ? '#f59e0b' : 'none') + '" stroke="' + (isStarred ? '#f59e0b' : 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' +
                                '</button>' +
                                '<span class="fc-card-badge">' + card.unit + '</span>' +
                            '</div>' +
                            '<button type="button" class="fc-grid-check-btn' + (isCompleted ? ' is-checked' : '') + '" title="' + (isCompleted ? 'Mark incomplete' : 'Mark complete') + '" aria-label="' + (isCompleted ? 'Mark incomplete' : 'Mark complete') + '">' +
                                '<svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' +
                            '</button>' +
                        '</div>' +
                        '<div class="fc-card-content">' +
                            '<h4 class="fc-term-title">' + self.escapeHtml(card.term) + '</h4>' +
                        '</div>' +
                        '<div class="fc-card-footer-row">' +
                            '<span class="fc-tap-hint">Tap to flip</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="fc-card-back">' +
                        '<div class="fc-card-top-row">' +
                            '<span class="fc-card-badge">' + card.unit + '</span>' +
                        '</div>' +
                        '<div class="fc-card-back-body">' +
                            '<p class="fc-def-text">' + self.escapeHtml(card.definition) + '</p>' +
                            (card.example ? '<p class="fc-example-text"><strong>Example:</strong> ' + self.escapeHtml(card.example) + '</p>' : '') +
                        '</div>' +
                        '<div class="fc-card-footer-row">' +
                            '<span class="fc-tap-hint">Tap to flip back</span>' +
                        '</div>' +
                    '</div>' +
                '</div>';

                // Click to flip
                cardEl.addEventListener('click', function (e) {
                    if (e.target.closest('.fc-grid-check-btn') || e.target.closest('.fc-star-btn')) return;
                    cardEl.classList.toggle('is-flipped');
                });

                // Toggle Star directly in card
                var starBtn = cardEl.querySelector('.fc-star-btn');
                if (starBtn) {
                    starBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        if (State && State.toggleBookmark) {
                            State.toggleBookmark(card.id);
                            self.applyFilters();
                        }
                    });
                }

                // Toggle complete directly from card check button
                var checkBtn = cardEl.querySelector('.fc-grid-check-btn');
                if (checkBtn) {
                    checkBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        if (State && State.toggleCardCompleted) {
                            var newlyDone = State.toggleCardCompleted(card.id);
                            if (newlyDone) {
                                var rect = checkBtn.getBoundingClientRect();
                                ConfettiEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28, 0.85);
                            }
                            self.applyFilters();
                        }
                    });
                }

                grid.appendChild(cardEl);
            });
        },

        /* ======================================================================
           3. Focused Study Deck Modal (Reference-Aligned)
           ====================================================================== */
        startStudySession: function () {
            if (this.filteredCards.length === 0) {
                alert('No flashcards available in the current filter selection.');
                return;
            }

            var modal = document.getElementById('fc-study-modal');
            if (!modal) return;

            var canvasEl = document.getElementById('fc-confetti-canvas');
            if (canvasEl) ConfettiEngine.init(canvasEl);

            this.studySession = {
                deck: this.filteredCards.slice().sort(function () { return 0.5 - Math.random(); }),
                currentIndex: 0,
                isFlipped: false
            };

            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';

            this.renderStudyCard();
        },

        renderStudyCard: function () {
            var s = this.studySession;
            var cardBox = document.getElementById('study-card-box');
            var progressText = document.getElementById('study-progress-text');
            var progressBar = document.getElementById('study-progress-bar');
            var topicTag = document.getElementById('study-topic-tag');
            var endScreen = document.getElementById('study-end-screen');
            var mainStudyView = document.getElementById('study-main-view');

            if (s.currentIndex >= s.deck.length) {
                this.showEndScreen();
                return;
            }

            if (mainStudyView) mainStudyView.style.display = 'block';
            if (endScreen) endScreen.style.display = 'none';

            var card = s.deck[s.currentIndex];
            s.isFlipped = false;

            // Reset card rotation and controls to Front mode
            if (cardBox) cardBox.classList.remove('is-flipped');
            this.setControlsPhase(false);

            // Update Top Header Counter and Topic
            if (progressText) {
                progressText.textContent = (s.currentIndex + 1) + ' of ' + s.deck.length;
            }
            if (topicTag) {
                topicTag.textContent = card.unit + ' · ' + (card.unitName || 'Computer Science');
            }

            // Hairline progress line: traversal progress through deck
            if (progressBar) {
                var pct = Math.min(100, Math.round(((s.currentIndex) / s.deck.length) * 100));
                progressBar.style.width = pct + '%';
            }

            // Populate Card Text
            var frontTerm = document.getElementById('study-front-term');
            var backDef = document.getElementById('study-back-def');
            var backEx = document.getElementById('study-back-example');
            var frontStatus = document.getElementById('study-front-status');

            if (frontTerm) frontTerm.textContent = card.term;
            if (backDef) backDef.textContent = card.definition;
            if (backEx) {
                backEx.textContent = card.example ? 'Example: ' + card.example : '';
                backEx.style.display = card.example ? 'block' : 'none';
            }
            if (frontStatus) {
                var isCompleted = State && State.isCardCompleted ? State.isCardCompleted(card.id) : false;
                frontStatus.textContent = isCompleted ? 'Completed ✓' : (card.isCustom ? 'Custom' : 'New');
                frontStatus.classList.toggle('is-done', isCompleted);
            }

            // Update Star Icon
            this.updateStarUI();

            // Update Completion Status on Back Button
            this.updateCompletionButtonUI();

            // Update Navigation Previous / Next state
            var prevBtn = document.getElementById('study-btn-prev');
            var nextText = document.getElementById('study-next-btn-text');

            if (prevBtn) {
                prevBtn.disabled = s.currentIndex === 0;
                prevBtn.classList.toggle('is-disabled', s.currentIndex === 0);
            }
            if (nextText) {
                nextText.textContent = (s.currentIndex === s.deck.length - 1) ? 'Finish' : 'Next';
            }
        },

        setControlsPhase: function (isBack) {
            var frontFooter = document.getElementById('study-footer-front');
            var backFooter = document.getElementById('study-footer-back');
            if (frontFooter) frontFooter.style.display = isBack ? 'none' : 'block';
            if (backFooter) backFooter.style.display = isBack ? 'flex' : 'none';
        },

        flipToBack: function () {
            var cardBox = document.getElementById('study-card-box');
            this.studySession.isFlipped = true;
            if (cardBox) cardBox.classList.add('is-flipped');
            this.setControlsPhase(true);
        },

        toggleStudyFlip: function () {
            var cardBox = document.getElementById('study-card-box');
            this.studySession.isFlipped = !this.studySession.isFlipped;
            if (cardBox) cardBox.classList.toggle('is-flipped', this.studySession.isFlipped);
            this.setControlsPhase(this.studySession.isFlipped);
        },

        updateStarUI: function () {
            var s = this.studySession;
            if (!s.deck || s.currentIndex >= s.deck.length) return;
            var card = s.deck[s.currentIndex];
            var isStarred = State && State.isBookmarked ? State.isBookmarked(card.id) : false;
            var starBtn = document.getElementById('study-btn-star');
            if (starBtn) {
                var svg = starBtn.querySelector('svg');
                if (svg) {
                    svg.setAttribute('fill', isStarred ? '#f59e0b' : 'none');
                    svg.setAttribute('stroke', isStarred ? '#f59e0b' : 'currentColor');
                }
                starBtn.classList.toggle('is-starred', isStarred);
            }
        },

        toggleCurrentCardStar: function () {
            var s = this.studySession;
            if (!s.deck || s.currentIndex >= s.deck.length) return;
            var card = s.deck[s.currentIndex];
            if (State && State.toggleBookmark) {
                State.toggleBookmark(card.id);
                this.updateStarUI();
            }
        },

        updateCompletionButtonUI: function () {
            var s = this.studySession;
            if (!s.deck || s.currentIndex >= s.deck.length) return;
            var card = s.deck[s.currentIndex];
            var isCompleted = State && State.isCardCompleted ? State.isCardCompleted(card.id) : false;

            var completeBtn = document.getElementById('study-btn-toggle-complete');
            var completeText = document.getElementById('study-complete-btn-text');

            if (completeBtn) {
                completeBtn.classList.toggle('is-completed', isCompleted);
                if (completeText) {
                    completeText.textContent = isCompleted ? 'Completed ✓' : 'Mark as Complete';
                }
            }
        },

        toggleStudyCardComplete: function (event) {
            var s = this.studySession;
            if (!s.deck || s.currentIndex >= s.deck.length) return;
            var card = s.deck[s.currentIndex];
            if (!card || !State || !State.toggleCardCompleted) return;

            var newlyCompleted = State.toggleCardCompleted(card.id);
            this.updateCompletionButtonUI();

            var frontStatus = document.getElementById('study-front-status');
            if (frontStatus) {
                frontStatus.textContent = newlyCompleted ? 'Completed ✓' : 'New';
                frontStatus.classList.toggle('is-done', newlyCompleted);
            }

            // Confetti burst on complete!
            if (newlyCompleted) {
                var originX = window.innerWidth / 2;
                var originY = window.innerHeight * 0.75;
                var btn = document.getElementById('study-btn-toggle-complete');
                if (btn) {
                    var rect = btn.getBoundingClientRect();
                    originX = rect.left + rect.width / 2;
                    originY = rect.top + rect.height / 2;
                }
                ConfettiEngine.burst(originX, originY, 40, 1.1);
            }
        },

        nextStudyCard: function () {
            var s = this.studySession;
            if (s.currentIndex < s.deck.length - 1) {
                s.currentIndex++;
                this.renderStudyCard();
            } else {
                this.showEndScreen();
            }
        },

        prevStudyCard: function () {
            var s = this.studySession;
            if (s.currentIndex > 0) {
                s.currentIndex--;
                this.renderStudyCard();
            }
        },

        showEndScreen: function () {
            var s = this.studySession;
            var mainStudyView = document.getElementById('study-main-view');
            var endScreen = document.getElementById('study-end-screen');
            var progressBar = document.getElementById('study-progress-bar');

            if (mainStudyView) mainStudyView.style.display = 'none';
            if (endScreen) endScreen.style.display = 'block';
            if (progressBar) progressBar.style.width = '100%';

            var total = s.deck.length;
            var completedCount = 0;
            if (State && State.isCardCompleted) {
                s.deck.forEach(function (c) {
                    if (State.isCardCompleted(c.id)) completedCount++;
                });
            }
            var remaining = Math.max(0, total - completedCount);

            // Screenshot 8 End Screen Formatting
            var headline = document.getElementById('study-end-headline');
            var subtitle = document.getElementById('study-end-subtitle');
            var bulletComp = document.getElementById('study-final-completed-bullet');
            var bulletRem = document.getElementById('study-final-remaining-bullet');

            if (headline) {
                headline.textContent = total + ' ' + (total === 1 ? 'card' : 'cards') + ', none forgotten.';
            }
            if (subtitle) {
                subtitle.textContent = completedCount + ' of ' + total + ' completed without trouble.';
            }
            if (bulletComp) {
                bulletComp.textContent = 'Completed ' + completedCount;
            }
            if (bulletRem) {
                bulletRem.textContent = 'To review ' + remaining;
            }

            // Grand celebration confetti shower!
            ConfettiEngine.grandCelebration();
        },

        closeStudyModal: function () {
            var modal = document.getElementById('fc-study-modal');
            if (modal) modal.classList.remove('is-open');
            document.body.style.overflow = '';
            ConfettiEngine.stop();
            this.applyFilters();
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

    return Flashcards;
}));