/**
 * assets/js/ia-feed.js
 * Emirates International School (EIS) IB DP Computer Science
 * Dynamic Internal Assessment (IA) Renderer & Controller (Requirement R3)
 *
 * Renders Criteria A–E rubrics, markbands, student exemplars, and video masterclass
 * dynamically from DataService / data/ia.json while preserving accordion toggle,
 * tab switching, and deep-link routing.
 */

(function () {
    'use strict';

    var iaData = null;
    var updateToggleState = function () {};

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 1. Render Criteria A-E Stack
    function renderCriteria(criteria) {
        var container = document.getElementById('criteria-container');
        if (!container || !Array.isArray(criteria)) return;

        var html = criteria.map(function (c) {
            var rubricCardsHtml = (c.rubric || []).map(function (r) {
                var topClass = r.isTopBand ? ' top-band' : '';
                return '<div class="ia-rubric-card' + topClass + '">' +
                    '<div class="ia-rubric-top">' +
                        '<span class="ia-rubric-band">' + escapeHtml(r.band) + '</span>' +
                        '<span class="ia-rubric-status">' + escapeHtml(r.status) + '</span>' +
                    '</div>' +
                    '<p class="ia-rubric-desc">' + escapeHtml(r.description) + '</p>' +
                '</div>';
            }).join('');

            var deliverablesHtml = (c.deliverables || []).map(function (d) {
                return '<div class="ia-deliverable-item">' +
                    '<span class="ia-deliverable-num">' + (d.number || '') + '</span>' +
                    '<div class="ia-deliverable-text">' +
                        '<h5>' + escapeHtml(d.title) + '</h5>' +
                        '<p>' + escapeHtml(d.description) + '</p>' +
                    '</div>' +
                '</div>';
            }).join('');

            var dosHtml = (c.dos || []).map(function (item) {
                var examplesHtml = '';
                if (item.examples && item.examples.length > 0) {
                    examplesHtml = '<div class="ia-comparison-example">' +
                        item.examples.map(function (ex) {
                            return '<div class="ia-example-lead">' +
                                '<span class="ia-example-badge">' + escapeHtml(ex.badge) + '</span>' +
                                '<span class="ia-example-text">' + escapeHtml(ex.text) + '</span>' +
                            '</div>';
                        }).join('') +
                    '</div>';
                }

                return '<div class="ia-comparison-card card-do">' +
                    '<div class="ia-comparison-header">' +
                        '<span class="ia-comparison-badge">' +
                            '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
                            '<span>DO</span>' +
                        '</span>' +
                        '<span class="ia-comparison-tag">' + escapeHtml(item.tag || 'EXEMPLARY STANDARD') + '</span>' +
                    '</div>' +
                    '<h4 class="ia-comparison-title">' + escapeHtml(item.title) + '</h4>' +
                    '<p class="ia-comparison-body">' + escapeHtml(item.body || item.desc || '') + '</p>' +
                    examplesHtml +
                '</div>';
            }).join('');

            var dontsHtml = (c.donts || []).map(function (item) {
                var examplesHtml = '';
                if (item.examples && item.examples.length > 0) {
                    examplesHtml = '<div class="ia-comparison-example">' +
                        item.examples.map(function (ex) {
                            return '<div class="ia-example-lead">' +
                                '<span class="ia-example-badge">' + escapeHtml(ex.badge) + '</span>' +
                                '<span class="ia-example-text">' + escapeHtml(ex.text) + '</span>' +
                            '</div>';
                        }).join('') +
                    '</div>';
                }

                return '<div class="ia-comparison-card card-dont">' +
                    '<div class="ia-comparison-header">' +
                        '<span class="ia-comparison-badge">' +
                            '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
                            '<span>DON\'T</span>' +
                        '</span>' +
                        '<span class="ia-comparison-tag">' + escapeHtml(item.tag || 'COMMON PITFALL') + '</span>' +
                    '</div>' +
                    '<h4 class="ia-comparison-title">' + escapeHtml(item.title) + '</h4>' +
                    '<p class="ia-comparison-body">' + escapeHtml(item.body || item.desc || '') + '</p>' +
                    examplesHtml +
                '</div>';
            }).join('');

            var tipHtml = c.examinerTip ? (
                '<div class="ia-tip-box">' +
                    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>' +
                    '<div class="ia-tip-content">' +
                        '<strong>Examiner Moderation Insight &bull; Criterion ' + escapeHtml(c.code) + ' Mastery:</strong> ' +
                        escapeHtml(c.examinerTip) +
                    '</div>' +
                '</div>'
            ) : '';

            var statsStripHtml = c.statsStrip ? (
                '<div class="ia-unit-stats-strip">' +
                    '<span>Max Marks: <strong>' + escapeHtml(c.statsStrip.maxMarks || c.marks) + '</strong></span>' +
                    '<span>&bull;</span>' +
                    '<span>Core Focus: <strong>' + escapeHtml(c.statsStrip.focus || '') + '</strong></span>' +
                '</div>'
            ) : '';

            return '<details class="ia-unit" data-criterion="' + c.id + '"' + (c.id === 'A' ? ' open' : '') + '>' +
                '<summary class="ia-unit-summary">' +
                    '<div class="ia-unit-left">' +
                        '<span class="ia-unit-code">' + c.id + '</span>' +
                        '<div class="ia-unit-info">' +
                            '<h2 class="ia-unit-name">' + escapeHtml(c.name) + '</h2>' +
                            '<p class="ia-unit-theme">' + escapeHtml(c.theme) + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ia-unit-meta">' +
                        '<span class="ia-tag ia-tag-accent">' + c.marks + ' Marks</span>' +
                        '<span class="ia-tag">' + escapeHtml(c.weight) + '</span>' +
                        '<span class="ia-tag ia-tag-subtle">' + escapeHtml(c.wordCount) + '</span>' +
                        '<svg class="ia-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                    '</div>' +
                '</summary>' +
                '<div class="ia-unit-body">' +
                    '<div class="ia-unit-desc-row">' +
                        '<p class="ia-unit-desc">' + escapeHtml(c.description) + '</p>' +
                        statsStripHtml +
                    '</div>' +
                    '<details class="ia-sub-block" open data-sub-block="' + escapeHtml(c.id) + '.1">' +
                        '<summary class="ia-sub-bar" title="Click to collapse or expand ' + escapeHtml(c.id) + '.1">' +
                            '<div class="ia-sub-title-wrap">' +
                                '<span class="ia-sub-code-badge">' + escapeHtml(c.id) + '.1</span>' +
                                '<h3 class="ia-sub-title">Official 2027 Markband Descriptors' + (c.id === 'D' ? ' (12 Marks)' : '') + '</h3>' +
                            '</div>' +
                            '<svg class="ia-sub-chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                        '</summary>' +
                        '<div class="ia-sub-content">' +
                            '<div class="ia-rubric-grid">' + rubricCardsHtml + '</div>' +
                        '</div>' +
                    '</details>' +
                    '<details class="ia-sub-block" open data-sub-block="' + escapeHtml(c.id) + '.2">' +
                        '<summary class="ia-sub-bar" title="Click to collapse or expand ' + escapeHtml(c.id) + '.2">' +
                            '<div class="ia-sub-title-wrap">' +
                                '<span class="ia-sub-code-badge">' + escapeHtml(c.id) + '.2</span>' +
                                '<h3 class="ia-sub-title">Mandatory Deliverables &amp; Evidence Checklist</h3>' +
                            '</div>' +
                            '<svg class="ia-sub-chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                        '</summary>' +
                        '<div class="ia-sub-content">' +
                            '<div class="ia-deliverables-grid">' + deliverablesHtml + '</div>' +
                        '</div>' +
                    '</details>' +
                    '<details class="ia-sub-block" open data-sub-block="' + escapeHtml(c.id) + '.3">' +
                        '<summary class="ia-sub-bar" title="Click to collapse or expand ' + escapeHtml(c.id) + '.3">' +
                            '<div class="ia-sub-title-wrap">' +
                                '<span class="ia-sub-code-badge">' + escapeHtml(c.id) + '.3</span>' +
                                '<h3 class="ia-sub-title">Examiner DOs vs. DON\'Ts Guide</h3>' +
                            '</div>' +
                            '<svg class="ia-sub-chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                        '</summary>' +
                        '<div class="ia-sub-content">' +
                            '<div class="ia-comparison-grid">' +
                                '<div class="ia-comparison-col">' + dosHtml + '</div>' +
                                '<div class="ia-comparison-col">' + dontsHtml + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</details>' +
                    tipHtml +
                '</div>' +
            '</details>';
        }).join('');

        container.innerHTML = html;

        var countEl = document.getElementById('visible-criteria-count');
        if (countEl) countEl.textContent = criteria.length;

        updateToggleState();
    }

    // 2. Render Exemplars Pane (Revamped 8-Project Hub with Tabbed / Dropdown Selector)
    var currentExemplarId = null;

    function renderExemplars(exemplars, compendium) {
        var pane = document.getElementById('pane-exemplars');
        if (!pane || !Array.isArray(exemplars) || exemplars.length === 0) return;

        compendium = compendium || (iaData && iaData.exemplarsCompendium) || {
            title: "IB DP Computer Science Assessed Student Work Compendium",
            published: "March 2025 (Official IBO Subject Publication)",
            compendiumPdfUrl: "resources/IA/Computer%20Science%20Assessed%20Student%20Work%202027%20(1).pdf",
            description: "Official benchmark publication produced by International Baccalaureate subject experts illustrating the 2027 Internal Assessment assessment standards across 8 authentic computational solutions."
        };

        if (!currentExemplarId || !exemplars.some(function(e) { return e.id === currentExemplarId; })) {
            currentExemplarId = exemplars[0].id;
        }

        // 1. Build Master Compendium Hero Card
        var heroHtml = '<article class="ia-exemplar-hero">' +
            '<div class="ia-exemplar-top">' +
                '<div>' +
                    '<div class="ia-exemplar-badge-row">' +
                        '<span class="ia-tag ia-tag-accent">Official IBO Publication</span>' +
                        '<span class="ia-tag ia-tag-gold">First Assessment 2027</span>' +
                        '<span class="ia-tag ia-tag-subtle">8 Assessed Projects</span>' +
                    '</div>' +
                    '<h2 class="ia-exemplar-title">' + escapeHtml(compendium.title) + '</h2>' +
                    '<p class="ia-exemplar-desc">' + escapeHtml(compendium.description) + '</p>' +
                '</div>' +
                '<div class="ia-exemplar-actions">' +
                    '<a class="btn btn-sm" href="' + escapeHtml(compendium.compendiumPdfUrl) + '" target="_blank" rel="noopener">' +
                        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' +
                        '<span>Preview PDF</span>' +
                    '</a>' +
                    '<a class="btn btn-primary btn-sm" href="' + escapeHtml(compendium.compendiumPdfUrl) + '" download="IB_CS_Assessed_Student_Work_2027.pdf">' +
                        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>' +
                        '<span>Download PDF</span>' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</article>';

        // 2. Build Tabbed / Dropdown Selector Toolbar
        var tabsHtml = exemplars.map(function (ex) {
            var activeClass = (ex.id === currentExemplarId) ? ' active' : '';
            return '<button type="button" class="ia-ex-tab-btn' + activeClass + '" data-ex-id="' + ex.id + '">' +
                '<span class="ia-ex-tab-num">' + escapeHtml(ex.number) + '</span>' +
                '<span class="ia-ex-tab-title">' + escapeHtml(ex.title) + '</span>' +
            '</button>';
        }).join('');

        var optionsHtml = exemplars.map(function (ex) {
            var selected = (ex.id === currentExemplarId) ? ' selected' : '';
            return '<option value="' + ex.id + '"' + selected + '>' + escapeHtml(ex.number + ': ' + ex.title) + '</option>';
        }).join('');

        var selectorHtml = '<div class="ia-exemplar-selector-bar">' +
            '<div class="ia-ex-select-label">Select Exemplar:</div>' +
            '<div class="ia-ex-tabs-list" role="tablist">' + tabsHtml + '</div>' +
            '<div class="ia-ex-dropdown-wrap">' +
                '<select id="ia-exemplar-dropdown" class="ia-ex-dropdown" aria-label="Choose Assessed Student Exemplar">' + optionsHtml + '</select>' +
            '</div>' +
        '</div>';

        // 3. Container for Active Exemplar Detail
        var detailContainer = '<div id="ia-exemplar-active-view"></div>';

        pane.innerHTML = heroHtml + selectorHtml + detailContainer;

        // Render initial active view
        renderActiveExemplarDetail(currentExemplarId, exemplars);

        // Bind tab clicks
        pane.querySelectorAll('.ia-ex-tab-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var targetId = this.getAttribute('data-ex-id');
                if (targetId && targetId !== currentExemplarId) {
                    currentExemplarId = targetId;
                    updateExemplarSelection(currentExemplarId, exemplars);
                }
            });
        });

        // Bind dropdown change
        var dropdown = document.getElementById('ia-exemplar-dropdown');
        if (dropdown) {
            dropdown.addEventListener('change', function () {
                var targetId = this.value;
                if (targetId && targetId !== currentExemplarId) {
                    currentExemplarId = targetId;
                    updateExemplarSelection(currentExemplarId, exemplars);
                }
            });
        }
    }

    function updateExemplarSelection(exId, exemplars) {
        document.querySelectorAll('.ia-ex-tab-btn').forEach(function (btn) {
            var match = (btn.getAttribute('data-ex-id') === exId);
            btn.classList.toggle('active', match);
        });

        var dropdown = document.getElementById('ia-exemplar-dropdown');
        if (dropdown && dropdown.value !== exId) {
            dropdown.value = exId;
        }

        renderActiveExemplarDetail(exId, exemplars);
    }

    function renderActiveExemplarDetail(exId, exemplars) {
        var container = document.getElementById('ia-exemplar-active-view');
        if (!container) return;

        var ex = exemplars.find(function (item) { return item.id === exId; }) || exemplars[0];
        if (!ex) return;

        var criteriaFocusHtml = (ex.criteriaFocus || []).map(function (cf) {
            return '<div class="ia-analysis-card">' +
                '<h4>' +
                    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
                    '<span>' + escapeHtml(cf.criterion) + ' Examiner Focus</span>' +
                '</h4>' +
                '<p>' + escapeHtml(cf.note) + '</p>' +
            '</div>';
        }).join('');

        var arts = ex.artifacts || {};

        container.innerHTML = '<div class="ia-exemplar-detail-box">' +
            '<div class="ia-ex-header">' +
                '<div class="ia-ex-header-left">' +
                    '<div class="ia-exemplar-badge-row">' +
                        '<span class="ia-tag ia-tag-accent">Example ' + escapeHtml(ex.number) + '</span>' +
                        '<span class="ia-tag ia-tag-gold">' + escapeHtml(ex.domain) + '</span>' +
                    '</div>' +
                    '<h3 class="ia-ex-name">' + escapeHtml(ex.title) + '</h3>' +
                    '<p class="ia-ex-summary">' + escapeHtml(ex.summary) + '</p>' +
                    '<div class="ia-ex-tech-stack"><strong>Tech Stack &amp; Concepts:</strong> <code>' + escapeHtml(ex.techStack) + '</code></div>' +
                '</div>' +
            '</div>' +

            '<div class="ia-highlight-box">' +
                '<strong>Key Algorithmic Highlight:</strong> ' + escapeHtml(ex.highlight) +
            '</div>' +

            '<div class="ia-artifacts-section">' +
                '<h4 class="ia-artifacts-title">Official IB Submission Artifacts</h4>' +
                '<div class="ia-artifact-grid">' +
                    '<a class="ia-artifact-card" href="' + escapeHtml(arts.workPdf || '#') + '" target="_blank" rel="noopener">' +
                        '<div class="ia-artifact-icon">' +
                            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>' +
                        '</div>' +
                        '<div class="ia-artifact-info">' +
                            '<div class="ia-artifact-name">Submitted Work</div>' +
                            '<div class="ia-artifact-type">Coursework (PDF)</div>' +
                        '</div>' +
                        '<span class="ia-artifact-action">&rarr;</span>' +
                    '</a>' +

                    '<a class="ia-artifact-card" href="' + escapeHtml(arts.examinerPdf || '#') + '" target="_blank" rel="noopener">' +
                        '<div class="ia-artifact-icon ia-icon-examiner">' +
                            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>' +
                        '</div>' +
                        '<div class="ia-artifact-info">' +
                            '<div class="ia-artifact-name">Examiner Comments</div>' +
                            '<div class="ia-artifact-type">Official Marks &amp; Moderation (PDF)</div>' +
                        '</div>' +
                        '<span class="ia-artifact-action">&rarr;</span>' +
                    '</a>' +

                    '<a class="ia-artifact-card" href="' + escapeHtml(arts.appendixPdf || '#') + '" target="_blank" rel="noopener">' +
                        '<div class="ia-artifact-icon">' +
                            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>' +
                        '</div>' +
                        '<div class="ia-artifact-info">' +
                            '<div class="ia-artifact-name">Technical Appendix</div>' +
                            '<div class="ia-artifact-type">Source Excerpts &amp; Logs (PDF)</div>' +
                        '</div>' +
                        '<span class="ia-artifact-action">&rarr;</span>' +
                    '</a>' +

                    '<a class="ia-artifact-card" href="' + escapeHtml(arts.videoMp4 || '#') + '" target="_blank" rel="noopener">' +
                        '<div class="ia-artifact-icon ia-icon-video">' +
                            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>' +
                        '</div>' +
                        '<div class="ia-artifact-info">' +
                            '<div class="ia-artifact-name">Solution Demo</div>' +
                            '<div class="ia-artifact-type">Video Walkthrough (MP4)</div>' +
                        '</div>' +
                        '<span class="ia-artifact-action">&rarr;</span>' +
                    '</a>' +
                '</div>' +
            '</div>' +

            '<div class="ia-exemplar-analysis-grid">' + criteriaFocusHtml + '</div>' +
        '</div>';
    }

    // 3. Render Videos Pane (Revamped Single Walkthrough & Video Breakdown)
    function renderVideos(videos) {
        var pane = document.getElementById('pane-videos');
        if (!pane || !videos) return;

        var sections = videos.sections || [];
        var sectionsHtml = sections.map(function (sec) {
            return '<div class="ia-video-guide-card">' +
                '<div class="ia-video-num">' + escapeHtml(sec.timestamp || sec.num) + '</div>' +
                '<div class="ia-video-details">' +
                    '<h4>' + escapeHtml(sec.title) + '</h4>' +
                    '<p>' + escapeHtml(sec.description) + '</p>' +
                '</div>' +
                '<div class="ia-video-guide-meta">' +
                    '<span class="ia-tag ia-tag-subtle">' + escapeHtml(sec.focus || 'Key Takeaway') + '</span>' +
                '</div>' +
            '</div>';
        }).join('');

        var embedUrl = videos.embedUrl || 'https://www.youtube-nocookie.com/embed/epXSjopuf8M';
        var videoUrl = videos.videoUrl || 'https://www.youtube.com/watch?v=epXSjopuf8M';
        var videoTitle = videos.videoTitle || 'NEW IB Computer Science IA Explained | Complete Breakdown (M27/N27) | How to Score a 7';

        pane.innerHTML = '<div class="ia-video-section">' +
            '<div class="ia-video-frame-card">' +
                '<div class="ia-video-bar">' +
                    '<span>' + escapeHtml(videoTitle) + '</span>' +
                    '<span class="ia-tag ia-tag-accent">Video Guide &bull; M27/N27</span>' +
                '</div>' +
                '<div class="ia-video-frame-wrap">' +
                    '<iframe src="' + escapeHtml(embedUrl) + '" title="NEW IB Computer Science IA Explained | Complete Breakdown" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>' +
                '</div>' +
                '<div class="ia-video-footer-bar">' +
                    '<div class="ia-video-channel">' +
                        '<strong>Author:</strong> ' + escapeHtml(videos.author || 'IB Way To Seven | IBDP Consultancy') + ' &bull; 9 mins 48 secs' +
                    '</div>' +
                    '<a href="' + escapeHtml(videoUrl) + '" target="_blank" rel="noopener" class="btn btn-sm btn-primary">' +
                        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' +
                        '<span>Watch on YouTube</span>' +
                    '</a>' +
                '</div>' +
            '</div>' +
            '<div class="ia-video-playlist-guide">' +
                '<h3 class="ia-section-title" style="margin-bottom: 14px;">Video Breakdown</h3>' +
                '<div class="ia-video-guide-grid">' + sectionsHtml + '</div>' +
            '</div>' +
        '</div>';
    }

    // 4. Tab Switcher
    function switchTab(tabKey) {
        var btns = document.querySelectorAll('.ia-tab-btn, .rv-tab-btn');
        var panes = document.querySelectorAll('.ia-tab-pane');

        btns.forEach(function (btn) {
            var match = (btn.getAttribute('data-tab') === tabKey);
            btn.classList.toggle('active', match);
            btn.classList.toggle('is-active', match);
            btn.setAttribute('aria-selected', match ? 'true' : 'false');
        });

        panes.forEach(function (pane) {
            var match = (pane.id === 'pane-' + tabKey);
            pane.classList.toggle('active', match);
            pane.style.display = match ? 'block' : 'none';
        });

        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', '#' + tabKey);
        }
    }
    window.switchTab = switchTab;

    // 5. Accordion Expand / Collapse All (Combined Toggle)
    function setupAccordionControls() {
        var btnToggle = document.getElementById('btn-toggle-all-criteria') || document.getElementById('btn-expand-all-criteria');
        var labelEl = document.getElementById('btn-toggle-criteria-label');

        updateToggleState = function () {
            var units = document.querySelectorAll('#criteria-container .ia-unit');
            if (units.length === 0 || !btnToggle) return;
            var openCount = Array.from(units).filter(function (u) { return u.hasAttribute('open'); }).length;
            var allOpen = (openCount === units.length);

            btnToggle.setAttribute('data-action', allOpen ? 'collapse' : 'expand');
            if (labelEl) {
                labelEl.textContent = allOpen ? 'Collapse All Criteria' : 'Expand All Criteria';
            }
            btnToggle.setAttribute('aria-label', allOpen ? 'Collapse all criteria' : 'Expand all criteria');
        };

        if (btnToggle) {
            btnToggle.addEventListener('click', function () {
                var units = document.querySelectorAll('#criteria-container .ia-unit');
                var currentAction = btnToggle.getAttribute('data-action') || 'expand';
                if (currentAction === 'expand') {
                    units.forEach(function (u) { u.setAttribute('open', ''); });
                } else {
                    units.forEach(function (u) { u.removeAttribute('open'); });
                }
                updateToggleState();
            });
        }

        var container = document.getElementById('criteria-container');
        if (container) {
            container.addEventListener('toggle', function (e) {
                if (e.target && e.target.classList.contains('ia-unit')) {
                    updateToggleState();
                }
            }, true);
        }
    }

    // 6. Router and Event Binding
    function setupTabRouting() {
        document.querySelectorAll('.ia-tab-btn, .rv-tab-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tab = this.getAttribute('data-tab');
                if (tab) switchTab(tab);
            });
        });

        function handleHash() {
            var hash = (window.location.hash || '').replace(/^#/, '');
            if (hash === 'criteria' || hash === 'exemplars' || hash === 'videos' || hash === 'guide') {
                switchTab(hash);
            }
        }

        window.addEventListener('hashchange', handleHash);
        handleHash();
    }

    // 7. Hydrate and Initialize
    function initIAFeed() {
        setupAccordionControls();
        setupTabRouting();

        if (typeof window !== 'undefined' && window.DataService && typeof window.DataService.getIA === 'function') {
            iaData = window.DataService.getIA();
            if (iaData) {
                renderCriteria(iaData.criteria);
                renderExemplars(iaData.exemplars, iaData.exemplarsCompendium);
                renderVideos(iaData.videos);
            }

            window.DataService.subscribe('ia', function (updated) {
                if (updated) {
                    iaData = updated;
                    renderCriteria(iaData.criteria);
                    renderExemplars(iaData.exemplars);
                    renderVideos(iaData.videos);
                }
            });
        } else {
            fetch('../data/ia.json')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    iaData = data;
                    if (data) {
                        renderCriteria(data.criteria);
                        renderExemplars(data.exemplars, data.exemplarsCompendium);
                        renderVideos(data.videos);
                    }
                })
                .catch(function () {});
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIAFeed);
    } else {
        initIAFeed();
    }
})();
