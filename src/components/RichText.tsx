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

/**
 * Tabellen bekommen einen scrollbaren Wrapper, damit breite Tabellen auf dem
 * Handy nicht die Seite aufziehen.
 */
const renderers: DocumentRendererProps['renderers'] = {
  block: {
    table: ({ head, body }) => (
      <div className="rich-table-wrap">
        <table>
          {head && (
            <thead>
              <tr>
                {head.map((cell, i) => (
                  <th key={i} colSpan={cell.colSpan} rowSpan={cell.rowSpan}>
                    {cell.children}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, i) => (
                  <td key={i} colSpan={cell.colSpan} rowSpan={cell.rowSpan}>
                    {cell.children}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
};

export default function RichText({ document }: { document: DocumentRendererProps['document'] }) {
  return (
    <DocumentRenderer document={document} componentBlocks={componentBlocks} renderers={renderers} />
  );
}
