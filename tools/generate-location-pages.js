#!/usr/bin/env node
/* =============================================================================
   Generates one SEO page per neighbourhood: /locations/<slug>.html
   Source: data/locations.js

   Usage:  node tools/generate-location-pages.js
   Run it after adding/editing a neighbourhood, then run tools/build-sitemap.js.
   ============================================================================= */
"use strict";
const { loadData, esc, unsplash, page, breadcrumbLd, breadcrumbHtml, write } = require("./_template");

const W = loadData();
const CFG = W.SITE_CONFIG;
const root = "../";

for (const loc of W.LOCATIONS) {
  const file = `locations/${loc.slug}.html`;
  const crumbs = [["Home", "index.html"], ["Neighbourhoods", "pages/locations.html"], [loc.name, file]];
  const others = W.LOCATIONS.filter((l) => l.slug !== loc.slug).slice(0, 6);

  const body = `
    <section class="page-hero">
      <div class="page-hero__bg"><img src="${unsplash(loc.image, 1600, 700)}" alt="" fetchpriority="high"></div>
      <div class="container">
        ${breadcrumbHtml(root, crumbs)}
        <p class="eyebrow"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Nairobi neighbourhood guide</p>
        <h1>Accommodation in ${esc(loc.name)}, Nairobi</h1>
        <p>${esc(loc.tagline)}. Compare hotels, apartments and short stays in ${esc(loc.name)} and book directly on WhatsApp.</p>
        <ul class="chips-static">${loc.bestFor.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      </div>
    </section>

    <section class="section section--tight" data-location-page="${loc.slug}">
      <div class="container split">
        <div>
          <p class="eyebrow">About the area</p>
          <h2>Staying in ${esc(loc.name)}</h2>
          <p class="lead">${esc(loc.description)}</p>
          <div class="grid grid--2" style="margin-top:24px">
            <div class="info-card">
              <div class="info-card__icon"><i class="fa-solid fa-landmark" aria-hidden="true"></i></div>
              <h3>Nearby landmarks</h3>
              <ul>${loc.landmarks.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
            </div>
            <div class="info-card">
              <div class="info-card__icon"><i class="fa-solid fa-plane-arrival" aria-hidden="true"></i></div>
              <h3>Getting to JKIA</h3>
              <p>Typical drive time: ${esc(loc.jkiaDrive)}. Allow extra time during rush hours (roughly 6:30–9:30 AM and 4:30–8 PM).</p>
              <a class="link-arrow" href="${root}pages/airport-transfers.html">Airport transfers <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
        <div>
          <div class="map" data-loc-map aria-label="Map of ${esc(loc.name)}"></div>
          <p class="small muted">Map centred on the approximate ${esc(loc.name)} area. Photos on this page are illustrative.</p>
        </div>
      </div>
    </section>

    <section class="section section--soft" id="stays" aria-labelledby="stays-title">
      <div class="container">
        <div class="section-head"><div><p class="eyebrow">Where to stay</p>
          <h2 id="stays-title">Hotels, apartments &amp; short stays in ${esc(loc.name)}</h2>
          <p>Filter by dates, guests, type and budget. Every Book Now button sends a ready-to-send booking request to our team on WhatsApp.</p></div></div>
        <div data-listing data-group="all" data-location="${loc.slug}"></div>
      </div>
    </section>

    <section class="section" data-hide-empty aria-labelledby="eat-title">
      <div class="container">
        <div class="section-head"><div><p class="eyebrow">Eat &amp; drink</p><h2 id="eat-title">Restaurants in ${esc(loc.name)}</h2></div>
          <a class="link-arrow" href="${root}pages/restaurants.html?location=${loc.slug}">All restaurants in ${esc(loc.name)} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
        <div class="grid grid--cards" data-restaurant-preview="${loc.slug}" data-limit="3"></div>
      </div>
    </section>

    <section class="section section--tight" aria-labelledby="more-title">
      <div class="container">
        <div class="section-head"><div><p class="eyebrow">Keep exploring</p><h2 id="more-title">Other Nairobi neighbourhoods</h2></div>
          <a class="link-arrow" href="${root}pages/locations.html">All neighbourhoods <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
        <div class="grid grid--locs" data-location-grid="exclude:${loc.slug}" data-limit="4"></div>
        <p class="small muted" style="margin-top:20px">Also popular: ${others.map((o) => `<a href="${o.slug}.html">${esc(o.name)}</a>`).join(" · ")}</p>
      </div>
    </section>`;

  const html = page({
    data: W, file, root, key: "locations",
    title: `Hotels & Apartments in ${loc.name}, Nairobi | ${CFG.siteName}`,
    description: `Find hotels, serviced apartments and short stays in ${loc.name}, Nairobi. ${loc.tagline}. Prices in KES & USD — book easily via WhatsApp.`,
    ogImage: unsplash(loc.image, 1200, 630),
    jsonLd: [breadcrumbLd(CFG, crumbs)],
    body,
  });
  write(file, html);
  console.log("wrote", file);
}
