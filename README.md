# Makao Stays — Nairobi Accommodation & Travel Discovery Website

A fast, responsive, SEO-friendly static website for discovering and booking accommodation and restaurants in Nairobi, Kenya. Bookings are sent as pre-filled **WhatsApp** requests.

Built with **HTML5, CSS3 and vanilla JavaScript**. There is no framework and no build step. Any static host can serve it.

> ⚠️ **All current listings and restaurants are SAMPLES** (`sample: true`). Their names are invented and their photos are illustrative stock images from Unsplash. They are clearly labelled on the site and are set to `noindex`. Replace them with verified data before launch.

---

## 1. Quick start

```bash
# from the project folder, start any static server, e.g.
python -m http.server 8000
# then open http://localhost:8000
```

You can also open `index.html` straight from disk, but a local server is recommended because the OpenStreetMap embeds need an `http://` origin.

---

## 2. Values you MUST replace before launch

All of these live in **`js/config.js`**, the single source of truth:

| Setting | Current placeholder | What to put |
|---|---|---|
| `whatsapp.number` | `254700000000` | Your business WhatsApp in international format, digits only. `0712 345 678` → `254712345678` |
| `email` | `hello@example.com` | Your business email |
| `siteUrl` | `https://www.example.com` | Your live domain, with no trailing slash |
| `siteName` | `Makao Stays` | Your brand name, if different |
| `currency.usdRate` / `rateUpdated` | `129` / `2026-11-01` | The current KES per 1 USD, and the date you set it |
| `socials.*` | empty | Only accounts you actually own |
| `showSampleListings` | `true` | Set to `false` once real listings are added |
| `tracking.endpoint` | empty | **Your booking tracker URL.** Logs every booking request and enquiry to a Google Sheet. Setup: [docs/BOOKING-TRACKING.md](docs/BOOKING-TRACKING.md) |
| `forms.*Endpoint` | empty | Optional: Formspree/Getform URLs (see §6) |

### Update the domain and brand inside the static HTML

The `<head>` of every page contains the canonical URL, Open Graph tags and JSON-LD. These are static for SEO, so they need updating too. Run (requires Node.js):

```bash
node tools/configure.js --domain https://www.yourdomain.co.ke --name "Your Brand"
node tools/build-sitemap.js
```

`configure.js` reads the current values from `js/config.js` and replaces them everywhere, including in `config.js` itself.

### Where is the WhatsApp number used?

Only in `js/config.js`. Every Book Now button, the floating WhatsApp button, the header, the footer and all forms build their links through `Booking.waLink()` in `js/booking.js`.

---

## 3. Project structure

```
/
├── index.html                  Homepage
├── 404.html                    Not-found page
├── pages/
│   ├── stays.html              All accommodation + search results
│   ├── hotels.html             Luxury & budget hotels
│   ├── apartments.html         Serviced, furnished & long-term
│   ├── airbnb.html             Airbnb-style short stays & private rooms
│   ├── houses.html             Vacation homes, villas, guest houses
│   ├── property-details.html   Dynamic: ?id=<property-id>
│   ├── restaurants.html        Restaurant discovery
│   ├── restaurant-details.html Dynamic: ?id=<restaurant-id>
│   ├── locations.html          Neighbourhood index + comparison table
│   ├── explore-nairobi.html    Travel guide for international visitors
│   ├── airport-transfers.html  JKIA info, transfer request form, stays near JKIA
│   ├── about.html  contact.html  list-your-property.html
│   └── privacy-policy.html  terms.html  booking-policy.html
├── locations/                  14 generated neighbourhood SEO pages
├── css/
│   ├── style.css               Design tokens, components (mobile-first)
│   └── responsive.css          Breakpoints (600 / 900 / 1200px)
├── js/
│   ├── config.js               ★ Business settings (WhatsApp, brand, currency)
│   ├── utils.js                Helpers: images, money, dates, SEO meta, maps
│   ├── booking.js              ★ WhatsApp message builder + booking modal
│   ├── layout.js               Header, nav, footer, floating WhatsApp, newsletter
│   ├── listings.js             Cards + filter/sort engine
│   ├── search.js               Hero search form
│   ├── forms.js                Contact / list-property / transfer forms
│   ├── property-details.js     Property page, gallery lightbox, structured data
│   ├── restaurants.js          Restaurant list & details
│   └── main.js                 Wires up data-driven sections on each page
├── data/
│   ├── properties.js           ★ Accommodation listings
│   ├── restaurants.js          ★ Restaurant listings
│   ├── locations.js            Neighbourhood guides
│   └── taxonomy.js             Types, amenities, cuisines, price levels
├── images/                     Logo, favicons (put your own property photos here)
├── docs/
│   └── BOOKING-TRACKING.md     ★ How to track bookings in Google Sheets
├── tools/                      Optional Node helpers (not needed to run the site)
│   └── booking-tracker/Code.gs Google Apps Script for the booking tracker sheet
├── sitemap.xml  robots.txt  site.webmanifest
```

The script load order matters: config → data → utils → booking → layout → the rest. Every page already includes them in this order.

---

## 4. Adding and editing listings

### Add a hotel, apartment, house or short stay

1. Put the photos in `images/properties/` (JPG/WebP, about 1600px wide, under 300 KB each).
2. Open `data/properties.js`, copy one object, and edit it. The full field reference is in the comment at the top of the file. The key fields are:

```js
{
  id: "westlands-garden-suites",        // unique, lowercase-with-hyphens → URL
  sample: false,                        // real listing
  verified: true,                       // ONLY after you have verified it
  available: true,                      // false disables Book Now
  featured: true,                       // show on the homepage
  name: "Garden Suites Westlands",
  type: "serviced-apartments",          // see data/taxonomy.js → types
  location: "westlands",                // see data/locations.js → slug
  price: { amount: 9500, unit: "night" },   // KES; unit "night" or "month"
  maxGuests: 2, bedrooms: 1, bathrooms: 1,  // bedrooms: 0 = studio
  summary: "One sentence for the card.",
  description: ["Paragraph one.", "Paragraph two."],
  amenities: ["wifi", "parking", "hotShower"],   // verified amenities only
  images: [{ src: "images/properties/garden-1.jpg", alt: "Living room with garden view" }],
  checkIn: "2:00 PM", checkOut: "10:00 AM", minNights: 1,
  houseRules: ["No smoking indoors"],
  nearby: ["Sarit Centre"],
  coords: null,                         // or [lat, lng]; null = neighbourhood centre
}
```

Which page a listing appears on depends on its `type`:

| Page | Types |
|---|---|
| Hotels | `luxury-hotels`, `budget-hotels` |
| Apartments | `serviced-apartments`, `furnished-apartments`, `long-term-rentals` |
| Airbnb & Short Stays | `holiday-apartments`, `private-rooms` |
| Houses | `vacation-homes`, `villas`, `guest-houses` |

Every listing also appears on `stays.html`, on its neighbourhood page and in search results automatically.

3. Run `node tools/build-sitemap.js` so the new listing's URL is added to `sitemap.xml`. Sample listings are always left out.

**Structured data:** `Hotel`/`LodgingBusiness` JSON-LD is only output when `sample: false` and `verified: true`.

### Add a restaurant

Edit `data/restaurants.js` the same way. Only publish `phone`, `website` and `hours` after verifying them with the business; leave them as `null` otherwise. The site never claims that a restaurant offers accommodation. Its enquiry button sends a message to *your* WhatsApp number.

### Add a neighbourhood

1. Add an entry to `data/locations.js`.
2. Run `node tools/generate-location-pages.js`, which creates `locations/<slug>.html`.
3. Run `node tools/build-sitemap.js`.

### Add an amenity, type or cuisine

Edit `data/taxonomy.js`. Icons are [Font Awesome 6 Free](https://fontawesome.com/search?o=r&m=free) class names.

### Remove the sample data

Set `showSampleListings: false` in `js/config.js`. This hides every `sample: true` item and the sample notices. You can also delete the sample objects.

---

## 5. How the WhatsApp booking flow works

1. The visitor searches. Dates and guests are kept in `sessionStorage` while they browse.
2. **Book Now** opens a modal with check-in, check-out (minimum-stay aware), guests, an optional name and notes, and an estimated total.
3. `Booking.buildMessage()` builds the request. `Booking.waLink()` encodes it with `encodeURIComponent()` into `https://wa.me/<number>?text=…`. This works with the WhatsApp apps, WhatsApp Desktop and WhatsApp Web.
4. The modal then explains clearly that **the booking is not confirmed yet**: availability and payment instructions come from you on WhatsApp.

Example generated message:

```
Hello, I found your property on Makao Stays and would like to make a booking.

Booking ref: MK-261115-7QF2
Property: Skyline Serviced Suites
Listing ref: westlands-skyline-serviced-suites
Location: Westlands, Nairobi
Price per night: KES 9,500 (≈ US$74)
Check-in: Sun, 15 Nov 2026
Check-out: Wed, 18 Nov 2026
Number of nights: 3
Number of guests: 2

Please confirm availability and send me the payment instructions.
```

The listing ref lets you find the exact property in your data quickly.

### Tracking bookings

If `tracking.endpoint` is set, each request is also saved to your **Google Sheet booking tracker**, with a booking reference (e.g. `MK-261115-7QF2`) that also appears in the WhatsApp message. You can then move each request through **New → Contacted → Awaiting payment → Confirmed → Completed**, with a Summary tab and optional email alerts. Contact, airport-transfer, restaurant and list-your-property forms are logged on an **Enquiries** tab.

Setup takes about 10 minutes: see **[docs/BOOKING-TRACKING.md](docs/BOOKING-TRACKING.md)**. Logging never blocks WhatsApp; if the sheet is unreachable, the guest's request still goes through.

---

## 6. Forms and newsletter

The contact, list-your-property and airport transfer forms turn the fields into a WhatsApp message by default. The contact form can also go by email.

If you set an endpoint in `config.forms` (for example a [Formspree](https://formspree.io) form URL), the form is POSTed there as JSON instead. If that request fails, the form falls back to WhatsApp.

The newsletter POSTs to `forms.newsletterEndpoint` if one is set (Mailchimp, Brevo, ConvertKit and Formspree all work). Otherwise it opens a pre-filled email to you.

The website does not store any submitted data itself.

---

## 7. Currency

USD figures use `currency.usdRate` and are always labelled as approximate. To fetch a live rate once per visit, set `currency.useLiveRate: true`. It uses `open.er-api.com` by default (check its terms first) and falls back to the fixed rate if the request fails.

---

## 8. Deployment

This is a plain static site. Upload the folder (the `tools/` folder is optional) to any of these:

- **Netlify:** drag and drop the folder at app.netlify.com/drop, or connect a Git repo. No build command; publish directory `/`. `404.html` is used automatically.
- **Cloudflare Pages / Vercel:** framework "None", no build command, output directory `/`.
- **GitHub Pages:** push to a repo and enable Pages. If you deploy to a project sub-path (`user.github.io/repo/`), all links still work because they are relative. Only `404.html` assumes the site is at the domain root.
- **cPanel / shared hosting:** upload to `public_html` with the File Manager or FTP.

After deploying:

1. Run `tools/configure.js` with your real domain (see §2), then redeploy.
2. Submit `https://yourdomain/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
3. Create a **Google Business Profile** for local SEO, using your real business address and phone.
4. Test Book Now on a phone and a desktop with your real number.

---

## 9. SEO features included

- A unique `<title>`, meta description, canonical URL, Open Graph and Twitter Card tags on every page.
- Dedicated SEO pages for categories (hotels, apartments, short stays, houses) and for 14 neighbourhoods, targeting searches like "hotels in Westlands Nairobi" and "furnished apartments in Kilimani".
- JSON-LD: `WebSite` + `Organization` (home), `BreadcrumbList` (all inner pages), and `Hotel`/`LodgingBusiness`/`Restaurant` (verified real listings only).
- Semantic HTML, one `<h1>` per page, descriptive alt text, internal linking, `sitemap.xml` and `robots.txt`.
- Sample listings are `noindex` and left out of the sitemap.
- Fast loading: responsive `srcset` images from the Unsplash CDN, lazy loading, a preloaded hero image, no framework, and about 90 KB of unminified first-party JS (plus about 55 KB of data files).

**Clean URLs:** pages use descriptive `.html` paths so they work on every host and from disk. Netlify ("Pretty URLs") and Vercel (`"cleanUrls": true`) can serve them without `.html`. If you enable that, update the canonical URLs to match.

**Never** add fake reviews, ratings or `AggregateRating` markup.

---

## 10. Backend needed for a production admin dashboard

The current version deliberately has **no admin panel**. A front-end-only "admin" cannot save data securely, and fake authentication would be a security risk. You manage listings by editing `data/*.js`, which a developer or a Git-based workflow can handle.

To let staff manage listings from a browser, you will need:

| Need | Recommended options |
|---|---|
| Database | Supabase (Postgres), Firebase Firestore, or MySQL/Postgres on your server |
| Authentication | Supabase Auth, Firebase Auth or Auth0, with role-based access (admin/owner) |
| Image uploads | Supabase Storage, Cloudinary or S3, with automatic resizing to WebP |
| Admin UI | A small dashboard (Next.js/Laravel/Django), or a headless CMS such as **Decap CMS** (Git-based, works with Netlify) or **Sanity/Strapi** |
| API | Server-side endpoints to create/edit/delete properties and restaurants, set availability, prices and featured flags, and change the WhatsApp number |
| Availability | An availability calendar table, optionally synced with owners' iCal feeds |
| Security | Server-side validation, HTTPS, rate limiting, audit logs, regular backups |
| Payments (optional) | M-Pesa Daraja API, Pesapal, Flutterwave or Stripe, only with proper reconciliation and refund handling |
| Notifications | WhatsApp Business API or email for booking alerts |

The front end is already structured for this. Swap the `window.PROPERTIES` array for a `fetch()` to your API that returns the same JSON shape, and the rest of the site works unchanged.

**Easiest next step:** Decap CMS with Netlify Identity can edit JSON data files through a web form, with no server to run.

---

## 11. Legal and business checklist

- [ ] Have the Privacy Policy, Terms and Booking Policy reviewed by a Kenyan lawyer (they are templates).
- [ ] Register with the Office of the Data Protection Commissioner if required.
- [ ] Verify every property in person or with documents before setting `verified: true`.
- [ ] Get written permission from owners to use their photos and information.
- [ ] Only publish restaurant contact details you have confirmed with the business.
- [ ] Use your own photographs, or licensed photos, of real properties. Never present stock photos as a real property.

## Credits

- Photos: [Unsplash](https://unsplash.com) (Unsplash License), used as illustrative sample imagery.
- Icons: [Font Awesome Free](https://fontawesome.com) · Fonts: Fraunces & Plus Jakarta Sans (Google Fonts).
- Maps: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
