export class HtmlToAstroController {
  convert(html: string): string {
    if (!html.trim()) {
      return '';
    }

    let result = html;

    // Check if it's a complete HTML document
    const isFullDocument = result.includes('<!DOCTYPE') || 
                          (result.includes('<html') && result.includes('<head'));

    if (isFullDocument) {
      // For full HTML documents, create a complete Astro component
      result = this.convertFullDocument(result);
    } else {
      // For HTML fragments, create a simple component
      result = this.convertFragment(result);
    }

    return result;
  }

  private convertFullDocument(html: string): string {
    // Extract head content
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const headContent = headMatch ? headMatch[1].trim() : '';

    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1].trim() : html;

    // Extract title
    const titleMatch = headContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Astro Component';

    // Extract meta tags
    const metaTags = this.extractMetaTags(headContent);

    // Create frontmatter
    const frontmatter = this.createFrontmatter(title, metaTags);

    // Process body content
    const processedBody = this.processHtmlContent(bodyContent);

    return `---
${frontmatter}---

${processedBody}`;
  }

  private convertFragment(html: string): string {
    const processedContent = this.processHtmlContent(html);
    
    return `---
// Astro component
---

${processedContent}`;
  }

  private extractMetaTags(headContent: string): string[] {
    const metaTags: string[] = [];
    const metaRegex = /<meta[^>]*>/gi;
    let match;

    while ((match = metaRegex.exec(headContent)) !== null) {
      metaTags.push(match[0]);
    }

    return metaTags;
  }

  private createFrontmatter(title: string, metaTags: string[]): string {
    let frontmatter = `export interface Props {
  title?: string;
}

const { title = "${title}" } = Astro.props;`;

    if (metaTags.length > 0) {
      frontmatter += '\n\n// Meta tags from original HTML';
      metaTags.forEach(tag => {
        frontmatter += `\n// ${tag}`;
      });
    }

    return frontmatter;
  }

  private processHtmlContent(content: string): string {
    let result = content;

    // Convert class to class:list for dynamic classes
    result = result.replace(/class="([^"]+)"/g, (match, className) => {
      if (className.includes(' ')) {
        const classes = className.split(' ').map(c => `'${c.trim()}'`).join(', ');
        return `class:list={[${classes}]}`;
      }
      return `class="${className}"`;
    });

    // Convert style attributes to Astro format if they contain dynamic content
    result = result.replace(/style="([^"]+)"/g, 'style="$1"');

    // Add Astro-specific attributes for forms and inputs
    result = result.replace(/<form([^>]*)>/g, '<form$1>');
    
    // Convert certain HTML attributes to Astro equivalents
    result = result.replace(/onclick="([^"]+)"/g, 'onclick={$1}');
    result = result.replace(/onchange="([^"]+)"/g, 'onchange={$1}');

    // Add proper indentation
    result = this.addIndentation(result);

    return result;
  }

  private addIndentation(html: string): string {
    const lines = html.split('\n');
    let indentLevel = 0;
    const indentedLines: string[] = [];

    for (let line of lines) {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        indentedLines.push('');
        continue;
      }

      // Decrease indent for closing tags
      if (trimmedLine.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add indentation
      indentedLines.push('  '.repeat(indentLevel) + trimmedLine);

      // Increase indent for opening tags (but not self-closing or void elements)
      if (trimmedLine.startsWith('<') && 
          !trimmedLine.startsWith('</') && 
          !trimmedLine.endsWith('/>') &&
          !this.isVoidElement(trimmedLine)) {
        indentLevel++;
      }
    }

    return indentedLines.join('\n');
  }

  private isVoidElement(line: string): boolean {
    const voidElements = [
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ];

    for (const element of voidElements) {
      if (line.includes(`<${element}`)) {
        return true;
      }
    }

    return false;
  }
}