/* ============================================================
   MAVENs page behaviour, loaded from layouts/partials/custom_js.html.

   Publications search (layouts/section/publication.html)
   Hides entries that don't contain the query, then any year
   left empty; shows a note when nothing matches.
   ============================================================ */
(function () {
  'use strict';

  function setupPubSearch() {
    var input = document.querySelector('.mv-pub-search');
    var list = document.getElementById('mv-publications');
    if (!input || !list) return;

    var pubs = Array.prototype.slice.call(list.querySelectorAll('.mv-pub'));
    var years = Array.prototype.slice.call(list.querySelectorAll('.mv-pub-year'));
    var empty = list.querySelector('.mv-pub-empty');

    /* Text is read per keystroke: MathJax rewrites the titles after load */
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      pubs.forEach(function (el) { el.hidden = q !== '' && el.textContent.toLowerCase().indexOf(q) === -1; });
      var any = false;
      years.forEach(function (sec) {
        var shown = sec.querySelector('.mv-pub:not([hidden])') !== null;
        sec.hidden = !shown;
        any = any || shown;
      });
      if (empty) empty.hidden = any;
    });
  }

  /* Autoplaying videos (video shortcode) stay paused for visitors who
     ask for reduced motion; their controls let them play on demand. */
  function respectReducedMotion() {
    if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('video[data-mv-autoplay]').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
      v.controls = true;
    });
  }

  function init() {
    setupPubSearch();
    respectReducedMotion();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
