document.addEventListener("DOMContentLoaded", () => {
  const navbarBurger = document.getElementById("navbar-burger");
  navbarBurger.addEventListener(
    "click",
    e => {
      e.preventDefault();
      navbarBurger.classList.toggle("is-active");
      const navbarLinks = document.getElementById("navbar-links");
      navbarLinks.classList.toggle("is-active");
    },
    false
  );

  const toTopButton = document.querySelectorAll(".to-top-button");
  toTopButton.forEach(el => {
    el.addEventListener(
      "click",
      e => {
        e.preventDefault();
        Jump("#top", { duration: 500 });
      },
      false
    );
  });

  dayjs.locale("ja");
  const postTimeElms = document.querySelectorAll(".post-time");
  postTimeElms.forEach(el => {
    el.innerHTML = dayjs(el.dataset["postTime"]).format(el.dataset["timeFormat"]);
  });

  const images = document.getElementsByTagName("img");
  Array.prototype.forEach.call(images, img => {
    if (img.parentNode.tagName === "P") {
      img.parentNode.classList.add("img-container");
    }
  })
});
