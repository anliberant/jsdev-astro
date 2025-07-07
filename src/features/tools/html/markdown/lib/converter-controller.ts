import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlMarkdownElements } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlMarkdownController extends BaseConverterController<HtmlMarkdownElements> {
  private currentMode: 'html-to-markdown' | 'markdown-to-html' = 'html-to-markdown';
  
  protected initializeElements(): HtmlMarkdownElements {
    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput'),
      markdownOutput: this.safeGetElement<HTMLTextAreaElement>('markdownOutput'),
      convertBtn: this.safeGetElement<HTMLButtonElement>('convertBtn'),
      clearBtn: this.safeGetElement<HTMLButtonElement>('clearBtn'),
      copyBtn: this.safeGetElement<HTMLButtonElement>('copyBtn'),
      sampleBtn: this.safeGetElement<HTMLButtonElement>('sampleBtn'),
      modeToggle: this.safeGetElement<HTMLInputElement>('modeToggle'),
      inputCount: this.safeGetElement<HTMLSpanElement>('inputCount'),
      outputCount: this.safeGetElement<HTMLSpanElement>('outputCount'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats'),
      inputLabel: this.safeGetElement<HTMLElement>('inputLabel'),
      outputLabel: this.safeGetElement<HTMLElement>('outputLabel')
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

    this.safeAddEventListener(this.elements.modeToggle, 'change', () => {
      this.toggleMode();
    });

    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.convert();
    });
  }

  protected updateStats(): void {
    if (!this.elements) return;

    const inputLength = this.elements.htmlInput?.value?.length || 0;
    const outputLength = this.elements.htmlOutput?.value?.length || 0;

    if (this.elements.inputCount) {
      this.elements.inputCount.textContent = inputLength.toString();
    }
    if (this.elements.outputCount) {
      this.elements.outputCount.textContent = outputLength.toString();
    }
  }

  protected getSampleInput(): string {
    return '<p>Hello &amp; welcome to our <strong>website</strong>!</p>';
  }

  private encode(): void {
    if (!this.elements?.htmlInput || !this.elements?.htmlOutput) return;

    const input = this.elements.htmlInput.value;
    
    try {
      const encoded = this.htmlEncode(input);
      this.elements.htmlOutput.value = encoded;
      this.updateStats();
    } catch (error) {
      console.error('Encoding error:', error);
      this.elements.htmlOutput.value = 'Error: Could not encode HTML';
    }
  }

  private decode(): void {
    if (!this.elements?.htmlInput || !this.elements?.htmlOutput) return;

    const input = this.elements.htmlInput.value;
    
    try {
      const decoded = this.htmlDecode(input);
      this.elements.htmlOutput.value = decoded;
      this.updateStats();
    } catch (error) {
      console.error('Decoding error:', error);
      this.elements.htmlOutput.value = 'Error: Could not decode HTML';
    }
  }

  private htmlEncode(str: string): string {
    const entityMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    return str.replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
  }

  private htmlDecode(str: string): string {
    const entityMap: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '='
    };

    return str.replace(/&[#\w]+;/g, (entity) => entityMap[entity] || entity);
  }

  private clear(): void {
    if (!this.elements) return;
    
    if (this.elements.htmlInput) this.elements.htmlInput.value = '';
    if (this.elements.htmlOutput) this.elements.htmlOutput.value = '';
    this.updateStats();
  }

  private async copy(): void {
    if (!this.elements?.htmlOutput) return;

    try {
      await navigator.clipboard.writeText(this.elements.htmlOutput.value);
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
    this.updateStats();
  }
}