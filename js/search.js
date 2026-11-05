/* =============================================================================
   SEARCH — the hero / compact search form.
   <form data-search-form> with fields: destination, checkIn, checkOut, guests, type
   Submits to pages/stays.html where Listings.initListing() filters the results.
   ============================================================================= */
(function () {
  "use strict";

  function init(form) {
    const today = U.todayISO();
    const s = U.getSearch();
    const ci = form.checkIn, co = form.checkOut;

    // datalist of neighbourhoods for the destination field
    const dl = document.createElement("datalist");
    dl.id = "dl-neighbourhoods-" + Math.random().toString(36).slice(2, 7);
    dl.innerHTML = window.LOCATIONS.map((l) => `<option value="${l.name}">`).join("");
    form.appendChild(dl);
    form.destination.setAttribute("list", dl.id);

    // type select options
    if (form.type && form.type.options.length <= 1) {
      Object.entries(window.TAXONOMY.types).forEach(([k, t]) => form.type.add(new Option(t.label, k)));
    }

    ci.min = today;
    co.min = U.addDays(today, 1);
    if (s.checkIn && s.checkIn >= today) ci.value = s.checkIn;
    if (s.checkOut && s.checkOut > (ci.value || today)) co.value = s.checkOut;
    if (s.guests && form.guests) form.guests.value = s.guests;

    ci.addEventListener("change", () => {
      if (!ci.value) return;
      co.min = U.addDays(ci.value, 1);
      if (!co.value || co.value <= ci.value) co.value = U.addDays(ci.value, 1);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (ci.value && ci.value < today) { U.toast("Check-in can't be in the past."); ci.focus(); return; }
      if (ci.value && co.value && co.value <= ci.value) { U.toast("Check-out must be after check-in."); co.focus(); return; }
      if (co.value && !ci.value) { U.toast("Please choose a check-in date too."); ci.focus(); return; }

      const dest = form.destination.value.trim();
      const loc = Listings.resolveLocation(dest);
      const qs = new URLSearchParams();
      if (loc) qs.set("location", loc);
      else if (dest) qs.set("q", dest);
      if (ci.value) qs.set("checkIn", ci.value);
      if (co.value) qs.set("checkOut", co.value);
      if (form.guests && form.guests.value) qs.set("guests", form.guests.value);
      if (form.type && form.type.value) qs.set("type", form.type.value);

      U.setSearch({ checkIn: ci.value, checkOut: co.value, guests: form.guests ? form.guests.value : "" });
      window.location.href = U.url("pages/stays.html") + (qs.toString() ? "?" + qs : "");
    });
  }

  window.Search = { init };
})();
