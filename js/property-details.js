/* =============================================================================
   PROPERTY DETAILS — pages/property-details.html?id=<property-id>
   ============================================================================= */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG;
  const T = window.TAXONOMY;

  const root = U.$("[data-property-details]");
  if (!root) return;

  const id = U.params().id;
  const p = id && U.property(id);

  if (!p) {
    document.title = `Stay not found | ${CFG.siteName}`;
    U.setMeta("name", "robots", "noindex");
    root.innerHTML = `
      <div class="container section">
        <div class="empty">
          <i class="fa-regular fa-compass" aria-hidden="true"></i>
          <h1>We couldn't find that stay</h1>
          <p>It may have been removed or the link is incorrect.</p>
          <div class="btn-row"><a class="btn btn--primary" href="${U.url("pages/stays.html")}">Browse all accommodation</a>
          <a class="btn btn--ghost" href="${U.url("index.html")}">Back to home</a></div>
        </div>
      </div>`;
    return;
  }

  const t = U.type(p.type);
  const group = T.groups[t.group];
  const loc = U.location(p.location) || { name: p.location };
  const unit = U.priceUnit(p);
  const pageUrl = `${CFG.siteUrl}/pages/property-details.html?id=${encodeURIComponent(p.id)}`;

  /* SEO -------------------------------------------------------------------- */
  const title = `${p.name} — ${t.label} in ${loc.name}, Nairobi | ${CFG.siteName}`;
  const desc = `${p.summary} From ${U.formatKES(p.price.amount)} per ${unit}. Book via WhatsApp.`;
  document.title = title;
  U.setMeta("name", "description", desc);
  U.setMeta("property", "og:title", title);
  U.setMeta("property", "og:description", desc);
  U.setMeta("property", "og:url", pageUrl);
  U.setMeta("property", "og:image", U.img(p.images[0].src, 1200, 630));
  U.setMeta("name", "twitter:title", title);
  U.setMeta("name", "twitter:description", desc);
  U.setMeta("name", "twitter:image", U.img(p.images[0].src, 1200, 630));
  U.setCanonical(pageUrl);
  if (p.sample) U.setMeta("name", "robots", "noindex, follow"); // never index demo listings

  U.addJsonLd({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${CFG.siteUrl}/` },
      { "@type": "ListItem", position: 2, name: group.label, item: `${CFG.siteUrl}/${group.page}` },
      { "@type": "ListItem", position: 3, name: p.name, item: pageUrl },
    ],
  });
  // Lodging structured data ONLY for real, verified listings.
  if (!p.sample && p.verified) {
    const c = U.coords(p);
    U.addJsonLd({
      "@context": "https://schema.org",
      "@type": t.group === "hotels" ? "Hotel" : "LodgingBusiness",
      name: p.name, description: p.description.join(" "), url: pageUrl,
      image: p.images.map((i) => U.img(i.src, 1200)),
      address: { "@type": "PostalAddress", addressLocality: `${loc.name}, Nairobi`, addressCountry: "KE" },
      ...(c ? { geo: { "@type": "GeoCoordinates", latitude: c[0], longitude: c[1] } } : {}),
      priceRange: `${U.formatKES(p.price.amount)} per ${unit}`,
      checkinTime: p.checkIn, checkoutTime: p.checkOut,
      amenityFeature: p.amenities.filter((k) => T.amenities[k]).map((k) => ({ "@type": "LocationFeatureSpecification", name: T.amenities[k].label, value: true })),
    });
  }

  /* Render ----------------------------------------------------------------- */
  const imgs = p.images;
  const gallery = `
    <div class="gallery gallery--${Math.min(imgs.length, 5)}">
      ${imgs.slice(0, 5).map((img, i) => `
        <button type="button" class="gallery__item${i === 0 ? " gallery__item--main" : ""}" data-lightbox="${i}" aria-label="View photo ${i + 1} of ${imgs.length}: ${U.esc(img.alt)}">
          ${U.imgTag(img, { w: i === 0 ? 1200 : 600, ratio: i === 0 ? 0.66 : 0.75, eager: i === 0, sizes: i === 0 ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 50vw, 20vw" })}
        </button>`).join("")}
      <span class="gallery__count"><i class="fa-regular fa-images" aria-hidden="true"></i> ${imgs.length} photos · illustrative</span>
    </div>`;

  const amenities = p.amenities.filter((k) => T.amenities[k]).map((k) =>
    `<li><i class="fa-solid ${T.amenities[k].icon}" aria-hidden="true"></i> ${T.amenities[k].label}</li>`).join("");

  const similar = U.properties().filter((x) => x.id !== p.id && (x.location === p.location || x.type === p.type)).slice(0, 3);

  root.innerHTML = `
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol>
        <li><a href="${U.url("index.html")}">Home</a></li>
        <li><a href="${U.url(group.page)}">${group.label}</a></li>
        <li><a href="${U.url(`locations/${p.location}.html`)}">${U.esc(loc.name)}</a></li>
        <li aria-current="page">${U.esc(p.name)}</li></ol></nav>

      ${p.sample ? `<div class="notice notice--sample notice--wide"><i class="fa-solid fa-flask" aria-hidden="true"></i>
        <div><strong>Sample listing.</strong> This property is a realistic demonstration used to show how listings work. It is not a real property, and its photos are illustrative stock images. Verified listings will replace samples before launch.</div></div>` : ""}

      <header class="pd-head">
        <div>
          <p class="eyebrow"><i class="fa-solid ${t.icon}" aria-hidden="true"></i> ${U.esc(t.label)}</p>
          <h1>${U.esc(p.name)}</h1>
          <p class="pd-head__loc"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${U.esc(p.street && p.street !== loc.name ? p.street + ", " : "")}${U.esc(loc.name)}, Nairobi, Kenya</p>
        </div>
        <div class="pd-head__badges">${Listings.badges(p)}</div>
      </header>

      ${gallery}

      <div class="pd-layout">
        <div class="pd-main">
          <ul class="facts">
            <li><i class="fa-solid fa-user-group" aria-hidden="true"></i><span><strong>${p.maxGuests}</strong> guests max</span></li>
            <li><i class="fa-solid fa-bed" aria-hidden="true"></i><span><strong>${p.bedrooms === 0 ? "Studio" : p.bedrooms}</strong>${p.bedrooms === 0 ? "" : ` bedroom${p.bedrooms > 1 ? "s" : ""}`}</span></li>
            <li><i class="fa-solid fa-bath" aria-hidden="true"></i><span><strong>${p.bathrooms}</strong> bathroom${p.bathrooms > 1 ? "s" : ""}</span></li>
            <li><i class="fa-solid fa-moon" aria-hidden="true"></i><span>Min. <strong>${p.minNights || 1}</strong> night${(p.minNights || 1) > 1 ? "s" : ""}</span></li>
          </ul>

          <section class="pd-section" aria-labelledby="pd-about"><h2 id="pd-about">About this ${t.group === "hotels" ? "hotel" : "stay"}</h2>
            ${p.description.map((d) => `<p>${U.esc(d)}</p>`).join("")}</section>

          <section class="pd-section" aria-labelledby="pd-amen"><h2 id="pd-amen">Amenities</h2>
            <ul class="amenity-list">${amenities}</ul>
            <p class="small muted">${p.sample ? "Sample amenities for demonstration." : "Amenities listed have been confirmed with the property."} Anything missing? Ask us before booking.</p></section>

          <section class="pd-section" aria-labelledby="pd-times"><h2 id="pd-times">Check-in & check-out</h2>
            <div class="times">
              <div><i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i><span>Check-in</span><strong>${U.esc(p.checkIn)}</strong></div>
              <div><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i><span>Check-out</span><strong>${U.esc(p.checkOut)}</strong></div>
            </div></section>

          <section class="pd-section" aria-labelledby="pd-rules"><h2 id="pd-rules">House rules</h2>
            <ul class="check-list">${p.houseRules.map((r) => `<li>${U.esc(r)}</li>`).join("")}</ul></section>

          <section class="pd-section" aria-labelledby="pd-near"><h2 id="pd-near">Nearby</h2>
            <ul class="nearby-list">${p.nearby.map((n) => `<li><i class="fa-solid fa-location-arrow" aria-hidden="true"></i> ${U.esc(n)}</li>`).join("")}</ul></section>

          <section class="pd-section" aria-labelledby="pd-map"><h2 id="pd-map">Location</h2>
            <p class="small muted">Map shows the approximate ${U.esc(loc.name)} area. The exact address is shared after your booking is confirmed.</p>
            <div class="map">${U.mapEmbed(U.coords(p), `${loc.name}, Nairobi`)}</div>
            <p><a href="${U.url(`locations/${p.location}.html`)}">Read our ${U.esc(loc.name)} neighbourhood guide <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></p></section>
        </div>

        <aside class="pd-aside" aria-label="Booking">
          <div class="book-card">
            <p class="book-card__price"><strong>${U.formatKES(p.price.amount)}</strong> / ${unit}</p>
            <p class="book-card__usd">${U.usdSpan(p.price.amount)} <small>approx.</small></p>
            ${p.available
              ? `<button class="btn btn--primary btn--block btn--lg" type="button" data-book="${p.id}"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Book Now</button>`
              : `<button class="btn btn--block btn--lg" type="button" disabled>Currently unavailable</button>`}
            <a class="btn btn--ghost btn--block" target="_blank" rel="noopener" href="${Booking.waLink(`Hello ${CFG.siteName}, I have a question about "${p.name}" (ref: ${p.id}) in ${loc.name}.`)}"><i class="fa-regular fa-comment-dots" aria-hidden="true"></i> Ask a question</a>
            <ul class="book-card__trust">
              <li><i class="fa-solid fa-calendar-check" aria-hidden="true"></i> Pick your dates, then confirm in WhatsApp</li>
              <li><i class="fa-solid fa-user-shield" aria-hidden="true"></i> Availability confirmed by a real person</li>
              <li><i class="fa-solid fa-receipt" aria-hidden="true"></i> Payment instructions only after confirmation</li>
            </ul>
            <p class="fineprint">Clicking Book Now does not confirm a booking. <a href="${U.url("pages/booking-policy.html")}">How booking works</a></p>
          </div>
        </aside>
      </div>

      ${similar.length ? `<section class="section section--tight" aria-labelledby="pd-similar">
        <div class="section-head"><h2 id="pd-similar">Similar stays</h2>
        <a class="link-arrow" href="${U.url("pages/stays.html")}">See all <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
        <div class="grid grid--cards">${similar.map(Listings.propertyCard).join("")}</div></section>` : ""}
    </div>

    <div class="mobile-book-bar">
      <p><strong>${U.formatKES(p.price.amount)}</strong> / ${unit}<br>${U.usdSpan(p.price.amount)}</p>
      ${p.available ? `<button class="btn btn--primary" type="button" data-book="${p.id}"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Book Now</button>` : ""}
    </div>`;
  document.body.classList.add("has-book-bar");
  window.observeReveal && window.observeReveal(root);

  /* Lightbox --------------------------------------------------------------- */
  let lb, idx = 0, opener;
  const show = (i) => {
    idx = (i + imgs.length) % imgs.length;
    const im = U.$("img", lb);
    im.src = U.img(imgs[idx].src, 1600);
    im.alt = imgs[idx].alt;
    U.$(".lightbox__caption", lb).textContent = `${idx + 1} / ${imgs.length} — ${imgs[idx].alt}`;
  };
  const close = () => { lb.hidden = true; document.documentElement.classList.remove("no-scroll"); opener && opener.focus(); };
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lightbox]");
    if (!b) return;
    opener = b;
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lightbox"; lb.hidden = true;
      lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo gallery");
      lb.innerHTML = `<button class="lightbox__close" type="button" aria-label="Close gallery"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
        <figure><img alt=""><figcaption class="lightbox__caption"></figcaption></figure>
        <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>`;
      document.body.appendChild(lb);
      U.$(".lightbox__close", lb).onclick = close;
      U.$(".lightbox__nav--prev", lb).onclick = () => show(idx - 1);
      U.$(".lightbox__nav--next", lb).onclick = () => show(idx + 1);
      lb.addEventListener("click", (ev) => { if (ev.target === lb) close(); });
      lb.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape") close();
        if (ev.key === "ArrowLeft") show(idx - 1);
        if (ev.key === "ArrowRight") show(idx + 1);
      });
    }
    show(+b.dataset.lightbox);
    lb.hidden = false;
    document.documentElement.classList.add("no-scroll");
    U.$(".lightbox__close", lb).focus();
  });
})();
