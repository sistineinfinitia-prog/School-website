/**
 * UI Utilities for Highwood CS Website
 * Handles shared components (Header, Footer) and interactions (Mobile Menu, Scroll)
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
});

function initNavigation() {
    const isSubPage = window.location.pathname.includes('/pages/');
    const pathPrefix = isSubPage ? '../' : '';
    const pagePrefix = isSubPage ? '' : 'pages/';

    const headerHTML = `
        <nav>
            <a href="${pathPrefix}index.html" class="logo">CS DEPARTMENT</a>
            <div class="mobile-toggle" id="mobile-toggle">
                <span></span><span></span><span></span>
            </div>
            <ul class="nav-links" id="nav-links">
                <li><a href="${pathPrefix}index.html">Home</a></li>
                <li><a href="${pagePrefix}about-us.html">About Us</a></li>
                <li><a href="${pagePrefix}curriculum.html">Curriculum Syllabus</a></li>
                <li><a href="${pagePrefix}theme-a.html">Theme A</a></li>
                <li><a href="${pagePrefix}theme-b.html">Theme B</a></li>
                <li><a href="${pagePrefix}ia.html">IA</a></li>
                <li><a href="${pagePrefix}case-study.html">Case Study</a></li>
                <li><a href="${pagePrefix}admin.html" class="admin-link">Admin</a></li>
            </ul>
        </nav>
    `;

    const footerHTML = `
        <div class="footer-container">
            <div class="footer-info">
                <div class="footer-contact">
                    <h3>Speaking Requests</h3>
                    <p>Neha Siddiqui</p>
                    <p><a href="mailto:Siddiquin@eischools.ae">Siddiquin@eischools.ae</a></p>
                </div>
                <div class="footer-ambassadors">
                    <h3>Ambassadors</h3>
                    <p>Tech: Anish Dongarkar</p>
                    <p><a href="mailto:anishdongarkar@gmail.com" style="font-size: 0.8rem; opacity: 0.8;">anishdongarkar@gmail.com</a></p>
                    <p style="margin-top: 10px;">AI: Rudolph Babaren</p>
                    <p><a href="mailto:rudolphmacrinebabaran@gmail.com" style="font-size: 0.8rem; opacity: 0.8;">rudolphmacrinebabaran@gmail.com</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <span class="footer-logo">CS DEPARTMENT</span>
                <div class="footer-nav">
                    <a href="${pathPrefix}index.html">Home</a>
                    <a href="${pagePrefix}about-us.html">About Us</a>
                    <a href="${pagePrefix}curriculum.html">Curriculum Syllabus</a>
                    <a href="${pagePrefix}theme-a.html">Theme A</a>
                    <a href="${pagePrefix}theme-b.html">Theme B</a>
                    <a href="${pagePrefix}ia.html">IA</a>
                    <a href="${pagePrefix}case-study.html">Case Study</a>
                    <a href="${pagePrefix}admin.html">Admin</a>
                </div>
                <p>&copy; 2026 Computer Science Academy.</p>
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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
