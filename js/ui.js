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
                <li><a href="${pathPrefix}index.html">Courses</a></li>
                <li><a href="${pagePrefix}curriculum.html">Curriculum</a></li>
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
                    <p>AI: Rudolph Babaren</p>
                </div>
            </div>
            <div class="footer-bottom">
                <span class="footer-logo">CS DEPARTMENT</span>
                <div class="footer-nav">
                    <a href="${pathPrefix}index.html">Home</a>
                    <a href="${pagePrefix}curriculum.html">Curriculum</a>
                    <a href="${pagePrefix}ia.html">IA</a>
                    <a href="${pagePrefix}case-study.html">Case Study</a>
                    <a href="${pagePrefix}admin.html">Admin Login</a>
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
