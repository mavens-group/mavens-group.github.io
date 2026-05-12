/* ============================================================
   MAVENs site: mobile drawer + submenu handling
   ============================================================ */

(function () {
  'use strict';

  /* Detect dark mode by checking multiple known patterns. */
  function isDarkMode() {
    var h = document.documentElement;
    var b = document.body;
    if (!b) return false;
    return (
      h.classList.contains('dark')                 ||
      b.classList.contains('dark')                 ||
      h.getAttribute('data-theme') === 'dark'      ||
      b.getAttribute('data-theme') === 'dark'      ||
      h.classList.contains('dark-mode')            ||
      b.classList.contains('dark-mode')            ||
      document.querySelector('[data-bs-theme="dark"]') !== null
    );
  }

  function applyTheme(scrim, collapse) {
    if (isDarkMode()) {
      scrim.classList.add('is-dark');
      collapse.classList.add('drawer-dark');
    } else {
      scrim.classList.remove('is-dark');
      collapse.classList.remove('drawer-dark');
    }
  }

  function setupDrawer() {
    var collapse = document.querySelector('.navbar-collapse');
    var toggler  = document.querySelector('.navbar-toggler');
    if (!collapse || !toggler) return;
    if (toggler.dataset.drawerBound === '1') return;
    toggler.dataset.drawerBound = '1';

    /* Scrim — attach to <html> to escape any body stacking context */
    var scrim = document.querySelector('.mobile-menu-scrim');
    if (!scrim) {
      scrim = document.createElement('div');
      scrim.className = 'mobile-menu-scrim';
      document.documentElement.appendChild(scrim);
    }

    applyTheme(scrim, collapse);

    /* Re-check theme whenever it might change */
    var themeObserver = new MutationObserver(function () {
      applyTheme(scrim, collapse);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme']
    });
    themeObserver.observe(document.body, {
      attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme']
    });

    function openMenu() {
      applyTheme(scrim, collapse);
      collapse.classList.add('show');
      scrim.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      toggler.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      collapse.classList.remove('show');
      scrim.classList.remove('is-active');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      toggler.setAttribute('aria-expanded', 'false');
      collapse.querySelectorAll('.dropdown-menu.show').forEach(function (el) {
        el.classList.remove('show');
      });
    }

    /* Hamburger toggle (capture phase) */
    toggler.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (collapse.classList.contains('show')) closeMenu();
      else openMenu();
    }, true);

    /* Scrim tap → close */
    scrim.addEventListener('click', closeMenu);
    scrim.addEventListener('touchend', closeMenu);

    /* Submenu parents → toggle */
    collapse.querySelectorAll('.nav-item.dropdown > .nav-link, .nav-item.dropdown > a').forEach(function (parentLink) {
      parentLink.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var dropdownMenu = parentLink.nextElementSibling;
        if (!dropdownMenu || !dropdownMenu.classList.contains('dropdown-menu')) return;
        var wasOpen = dropdownMenu.classList.contains('show');
        collapse.querySelectorAll('.dropdown-menu.show').forEach(function (el) {
          if (el !== dropdownMenu) el.classList.remove('show');
        });
        if (wasOpen) dropdownMenu.classList.remove('show');
        else         dropdownMenu.classList.add('show');
      });
    });

    /* Submenu leaf links → close after navigation starts */
    collapse.querySelectorAll('.dropdown-menu .dropdown-item').forEach(function (item) {
      item.addEventListener('click', function () {
        setTimeout(closeMenu, 100);
      });
    });

    /* Escape → close */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && collapse.classList.contains('show')) closeMenu();
    });
  }

  if (document.readyState !== 'loading') setupDrawer();
  else document.addEventListener('DOMContentLoaded', setupDrawer);
  document.addEventListener('turbo:load', setupDrawer);
})();
