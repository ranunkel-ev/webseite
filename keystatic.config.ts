import { config, fields, singleton } from "@keystatic/core";
import { componentBlocks } from "./src/keystatic/componentBlocks";

/** Gemeinsame Formatierungs-Optionen für die Seiten-Body-Felder (Hybrid-Modell). */
const bodyDocument = (label: string) =>
  fields.document({
    label,
    formatting: {
      headingLevels: { levels: [2, 3] },
      inlineMarks: { bold: true, italic: true },
      listTypes: { ordered: true, unordered: true },
    },
    dividers: true,
    tables: true,
    links: true,
    componentBlocks,
  });

export default config({
  // Lokal ohne GitHub-Login arbeiten; nur im Production-Build via GitHub speichern.
  storage:
    import.meta.env?.DEV ?? process.env.NODE_ENV !== "production"
      ? { kind: "local" }
      : { kind: "github", repo: "mhaertwig/ranunkel" },
  ui: {
    brand: { name: "Ranunkel e.V." },
  },
  singletons: {
    site: singleton({
      label: "Website (global)",
      path: "content/site",
      schema: {
        nav: fields.object(
          {
            brandPrimary: fields.text({ label: "Marke" }),
            brandSub: fields.text({ label: "Untertitel" }),
          },
          { label: "Navigation" },
        ),
        footer: fields.object(
          {
            copy: fields.text({ label: "Copyright-/Adresszeile" }),
          },
          { label: "Footer" },
        ),
      },
    }),

    traegerverein: singleton({
      label: "Trägerverein",
      path: "content/pages/traegerverein",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Tag-Zeile" }),
            title: fields.text({ label: "Titel" }),
            description: fields.text({
              label: "Beschreibungstext",
              multiline: true,
            }),
          },
          { label: "Header" },
        ),
        body: bodyDocument("Seiteninhalt"),
        cta: fields.object(
          {
            enabled: fields.checkbox({ label: "CTA-Box anzeigen", defaultValue: false }),
            text: fields.text({ label: "Text", multiline: true }),
            buttonLabel: fields.text({ label: "Button-Text (primär)" }),
            buttonHref: fields.text({ label: "Button-Link (primär)", description: "z. B. /kontakt" }),
            secondaryLabel: fields.text({ label: "Button-Text (sekundär, optional)" }),
            secondaryHref: fields.text({ label: "Button-Link (sekundär)" }),
          },
          { label: "CTA-Box (optional)" },
        ),
      },
    }),

    kindergarten: singleton({
      label: "Kindergarten",
      path: "content/pages/kindergarten",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Tag-Zeile" }),
            title: fields.text({ label: "Titel" }),
            quote: fields.text({ label: "Zitat", multiline: true }),
          },
          { label: "Header" },
        ),
        infoBox: fields.array(
          fields.object({
            label: fields.text({ label: "Bezeichnung (z.B. Alter)" }),
            value: fields.text({ label: "Wert", multiline: true }),
          }),
          {
            label: "Kurzinfos",
            itemLabel: (props) => props.fields.label.value || "Info",
          },
        ),
        body: bodyDocument("Seiteninhalt"),
        cta: fields.object(
          {
            enabled: fields.checkbox({ label: "CTA-Box anzeigen", defaultValue: false }),
            text: fields.text({ label: "Text", multiline: true }),
            buttonLabel: fields.text({ label: "Button-Text (primär)" }),
            buttonHref: fields.text({ label: "Button-Link (primär)", description: "z. B. /anmeldung" }),
            secondaryLabel: fields.text({ label: "Button-Text (sekundär, optional)" }),
            secondaryHref: fields.text({ label: "Button-Link (sekundär)" }),
          },
          { label: "CTA-Box (optional)" },
        ),
      },
    }),

    spielgruppe: singleton({
      label: "Spielgruppe",
      path: "content/pages/spielgruppe",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Tag-Zeile" }),
            title: fields.text({ label: "Titel" }),
            quote: fields.text({ label: "Zitat", multiline: true }),
          },
          { label: "Header" },
        ),
        infoBox: fields.array(
          fields.object({
            label: fields.text({ label: "Bezeichnung" }),
            value: fields.text({ label: "Wert", multiline: true }),
          }),
          {
            label: "Kurzinfos",
            itemLabel: (props) => props.fields.label.value || "Info",
          },
        ),
        body: bodyDocument("Seiteninhalt"),
        cta: fields.object(
          {
            enabled: fields.checkbox({ label: "CTA-Box anzeigen", defaultValue: false }),
            text: fields.text({ label: "Text", multiline: true }),
            buttonLabel: fields.text({ label: "Button-Text (primär)" }),
            buttonHref: fields.text({ label: "Button-Link (primär)", description: "z. B. /anmeldung" }),
            secondaryLabel: fields.text({ label: "Button-Text (sekundär, optional)" }),
            secondaryHref: fields.text({ label: "Button-Link (sekundär)" }),
          },
          { label: "CTA-Box (optional)" },
        ),
      },
    }),

    aktuelles: singleton({
      label: "Aktuelles",
      path: "content/pages/aktuelles",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Tag-Zeile" }),
            title: fields.text({ label: "Titel" }),
            description: fields.text({
              label: "Beschreibungstext",
              multiline: true,
            }),
          },
          { label: "Header" },
        ),
        items: fields.array(
          fields.object({
            highlight: fields.checkbox({
              label: "Highlight",
              description: "Als Highlight markieren und auf der Startseite anzeigen",
            }),
            date: fields.text({ label: "Datum (z.B. Juni 2026)" }),
            title: fields.text({ label: "Titel" }),
            image: fields.image({
              label: "Bild (optional)",
              directory: "public/images/aktuelles",
              publicPath: "/images/aktuelles/",
            }),
            body: fields.document({
              label: "Text",
              formatting: {
                inlineMarks: { bold: true, italic: true },
                listTypes: { ordered: true, unordered: true },
              },
              links: true,
            }),
          }),
          {
            label: "Beiträge",
            itemLabel: (props) =>
              props.fields.title.value || "Neuer Beitrag",
          },
        ),
      },
    }),

    faq: singleton({
      label: "FAQ",
      path: "content/pages/faq",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Tag-Zeile" }),
            title: fields.text({ label: "Titel" }),
            description: fields.text({
              label: "Beschreibungstext",
              multiline: true,
            }),
          },
          { label: "Header" },
        ),
        body: fields.document({
          label: "FAQ-Inhalt",
          formatting: {
            headingLevels: {
              levels: [2, 3],
            },
            inlineMarks: { bold: true, italic: true },
            listTypes: { ordered: true, unordered: true },
          },
          dividers: true,
          tables: true,
          links: true,
        }),
        cta: fields.object(
          {
            enabled: fields.checkbox({ label: "CTA-Box anzeigen", defaultValue: true }),
            text: fields.text({ label: "Text", multiline: true }),
            buttonLabel: fields.text({ label: "Button-Text (primär)" }),
            buttonHref: fields.text({ label: "Button-Link (primär)", description: "z. B. /kontakt" }),
            secondaryLabel: fields.text({ label: "Button-Text (sekundär, optional)" }),
            secondaryHref: fields.text({ label: "Button-Link (sekundär)" }),
          },
          { label: "CTA-Box (optional)" },
        ),
      },
    }),

    impressum: singleton({
      label: "Impressum",
      path: "content/pages/impressum",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Tag-Zeile" }),
            title: fields.text({ label: "Titel" }),
            description: fields.text({
              label: "Beschreibungstext",
              multiline: true,
            }),
          },
          { label: "Header" },
        ),
        body: bodyDocument("Seiteninhalt"),
        cta: fields.object(
          {
            enabled: fields.checkbox({ label: "CTA-Box anzeigen", defaultValue: false }),
            text: fields.text({ label: "Text", multiline: true }),
            buttonLabel: fields.text({ label: "Button-Text (primär)" }),
            buttonHref: fields.text({ label: "Button-Link (primär)", description: "z. B. /kontakt" }),
            secondaryLabel: fields.text({ label: "Button-Text (sekundär, optional)" }),
            secondaryHref: fields.text({ label: "Button-Link (sekundär)" }),
          },
          { label: "CTA-Box (optional)" },
        ),
      },
    }),

    datenschutz: singleton({
      label: "Datenschutz",
      path: "content/pages/datenschutz",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Tag-Zeile" }),
            title: fields.text({ label: "Titel" }),
            description: fields.text({
              label: "Beschreibungstext",
              multiline: true,
            }),
          },
          { label: "Header" },
        ),
        body: bodyDocument("Seiteninhalt"),
        cta: fields.object(
          {
            enabled: fields.checkbox({ label: "CTA-Box anzeigen", defaultValue: false }),
            text: fields.text({ label: "Text", multiline: true }),
            buttonLabel: fields.text({ label: "Button-Text (primär)" }),
            buttonHref: fields.text({ label: "Button-Link (primär)", description: "z. B. /kontakt" }),
            secondaryLabel: fields.text({ label: "Button-Text (sekundär, optional)" }),
            secondaryHref: fields.text({ label: "Button-Link (sekundär)" }),
          },
          { label: "CTA-Box (optional)" },
        ),
      },
    }),

    kontakt: singleton({
      label: "Kontakt",
      path: "content/pages/kontakt",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Tag-Zeile" }),
            title: fields.text({ label: "Titel" }),
            description: fields.text({
              label: "Beschreibungstext",
              multiline: true,
            }),
          },
          { label: "Header" },
        ),
        body: bodyDocument("Seiteninhalt"),
        cta: fields.object(
          {
            enabled: fields.checkbox({ label: "CTA-Box anzeigen", defaultValue: false }),
            text: fields.text({ label: "Text", multiline: true }),
            buttonLabel: fields.text({ label: "Button-Text (primär)" }),
            buttonHref: fields.text({ label: "Button-Link (primär)", description: "z. B. /kontakt" }),
            secondaryLabel: fields.text({ label: "Button-Text (sekundär, optional)" }),
            secondaryHref: fields.text({ label: "Button-Link (sekundär)" }),
          },
          { label: "CTA-Box (optional)" },
        ),
      },
    }),

    homepage: singleton({
      label: "Startseite",
      path: "content/pages/home",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({
              label: 'Tag-Zeile (z.B. "Waldkirch · Seit 1997")',
            }),
            title: fields.text({
              label: "Titel",
              multiline: true,
            }),
            description: fields.text({
              label: "Beschreibungstext",
              multiline: true,
            }),
            image: fields.image({
              label: "Bild",
              directory: "public/images",
              publicPath: "/images/",
            }),
          },
          { label: "Header" },
        ),
        quote: fields.object(
          {
            text: fields.text({ label: "Zitat", multiline: true }),
            sub: fields.text({ label: "Unterzeile", multiline: true }),
          },
          { label: "Zitat-Abschnitt" },
        ),
        features: fields.array(
          fields.object({
            eyebrow: fields.text({ label: "Tag-Zeile (z.B. Alter)" }),
            title: fields.text({ label: "Titel" }),
            description: fields.text({ label: "Text", multiline: true }),
            href: fields.text({ label: "Link (z.B. /kindergarten)" }),
            image: fields.image({
              label: "Bild (optional, ersetzt das Symbol)",
              directory: "public/images/features",
              publicPath: "/images/features/",
            }),
            icon: fields.select({
              label: "Symbol (Fallback wenn kein Bild)",
              options: [
                { label: "Baum (Kindergarten)", value: "kg" },
                { label: "Busch (Spielgruppe)", value: "sg" },
              ],
              defaultValue: "kg",
            }),
          }),
          {
            label: "Feature-Karten",
            itemLabel: (props) => props.fields.title.value || "Karte",
          },
        ),
      },
    }),
  },
});
