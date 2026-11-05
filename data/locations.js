/* =============================================================================
   NAIROBI NEIGHBOURHOODS
   - `slug` must match the file name in /locations/ (e.g. locations/westlands.html)
     and the `location` field used in data/properties.js & data/restaurants.js.
   - `coords` are the approximate centre of the neighbourhood (not an address).
   - `landmarks` are well-known public places in or near the area.
   - Drive times are typical ranges only; Nairobi traffic varies a lot.
   ============================================================================= */
window.LOCATIONS = [
  {
    slug: "westlands", name: "Westlands", popular: true,
    image: "1514933651103-005eec06c04b",
    tagline: "Nightlife, malls and business hub",
    description:
      "Westlands is one of Nairobi's busiest commercial and entertainment districts, with office towers, shopping malls, restaurants and a lively nightlife scene. It sits along Waiyaki Way and connects to JKIA via the Nairobi Expressway, which makes it popular with business travellers and first-time visitors.",
    bestFor: ["Business travel", "Nightlife", "First-time visitors", "Shopping"],
    landmarks: ["Sarit Centre", "Westgate Shopping Mall", "The Mall Westlands", "Karura Forest (nearby)"],
    jkiaDrive: "approx. 25–60 min (Expressway helps outside peak hours)",
    coords: [-1.2676, 36.8108],
  },
  {
    slug: "kilimani", name: "Kilimani", popular: true,
    image: "1555396273-367ea4eb4db5",
    tagline: "Central, social and apartment-friendly",
    description:
      "Kilimani is a central residential neighbourhood packed with modern apartment blocks, cafés and restaurants. Its location between the CBD, Upper Hill and Lavington makes it a favourite for short stays, young professionals and visitors who want to be close to everything.",
    bestFor: ["Short stays", "Furnished apartments", "Cafés & dining", "Young professionals"],
    landmarks: ["Yaya Centre", "Prestige Plaza (Ngong Road)", "Adlife Plaza", "Nairobi Arboretum (nearby)"],
    jkiaDrive: "approx. 35–75 min",
    coords: [-1.2921, 36.7849],
  },
  {
    slug: "kileleshwa", name: "Kileleshwa", popular: true,
    image: "1600566753190-17f0baa2a6c3",
    tagline: "Quiet, green and family-friendly",
    description:
      "Kileleshwa is a calm, leafy residential area with spacious apartments and easy access to Westlands, Kilimani and the CBD. It suits families and longer stays where quieter streets matter.",
    bestFor: ["Families", "Long stays", "Quiet surroundings"],
    landmarks: ["Nairobi Arboretum", "Kasuku Centre", "Westlands (nearby)"],
    jkiaDrive: "approx. 35–75 min",
    coords: [-1.2795, 36.7860],
  },
  {
    slug: "karen", name: "Karen", popular: true,
    image: "1523805009345-7448845a9e53",
    tagline: "Leafy suburb close to wildlife",
    description:
      "Karen is a spacious, green suburb on Nairobi's south-western edge, known for large gardens, cottages and villas. It is close to several of Nairobi's best-known wildlife and heritage attractions, making it a relaxing base for holidays.",
    bestFor: ["Villas & cottages", "Families", "Wildlife day trips", "Relaxed holidays"],
    landmarks: ["Giraffe Centre", "Karen Blixen Museum", "Sheldrick Wildlife Trust", "Nairobi National Park (nearby)"],
    jkiaDrive: "approx. 40–80 min",
    coords: [-1.3197, 36.7073],
  },
  {
    slug: "lavington", name: "Lavington", popular: true,
    image: "1580587771525-78b9dba3b914",
    tagline: "Upmarket homes and townhouses",
    description:
      "Lavington is an upmarket residential suburb with townhouses, gated homes and boutique apartments. It's quieter than Westlands yet close to shopping centres along James Gichuru Road and Ngong Road.",
    bestFor: ["Townhouses", "Families", "Longer stays"],
    landmarks: ["Lavington Mall", "Valley Arcade", "The Junction Mall (nearby)"],
    jkiaDrive: "approx. 40–80 min",
    coords: [-1.2780, 36.7690],
  },
  {
    slug: "runda", name: "Runda", popular: true,
    image: "1600596542815-ffad4c1539a9",
    tagline: "Exclusive, secure and spacious",
    description:
      "Runda is one of Nairobi's most exclusive residential estates, known for large homes, mature gardens and a quiet, secure atmosphere. It is close to Gigiri, the UN complex and major northern shopping centres.",
    bestFor: ["Luxury villas", "Diplomats & executives", "Privacy"],
    landmarks: ["Village Market (nearby)", "Two Rivers Mall (nearby)", "Karura Forest (nearby)"],
    jkiaDrive: "approx. 40–75 min",
    coords: [-1.2180, 36.8100],
  },
  {
    slug: "gigiri", name: "Gigiri", popular: true,
    image: "1521791136064-7986c2920216",
    tagline: "Diplomatic quarter near the UN",
    description:
      "Gigiri is home to the United Nations Office at Nairobi and several embassies. Serviced apartments and hotels here are popular with diplomats, NGO staff and conference visitors who want to stay close to the UN complex.",
    bestFor: ["UN & embassy visits", "Conference travel", "Serviced apartments"],
    landmarks: ["United Nations Office at Nairobi (UNON)", "Village Market", "Karura Forest"],
    jkiaDrive: "approx. 35–70 min",
    coords: [-1.2335, 36.8090],
  },
  {
    slug: "parklands", name: "Parklands", popular: true,
    image: "1585937421612-70a008356fbe",
    tagline: "Diverse, central and great food",
    description:
      "Parklands is a diverse, centrally located neighbourhood next to Westlands, well known for its Indian and Asian restaurants, hospitals and affordable accommodation options.",
    bestFor: ["Budget stays", "Food lovers", "Medical visits"],
    landmarks: ["Diamond Plaza", "Aga Khan University Hospital", "City Park"],
    jkiaDrive: "approx. 30–60 min",
    coords: [-1.2600, 36.8200],
  },
  {
    slug: "upper-hill", name: "Upper Hill", popular: true,
    image: "1611348524140-53c9a25263d6",
    tagline: "Corporate district with skyline views",
    description:
      "Upper Hill is a corporate district home to many of Nairobi's tallest towers, headquarters and major hospitals. It's ideal for business travellers who want quick access to offices and the CBD.",
    bestFor: ["Business travel", "Medical visits", "Short stays"],
    landmarks: ["Nairobi Hospital (nearby)", "Kenyatta National Hospital (nearby)", "Uhuru Park (nearby)"],
    jkiaDrive: "approx. 25–60 min",
    coords: [-1.2990, 36.8150],
  },
  {
    slug: "nairobi-cbd", name: "Nairobi CBD", popular: true,
    image: "1497366216548-37526070297c",
    tagline: "The heart of the city",
    description:
      "Nairobi's Central Business District is the city's historic and administrative heart, with government offices, banks, markets and budget-friendly hotels. It's lively by day and convenient for travellers on a budget.",
    bestFor: ["Budget hotels", "Sightseeing", "Transport connections"],
    landmarks: ["Kenyatta International Convention Centre (KICC)", "Jeevanjee Gardens", "Nairobi Railway Museum", "Uhuru Park"],
    jkiaDrive: "approx. 25–60 min",
    coords: [-1.2864, 36.8232],
  },
  {
    slug: "south-c", name: "South C", popular: true,
    image: "1600891964092-4316c288032e",
    tagline: "Residential, affordable, near the airports",
    description:
      "South C is an established residential estate off Mombasa Road and Langata Road, with affordable apartments and popular local eateries. Its location makes it convenient for both JKIA and Wilson Airport.",
    bestFor: ["Affordable stays", "Airport access", "Local food"],
    landmarks: ["Wilson Airport (nearby)", "Nairobi National Park (nearby)", "Capital Centre (nearby)"],
    jkiaDrive: "approx. 20–45 min",
    coords: [-1.3200, 36.8280],
  },
  {
    slug: "south-b", name: "South B", popular: true,
    image: "1556909114-f6e7ad7d3136",
    tagline: "Friendly estate off Mombasa Road",
    description:
      "South B is a friendly, established residential estate close to Mombasa Road, offering good-value furnished apartments and easy access to JKIA and the CBD.",
    bestFor: ["Good-value apartments", "Airport access", "Families"],
    landmarks: ["Capital Centre", "Mombasa Road", "Nairobi CBD (nearby)"],
    jkiaDrive: "approx. 20–45 min",
    coords: [-1.3110, 36.8370],
  },
  {
    slug: "ruaka", name: "Ruaka", popular: false,
    image: "1617806118233-18e1de247200",
    tagline: "Fast-growing suburb on Limuru Road",
    description:
      "Ruaka is a fast-growing suburb just north of the city boundary with many new apartment blocks, making it a popular choice for affordable long-term rentals near the northern business areas.",
    bestFor: ["Long-term rentals", "New apartments", "Value"],
    landmarks: ["Two Rivers Mall", "Limuru Road", "Village Market (nearby)"],
    jkiaDrive: "approx. 45–90 min",
    coords: [-1.2050, 36.7780],
  },
  {
    slug: "syokimau", name: "Syokimau", popular: false,
    image: "1569154941061-e231b4725ef1",
    tagline: "Closest stays to JKIA",
    description:
      "Syokimau lies just off Mombasa Road close to Jomo Kenyatta International Airport and the SGR Nairobi Terminus. It's a practical choice for early flights, late arrivals and train connections.",
    bestFor: ["Near JKIA", "Transit stays", "SGR train connections"],
    landmarks: ["Jomo Kenyatta International Airport (JKIA)", "SGR Nairobi Terminus", "Gateway Mall"],
    jkiaDrive: "approx. 10–25 min",
    coords: [-1.3600, 36.9200],
  },
];
