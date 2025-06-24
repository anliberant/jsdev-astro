import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToAstroElements } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToAstroController extends BaseConverterController<HtmlToAstroElements> {
  
  protected initializeElements(): HtmlToAstroElements {
    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput'),
      astroOutput: this.safeGetElement<HTMLTextAreaElement>('astroOutput'),
      convertBtn: this.safeGetElement<HTMLButtonElement>('convertBtn'),
      clearBtn: this.safeGetElement<HTMLButtonElement>('clearBtn'),
      copyBtn: this.safeGetElement<HTMLButtonElement>('copyBtn'),
      sampleBtn: this.safeGetElement<HTMLButtonElement>('sampleBtn'),
      inputCount: this.safeGetElement<HTMLSpanElement>('inputCount'),
      outputCount: this.safeGetElement<HTMLSpanElement>('outputCount'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats')
    };
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    this.safeAddEventListener(this.elements.convertBtn, 'click', (e) => {
      e.preventDefault();
      this.convert();
    });

    this.safeAddEventListener(this.elements.clearBtn, 'click', (e) => {
      e.preventDefault();
      this.clear();
    });

    this.safeAddEventListener(this.elements.copyBtn, 'click', (e) => {
      e.preventDefault();
      this.copy();
    });

    this.safeAddEventListener(this.elements.sampleBtn, 'click', (e) => {
      e.preventDefault();
      this.loadSample();
    });

    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.convert();
    });
  }

  protected updateStats(): void {
    if (!this.elements) return;

    const inputLength = this.elements.htmlInput?.value?.length || 0;
    const outputLength = this.elements.astroOutput?.value?.length || 0;

    if (this.elements.inputCount) {
      this.elements.inputCount.textContent = inputLength.toString();
    }
    if (this.elements.outputCount) {
      this.elements.outputCount.textContent = outputLength.toString();
    }
  }

  protected getSampleInput(): string {
    return SAMPLE_HTML;
  }

  private convert(): void {
    if (!this.elements?.htmlInput || !this.elements?.astroOutput) return;

    const htmlContent = this.elements.htmlInput.value;
    
    try {
      const astroContent = this.convertHtmlToAstro(htmlContent);
      this.elements.astroOutput.value = astroContent;
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.elements.astroOutput.value = 'Error: Could not convert HTML to Astro';
    }
  }

  private convertHtmlToAstro(html: string): string {
    if (!html.trim()) {
      return '';
    }

    let result = '---\n// Component props and imports can be added here\n---\n\n';
    let cleaned = html;

    // Remove DOCTYPE
    cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');

    // Handle HTML tag
    cleaned = cleaned.replace(/<html[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/html>/gi, '');

    // Extract and handle head content
    const headMatch = cleaned.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      const headContent = headMatch[1].trim();
      if (headContent) {
        // Extract title for frontmatter
        const titleMatch = headContent.match(/<title[^>]*>(.*?)<\/title>/i);
        if (titleMatch) {
          const title = titleMatch[1].trim();
          result = result.replace('---\n', `---\ntitle: "${title}"\n`);
        }
      }
      cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    }

    // Remove body tags
    cleaned = cleaned.replace(/<body[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/body>/gi, '');

    // Handle self-closing tags
    cleaned = cleaned.replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*?)>/g, '<$1$2 />');

    // Add the body content
    result += cleaned.trim();

    return result;
  }

  private clear(): void {
    if (!this.elements) return;
    
    if (this.elements.htmlInput) this.elements.htmlInput.value = '';
    if (this.elements.astroOutput) this.elements.astroOutput.value = '';
    this.updateStats();
  }

  private async copy(): void {
    if (!this.elements?.astroOutput) return;

    try {
      await navigator.clipboard.writeText(this.elements.astroOutput.value);
      this.showCopySuccess();
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  private showCopySuccess(): void {
    if (!this.elements?.copyBtn) return;
    
    const originalText = this.elements.copyBtn.textContent;
    this.elements.copyBtn.textContent = 'Copied!';
    
    setTimeout(() => {
      if (this.elements?.copyBtn && originalText) {
        this.elements.copyBtn.textContent = originalText;
      }
    }, 2000);
  }

  private loadSample(): void {
    if (!this.elements?.htmlInput) return;
    
    this.elements.htmlInput.value = this.getSampleInput();
    this.convert();
  }
}