/* =============================================================================
   BOOKING — WhatsApp booking requests
   -----------------------------------------------------------------------------
   Flow: visitor picks dates + guests -> we build a pre-filled message ->
   WhatsApp opens (wa.me works on mobile apps, WhatsApp Desktop and WhatsApp Web).
   A click NEVER means a confirmed booking: the admin/owner confirms availability
   and sends payment instructions in the chat.
   ============================================================================= */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG;

  const Booking = {};

  /** Build a wa.me link. The message is URL-encoded with encodeURIComponent. */
  Booking.waLink = (message) => {
    const number = String(CFG.whatsapp.number).replace(/\D/g, "");
    return `https://wa.me/${number}` + (message ? `?text=${encodeURIComponent(message)}` : "");
  };

  /** Booking request text for a property. */
  Booking.buildMessage = ({ property, checkIn, checkOut, guests, name, notes }) => {
    const p = property;
    const unit = U.priceUnit(p);
    const price = `${U.formatKES(p.price.amount)} (${U.formatUSD(p.price.amount)})`;
    const nights = U.nights(checkIn, checkOut);
    const lines = [
      `Hello, I found your property on ${CFG.siteName} and would like to make a booking.`,
      "",
      `Property: ${p.name}`,
      `Listing ref: ${p.id}${p.sample ? " (sample listing)" : ""}`,
      `Location: ${U.locationName(p.location)}, Nairobi`,
      `Price per ${unit}: ${price}`,
      `Check-in: ${checkIn ? U.formatDate(checkIn) : "To be confirmed"}`,
      `Check-out: ${checkOut ? U.formatDate(checkOut) : "To be confirmed"}`,
    ];
    if (nights > 0) lines.push(`Number of nights: ${nights}`);
    lines.push(`Number of guests: ${guests || "To be confirmed"}`);
    if (name) lines.push(`My name: ${name}`);
    if (notes) lines.push("", `Notes: ${notes}`);
    lines.push("", "Please confirm availability and send me the payment instructions.");
    return lines.join("\n");
  };

  /** Open WhatsApp in a new tab/app. Returns the link used. */
  Booking.openWhatsApp = (message) => {
    const link = Booking.waLink(message);
    const w = window.open(link, "_blank", "noopener");
    if (!w) window.location.href = link; // popup blocked -> navigate instead
    return link;
  };

  /* ---------------------------------------------------------------------
     Booking modal
     --------------------------------------------------------------------- */
  let modal, lastFocus, current;

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "booking-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="modal__backdrop" data-close></div>
      <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="bm-title">
        <button class="modal__close" type="button" data-close aria-label="Close booking form"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        <div class="bm-body"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) Booking.close(); });
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") Booking.close();
      if (e.key === "Tab") trapFocus(e);
    });
  }

  function trapFocus(e) {
    const f = U.$$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal).filter((el) => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  function guestOptions(max, selected) {
    let o = "";
    for (let i = 1; i <= max; i++) o += `<option value="${i}"${i === selected ? " selected" : ""}>${i} guest${i > 1 ? "s" : ""}</option>`;
    return o;
  }

  function renderForm(p) {
    const s = U.getSearch();
    const today = U.todayISO();
    const checkIn = s.checkIn && s.checkIn >= today ? s.checkIn : "";
    const minOut = checkIn ? U.addDays(checkIn, Math.max(1, p.minNights || 1)) : U.addDays(today, 1);
    const checkOut = s.checkOut && checkIn && s.checkOut > checkIn ? s.checkOut : "";
    const guests = Math.min(+s.guests || 1, p.maxGuests);
    const img = p.images[0];
    const unit = U.priceUnit(p);

    U.$(".bm-body", modal).innerHTML = `
      <div class="bm-head">
        <img src="${U.img(img.src, 240, 180)}" alt="${U.esc(img.alt)}" width="120" height="90">
        <div>
          <p class="eyebrow">${U.esc(U.type(p.type).label)}</p>
          <h2 id="bm-title" class="bm-title">${U.esc(p.name)}</h2>
          <p class="muted"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${U.esc(U.locationName(p.location))}, Nairobi</p>
          <p class="bm-price"><strong>${U.formatKES(p.price.amount)}</strong> / ${unit} ${U.usdSpan(p.price.amount)}</p>
        </div>
      </div>
      ${p.sample ? `<p class="notice notice--sample"><i class="fa-solid fa-flask" aria-hidden="true"></i> This is a <strong>sample listing</strong> used to demonstrate the website. Real availability can't be booked yet.</p>` : ""}
      <form class="bm-form" novalidate>
        <div class="field-row">
          <label class="field"><span>Check-in</span>
            <input type="date" name="checkIn" required min="${today}" value="${checkIn}"></label>
          <label class="field"><span>Check-out</span>
            <input type="date" name="checkOut" required min="${minOut}" value="${checkOut}"></label>
        </div>
        <div class="field-row">
          <label class="field"><span>Guests</span>
            <select name="guests">${guestOptions(p.maxGuests, guests)}</select></label>
          <label class="field"><span>Your name <small>(optional)</small></span>
            <input type="text" name="name" autocomplete="name" maxlength="60" placeholder="e.g. Amina"></label>
        </div>
        <label class="field"><span>Notes for the host <small>(optional)</small></span>
          <textarea name="notes" rows="2" maxlength="300" placeholder="Arrival time, airport pick-up, special requests…"></textarea></label>
        <p class="form-error" role="alert" hidden></p>
        <div class="bm-estimate" aria-live="polite"></div>
        <button type="submit" class="btn btn--whatsapp btn--block btn--lg"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Send booking request on WhatsApp</button>
        <p class="fineprint"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>
          Sending this request does <strong>not</strong> confirm your booking. We'll check availability with the property and reply on WhatsApp with confirmation and payment instructions.
          Minimum stay: ${p.minNights || 1} ${unit === "month" ? "nights (monthly terms)" : (p.minNights || 1) > 1 ? "nights" : "night"}.
          ${U.isPlaceholderNumber() ? '<br><span class="dev-note">Developer note: a placeholder WhatsApp number is configured in js/config.js.</span>' : ""}
        </p>
      </form>`;

    const form = U.$(".bm-form", modal);
    const inEl = form.checkIn, outEl = form.checkOut;
    const update = () => {
      if (inEl.value) {
        const min = U.addDays(inEl.value, Math.max(1, p.minNights || 1));
        outEl.min = min;
        if (outEl.value && outEl.value < min) outEl.value = min;
      }
      const n = U.nights(inEl.value, outEl.value);
      const est = U.$(".bm-estimate", modal);
      if (n > 0) {
        const total = unit === "month" ? (p.price.amount / 30) * n : p.price.amount * n;
        est.innerHTML = `<div><span>${n} night${n > 1 ? "s" : ""}${unit === "month" ? " (pro-rated)" : ` × ${U.formatKES(p.price.amount)}`}</span>
          <strong>${U.formatKES(total)}</strong></div><small>Estimate only — excludes any deposits, fees or taxes. Final price confirmed on WhatsApp.</small>`;
      } else est.innerHTML = "";
      U.setSearch({ checkIn: inEl.value, checkOut: outEl.value, guests: form.guests.value });
    };
    inEl.addEventListener("change", update);
    outEl.addEventListener("change", update);
    form.guests.addEventListener("change", update);
    update();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const err = U.$(".form-error", form);
      const ci = inEl.value, co = outEl.value;
      let msg = "";
      if (!ci || !co) msg = "Please choose your check-in and check-out dates.";
      else if (ci < today) msg = "Check-in can't be in the past.";
      else if (U.nights(ci, co) < Math.max(1, p.minNights || 1)) msg = `Check-out must be at least ${Math.max(1, p.minNights || 1)} night(s) after check-in.`;
      if (msg) { err.textContent = msg; err.hidden = false; (ci ? outEl : inEl).focus(); return; }
      err.hidden = true;

      const text = Booking.buildMessage({
        property: p, checkIn: ci, checkOut: co, guests: form.guests.value,
        name: form.name.value.trim(), notes: form.notes.value.trim(),
      });
      const link = Booking.openWhatsApp(text);
      renderSent(p, link);
    });
  }

  function renderSent(p, link) {
    U.$(".bm-body", modal).innerHTML = `
      <div class="bm-sent">
        <div class="bm-sent__icon"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></div>
        <h2 id="bm-title" class="bm-title">Your request is ready in WhatsApp</h2>
        <p>Press <strong>send</strong> in WhatsApp to deliver your booking request for <strong>${U.esc(p.name)}</strong>.</p>
        <ol class="steps-mini">
          <li>We check availability with the property.</li>
          <li>You receive confirmation and payment instructions on WhatsApp.</li>
          <li>Your booking is confirmed only after verification and payment.</li>
        </ol>
        <p class="fineprint">Never pay anyone who contacts you from a different number. <a href="${U.url("pages/booking-policy.html")}">How booking works</a></p>
        <div class="btn-row">
          <a class="btn btn--whatsapp" href="${link}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp didn't open? Tap here</a>
          <button class="btn btn--ghost" type="button" data-close>Close</button>
        </div>
      </div>`;
    U.$(".bm-sent .btn--whatsapp", modal).focus();
  }

  Booking.open = (id) => {
    const p = U.property(id);
    if (!p) return;
    if (!modal) buildModal();
    current = p;
    lastFocus = document.activeElement;
    renderForm(p);
    modal.hidden = false;
    document.documentElement.classList.add("no-scroll");
    requestAnimationFrame(() => { modal.classList.add("open"); U.$("input[name=checkIn]", modal).focus(); });
  };

  Booking.close = () => {
    if (!modal || modal.hidden) return;
    modal.classList.remove("open");
    document.documentElement.classList.remove("no-scroll");
    setTimeout(() => (modal.hidden = true), 200);
    if (lastFocus) lastFocus.focus();
  };

  /* Any element with data-book="property-id" opens the booking modal. */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-book]");
    if (btn) { e.preventDefault(); Booking.open(btn.dataset.book); }
  });

  window.Booking = Booking;
})();
