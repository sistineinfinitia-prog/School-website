/**
 * Highwood CS Studio - Curated Edition Theme & Texture Controller
 * Handles 5 non-vibecoded palettes + live toggle for animated vs static background textures.
 */

(function () {
    const THEMES = [
        { id: 'monochrome', name: 'Pure Monochrome (B&W)', hex: '#050505', accent: '#ffffff', isDark: true },
        { id: 'crimson', name: 'Highwood Crimson', hex: '#ffffff', accent: '#800000', isDark: false },
        { id: 'matcha', name: 'Matcha Sage Pastel', hex: '#f5f6f2', accent: '#385542', isDark: false },
        { id: 'clay', name: 'Warm Sand & Clay', hex: '#f9f7f4', accent: '#944833', isDark: false },
        { id: 'lilac', name: 'Soft Slate & Lilac', hex: '#111218', accent: '#c4b5fd', isDark: true }
    ];

    const TEMPLATES = [
        { id: 't2-linear-sleek.html', name: '02. Linear Sleek', texture: 'Dot-Grid' },
        { id: 't3-swiss-monolith.html', name: '03. Swiss Monolith', texture: 'Hairline Grid' },
        { id: 't6-terminal-ide.html', name: '06. Fullscreen IDE', texture: 'CRT Scanline' },
        { id: 't10-zen-atelier.html', name: '10. Zen Atelier', texture: 'Ribbon Waves' },
        { id: 'background-lab.html', name: '🧪 Background Lab', texture: '8 Dynamic Engines' }
    ];

    // Load saved settings
    const savedTheme = localStorage.getItem('curated_cs_theme') || 'monochrome';
    const savedTexture = localStorage.getItem('curated_cs_texture') || 'animated';

    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-texture', savedTexture);

    function createSwitcherUI() {
        const path = window.location.pathname;
        const currentFile = path.split('/').pop() || 'index.html';
        const isRoot = !path.includes('curated-preview') && !path.includes('legacy-templates');
        const prefix = isRoot ? 'curated-preview/' : '';

        const wrapper = document.createElement('aside');
        wrapper.id = 'curated-switcher';
        wrapper.setAttribute('aria-label', 'Design Studio Controls');

        wrapper.innerHTML = `
            <style>
                #curated-switcher {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
                }
                .studio-toggle-btn {
                    background: #111114;
                    color: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-radius: 999px;
                    padding: 10px 18px;
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    cursor: pointer;
                    backdrop-filter: blur(14px);
                    transition: transform 0.2s, background-color 0.2s;
                }
                .studio-toggle-btn:hover {
                    transform: translateY(-2px);
                    background: #1c1c22;
                }
                .studio-panel {
                    display: none;
                    position: absolute;
                    bottom: calc(100% + 12px);
                    right: 0;
                    width: 320px;
                    background: rgba(18, 19, 24, 0.96);
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    border-radius: 20px;
                    padding: 18px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
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
                    color: #a1a1aa;
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
                    color: #71717a;
                    margin: 12px 0 8px;
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
                .texture-switch-wrap {
                    display: flex;
                    gap: 6px;
                    background: rgba(255, 255, 255, 0.06);
                    padding: 4px;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 4px;
                }
                .texture-mode-btn {
                    flex: 1;
                    padding: 8px 10px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #a1a1aa;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .texture-mode-btn.active {
                    background: #fff;
                    color: #050505;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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

            <button class="studio-toggle-btn" id="curated-btn" title="Open Studio Controls">
                <span style="font-size: 15px;">⚙️</span>
                <span id="curated-btn-text">Studio Palette</span>
            </button>

            <div class="studio-panel" id="curated-panel">
                <div class="studio-header">
                    <span class="studio-title">Curated Design Lab</span>
                    <button class="studio-close" id="curated-close-btn">&times;</button>
                </div>

                <div class="studio-section-label">1. Switch Candidate (Final 4)</div>
                <select class="template-select" id="curated-dropdown">
                    ${TEMPLATES.map(t => {
                        const targetUrl = prefix + t.id;
                        const isSelected = (currentFile === t.id) || (isRoot && t.id === 't10-zen-atelier.html');
                        return `
                            <option value="${targetUrl}" ${isSelected ? 'selected' : ''}>
                                ${t.name} (${t.texture})
                            </option>
                        `;
                    }).join('')}
                </select>

                <div class="studio-section-label">2. Non-Vibecoded Palettes</div>
                <div class="palette-grid">
                    ${THEMES.map(theme => `
                        <button class="palette-btn ${savedTheme === theme.id ? 'active' : ''}" 
                                data-theme-id="${theme.id}"
                                title="${theme.name}"
                                style="background: ${theme.hex}; border-color: ${theme.id === 'crimson' ? '#800000' : (theme.id === 'matcha' ? '#385542' : 'rgba(255,255,255,0.12)')};">
                            <span class="palette-dot" style="background: ${theme.accent};"></span>
                        </button>
                    `).join('')}
                </div>
                <div id="curated-palette-label" style="text-align: center; font-size: 11px; margin-top: 8px; color: #a1a1aa;">
                    Active: <strong style="color:#fff;">${THEMES.find(t => t.id === savedTheme)?.name || 'Pure Monochrome (B&W)'}</strong>
                </div>

                <div class="studio-section-label">3. Background Texture Variant</div>
                <div class="texture-switch-wrap">
                    <button class="texture-mode-btn ${savedTexture === 'animated' ? 'active' : ''}" id="btn-texture-anim">
                        ⚡ Animated Texture
                    </button>
                    <button class="texture-mode-btn ${savedTexture === 'static' ? 'active' : ''}" id="btn-texture-static">
                        ⏸ Pure Static
                    </button>
                </div>

                <div class="studio-footer-links">
                    <a href="${isRoot ? 'curated-preview/index.html' : 'index.html'}" class="studio-hub-link">← Curated Gallery</a>
                    <a href="${isRoot ? 'legacy-templates/index.html' : '../legacy-templates/index.html'}" class="studio-hub-link" style="opacity: 0.7;">Legacy (10)</a>
                </div>
            </div>
        `;

        document.body.appendChild(wrapper);

        // Events
        const btn = document.getElementById('curated-btn');
        const panel = document.getElementById('curated-panel');
        const closeBtn = document.getElementById('curated-close-btn');
        const dropdown = document.getElementById('curated-dropdown');
        const paletteLabel = document.getElementById('curated-palette-label');
        const btnAnim = document.getElementById('btn-texture-anim');
        const btnStatic = document.getElementById('btn-texture-static');

        btn.addEventListener('click', () => panel.classList.toggle('active'));
        closeBtn.addEventListener('click', () => panel.classList.remove('active'));

        dropdown.addEventListener('change', (e) => {
            if (e.target.value !== currentFile) {
                window.location.href = e.target.value;
            }
        });

        // Palette Buttons
        const paletteBtns = wrapper.querySelectorAll('.palette-btn');
        paletteBtns.forEach(pBtn => {
            pBtn.addEventListener('click', () => {
                const themeId = pBtn.getAttribute('data-theme-id');
                document.documentElement.setAttribute('data-theme', themeId);
                localStorage.setItem('curated_cs_theme', themeId);

                paletteBtns.forEach(b => b.classList.remove('active'));
                pBtn.classList.add('active');

                const currentTheme = THEMES.find(t => t.id === themeId);
                paletteLabel.innerHTML = `Active: <strong style="color:#fff;">${currentTheme.name}</strong>`;
            });
        });

        // Texture Mode Toggles
        btnAnim.addEventListener('click', () => {
            document.documentElement.setAttribute('data-texture', 'animated');
            localStorage.setItem('curated_cs_texture', 'animated');
            btnAnim.classList.add('active');
            btnStatic.classList.remove('active');
        });

        btnStatic.addEventListener('click', () => {
            document.documentElement.setAttribute('data-texture', 'static');
            localStorage.setItem('curated_cs_texture', 'static');
            btnStatic.classList.add('active');
            btnAnim.classList.remove('active');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSwitcherUI);
    } else {
        createSwitcherUI();
    }
})();
