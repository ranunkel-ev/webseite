# Programming

- Use astro for the design
- Make content editable by keystatic
- Use mdoc for rich text fields
- Update CLAUDE.md if something changes

# Project Structure

```
src/
  pages/          # Astro pages (index, kindergarten, spielgruppe, traegerverein, faq, aktuelles, impressum, datenschutz, kontakt)
  components/
    RichText.tsx  # DocumentRenderer for body fields; component block renderers here
    SiteNav.astro
    SiteFooter.astro
  keystatic/
    componentBlocks.tsx  # Rich-text component blocks (currently: hinweis only)
  layouts/
    BaseLayout.astro
  styles/
    global.css    # All styles; design tokens in :root at the top
  utils/
    plainText.ts

keystatic.config.ts  # All Keystatic singleton schemas (homepage, kindergarten, spielgruppe, traegerverein, faq, aktuelles, impressum, datenschutz, kontakt, site)

content/pages/   # YAML + mdoc files managed by Keystatic
  home.yaml
  kindergarten.yaml + kindergarten/body.mdoc
  spielgruppe.yaml + spielgruppe/body.mdoc
  traegerverein.yaml + traegerverein/body.mdoc
  faq.yaml + faq/body.mdoc
  aktuelles.yaml + aktuelles/items/*/body.mdoc
  impressum.yaml + impressum/body.mdoc
  datenschutz.yaml + datenschutz/body.mdoc
  kontakt.yaml + kontakt/body.mdoc
  site.yaml
```

# Design Tokens (global.css :root)

- `--c-gold: #d4a832` — gold/yellow (Aktuelles banner, CTA bar background)
- `--c-green: #2d4a2f` — dark green (nav, buttons, headings)
- `--c-green-md: #5c8552` — medium green
- `--c-bg: #f4f0e8` — warm off-white page background
- `--c-brown: #b8834a` — brown accents
- `--f-serif: 'Lora'` — serif headings
- `--f-sans: 'DM Sans'` — body text

# CTA-Box Pattern

CTA boxes are separate optional fields in each page singleton (not inline component blocks). Schema: `enabled` (checkbox), `text`, `buttonLabel`, `buttonHref`, `secondaryLabel`, `secondaryHref`. Rendered in the Astro page after the prose content. Background uses `--c-gold` (matching Aktuelles banner).
