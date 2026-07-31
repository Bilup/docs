// Floating button to open/close the doc sidebar on narrow screens, where the
// (removed) navbar would normally host the hamburger. CSS in custom.css handles
// visibility and the drawer layout; this only wires up the toggle.
if (typeof window !== 'undefined') {
    const mount = () => {
        if (document.querySelector('.mw-sidebar-toggle')) return;
        const btn = document.createElement('button');
        btn.className = 'mw-sidebar-toggle';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Toggle navigation');
        btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
        btn.addEventListener('click', () => document.body.classList.toggle('mw-sidebar-open'));
        document.body.appendChild(btn);

        // Close only when clicking outside the sidebar (the backdrop). Clicks
        // inside it (expanding categories, following links) are left alone;
        // real navigation closes the drawer via onRouteDidUpdate below.
        document.addEventListener('click', e => {
            if (!document.body.classList.contains('mw-sidebar-open')) return;
            if (e.target.closest('.mw-sidebar-toggle')) return;
            if (!e.target.closest('.theme-doc-sidebar-container')) {
                document.body.classList.remove('mw-sidebar-open');
            }
        });
    };
    if (document.readyState !== 'loading') mount();
    else window.addEventListener('DOMContentLoaded', mount);
}

export function onRouteDidUpdate() {
    if (typeof document !== 'undefined') {
        document.body.classList.remove('mw-sidebar-open');
    }
}
