// change-theme.js
let rotation = 0;
document.getElementById('switch-theme').addEventListener('click', () => {
    rotation += 360;
    document.querySelector('#switch-theme .theme-toggle-icon').style.transform = `rotate(${rotation}deg)`;
    
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');

    // Determine current *effective* theme (explicit, or fall back to OS)
    const isDark = current
        ? current === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;

    const next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    document.dispatchEvent(new CustomEvent('theme-changed', { detail: next }));
});