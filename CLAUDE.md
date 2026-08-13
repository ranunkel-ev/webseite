# Programming

- Use astro for the design
- Make content editable by keystatic
- Use mdoc for rich text fields
- Update CLAUDE.md if something changes

## Language

Everything in the repo is English — no German anywhere in the code, even when
the conversation is in German. That covers identifiers (variables, functions,
types, components, props, CSS class names), comments, schema and field keys,
Markdoc tag and attribute names, file names, commit messages, and CI step
names.

The only German is text that a visitor or an editor actually reads:

- site copy in `content/` and hard-coded fallback strings in the pages
- Keystatic UI labels, descriptions and placeholders (`label:`, `description:`)
- URL segments that are page names (`/aktuelles`, `/impressum`, `/anmeldung`)
  and slugs generated from German titles

# Project Structure

```
src/
  pages/          # Astro pages (index, kindergarten, spielgruppe, traegerverein, faq, aktuelles, aktuelles/[slug] (Beitrag-Detailseite), anmeldung, impressum, datenschutz, kontakt)
  components/
    RichText.tsx  # Markdoc React renderer for body fields; content component renderers here
    SiteNav.astro
    SiteFooter.astro
  keystatic/
    contentComponents.tsx  # Rich-text content component (documentLink) + markdocOptions
  layouts/
    BaseLayout.astro
  styles/
    global.css    # All styles; design tokens in :root at the top
  utils/
    markdoc.ts    # Shared Markdoc config + renderBody() (AST → renderable tree)
    plainText.ts  # markdocToPlainText for meta descriptions
    slug.ts       # slugify + buildAktuellesSlugs (Detailseiten-URLs aus Beitragstiteln, Umlaut-Transliteration)

keystatic.config.ts  # All Keystatic singleton schemas (homepage, kindergarten, spielgruppe, traegerverein, faq, aktuelles, anmeldung, impressum, datenschutz, kontakt, site)

.github/workflows/
  deploy.yml     # Static build + SFTP mirror to the Strato webspace

content/pages/   # YAML + mdoc files managed by Keystatic
  home.yaml
  kindergarten.yaml + kindergarten/body.mdoc
  spielgruppe.yaml + spielgruppe/body.mdoc
  traegerverein.yaml + traegerverein/body.mdoc
  faq.yaml + faq/body.mdoc
  aktuelles.yaml + aktuelles/items/*/body.mdoc
  anmeldung.yaml + anmeldung/body.mdoc
  impressum.yaml + impressum/body.mdoc
  datenschutz.yaml + datenschutz/body.mdoc
  kontakt.yaml + kontakt/body.mdoc
  site.yaml

public/downloads/  # Documents (PDFs) uploaded through the rich-text editor
```

# Rich Text

All body fields use `fields.markdoc` (not the deprecated `fields.document`), sharing
one `bodyMarkdoc()` helper in `keystatic.config.ts` and the `markdocOptions` from
`src/keystatic/contentComponents.tsx`. Content components are written with the
`@keystatic/core/content-components` API:

There is one component: `documentLink` — inline,
`{% documentLink file="…" label="…" /%}` → `.doc-link` in the middle of a
sentence.

Adding a component means three places: the definition in `contentComponents.tsx`,
the tag → component name mapping in `src/utils/markdoc.ts`, and the React renderer
in `src/components/RichText.tsx`.

`documentLink` ships its own `NodeView` (Keystar UI dialog) instead of a `ContentView`.
Keystatic's insert command only inserts the node without selecting it, so its
built-in edit popover would stay hidden until the editor clicks the node — the
NodeView renders regardless of selection and opens the dialog itself whenever the
node has no file yet. The dialog also restricts the picker to PDFs (`fields.file`
has no type filter) and normalizes the filename itself.

Uploads go to `public/downloads/` (public path `/downloads/`); identical filenames
overwrite each other.

# Deployment

Two build targets from one `astro.config.mjs`, switched by `DEPLOY_TARGET`:

- `DEPLOY_TARGET=static` — no adapter, no Keystatic integration. Pure static
  output for the Strato webspace (Apache/PHP, no Node runtime).
- unset — Netlify adapter plus Keystatic integration. Only this deployment
  serves the editing UI at `/keystatic`; those routes are `prerender: false`
  and need a server runtime, so they cannot run on Strato.

`.github/workflows/deploy.yml` builds the static target on every push to `main`
(including Keystatic's content commits) and mirrors `dist/` to Strato with
`lftp mirror --reverse --delete` over SFTP.

Required repo secrets: `STRATO_SFTP_HOST`, `STRATO_SFTP_USER`,
`STRATO_SFTP_PASSWORD`; optional `STRATO_SFTP_PORT` (default 22) and
`STRATO_SSH_KNOWN_HOSTS` (host key pinning). Optional repo variable
`STRATO_REMOTE_DIR` (default `/`).

Because the mirror deletes remote files that are absent locally, the workflow
aborts when `dist/index.html` is missing, excludes `.well-known/`, and offers a
`dry_run` input via *Run workflow*.

# Design Tokens (global.css :root)

- `--c-gold: #d4a832` — gold/yellow (Aktuelles banner, CTA bar background)
- `--c-green: #2d4a2f` — dark green (nav, buttons, headings)
- `--c-green-md: #507448` — medium green (eyebrow labels, `.prose h2`)
- `--c-bg: #f4f0e8` — warm off-white page background
- `--c-brown: #b8834a` — brown accents (borders and backgrounds only, too light
  for text)
- `--f-serif: 'Lora'` — serif headings
- `--f-sans: 'DM Sans'` — body text

Text colors must hold WCAG AA (4.5:1) against every background they land on —
`--c-green-md` and `--c-text-xlt` are picked for exactly that and should not be
lightened. The small uppercase eyebrow labels are the tightest case, because
they sit on white and on `--c-bg`.

# Fonts

Self-hosted, no Google Fonts — no visitor IPs leave the server (GDPR). The
`@font-face` rules sit at the top of `global.css`, the woff2 files in
`public/fonts/`. They are the variable fonts from `@fontsource-variable/lora`
5.3.0 and `@fontsource-variable/dm-sans` 5.3.0 (subsets latin + latin-ext only;
Lora also italic, DM Sans normal only — its italic is synthesized, as before).
The packages are not dependencies; to update, install them temporarily, copy the
files from `node_modules/@fontsource-variable/*/files/` and uninstall again.

The site sets no cookies and loads no third-party resources.
