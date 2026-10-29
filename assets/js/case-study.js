/**
 * case-study.js - 2027 IB DP Computer Science Case Study Controller
 * "Generative AI for image creation—a diffuse vision" (Visionary Studios)
 * Handles tab switching, 2x2 challenge accordion, interactive terminology glossary,
 * video chapter seeking, and dynamic practice questions rendering.
 */

(function () {
    'use strict';

    // 1. Terminology Glossary Dictionary
    var CS_GLOSSARY = {
        'DDPM': 'Denoising Diffusion Probabilistic Model: A generative deep learning framework that models data generation as the reverse of a progressive Gaussian noise injection Markov chain.',
        'Diffusion Model': 'A class of generative models that learns to recover target data by estimating and subtracting injected noise across parameterized discrete timesteps.',
        'Noise Injection': 'The deliberate, scheduled addition of Gaussian noise to an image tensor over timesteps t during the forward diffusion process.',
        'Denoising': 'The algorithmic estimation and removal of injected noise from a corrupted input representation, performed by a parameterized neural network (typically a U-Net).',
        'Conditional Generation': 'Image generation guided by explicit external constraints, such as natural language text prompts, class category labels, segmentation depth maps, or edge sketches.',
        'Unconditional Generation': 'Generating novel samples purely from learned data distribution statistics without any external guiding prompts or class conditions.',
        'Text-to-Image Generation': 'Synthesizing coherent spatial imagery conditioned on textual descriptions using multimodal semantic cross-attention embeddings (e.g. CLIP).',
        'Image-to-Image Translation': 'Transforming an existing source visual representation into a target artistic style or domain while preserving underlying spatial geometry.',
        'Embedding-based Approach': 'Mapping discrete words or visual patches into a continuous, dense, semantic vector space where distance corresponds to contextual conceptual similarity.',
        'Dataset Curation': 'Systematically filtering, balancing, deduplicating, and auditing training data to ensure copyright compliance, artist permission, and representational fairness.',
        'Bias Mitigation': 'Active algorithmic and statistical measures designed to identify and eliminate systematic skew, prejudice, or demographic stereotyping in AI generation.',
        'Character Consistency': 'Preserving identical facial identity, attire, proportions, and lighting of a subject across multiple distinct generated camera angles and scenes.',
        'CNN': 'Convolutional Neural Network: A specialized deep architecture using spatial kernels with translation invariance, widely utilized in early computer vision and GAN discriminators.',
        'GAN': 'Generative Adversarial Network: A two-player zero-sum minimax framework where a Generator and Discriminator compete against each other to produce synthetic outputs.',
        'Generator & Discriminator': 'The two networks in a GAN: the Generator synthesizes fake samples from random noise, while the Discriminator acts as a binary classifier discerning real from fake.',
        'Adversarial Dynamic': 'The continuous competitive optimization dynamic between Generator and Discriminator, converging ideally toward a Nash equilibrium where the discriminator cannot distinguish authentic from synthetic data.',
        'Mode Collapse': 'A severe failure mode in GAN training where the Generator outputs only a narrow subset of realistic images that fools the Discriminator, ignoring the variety of the true dataset distribution.',
        'Latent Space': 'A compressed, lower-dimensional manifold representation where high-dimensional data (e.g. 1024x1024 images) is compactly encoded while retaining core perceptual semantics.',
        'VAE': 'Variational Autoencoder: A probabilistic generative architecture that encodes input data into a parameterized latent Gaussian distribution and reconstructs it via a decoder.',
        'Hybrid Model': 'An architectural fusion combining distinct generative approaches (such as VAE perceptual compression + latent diffusion + GAN perceptual patch loss) to maximize fidelity while minimizing compute.',
        'Flow-based Model': 'An exact-likelihood generative architecture utilizing invertible transformations with tractable Jacobian determinants to map directly between data and latent spaces.',
        'FID': 'Fréchet Inception Distance: The gold standard metric evaluating synthetic imagery by calculating the Wasserstein-2 distance between Gaussian feature distributions of real and fake images in deep feature space. Lower is better.',
        'Inception Score': 'An early generative metric measuring conditional class confidence (sharpness) and marginal distribution entropy (diversity) on synthetic images alone, without reference to real images. Higher is better.'
    };

    // 2. Standalone Bulletproof Tab Switcher
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

    // 3. Challenge Card Accordion Toggle
    function toggleChallengeCard(card) {
        if (!card) return;
        card.classList.toggle('expanded');
    }
    window.toggleChallengeCard = toggleChallengeCard;

    // 4. Instant Terminology Definition
    function showTermDefinition(termKey) {
        var box = document.getElementById('cs-term-def-box');
        var title = document.getElementById('cs-term-title');
        var body = document.getElementById('cs-term-body');
        if (!box || !title || !body) return;

        var def = CS_GLOSSARY[termKey] || 'Definition not found.';
        title.textContent = termKey;
        body.textContent = def;
        box.classList.add('open');

        // Update active chip styling
        document.querySelectorAll('.cs-term-chip').forEach(function (chip) {
            var match = chip.textContent.trim().toLowerCase().indexOf(termKey.toLowerCase()) !== -1;
            chip.classList.toggle('active', match);
        });

        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    window.showTermDefinition = showTermDefinition;

    // 5. Seek Video in YouTube Iframe
    function seekVideo(seconds) {
        var iframe = document.getElementById('cs-youtube-player');
        if (!iframe) return;
        iframe.src = 'https://www.youtube-nocookie.com/embed/QT4Gkni0aJc?start=' + seconds + '&autoplay=1';
        iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    window.seekVideo = seekVideo;

    // 6. Escape HTML Helper
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 7. Toggle Mark Scheme Drawer
    function toggleMarkScheme(btn) {
        if (!btn) return;
        var card = btn.closest('.cs-q-card');
        if (!card) return;
        var drawer = card.querySelector('.cs-ms-drawer');
        if (!drawer) return;

        var isOpen = drawer.classList.toggle('open');
        var label = btn.querySelector('span');
        if (label) {
            label.textContent = isOpen ? 'Hide Mark Scheme' : 'Reveal Mark Scheme';
        }
    }
    window.toggleMarkScheme = toggleMarkScheme;

    // 8. Render Dynamic Questions
    function renderCaseStudyQuestions(csQuestions) {
        var container = document.getElementById('cs-dynamic-questions-container');
        if (!container) return;

        if (!csQuestions || csQuestions.length === 0) {
            container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted);">No 2027 Case Study questions found in database.</div>';
            return;
        }

        var html = '';
        csQuestions.forEach(function (q, idx) {
            var isHL = q.level === 'HL';
            var badgeLevelClass = isHL ? 'badge-hl' : 'badge-sl';
            var cardId = 'cs-card-' + idx;

            var markPointsHtml = '';
            if (Array.isArray(q.markScheme)) {
                markPointsHtml = '<ul class="cs-ms-list">' + q.markScheme.map(function (m) {
                    return '<li>' + escapeHtml(m.point) + (m.marks ? ' <strong>[' + m.marks + ' Mark' + (m.marks > 1 ? 's' : '') + ']</strong>' : '') + '</li>';
                }).join('') + '</ul>';
            }

            var tipHtml = q.examinerTip ? '<div class="cs-tip-box"><strong>Examiner Tip:</strong> ' + escapeHtml(q.examinerTip) + '</div>' : '';

            html += '<div class="cs-q-card" id="' + cardId + '">' +
                '<div class="cs-q-header">' +
                    '<div class="cs-q-badges">' +
                        '<span class="cs-badge ' + badgeLevelClass + '">' + escapeHtml(q.level) + '</span>' +
                        '<span class="cs-badge">' + escapeHtml(q.subtopicName || 'Paper 1 Section B') + '</span>' +
                        '<span class="cs-badge">' + escapeHtml(q.difficulty || 'Medium') + '</span>' +
                    '</div>' +
                    '<div class="cs-q-marks">' + escapeHtml(q.marks + ' Marks') + '</div>' +
                '</div>' +
                '<div class="cs-q-prompt">' + escapeHtml(q.prompt) + '</div>' +
                '<div class="cs-q-actions">' +
                    '<button type="button" class="cs-btn-action cs-btn-secondary" onclick="window.toggleMarkScheme(this)">' +
                        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>' +
                        '<span>Reveal Mark Scheme</span>' +
                    '</button>' +
                    '<a href="practice.html?topic=CS&id=' + encodeURIComponent(q.id) + '" class="cs-btn-action cs-btn-secondary" style="font-size: 0.82rem;">' +
                        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' +
                        '<span>Practice in Simulator</span>' +
                    '</a>' +
                '</div>' +
                '<div class="cs-ms-drawer">' +
                    '<div class="cs-ms-title">' +
                        '<span>Official IB Mark Scheme &bull; ' + escapeHtml(q.marks + ' Marks Total') + '</span>' +
                        '<span style="font-size: 0.78rem; color: var(--accent);">' + escapeHtml(q.id) + '</span>' +
                    '</div>' +
                    markPointsHtml +
                    tipHtml +
                '</div>' +
            '</div>';
        });

        container.innerHTML = html;
    }

    // 9. Load Questions from questions.json with Embedded Fallback
    function loadCaseStudyQuestions() {
        fetch('../data/questions.json')
            .then(function (res) {
                if (!res.ok) throw new Error('Status ' + res.status);
                return res.json();
            })
            .then(function (questions) {
                var csQuestions = questions.filter(function (q) {
                    return q.unit === 'CS' || (q.theme === 'CaseStudy' && q.id.indexOf('cs-2027') !== -1);
                });
                renderCaseStudyQuestions(csQuestions);
            })
            .catch(function (err) {
                console.warn('Live fetch failed. Using embedded questions fallback.');
                if (window.EMBEDDED_CS_QUESTIONS) {
                    renderCaseStudyQuestions(window.EMBEDDED_CS_QUESTIONS);
                }
            });
    }

    // 10. Initialization
    function init() {
        // Bind tab buttons
        document.querySelectorAll('.rv-tab-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var t = this.getAttribute('data-tab');
                if (t) switchCaseStudyTab(t);
            });
        });

        // Hash detection
        var hash = window.location.hash.replace('#', '');
        if (hash && (hash === 'overview' || hash === 'models' || hash === 'media' || hash === 'practice')) {
            switchCaseStudyTab(hash);
        }

        // Load dynamic questions
        loadCaseStudyQuestions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
