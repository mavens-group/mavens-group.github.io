/* ============================================================
   MAVENs page behaviour, loaded from layouts/partials/custom_js.html.

   Filter bars on Publications and Talks (chips + collapsible
   search), and reduced-motion handling for autoplaying video.
   ============================================================ */
(function () {
  'use strict';

  function toArray(nodes) { return Array.prototype.slice.call(nodes); }

  /* Filter bars (layouts/partials/mv_filter_bar.html) on Publications,
     the per-pillar lists and Talks. An entry shows when it carries the
     active chip in data-filter-tags (or the chip is "All") and contains the
     query; years left empty are hidden, and a note shows when nothing
     matches. Text is read per keystroke: MathJax rewrites titles after load. */
  function setupFilterBars() {
    toArray(document.querySelectorAll('.mv-filter-bar[data-filter-for]')).forEach(function (bar) {
      var list = document.getElementById(bar.getAttribute('data-filter-for'));
      if (!list) return;

      var itemSel = bar.getAttribute('data-filter-item');
      var items = toArray(list.querySelectorAll(itemSel));
      var groups = toArray(list.querySelectorAll(bar.getAttribute('data-filter-group')));
      var empty = list.querySelector('.mv-filter-empty');
      var input = bar.querySelector('.mv-search-input');
      var chips = toArray(bar.querySelectorAll('.mv-chip'));
      var active = 'all';

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : '';
        items.forEach(function (el) {
          var tags = (el.getAttribute('data-filter-tags') || '').split(/\s+/);
          var tagOk = active === 'all' || tags.indexOf(active) !== -1;
          var textOk = q === '' || el.textContent.toLowerCase().indexOf(q) !== -1;
          el.hidden = !(tagOk && textOk);
        });
        var any = false;
        groups.forEach(function (sec) {
          var shown = sec.querySelector(itemSel + ':not([hidden])') !== null;
          sec.hidden = !shown;
          any = any || shown;
        });
        if (empty) empty.hidden = any;
      }

      if (input) input.addEventListener('input', apply);
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          active = chip.getAttribute('data-filter') || 'all';
          chips.forEach(function (c) {
            var on = c === chip;
            c.classList.toggle('is-active', on);
            c.setAttribute('aria-pressed', on ? 'true' : 'false');
          });
          apply();
        });
      });

      setupCollapsibleSearch(bar.querySelector('.mv-search'), input, apply);
    });
  }

  /* The search box hides behind its icon button until clicked. It closes
     again on Escape (clearing the query) or when focus leaves it empty. */
  function setupCollapsibleSearch(box, input, apply) {
    var toggle = box && box.querySelector('.mv-search-toggle');
    if (!toggle || !input) return;

    function collapse() {
      box.classList.add('is-collapsed');
      toggle.hidden = false;
      toggle.setAttribute('aria-expanded', 'false');
    }
    function expand() {
      box.classList.remove('is-collapsed');
      toggle.setAttribute('aria-expanded', 'true');
      input.focus();          /* before hiding the button, which holds focus */
      toggle.hidden = true;
    }

    collapse();
    toggle.addEventListener('click', expand);
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      input.value = '';
      apply();
      collapse();
      toggle.focus();
    });
    /* Checked after the browser settles focus, so moving it between the
       button and the box does not count as leaving */
    box.addEventListener('focusout', function () {
      setTimeout(function () {
        if (box.contains(document.activeElement)) return;
        if (input.value.trim() === '') collapse();
      }, 0);
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
    setupFilterBars();
    respectReducedMotion();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
