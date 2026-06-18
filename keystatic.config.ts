import { config, fields, singleton } from "@keystatic/core";

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Ranunkel e.V." },
  },
  singletons: {
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
        founding: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            content: fields.document({
              label: "Inhalt",
              formatting: {
                inlineMarks: { bold: true, italic: true },
                listTypes: { ordered: true, unordered: true },
              },
              links: true,
            }),
          },
          { label: "Entstehung" },
        ),
        milestones: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            items: fields.array(
              fields.object({
                year: fields.text({ label: "Jahr" }),
                title: fields.text({ label: "Titel" }),
                description: fields.text({
                  label: "Beschreibung",
                  multiline: true,
                }),
              }),
              {
                label: "Meilensteine",
                itemLabel: (props) =>
                  props.fields.year.value || "Meilenstein",
              },
            ),
          },
          { label: "Meilensteine" },
        ),
        tasks: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            content: fields.document({
              label: "Aufgaben (als Liste)",
              formatting: {
                inlineMarks: { bold: true, italic: true },
                listTypes: { ordered: true, unordered: true },
              },
              links: true,
            }),
          },
          { label: "Aufgaben" },
        ),
        financing: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            content: fields.document({
              label: "Inhalt (Einleitung + Liste)",
              formatting: {
                inlineMarks: { bold: true, italic: true },
                listTypes: { ordered: true, unordered: true },
              },
              links: true,
            }),
          },
          { label: "Finanzierung" },
        ),
        membership: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            text: fields.text({ label: "Text", multiline: true }),
          },
          { label: "Mitgliedschaft" },
        ),
        cta: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            description: fields.text({ label: "Text", multiline: true }),
            buttonText: fields.text({ label: "Button-Text" }),
          },
          { label: "Mitglied werden (CTA)" },
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
        approach: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            paragraphs: fields.array(
              fields.text({ label: "Absatz", multiline: true }),
              {
                label: "Absätze",
                itemLabel: (props) => props.value?.slice(0, 50) || "Absatz",
              },
            ),
          },
          { label: "Unser Ansatz" },
        ),
        schedule: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            body: fields.document({
              label: "Inhalt (Tabelle)",
              formatting: {
                inlineMarks: { bold: true, italic: true },
              },
              tables: true,
            }),
          },
          { label: "Tagesablauf" },
        ),
        fees: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            note: fields.text({ label: "Hinweis-Zeile" }),
            items: fields.array(
              fields.object({
                label: fields.text({ label: "Familientyp" }),
                amount: fields.text({ label: "Betrag (z.B. 218 €)" }),
              }),
              {
                label: "Beiträge",
                itemLabel: (props) =>
                  props.fields.label.value || "Beitrag",
              },
            ),
            footnote: fields.text({ label: "Fußnote", multiline: true }),
          },
          { label: "Monatliche Beiträge" },
        ),
        cta: fields.object(
          {
            text: fields.text({ label: "Text", multiline: true }),
            primaryLabel: fields.text({ label: "Primär-Button" }),
            secondaryLabel: fields.text({ label: "Sekundär-Button" }),
          },
          { label: "CTA" },
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
        content: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            body: fields.document({
              label: "Inhalt",
              formatting: {
                inlineMarks: { bold: true, italic: true },
                listTypes: { ordered: true, unordered: true },
              },
              links: true,
            }),
          },
          { label: "Einleitung" },
        ),
        activities: fields.object(
          {
            heading: fields.text({ label: "Überschrift" }),
            body: fields.document({
              label: "Inhalt",
              formatting: {
                inlineMarks: { bold: true, italic: true },
                listTypes: { ordered: true, unordered: true },
              },
              links: true,
            }),
          },
          { label: "Aktivitäten" },
        ),
        cta: fields.object(
          {
            text: fields.text({ label: "Text", multiline: true }),
            primaryLabel: fields.text({ label: "Primär-Button" }),
            secondaryLabel: fields.text({ label: "Sekundär-Button" }),
          },
          { label: "CTA" },
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
        categories: fields.array(
          fields.object({
            name: fields.text({ label: "Kategorie-Name" }),
            questions: fields.array(
              fields.object({
                question: fields.text({ label: "Frage" }),
                answer: fields.document({
                  label: "Antwort",
                  formatting: {
                    inlineMarks: {
                      bold: true,
                      italic: true,
                    },
                    listTypes: {
                      ordered: true,
                      unordered: true,
                    },
                  },
                  dividers: true,
                  links: true,
                }),
              }),
              {
                label: "Fragen",
                itemLabel: (props) =>
                  props.fields.question.value || "Frage",
              },
            ),
          }),
          {
            label: "Kategorien",
            itemLabel: (props) => props.fields.name.value || "Kategorie",
          },
        ),
        cta: fields.object(
          {
            text: fields.text({ label: "Text", multiline: true }),
            buttonText: fields.text({ label: "Button-Text" }),
          },
          { label: "CTA" },
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
        aktuelles: fields.object(
          {
            tag: fields.text({ label: 'Tag-Zeile (z.B. "Aktuelles")' }),
            items: fields.array(
              fields.object({
                title: fields.text({ label: "Titel" }),
                body: fields.text({ label: "Text", multiline: true }),
              }),
              {
                label: "Beiträge",
                itemLabel: (props) =>
                  props.fields.title.value || "Neuer Beitrag",
              },
            ),
          },
          { label: "Aktuelles" },
        ),
      },
    }),
  },
});
