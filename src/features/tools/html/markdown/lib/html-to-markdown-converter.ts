export class HtmlToMarkdownConverter {
  convertHtmlToMarkdown(html: string): string {
    if (!html.trim()) {
      return '';
    }

    let markdown = html;

    // Remove DOCTYPE and html/body tags
    markdown = markdown.replace(/<!DOCTYPE[^>]*>/gi, '');
    markdown = markdown.replace(/<html[^>]*>/gi, '');
    markdown = markdown.replace(/<\/html>/gi, '');
    markdown = markdown.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    markdown = markdown.replace(/<body[^>]*>/gi, '');
    markdown = markdown.replace(/<\/body>/gi, '');

    // Convert headings
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

    // Convert paragraphs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

    // Convert line breaks
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Convert bold and italic
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Convert strikethrough
    markdown = markdown.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
    markdown = markdown.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');

    // Convert links
    markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Convert images
    markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
    markdown = markdown.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![$1]($2)');
    markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![]($1)');

    // Convert code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Convert pre/code blocks
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
    markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n\n');

    // Convert blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
      const lines = content.trim().split('\n');
      return lines.map(line => `> ${line.trim()}`).join('\n') + '\n\n';
    });

    // Convert unordered lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      let listContent = content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
      return listContent + '\n';
    });

    // Convert ordered lists
    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      let counter = 1;
      let listContent = content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        return `${counter++}. $1\n`;
      });
      return listContent + '\n';
    });

    // Convert horizontal rules
    markdown = markdown.replace(/<hr\s*\/?>/gi, '\n---\n\n');

    // Convert tables (basic)
    markdown = markdown.replace(/<table[^>]*>(.*?)<\/table>/gis, (match, content) => {
      const rows = content.match(/<tr[^>]*>(.*?)<\/tr>/gi);
      if (!rows) return match;

      let tableMarkdown = '';
      let isFirstRow = true;

      rows.forEach(row => {
        const cells = row.match(/<t[hd][^>]*>(.*?)<\/t[hd]>/gi);
        if (!cells) return;

        const cellContents = cells.map(cell => {
          return cell.replace(/<t[hd][^>]*>(.*?)<\/t[hd]>/gi, '$1').trim();
        });

        tableMarkdown += '| ' + cellContents.join(' | ') + ' |\n';

        if (isFirstRow) {
          tableMarkdown += '| ' + cellContents.map(() => '---').join(' | ') + ' |\n';
          isFirstRow = false;
        }
      });

      return tableMarkdown + '\n';
    });

    // Clean up multiple newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");
    markdown = markdown.replace(/&nbsp;/g, ' ');

    return markdown.trim();
  }

  convertMarkdownToHtml(markdown: string): string {
    if (!markdown.trim()) {
      return '';
    }

    let html = markdown;

    // Convert headings
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');

    // Convert horizontal rules
    html = html.replace(/^---$/gim, '<hr>');

    // Convert code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Convert bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Convert images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Convert blockquotes
    html = html.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');

    // Convert unordered lists
    html = html.replace(/^[\-\*\+] (.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Convert ordered lists
    html = html.replace(/^\d+\. (.*)$/gim, '<li>$1</li>');

    // Convert line breaks to paragraphs
    const paragraphs = html.split('\n\n');
    html = paragraphs
      .map(paragraph => {
        paragraph = paragraph.trim();
        if (paragraph && !paragraph.match(/^<(h[1-6]|hr|pre|ul|ol|blockquote)/)) {
          return `<p>${paragraph}</p>`;
        }
        return paragraph;
      })
      .join('\n\n');

    return html.trim();
  }
}