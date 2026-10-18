/* CredPoint — renders reward cards from offers-data.js (Explore Offers page and Home page) */
(function () {
  "use strict";

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function todayIST() {
    var d = new Date(Date.now() + (330 + new Date().getTimezoneOffset()) * 60000);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function activeOffers() {
    var list = Array.isArray(window.CREDPOINT_OFFERS) ? window.CREDPOINT_OFFERS : [];
    var today = todayIST();
    return list.filter(function (o) {
      if (!o || typeof o.store !== "string" || !o.store.trim()) return false;
      if (typeof o.rate !== "string" || !o.rate.trim()) return false;
      if (typeof o.link !== "string" || !/^https:\/\/[^\s"<>]+$/i.test(o.link)) return false;
      if (o.validTill && /^\d{4}-\d{2}-\d{2}$/.test(o.validTill) && o.validTill < today) return false;
      return true;
    });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function svg(paths) {
    var ns = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "2");
    s.setAttribute("stroke-linecap", "round");
    s.setAttribute("stroke-linejoin", "round");
    s.setAttribute("aria-hidden", "true");
    paths.forEach(function (d) {
      var p = document.createElementNS(ns, "path");
      p.setAttribute("d", d);
      s.appendChild(p);
    });
    return s;
  }

  function niceDate(iso) {
    var p = iso.split("-");
    return Number(p[2]) + " " + MONTHS[Number(p[1]) - 1] + " " + p[0];
  }

  function card(o) {
    var category = (o.category || "Other").trim();
    var art = el("article", "reward");
    art.dataset.category = category;
    art.dataset.search = [o.store, category, o.summary, o.rate].join(" ").toLowerCase();

    var face = el("div", "reward-face");
    var top = el("div", "reward-top");
    var store = el("div", "reward-store");
    var mono = el("span", "monogram", o.store.trim().charAt(0).toUpperCase());
    mono.setAttribute("aria-hidden", "true");
    store.appendChild(mono);
    store.appendChild(el("h3", null, o.store.trim()));
    top.appendChild(store);
    top.appendChild(el("span", "reward-cat", category));
    face.appendChild(top);
    var rate = el("p", "reward-rate");
    rate.appendChild(el("span", null, "Cashback"));
    rate.appendChild(document.createTextNode(o.rate.trim()));
    face.appendChild(rate);
    art.appendChild(face);

    var body = el("div", "reward-body");
    if (o.summary) body.appendChild(el("p", null, o.summary));
    if (Array.isArray(o.conditions) && o.conditions.length) {
      var det = el("details");
      det.appendChild(el("summary", null, "Conditions"));
      var ul = el("ul");
      o.conditions.forEach(function (c) { if (c) ul.appendChild(el("li", null, String(c))); });
      det.appendChild(ul);
      body.appendChild(det);
    }
    var valid = el("p", "reward-valid");
    valid.appendChild(svg(["M12 7v5l3 2", "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"]));
    valid.appendChild(document.createTextNode(o.validTill ? "Valid till " + niceDate(o.validTill) : "No fixed end date. The store may change it."));
    body.appendChild(valid);

    var a = el("a", "btn btn-dark btn-block", "Shop at " + o.store.trim());
    a.href = o.link;
    a.target = "_blank";
    a.rel = "sponsored nofollow noopener noreferrer";
    a.setAttribute("aria-label", "Shop at " + o.store.trim() + " — opens the store's website in a new tab");
    a.appendChild(svg(["M7 17 17 7", "M9 7h8v8"]));
    body.appendChild(a);
    art.appendChild(body);
    return art;
  }

  /* Explore Offers page */
  var grid = document.getElementById("offer-grid");
  if (grid) {
    var offers = activeOffers();
    var toolbar = document.getElementById("offer-toolbar");
    var chips = document.getElementById("offer-chips");
    var search = document.getElementById("offer-search");
    var none = document.getElementById("no-results");
    var live = document.getElementById("offer-count");
    var empty = document.getElementById("offers-empty");

    if (!offers.length) {
      empty.hidden = false;
      toolbar.hidden = true;
    } else {
      offers.forEach(function (o) { grid.appendChild(card(o)); });
      var active = "All";
      var cats = [];
      offers.forEach(function (o) { var c = (o.category || "Other").trim(); if (cats.indexOf(c) < 0) cats.push(c); });
      cats.sort();

      var apply = function () {
        var q = (search.value || "").trim().toLowerCase();
        var shown = 0;
        grid.querySelectorAll(".reward").forEach(function (c) {
          var ok = (active === "All" || c.dataset.category === active) && (!q || c.dataset.search.indexOf(q) > -1);
          c.hidden = !ok;
          if (ok) shown++;
        });
        none.style.display = shown ? "none" : "block";
        live.textContent = shown + (shown === 1 ? " offer shown" : " offers shown");
      };

      ["All"].concat(cats).forEach(function (c) {
        var b = el("button", "chip", c);
        b.type = "button";
        b.setAttribute("aria-pressed", String(c === "All"));
        b.addEventListener("click", function () {
          active = c;
          chips.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          apply();
        });
        chips.appendChild(b);
      });
      if (cats.length < 2) chips.hidden = true;
      search.addEventListener("input", apply);
      apply();
    }
  }

  /* Home page: first three active offers */
  var featured = document.getElementById("featured-grid");
  if (featured) {
    var top3 = activeOffers().slice(0, 3);
    if (top3.length) {
      top3.forEach(function (o) { featured.appendChild(card(o)); });
      document.getElementById("featured").hidden = false;
    }
  }
})();
