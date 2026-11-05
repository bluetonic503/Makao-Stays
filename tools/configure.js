#!/usr/bin/env node
/* =============================================================================
   Replace the placeholder domain and/or brand name across all HTML, XML,
   TXT, JSON and JS config files in one go.

   Usage:
     node tools/configure.js --domain https://www.yourdomain.co.ke
     node tools/configure.js --name "Your Brand"
     node tools/configure.js --domain https://www.yourdomain.co.ke --name "Your Brand"

   It reads the CURRENT values from js/config.js, so you can run it again later.
   Afterwards run:  node tools/build-sitemap.js
   ============================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const { ROOT, loadData } = require("./_template");

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
const newDomain = get("--domain");
const newName = get("--name");
if (!newDomain && !newName) {
  console.log('Usage: node tools/configure.js --domain https://example.co.ke --name "Brand Name"');
  process.exit(1);
}
if (newDomain && !/^https?:\/\/[^/\s]+$/.test(newDomain)) {
  console.error("Domain must look like https://www.example.co.ke (no trailing slash).");
  process.exit(1);
}

const CFG = loadData().SITE_CONFIG;
const replacements = [];
if (newDomain) replacements.push([CFG.siteUrl, newDomain]);
if (newName) replacements.push([CFG.siteName, newName]);

let changed = 0;
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (["node_modules", ".git", "tools"].includes(f)) continue;
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(html|xml|txt|json|webmanifest)$/.test(f) && p !== path.join(ROOT, "js", "config.js")) continue;
    let s = fs.readFileSync(p, "utf8");
    const before = s;
    for (const [a, b] of replacements) s = s.split(a).join(b);
    if (s !== before) { fs.writeFileSync(p, s); changed++; }
  }
})(ROOT);
console.log(`Updated ${changed} file(s).`);
