import React from 'react';
import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc';

/**
 * Frontend renderer for Keystatic's Markdoc body fields. The component names
 * below match the `render` mapping in src/utils/markdoc.ts.
 *
 * Used in Astro without a client: directive, so it renders to static HTML on
 * the server.
 */
type Children = { children?: React.ReactNode };

/** Renders the document root without a wrapper element. */
const Doc = ({ children }: Children) => <>{children}</>;

/** Wide tables scroll inside their own container instead of stretching the page. */
const Table = ({ children }: Children) => (
  <div className="rich-table-wrap">
    <table>{children}</table>
  </div>
);

const Dokument = ({ datei, titel }: { datei?: string; titel?: string }) =>
  datei ? (
    <a className="doc-link" href={datei} download>
      {titel || dateiname(datei)}
    </a>
  ) : null;

/** "/downloads/anmeldeformular.pdf" → "anmeldeformular.pdf" */
function dateiname(pfad: string): string {
  return pfad.slice(pfad.lastIndexOf('/') + 1);
}

const components = { Doc, Table, Dokument };

export default function RichText({ content }: { content: RenderableTreeNode }) {
  return <>{Markdoc.renderers.react(content, React, { components })}</>;
}
