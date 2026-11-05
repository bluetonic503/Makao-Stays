/* =============================================================================
   Shared HTML template used by the Node helper scripts in /tools.
   (The website itself does not need Node — these are optional helpers.)
   ============================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

/** Load the browser data files (window.X = ...) into a plain object. */
function loadData() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const f of ["js/config.js", "data/taxonomy.js", "data/locations.js", "data/properties.js", "data/restaurants.js"]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f });
  }
  return sandbox.window;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const unsplash = (id, w = 1200, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=70`;

const SCRIPTS = [
  "js/config.js", "data/taxonomy.js", "data/locations.js", "data/properties.js", "data/restaurants.js",
  "js/utils.js", "js/booking.js", "js/layout.js", "js/listings.js", "js/search.js", "js/forms.js", "js/main.js",
];

/**
 * page({ file, root, key, title, description, ogImage, body, jsonLd, extraScripts, robots })
 * file: path relative to site root, e.g. "pages/hotels.html"
 */
function page(o) {
  const W = o.data || loadData();
  const CFG = W.SITE_CONFIG;
  const url = `${CFG.siteUrl}/${o.file === "index.html" ? "" : o.file}`;
  const og = o.ogImage || unsplash("1611348524140-53c9a25263d6", 1200, 630);
  const ld = (o.jsonLd || []).map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n  ");
  const scripts = SCRIPTS.concat(o.extraScripts || []).map((s) => `<script src="${o.root}${s}" defer></script>`).join("\n  ");
  return `<!DOCTYPE html>
<html lang="en-KE">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.description)}">
  <meta name="robots" content="${o.robots || "index, follow"}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#0b1f3a">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(CFG.siteName)}">
  <meta property="og:locale" content="en_KE">
  <meta property="og:title" content="${esc(o.title)}">
  <meta property="og:description" content="${esc(o.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${esc(og)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(o.title)}">
  <meta name="twitter:description" content="${esc(o.description)}">
  <meta name="twitter:image" content="${esc(og)}">
  <meta name="geo.region" content="KE-30">
  <meta name="geo.placename" content="Nairobi">
  <link rel="icon" href="${o.root}images/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${o.root}images/apple-touch-icon.png">
  <link rel="manifest" href="${o.root}site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com">
  ${o.preload || ""}
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
  <link rel="stylesheet" href="${o.root}css/style.css">
  <link rel="stylesheet" href="${o.root}css/responsive.css">
  ${ld}
</head>
<body data-root="${o.root}" data-page="${o.key}">
  <div id="site-header"></div>
  <main id="main">
    <noscript><p class="notice notice--info container" style="margin-top:16px">Please enable JavaScript to search listings and send booking requests. You can also email us at ${esc(CFG.email)}.</p></noscript>
${o.body}
  </main>
  <div id="site-footer"></div>
  ${scripts}
</body>
</html>
`;
}

function breadcrumbLd(CFG, items) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map(([name, file], i) => ({
      "@type": "ListItem", position: i + 1, name, item: `${CFG.siteUrl}/${file === "index.html" ? "" : file}`,
    })),
  };
}

function breadcrumbHtml(root, items) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${items.map(([name, file], i) =>
    i === items.length - 1 ? `<li aria-current="page">${esc(name)}</li>` : `<li><a href="${root}${file}">${esc(name)}</a></li>`).join("")}</ol></nav>`;
}

function write(file, html) {
  const out = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return out;
}

module.exports = { ROOT, loadData, esc, unsplash, page, breadcrumbLd, breadcrumbHtml, write };
