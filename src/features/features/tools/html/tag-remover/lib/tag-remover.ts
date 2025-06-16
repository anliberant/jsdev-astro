import type { TagRemoverOptions } from '@/shared/types';

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

    // Remove HTML comments first
    result = result.replace(/<!--[\s\S]*?-->/g, '');

    // Remove script and style tags completely (including content)
    result = result.replace(/<script[\s\S]*?<\/script>/gi, '');
    result = result.replace(/<style[\s\S]*?<\/style>/gi, '');

    if (this.options.removeSpecificTags && this.options.tagList) {
      // Remove only specific tags
      result = this.removeSpecificTags(result, this.options.tagList);
    } else {
      // Remove all HTML tags
      result = this.removeAllTags(result);
    }

    // Convert HTML entities if requested
    if (this.options.convertEntities) {
      result = this.decodeHtmlEntities(result);
    }

    // Handle whitespace preservation
    if (!this.options.preserveWhitespace) {
      // Normalize whitespace
      result = result.replace(/\s+/g, ' ');
      result = result.replace(/\n\s*\n/g, '\n');
    }

    // Preserve text content
    if (this.options.preserveText) {
      result = result.trim();
    }

    return result;
  }

  private removeAllTags(html: string): string {
    // Replace block-level elements with line breaks
    let result = html.replace(/<(?:div|p|h[1-6]|section|article|header|footer|nav|aside|main|ul|ol|li|blockquote|pre|br)\b[^>]*>/gi, '\n');
    result = result.replace(/<\/(?:div|p|h[1-6]|section|article|header|footer|nav|aside|main|ul|ol|li|blockquote|pre)>/gi, '\n');

    // Remove all remaining HTML tags
    result = result.replace(/<[^>]*>/g, '');

    return result;
  }

  private removeSpecificTags(html: string, tagList: string[]): string {
    let result = html;

    for (const tag of tagList) {
      const tagName = tag.toLowerCase().trim();
      
      // Remove opening and closing tags
      const openTagRegex = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
      const closeTagRegex = new RegExp(`</${tagName}>`, 'gi');
      
      result = result.replace(openTagRegex, '');
      result = result.replace(closeTagRegex, '');

      // Handle self-closing tags
      const selfClosingRegex = new RegExp(`<${tagName}\\b[^>]*/>`, 'gi');
      result = result.replace(selfClosingRegex, '');
    }

    return result;
  }

  private decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
      '&ldquo;': '"',
      '&rdquo;': '"',
      '&lsquo;': "'",
      '&rsquo;': "'",
      '&ndash;': '–',
      '&mdash;': '—',
      '&hellip;': '…',
      '&bull;': '•',
      '&laquo;': '«',
      '&raquo;': '»',
      '&sect;': '§',
      '&para;': '¶',
      '&dagger;': '†',
      '&Dagger;': '‡',
      '&permil;': '‰',
      '&lsaquo;': '‹',
      '&rsaquo;': '›',
      '&euro;': '€',
      '&pound;': '£',
      '&yen;': '¥',
      '&cent;': '¢',
      '&curren;': '¤',
    };

    let result = text;

    // Replace named entities
    for (const [entity, char] of Object.entries(entities)) {
      result = result.replace(new RegExp(entity, 'g'), char);
    }

    // Decode numeric entities (decimal)
    result = result.replace(/&#(\d+);/g, (match, code) => {
      const num = parseInt(code, 10);
      if (num >= 32 && num <= 126) { // Printable ASCII range
        return String.fromCharCode(num);
      }
      return match; // Keep invalid entities as-is
    });

    // Decode numeric entities (hexadecimal)
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, code) => {
      const num = parseInt(code, 16);
      if (num >= 32 && num <= 126) { // Printable ASCII range
        return String.fromCharCode(num);
      }
      return match; // Keep invalid entities as-is
    });

    return result;
  }

  updateOptions(newOptions: TagRemoverOptions): void {
    this.options = { ...this.options, ...newOptions };
  }
}