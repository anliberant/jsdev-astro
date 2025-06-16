export class HtmlMarkdownConverter {
  htmlToMarkdown(html: string): string {
    if (!html.trim()) {
      return '';
    }

    let result = html;

    // Remove comments
    result = result.replace(/<!--[\s\S]*?-->/g, '');

    // Convert headings
    result = result.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (match, level, content) => {
      const cleanContent = this.stripHtml(content).trim();
      return '#'.repeat(parseInt(level)) + ' ' + cleanContent + '\n\n';
    });

    // Convert paragraphs
    result = result.replace(/<p[^>]*>(.*?)<\/p>/gi, (match, content) => {
      const cleanContent = this.stripHtml(content).trim();
      return cleanContent + '\n\n';
    });

    // Convert line breaks
    result = result.replace(/<br\s*\/?>/gi, '\n');

    // Convert bold
    result = result.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');

    // Convert italic
    result = result.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');

    // Convert code
    result = result.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Convert pre/code blocks
    result = result.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, (match, content) => {
      const cleanContent = this.decodeHtmlEntities(content).trim();
      return '```\n' + cleanContent + '\n```\n\n';
    });

    result = result.replace(/<pre[^>]*>(.*?)<\/pre>/gis, (match, content) => {
      const cleanContent = this.stripHtml(content).trim();
      return '```\n' + cleanContent + '\n```\n\n';
    });

    // Convert links
    result = result.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Convert images
    result = result.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
    result = result.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

    // Convert unordered lists
    result = result.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      const items = content.match(/<li[^>]*>(.*?)<\/li>/gi);
      if (items) {
        const listItems = items.map(item => {
          const cleanContent = this.stripHtml(item.replace(/<\/?li[^>]*>/gi, '')).trim();
          return '- ' + cleanContent;
        }).join('\n');
        return listItems + '\n\n';
      }
      return match;
    });

    // Convert ordered lists
    result = result.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      const items = content.match(/<li[^>]*>(.*?)<\/li>/gi);
      if (items) {
        const listItems = items.map((item, index) => {
          const cleanContent = this.stripHtml(item.replace(/<\/?li[^>]*>/gi, '')).trim();
          return `${index + 1}. ` + cleanContent;
        }).join('\n');
        return listItems + '\n\n';
      }
      return match;
    });

    // Convert blockquotes
    result = result.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
      const cleanContent = this.stripHtml(content).trim();
      const lines = cleanContent.split('\n');
      const quotedLines = lines.map(line => '> ' + line.trim()).join('\n');
      return quotedLines + '\n\n';
    });

    // Convert tables
    result = result.replace(/<table[^>]*>(.*?)<\/table>/gis, (match, content) => {
      return this.convertTable(content) + '\n\n';
    });

    // Convert horizontal rules
    result = result.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');

    // Strip remaining HTML tags
    result = this.stripHtml(result);

    // Decode HTML entities
    result = this.decodeHtmlEntities(result);

    // Clean up whitespace
    result = result.replace(/\n{3,}/g, '\n\n');
    result = result.trim();

    return result;
  }

  markdownToHtml(markdown: string): string {
    if (!markdown.trim()) {
      return '';
    }

    let result = markdown;

    // Convert headings
    result = result.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, content) => {
      const level = hashes.length;
      return `<h${level}>${content.trim()}</h${level}>`;
    });

    // Convert bold
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert italic
    result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert inline code
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert code blocks
    result = result.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Convert links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Convert images
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Convert unordered lists
    result = result.replace(/^- (.*)$/gm, '<li>$1</li>');
    result = result.replace(/(<li>.*<\/li>)/s, '<ul>\n$1\n</ul>');

    // Convert ordered lists
    result = result.replace(/^\d+\. (.*)$/gm, '<li>$1</li>');

    // Convert blockquotes
    result = result.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');

    // Convert horizontal rules
    result = result.replace(/^---$/gm, '<hr>');

    // Convert paragraphs
    result = result.replace(/^(?!<[^>]+>)(.+)$/gm, '<p>$1</p>');

    // Clean up multiple line breaks
    result = result.replace(/\n\n+/g, '\n');

    return result.trim();
  }

  private convertTable(tableHtml: string): string {
    const rows = tableHtml.match(/<tr[^>]*>(.*?)<\/tr>/gis);
    if (!rows) return '';

    let markdown = '';
    let isFirstRow = true;

    for (const row of rows) {
      const cells = row.match(/<t[hd][^>]*>(.*?)<\/t[hd]>/gis);
      if (cells) {
        const cellContents = cells.map(cell => {
          return this.stripHtml(cell.replace(/<\/?t[hd][^>]*>/gi, '')).trim();
        });

        markdown += '| ' + cellContents.join(' | ') + ' |\n';

        if (isFirstRow) {
          markdown += '|' + cellContents.map(() => ' --- ').join('|') + '|\n';
          isFirstRow = false;
        }
      }
    }

    return markdown;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  private decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
    };

    let result = text;
    for (const [entity, char] of Object.entries(entities)) {
      result = result.replace(new RegExp(entity, 'g'), char);
    }

    // Decode numeric entities
    result = result.replace(/&#(\d+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 10));
    });

    result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });

    return result;
  }
}