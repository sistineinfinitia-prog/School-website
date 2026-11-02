/**
 * assets/js/about-us.js
 * Emirates International School (EIS) IB DP Computer Science
 * Dynamic Faculty & Department Renderer (Requirement R3)
 */

(function () {
    'use strict';

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderFacultyTeam(team) {
        var grid = document.getElementById('about-team-grid') || document.querySelector('.about-team-grid');
        if (!grid || !Array.isArray(team)) return;

        var html = team.map(function (member) {
            var tagsHtml = (member.tags || []).map(function (tag) {
                return '<span class="about-tag-chip">' + escapeHtml(tag) + '</span>';
            }).join('');

            return '<article class="about-team-card">' +
                '<div>' +
                    '<div class="about-team-card-top">' +
                        '<div class="about-avatar-monogram" aria-hidden="true">' + escapeHtml(member.monogram) + '</div>' +
                    '</div>' +
                    '<div class="about-team-role-tag">' + escapeHtml(member.role) + '</div>' +
                    '<h3 class="about-team-name">' + escapeHtml(member.name) + '</h3>' +
                    '<p class="about-team-bio">' + escapeHtml(member.bio) + '</p>' +
                    '<div class="about-team-tags">' + tagsHtml + '</div>' +
                '</div>' +
                '<a class="about-team-mail-btn" href="mailto:' + encodeURIComponent(member.email) + '">' +
                    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>' +
                    '<span>' + escapeHtml(member.email) + '</span>' +
                '</a>' +
            '</article>';
        }).join('');

        grid.innerHTML = html;
    }

    function initAboutPage() {
        if (typeof window.initTabs === 'function') {
            window.initTabs('.rv-tab-btn', '.about-tab-pane');
        }

        // Support hash routing
        var hash = (window.location.hash || '').replace(/^#/, '');
        if (hash) {
            var targetBtn = document.querySelector('.rv-tab-btn[data-tab="' + hash + '"]');
            if (targetBtn) targetBtn.click();
        }

        if (typeof window !== 'undefined' && window.DataService && typeof window.DataService.getFaculty === 'function') {
            var data = window.DataService.getFaculty();
            if (data && data.team) {
                renderFacultyTeam(data.team);
            }
            window.DataService.subscribe('faculty', function (updated) {
                if (updated && updated.team) {
                    renderFacultyTeam(updated.team);
                }
            });
        } else {
            fetch('../data/faculty.json')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data && data.team) {
                        renderFacultyTeam(data.team);
                    }
                })
                .catch(function () {});
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAboutPage);
    } else {
        initAboutPage();
    }
})();
