const Keypress = {
    init() {
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return; // Ignore if typing in editor inputs
            }
            e.preventDefault(); 
            if (typeof Keyboard !== 'undefined') {
                Keyboard.highlightKey(e.code, true);
            }
        });

        window.addEventListener('keyup', (e) => {
            if (typeof Keyboard !== 'undefined') {
                Keyboard.highlightKey(e.code, false);
            }
        });
    }
};
