/* =============================================================================
   LAYOUT — header, navigation, footer, floating WhatsApp button.
   One source of truth for site-wide chrome. Each page provides:
     <body data-root="" data-page="home">   (data-root="../" for sub-folders)
     <div id="site-header"></div> ... <div id="site-footer"></div>
   ============================================================================= */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG;
  const u = U.url;
  const page = document.body.dataset.page || "";

  const LOGO = `<svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="11" fill="#0B1F3A"/>
      <circle cx="29" cy="11" r="3.6" fill="#F2A541"/>
      <path d="M8 21.5 20 11.5l12 10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 19.5V30h16V19.5" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
      <rect x="17.4" y="22.5" width="5.2" height="7.5" rx="1.2" fill="#F2A541"/>
    </svg>`;
  const [brandA, ...brandRest] = CFG.siteName.split(" ");
  const logo = (cls = "") => `<a class="logo ${cls}" href="${u("index.html")}" aria-label="${U.esc(CFG.siteName)} — home">${LOGO}
      <span class="logo__text">${U.esc(brandA)}<span>${U.esc(brandRest.join(" "))}</span></span></a>`;

  const nav = [
    { key: "home", label: "Home", href: "index.html" },
    { key: "hotels", label: "Hotels", href: "pages/hotels.html" },
    { key: "apartments", label: "Apartments", href: "pages/apartments.html" },
    { key: "airbnb", label: "Airbnb & Short Stays", href: "pages/airbnb.html" },
    { key: "houses", label: "Houses", href: "pages/houses.html" },
    { key: "restaurants", label: "Restaurants", href: "pages/restaurants.html" },
    {
      key: "explore", label: "Explore Nairobi", href: "pages/explore-nairobi.html",
      children: [
        { key: "locations", label: "Neighbourhood guides", href: "pages/locations.html", icon: "fa-map-location-dot" },
        { key: "explore-nairobi", label: "Nairobi travel guide", href: "pages/explore-nairobi.html", icon: "fa-compass" },
        { key: "airport", label: "JKIA airport transfers", href: "pages/airport-transfers.html", icon: "fa-plane-arrival" },
      ],
    },
  ];
  const secondary = [
    { key: "about", label: "About Us", href: "pages/about.html" },
    { key: "contact", label: "Contact", href: "pages/contact.html" },
    { key: "list", label: "List Your Property", href: "pages/list-your-property.html" },
  ];
  const isActive = (item) => item.key === page || (item.children || []).some((c) => c.key === page);
  const cur = (item) => (isActive(item) ? ' aria-current="page"' : "");

  function header() {
    const links = nav.map((item) => {
      if (!item.children) return `<li><a class="nav__link" href="${u(item.href)}"${cur(item)}>${item.label}</a></li>`;
      return `<li class="nav__dropdown">
          <button class="nav__link nav__toggle" type="button" aria-expanded="false" aria-controls="dd-${item.key}"${isActive(item) ? ' data-active="true"' : ""}>
            ${item.label} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
          <ul class="dropdown" id="dd-${item.key}">
            ${item.children.map((c) => `<li><a href="${u(c.href)}"${c.key === page ? ' aria-current="page"' : ""}><i class="fa-solid ${c.icon}" aria-hidden="true"></i> ${c.label}</a></li>`).join("")}
          </ul></li>`;
    }).join("");

    const mobileLinks = nav.flatMap((i) => (i.children ? i.children.map((c) => ({ ...c, label: c.label })) : [i]))
      .concat(secondary)
      .map((i) => `<li><a href="${u(i.href)}"${i.key === page ? ' aria-current="page"' : ""}>${i.label}</a></li>`).join("");

    return `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="topbar">
        <div class="container topbar__inner">
          <a class="topbar__wa" href="${Booking.waLink()}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> ${U.phoneDisplay()} <span class="hide-sm">· Book via WhatsApp</span></a>
          <ul class="topbar__links">
            ${secondary.map((s) => `<li><a href="${u(s.href)}"${s.key === page ? ' aria-current="page"' : ""}>${s.label}</a></li>`).join("")}
          </ul>
        </div>
      </div>
      <header class="header" id="top">
        <div class="container header__inner">
          ${logo()}
          <nav class="nav" aria-label="Main">
            <ul class="nav__list">${links}</ul>
          </nav>
          <a class="btn btn--primary header__cta" href="${u("pages/stays.html")}"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Find Accommodation</a>
          <button class="hamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
            <span></span><span></span><span></span></button>
        </div>
      </header>
      <div class="mobile-nav" id="mobile-nav" hidden>
        <div class="mobile-nav__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div class="mobile-nav__head">${logo()}
            <button class="mobile-nav__close" type="button" aria-label="Close menu"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>
          <ul class="mobile-nav__list">${mobileLinks}</ul>
          <a class="btn btn--primary btn--block" href="${u("pages/stays.html")}"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Find Accommodation</a>
          <a class="btn btn--whatsapp btn--block" href="${Booking.waLink(`Hello ${CFG.siteName}, I'd like help finding accommodation in Nairobi.`)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Chat on WhatsApp</a>
        </div>
      </div>`;
  }

  function footer() {
    const T = window.TAXONOMY;
    const year = new Date().getFullYear();
    const socials = Object.entries(CFG.socials).filter(([, v]) => v)
      .map(([k, v]) => `<a href="${U.esc(v)}" target="_blank" rel="noopener" aria-label="${k}"><i class="fa-brands fa-${k === "x" ? "x-twitter" : k}" aria-hidden="true"></i></a>`).join("");
    const typeLinks = Object.entries(T.types).slice(0, 7)
      .map(([k, t]) => `<li><a href="${u(T.groups[t.group].page)}?type=${k}">${t.label}</a></li>`).join("");
    const locLinks = window.LOCATIONS.filter((l) => l.popular).slice(0, 8)
      .map((l) => `<li><a href="${u(`locations/${l.slug}.html`)}">Stays in ${l.name}</a></li>`).join("");

    return `
      <section class="newsletter" aria-labelledby="nl-title">
        <div class="container newsletter__inner">
          <div>
            <h2 id="nl-title">Nairobi travel tips, straight to your inbox</h2>
            <p>New verified stays, neighbourhood guides and seasonal offers. No spam — unsubscribe anytime.</p>
          </div>
          <form class="newsletter__form" data-newsletter novalidate>
            <label class="visually-hidden" for="nl-email">Email address</label>
            <input id="nl-email" type="email" name="email" placeholder="Your email address" autocomplete="email" required>
            <button class="btn btn--primary" type="submit">Subscribe</button>
          </form>
        </div>
      </section>
      <footer class="footer">
        <div class="container footer__grid">
          <div class="footer__brand">
            ${logo("logo--light")}
            <p>${U.esc(CFG.siteName)} helps international visitors, business travellers and people relocating to Kenya find comfortable, safe places to stay in Nairobi — and book them easily on WhatsApp.</p>
            <ul class="footer__contact">
              <li><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> <a href="${Booking.waLink()}" target="_blank" rel="noopener">${U.phoneDisplay()}</a></li>
              <li><i class="fa-regular fa-envelope" aria-hidden="true"></i> <a href="mailto:${CFG.email}">${CFG.email}</a></li>
              <li><i class="fa-regular fa-clock" aria-hidden="true"></i> ${CFG.officeHours}</li>
            </ul>
            ${socials ? `<div class="footer__socials">${socials}</div>` : ""}
          </div>
          <nav aria-label="Accommodation types"><h3>Stay</h3><ul>${typeLinks}<li><a href="${u("pages/stays.html")}">All accommodation</a></li></ul></nav>
          <nav aria-label="Neighbourhoods"><h3>Neighbourhoods</h3><ul>${locLinks}<li><a href="${u("pages/locations.html")}">All neighbourhoods</a></li></ul></nav>
          <nav aria-label="Travellers"><h3>Travellers</h3><ul>
            <li><a href="${u("pages/explore-nairobi.html")}">Nairobi travel guide</a></li>
            <li><a href="${u("pages/airport-transfers.html")}">JKIA airport transfers</a></li>
            <li><a href="${u("pages/restaurants.html")}">Restaurants in Nairobi</a></li>
            <li><a href="${u("pages/booking-policy.html")}">How booking works</a></li>
          </ul></nav>
          <nav aria-label="Company"><h3>Company</h3><ul>
            <li><a href="${u("pages/about.html")}">About us</a></li>
            <li><a href="${u("pages/contact.html")}">Contact</a></li>
            <li><a href="${u("pages/list-your-property.html")}">List your property</a></li>
            <li><a href="${u("pages/privacy-policy.html")}">Privacy policy</a></li>
            <li><a href="${u("pages/terms.html")}">Terms of service</a></li>
          </ul></nav>
        </div>
        <div class="container footer__bottom">
          <p>© ${year} ${U.esc(CFG.siteName)}. All rights reserved.</p>
          <p class="footer__disclaimer">${U.esc(CFG.siteName)} is an independent accommodation discovery service and is not affiliated with Airbnb, Booking.com or the businesses shown unless stated. Listings marked “Sample” are demonstrations. Bookings are confirmed only after availability and payment are verified. Photos: <a href="https://unsplash.com/license" target="_blank" rel="noopener">Unsplash</a> (illustrative).</p>
        </div>
      </footer>
      <a class="wa-float" href="${Booking.waLink(`Hello ${CFG.siteName}, I'd like help finding accommodation in Nairobi.`)}" target="_blank" rel="noopener" aria-label="${U.esc(CFG.whatsapp.label)}">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span class="wa-float__label">${U.esc(CFG.whatsapp.label)}</span></a>`;
  }

  /* Render ---------------------------------------------------------------- */
  const h = U.$("#site-header"), f = U.$("#site-footer");
  if (h) h.outerHTML = header();
  if (f) f.outerHTML = footer();

  /* Sticky header shadow */
  const hdr = U.$(".header");
  const onScroll = () => hdr && hdr.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Desktop dropdowns (click + keyboard; hover handled in CSS) */
  U.$$(".nav__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      U.$$(".nav__toggle").forEach((b) => b.setAttribute("aria-expanded", "false"));
      btn.setAttribute("aria-expanded", String(!open));
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav__dropdown")) U.$$(".nav__toggle").forEach((b) => b.setAttribute("aria-expanded", "false"));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") U.$$(".nav__toggle[aria-expanded=true]").forEach((b) => { b.setAttribute("aria-expanded", "false"); b.focus(); });
  });

  /* Mobile navigation */
  const burger = U.$(".hamburger"), mnav = U.$("#mobile-nav");
  const openNav = () => {
    mnav.hidden = false; burger.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("no-scroll");
    requestAnimationFrame(() => mnav.classList.add("open"));
    U.$(".mobile-nav__close").focus();
  };
  const closeNav = () => {
    mnav.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("no-scroll");
    setTimeout(() => (mnav.hidden = true), 250);
    burger.focus();
  };
  if (burger) {
    burger.addEventListener("click", openNav);
    U.$(".mobile-nav__close").addEventListener("click", closeNav);
    mnav.addEventListener("click", (e) => { if (e.target === mnav) closeNav(); });
    mnav.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
  }

  /* Newsletter: POST to configured endpoint, otherwise email fallback */
  document.addEventListener("submit", async (e) => {
    const form = e.target.closest("[data-newsletter]");
    if (!form) return;
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { U.toast("Please enter a valid email address."); form.email.focus(); return; }
    const ep = CFG.forms.newsletterEndpoint;
    if (ep) {
      try { await U.postForm(ep, { email, source: location.pathname }); U.toast("Thanks! You're subscribed."); form.reset(); }
      catch (err) { U.toast("Sorry, something went wrong. Please try again later."); }
    } else {
      window.location.href = `mailto:${CFG.email}?subject=${encodeURIComponent("Newsletter subscription")}&body=${encodeURIComponent(`Please subscribe ${email} to the ${CFG.siteName} newsletter.`)}`;
      U.toast("Your email app is opening to confirm your subscription.");
    }
  });

  /* Reveal-on-scroll (disabled for reduced motion in CSS) */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    window.observeReveal = (root = document) => U.$$(".reveal:not(.in)", root).forEach((el) => io.observe(el));
  } else window.observeReveal = (root = document) => U.$$(".reveal", root).forEach((el) => el.classList.add("in"));
  window.observeReveal();

  U.initCurrency();
})();
