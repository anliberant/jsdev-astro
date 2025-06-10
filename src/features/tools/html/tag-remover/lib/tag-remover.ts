import type { TagRemoverOptions } from '../types/remover';

export class HtmlTagRemover {
  private options: TagRemoverOptions;

  constructor(options: TagRemoverOptions) {
    this.options = options;
  }

  removeTags(html: string): string {
    if (!html.trim()) {
      return '';
    }

    let result = html;

    try {
      if (this.options.removeSpecificTags && this.options.tagList?.length) {
        // Remove only specific tags
        result = this.removeSpecificTags(result, this.options.tagList);
      } else {
        // Remove all HTML tags
        result = this.removeAllTags(result);
      }

      // Convert HTML entities if requested
      if (this.options.convertEntities) {
        result = this.convertHtmlEntities(result);
      }

      // Handle whitespace preservation
      if (!this.options.preserveWhitespace) {
        result = this.normalizeWhitespace(result);
      }

      return result.trim();
    } catch (error) {
      throw new Error(`Failed to remove tags: ${error.message}`);
    }
  }

  private removeAllTags(html: string): string {
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    if (this.options.preserveText) {
      return this.extractTextContent(tempDiv);
    } else {
      // Simple regex-based removal for non-preserved text
      return html.replace(/<[^>]*>/g, '');
    }
  }

  private removeSpecificTags(html: string, tags: string[]): string {
    let result = html;

    tags.forEach(tag => {
      const tagName = tag.trim().toLowerCase();
      if (tagName) {
        // Remove opening and closing tags
        const openingTagRegex = new RegExp(`<${tagName}[^>]*>`, 'gi');
        const closingTagRegex = new RegExp(`<\/${tagName}>`, 'gi');
        
        result = result.replace(openingTagRegex, '');
        result = result.replace(closingTagRegex, '');
      }
    });

    return result;
  }

  private extractTextContent(element: HTMLElement): string {
    let text = '';
    
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      text += node.textContent || '';
    }

    return text;
  }

  private convertHtmlEntities(text: string): string {
    const entityMap: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™'
    };

    let result = text;
    Object.entries(entityMap).forEach(([entity, char]) => {
      result = result.replace(new RegExp(entity, 'g'), char);
    });

    // Handle numeric entities
    result = result.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });

    result = result.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    return result;
  }

  private normalizeWhitespace(text: string): string {
    return text
      .replace(/\s+/g, ' ')         // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n')  // Replace multiple newlines with double newline
      .replace(/^\s+|\s+$/gm, '');   // Trim leading/trailing spaces from each line
  }

  updateOptions(newOptions: Partial<TagRemoverOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }
}