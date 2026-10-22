/**
 * Highwood Computer Science: Department Notices Feed
 * Combines live announcements from Firebase Realtime Database ('posts')
 * with the repository's curated data/announcements.json fallback.
 */
import { db, ref } from '../../js/config.js';
import { onValue } from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js';

const listEl = document.querySelector('[data-notices-list]');

function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function createNoticeItem(post, isLive) {
    const li = document.createElement('li');
    li.className = 'notice';

    const time = document.createElement('time');
    time.className = 'notice-date';
    if (post.date) time.setAttribute('datetime', post.date);
    time.textContent = formatDate(post.date);

    const body = document.createElement('div');

    const title = document.createElement('h3');
    title.className = 'notice-title';
    title.textContent = post.title || 'Department Notice';

    if (post.category || isLive) {
        const badge = document.createElement('span');
        badge.className = 'tag notice-new';
        badge.textContent = post.category || 'Live Update';
        title.appendChild(badge);
    }

    const text = document.createElement('p');
    text.className = 'notice-text';
    text.textContent = post.description || post.content || '';

    body.appendChild(title);
    body.appendChild(text);

    if (post.driveLink) {
        const wrap = document.createElement('div');
        wrap.className = 'notice-link';
        const a = document.createElement('a');
        a.className = 'text-link';
        a.href = post.driveLink;
        if (/^https?:\/\//i.test(post.driveLink)) {
            a.target = '_blank';
            a.rel = 'noopener';
            a.innerHTML = 'Open attachment <span class="arrow" aria-hidden="true">→</span>';
        } else {
            a.innerHTML = 'Open resource <span class="arrow" aria-hidden="true">→</span>';
        }
        wrap.appendChild(a);
        body.appendChild(wrap);
    }

    li.appendChild(time);
    li.appendChild(body);
    return li;
}

async function loadFallback() {
    try {
        const res = await fetch('data/announcements.json', { cache: 'no-cache' });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

async function initNotices() {
    if (!listEl) return;
    const fallback = await loadFallback();

    const renderAll = (livePosts = []) => {
        const combined = [...livePosts, ...fallback];
        if (!combined.length) return;
        listEl.textContent = '';
        combined.forEach((post, idx) => {
            listEl.appendChild(createNoticeItem(post, idx < livePosts.length));
        });
    };

    try {
        const postsRef = ref(db, 'posts');
        onValue(
            postsRef,
            (snapshot) => {
                const live = [];
                if (snapshot.exists()) {
                    snapshot.forEach((child) => {
                        live.push({ id: child.key, ...child.val() });
                    });
                    live.sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                renderAll(live);
            },
            () => {
                renderAll([]);
            }
        );
    } catch {
        renderAll([]);
    }
}

initNotices();
