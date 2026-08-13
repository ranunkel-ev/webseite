type MarkdocNodeLike = {
  type?: string;
  attributes?: { content?: unknown };
  children?: MarkdocNodeLike[];
};

/** Block-level nodes get a trailing space so words don't run into each other. */
const BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'blockquote',
  'item',
  'td',
  'th',
  'hr',
]);

/**
 * Collects the plain text of a Markdoc AST (for meta descriptions and the
 * "does this post have a detail page?" check). Walks `children` manually instead
 * of using Node#walk, so it also works on plain JSON nodes.
 */
export function markdocToPlainText(node: MarkdocNodeLike | null | undefined): string {
  return collect(node).replace(/\s+/g, ' ').trim();
}

function collect(node: MarkdocNodeLike | null | undefined): string {
  if (!node) return '';
  if (node.type === 'text' && typeof node.attributes?.content === 'string') {
    return node.attributes.content;
  }
  const text = (node.children ?? []).map(collect).join('');
  return node.type && BLOCK_TYPES.has(node.type) ? `${text} ` : text;
}
