/* =============================================================================
   RESTAURANTS
   -----------------------------------------------------------------------------
   ⚠️  ALL RESTAURANTS BELOW ARE SAMPLES (sample: true) with invented names.
   They demonstrate the layout only. Replace them with real restaurants ONLY
   after verifying their details directly with the business.

   Fields:
   {
     id: "unique-url-slug",
     sample: false, verified: true,
     name: "Restaurant name",
     cuisine: "kenyan",                 // key from data/taxonomy.js -> cuisines
     location: "westlands",             // slug from data/locations.js
     priceLevel: 2,                     // 1–4, see taxonomy.priceLevels
     summary: "One-sentence card text",
     description: ["Paragraph 1"],
     highlights: ["Outdoor seating", "Vegetarian options"],
     hours: "Daily 8 AM – 10 PM",       // or null if unverified
     phone: "+254 7xx xxx xxx",         // VERIFIED only, else null
     website: "https://...",            // VERIFIED official site only, else null
     images: [{ src: "...", alt: "..." }],
     coords: null,
   }
   Visitors are NEVER told a restaurant offers accommodation; the enquiry
   button sends a reservation/info request to OUR WhatsApp number.
   ============================================================================= */
window.RESTAURANTS = [
  {
    id: "mlo-kitchen-south-c", sample: true, verified: false,
    name: "Mlo Kitchen", cuisine: "kenyan", location: "south-c", priceLevel: 1,
    summary: "Nyama choma, ugali, sukuma wiki and pilau in a relaxed local setting.",
    description: ["A sample listing showing how a Kenyan restaurant would appear — think goat or beef nyama choma, kachumbari, ugali and sukuma wiki, with fresh juices."],
    highlights: ["Nyama choma", "Outdoor seating", "Group friendly"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1529692236671-f1f6cf9683ba", alt: "Grilled meat being sliced on a wooden board" },
      { src: "1544025162-d76694265947", alt: "Grilled ribs with tomatoes and sides" },
    ],
    coords: null,
  },
  {
    id: "baobab-table-kilimani", sample: true, verified: false,
    name: "Baobab Table", cuisine: "african", location: "kilimani", priceLevel: 2,
    summary: "Pan-African sharing plates from Ethiopia, Nigeria, Ghana and the coast.",
    description: ["A sample pan-African restaurant listing with sharing platters, coastal Swahili dishes and West African favourites."],
    highlights: ["Sharing platters", "Vegetarian options", "Live music weekends"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1504674900247-0877df9cc836", alt: "Colourful plates of food on a wooden table" },
      { src: "1546069901-ba9599a7e63c", alt: "Fresh salad bowl" },
    ],
    coords: null,
  },
  {
    id: "ember-and-oak-karen", sample: true, verified: false,
    name: "Ember & Oak", cuisine: "fine-dining", location: "karen", priceLevel: 4,
    summary: "Tasting menus built around Kenyan produce, in a candle-lit garden setting.",
    description: ["A sample fine-dining listing: seasonal tasting menus, an extensive wine list and garden seating."],
    highlights: ["Tasting menu", "Wine pairing", "Reservations recommended"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1414235077428-338989a2e8c0", alt: "Elegant plated dish on a fine dining table" },
      { src: "1600565193348-f74bd3c7ccdf", alt: "Chef cooking with flames in a professional kitchen" },
    ],
    coords: null,
  },
  {
    id: "meridian-kitchen-westlands", sample: true, verified: false,
    name: "Meridian Kitchen", cuisine: "international", location: "westlands", priceLevel: 3,
    summary: "Global comfort food, cocktails and a buzzing atmosphere in Westlands.",
    description: ["A sample international restaurant listing with burgers, grills, salads and pasta, plus a cocktail bar."],
    highlights: ["Cocktail bar", "Business lunches", "Late opening"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1552566626-52f8b828add9", alt: "Spacious restaurant interior with warm lighting" },
      { src: "1600891964092-4316c288032e", alt: "Steak and fries on a white plate" },
    ],
    coords: null,
  },
  {
    id: "saffron-courtyard-parklands", sample: true, verified: false,
    name: "Saffron Courtyard", cuisine: "indian", location: "parklands", priceLevel: 2,
    summary: "North and South Indian classics — curries, tandoor and vegetarian thalis.",
    description: ["A sample Indian restaurant listing in Parklands, an area known for its Indian and Asian food."],
    highlights: ["Vegetarian friendly", "Tandoor", "Family style"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1585937421612-70a008356fbe", alt: "Bowls of Indian curry" },
    ],
    coords: null,
  },
  {
    id: "red-lantern-kilimani", sample: true, verified: false,
    name: "Lotus Pavilion", cuisine: "chinese", location: "kilimani", priceLevel: 2,
    summary: "Dim sum, Sichuan favourites and Cantonese roasts.",
    description: ["A sample Chinese restaurant listing with dim sum, noodles and stir-fries."],
    highlights: ["Dim sum", "Takeaway", "Private rooms"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1563245372-f21724e3856d", alt: "Dim sum dumplings in a bamboo steamer" },
      { src: "1525755662778-989d0524087e", alt: "Orange chicken with broccoli and rice" },
    ],
    coords: null,
  },
  {
    id: "casa-nonna-lavington", sample: true, verified: false,
    name: "Casa Nonna", cuisine: "italian", location: "lavington", priceLevel: 3,
    summary: "Wood-fired pizza, fresh pasta and gelato in a cosy trattoria.",
    description: ["A sample Italian restaurant listing with wood-fired pizzas, handmade pasta and Italian desserts."],
    highlights: ["Wood-fired pizza", "Kid friendly", "Outdoor terrace"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1565299624946-b28f40a0ae38", alt: "Wood-fired pizza on a wooden board" },
      { src: "1621996346565-e3dbc646d9a9", alt: "Penne pasta in tomato sauce" },
    ],
    coords: null,
  },
  {
    id: "highland-brew-westlands", sample: true, verified: false,
    name: "Highland Brew Café", cuisine: "cafes", location: "westlands", priceLevel: 1,
    summary: "Kenyan single-origin coffee, pastries and a laptop-friendly space.",
    description: ["A sample café listing celebrating Kenyan coffee, with breakfast, pastries and fast Wi-Fi."],
    highlights: ["Kenyan coffee", "Wi-Fi", "Breakfast all day"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1501339847302-ac426a4a7cbb", alt: "Café interior with illuminated CAFE sign" },
      { src: "1509042239860-f550ce710b93", alt: "Cappuccinos with latte art" },
    ],
    coords: null,
  },
  {
    id: "bloom-bowl-kileleshwa", sample: true, verified: false,
    name: "Bloom Bowl", cuisine: "cafes", location: "kileleshwa", priceLevel: 2,
    summary: "Healthy bowls, smoothies and brunch in a leafy garden café.",
    description: ["A sample garden café listing with healthy bowls, smoothies and weekend brunch."],
    highlights: ["Healthy options", "Garden seating", "Brunch"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1546069901-ba9599a7e63c", alt: "Healthy salad bowl with salmon and egg" },
      { src: "1554118811-1e0d58224f24", alt: "Café dining area with plants" },
    ],
    coords: null,
  },
  {
    id: "altitude-terrace-upper-hill", sample: true, verified: false,
    name: "Altitude Terrace", cuisine: "rooftop", location: "upper-hill", priceLevel: 3,
    summary: "Rooftop bar and grill with sunset views over the city skyline.",
    description: ["A sample rooftop restaurant listing with grills, small plates and sundowner cocktails."],
    highlights: ["Skyline views", "Sundowners", "Live DJ"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1514933651103-005eec06c04b", alt: "Stylish bar with menu boards and pendant lights" },
      { src: "1470337458703-46ad1756a187", alt: "Cocktail being poured over ice" },
    ],
    coords: null,
  },
  {
    id: "shamba-family-grill-karen", sample: true, verified: false,
    name: "Shamba Family Grill", cuisine: "family", location: "karen", priceLevel: 2,
    summary: "Spacious garden restaurant with a kids' play area and grills for the whole family.",
    description: ["A sample family restaurant listing with garden seating, a children's play area and a broad menu."],
    highlights: ["Kids' play area", "Garden seating", "Weekend lunches"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1544025162-d76694265947", alt: "Platter of grilled ribs and vegetables" },
      { src: "1555396273-367ea4eb4db5", alt: "Large airy restaurant with wooden tables" },
    ],
    coords: null,
  },
  {
    id: "quick-bite-express-cbd", sample: true, verified: false,
    name: "Quick Bite Express", cuisine: "fast-food", location: "nairobi-cbd", priceLevel: 1,
    summary: "Burgers, fries and chicken — fast, affordable and open late.",
    description: ["A sample fast-food listing for quick, affordable meals in the city centre."],
    highlights: ["Takeaway", "Delivery apps", "Budget friendly"],
    hours: null, phone: null, website: null,
    images: [
      { src: "1568901346375-23c9450c58cd", alt: "Double cheeseburger" },
      { src: "1561758033-d89a9ad46330", alt: "Burger with fries on a board" },
    ],
    coords: null,
  },
];
