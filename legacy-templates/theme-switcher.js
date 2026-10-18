/**
 * Highwood CS Studio - Dynamic Theme & Template Switcher
 * Injects a floating control dock for live testing of 5 color schemes across 10 templates.
 */

(function () {
    const THEMES = [
        { id: 'stealth', name: 'Stealth Onyx', hex: '#070709', accent: '#2997ff', isDark: true },
        { id: 'crimson', name: 'Highwood Crimson', hex: '#ffffff', accent: '#800000', isDark: false },
        { id: 'cyber', name: 'Cyber Matrix', hex: '#050807', accent: '#00ff88', isDark: true },
        { id: 'slate', name: 'Nordic Slate', hex: '#0b1120', accent: '#38bdf8', isDark: true },
        { id: 'paper', name: 'Clean Paper', hex: '#fbfbfd', accent: '#0066cc', isDark: false }
    ];

    const TEMPLATES = [
        { id: 't1-apple-editorial.html', name: '01. Apple Keynote', vibe: 'Minimalist Cinematic' },
        { id: 't2-linear-sleek.html', name: '02. Linear Sleek', vibe: 'Dark Micro-UI' },
        { id: 't3-swiss-monolith.html', name: '03. Vercel Monolith', vibe: 'Swiss Precision' },
        { id: 't4-stripe-ambient.html', name: '04. Stripe Ambient', vibe: 'Mesh Glow Flow' },
        { id: 't5-academic-editorial.html', name: '05. Cambridge Lab', vibe: 'Editorial Serif' },
        { id: 't6-terminal-ide.html', name: '06. Hacker Terminal', vibe: 'VS Code / IDE' },
        { id: 't7-bento-studio.html', name: '07. Bento Studio', vibe: 'Modular Widgets' },
        { id: 't8-neo-brutalist.html', name: '08. Neo-Brutalist', vibe: 'Bold High-Contrast' },
        { id: 't9-cyber-hud.html', name: '09. Cyber HUD', vibe: 'Futuristic Glass' },
        { id: 't10-zen-atelier.html', name: '10. Zen Atelier', vibe: 'Calm Focus Docs' }
    ];

    // Load saved theme or default to stealth (dark apple)
    const savedTheme = localStorage.getItem('highwood_cs_theme') || 'stealth';
    document.documentElement.setAttribute('data-theme', savedTheme);

    function createSwitcherUI() {
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';

        const wrapper = document.createElement('aside');
        wrapper.id = 'studio-switcher';
        wrapper.setAttribute('aria-label', 'Design Studio Controls');

        wrapper.innerHTML = `
            <style>
                #studio-switcher {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
                }
                .studio-toggle-btn {
                    background: #111115;
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 999px;
                    padding: 10px 18px;
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    cursor: pointer;
                    backdrop-filter: blur(12px);
                    transition: transform 0.2s, background-color 0.2s;
                }
                .studio-toggle-btn:hover {
                    transform: translateY(-2px);
                    background: #1c1c24;
                }
                .studio-panel {
                    display: none;
                    position: absolute;
                    bottom: calc(100% + 12px);
                    right: 0;
                    width: 320px;
                    background: rgba(18, 19, 24, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 20px;
                    padding: 18px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(20px);
                    color: #f0f0f5;
                    animation: studioFadeIn 0.2s ease-out forwards;
                }
                @keyframes studioFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .studio-panel.active {
                    display: block;
                }
                .studio-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 14px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }
                .studio-title {
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    color: #8e8e93;
                }
                .studio-close {
                    color: #8e8e93;
                    font-size: 16px;
                    cursor: pointer;
                }
                .studio-section-label {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #636366;
                    margin: 12px 0 8px;
                }
                .palette-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 8px;
                }
                .palette-btn {
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: transform 0.15s, border-color 0.15s;
                }
                .palette-btn:hover {
                    transform: scale(1.06);
                }
                .palette-btn.active {
                    border-color: #fff;
                    box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
                }
                .palette-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }
                .template-select {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 10px;
                    color: #fff;
                    padding: 10px 12px;
                    font-size: 13px;
                    font-weight: 500;
                    outline: none;
                    cursor: pointer;
                    margin-bottom: 12px;
                }
                .template-select option {
                    background: #18181b;
                    color: #fff;
                }
                .studio-footer-links {
                    display: flex;
                    gap: 8px;
                    margin-top: 14px;
                    padding-top: 12px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }
                .studio-hub-link {
                    flex: 1;
                    text-align: center;
                    background: rgba(255, 255, 255, 0.08);
                    color: #fff;
                    padding: 8px 10px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: background 0.2s;
                }
                .studio-hub-link:hover {
                    background: rgba(255, 255, 255, 0.15);
                }
            </style>

            <button class="studio-toggle-btn" id="studio-btn" title="Open Studio Controls">
                <span style="font-size: 16px;">⚡</span>
                <span id="studio-btn-text">Studio Palette</span>
            </button>

            <div class="studio-panel" id="studio-panel">
                <div class="studio-header">
                    <span class="studio-title">Palette & Template Lab</span>
                    <button class="studio-close" id="studio-close-btn">&times;</button>
                </div>

                <div class="studio-section-label">1. Switch Active Template</div>
                <select class="template-select" id="template-dropdown">
                    ${TEMPLATES.map(t => `
                        <option value="${t.id}" ${currentFile === t.id ? 'selected' : ''}>
                            ${t.name} (${t.vibe})
                        </option>
                    `).join('')}
                </select>

                <div class="studio-section-label">2. Test 5 Live Color Palettes</div>
                <div class="palette-grid">
                    ${THEMES.map(theme => `
                        <button class="palette-btn ${savedTheme === theme.id ? 'active' : ''}" 
                                data-theme-id="${theme.id}"
                                title="${theme.name}"
                                style="background: ${theme.hex}; border-color: ${theme.id === 'crimson' ? '#800000' : 'rgba(255,255,255,0.1)'};">
                            <span class="palette-dot" style="background: ${theme.accent};"></span>
                        </button>
                    `).join('')}
                </div>
                <div id="palette-label" style="text-align: center; font-size: 11px; margin-top: 8px; color: #a1a1aa;">
                    Active: <strong style="color:#fff;">${THEMES.find(t => t.id === savedTheme)?.name || 'Stealth Onyx'}</strong>
                </div>

                <div class="studio-footer-links">
                    <a href="index.html" class="studio-hub-link">← Master Gallery</a>
                </div>
            </div>
        `;

        document.body.appendChild(wrapper);

        // Events
        const btn = document.getElementById('studio-btn');
        const panel = document.getElementById('studio-panel');
        const closeBtn = document.getElementById('studio-close-btn');
        const dropdown = document.getElementById('template-dropdown');
        const paletteLabel = document.getElementById('palette-label');

        btn.addEventListener('click', () => panel.classList.toggle('active'));
        closeBtn.addEventListener('click', () => panel.classList.remove('active'));

        dropdown.addEventListener('change', (e) => {
            if (e.target.value !== currentFile) {
                window.location.href = e.target.value;
            }
        });

        const paletteBtns = wrapper.querySelectorAll('.palette-btn');
        paletteBtns.forEach(pBtn => {
            pBtn.addEventListener('click', () => {
                const themeId = pBtn.getAttribute('data-theme-id');
                document.documentElement.setAttribute('data-theme', themeId);
                localStorage.setItem('highwood_cs_theme', themeId);

                paletteBtns.forEach(b => b.classList.remove('active'));
                pBtn.classList.add('active');

                const currentTheme = THEMES.find(t => t.id === themeId);
                paletteLabel.innerHTML = `Active: <strong style="color:#fff;">${currentTheme.name}</strong>`;
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSwitcherUI);
    } else {
        createSwitcherUI();
    }
})();
