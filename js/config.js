/* =============================================================================
   SITE CONFIGURATION — the ONE place to change business details.
   -----------------------------------------------------------------------------
   Every page loads this file first. Nothing else in the codebase hardcodes the
   WhatsApp number, brand name, email or exchange rate.
   ============================================================================= */
window.SITE_CONFIG = {
  /* Brand ------------------------------------------------------------------ */
  siteName: "Makao Stays",
  tagline: "Nairobi stays, thoughtfully chosen",
  // Public URL of the live site (no trailing slash). Also run
  // `node tools/set-domain.js https://your-domain.com` to update static HTML.
  siteUrl: "https://www.example.com",

  /* Contact ---------------------------------------------------------------- */
  whatsapp: {
    // International format, digits only, NO "+", NO spaces, NO leading 0.
    // Example for a Safaricom number 0712 345 678  ->  "254712345678"
    // !!! REPLACE THIS PLACEHOLDER WITH THE REAL BUSINESS NUMBER !!!
    number: "254700000000",
    // Shown on the floating button tooltip
    label: "Chat with us on WhatsApp",
  },
  email: "hello@example.com",          // !!! REPLACE
  phoneDisplay: null,                   // e.g. "+254 712 345 678" — null = derived from WhatsApp number
  officeHours: "Mon–Sun, 7:00 AM – 10:00 PM (EAT, UTC+3)",
  socials: {
    // Leave "" to hide an icon. Only add accounts you actually own.
    instagram: "",
    facebook: "",
    x: "",
    tiktok: "",
  },

  /* Currency --------------------------------------------------------------- */
  currency: {
    // Approximate KES per 1 USD used for the "≈ US$" figures.
    // Update periodically. Shown to visitors as an approximation.
    usdRate: 129,
    rateUpdated: "2026-11-01",
    // Optional live rate. When true the site fetches the rate once per visit
    // from liveRateUrl and falls back to usdRate if the request fails.
    // open.er-api.com is a free, keyless endpoint (check its terms before production use).
    useLiveRate: false,
    liveRateUrl: "https://open.er-api.com/v6/latest/USD",
  },

  /* Listings --------------------------------------------------------------- */
  // Set to false once you have real, verified listings so demo data disappears.
  showSampleListings: true,

  /* Optional form endpoints ------------------------------------------------- */
  // Leave "" to use the built-in fallbacks (WhatsApp / email).
  // Works with Formspree, Getform, Basin, Netlify Forms etc. (POST, JSON body).
  forms: {
    contactEndpoint: "",
    newsletterEndpoint: "",
    listPropertyEndpoint: "",
  },
};
