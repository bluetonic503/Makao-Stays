/* =============================================================================
   UTILITIES — shared helpers used by every page.
   ============================================================================= */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG;
  const TAX = window.TAXONOMY;

  const U = {};

  /* DOM ------------------------------------------------------------------- */
  U.$ = (sel, ctx = document) => ctx.querySelector(sel);
  U.$$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  U.esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Paths: every page sets <body data-root=""> or <body data-root="../"> */
  U.root = () => document.body.dataset.root || "";
  U.url = (path) => U.root() + path;

  /* Images ---------------------------------------------------------------- */
  // `src` may be an Unsplash photo id, an absolute URL, or a site-relative path.
  const isUnsplashId = (s) => /^\d{10,}-[0-9a-f]+$/i.test(s);
  U.img = (src, w = 800, h) => {
    if (!src) return "";
    if (isUnsplashId(src)) {
      let u = `https://images.unsplash.com/photo-${src}?auto=format&fit=crop&w=${w}&q=70`;
      if (h) u += `&h=${h}`;
      return u;
    }
    if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
    return U.url(src);
  };
  U.srcset = (src, widths = [400, 640, 960, 1280], ratio) => {
    if (!isUnsplashId(src)) return "";
    return widths.map((w) => `${U.img(src, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`).join(", ");
  };
  // Full <img> tag helper
  U.imgTag = (image, { w = 800, ratio, sizes = "(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw", eager = false, cls = "" } = {}) => {
    const set = U.srcset(image.src, undefined, ratio);
    return `<img src="${U.img(image.src, w, ratio ? Math.round(w * ratio) : undefined)}"${set ? ` srcset="${set}" sizes="${sizes}"` : ""}
      alt="${U.esc(image.alt || "")}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ""}>`;
  };

  /* Money ----------------------------------------------------------------- */
  let usdRate = CFG.currency.usdRate;
  let rateSource = `fixed rate set ${CFG.currency.rateUpdated}`;
  U.formatKES = (n) => "KES " + Math.round(n).toLocaleString("en-KE");
  U.formatUSD = (kes) => {
    const v = kes / usdRate;
    return "≈ US$" + (v >= 100 ? Math.round(v).toLocaleString("en-US") : v.toFixed(0));
  };
  U.rateNote = () => `US$ amounts are approximate (1 USD ≈ KES ${usdRate.toFixed(0)}, ${rateSource}). You pay the amount quoted in KES.`;
  U.usdSpan = (kes) => `<span class="usd js-usd" data-kes="${kes}" title="Approximate conversion">${U.formatUSD(kes)}</span>`;
  U.refreshUSD = () => U.$$(".js-usd").forEach((el) => (el.textContent = U.formatUSD(+el.dataset.kes)));
  U.initCurrency = async () => {
    if (!CFG.currency.useLiveRate) return;
    try {
      const cached = sessionStorage.getItem("makao.usdRate");
      if (cached) { usdRate = +cached; rateSource = "live rate"; U.refreshUSD(); return; }
    } catch (e) { /* storage unavailable */ }
    try {
      const res = await fetch(CFG.currency.liveRateUrl);
      const data = await res.json();
      const r = data && data.rates && data.rates.KES;
      if (r && r > 50 && r < 500) {
        usdRate = r; rateSource = "live rate";
        try { sessionStorage.setItem("makao.usdRate", String(r)); } catch (e) {}
        U.refreshUSD();
        U.$$(".js-rate-note").forEach((el) => (el.textContent = U.rateNote()));
      }
    } catch (e) { /* keep fallback rate */ }
  };

  /* Phone ----------------------------------------------------------------- */
  U.formatPhone = (digits) => {
    const d = String(digits).replace(/\D/g, "");
    if (d.startsWith("254") && d.length === 12) return `+254 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
    return "+" + d;
  };
  U.phoneDisplay = () => CFG.phoneDisplay || U.formatPhone(CFG.whatsapp.number);
  U.isPlaceholderNumber = () => /^2547?0{7,}$/.test(CFG.whatsapp.number);

  /* Dates ----------------------------------------------------------------- */
  const pad = (n) => String(n).padStart(2, "0");
  U.toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  U.todayISO = () => U.toISO(new Date());
  U.addDays = (iso, n) => { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n); return U.toISO(d); };
  U.nights = (a, b) => (a && b ? Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 864e5) : 0);
  U.formatDate = (iso) =>
    iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";

  /* Search state (shared between search form, listings and booking) -------- */
  const KEY = "makao.search";
  U.getSearch = () => { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  U.setSearch = (patch) => {
    const next = Object.assign(U.getSearch(), patch);
    try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
    return next;
  };
  U.params = () => Object.fromEntries(new URLSearchParams(location.search));

  /* Data access ----------------------------------------------------------- */
  U.properties = () => (window.PROPERTIES || []).filter((p) => CFG.showSampleListings || !p.sample);
  U.restaurants = () => (window.RESTAURANTS || []).filter((r) => CFG.showSampleListings || !r.sample);
  U.property = (id) => U.properties().find((p) => p.id === id);
  U.restaurant = (id) => U.restaurants().find((r) => r.id === id);
  U.location = (slug) => (window.LOCATIONS || []).find((l) => l.slug === slug);
  U.locationName = (slug) => (U.location(slug) || {}).name || slug;
  U.type = (key) => TAX.types[key] || { label: key, icon: "fa-house" };
  U.nightly = (p) => (p.price.unit === "month" ? p.price.amount / 30 : p.price.amount);
  U.priceUnit = (p) => (p.price.unit === "month" ? "month" : "night");
  U.bedroomsLabel = (n) => (n === 0 ? "Studio" : `${n} bedroom${n > 1 ? "s" : ""}`);
  U.coords = (item) => item.coords || (U.location(item.location) || {}).coords;

  /* Meta / SEO for dynamically rendered pages ----------------------------- */
  U.setMeta = (attr, key, content) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", content);
  };
  U.setCanonical = (href) => {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) { el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); }
    el.href = href;
  };
  U.addJsonLd = (obj) => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  };

  /* OpenStreetMap embed (approximate area — no exact address) ------------- */
  U.mapEmbed = (coords, label) => {
    if (!coords) return "";
    const [lat, lng] = coords, d = 0.012;
    const bbox = [lng - d, lat - d, lng + d, lat + d].map((n) => n.toFixed(4)).join("%2C");
    return `<iframe class="map-frame" title="Map of ${U.esc(label)}" loading="lazy"
      src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik&amp;marker=${lat}%2C${lng}"></iframe>
      <a class="map-link" href="https://www.openstreetmap.org/?mlat=${lat}&amp;mlon=${lng}#map=15/${lat}/${lng}" target="_blank" rel="noopener">View larger map <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>`;
  };

  /* Toast ----------------------------------------------------------------- */
  U.toast = (msg) => {
    let t = U.$("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(U._toastTimer);
    U._toastTimer = setTimeout(() => t.classList.remove("show"), 4200);
  };

  /* Generic form submit to optional endpoint ------------------------------ */
  U.postForm = async (endpoint, data) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Request failed: " + res.status);
    return res;
  };

  window.U = U;
})();
