/* =============================================================================
   LISTINGS — card templates + the filterable listing controller used by
   stays.html, hotels.html, apartments.html, airbnb.html, houses.html and
   every /locations/*.html page.
   ============================================================================= */
(function () {
  "use strict";
  const T = window.TAXONOMY;
  const L = {};

  const detailsUrl = (p) => U.url(`pages/property-details.html?id=${encodeURIComponent(p.id)}`);
  const restaurantUrl = (r) => U.url(`pages/restaurant-details.html?id=${encodeURIComponent(r.id)}`);
  L.detailsUrl = detailsUrl;
  L.restaurantUrl = restaurantUrl;

  L.badges = (item) =>
    (item.sample ? `<span class="badge badge--sample" title="Demonstration listing — not a real property">Sample listing</span>` : "") +
    (!item.sample && item.verified ? `<span class="badge badge--verified"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Verified</span>` : "");

  /* Property card ---------------------------------------------------------- */
  L.propertyCard = (p) => {
    const t = U.type(p.type);
    const am = p.amenities.slice(0, 4).map((k) => T.amenities[k]).filter(Boolean);
    const more = p.amenities.length - am.length;
    const unit = U.priceUnit(p);
    return `
    <article class="card prop-card reveal">
      <a class="card__media" href="${detailsUrl(p)}" tabindex="-1" aria-hidden="true">
        ${U.imgTag(p.images[0], { w: 640, ratio: 0.72 })}
        <span class="badge badge--type"><i class="fa-solid ${t.icon}" aria-hidden="true"></i> ${U.esc(t.label)}</span>
        <span class="card__badges">${L.badges(p)}</span>
      </a>
      <div class="card__body">
        <p class="card__loc"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${U.esc(U.locationName(p.location))}, Nairobi</p>
        <h3 class="card__title"><a href="${detailsUrl(p)}">${U.esc(p.name)}</a></h3>
        <p class="card__desc">${U.esc(p.summary)}</p>
        <ul class="card__meta">
          <li><i class="fa-solid fa-user-group" aria-hidden="true"></i> Up to ${p.maxGuests} guest${p.maxGuests > 1 ? "s" : ""}</li>
          <li><i class="fa-solid fa-bed" aria-hidden="true"></i> ${U.bedroomsLabel(p.bedrooms)}</li>
          <li><i class="fa-solid fa-bath" aria-hidden="true"></i> ${p.bathrooms} bath</li>
        </ul>
        <ul class="card__amenities" aria-label="Amenities">
          ${am.map((a) => `<li title="${a.label}"><i class="fa-solid ${a.icon}" aria-hidden="true"></i><span>${a.label}</span></li>`).join("")}
          ${more > 0 ? `<li class="more">+${more} more</li>` : ""}
        </ul>
        <div class="card__footer">
          <p class="price"><strong>${U.formatKES(p.price.amount)}</strong> <span>/ ${unit}</span><br>${U.usdSpan(p.price.amount)}</p>
          <a class="btn btn--ghost btn--sm" href="${detailsUrl(p)}">View details</a>
        </div>
        ${p.available
          ? `<button class="btn btn--primary btn--block" type="button" data-book="${p.id}"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Book Now</button>`
          : `<button class="btn btn--block" type="button" disabled>Currently unavailable</button>`}
      </div>
    </article>`;
  };

  /* Restaurant card -------------------------------------------------------- */
  L.priceLevel = (n) => {
    const lvl = T.priceLevels[n] || {};
    return `<span class="price-level" title="${U.esc(lvl.hint || "")}"><span class="price-level__dots" aria-hidden="true">${"●".repeat(n)}<span>${"●".repeat(4 - n)}</span></span> ${U.esc(lvl.label || "")}</span>`;
  };
  L.restaurantCard = (r) => {
    const c = T.cuisines[r.cuisine] || { label: r.cuisine, icon: "fa-utensils" };
    return `
    <article class="card rest-card reveal">
      <a class="card__media" href="${restaurantUrl(r)}" tabindex="-1" aria-hidden="true">
        ${U.imgTag(r.images[0], { w: 640, ratio: 0.66 })}
        <span class="badge badge--type"><i class="fa-solid ${c.icon}" aria-hidden="true"></i> ${U.esc(c.label)}</span>
        <span class="card__badges">${L.badges(r)}</span>
      </a>
      <div class="card__body">
        <p class="card__loc"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${U.esc(U.locationName(r.location))}, Nairobi</p>
        <h3 class="card__title"><a href="${restaurantUrl(r)}">${U.esc(r.name)}</a></h3>
        <p class="card__desc">${U.esc(r.summary)}</p>
        <div class="rest-card__info">
          ${L.priceLevel(r.priceLevel)}
          ${r.website ? `<a href="${U.esc(r.website)}" target="_blank" rel="noopener">Official website</a>` : `<span class="muted small">Contact details pending verification</span>`}
        </div>
        <a class="btn btn--outline btn--block" href="${restaurantUrl(r)}">View Details</a>
      </div>
    </article>`;
  };

  /* Location & type tiles ---------------------------------------------------- */
  L.countIn = (loc) => U.properties().filter((p) => p.location === loc).length;
  L.locationCard = (l) => {
    const n = L.countIn(l.slug);
    return `
    <a class="loc-card reveal" href="${U.url(`locations/${l.slug}.html`)}">
      ${U.imgTag({ src: l.image, alt: `Illustrative photo for ${l.name}, Nairobi` }, { w: 560, ratio: 0.8, sizes: "(max-width: 600px) 50vw, 25vw" })}
      <span class="loc-card__shade"></span>
      <span class="loc-card__text">
        <strong>${U.esc(l.name)}</strong>
        <span>${U.esc(l.tagline)}</span>
        <em>${n ? `${n} stay${n > 1 ? "s" : ""}` : "Enquire for stays"} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></em>
      </span>
    </a>`;
  };
  L.typeCard = (key) => {
    const t = T.types[key];
    const n = U.properties().filter((p) => p.type === key).length;
    return `
    <a class="type-card reveal" href="${U.url(T.groups[t.group].page)}?type=${key}">
      <span class="type-card__img">${U.imgTag({ src: t.image, alt: `${t.label} in Nairobi (illustrative)` }, { w: 480, ratio: 0.7, sizes: "(max-width: 600px) 50vw, 20vw" })}</span>
      <span class="type-card__body">
        <span class="type-card__icon"><i class="fa-solid ${t.icon}" aria-hidden="true"></i></span>
        <strong>${U.esc(t.label)}</strong>
        <span>${U.esc(t.blurb)}</span>
        <em>${n} listing${n === 1 ? "" : "s"} · Explore <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></em>
      </span>
    </a>`;
  };

  L.emptyState = (what = "stays") => `
    <div class="empty">
      <i class="fa-regular fa-face-smile-wink" aria-hidden="true"></i>
      <h3>No ${what} match those filters yet</h3>
      <p>Try widening your search — or tell us what you need and our team will look for options for you.</p>
      <div class="btn-row">
        <button class="btn btn--ghost" type="button" data-reset>Clear filters</button>
        <a class="btn btn--whatsapp" target="_blank" rel="noopener" href="${Booking.waLink(`Hello ${window.SITE_CONFIG.siteName}, I'm looking for ${what} in Nairobi. Can you help?`)}"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Ask us on WhatsApp</a>
      </div>
    </div>`;

  /* -----------------------------------------------------------------------
     Filterable listing page
     <section data-listing data-group="hotels|apartments|short-stays|houses|all" [data-location="karen"]>
     ----------------------------------------------------------------------- */
  const PRICE_STEPS = [3000, 5000, 8000, 12000, 20000, 35000];

  L.matchQuery = (p, q) => {
    if (!q) return true;
    const hay = `${p.name} ${p.summary} ${U.locationName(p.location)} ${U.type(p.type).label} ${p.street || ""}`.toLowerCase();
    return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
  };

  /** Resolve free text typed into the destination field to a location slug. */
  L.resolveLocation = (text) => {
    if (!text) return "";
    const t = text.trim().toLowerCase().replace(/,?\s*nairobi$/, "");
    if (!t) return "";
    const loc = window.LOCATIONS.find((l) => l.slug === t || l.name.toLowerCase() === t)
      || window.LOCATIONS.find((l) => l.name.toLowerCase().startsWith(t) || (t === "cbd" && l.slug === "nairobi-cbd"));
    return loc ? loc.slug : "";
  };

  L.filter = (list, f) => list.filter((p) =>
    (!f.location || p.location === f.location) &&
    (!f.type || p.type === f.type) &&
    (!f.group || f.group === "all" || U.type(p.type).group === f.group) &&
    (!f.guests || p.maxGuests >= +f.guests) &&
    // Nightly budget filter: monthly rentals are only compared (pro-rated) when browsing long-term rentals
    (!f.maxPrice || (p.price.unit === "month" ? f.type === "long-term-rentals" && U.nightly(p) <= +f.maxPrice : p.price.amount <= +f.maxPrice)) &&
    (!f.bedrooms || p.bedrooms >= +f.bedrooms) &&
    L.matchQuery(p, f.q));

  L.sort = (list, how) => {
    const a = list.slice();
    if (how === "price-asc") a.sort((x, y) => U.nightly(x) - U.nightly(y));
    else if (how === "price-desc") a.sort((x, y) => U.nightly(y) - U.nightly(x));
    else if (how === "guests") a.sort((x, y) => y.maxGuests - x.maxGuests);
    else a.sort((x, y) => (y.featured - x.featured) || (y.verified - x.verified));
    return a;
  };

  L.initListing = (root) => {
    const group = root.dataset.group || "all";
    const fixedLoc = root.dataset.location || "";
    const p = U.params(), s = U.getSearch();
    const typesInGroup = Object.entries(T.types).filter(([, t]) => group === "all" || t.group === group);

    const state = {
      group,
      location: fixedLoc || p.location || "",
      type: typesInGroup.some(([k]) => k === p.type) ? p.type : "",
      guests: p.guests || "",
      maxPrice: p.maxPrice || "",
      bedrooms: p.bedrooms || "",
      sort: p.sort || "recommended",
      q: p.q || "",
      checkIn: p.checkIn || s.checkIn || "",
      checkOut: p.checkOut || s.checkOut || "",
    };
    if (state.q && !state.location) { const slug = L.resolveLocation(state.q); if (slug) { state.location = slug; state.q = ""; } }
    if (state.checkIn && state.checkIn < U.todayISO()) { state.checkIn = ""; state.checkOut = ""; }

    const today = U.todayISO();
    const locOptions = window.LOCATIONS.map((l) => `<option value="${l.slug}">${l.name}</option>`).join("");
    root.innerHTML = `
      <div class="filters" role="search" aria-label="Filter accommodation">
        <div class="filters__row">
          ${fixedLoc ? "" : `<label class="field"><span>Neighbourhood</span><select name="location"><option value="">All of Nairobi</option>${locOptions}</select></label>`}
          <label class="field"><span>Check-in</span><input type="date" name="checkIn" min="${today}"></label>
          <label class="field"><span>Check-out</span><input type="date" name="checkOut" min="${U.addDays(today, 1)}"></label>
          <label class="field"><span>Guests</span><select name="guests"><option value="">Any</option>${[1, 2, 3, 4, 5, 6, 8, 10].map((n) => `<option value="${n}">${n}+ guest${n > 1 ? "s" : ""}</option>`).join("")}</select></label>
          <label class="field"><span>Max price / night</span><select name="maxPrice"><option value="">Any price</option>${PRICE_STEPS.map((v) => `<option value="${v}">Up to ${U.formatKES(v)}</option>`).join("")}</select></label>
          <label class="field"><span>Sort by</span><select name="sort">
            <option value="recommended">Recommended</option><option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option><option value="guests">Most guests</option></select></label>
        </div>
        <div class="filters__row filters__row--chips">
          <div class="chips" role="group" aria-label="Accommodation type">
            <button type="button" class="chip" data-type="">All types</button>
            ${typesInGroup.map(([k, t]) => `<button type="button" class="chip" data-type="${k}"><i class="fa-solid ${t.icon}" aria-hidden="true"></i> ${t.label}</button>`).join("")}
          </div>
          ${state.q ? `<span class="chip chip--active" data-clear-q>“${U.esc(state.q)}” <i class="fa-solid fa-xmark" aria-hidden="true"></i></span>` : ""}
          <button type="button" class="link-btn" data-reset><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Reset</button>
        </div>
      </div>
      <div class="results-bar"><p class="results-count" aria-live="polite"></p><p class="small muted js-rate-note">${U.rateNote()}</p></div>
      <div class="grid grid--cards results"></div>`;

    const $ = (sel) => U.$(sel, root);
    const fields = ["location", "checkIn", "checkOut", "guests", "maxPrice", "sort"];
    fields.forEach((n) => { const el = root.querySelector(`[name=${n}]`); if (el) el.value = state[n]; });

    const render = () => {
      const list = L.sort(L.filter(U.properties(), state), state.sort);
      U.$$(".chip[data-type]", root).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.type === state.type)));
      const where = state.location ? ` in ${U.locationName(state.location)}` : " in Nairobi";
      const n = state.checkIn && state.checkOut ? U.nights(state.checkIn, state.checkOut) : 0;
      $(".results-count").innerHTML = `<strong>${list.length}</strong> ${list.length === 1 ? "stay" : "stays"}${where}${n > 0 ? ` · ${U.formatDate(state.checkIn)} → ${U.formatDate(state.checkOut)} (${n} night${n > 1 ? "s" : ""})` : ""}`;
      $(".results").innerHTML = list.length ? list.map(L.propertyCard).join("") : L.emptyState(state.type ? U.type(state.type).label.toLowerCase() : "stays");
      window.observeReveal && window.observeReveal(root);
      // keep URL shareable
      const qs = new URLSearchParams();
      ["location", "type", "guests", "maxPrice", "sort", "q", "checkIn", "checkOut"].forEach((k) => {
        if (state[k] && !(k === "location" && fixedLoc) && !(k === "sort" && state[k] === "recommended")) qs.set(k, state[k]);
      });
      history.replaceState(null, "", location.pathname + (qs.toString() ? "?" + qs : "") + location.hash);
      U.setSearch({ checkIn: state.checkIn, checkOut: state.checkOut, guests: state.guests || U.getSearch().guests });
    };

    root.addEventListener("change", (e) => {
      const n = e.target.name;
      if (!fields.includes(n)) return;
      state[n] = e.target.value;
      if (n === "checkIn") {
        const co = root.querySelector("[name=checkOut]");
        co.min = state.checkIn ? U.addDays(state.checkIn, 1) : U.addDays(today, 1);
        if (state.checkOut && state.checkOut <= state.checkIn) { state.checkOut = U.addDays(state.checkIn, 1); co.value = state.checkOut; }
      }
      render();
    });
    root.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip[data-type]");
      if (chip) { state.type = chip.dataset.type; render(); return; }
      if (e.target.closest("[data-clear-q]")) { state.q = ""; e.target.closest("[data-clear-q]").remove(); render(); return; }
      if (e.target.closest("[data-reset]")) {
        Object.assign(state, { location: fixedLoc, type: "", guests: "", maxPrice: "", bedrooms: "", sort: "recommended", q: "", checkIn: "", checkOut: "" });
        fields.forEach((n) => { const el = root.querySelector(`[name=${n}]`); if (el) el.value = state[n]; });
        const cq = root.querySelector("[data-clear-q]"); if (cq) cq.remove();
        render();
      }
    });
    render();
  };

  window.Listings = L;
})();
