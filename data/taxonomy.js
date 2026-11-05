/* =============================================================================
   TAXONOMY — accommodation types, page groups, amenities, cuisines.
   Property and restaurant data refer to these keys.
   Image values are Unsplash photo IDs (or full URLs / local paths).
   ============================================================================= */
window.TAXONOMY = {
  /* Top-level groups = the main navigation pages ------------------------- */
  groups: {
    hotels:       { label: "Hotels",               page: "pages/hotels.html" },
    apartments:   { label: "Apartments",           page: "pages/apartments.html" },
    "short-stays":{ label: "Airbnb & Short Stays", page: "pages/airbnb.html" },
    houses:       { label: "Houses & Villas",      page: "pages/houses.html" },
  },

  /* Accommodation types (categories) -------------------------------------- */
  types: {
    "luxury-hotels": {
      label: "Luxury Hotels", group: "hotels", icon: "fa-crown",
      image: "1551882547-ff40c63fe5fa",
      blurb: "Five-star comfort, pools, spas and fine dining.",
    },
    "budget-hotels": {
      label: "Budget Hotels", group: "hotels", icon: "fa-hotel",
      image: "1594563703937-fdc640497dcd",
      blurb: "Clean, safe and central rooms at friendly prices.",
    },
    "holiday-apartments": {
      label: "Airbnb & Holiday Apartments", group: "short-stays", icon: "fa-key",
      image: "1600210492486-724fe5c67fb0",
      blurb: "Self check-in style homes for city breaks and holidays.",
    },
    "serviced-apartments": {
      label: "Serviced Apartments", group: "apartments", icon: "fa-bell-concierge",
      image: "1505691938895-1758d7feb511",
      blurb: "Hotel-style service with the space of an apartment.",
    },
    "furnished-apartments": {
      label: "Furnished Apartments", group: "apartments", icon: "fa-couch",
      image: "1493809842364-78817add7ffb",
      blurb: "Fully furnished homes, ready to move into.",
    },
    "private-rooms": {
      label: "Private Rooms", group: "short-stays", icon: "fa-door-open",
      image: "1513694203232-719a280e022f",
      blurb: "Your own room in a shared home — great for solo travellers.",
    },
    "vacation-homes": {
      label: "Vacation Homes", group: "houses", icon: "fa-house-chimney",
      image: "1568605114967-8130f3a36994",
      blurb: "Whole houses with gardens for families and groups.",
    },
    villas: {
      label: "Villas", group: "houses", icon: "fa-water-ladder",
      image: "1613977257363-707ba9348227",
      blurb: "Private villas with pools in Nairobi's leafy suburbs.",
    },
    "guest-houses": {
      label: "Guest Houses", group: "houses", icon: "fa-people-roof",
      image: "1564013799919-ab600027ffc6",
      blurb: "Warm, personal stays run by local hosts.",
    },
    "long-term-rentals": {
      label: "Long-Term Rentals", group: "apartments", icon: "fa-calendar-days",
      image: "1522708323590-d24dbb6b0267",
      blurb: "Monthly stays for relocations, students and contracts.",
    },
  },

  /* Amenities — properties only list amenities verified for that property. */
  amenities: {
    wifi:            { label: "Free Wi-Fi",         icon: "fa-wifi" },
    pool:            { label: "Swimming pool",      icon: "fa-water-ladder" },
    parking:         { label: "Parking",            icon: "fa-square-parking" },
    kitchen:         { label: "Kitchen",            icon: "fa-kitchen-set" },
    ac:              { label: "Air conditioning",   icon: "fa-snowflake" },
    hotShower:       { label: "Hot shower",         icon: "fa-shower" },
    security:        { label: "24/7 security",      icon: "fa-shield-halved" },
    gym:             { label: "Gym",                icon: "fa-dumbbell" },
    airportTransfer: { label: "Airport transfer",   icon: "fa-plane-arrival" },
    workspace:       { label: "Workspace",          icon: "fa-laptop" },
    laundry:         { label: "Laundry",            icon: "fa-shirt" },
    breakfast:       { label: "Breakfast",          icon: "fa-mug-saucer" },
    tv:              { label: "Smart TV",           icon: "fa-tv" },
    backupPower:     { label: "Backup power",       icon: "fa-bolt" },
    garden:          { label: "Garden",             icon: "fa-tree" },
    balcony:         { label: "Balcony",            icon: "fa-building" },
    restaurant:      { label: "On-site restaurant", icon: "fa-utensils" },
    housekeeping:    { label: "Housekeeping",       icon: "fa-broom" },
    lift:            { label: "Lift",               icon: "fa-elevator" },
    spa:             { label: "Spa",                icon: "fa-spa" },
  },

  /* Restaurant cuisine categories ----------------------------------------- */
  cuisines: {
    kenyan:        { label: "Kenyan Cuisine",        icon: "fa-bowl-food",          image: "1529692236671-f1f6cf9683ba" },
    african:       { label: "African Restaurants",   icon: "fa-earth-africa",       image: "1504674900247-0877df9cc836" },
    "fine-dining": { label: "Fine Dining",           icon: "fa-champagne-glasses",  image: "1414235077428-338989a2e8c0" },
    international: { label: "International Cuisine", icon: "fa-globe",              image: "1552566626-52f8b828add9" },
    indian:        { label: "Indian Restaurants",    icon: "fa-pepper-hot",         image: "1585937421612-70a008356fbe" },
    chinese:       { label: "Chinese Restaurants",   icon: "fa-bowl-rice",          image: "1563245372-f21724e3856d" },
    italian:       { label: "Italian Restaurants",   icon: "fa-pizza-slice",        image: "1565299624946-b28f40a0ae38" },
    cafes:         { label: "Cafes & Coffee Shops",  icon: "fa-mug-hot",            image: "1509042239860-f550ce710b93" },
    rooftop:       { label: "Rooftop Restaurants",   icon: "fa-city",               image: "1514933651103-005eec06c04b" },
    family:        { label: "Family Restaurants",    icon: "fa-children",           image: "1544025162-d76694265947" },
    "fast-food":   { label: "Fast Food",             icon: "fa-burger",             image: "1568901346375-23c9450c58cd" },
  },

  priceLevels: {
    1: { label: "Budget",   hint: "Most mains under KES 1,000" },
    2: { label: "Moderate", hint: "Most mains KES 1,000–2,000" },
    3: { label: "Upscale",  hint: "Most mains KES 2,000–4,000" },
    4: { label: "Premium",  hint: "Most mains above KES 4,000" },
  },
};
