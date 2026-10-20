/**
 * UI & Navigation Engine for Computer Science Academy
 * Zen Atelier Design System • Soft Slate & Lilac Edition
 * Replicated Google Site Tabs & Zero Emojis
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
});

function initNavigation() {
    const isSubPage = window.location.pathname.includes('/pages/');
    const pathPrefix = isSubPage ? '../' : '';
    const pagePrefix = isSubPage ? '' : 'pages/';

    const currentPath = window.location.pathname;

    const isActive = (target) => {
        if (target === 'index.html' && (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '')) return 'active';
        return currentPath.includes(target) ? 'active' : '';
    };

    const headerHTML = `
        <nav>
            <a href="${pathPrefix}index.html" class="logo">
                <span class="brand-dot"></span>
                <span>Computer Science</span>
            </a>
            <div class="mobile-toggle" id="mobile-toggle" aria-label="Toggle navigation menu">
                <span></span><span></span><span></span>
            </div>
            <ul class="nav-links" id="nav-links">
                <li><a href="${pathPrefix}index.html" class="${isActive('index.html')}">Homepage</a></li>
                <li><a href="${pagePrefix}courses.html" class="${isActive('courses.html')}">Courses</a></li>
                <li><a href="${pagePrefix}practice.html" class="${isActive('practice.html')}">Practice Questions</a></li>
                <li><a href="${pagePrefix}curriculum.html" class="${isActive('curriculum.html')}">Curriculum</a></li>
                <li><a href="${pagePrefix}theme-a.html" class="${isActive('theme-a.html')}">Theme A</a></li>
                <li><a href="${pagePrefix}theme-b.html" class="${isActive('theme-b.html')}">Theme B</a></li>
                <li><a href="${pagePrefix}ia.html" class="${isActive('ia.html')}">IA</a></li>
                <li><a href="${pagePrefix}case-study.html" class="${isActive('case-study.html')}">Case Study</a></li>
                <li><a href="${pagePrefix}resources.html" class="${isActive('resources.html')}">Resources</a></li>
                <li><a href="${pagePrefix}about-us.html" class="${isActive('about-us.html')}">About Us</a></li>
            </ul>
        </nav>
    `;

    const footerHTML = `
        <div class="footer-container">
            <div class="footer-info">
                <div class="footer-contact">
                    <h3>Speaking Requests & Inquiries</h3>
                    <p><strong>Neha Siddiqui</strong></p>
                    <p><a href="mailto:Siddiquin@eischools.ae">Siddiquin@eischools.ae</a></p>
                </div>
                <div class="footer-ambassadors">
                    <h3>Department Ambassadors</h3>
                    <p>Tech Ambassador: <strong>Anish Dongarkar</strong></p>
                    <p><a href="mailto:anishdongarkar@gmail.com" style="opacity: 0.85; font-size: 0.85rem;">anishdongarkar@gmail.com</a></p>
                    <p style="margin-top: 10px;">AI Ambassador: <strong>Rudolph Babaren</strong></p>
                    <p><a href="mailto:rudolphmacrinebabaran@gmail.com" style="opacity: 0.85; font-size: 0.85rem;">rudolphmacrinebabaran@gmail.com</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <span class="footer-logo">COMPUTER SCIENCE • IB DP WORLD SCHOOL</span>
                <div class="footer-nav">
                    <a href="${pathPrefix}index.html">Homepage</a>
                    <a href="${pagePrefix}courses.html">Courses</a>
                    <a href="${pagePrefix}practice.html">Practice Questions</a>
                    <a href="${pagePrefix}curriculum.html">Curriculum</a>
                    <a href="${pagePrefix}theme-a.html">Theme A</a>
                    <a href="${pagePrefix}theme-b.html">Theme B</a>
                    <a href="${pagePrefix}ia.html">IA</a>
                    <a href="${pagePrefix}case-study.html">Case Study</a>
                    <a href="${pagePrefix}resources.html">Resources</a>
                    <a href="${pagePrefix}about-us.html">About Us</a>
                </div>
                <p>&copy; 2026 Computer Science Department • Emirates International School.</p>
            </div>
        </div>
    `;

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (header) header.innerHTML = headerHTML;
    if (footer) footer.innerHTML = footerHTML;

    // Mobile Menu Toggle
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav-links');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}

function initScrollEffects() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
