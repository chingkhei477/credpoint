/* CredPoint — shared behaviour on every page: header state, mobile menu, footer year */
(function () {
  "use strict";
  var header = document.querySelector(".site-header");
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");

  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 6); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    if (!btn || !nav) return;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }
  if (btn && nav) {
    btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !btn.contains(e.target)) setMenu(false);
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 1000) setMenu(false); });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
