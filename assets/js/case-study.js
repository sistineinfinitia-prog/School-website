/**
 * case-study.js - 2027 IB DP Computer Science Case Study Controller
 * "Generative AI for image creation—a diffuse vision" (Visionary Studios)
 * Academic Technical Dossier Controller:
 * - Clean institutional design: no pills, no vibecoded marketing fluff
 * - Terminology Bank cards link directly to Practice Flashcards (no CTA button)
 * - Exam Strategy & Technical Architecture navigation
 */

(function () {
    'use strict';

    var csData = null;
    var glossaryMap = {};

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 1. Tab Switcher
    function switchCaseStudyTab(tabKey) {
        if (!tabKey) return;
        var tabs = document.querySelectorAll('.rv-tab-btn');
        var panes = document.querySelectorAll('.cs-tab-pane');

        tabs.forEach(function (btn) {
            var isTarget = btn.getAttribute('data-tab') === tabKey;
            btn.classList.toggle('active', isTarget);
            btn.classList.toggle('is-active', isTarget);
            btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        });

        panes.forEach(function (pane) {
            var isTarget = pane.id === 'pane-' + tabKey;
            pane.classList.toggle('active', isTarget);
        });

        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', '#' + tabKey);
        }
    }
    window.switchCaseStudyTab = switchCaseStudyTab;

    // 2. Challenge Card Accordion Toggle
    function toggleChallengeCard(card) {
        if (!card) return;
        card.classList.toggle('expanded');
    }
    window.toggleChallengeCard = toggleChallengeCard;

    // 3. Seek Video in YouTube Iframe
    function seekVideo(seconds) {
        var iframe = document.getElementById('cs-youtube-player');
        if (!iframe) return;
        iframe.src = 'https://www.youtube-nocookie.com/embed/QT4Gkni0aJc?start=' + seconds + '&autoplay=1';
        iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    window.seekVideo = seekVideo;

    // 4. Render Challenges (Clean, structured editorial grid)
    function renderChallenges(challenges) {
        var container = document.getElementById('cs-challenges-grid') || document.querySelector('.cs-grid-2x2');
        if (!container || !Array.isArray(challenges)) return;

        var html = challenges.map(function (ch) {
            var isHL = (ch.level || '').indexOf('HL Only') !== -1;
            var tagClass = isHL ? 'cs-tag-hl' : 'cs-tag-sl';
            var navTarget = ch.number === 1 ? 'sec-diffusion' : ch.number === 2 ? 'sec-ethics' : ch.number === 3 ? 'sec-gans' : 'sec-hybrids';
            var navLabel = ch.number === 1 ? 'Diffusion Architecture' : ch.number === 2 ? 'Ethics & Governance' : ch.number === 3 ? 'GAN Mechanics' : 'Hybrid LDM & Evaluation';

            return '<article class="cs-challenge-card" onclick="window.toggleChallengeCard(this)">' +
                '<div class="cs-challenge-header">' +
                    '<div class="cs-challenge-title-group">' +
                        '<span class="cs-challenge-index">CH 0' + ch.number + '</span>' +
                        '<h4 class="cs-challenge-title">' + escapeHtml(ch.title.replace(/^Challenge \d+:\s*/, '')) + '</h4>' +
                    '</div>' +
                    '<span class="cs-tag ' + tagClass + '">' + escapeHtml(ch.level) + '</span>' +
                '</div>' +
                '<p class="cs-challenge-lead">' + escapeHtml(ch.lead) + '</p>' +
                '<div class="cs-challenge-toggle-row">' +
                    '<span>Technical Specification &amp; Analysis</span>' +
                    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                '</div>' +
                '<div class="cs-challenge-detail" onclick="event.stopPropagation()">' +
                    '<div class="cs-detail-block">' +
                        '<strong>Technical Mechanics</strong>' +
                        '<p>' + escapeHtml(ch.technicalMechanics) + '</p>' +
                    '</div>' +
                    '<div class="cs-detail-block">' +
                        '<strong>Syllabus Solutions &amp; Mitigation</strong>' +
                        '<p>' + escapeHtml(ch.optimizationSolutions) + '</p>' +
                    '</div>' +
                    '<div class="cs-challenge-actions">' +
                        '<button type="button" class="cs-btn-action cs-btn-secondary" onclick="window.switchCaseStudyTab(\'models\'); var el = document.getElementById(\'' + navTarget + '\'); if (el) el.scrollIntoView({behavior: \'smooth\'}); event.stopPropagation();">' +
                            '<span>' + navLabel + ' &rarr;</span>' +
                        '</button>' +
                        '<button type="button" class="cs-btn-action cs-btn-secondary" onclick="window.switchCaseStudyTab(\'practice\'); event.stopPropagation();">' +
                            '<span>Exam Strategy &rarr;</span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</article>';
        }).join('');

        container.innerHTML = html;
    }

    // 5. Render 4-Tier Operational Pipeline
    function renderPipeline(pipeline) {
        var container = document.getElementById('cs-pipeline-grid');
        if (!container || !Array.isArray(pipeline)) return;

        var html = pipeline.map(function (p) {
            return '<div class="cs-pipeline-card">' +
                '<div class="cs-pipeline-header">' +
                    '<div class="cs-pipeline-step-meta">' +
                        '<span class="cs-phase-number">Stage 0' + p.phase + '</span>' +
                        '<h4 class="cs-pipeline-name">' + escapeHtml(p.name) + '</h4>' +
                    '</div>' +
                    '<span class="cs-tag cs-tag-accent">' + escapeHtml(p.badge) + '</span>' +
                '</div>' +
                '<p class="cs-pipeline-desc">' + escapeHtml(p.description) + '</p>' +
            '</div>';
        }).join('');

        container.innerHTML = html;
    }

    // 6. Render Terminology Bank (Clicking card jumps directly to that flashcard - NO "Study In Flashcards ->" text)
    function renderGlossary(glossary) {
        glossaryMap = glossary || {};
        var slWrap = document.getElementById('cs-terms-sl-wrap');
        var hlWrap = document.getElementById('cs-terms-hl-wrap');
        if (!slWrap || !hlWrap) return;

        var hlKeys = [
            'CNN', 'GAN', 'Generator & Discriminator', 'Adversarial Dynamic', 
            'Mode Collapse', 'Latent Space', 'VAE', 'Hybrid Model', 
            'Flow-based Model', 'FID', 'Inception Score'
        ];

        var slHtml = '';
        var hlHtml = '';

        Object.keys(glossaryMap).forEach(function (term) {
            var isHL = hlKeys.indexOf(term) !== -1;
            var def = glossaryMap[term];
            var targetUrl = 'practice.html?tab=flashcards&cat=case-study&search=' + encodeURIComponent(term);

            var cardHtml = '<a href="' + targetUrl + '" class="cs-term-card" title="Open \'' + escapeHtml(term) + '\' in Practice Flashcards">' +
                '<div class="cs-term-card-header">' +
                    '<span class="cs-term-name">' + escapeHtml(term) + '</span>' +
                    '<span class="cs-tag ' + (isHL ? 'cs-tag-hl' : 'cs-tag-sl') + '">' + (isHL ? 'HL' : 'SL / HL') + '</span>' +
                '</div>' +
                '<p class="cs-term-card-body">' + escapeHtml(def) + '</p>' +
            '</a>';

            if (isHL) {
                hlHtml += cardHtml;
            } else {
                slHtml += cardHtml;
            }
        });

        slWrap.innerHTML = slHtml;
        hlWrap.innerHTML = hlHtml;
    }

    // 7. Initialize Data
    function initCaseStudy() {
        // Tab click bindings
        document.querySelectorAll('.rv-tab-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tab = btn.getAttribute('data-tab');
                switchCaseStudyTab(tab);
            });
        });

        // Hash navigation on load
        var initialTab = (window.location.hash || '').replace('#', '').toLowerCase();
        if (['overview', 'models', 'media', 'practice'].indexOf(initialTab) !== -1) {
            switchCaseStudyTab(initialTab);
        } else {
            switchCaseStudyTab('overview');
        }

        // Hydrate from DataService if present
        if (typeof window !== 'undefined' && window.DataService && typeof window.DataService.getCaseStudy === 'function') {
            csData = window.DataService.getCaseStudy();
            if (csData) {
                if (csData.challenges) renderChallenges(csData.challenges);
                if (csData.scenario && csData.scenario.pipeline) renderPipeline(csData.scenario.pipeline);
                if (csData.glossary) renderGlossary(csData.glossary);
            }

            window.DataService.subscribe('caseStudy', function (updated) {
                if (updated) {
                    csData = updated;
                    if (csData.challenges) renderChallenges(csData.challenges);
                    if (csData.scenario && csData.scenario.pipeline) renderPipeline(csData.scenario.pipeline);
                    if (csData.glossary) renderGlossary(csData.glossary);
                }
            });
        } else {
            // Fallback fetch
            fetch('../data/case-study.json')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    csData = data;
                    if (data.challenges) renderChallenges(data.challenges);
                    if (data.scenario && data.scenario.pipeline) renderPipeline(data.scenario.pipeline);
                    if (data.glossary) renderGlossary(data.glossary);
                })
                .catch(function () {});
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCaseStudy);
    } else {
        initCaseStudy();
    }
})();
