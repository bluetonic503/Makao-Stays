/* =============================================================================
   RESTAURANTS — list page (pages/restaurants.html) and details page
   (pages/restaurant-details.html?id=...).
   ============================================================================= */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG;
  const T = window.TAXONOMY;

  /* ---------------- List page ---------------- */
  const listRoot = U.$("[data-restaurant-list]");
  if (listRoot) {
    const p = U.params();
    const state = {
      cuisine: T.cuisines[p.cuisine] ? p.cuisine : "",
      location: U.location(p.location) ? p.location : "",
      price: p.price || "",
    };
    const usedLocs = window.LOCATIONS;
    listRoot.innerHTML = `
      <div class="filters" role="search" aria-label="Filter restaurants">
        <div class="filters__row filters__row--3">
          <label class="field"><span>Neighbourhood</span><select name="location"><option value="">All of Nairobi</option>
            ${usedLocs.map((l) => `<option value="${l.slug}">${l.name}</option>`).join("")}</select></label>
          <label class="field"><span>Price range</span><select name="price"><option value="">Any price</option>
            ${Object.entries(T.priceLevels).map(([k, v]) => `<option value="${k}">${v.label} — ${v.hint}</option>`).join("")}</select></label>
          <button type="button" class="btn btn--ghost" data-reset><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Reset filters</button>
        </div>
        <div class="chips" role="group" aria-label="Cuisine">
          <button type="button" class="chip" data-cuisine="">All cuisines</button>
          ${Object.entries(T.cuisines).map(([k, c]) => `<button type="button" class="chip" data-cuisine="${k}"><i class="fa-solid ${c.icon}" aria-hidden="true"></i> ${c.label}</button>`).join("")}
        </div>
      </div>
      <div class="results-bar"><p class="results-count" aria-live="polite"></p></div>
      <div class="grid grid--cards results"></div>`;
    listRoot.querySelector("[name=location]").value = state.location;
    listRoot.querySelector("[name=price]").value = state.price;

    const render = () => {
      const list = U.restaurants().filter((r) =>
        (!state.cuisine || r.cuisine === state.cuisine) &&
        (!state.location || r.location === state.location) &&
        (!state.price || r.priceLevel === +state.price));
      U.$$(".chip[data-cuisine]", listRoot).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.cuisine === state.cuisine)));
      U.$(".results-count", listRoot).innerHTML = `<strong>${list.length}</strong> restaurant${list.length === 1 ? "" : "s"}${state.cuisine ? ` · ${T.cuisines[state.cuisine].label}` : ""}${state.location ? ` in ${U.locationName(state.location)}` : ""}`;
      U.$(".results", listRoot).innerHTML = list.length ? list.map(Listings.restaurantCard).join("") : Listings.emptyState("restaurants");
      window.observeReveal && window.observeReveal(listRoot);
      const qs = new URLSearchParams(Object.entries(state).filter(([, v]) => v));
      history.replaceState(null, "", location.pathname + (qs.toString() ? "?" + qs : ""));
    };
    listRoot.addEventListener("change", (e) => { if (e.target.name in state) { state[e.target.name] = e.target.value; render(); } });
    listRoot.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip[data-cuisine]");
      if (chip) { state.cuisine = chip.dataset.cuisine; render(); }
      if (e.target.closest("[data-reset]")) {
        Object.keys(state).forEach((k) => (state[k] = ""));
        listRoot.querySelector("[name=location]").value = "";
        listRoot.querySelector("[name=price]").value = "";
        render();
      }
    });
    // cuisine tiles elsewhere on the page scroll back to the list
    document.addEventListener("click", (e) => {
      const tile = e.target.closest("[data-pick-cuisine]");
      if (!tile) return;
      e.preventDefault();
      state.cuisine = tile.dataset.pickCuisine;
      render();
      listRoot.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    render();
  }

  /* ---------------- Details page ---------------- */
  const detRoot = U.$("[data-restaurant-details]");
  if (!detRoot) return;
  const r = U.restaurant(U.params().id);
  if (!r) {
    U.setMeta("name", "robots", "noindex");
    detRoot.innerHTML = `<div class="container section"><div class="empty"><i class="fa-solid fa-utensils" aria-hidden="true"></i>
      <h1>Restaurant not found</h1><p>The link may be incorrect or the listing was removed.</p>
      <a class="btn btn--primary" href="${U.url("pages/restaurants.html")}">Browse restaurants</a></div></div>`;
    return;
  }
  const c = T.cuisines[r.cuisine] || { label: r.cuisine, icon: "fa-utensils" };
  const loc = U.location(r.location) || { name: r.location };
  const pageUrl = `${CFG.siteUrl}/pages/restaurant-details.html?id=${encodeURIComponent(r.id)}`;
  const title = `${r.name} — ${c.label} in ${loc.name}, Nairobi | ${CFG.siteName}`;
  document.title = title;
  U.setMeta("name", "description", r.summary);
  U.setMeta("property", "og:title", title);
  U.setMeta("property", "og:description", r.summary);
  U.setMeta("property", "og:image", U.img(r.images[0].src, 1200, 630));
  U.setMeta("property", "og:url", pageUrl);
  U.setCanonical(pageUrl);
  if (r.sample) U.setMeta("name", "robots", "noindex, follow");
  U.addJsonLd({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${CFG.siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Restaurants", item: `${CFG.siteUrl}/pages/restaurants.html` },
      { "@type": "ListItem", position: 3, name: r.name, item: pageUrl },
    ],
  });
  if (!r.sample && r.verified) {
    U.addJsonLd({
      "@context": "https://schema.org", "@type": "Restaurant", name: r.name, url: r.website || pageUrl,
      servesCuisine: c.label, image: r.images.map((i) => U.img(i.src, 1200)),
      address: { "@type": "PostalAddress", addressLocality: `${loc.name}, Nairobi`, addressCountry: "KE" },
      ...(r.phone ? { telephone: r.phone } : {}),
      priceRange: (T.priceLevels[r.priceLevel] || {}).label,
    });
  }

  const today = U.todayISO();
  const others = U.restaurants().filter((x) => x.id !== r.id && (x.cuisine === r.cuisine || x.location === r.location)).slice(0, 3);
  const stays = U.properties().filter((p) => p.location === r.location).slice(0, 3);

  detRoot.innerHTML = `
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol>
        <li><a href="${U.url("index.html")}">Home</a></li>
        <li><a href="${U.url("pages/restaurants.html")}">Restaurants</a></li>
        <li><a href="${U.url(`pages/restaurants.html?cuisine=${r.cuisine}`)}">${U.esc(c.label)}</a></li>
        <li aria-current="page">${U.esc(r.name)}</li></ol></nav>
      ${r.sample ? `<div class="notice notice--sample notice--wide"><i class="fa-solid fa-flask" aria-hidden="true"></i>
        <div><strong>Sample restaurant.</strong> This is a fictional example used to demonstrate restaurant pages. Real restaurants are added only after their details are verified.</div></div>` : ""}
      <header class="pd-head">
        <div><p class="eyebrow"><i class="fa-solid ${c.icon}" aria-hidden="true"></i> ${U.esc(c.label)}</p>
          <h1>${U.esc(r.name)}</h1>
          <p class="pd-head__loc"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${U.esc(loc.name)}, Nairobi</p></div>
        <div class="pd-head__badges">${Listings.badges(r)}</div>
      </header>
      <div class="gallery gallery--${Math.min(r.images.length, 2)} gallery--rest">
        ${r.images.slice(0, 3).map((img, i) => `<div class="gallery__item${i === 0 ? " gallery__item--main" : ""}">${U.imgTag(img, { w: i === 0 ? 1200 : 700, ratio: 0.62, eager: i === 0 })}</div>`).join("")}
        <span class="gallery__count">Illustrative photos</span>
      </div>
      <div class="pd-layout">
        <div class="pd-main">
          <ul class="facts">
            <li><i class="fa-solid ${c.icon}" aria-hidden="true"></i><span>${U.esc(c.label)}</span></li>
            <li><i class="fa-solid fa-coins" aria-hidden="true"></i><span>${Listings.priceLevel(r.priceLevel)}</span></li>
            <li><i class="fa-regular fa-clock" aria-hidden="true"></i><span>${r.hours ? U.esc(r.hours) : "Hours to be confirmed"}</span></li>
          </ul>
          <section class="pd-section"><h2>About</h2>${r.description.map((d) => `<p>${U.esc(d)}</p>`).join("")}</section>
          <section class="pd-section"><h2>Highlights</h2><ul class="check-list">${r.highlights.map((h) => `<li>${U.esc(h)}</li>`).join("")}</ul></section>
          <section class="pd-section"><h2>Contact</h2>
            <ul class="contact-list">
              <li><i class="fa-solid fa-phone" aria-hidden="true"></i> ${r.phone ? `<a href="tel:${r.phone.replace(/\s/g, "")}">${U.esc(r.phone)}</a>` : "Phone number pending verification"}</li>
              <li><i class="fa-solid fa-globe" aria-hidden="true"></i> ${r.website ? `<a href="${U.esc(r.website)}" target="_blank" rel="noopener">Official website</a>` : "Official website pending verification"}</li>
            </ul>
            <p class="small muted">${CFG.siteName} is not the restaurant and does not take payments for meals. We only publish contact details we have verified.</p></section>
          <section class="pd-section"><h2>Area</h2><div class="map">${U.mapEmbed(U.coords(r), `${loc.name}, Nairobi`)}</div></section>
        </div>
        <aside class="pd-aside">
          <form class="book-card" data-rest-enquiry novalidate>
            <h2 class="h4">Plan a meal here</h2>
            <p class="small muted">Send us your plans on WhatsApp and we'll reply with verified contact details or help with a reservation request.</p>
            <label class="field"><span>Date</span><input type="date" name="date" min="${today}" required></label>
            <div class="field-row">
              <label class="field"><span>Time</span><input type="time" name="time" value="19:00"></label>
              <label class="field"><span>People</span><select name="people">${[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => `<option${n === 2 ? " selected" : ""}>${n}</option>`).join("")}</select></label>
            </div>
            <button type="submit" class="btn btn--whatsapp btn--block"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Enquire on WhatsApp</button>
            <p class="fineprint">A reservation is only confirmed by the restaurant.</p>
          </form>
        </aside>
      </div>
      ${stays.length ? `<section class="section section--tight"><div class="section-head"><h2>Stay nearby in ${U.esc(loc.name)}</h2>
        <a class="link-arrow" href="${U.url(`locations/${r.location}.html`)}">${U.esc(loc.name)} guide <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
        <div class="grid grid--cards">${stays.map(Listings.propertyCard).join("")}</div></section>` : ""}
      ${others.length ? `<section class="section section--tight"><div class="section-head"><h2>More restaurants you may like</h2></div>
        <div class="grid grid--cards">${others.map(Listings.restaurantCard).join("")}</div></section>` : ""}
    </div>`;
  window.observeReveal && window.observeReveal(detRoot);

  U.$("[data-rest-enquiry]", detRoot).addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.date.value) { U.toast("Please choose a date."); f.date.focus(); return; }
    if (f.date.value < today) { U.toast("Please choose a date from today onwards."); f.date.focus(); return; }
    const ref = Booking.newRef();
    Booking.track("enquiry", {
      ref, type: "Restaurant table", name: "", contact: "",
      details: `${r.name} (${r.id}) · ${loc.name}\nDate: ${U.formatDate(f.date.value)} · Time: ${f.time.value || "Flexible"} · People: ${f.people.value}`,
    });
    const msg = [
      `Hello ${CFG.siteName}, I found ${r.name} on your website and would like help with a table.`,
      "",
      `Ref: ${ref}`,
      `Restaurant: ${r.name} (ref: ${r.id}${r.sample ? ", sample listing" : ""})`,
      `Area: ${loc.name}, Nairobi`,
      `Date: ${U.formatDate(f.date.value)}`,
      `Time: ${f.time.value || "Flexible"}`,
      `People: ${f.people.value}`,
      "",
      "Please share availability and the restaurant's verified contact details.",
    ].join("\n");
    Booking.openWhatsApp(msg);
  });
})();
