import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToAstroElements } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToAstroController extends BaseConverterController<HtmlToAstroElements> {
  private initAttempts: number = 0;
  private maxAttempts: number = 50;

  constructor() {
    super();
  }

  protected initializeElements(): HtmlToAstroElements {
    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || document.createElement('textarea'),
      astroOutput: this.safeGetElement<HTMLTextAreaElement>('astroOutput') || document.createElement('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || document.createElement('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || document.createElement('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats'),
    };
  }

  protected validateElements(): boolean {
    return !!(this.elements.htmlInput && this.elements.astroOutput);
  }

  protected bindEvents(): void {
    this.updateStats();

    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.convert();
      this.updateStats();
    });

    const convertBtn = this.safeGetElement('convertBtn');
    this.safeAddEventListener(convertBtn, 'click', () => this.convert());

    const clearBtn = this.safeGetElement('clearBtn');
    this.safeAddEventListener(clearBtn, 'click', () => this.clear());

    const copyBtn = this.safeGetElement('copyBtn');
    this.safeAddEventListener(copyBtn, 'click', () => this.copy());

    const sampleBtn = this.safeGetElement('sampleBtn');
    this.safeAddEventListener(sampleBtn, 'click', () => this.loadSample());
  }

  protected convert(): void {
    const html = this.elements.htmlInput?.value?.trim() || '';

    if (!html) {
      if (this.elements.astroOutput) {
        this.elements.astroOutput.value = '';
      }
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const astroCode = this.convertHtmlToAstro(html);
      if (this.elements.astroOutput) {
        this.elements.astroOutput.value = astroCode;
      }
      this.showSuccess('HTML successfully converted to Astro!');
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      if (this.elements.astroOutput) {
        this.elements.astroOutput.value = '';
      }
      this.updateStats();
    }
  }

  private convertHtmlToAstro(html: string): string {
    if (!html.trim()) {
      return '';
    }

    let result = html;

    // Check if it's a complete HTML document
    const isFullDocument = result.includes('<!DOCTYPE') || 
                          (result.includes('<html') && result.includes('<head'));

    if (isFullDocument) {
      result = this.convertFullDocument(result);
    } else {
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

  private loadSample(): void {
    if (this.elements.htmlInput) {
      this.elements.htmlInput.value = SAMPLE_HTML.astro || `<div class="container">
  <header class="header">
    <h1>Welcome to Astro</h1>
    <nav>
      <ul class="nav-list">
        <li><a href="#home" class="nav-link">Home</a></li>
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#contact" class="nav-link">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main class="main-content">
    <section class="hero">
      <h2>Hero Section</h2>
      <p>This is a sample paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
      <button type="submit" class="btn btn-primary">Click Me</button>
    </section>
  </main>
</div>`;
      this.convert();
      this.updateStats();
    }
  }

  private clear(): void {
    this.clearAll('htmlInput', 'astroOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('astroOutput', 'copyBtn');
  }

  private updateStats(): void {
    if (this.elements.inputStats && this.elements.outputStats) {
      const inputValue = this.elements.htmlInput?.value || '';
      const outputValue = this.elements.astroOutput?.value || '';

      const inputStats = this.calculateStats(inputValue);
      const outputStats = this.calculateStats(outputValue);

      this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
      this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
  }
}