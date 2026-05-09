const Editor = {
    init() {
        this.populateValues();
        this.bindEvents();
    },

    populateValues() {
        const c = Config.current;
        document.getElementById('theme-select').value = c.theme;
        document.getElementById('layout-select').value = c.layout;
        document.getElementById('scale-slider').value = c.scale;
        document.getElementById('scale-value').innerText = c.scale.toFixed(1) + 'x';
        document.getElementById('pos-y').value = c.position.y;
        document.getElementById('pos-x').value = c.position.x;
        
        // Colors — read computed styles as fallback for theme defaults
        const rootStyles = getComputedStyle(document.documentElement);
        document.getElementById('color-bg').value = this.toHex(c.colors.bg) || '#000000';
        document.getElementById('color-key-bg').value = this.toHex(c.colors.keyBg || rootStyles.getPropertyValue('--key-bg').trim());
        document.getElementById('color-text').value = this.toHex(c.colors.keyText || rootStyles.getPropertyValue('--key-text').trim());
        document.getElementById('color-active').value = this.toHex(c.colors.keyActive || rootStyles.getPropertyValue('--key-active').trim());
    },

    bindEvents() {
        // Theme
        document.getElementById('theme-select').addEventListener('change', (e) => {
            // Reset custom colors when switching theme
            Config.update({ theme: e.target.value, colors: { bg: Config.current.colors.bg, keyBg: '', keyText: '', keyActive: '' } });
            // Re-read computed styles for color pickers
            setTimeout(() => this.populateValues(), 50);
        });

        // Layout
        document.getElementById('layout-select').addEventListener('change', (e) => {
            Config.update({ layout: e.target.value });
        });

        // Scale
        document.getElementById('scale-slider').addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            document.getElementById('scale-value').innerText = val.toFixed(1) + 'x';
            Config.update({ scale: val });
        });

        // Position
        document.getElementById('pos-y').addEventListener('change', () => {
            Config.update({ position: { y: document.getElementById('pos-y').value, x: document.getElementById('pos-x').value } });
        });
        document.getElementById('pos-x').addEventListener('change', () => {
            Config.update({ position: { y: document.getElementById('pos-y').value, x: document.getElementById('pos-x').value } });
        });

        // Colors
        document.getElementById('color-bg').addEventListener('input', (e) => {
            Config.update({ colors: { bg: e.target.value } });
        });
        document.getElementById('color-key-bg').addEventListener('input', (e) => {
            Config.update({ colors: { keyBg: e.target.value } });
        });
        document.getElementById('color-text').addEventListener('input', (e) => {
            Config.update({ colors: { keyText: e.target.value } });
        });
        document.getElementById('color-active').addEventListener('input', (e) => {
            Config.update({ colors: { keyActive: e.target.value } });
        });
        
        // Preview — open overlay in new tab
        document.getElementById('btn-preview').addEventListener('click', () => {
            const url = new URL(window.location.href);
            // Remove all params, add overlay mode + config
            for (const key of [...url.searchParams.keys()]) url.searchParams.delete(key);
            url.searchParams.set('overlay', 'true');
            const configStr = encodeURIComponent(JSON.stringify(Config.current));
            url.searchParams.set('config', configStr);
            window.open(url.toString(), '_blank');
        });

        // Copy OBS URL — generates ?overlay=true URL with config baked in
        document.getElementById('btn-copy-url').addEventListener('click', () => {
            const url = new URL(window.location.href);
            for (const key of [...url.searchParams.keys()]) url.searchParams.delete(key);
            url.searchParams.set('overlay', 'true');
            const configStr = encodeURIComponent(JSON.stringify(Config.current));
            url.searchParams.set('config', configStr);
            
            navigator.clipboard.writeText(url.toString()).then(() => {
                const btn = document.getElementById('btn-copy-url');
                const oldText = btn.innerText;
                btn.innerText = 'Copied!';
                setTimeout(() => btn.innerText = oldText, 2000);
            }).catch(() => {
                prompt('Copy this URL:', url.toString());
            });
        });
    },
    
    toHex(val) {
        if (!val) return null;
        val = val.trim();
        if (val.startsWith('#')) return val.length === 4 ? '#' + val[1]+val[1]+val[2]+val[2]+val[3]+val[3] : val;
        if (val === 'transparent' || val === 'rgba(0, 0, 0, 0)') return '#000000';
        
        // Handle rgb(r, g, b)
        const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#000000';
        
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
};
