type Node = { text?: string; children?: Node[] };

/** Sammelt rekursiv den reinen Text aus Keystatic-Dokument-Nodes (für Teaser o. Ä.). */
export function nodesToPlainText(nodes: Node[]): string {
  return nodes
    .map((node) => {
      if (typeof node.text === 'string') return node.text;
      if (node.children) return nodesToPlainText(node.children);
      return '';
    })
    .join('')
    .trim();
}
