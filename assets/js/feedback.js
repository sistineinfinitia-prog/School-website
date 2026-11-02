/**
 * Feedback & Requests Page Controller
 * Handles board rendering, live multi-user search, voting toggles, and request submission modal.
 */
(function () {
    'use strict';

    var currentSearch = '';

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function showToast(message) {
        var toast = document.getElementById('fb-toast');
        var toastMsg = document.getElementById('fb-toast-msg');
        if (!toast) return;
        if (toastMsg) toastMsg.textContent = message || 'Request submitted!';
        toast.classList.add('is-visible');
        setTimeout(function () {
            toast.classList.remove('is-visible');
        }, 3200);
    }

    function createCardHtml(item, isUpvoted) {
        var safeTitle = escapeHtml(item.title);
        var safeDesc = item.description ? escapeHtml(item.description) : '';
        var votes = typeof item.votes === 'number' ? item.votes : 0;
        var votedClass = isUpvoted ? ' is-voted' : '';
        var ariaLabel = (isUpvoted ? 'Remove upvote. ' : 'Upvote. ') + votes + ' votes for ' + safeTitle;

        return '' +
            '<article class="fb-card" data-id="' + escapeHtml(item.id) + '">' +
                '<button type="button" class="fb-card-vote' + votedClass + '" data-vote-id="' + escapeHtml(item.id) + '" aria-label="' + ariaLabel + '" title="' + (isUpvoted ? 'Click to undo upvote' : 'Click to upvote') + '">' +
                    '<svg class="fb-vote-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                        '<polyline points="18 15 12 9 6 15"></polyline>' +
                    '</svg>' +
                    '<span class="fb-vote-count">' + votes + '</span>' +
                '</button>' +
                '<div class="fb-card-content">' +
                    '<h4 class="fb-card-title">' + safeTitle + '</h4>' +
                    (safeDesc ? '<p class="fb-card-desc">' + safeDesc + '</p>' : '') +
                '</div>' +
            '</article>';
    }

    function renderSection(containerId, countId, items) {
        var container = document.getElementById(containerId);
        var countEl = document.getElementById(countId);
        if (!container) return;

        if (countEl) {
            countEl.textContent = '(' + items.length + ')';
        }

        if (items.length === 0) {
            var msg = currentSearch ? 'No matching requests' : 'No requests yet';
            container.innerHTML = '<div class="fb-empty-state">' + msg + '</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isUpvoted = false;
            if (window.DataService && typeof window.DataService.isFeedbackUpvoted === 'function') {
                isUpvoted = window.DataService.isFeedbackUpvoted(item.id);
            }
            html += createCardHtml(item, isUpvoted);
        }
        container.innerHTML = html;
    }

    function renderBoard() {
        if (!window.DataService || typeof window.DataService.getFeedback !== 'function') {
            return;
        }

        var allItems = window.DataService.getFeedback({ search: currentSearch });

        // Features lists
        var featBacklog = [];
        var featDone = [];
        var featTotal = 0;

        // Content lists
        var contInProgress = [];
        var contBacklog = [];
        var contDone = [];
        var contTotal = 0;

        for (var i = 0; i < allItems.length; i++) {
            var it = allItems[i];
            var cat = it.category === 'content' ? 'content' : 'features';
            var st = it.status || 'backlog';

            if (cat === 'features') {
                featTotal++;
                if (st === 'done') {
                    featDone.push(it);
                } else {
                    featBacklog.push(it);
                }
            } else {
                contTotal++;
                if (st === 'in-progress') {
                    contInProgress.push(it);
                } else if (st === 'done') {
                    contDone.push(it);
                } else {
                    contBacklog.push(it);
                }
            }
        }

        // Update column headers
        var colFeatCount = document.getElementById('count-features');
        if (colFeatCount) colFeatCount.textContent = '(' + featTotal + ')';

        var colContCount = document.getElementById('count-content');
        if (colContCount) colContCount.textContent = '(' + contTotal + ')';

        // Render each status group
        renderSection('list-feat-backlog', 'count-feat-backlog', featBacklog);
        renderSection('list-feat-done', 'count-feat-done', featDone);

        renderSection('list-cont-inprogress', 'count-cont-inprogress', contInProgress);
        renderSection('list-cont-backlog', 'count-cont-backlog', contBacklog);
        renderSection('list-cont-done', 'count-cont-done', contDone);
    }

    // --- Modal Controller ---
    var overlay = null;
    var openBtn = null;
    var cancelBtn = null;
    var form = null;
    var catSelect = null;
    var titleInput = null;
    var descInput = null;
    var titleCounter = null;
    var descCounter = null;
    var submitBtn = null;

    function openModal() {
        if (!overlay) return;
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        if (titleInput) {
            titleInput.value = '';
            titleInput.focus();
        }
        if (descInput) descInput.value = '';
        if (titleCounter) titleCounter.textContent = '0/100';
        if (descCounter) descCounter.textContent = '0/600';
        if (submitBtn) submitBtn.disabled = false;
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (openBtn) openBtn.focus();
    }

    function initModal() {
        overlay = document.getElementById('fb-modal-overlay');
        openBtn = document.getElementById('fb-btn-open-modal');
        cancelBtn = document.getElementById('fb-modal-cancel');
        form = document.getElementById('fb-submit-form');
        catSelect = document.getElementById('fb-req-category');
        titleInput = document.getElementById('fb-req-title');
        descInput = document.getElementById('fb-req-desc');
        titleCounter = document.getElementById('fb-title-counter');
        descCounter = document.getElementById('fb-desc-counter');
        submitBtn = document.getElementById('fb-modal-submit');

        if (openBtn) {
            openBtn.addEventListener('click', openModal);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) closeModal();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
                closeModal();
            }
        });

        if (titleInput && titleCounter) {
            titleInput.addEventListener('input', function () {
                var len = titleInput.value.length;
                titleCounter.textContent = len + '/100';
            });
        }

        if (descInput && descCounter) {
            descInput.addEventListener('input', function () {
                var len = descInput.value.length;
                descCounter.textContent = len + '/600';
            });
        }

        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var title = (titleInput ? titleInput.value : '').trim();
                if (!title) {
                    if (titleInput) titleInput.focus();
                    return;
                }
                var desc = (descInput ? descInput.value : '').trim();
                var cat = catSelect ? catSelect.value : 'features';

                if (submitBtn) submitBtn.disabled = true;

                if (window.DataService && typeof window.DataService.addFeedback === 'function') {
                    window.DataService.addFeedback({
                        title: title,
                        description: desc,
                        category: cat,
                        status: 'backlog',
                        votes: 1
                    });
                }

                closeModal();
                showToast('Your request has been submitted!');
                renderBoard();
            });
        }
    }

    // --- Voting & Search Controller ---
    function initInteractions() {
        var searchInput = document.getElementById('fb-search');
        if (searchInput) {
            var timer = null;
            searchInput.addEventListener('input', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    currentSearch = searchInput.value || '';
                    renderBoard();
                }, 120);
            });
        }

        var board = document.querySelector('.fb-grid');
        if (board) {
            board.addEventListener('click', function (e) {
                var voteBtn = e.target.closest('.fb-card-vote');
                if (!voteBtn) return;
                var id = voteBtn.getAttribute('data-vote-id');
                if (!id || !window.DataService || typeof window.DataService.voteFeedback !== 'function') return;

                if (navigator.vibrate) {
                    try { navigator.vibrate(12); } catch (err) {}
                }

                var res = window.DataService.voteFeedback(id);
                if (res) {
                    renderBoard();
                }
            });
        }
    }

    // --- Init Page ---
    function init() {
        initModal();
        initInteractions();

        if (window.DataService) {
            if (typeof window.DataService.init === 'function') {
                window.DataService.init().then(function () {
                    renderBoard();
                }).catch(function () {
                    renderBoard();
                });
            } else {
                renderBoard();
            }

            if (typeof window.DataService.subscribe === 'function') {
                window.DataService.subscribe('feedback', function () {
                    renderBoard();
                });
            }
        } else {
            renderBoard();
        }

        if (typeof window.addEventListener === 'function') {
            window.addEventListener('dataservice:update', function (e) {
                if (e.detail && e.detail.entity === 'feedback') {
                    renderBoard();
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
