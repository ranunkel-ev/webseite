import { DocumentRenderer, type DocumentRendererProps } from '@keystatic/core/renderer';

/**
 * Frontend-Renderer für Keystatic-Dokumentfelder. Ersetzt den früheren
 * handgeschriebenen docRenderer.ts und rendert zusätzlich die Component-Blocks
 * (CTA, Hinweis) mit ihrem eigenen Styling.
 *
 * Wird in Astro ohne client:-Directive eingebunden und damit serverseitig zu
 * statischem HTML gerendert.
 */
const componentBlocks: DocumentRendererProps['componentBlocks'] = {
  cta: (props: {
    text?: string;
    buttonLabel?: string;
    buttonHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  }) => (
    <div className="cta-bar">
      <p>{props.text}</p>
      <div className="cta-bar-actions">
        {props.buttonLabel && (
          <a href={props.buttonHref || '#'} className="cta-bar-primary">
            {props.buttonLabel}
          </a>
        )}
        {props.secondaryLabel && (
          <a href={props.secondaryHref || '#'} className="cta-bar-secondary">
            {props.secondaryLabel}
          </a>
        )}
      </div>
    </div>
  ),
  hinweis: (props: { text?: string }) => (
    <div className="callout">{props.text}</div>
  ),
};

export default function RichText({ document }: { document: DocumentRendererProps['document'] }) {
  return <DocumentRenderer document={document} componentBlocks={componentBlocks} />;
}
