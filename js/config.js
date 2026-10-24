/* ==========================================================
   THE HOT SIT - SITE CONFIGURATION
   Edit this file to change contact details or connect Google Sheets.
   ========================================================== */
window.HOTSIT = {
  name: "The Hot Sit",
  phoneDisplay: "064 987 0578",
  phoneTel: "+27649870578",
  whatsappNumber: "27649870578", // international format, no + or spaces
  whatsappMessage: "Hi The Hot Sit! I'd like to make a booking.",
  email: "tpy.media0@gmail.com",
  location: "Mall of the South, Johannesburg",
  mapQuery: "Mall of the South, Johannesburg",

  // After deploying apps-script/Code.gs as a Web App, paste its URL here:
  // e.g. "https://script.google.com/macros/s/AKfycb.../exec"
  scriptUrl: "https://script.google.com/macros/s/AKfycbw5RXBGJ7AkOE-NPAIXdTtXWd2UlS5GQoux9sSvgwzPGHo7URAYNGJ4niccFNMki-MK/exec",

  // Fallback content shown until the Google Sheet is connected
  // (or if it cannot be reached). Keep in the same shape as the sheet.
  services: [
    { category: "Hair", name: "Installation", price: "From R800" },
    { category: "Hair", name: "Blow Out", price: "From R200" },
    { category: "Hair", name: "Braiding", price: "From R650" },
    { category: "Hair", name: "Step 1 Treatment", price: "From R200" },
    { category: "Nails", name: "Manicure", price: "From R300" },
    { category: "Nails", name: "Pedicure", price: "From R350" },
    { category: "Nails", name: "Nail Repair", price: "From R600" },
    { category: "Nails", name: "Nail Extensions", price: "From R180" },
    { category: "Make-Up", name: "Full Glam", price: "R3 500" },
    { category: "Make-Up", name: "Bridal Look", price: "R4 000" },
    { category: "Make-Up", name: "Soft Glam", price: "R2 800" }
  ],

  // Gallery fallback: leave empty to show elegant placeholders.
  // Real images come from the "Gallery" sheet (image URL column).
  gallery: [
    { category: "Hair", title: "Knotless braids", url: "" },
    { category: "Nails", title: "Gold chrome set", url: "" },
    { category: "Make-Up", title: "Bridal glow", url: "" },
    { category: "Hair", title: "Silk blow out", url: "" },
    { category: "Nails", title: "Pink french tips", url: "" },
    { category: "Make-Up", title: "Soft glam", url: "" },
    { category: "Hair", title: "Wig installation", url: "" },
    { category: "Nails", title: "Luxury pedicure", url: "" },
    { category: "Make-Up", title: "Full glam", url: "" }
  ]
};
