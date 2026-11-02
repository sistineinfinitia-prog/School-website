/**
 * home-sync.js - Dynamic Live Sync for Revamped Homepage
 * Unified with DataService for offline-first caching, Firebase RTDB sync,
 * hero alert banner, dynamic QOTD, deadlines, and announcements.
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

// 0. Sync Hero Alert Banner from DataService Settings
function syncHeroBanner() {
    const heroSection = document.querySelector('.home-hero');
    if (!heroSection) return;

    let bannerEl = document.getElementById('home-hero-alert-banner');
    const settings = window.DataService ? window.DataService.getSettings() : null;
    const banner = settings ? settings.heroBanner : null;
    const isEnabled = window.DataService ? window.DataService.isFeatureEnabled('heroBanner') : false;

    if (!banner || !banner.enabled || !isEnabled) {
        if (bannerEl) bannerEl.remove();
        return;
    }

    if (!bannerEl) {
        bannerEl = document.createElement('div');
        bannerEl.id = 'home-hero-alert-banner';
        bannerEl.className = 'home-hero-banner';
        bannerEl.style.cssText = 'margin-bottom: 22px; display: inline-flex; align-items: center; gap: 10px; background: var(--surface-elevated); border: 1px solid var(--accent); padding: 8px 18px; border-radius: 9999px; font-size: 0.85rem; max-width: 100%; box-shadow: 0 4px 14px rgba(0,0,0,0.06); text-decoration: none; color: var(--text); flex-wrap: wrap; justify-content: center;';
        heroSection.insertBefore(bannerEl, heroSection.firstChild);
    } else {
        bannerEl.style.display = 'inline-flex';
    }

    const badge = banner.badge || 'Notice';
    const text = banner.text || '';
    const link = banner.link || 'pages/deadlines.html';
    const linkText = banner.linkText || 'Details &rarr;';

    bannerEl.innerHTML = `
        <span class="pill pill-accent" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em;">${escapeHtml(badge)}</span>
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:500px;">${escapeHtml(text)}</span>
        <a href="${escapeHtml(link)}" style="color:var(--accent); font-weight:600; text-decoration:none; margin-left:4px; white-space:nowrap;">${linkText}</a>
    `;
}

// 1. Sync Deadlines
async function syncDeadlines() {
    const listEl = document.getElementById('home-deadlines-list');

    try {
        let deadlines = [];
        if (window.DataService && typeof window.DataService.getDeadlines === 'function') {
            deadlines = window.DataService.getDeadlines();
        } else {
            const res = await fetch('data/deadlines.json', { cache: 'no-cache' });
            if (res.ok) deadlines = await res.json();
        }

        if (!Array.isArray(deadlines) || deadlines.length === 0) {
            if (listEl) {
                listEl.innerHTML = `
                    <li class="feed-empty-item" style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                        No upcoming deadlines scheduled.
                    </li>
                `;
            }
            return;
        }

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
            if (top3.length === 0) {
                listEl.innerHTML = `
                    <li class="feed-empty-item" style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                        No upcoming deadlines scheduled.
                    </li>
                `;
                return;
            }
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

                let subtitle = '';
                if (item.topics && item.topics.length > 0) {
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
        let posts = [];
        if (window.DataService && typeof window.DataService.getAnnouncements === 'function') {
            posts = window.DataService.getAnnouncements();
        } else {
            const res = await fetch('data/announcements.json', { cache: 'no-cache' });
            if (res.ok) posts = await res.json();
        }

        if (!Array.isArray(posts) || posts.length === 0) {
            listEl.innerHTML = `
                <li class="feed-empty-item" style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                    No active faculty announcements.
                </li>
            `;
            return;
        }

        // Support teacher-chosen 3 homepage announcements from settings
        const settings = window.DataService ? window.DataService.getSettings() : null;
        let chosenPosts = [];
        if (settings && Array.isArray(settings.featuredAnnouncements) && settings.featuredAnnouncements.length > 0) {
            settings.featuredAnnouncements.forEach(id => {
                const match = posts.find(p => String(p.id) === String(id));
                if (match && !chosenPosts.find(cp => String(cp.id) === String(match.id))) chosenPosts.push(match);
            });
        }
        if (chosenPosts.length === 0) {
            const flagged = posts.filter(p => p.featured || p.showOnHome);
            chosenPosts = flagged.length > 0 ? flagged.slice(0, 3) : posts.slice(0, 3);
        }
        if (chosenPosts.length < 3) {
            posts.forEach(p => {
                if (chosenPosts.length < 3 && !chosenPosts.find(cp => String(cp.id) === String(p.id))) {
                    chosenPosts.push(p);
                }
            });
        }
        const top3 = chosenPosts.slice(0, 3);
        if (top3.length === 0) {
            listEl.innerHTML = `
                <li class="feed-empty-item" style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                    No active faculty announcements.
                </li>
            `;
            return;
        }

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

    if (window.DataService && !window.DataService.isFeatureEnabled('qotd')) {
        qotdCard.style.display = 'none';
        return;
    } else {
        qotdCard.style.display = '';
    }

    try {
        let questions = [];
        if (window.DataService && typeof window.DataService.getQuestions === 'function') {
            questions = window.DataService.getQuestions();
        } else {
            const res = await fetch('data/questions.json', { cache: 'no-cache' });
            if (res.ok) questions = await res.json();
        }

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

// Initialize and bind reactive subscriptions

// 5. Dynamic Unread Badges for Deadlines & Resources
function syncUnreadBadges() {
    const deadlinesBadge = document.getElementById('badge-deadlines-unread');
    const resourcesBadge = document.getElementById('badge-resources-unread');

    // Deadlines & Announcements
    if (deadlinesBadge) {
        try {
            let deadlines = [];
            let announcements = [];
            if (window.DataService) {
                if (typeof window.DataService.getDeadlines === 'function') deadlines = window.DataService.getDeadlines() || [];
                if (typeof window.DataService.getAnnouncements === 'function') announcements = window.DataService.getAnnouncements() || [];
            }
            const allItems = [...deadlines, ...announcements];
            const allIds = allItems.map(item => item.id).filter(Boolean);

            const seenRaw = localStorage.getItem('eis_seen_deadlines_ids');
            if (seenRaw === null) {
                const unreadCount = Math.min(3, allIds.length);
                deadlinesBadge.textContent = String(unreadCount).padStart(2, '0');
                deadlinesBadge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
            } else {
                const seenIds = JSON.parse(seenRaw || '[]');
                const unreadItems = allIds.filter(id => !seenIds.includes(id));
                const unreadCount = unreadItems.length;
                if (unreadCount > 0) {
                    deadlinesBadge.textContent = String(unreadCount).padStart(2, '0');
                    deadlinesBadge.style.display = 'inline-flex';
                } else {
                    deadlinesBadge.style.display = 'none';
                }
            }
        } catch (e) {
            deadlinesBadge.style.display = 'none';
        }
    }

    // Teacher Drops & Updates (Resources)
    if (resourcesBadge) {
        try {
            let drops = [];
            if (window.DataService && typeof window.DataService.getTeacherResources === 'function') {
                drops = window.DataService.getTeacherResources() || [];
            }
            const dropIds = drops.map(d => d.id).filter(Boolean);

            const seenRaw = localStorage.getItem('eis_seen_resources_ids');
            if (seenRaw === null) {
                const unreadCount = Math.min(2, dropIds.length);
                resourcesBadge.textContent = String(unreadCount).padStart(2, '0');
                resourcesBadge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
            } else {
                const seenIds = JSON.parse(seenRaw || '[]');
                const unreadItems = dropIds.filter(id => !seenIds.includes(id));
                const unreadCount = unreadItems.length;
                if (unreadCount > 0) {
                    resourcesBadge.textContent = String(unreadCount).padStart(2, '0');
                    resourcesBadge.style.display = 'inline-flex';
                } else {
                    resourcesBadge.style.display = 'none';
                }
            }
        } catch (e) {
            resourcesBadge.style.display = 'none';
        }
    }
}

// 6. Sync Teacher Resources & Coursework Drops
let currentThemeFilter = 'all';

async function syncTeacherResources() {
    const gridEl = document.getElementById('home-teacher-resources-grid');
    if (!gridEl) return;

    try {
        let drops = [];
        if (window.DataService && typeof window.DataService.getTeacherResources === 'function') {
            drops = window.DataService.getTeacherResources();
        } else {
            const res = await fetch('data/teacher-resources.json', { cache: 'no-cache' });
            if (res.ok) drops = await res.json();
        }

        if (!Array.isArray(drops) || drops.length === 0) {
            gridEl.innerHTML = '<p class="empty" style="grid-column: 1 / -1; padding: 24px; text-align: center; color: var(--text-2);">No coursework drops published yet.</p>';
            return;
        }

        // Filter by theme if active
        let filtered = drops;
        if (currentThemeFilter !== 'all') {
            filtered = drops.filter(d => (d.theme || '').toLowerCase() === currentThemeFilter.toLowerCase());
        }

        // Show top 6
        const topDrops = filtered.slice(0, 6);

        gridEl.innerHTML = topDrops.map(drop => {
            const dateStr = drop.date ? formatEventDate(drop.date).full : '';
            const unit = drop.unit || (drop.theme === 'Theme A' ? 'A1' : drop.theme === 'Theme B' ? 'B1' : drop.theme || 'CORE');
            const format = (drop.fileType || 'FILE').toUpperCase();
            const level = drop.level || (drop.cohort ? drop.cohort.split('(')[0].trim() : 'SL/HL');
            const fileUrl = drop.fileUrl || '#';
            const isOpenInBrowser = /\.(pdf|html?)$/i.test(fileUrl) || /^https?:\/\//i.test(fileUrl);
            const isManagebac = drop.managebacType || drop.managebacUrl || /managebac/i.test(fileUrl);

            return `
                <article class="home-res-card" data-id="${escapeHtml(drop.id)}">
                    <div class="home-res-card-top">
                        <div class="home-res-meta">
                            <div class="home-res-meta-left">
                                <span class="home-res-unit-badge">${escapeHtml(unit)}</span>
                                <span class="home-res-format-badge">${escapeHtml(format)}</span>
                                ${isManagebac ? `<span class="home-res-mb-badge"><svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="8" cy="8" r="6"></circle><path d="M5 8h6M8 5v6"></path></svg>ManageBac</span>` : ''}
                            </div>
                            <span class="home-res-date">${escapeHtml(dateStr)}</span>
                        </div>
                        <a class="home-res-title" href="pages/resources.html#drop-${encodeURIComponent(drop.id)}" title="${escapeHtml(drop.title)}">
                            ${escapeHtml(drop.title)}
                        </a>
                        ${drop.description ? `<p class="home-res-sub">${escapeHtml(drop.description)}</p>` : ''}
                    </div>
                    <div class="home-res-footer">
                        <span class="cohort-chip">${escapeHtml(level)}</span>
                        <div class="home-res-actions">
                            <a class="btn-home-quick btn-home-primary" href="${escapeHtml(fileUrl)}" ${isOpenInBrowser ? 'target="_blank" rel="noopener"' : 'download'}>${isOpenInBrowser ? 'Open' : 'Download'}</a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // Bind filter pill clicks if not yet bound
        const filterContainer = document.querySelector('.home-res-filters');
        if (filterContainer && !filterContainer._bound) {
            filterContainer._bound = true;
            filterContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.home-res-filter');
                if (!btn) return;
                filterContainer.querySelectorAll('.home-res-filter').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                currentThemeFilter = btn.dataset.theme;
                syncTeacherResources();
            });
        }

    } catch (e) {
        console.debug('Teacher resources live sync fallback:', e);
    }
}

function initHome() {
    syncHeroBanner();
    syncDeadlines();
    syncAnnouncements();
    syncTeacherResources();
    syncQuestionOfTheDay();
    syncUnreadBadges();

    if (window.DataService && typeof window.DataService.subscribe === 'function') {
        window.DataService.subscribe('announcements', () => { syncAnnouncements(); syncUnreadBadges(); });
        window.DataService.subscribe('deadlines', () => { syncDeadlines(); syncUnreadBadges(); });
        window.DataService.subscribe('teacherResources', () => { syncTeacherResources(); syncUnreadBadges(); });
        window.DataService.onSettingsChange(() => {
            syncHeroBanner();
            syncQuestionOfTheDay();
            syncAnnouncements();
        });
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
} else {
    initHome();
}
