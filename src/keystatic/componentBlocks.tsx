import { component, fields, NotEditable } from '@keystatic/core';

/**
 * Component-Blocks, die in den Rich-Text-Body der Inhaltsseiten eingefügt werden
 * können. Die Vorschau (`preview`) erscheint im Keystatic-Editor; das eigentliche
 * Frontend-Markup wird in src/components/RichText.tsx gerendert.
 */
export const componentBlocks = {
  cta: component({
    label: 'CTA-Box',
    schema: {
      text: fields.text({ label: 'Text' }),
      buttonLabel: fields.text({ label: 'Button-Text (primär)' }),
      buttonHref: fields.text({
        label: 'Button-Link (primär)',
        description: 'z. B. /anmeldung',
      }),
      secondaryLabel: fields.text({ label: 'Button-Text (sekundär, optional)' }),
      secondaryHref: fields.text({
        label: 'Button-Link (sekundär)',
        description: 'z. B. /kontakt',
      }),
    },
    preview: (props) => (
      <NotEditable>
        <div
          style={{
            background: '#2d4a2f',
            color: '#fff',
            borderRadius: 12,
            padding: '16px 20px',
          }}
        >
          <div>{props.fields.text.value || 'CTA-Text …'}</div>
          <strong>{props.fields.buttonLabel.value || 'Button'}</strong>
          {props.fields.secondaryLabel.value ? (
            <span> · {props.fields.secondaryLabel.value}</span>
          ) : null}
        </div>
      </NotEditable>
    ),
  }),

  hinweis: component({
    label: 'Hinweis-Box',
    schema: {
      text: fields.text({ label: 'Text', multiline: true }),
    },
    preview: (props) => (
      <NotEditable>
        <div
          style={{
            borderLeft: '4px solid #b8834a',
            background: '#f7f3ec',
            padding: '12px 16px',
            borderRadius: 6,
          }}
        >
          {props.fields.text.value || 'Hinweis …'}
        </div>
      </NotEditable>
    ),
  }),
};
