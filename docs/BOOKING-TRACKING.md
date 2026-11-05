# Tracking your bookings (Google Sheets)

Every time a visitor presses **Send booking request on WhatsApp**, the website saves a copy of the request to a Google Sheet that only you can see. Enquiries go there too: contact form, airport transfers, restaurant tables and property listings. You then track each request from **New** to **Completed** in the sheet, on your computer or in the Google Sheets phone app.

It's free, you don't need to run a server, and setup takes about 10 minutes.

## What you get

| Tab | What's in it |
|---|---|
| **Summary** | Requests by status, requests this week and this month, confirmed revenue, conversion rate, upcoming check-ins |
| **Bookings** | One row per booking request: date received, **booking ref**, **status**, guest name and WhatsApp (if they gave them), property, dates, nights, guests, price, estimated total, guest notes, and a column for your own notes |
| **Enquiries** | Contact form, airport transfer, restaurant and property-listing requests, each with a ref and status |

You also get an **email alert** for every new request (optional).

### The booking reference ties it all together

Each request gets a reference like **`MK-261115-7QF2`**. The same reference appears:

- in the guest's WhatsApp message to you (`Booking ref: MK-261115-7QF2`),
- on the guest's screen after they press the button,
- in the row in your sheet.

So when a WhatsApp message arrives, search the sheet for its ref (Ctrl+F) and update that row's **Status**.

## One-time setup

### 1. Create the sheet and paste the script

1. Go to <https://sheets.new> (signed in to the Google account you want to use) and name the sheet, e.g. **Makao Stays – Bookings**.
2. In the menu, choose **Extensions → Apps Script**.
3. Delete the code in the editor, then copy and paste the entire contents of [`tools/booking-tracker/Code.gs`](../tools/booking-tracker/Code.gs).
4. Optional: near the top, set `NOTIFY_EMAIL` to the address that should receive alerts. Leave it as `""` to use your own Google account email, or set it to `"none"` to turn alerts off.
5. Click the 💾 **Save** icon.

### 2. Run setup once

1. In the toolbar's function drop-down, choose **`setup`** and click **▶ Run**.
2. Google will ask for permission. Click **Review permissions**, choose your account, then **Advanced → Go to (project name) (unsafe) → Allow**.
   The "unsafe" warning only appears because this is your own unpublished script. It only gets access to *this* spreadsheet and to sending email *from you*.
3. Go back to the sheet: you'll see the **Summary**, **Bookings** and **Enquiries** tabs.

### 3. Publish it as a web app

1. In Apps Script, click **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**. "Anyone" is needed so website visitors can *send* requests; they cannot read your sheet.
4. Click **Deploy** and copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy…/exec`.

### 4. Connect the website

Open `js/config.js` and paste the URL:

```js
tracking: {
  endpoint: "https://script.google.com/macros/s/AKfy…/exec",
},
```

Commit, push and redeploy the website.

### 5. Test it

1. On the live site, open any listing → **Book Now**, choose dates, and press the WhatsApp button.
2. Within a few seconds a new row should appear on the **Bookings** tab, and an alert email should arrive.
3. Delete the test row when you're done.

You can also test from the script editor alone: choose **`addTestBooking`** and click **Run**.

## Daily workflow

1. A WhatsApp booking message arrives, and an email alert if you turned alerts on.
2. Find the row by its **Booking ref**.
3. Update the **Status** column (it's a drop-down, colour-coded):

   | Status | Meaning |
   |---|---|
   | New | Request received, not yet handled |
   | Contacted | You replied and are checking availability |
   | Awaiting payment | Availability confirmed, payment instructions sent |
   | Confirmed | Payment verified, booking confirmed |
   | Completed | Guest has stayed |
   | Cancelled | Guest or owner cancelled |
   | No response | Guest never sent the WhatsApp message or stopped replying |

4. Use **Your follow-up notes** for anything else: amount paid, M-Pesa code, owner contacted, and so on.

Tip: use the filter buttons in the header row to show only "New" or "Awaiting payment" requests.

## Good to know

- **A row means the guest pressed the button, not necessarily that they sent the WhatsApp message.** Rows that never turn into a chat can be marked **No response**. This is still useful: it shows you which properties and dates people want.
- **Sample listings** are marked "Yes" in the *Sample listing?* column. Once real listings are live, you can filter those rows out. Set `NOTIFY_FOR_SAMPLE_LISTINGS = false` in the script to stop alert emails for them.
- **If the sheet is unreachable**, the website still opens WhatsApp as normal. Logging never blocks a booking.
- **Spam:** the web-app URL is public in your website's code, so someone could in theory send junk rows. The script limits field lengths, ignores duplicates and neutralises spreadsheet formulas. If spam becomes a problem, add a reCAPTCHA or move to a proper backend (see the README, section 10).
- **Privacy:** the guest's details are stored in your Google account. The privacy policy already explains this. Share the sheet only with people who handle bookings.
- **Updating the script later:** paste the new code, then **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same, so the website doesn't need changing.
- **Google limits:** a free Gmail account can send about 100 alert emails per day, which is plenty for most small businesses. Rows are unlimited for practical purposes.
