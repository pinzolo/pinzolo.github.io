var navbarBurger = document.getElementById('navbar-burger');
navbarBurger.addEventListener(
  'click',
  function(e) {
    e.preventDefault();
    navbarBurger.classList.toggle('is-active');
    var navbarLinks = document.getElementById('navbar-links');
    navbarLinks.classList.toggle('is-active');
  },
  false
);

var toTopButton = document.querySelectorAll('.to-top-button');
toTopButton.forEach(el => {
  el.addEventListener(
    'click',
    e => {
      e.preventDefault();
      Jump('#top', { duration: 500 });
    },
    false
  );
});
