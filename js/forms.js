/* =============================================================================
   FORMS — contact, list-your-property and airport-transfer enquiry forms.
   <form data-wa-form data-intro="Opening line" data-endpoint="contactEndpoint">
   Each named field becomes a line "Label: value" (label = <span> inside its <label>).
   - If SITE_CONFIG.forms[data-endpoint] is set, the form is POSTed there as JSON.
   - Otherwise WhatsApp opens with the message (or email if channel=email chosen).
   No data is stored by the website itself.
   ============================================================================= */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG;

  const labelFor = (el) => {
    const l = el.closest("label");
    const s = l && l.querySelector("span");
    return (el.dataset.label || (s ? s.textContent : el.name)).replace(/\(optional\)/i, "").replace(/\*/g, "").trim();
  };

  // Date fields: no past dates
  U.$$("form[data-wa-form] input[type=date]").forEach((d) => (d.min = U.todayISO()));

  document.addEventListener("submit", async (e) => {
    const form = e.target.closest("form[data-wa-form]");
    if (!form) return;
    e.preventDefault();
    const err = U.$(".form-error", form);
    if (!form.checkValidity()) {
      const bad = U.$$(":invalid", form).filter((x) => x.name)[0];
      if (err) { err.textContent = bad ? `Please check: ${labelFor(bad)}` : "Please complete the required fields."; err.hidden = false; }
      bad && bad.focus();
      return;
    }
    if (err) err.hidden = true;

    const data = {};
    const ref = Booking.newRef();
    const lines = [form.dataset.intro || `Hello ${CFG.siteName},`, "", `Ref: ${ref}`];
    U.$$("input, select, textarea", form).forEach((el) => {
      if (!el.name || el.name === "channel" || el.type === "submit") return;
      if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
      let v = el.value.trim();
      if (!v) return;
      if (el.type === "date") v = U.formatDate(v);
      if (el.tagName === "SELECT") v = el.options[el.selectedIndex].text;
      const label = labelFor(el);
      data[el.name] = v;
      if (el.type === "checkbox") lines.push(`✔ ${label}`);
      else lines.push(`${label}: ${v}`);
    });
    if (form.dataset.outro) lines.push("", form.dataset.outro);
    const message = lines.join("\n");

    // copy to the booking log (Google Sheet), if configured
    Booking.track("enquiry", {
      ref,
      type: form.dataset.track || "Website form",
      name: data.name || "",
      contact: [data.phone, data.email].filter(Boolean).join(" / "),
      details: lines.slice(3).filter((l) => l !== "" && l !== form.dataset.outro).join("\n"),
    });

    const endpoint = CFG.forms[form.dataset.endpoint || ""];
    const channel = (U.$("[name=channel]:checked", form) || {}).value || "whatsapp";
    const success = U.$(".form-success", form.parentElement);

    if (endpoint) {
      const btn = U.$("[type=submit]", form);
      btn.disabled = true;
      try {
        await U.postForm(endpoint, { ...data, _form: form.dataset.endpoint, _page: location.pathname });
        form.reset();
        if (success) { success.hidden = false; success.focus(); } else U.toast("Thank you — we'll be in touch shortly.");
      } catch (ex) {
        U.toast("Couldn't send the form. Opening WhatsApp instead…");
        Booking.openWhatsApp(message);
      } finally { btn.disabled = false; }
      return;
    }

    if (channel === "email") {
      window.location.href = `mailto:${CFG.email}?subject=${encodeURIComponent(form.dataset.subject || `Enquiry from ${CFG.siteName} website`)}&body=${encodeURIComponent(message)}`;
      U.toast("Your email app is opening with your message.");
    } else {
      Booking.openWhatsApp(message);
      U.toast("WhatsApp is opening — press send to deliver your message.");
    }
  });
})();
