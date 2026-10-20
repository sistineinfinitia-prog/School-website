/**
 * Zen Atelier - Luxury Undulating Ribbon Waves Engine
 * Soft Slate & Lilac Final Design System
 */

(function () {
    // Ensure document theme is Soft Slate & Lilac
    document.documentElement.setAttribute('data-theme', 'lilac');
    document.documentElement.setAttribute('data-texture', 'animated');

    // Create or locate the interactive background canvas
    let canvas = document.getElementById('interactive-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'interactive-canvas';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Smooth cursor interpolation coordinates
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let ribbonSmoothMouseX = width / 2;
    let ribbonSmoothMouseY = height / 2;
    let ribbonMouseActiveAlpha = 0;
    let isMouseActive = false;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        isMouseActive = true;
    });

    window.addEventListener('mouseleave', () => {
        isMouseActive = false;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Soft Slate & Lilac Palette Color Tokens
    function getLilacVeilColor(alpha) {
        return `rgba(196, 181, 253, ${alpha})`;
    }

    function getLilacHairlineColor(alpha) {
        return `rgba(221, 214, 254, ${alpha})`;
    }

    const RIBBON_COUNT = 16;

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Serene time progression
        const slowTime = performance.now() * 0.00055;

        // Velvety smooth mouse interpolation with laminar inertia
        mouseX += (targetMouseX - mouseX) * 0.12;
        mouseY += (targetMouseY - mouseY) * 0.12;
        const lerpFactor = 0.07;
        ribbonSmoothMouseX += (mouseX - ribbonSmoothMouseX) * lerpFactor;
        ribbonSmoothMouseY += (mouseY - ribbonSmoothMouseY) * lerpFactor;

        // Fade mouse presence in and out smoothly
        ribbonMouseActiveAlpha += ((isMouseActive ? 1 : 0) - ribbonMouseActiveAlpha) * 0.05;

        const spacing = height / (RIBBON_COUNT + 1);

        for (let i = 1; i <= RIBBON_COUNT; i++) {
            const baseY = i * spacing;
            const ribbonProgress = i / RIBBON_COUNT; // Depth factor (0.06 to 1.0)

            // Harmonic frequencies & speeds
            const waveFreq1 = 0.0018 + i * 0.00012;
            const waveFreq2 = 0.0034 + i * 0.00020;
            const waveSpeed1 = slowTime * (0.65 + i * 0.035);
            const waveSpeed2 = slowTime * (0.45 + i * 0.025);

            // Amplitude scales smoothly with depth
            const baseAmp1 = 14 + ribbonProgress * 16;
            const baseAmp2 = 7 + ribbonProgress * 9;

            const points = [];
            const step = 14;

            for (let x = 0; x <= width + step; x += step) {
                let y = baseY +
                    Math.sin(x * waveFreq1 + waveSpeed1) * baseAmp1 +
                    Math.cos(x * waveFreq2 - waveSpeed2) * baseAmp2;

                // Continuous laminar stream parting around cursor
                if (ribbonMouseActiveAlpha > 0.01) {
                    const dx = x - ribbonSmoothMouseX;
                    const dy = baseY - ribbonSmoothMouseY;
                    const rx = 240;
                    const ry = 150;
                    const distNorm = Math.hypot(dx / rx, dy / ry);

                    if (distNorm < 1.0) {
                        const ease = (1 - distNorm) * (1 - distNorm) * (3 - 2 * (1 - distNorm));
                        const pushY = (dy / (Math.abs(dy) + 26)) * ease * 42 * ribbonMouseActiveAlpha;
                        y += pushY;
                    }
                }

                points.push({ x, y });
            }

            if (points.length < 2) continue;

            // Draw Volumetric Silk Ribbon Layer (Translucent Lilac Gradient Veil)
            const veilHeight = spacing * 1.5;
            const fillAlpha = 0.016 + ribbonProgress * 0.036;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (let j = 0; j < points.length - 1; j++) {
                const xc = (points[j].x + points[j + 1].x) * 0.5;
                const yc = (points[j].y + points[j + 1].y) * 0.5;
                ctx.quadraticCurveTo(points[j].x, points[j].y, xc, yc);
            }
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

            ctx.lineTo(width, baseY + veilHeight);
            ctx.lineTo(0, baseY + veilHeight);
            ctx.closePath();

            const grad = ctx.createLinearGradient(0, baseY - 20, 0, baseY + veilHeight);
            grad.addColorStop(0, getLilacVeilColor(fillAlpha * 1.6));
            grad.addColorStop(0.5, getLilacVeilColor(fillAlpha * 0.45));
            grad.addColorStop(1, 'rgba(17, 18, 24, 0)');
            ctx.fillStyle = grad;
            ctx.fill();

            // Draw Crisp Crest Hairline Stroke (Soft Lilac Crest)
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let j = 0; j < points.length - 1; j++) {
                const xc = (points[j].x + points[j + 1].x) * 0.5;
                const yc = (points[j].y + points[j + 1].y) * 0.5;
                ctx.quadraticCurveTo(points[j].x, points[j].y, xc, yc);
            }
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

            const baseStrokeAlpha = 0.08 + ribbonProgress * 0.22;
            ctx.strokeStyle = getLilacHairlineColor(baseStrokeAlpha);
            ctx.lineWidth = 0.8 + ribbonProgress * 0.45;
            ctx.stroke();
        }

        requestAnimationFrame(render);
    }

    render();
})();
