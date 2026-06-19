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
  hinweis: (props: { text?: string }) => (
    <div className="callout">{props.text}</div>
  ),
};

export default function RichText({ document }: { document: DocumentRendererProps['document'] }) {
  return <DocumentRenderer document={document} componentBlocks={componentBlocks} />;
}
