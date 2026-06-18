type DocumentNode = DocumentElement | DocumentText;
type DocumentElement = { children: DocumentNode[]; [key: string]: unknown };
type DocumentText = { text: string; [key: string]: unknown };

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderNodes(nodes: DocumentNode[]): string {
  return nodes.map(renderNode).join('');
}

function renderNode(node: DocumentNode): string {
  if ('text' in node) {
    let text = escapeHtml(node.text as string);
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    return text;
  }
  const el = node as DocumentElement;
  const inner = renderNodes(el.children ?? []);
  switch (el.type) {
    case 'paragraph': return `<p>${inner}</p>`;
    case 'heading': return `<h${el.level}>${inner}</h${el.level}>`;
    case 'unordered-list': return `<ul>${inner}</ul>`;
    case 'ordered-list': return `<ol>${inner}</ol>`;
    case 'list-item': return `<li>${inner}</li>`;
    case 'list-item-content': return inner;
    case 'link': return `<a href="${escapeHtml(el.href as string)}">${inner}</a>`;
    case 'divider': return '<hr>';
    case 'table': return `<table>${inner}</table>`;
    case 'table-head': return `<thead>${inner}</thead>`;
    case 'table-body': return `<tbody>${inner}</tbody>`;
    case 'table-row': return `<tr>${inner}</tr>`;
    case 'table-header-cell': return `<th>${inner}</th>`;
    case 'table-cell': return `<td>${inner}</td>`;
    default: return inner;
  }
}

export function docToHtml(nodes: DocumentNode[]): string {
  return renderNodes(nodes);
}
