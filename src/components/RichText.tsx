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

const DocumentLink = ({ file, label }: { file?: string; label?: string }) =>
  file ? (
    <a className="doc-link" href={file} download>
      {label || filename(file)}
    </a>
  ) : null;

/** "/downloads/anmeldeformular.pdf" → "anmeldeformular.pdf" */
function filename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

const components = { Doc, Table, DocumentLink };

export default function RichText({ content }: { content: RenderableTreeNode }) {
  return <>{Markdoc.renderers.react(content, React, { components })}</>;
}
