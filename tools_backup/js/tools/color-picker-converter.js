document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('color-picker');
    const colorSwatch = document.getElementById('color-swatch');
    const hexInput = document.getElementById('hex-input');
    const rgbR = document.getElementById('rgb-r');
    const rgbG = document.getElementById('rgb-g');
    const rgbB = document.getElementById('rgb-b');
    const hslH = document.getElementById('hsl-h');
    const hslS = document.getElementById('hsl-s');
    const hslL = document.getElementById('hsl-l');

    let currentColor = { r: 0, g: 0, b: 0, h: 0, s: 0, l: 0, hex: '#000000' };

    function updateColor(source, value) {
        switch (source) {
            case 'picker':
                currentColor.hex = value;
                const rgbFromHex = hexToRgb(value);
                currentColor.r = rgbFromHex.r;
                currentColor.g = rgbFromHex.g;
                currentColor.b = rgbFromHex.b;
                const hslFromRgb = rgbToHsl(currentColor.r, currentColor.g, currentColor.b);
                currentColor.h = hslFromRgb.h;
                currentColor.s = hslFromRgb.s;
                currentColor.l = hslFromRgb.l;
                break;
            case 'hex':
                currentColor.hex = value;
                const rgbFromHexInput = hexToRgb(value);
                currentColor.r = rgbFromHexInput.r;
                currentColor.g = rgbFromHexInput.g;
                currentColor.b = rgbFromHexInput.b;
                const hslFromRgbInput = rgbToHsl(currentColor.r, currentColor.g, currentColor.b);
                currentColor.h = hslFromRgbInput.h;
                currentColor.s = hslFromRgbInput.s;
                currentColor.l = hslFromRgbInput.l;
                break;
            case 'rgb':
                currentColor.r = parseInt(rgbR.value);
                currentColor.g = parseInt(rgbG.value);
                currentColor.b = parseInt(rgbB.value);
                currentColor.hex = rgbToHex(currentColor.r, currentColor.g, currentColor.b);
                const hslFromRgbManual = rgbToHsl(currentColor.r, currentColor.g, currentColor.b);
                currentColor.h = hslFromRgbManual.h;
                currentColor.s = hslFromRgbManual.s;
                currentColor.l = hslFromRgbManual.l;
                break;
            case 'hsl':
                currentColor.h = parseInt(hslH.value);
                currentColor.s = parseInt(hslS.value);
                currentColor.l = parseInt(hslL.value);
                const rgbFromHslManual = hslToRgb(currentColor.h, currentColor.s, currentColor.l);
                currentColor.r = rgbFromHslManual.r;
                currentColor.g = rgbFromHslManual.g;
                currentColor.b = rgbFromHslManual.b;
                currentColor.hex = rgbToHex(currentColor.r, currentColor.g, currentColor.b);
                break;
        }
        renderColor();
    }

    function renderColor() {
        colorSwatch.style.backgroundColor = currentColor.hex;
        colorPicker.value = currentColor.hex;
        hexInput.value = currentColor.hex;
        rgbR.value = currentColor.r;
        rgbG.value = currentColor.g;
        rgbB.value = currentColor.b;
        hslH.value = Math.round(currentColor.h);
        hslS.value = Math.round(currentColor.s);
        hslL.value = Math.round(currentColor.l);
    }

    // Event Listeners
    colorPicker.addEventListener('input', (e) => updateColor('picker', e.target.value));
    hexInput.addEventListener('input', (e) => {
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(e.target.value)) {
            updateColor('hex', e.target.value);
        }
    });
    [rgbR, rgbG, rgbB].forEach(input => {
        input.addEventListener('input', () => {
            if (rgbR.value !== '' && rgbG.value !== '' && rgbB.value !== '') {
                updateColor('rgb');
            }
        });
    });
    [hslH, hslS, hslL].forEach(input => {
        input.addEventListener('input', () => {
            if (hslH.value !== '' && hslS.value !== '' && hslL.value !== '') {
                updateColor('hsl');
            }
        });
    });

    // Helper Functions
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    // Initial render
    renderColor();
});