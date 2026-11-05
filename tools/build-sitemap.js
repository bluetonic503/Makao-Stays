#!/usr/bin/env node
/* =============================================================================
   Builds sitemap.xml and robots.txt from the pages on disk + data files.
   - Includes every .html page except 404 / pages marked noindex.
   - Includes property & restaurant detail URLs ONLY for real listings
     (sample: false). Sample listings are never submitted to search engines.

   Usage:  node tools/build-sitemap.js
   ============================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const { ROOT, loadData } = require("./_template");

const W = loadData();
const SITE = W.SITE_CONFIG.siteUrl.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (["node_modules", ".git", "tools", "docs"].includes(f)) continue;
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) files.push(path.relative(ROOT, p).replace(/\\/g, "/"));
  }
})(ROOT);

const DYNAMIC = ["pages/property-details.html", "pages/restaurant-details.html"];
const urls = [];
for (const f of files.sort()) {
  if (f === "404.html" || DYNAMIC.includes(f)) continue;
  const html = fs.readFileSync(path.join(ROOT, f), "utf8");
  if (/<meta name="robots" content="noindex/i.test(html)) continue;
  const loc = f === "index.html" ? `${SITE}/` : `${SITE}/${f}`;
  const priority = f === "index.html" ? "1.0" : f.startsWith("locations/") || /pages\/(stays|hotels|apartments|airbnb|houses|restaurants)\.html/.test(f) ? "0.8" : "0.5";
  urls.push({ loc, priority });
}
for (const p of W.PROPERTIES.filter((x) => !x.sample)) urls.push({ loc: `${SITE}/pages/property-details.html?id=${encodeURIComponent(p.id)}`, priority: "0.7" });
for (const r of W.RESTAURANTS.filter((x) => !x.sample)) urls.push({ loc: `${SITE}/pages/restaurant-details.html?id=${encodeURIComponent(r.id)}`, priority: "0.5" });

const xmlEsc = (s) => s.replace(/&/g, "&amp;");
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${xmlEsc(u.loc)}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);

fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *
Allow: /
Disallow: /tools/
Disallow: /docs/

Sitemap: ${SITE}/sitemap.xml
`);
console.log(`sitemap.xml written with ${urls.length} URLs; robots.txt updated.`);
