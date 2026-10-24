# The Hot Sit - Website

Responsive 5-page website (phone, tablet, desktop). Theme: gold and pink glamour.
Plain HTML, CSS and JavaScript, so it can be hosted anywhere (Netlify, GitHub Pages, any web host).

## Structure

```
index.html      Home
about.html      About Us
services.html   Services (prices load from Google Sheet)
gallery.html    Gallery (images load from Google Sheet)
contact.html    Contact + booking form
css/styles.css  All styling
js/config.js    Contact details, fallback services/gallery, scriptUrl
js/main.js      Menu, animations, sheet loading, form handling
apps-script/Code.gs   Google Sheets backend + auto-reply email
```

## Connect Google Sheets and the auto-reply (10 minutes)

1. Create a new Google Sheet at sheets.google.com (name it "The Hot Sit").
2. Open **Extensions > Apps Script**, delete the default code, and paste in `apps-script/Code.gs`.
3. Select the `setup` function and click **Run**. Approve the permissions. This creates three tabs:
   - **Enquiries** - every form submission is saved here.
   - **Services** - category, name, price. Edit prices here and the site updates.
   - **Gallery** - category, title, image URL. Add rows to add photos.
4. Click **Deploy > New deployment > Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy the **Web app URL**.
5. Open `js/config.js` and paste the URL into `scriptUrl`.
6. Upload the site files to your host. Test the contact form: the entry appears in the Enquiries tab and the customer receives the confirmation email.

If you change `Code.gs` later, use **Deploy > Manage deployments > Edit > New version**.

## Adding gallery photos

Put the image in your site's `images/` folder and use its full public URL, or use any public image link (for example from Google Drive set to "Anyone with the link", using the `https://drive.google.com/uc?export=view&id=FILE_ID` form). Paste the URL in the **Image URL** column.

## Notes

- Until `scriptUrl` is set, the site shows built-in services and elegant gallery placeholders, and the form tells visitors to use WhatsApp.
- The auto-reply is sent from the Google account that owns the script (tpy.media0@gmail.com). Free Gmail accounts can send about 100 automatic emails per day.
- The floating WhatsApp button opens a chat with 064 987 0578.
- Fonts load from Google Fonts, so an internet connection is needed to view them.
