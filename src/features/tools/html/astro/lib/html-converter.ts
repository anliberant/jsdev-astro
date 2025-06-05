export function convertHtmlToAstro(html: string): string {
  if (!html.trim()) {
    return '';
  }

  let result = '---\n';
  result += '// Component props and imports can be added here\n';
  result += '---\n\n';

  let cleaned = html;

  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');

  cleaned = cleaned.replace(/<html[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/html>/gi, '');

  const headMatch = cleaned.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    const headContent = headMatch[1].trim();
    if (headContent) {
      const titleMatch = headContent.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        result = result.replace('---\n', `---\ntitle: "${title}"\n`);
      }

      result += '<head>\n' + headContent + '\n</head>\n\n';
    }

    cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
  }

  cleaned = cleaned.replace(/<body[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/body>/gi, '');

  result += cleaned.trim();

  return result;
}
