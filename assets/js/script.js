var navbarBurger = document.getElementById('navbar-burger');
navbarBurger.addEventListener(
  'click',
  function() {
    navbarBurger.classList.toggle('is-active');
    var navbarLinks = document.getElementById('navbar-links');
    navbarLinks.classList.toggle('is-active');
  },
  false
);
