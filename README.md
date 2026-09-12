# M. R. Shah Logistics Pvt. Ltd. — Corporate Website (v2)

A professional rebuild of https://www.mrshahgroup.com/ using the company's own
published data. Design v2: editorial-industrial system — expanded Archivo
grotesk display type, JetBrains Mono micro-labels, hairline rules, square
corners, sticky asymmetric columns and purposeful motion.

## Pages

```
index.html       Hero (Ken Burns + line-mask reveal + ops ticker + route beacon),
                 stats band, sticky about split, cargo index with cursor-following
                 previews, outline marquee, Tetris load-builder, control-tower,
                 group companies, CTA
about.html       Story + inner-strength quote, leadership (grayscale→color
                 portraits), mission & merits, 1966→2007 timeline
services.html    Fleet capability + tank register, 10-row cargo index with hover
                 previews, fleet gallery, safety & compliance
network.html     Branch map figure + region table (20 branches), loading points,
                 storage teaser
associates.html  Agencies & Cargo Care Ltd. + Kandla Warehouse & Logistics Pvt. Ltd.
contact.html     Dark contact board (address/phone/email/tracking), underline-style
                 enquiry form (mailto), branch chips
assets/
  css/style.css  Full design system, no framework
  js/main.js     Preloader counter, line-mask + scroll reveals, counters, parallax,
                 cursor preview, magnetic buttons, scroll progress, nav, form
  img/           Logo (client-supplied), generated fleet/warehouse/jetty imagery,
                 authentic photos from the original site (building, Chairman, MD,
                 branch map)
```

## Run

    python3 -m http.server 8000     # then open http://localhost:8000

Any static host works (Netlify, Vercel, cPanel upload) — no build step.

## Notes

- Google Fonts (Archivo + JetBrains Mono) load from CDN with full system-font
  fallbacks; the site degrades gracefully offline.
- The ops ticker and sample report extracts on the home page are illustrative
  placeholders for the live tracking portal — replace with a real feed when the
  client portal is connected.
- Enquiry form composes an e-mail to info@mrshahgroup.com via mailto:. Swap the
  submit handler in assets/js/main.js for a backend/Formspree endpoint when ready.
- All animations honour `prefers-reduced-motion`.
- All facts, figures, names and contacts are taken from mrshahgroup.com.
