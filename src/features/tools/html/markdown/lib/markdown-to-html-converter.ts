export class MarkdownToHtmlConverter {
  private options: {
    sanitize: boolean;
    allowHtml: boolean;
  };

  constructor(options = {}) {
    this.options = {
      sanitize: true,
      allowHtml: false,
      ...options
    };
  }

  convert(markdown: string): string {
    if (!markdown.trim()) return '';

    let html = markdown;

    // Code blocks (must be processed before inline code)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || '';
      return `<pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^#{6}\s+(.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^#{5}\s+(.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#{4}\s+(.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^#{3}\s+(.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#{2}\s+(.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^#{1}\s+(.*$)/gim, '<h1>$1</h1>');

    // Bold and italic (strikethrough)
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Blockquotes
    html = html.replace(/^>\s+(.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');

    // Lists
    html = this.convertLists(html);

    // Tables
    html = this.convertTables(html);

    // Paragraphs
    html = this.convertParagraphs(html);

    return html.trim();
  }

  private convertLists(html: string): string {
    const lines = html.split('\n');
    const result: string[] = [];
    let inList = false;
    let listType = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const bulletMatch = line.match(/^-\s+(.*)$/);
      const numberedMatch = line.match(/^\d+\.\s+(.*)$/);

      if (bulletMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) result.push(`</${listType}>`);
          result.push('<ul>');
          inList = true;
          listType = 'ul';
        }
        result.push(`<li>${bulletMatch[1]}</li>`);
      } else if (numberedMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) result.push(`</${listType}>`);
          result.push('<ol>');
          inList = true;
          listType = 'ol';
        }
        result.push(`<li>${numberedMatch[1]}</li>`);
      } else {
        if (inList) {
          result.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        result.push(line);
      }
    }

    if (inList) {
      result.push(`</${listType}>`);
    }

    return result.join('\n');
  }

  private convertTables(html: string): string {
    const lines = html.split('\n');
    const result: string[] = [];
    let inTable = false;
    let isHeader = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          result.push('<table>');
          inTable = true;
          isHeader = true;
        }

        const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
        
        // Skip separator line
        if (cells.every(cell => cell.match(/^-+$/))) {
          if (isHeader) {
            result.push('</thead><tbody>');
            isHeader = false;
          }
          continue;
        }

        const tag = isHeader ? 'th' : 'td';
        const rowStart = isHeader ? '<thead><tr>' : '<tr>';
        const rowEnd = isHeader ? '</tr>' : '</tr>';
        
        if (isHeader && result[result.length - 1] === '<table>') {
          // Don't add extra thead tag
        }

        const cellsHtml = cells.map(cell => `<${tag}>${cell}</${tag}>`).join('');
        result.push(`${rowStart}${cellsHtml}${rowEnd}`);
        
      } else {
        if (inTable) {
          if (!isHeader) result.push('</tbody>');
          else result.push('</thead>');
          result.push('</table>');
          inTable = false;
        }
        result.push(line);
      }
    }

    if (inTable) {
      if (!isHeader) result.push('</tbody>');
      else result.push('</thead>');
      result.push('</table>');
    }

    return result.join('\n');
  }

  private convertParagraphs(html: string): string {
    return html
      .split('\n\n')
      .map(paragraph => {
        paragraph = paragraph.trim();
        if (paragraph && !this.isHtmlBlock(paragraph)) {
          return `<p>${paragraph}</p>`;
        }
        return paragraph;
      })
      .join('\n\n');
  }

  private isHtmlBlock(text: string): boolean {
    return /^<(h[1-6]|p|div|table|ul|ol|blockquote|pre|hr|thead|tbody|tr)/.test(text.trim());
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}