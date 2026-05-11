(function() {
  function setupMaterialMenu() {
    const menu = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');

    if (!menu || !toggler) return;

    // We use a global listener to catch clicks anywhere on the document
    function closeOnOutsideClick(event) {
      if (menu.classList.contains('show')) {
        // If the click is NOT on the menu and NOT on the toggler
        if (!menu.contains(event.target) && !toggler.contains(event.target)) {
          toggler.click(); // Close the menu
        }
      }
    }

    // Listener for mobile touch and desktop click
    document.addEventListener('touchstart', closeOnOutsideClick, {passive: true});
    document.addEventListener('mousedown', closeOnOutsideClick);
  }

  // Initialize on all possible load events
  document.addEventListener('DOMContentLoaded', setupMaterialMenu);
  if (document.readyState !== 'loading') setupMaterialMenu();
  document.addEventListener('turbo:load', setupMaterialMenu);
})();
