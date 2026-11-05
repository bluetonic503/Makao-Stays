/* =============================================================================
   MAIN — initialises data-driven sections found on the current page.
   Sections are opt-in via data attributes, so pages stay simple HTML.
   ============================================================================= */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG;
  const T = window.TAXONOMY;
  const L = window.Listings;

  /* Config-driven text/links in static HTML ------------------------------- */
  U.$$("[data-site-name]").forEach((el) => (el.textContent = CFG.siteName));
  U.$$("[data-phone]").forEach((el) => { el.textContent = U.phoneDisplay(); if (el.tagName === "A") el.href = Booking.waLink(); });
  U.$$("[data-email]").forEach((el) => { el.textContent = CFG.email; if (el.tagName === "A") el.href = `mailto:${CFG.email}`; });
  U.$$("[data-office-hours]").forEach((el) => (el.textContent = CFG.officeHours));
  U.$$("[data-wa-link]").forEach((a) => {
    a.href = Booking.waLink((a.dataset.waLink || `Hello ${CFG.siteName}, I'd like help finding accommodation in Nairobi.`).replace("{site}", CFG.siteName));
    a.target = "_blank"; a.rel = "noopener";
  });
  U.$$("[data-rate-note]").forEach((el) => { el.classList.add("js-rate-note"); el.textContent = U.rateNote(); });
  U.$$("[data-usd]").forEach((el) => (el.outerHTML = U.usdSpan(+el.dataset.usd)));
  if (!CFG.showSampleListings) U.$$("[data-sample-note]").forEach((el) => (el.hidden = true));

  /* Search forms ----------------------------------------------------------- */
  U.$$("form[data-search-form]").forEach(Search.init);

  /* Filterable listing pages --------------------------------------------- */
  U.$$("[data-listing]").forEach(L.initListing);

  /* Featured stays with quick group chips (homepage) --------------------- */
  U.$$("[data-featured]").forEach((root) => {
    const limit = +root.dataset.limit || 8;
    const grid = U.$(".grid", root);
    const draw = (group) => {
      let list = U.properties().filter((p) => !group || U.type(p.type).group === group);
      list = L.sort(list.filter((p) => p.featured).concat(list.filter((p) => !p.featured)), "recommended").slice(0, limit);
      grid.innerHTML = list.length ? list.map(L.propertyCard).join("") : L.emptyState();
      U.$$(".chip", root).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.group === group)));
      window.observeReveal(root);
    };
    root.addEventListener("click", (e) => { const c = e.target.closest(".chip[data-group]"); if (c) draw(c.dataset.group); });
    draw("");
  });

  /* Category tiles --------------------------------------------------------- */
  U.$$("[data-type-grid]").forEach((el) => {
    const g = el.dataset.typeGrid;
    el.innerHTML = Object.keys(T.types).filter((k) => !g || T.types[k].group === g).map(L.typeCard).join("");
    window.observeReveal(el);
  });

  /* Location tiles --------------------------------------------------------- */
  U.$$("[data-location-grid]").forEach((el) => {
    const mode = el.dataset.locationGrid; // "popular" | "all" | "exclude:<slug>"
    let locs = window.LOCATIONS;
    if (mode === "popular") locs = locs.filter((l) => l.popular);
    if (mode.startsWith("exclude:")) locs = locs.filter((l) => l.slug !== mode.slice(8));
    if (el.dataset.limit) locs = locs.slice(0, +el.dataset.limit);
    el.innerHTML = locs.map(L.locationCard).join("");
    window.observeReveal(el);
  });

  /* Stays in specific neighbourhoods (e.g. airport page) ----------------- */
  U.$$("[data-stays-in]").forEach((el) => {
    const slugs = el.dataset.staysIn.split(",");
    const list = U.properties().filter((p) => slugs.includes(p.location)).slice(0, +el.dataset.limit || 6);
    el.innerHTML = list.length ? list.map(L.propertyCard).join("") : L.emptyState();
    window.observeReveal(el);
  });

  /* Cuisine tiles + restaurant previews ---------------------------------- */
  U.$$("[data-cuisine-grid]").forEach((el) => {
    const pick = el.dataset.cuisineGrid === "pick";
    el.innerHTML = Object.entries(T.cuisines).map(([k, c]) => `
      <a class="cuisine-tile reveal" href="${U.url(`pages/restaurants.html?cuisine=${k}`)}"${pick ? ` data-pick-cuisine="${k}"` : ""}>
        ${U.imgTag({ src: c.image, alt: "" }, { w: 360, ratio: 0.75, sizes: "(max-width: 600px) 45vw, 16vw" })}
        <span><i class="fa-solid ${c.icon}" aria-hidden="true"></i> ${c.label}</span></a>`).join("");
    window.observeReveal(el);
  });
  U.$$("[data-restaurant-preview]").forEach((el) => {
    const loc = el.dataset.restaurantPreview;
    const list = U.restaurants().filter((r) => !loc || r.location === loc).slice(0, +el.dataset.limit || 4);
    if (!list.length) { const sec = el.closest("[data-hide-empty]"); if (sec) sec.hidden = true; return; }
    el.innerHTML = list.map(L.restaurantCard).join("");
    window.observeReveal(el);
  });

  /* Neighbourhood page extras --------------------------------------------- */
  U.$$("[data-location-page]").forEach((root) => {
    const loc = U.location(root.dataset.locationPage);
    if (!loc) return;
    const map = U.$("[data-loc-map]", root);
    if (map) map.innerHTML = U.mapEmbed(loc.coords, `${loc.name}, Nairobi`);
  });

  /* Counters --------------------------------------------------------------- */
  U.$$("[data-count]").forEach((el) => {
    const k = el.dataset.count;
    el.textContent = k === "stays" ? U.properties().length : k === "areas" ? window.LOCATIONS.length : k === "restaurants" ? U.restaurants().length : "";
  });

  U.refreshUSD();
})();
