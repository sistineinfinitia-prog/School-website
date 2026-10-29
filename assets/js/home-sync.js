/**
 * home-sync.js - Dynamic Live Sync for Revamped Homepage
 * Syncs deadlines, announcements, hero countdown capsule, and question of the day.
 * Clean, uncluttered, and strictly aligned with the Zen Atelier design system.
 */

// Format date into human-readable British format
function formatEventDate(dateStr) {
    if (!dateStr) return { day: '', mon: '', full: '' };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: '', mon: '', full: dateStr };
    const day = String(d.getDate()).padStart(2, '0');
    const mon = d.toLocaleDateString('en-GB', { month: 'short' });
    const full = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return { day, mon, full };
}

// Calculate days remaining
function getDaysRemaining(dateStr) {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return null;
    
    // Normalize to start of day
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    
    const diffTime = targetDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 1. Sync Deadlines
async function syncDeadlines() {
    const listEl = document.getElementById('home-deadlines-list');

    try {
        const res = await fetch('data/deadlines.json', { cache: 'no-cache' });
        if (!res.ok) return;
        const deadlines = await res.json();
        if (!Array.isArray(deadlines) || deadlines.length === 0) return;

        // Sort by date ascending
        const sorted = [...deadlines].sort((a, b) => new Date(a.date) - new Date(b.date));

        // Find next upcoming
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingList = sorted.filter(item => {
            const d = new Date(item.date);
            return isNaN(d.getTime()) || d >= today;
        });

        const activeList = upcomingList.length > 0 ? upcomingList : sorted;

        // Render Top 3 Deadlines
        if (listEl) {
            const top3 = activeList.slice(0, 3);
            const html = top3.map(item => {
                const { day, mon } = formatEventDate(item.date);
                const daysLeft = getDaysRemaining(item.date);

                let catClass = 'cat-other';
                let catLabel = item.typeName || 'Milestone';
                const lowerType = (item.type || '').toLowerCase();
                if (lowerType.includes('exam')) {
                    catClass = 'cat-exam';
                } else if (lowerType.includes('ia')) {
                    catClass = 'cat-ia';
                } else if (lowerType.includes('project')) {
                    catClass = 'cat-project';
                }

                let cohortStr = '';
                if (item.cohort) {
                    if (item.cohort.includes('Year 1') || item.cohort.includes('DP1')) cohortStr = 'Y12';
                    else if (item.cohort.includes('Year 2') || item.cohort.includes('DP2')) cohortStr = 'Y13';
                    else cohortStr = item.cohort.split('(')[0].trim();
                }

                let countdownHtml = '';
                if (daysLeft !== null) {
                    const isUrgent = daysLeft >= 0 && daysLeft <= 7;
                    let text = daysLeft === 0 ? 'Due Today' : daysLeft === 1 ? 'Tomorrow' : daysLeft > 0 ? `in ${daysLeft} days` : 'Past';
                    countdownHtml = `<span class="countdown-badge ${isUrgent ? 'is-urgent' : ''}">${text}</span>`;
                }

                // Clean, non-cluttered concise subtitle (max 1-2 key topics or short description)
                let subtitle = '';
                if (item.topics && item.topics.length > 0) {
                    // Just take top 2 topics max
                    subtitle = item.topics.slice(0, 2).map(t => {
                        const name = (t.name || t.code || '').split('(')[0].trim();
                        return name;
                    }).join(' · ');
                } else if (item.description) {
                    subtitle = item.description;
                }

                return `
                    <li>
                        <a class="dl-row" href="pages/deadlines.html#${encodeURIComponent(item.id)}">
                            <div class="dl-date-block">
                                <span class="dl-day">${day}</span>
                                <span class="dl-mon">${mon}</span>
                            </div>
                            <div class="dl-body">
                                <span class="dl-title">${escapeHtml(item.title)}</span>
                                ${subtitle ? `<span class="dl-sub">${escapeHtml(subtitle)}</span>` : ''}
                                <div class="dl-tags">
                                    <span class="cat-badge ${catClass}">${escapeHtml(catLabel)}</span>
                                    ${cohortStr ? `<span class="cohort-chip">${escapeHtml(cohortStr)}</span>` : ''}
                                    ${item.weight ? `<span class="cohort-chip">${escapeHtml(item.weight)}</span>` : ''}
                                </div>
                            </div>
                            <div class="dl-meta-right">
                                ${countdownHtml}
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="next-up-arrow" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </div>
                        </a>
                    </li>
                `;
            }).join('');

            listEl.innerHTML = html;
        }
    } catch (e) {
        console.debug('Deadlines live sync fallback:', e);
    }
}

// 2. Sync Announcements
async function syncAnnouncements() {
    const listEl = document.getElementById('home-announcements-list');
    if (!listEl) return;

    try {
        const res = await fetch('data/announcements.json', { cache: 'no-cache' });
        if (!res.ok) return;
        const posts = await res.json();
        if (!Array.isArray(posts) || posts.length === 0) return;

        const top3 = posts.slice(0, 3);

        const html = top3.map(post => {
            const { day, mon } = formatEventDate(post.date);
            const category = post.category || 'Faculty Notice';
            
            let linkUrl = 'pages/deadlines.html?tab=announcements';
            let targetAttr = '';
            if (post.driveLink) {
                if (/^https?:\/\//i.test(post.driveLink)) {
                    linkUrl = post.driveLink;
                    targetAttr = ' target="_blank" rel="noopener"';
                } else {
                    var cleanPath = post.driveLink.replace(/^pages\//, '').replace(/^\.?\//, '');
                    linkUrl = 'pages/' + cleanPath;
                }
            }

            return `
                <li>
                    <a class="an-row" href="${escapeHtml(linkUrl)}"${targetAttr}>
                        <div class="an-meta-bar">
                            <span class="an-date">${day} ${mon}</span>
                            <span class="cat-badge cat-notice">${escapeHtml(category)}</span>
                        </div>
                        <span class="an-title">${escapeHtml(post.title)}</span>
                        ${post.description ? `<span class="an-snippet">${escapeHtml(post.description)}</span>` : ''}
                    </a>
                </li>
            `;
        }).join('');

        listEl.innerHTML = html;
    } catch (e) {
        console.debug('Announcements live sync fallback:', e);
    }
}

// 3. Sync Question of the Day from questions.json
async function syncQuestionOfTheDay() {
    const qotdCard = document.getElementById('qotd-card');
    if (!qotdCard) return;

    try {
        const res = await fetch('data/questions.json', { cache: 'no-cache' });
        if (!res.ok) return;
        const questions = await res.json();
        if (!Array.isArray(questions) || questions.length === 0) return;

        // Pick question based on day of year for daily rotation
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const qIndex = dayOfYear % questions.length;
        const q = questions[qIndex] || questions[0];

        // Fill elements
        const originEl = document.getElementById('qotd-origin');
        const topicEl = document.getElementById('qotd-topic');
        const promptEl = document.getElementById('qotd-prompt');
        const tagsEl = document.getElementById('qotd-tags');
        const schemeEl = document.getElementById('qotd-scheme-content');

        if (originEl) originEl.textContent = `${q.origin || 'Specimen Paper'} · ${q.level || 'SL/HL'}`;
        if (topicEl) {
            topicEl.textContent = `${q.unit || 'A1'}: ${q.unitName || 'Core Topic'}`;
            topicEl.href = `pages/practice.html?topic=${encodeURIComponent((q.unit || 'a1').toLowerCase())}`;
        }
        if (promptEl) promptEl.textContent = q.prompt;

        if (tagsEl) {
            const diffClass = q.difficulty === 'Easy' ? 'diff-easy' : q.difficulty === 'Hard' ? 'diff-hard' : 'diff-medium';
            tagsEl.innerHTML = `
                ${q.format ? `<span class="rv-tag">${escapeHtml(q.format)}</span>` : ''}
                ${q.subtopicCode ? `<span class="rv-tag rv-tag-subtopic">${escapeHtml(q.subtopicCode)}</span>` : ''}
                <span class="rv-tag"><span class="diff-dot ${diffClass}"></span>${escapeHtml(q.difficulty || 'Medium')}</span>
                <span class="rv-tag rv-tag-marks">${q.marks} Mark${q.marks === 1 ? '' : 's'}</span>
            `;
        }

        if (schemeEl && Array.isArray(q.markScheme)) {
            const listHtml = q.markScheme.map(pt => `
                <li><strong>Point:</strong> ${escapeHtml(pt.point || '')} <span class="rv-tag rv-tag-marks" style="margin-left:6px;">[${pt.marks || 1} mark]</span></li>
            `).join('');

            schemeEl.innerHTML = `
                <div class="mark-scheme-box-head">Official Examiner Mark Scheme [Max ${q.marks} Marks]</div>
                <ul>${listHtml}</ul>
                ${q.examinerTip ? `<div class="mark-scheme-tip"><strong>Examiner Tip:</strong> ${escapeHtml(q.examinerTip)}</div>` : ''}
            `;
        }
    } catch (e) {
        console.debug('Question of the day live sync fallback:', e);
    }
}

// 4. Question Mark Scheme Toggle Function (QOTD Card)
window.toggleMarkScheme = function (button) {
    if (!button) return;
    const card = button.closest('.qotd-card') || button.parentElement;
    if (!card) return;
    const scheme = card.querySelector('.mark-scheme-box');
    if (!scheme) return;

    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
        scheme.classList.remove('open');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
            <span>Show Mark Scheme</span>
        `;
    } else {
        scheme.classList.add('open');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>
            <span>Hide Mark Scheme</span>
        `;
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        syncDeadlines();
        syncAnnouncements();
        syncQuestionOfTheDay();
    });
} else {
    syncDeadlines();
    syncAnnouncements();
    syncQuestionOfTheDay();
}
