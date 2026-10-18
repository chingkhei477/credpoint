# CredPoint website

Static website for CredPoint (credpoint.in): plain HTML, CSS and JavaScript. No build step, no database, no admin dashboard.

## Structure
```
index.html              Home
offers.html             Explore Offers
how-it-works.html       How It Works
about.html              About CredPoint
contact.html            Contact (form)
privacy-policy.html     Privacy Policy
terms.html              Terms & Conditions
cashback-policy.html    Cashback Policy
refund-policy.html      Refund & Cancellation Policy
404.html                Shown automatically by the host for unknown URLs

assets/css/tokens.css       colours, fonts, spacing (edit brand values here)
assets/css/base.css         reset and typography
assets/css/layout.css       header, navigation, footer, grids
assets/css/components.css   buttons, hero, reward cards, forms, FAQ, CTA
assets/css/pages.css        page headers, policies, contact, 404
assets/js/site.js           header and mobile menu (every page)
assets/js/offers-data.js    YOUR OFFERS — the only file to edit for offers
assets/js/offers.js         turns offers into reward cards, filters and search
assets/js/contact.js        contact form checks and email preparation
assets/img/                 logo, icons, social sharing image
assets/fonts/               Inter and Inter Display (SIL Open Font License)
```

Every page has the same header (Home, Explore Offers, How It Works, About, Contact) and footer (all pages and all four policies). The logo always links to the home page. Policy pages also link to each other through the tabs under the title. All internal links and assets use relative paths, so the site works on Vercel, GitHub Pages or opened straight from the folder.

## Add or change offers
Edit `assets/js/offers-data.js`. A copy-ready template is at the top of the file. Offers appear on Explore Offers automatically; the first three also show on the home page. Offers hide themselves after their `validTill` date.

## Deploy on Vercel
1. Upload this folder to a GitHub repository.
2. In Vercel choose **Add New → Project**, import the repository, framework preset **Other**, no build command.
3. Add `credpoint.in` under **Settings → Domains**.

`vercel.json` turns on short addresses (`/offers`) and adds security headers.

## Contact form
The form checks the details, then opens the visitor's email app with a message addressed to support@credpoint.in. Nothing is stored on the website. If no email app opens, the visitor can copy the message.
