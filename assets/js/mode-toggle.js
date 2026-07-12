/**
 * Mode toggle: Dynamic (✨) ↔ Minimalist (▫)
 * Saves preference on click; does not auto-redirect (shared / links stay Dynamic).
 */
(function () {
  var KEY = 'portfolio-mode';

  function setMode(mode) {
    try {
      localStorage.setItem(KEY, mode);
    } catch (e) { /* ignore */ }
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a.mode-toggle');
    if (!link) return;
    var mode = link.getAttribute('data-mode');
    if (mode === 'dynamic' || mode === 'minimal') setMode(mode);
  });
})();
