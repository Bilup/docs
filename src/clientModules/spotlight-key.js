// When the docs are embedded in the Bilup Help window, Cmd/Ctrl+K should open
// the main Bilup spotlight instead of the docs' own search. Capture-phase so it
// beats DocSearch's own handler.
if (typeof window !== 'undefined' && window.parent !== window) {
    window.addEventListener('keydown', e => {
        const key = e.key && e.key.toLowerCase();
        if ((e.metaKey || e.ctrlKey) && key === 'k') {
            e.preventDefault();
            e.stopImmediatePropagation();
            window.parent.postMessage({type: 'mw:spotlight'}, window.location.origin);
        }
    }, true);
}
