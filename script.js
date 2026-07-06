const menuButton = document.querySelector('[data-menu-toggle]');
if (menuButton) {
  menuButton.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    document.body.classList.remove('sidebar-open');
  }
});
