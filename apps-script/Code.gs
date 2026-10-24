/**
 * THE HOT SIT - Google Apps Script backend
 *
 * Does three things:
 *  1. Saves website form submissions to the "Enquiries" sheet.
 *  2. Sends an automatic confirmation email to the customer (+ alert to the owner).
 *  3. Serves the "Services" and "Gallery" sheets to the website as JSON.
 *
 * SETUP: see README.md. Run setup() once, then deploy as a Web App.
 */

var OWNER_EMAIL = "tpy.media0@gmail.com";
var BUSINESS = "The Hot Sit";
var PHONE = "064 987 0578";
var LOCATION = "Mall of the South";

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var enq = ss.getSheetByName("Enquiries") || ss.insertSheet("Enquiries");
  if (enq.getLastRow() === 0) {
    enq.appendRow(["Timestamp", "Name", "Email", "Phone", "Service", "Preferred Date", "Message", "Auto-reply Sent"]);
    enq.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#c9a24b");
    enq.setFrozenRows(1);
  }

  var svc = ss.getSheetByName("Services") || ss.insertSheet("Services");
  if (svc.getLastRow() === 0) {
    svc.appendRow(["Category", "Name", "Price"]);
    [
      ["Hair", "Installation", "From R800"], ["Hair", "Blow Out", "From R200"],
      ["Hair", "Braiding", "From R650"], ["Hair", "Step 1 Treatment", "From R200"],
      ["Nails", "Manicure", "From R300"], ["Nails", "Pedicure", "From R350"],
      ["Nails", "Nail Repair", "From R600"], ["Nails", "Nail Extensions", "From R180"],
      ["Make-Up", "Full Glam", "R3 500"], ["Make-Up", "Bridal Look", "R4 000"],
      ["Make-Up", "Soft Glam", "R2 800"]
    ].forEach(function (r) { svc.appendRow(r); });
    svc.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#e0689a").setFontColor("#ffffff");
    svc.setFrozenRows(1);
  }

  var gal = ss.getSheetByName("Gallery") || ss.insertSheet("Gallery");
  if (gal.getLastRow() === 0) {
    gal.appendRow(["Category", "Title", "Image URL"]);
    gal.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#e0689a").setFontColor("#ffffff");
    gal.setFrozenRows(1);
  }
}

/** Website form submissions */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var name = clean(d.name), email = clean(d.email), phone = clean(d.phone);
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Invalid submission");

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Enquiries");
    if (!sheet) { setup(); sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Enquiries"); }

    var row = [new Date(), name, email, phone, clean(d.service), clean(d.date), clean(d.message), "No"];
    sheet.appendRow(row);
    var rowNum = sheet.getLastRow();

    // Auto-response to customer
    try {
      MailApp.sendEmail({
        to: email,
        replyTo: OWNER_EMAIL,
        name: BUSINESS,
        subject: "We received your request - " + BUSINESS,
        body: "Hi " + name + ",\n\nThank you for contacting " + BUSINESS + "! This is an automatic confirmation that we have received your request.\n\n" +
          "Service: " + (clean(d.service) || "General enquiry") + "\nPreferred date: " + (clean(d.date) || "Not specified") + "\n\n" +
          "A member of our team will contact you shortly on " + phone + " to confirm your booking.\n\n" +
          "Need us sooner? Call or WhatsApp " + PHONE + ".\n\nWith love,\nThe " + BUSINESS + " Team\n" + LOCATION,
        htmlBody: autoReplyHtml(name, clean(d.service), clean(d.date), phone)
      });
      sheet.getRange(rowNum, 8).setValue("Yes");
    } catch (mailErr) {
      sheet.getRange(rowNum, 8).setValue("Failed: " + mailErr.message);
    }

    // Alert to owner
    try {
      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: "New website enquiry from " + name,
        body: "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\nService: " + clean(d.service) +
          "\nDate: " + clean(d.date) + "\n\nMessage:\n" + clean(d.message)
      });
    } catch (ignore) {}

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  }
}

/** Services and gallery for the website */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (action === "services") return json(readSheet(ss, "Services", ["category", "name", "price"]));
  if (action === "gallery") return json(readSheet(ss, "Gallery", ["category", "title", "url"]));
  return json({ ok: true, service: BUSINESS });
}

function readSheet(ss, tab, keys) {
  var sh = ss.getSheetByName(tab);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, keys.length).getValues()
    .filter(function (r) { return r[0] !== "" && r[1] !== ""; })
    .map(function (r) {
      var o = {};
      keys.forEach(function (k, i) { o[k] = String(r[i]); });
      return o;
    });
}

function clean(v) {
  v = String(v == null ? "" : v).trim().slice(0, 2000);
  // Prevent spreadsheet formula injection
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function autoReplyHtml(name, service, date, phone) {
  return '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:2px solid #c9a24b;border-radius:14px;overflow:hidden">' +
    '<div style="background:linear-gradient(135deg,#e0689a,#b83c74);color:#fff;text-align:center;padding:28px 20px">' +
    '<div style="font-size:26px;letter-spacing:1px">&#10022; The Hot Sit &#10022;</div>' +
    '<div style="color:#e8cf8e;margin-top:6px">Glamour &amp; Elegance</div></div>' +
    '<div style="padding:26px 24px;color:#2a1f26;line-height:1.6">' +
    "<p>Hi <b>" + esc(name) + "</b>,</p>" +
    "<p>Thank you for contacting <b>The Hot Sit</b>! This is an automatic confirmation that we have received your request.</p>" +
    '<table style="width:100%;background:#fff5f9;border-radius:10px;padding:12px;font-size:14px">' +
    "<tr><td><b>Service:</b></td><td>" + esc(service || "General enquiry") + "</td></tr>" +
    "<tr><td><b>Preferred date:</b></td><td>" + esc(date || "Not specified") + "</td></tr>" +
    "<tr><td><b>Contact number:</b></td><td>" + esc(phone) + "</td></tr></table>" +
    "<p>Our team will contact you shortly to confirm your booking.</p>" +
    "<p>Need us sooner? Call or WhatsApp <b>" + PHONE + "</b>.</p>" +
    '<p style="margin-top:20px">With love,<br><b>The Hot Sit Team</b><br>' + LOCATION + "</p></div></div>";
}
