/**
 * =============================================================================
 *  MAKAO STAYS — BOOKING TRACKER (Google Apps Script)
 * -----------------------------------------------------------------------------
 *  Receives booking requests and enquiries from the website and saves them to
 *  this Google Sheet, so you can track each one from "New" to "Completed".
 *
 *  Setup (5 minutes) — full guide with screenshots-in-words: docs/BOOKING-TRACKING.md
 *   1. Create a new Google Sheet → Extensions → Apps Script.
 *   2. Delete the sample code, paste this whole file, click Save.
 *   3. Choose the "setup" function in the toolbar → Run → allow permissions.
 *   4. Deploy → New deployment → type "Web app"
 *        Execute as: Me    ·    Who has access: Anyone
 *      Copy the Web app URL (ends in /exec).
 *   5. Paste it into js/config.js → tracking.endpoint, then publish the site.
 * =============================================================================
 */

/* ----------------------------- SETTINGS ------------------------------------ */
// Email alert for every new request. Leave "" to send to the sheet owner,
// or set to "none" to switch alerts off. Several addresses: "a@x.com,b@y.com"
var NOTIFY_EMAIL = "";
// Skip email alerts for demo ("sample") listings while you are testing.
var NOTIFY_FOR_SAMPLE_LISTINGS = true;

var STATUSES = ["New", "Contacted", "Awaiting payment", "Confirmed", "Completed", "Cancelled", "No response"];
var STATUS_COLOURS = {
  "New": "#fde68a", "Contacted": "#bfdbfe", "Awaiting payment": "#fed7aa",
  "Confirmed": "#bbf7d0", "Completed": "#d1d5db", "Cancelled": "#fecaca", "No response": "#e5e7eb",
};

var BOOKINGS = {
  name: "Bookings",
  headers: ["Received", "Booking ref", "Status", "Guest name", "Guest WhatsApp", "Property", "Area",
    "Check-in", "Check-out", "Nights", "Guests", "Price (KES)", "Per", "Est. total (KES)",
    "Guest notes", "Sample listing?", "Listing ID", "Visitor time zone", "Page", "Your follow-up notes"],
  widths: [140, 130, 130, 140, 140, 200, 110, 95, 95, 60, 60, 95, 60, 115, 240, 90, 200, 130, 220, 260],
};
var ENQUIRIES = {
  name: "Enquiries",
  headers: ["Received", "Ref", "Status", "Type", "Name", "Contact", "Details", "Page", "Your follow-up notes"],
  widths: [140, 130, 130, 140, 140, 180, 420, 220, 260],
};

/* ----------------------------- WEB ENDPOINT -------------------------------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var row, sheet, kind = clean_(data.kind, 20);

    if (kind === "booking") {
      sheet = ensureSheet_(ss, BOOKINGS);
      row = [
        new Date(), clean_(data.ref, 20), "New", clean_(data.guestName, 80), clean_(data.guestPhone, 25),
        clean_(data.propertyName, 120), clean_(data.area, 60),
        dateOrText_(data.checkIn), dateOrText_(data.checkOut), num_(data.nights), num_(data.guests),
        num_(data.price), clean_(data.unit, 10), num_(data.estimatedTotal),
        clean_(data.notes, 500), data.sample ? "Yes" : "No", clean_(data.propertyId, 100),
        clean_(data.timezone, 60), clean_(data.page, 300), "",
      ];
    } else if (kind === "enquiry") {
      sheet = ensureSheet_(ss, ENQUIRIES);
      row = [
        new Date(), clean_(data.ref, 20), "New", clean_(data.type, 60), clean_(data.name, 80),
        clean_(data.contact, 120), clean_(data.details, 2000), clean_(data.page, 300), "",
      ];
    } else {
      return text_("ignored");
    }

    if (!row[1]) return text_("missing ref");
    if (isDuplicate_(sheet, row[1])) return text_("duplicate");
    sheet.appendRow(row);
    notify_(kind, row, data);
    return text_("ok");
  } catch (err) {
    console.error(err);
    return text_("error");
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return text_("Booking tracker is running. The website sends requests here with POST.");
}

/* ----------------------------- ONE-TIME SETUP ------------------------------ */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet_(ss, BOOKINGS);
  ensureSheet_(ss, ENQUIRIES);
  buildSummary_(ss);
  var first = ss.getSheetByName("Sheet1");
  if (first && first.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(first);
  ss.setActiveSheet(ss.getSheetByName("Summary"));
  try { SpreadsheetApp.getUi().alert("Booking tracker is ready. Next: Deploy → New deployment → Web app."); } catch (e) { /* no UI in this context */ }
}

/** Optional: run once to add a test row and check everything works. */
function addTestBooking() {
  doPost({ postData: { contents: JSON.stringify({
    kind: "booking", ref: "MK-TEST-" + Math.floor(Math.random() * 9000 + 1000),
    propertyName: "Test property", area: "Westlands", checkIn: "2026-12-01", checkOut: "2026-12-04",
    nights: 3, guests: 2, guestName: "Test Guest", guestPhone: "+254 700 000 000", price: 9500, unit: "night",
    estimatedTotal: 28500, notes: "This is a test row — delete me", sample: true, propertyId: "test",
  }) } });
}

/* ----------------------------- HELPERS ------------------------------------- */
function ensureSheet_(ss, def) {
  var sh = ss.getSheetByName(def.name);
  if (!sh) sh = ss.insertSheet(def.name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, def.headers.length).setValues([def.headers])
      .setFontWeight("bold").setBackground("#0b1f3a").setFontColor("#ffffff").setWrap(true);
    sh.setFrozenRows(1);
    def.widths.forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });
    sh.getRange("A2:A").setNumberFormat("dd mmm yyyy, hh:mm");

    // Status dropdown + colours
    var status = sh.getRange(2, 3, sh.getMaxRows() - 1, 1);
    status.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build());
    var rules = STATUSES.map(function (s) {
      return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(STATUS_COLOURS[s]).setRanges([status]).build();
    });
    sh.setConditionalFormatRules(rules);
    if (def === BOOKINGS) {
      sh.getRange("H2:I").setNumberFormat("ddd dd mmm yyyy");
      sh.getRange("L2:L").setNumberFormat("#,##0");
      sh.getRange("N2:N").setNumberFormat("#,##0");
    }
    sh.getRange(1, 1, 1, def.headers.length).createFilter();
  }
  return sh;
}

function buildSummary_(ss) {
  var sh = ss.getSheetByName("Summary") || ss.insertSheet("Summary", 0);
  sh.clear();
  sh.getRange("A1").setValue("Booking tracker — summary").setFontSize(16).setFontWeight("bold");
  sh.getRange("A2").setValue("Updates automatically. Change a request's Status on the Bookings / Enquiries tabs.").setFontColor("#5d6a80");

  var rows = [["Bookings by status", "Count", "Est. value (KES)"]];
  STATUSES.forEach(function (s) {
    rows.push([s, '=COUNTIF(Bookings!C:C,"' + s + '")', '=SUMIF(Bookings!C:C,"' + s + '",Bookings!N:N)']);
  });
  rows.push(["Total requests", "=COUNTA(Bookings!B2:B)", "=SUM(Bookings!N2:N)"]);
  sh.getRange(4, 1, rows.length, 3).setValues(rows);
  sh.getRange(4, 1, 1, 3).setFontWeight("bold").setBackground("#0b1f3a").setFontColor("#ffffff");
  sh.getRange(4 + rows.length - 1, 1, 1, 3).setFontWeight("bold");
  sh.getRange(5, 3, rows.length - 1, 1).setNumberFormat("#,##0");

  var r = 5 + rows.length + 1;
  var more = [
    ["At a glance", ""],
    ["Booking requests in the last 7 days", "=COUNTIF(Bookings!A:A,\">=\"&(TODAY()-7))"],
    ["Booking requests this month", "=COUNTIFS(Bookings!A:A,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1))"],
    ["Confirmed + completed value (KES)", "=SUMIF(Bookings!C:C,\"Confirmed\",Bookings!N:N)+SUMIF(Bookings!C:C,\"Completed\",Bookings!N:N)"],
    ["Conversion (confirmed + completed ÷ all)", "=IFERROR((COUNTIF(Bookings!C:C,\"Confirmed\")+COUNTIF(Bookings!C:C,\"Completed\"))/COUNTA(Bookings!B2:B),0)"],
    ["Open enquiries (status New)", "=COUNTIF(Enquiries!C:C,\"New\")"],
    ["Upcoming check-ins (next 14 days, confirmed)", "=COUNTIFS(Bookings!C:C,\"Confirmed\",Bookings!H:H,\">=\"&TODAY(),Bookings!H:H,\"<=\"&(TODAY()+14))"],
  ];
  sh.getRange(r, 1, more.length, 2).setValues(more);
  sh.getRange(r, 1, 1, 2).setFontWeight("bold").setBackground("#0b1f3a").setFontColor("#ffffff");
  sh.getRange(r + 3, 2).setNumberFormat("#,##0");
  sh.getRange(r + 4, 2).setNumberFormat("0%");
  sh.setColumnWidth(1, 330); sh.setColumnWidth(2, 110); sh.setColumnWidth(3, 150);
}

function notify_(kind, row, data) {
  if (NOTIFY_EMAIL === "none") return;
  if (kind === "booking" && data.sample && !NOTIFY_FOR_SAMPLE_LISTINGS) return;
  var to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  if (!to) return;
  var url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  var subject, body;
  if (kind === "booking") {
    subject = "New booking request " + row[1] + " — " + row[5];
    body = [
      "A guest has started a booking request on the website.",
      "",
      "Ref: " + row[1],
      "Property: " + row[5] + " (" + row[6] + ")",
      "Dates: " + data.checkIn + " → " + data.checkOut + " (" + row[9] + " nights)",
      "Guests: " + row[10],
      "Guest: " + (row[3] || "—") + (row[4] ? " · " + row[4] : ""),
      "Estimated total: KES " + Number(row[13] || 0).toLocaleString(),
      row[14] ? "Notes: " + row[14] : "",
      "",
      "The guest's WhatsApp message (with this ref) should arrive in your chats shortly.",
      "Track it here: " + url,
    ].join("\n");
  } else {
    subject = "New enquiry " + row[1] + " — " + row[3];
    body = ["New " + row[3] + " enquiry from the website.", "", "Ref: " + row[1],
      row[4] ? "Name: " + row[4] : "", row[5] ? "Contact: " + row[5] : "", "", row[6], "", "Track it here: " + url].join("\n");
  }
  MailApp.sendEmail(to, subject, body);
}

function isDuplicate_(sheet, ref) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var n = Math.min(200, last - 1);
  var refs = sheet.getRange(last - n + 1, 2, n, 1).getValues();
  for (var i = 0; i < refs.length; i++) if (refs[i][0] === ref) return true;
  return false;
}

/** Trim, limit length and neutralise spreadsheet formulas (formula injection). */
function clean_(v, max) {
  if (v === null || v === undefined) return "";
  var s = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max || 200);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}
function num_(v) { var n = Number(v); return isFinite(n) ? n : ""; }
function dateOrText_(v) {
  var s = clean_(v, 10);
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : s;
}
function text_(s) { return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT); }
