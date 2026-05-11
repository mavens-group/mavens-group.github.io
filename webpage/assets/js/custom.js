document.addEventListener('click', function (event) {
  const menu = document.querySelector('.navbar-collapse');
  const toggler = document.querySelector('.navbar-toggler');

  if (menu && menu.classList.contains('show')) {
    // If the click is NOT on the menu or the button, close it
    if (!menu.contains(event.target) && !toggler.contains(event.target)) {
      toggler.click();
    }
  }
});
