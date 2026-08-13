import { fields } from '@keystatic/core';
import Markdoc, { type Node, type RenderableTreeNode } from '@markdoc/markdoc';
import { components, markdocOptions } from '../keystatic/contentComponents';

/**
 * Markdoc config shared by every page. The `render` names below are resolved to
 * the React components in RichText.tsx.
 */
const baseConfig = fields.markdoc.createMarkdocConfig({
  options: markdocOptions,
  components,
  render: {
    tags: { documentLink: 'DocumentLink' },
  },
});

// Node overrides as copies rather than via `render: { nodes }`, because
// createMarkdocConfig would mutate the node schemas it shares with Keystatic's
// module-level defaults. The document root renders without a wrapper element so
// the existing .prose and .article--detail rules keep matching; tables get the
// scrollable wrapper.
export const markdocConfig = {
  ...baseConfig,
  nodes: {
    ...baseConfig.nodes,
    document: { ...baseConfig.nodes?.document, render: 'Doc' },
    table: { ...baseConfig.nodes?.table, render: 'Table' },
  },
};

/** Turns a body field's Markdoc AST into the plain JSON tree RichText renders. */
export function renderBody(node: Node): RenderableTreeNode {
  return Markdoc.transform(node, markdocConfig);
}
