import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToJsxElements } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToJsxConverterController extends BaseConverterController<HtmlToJsxElements> {
  
  protected initializeElements(): HtmlToJsxElements {
    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput'),
      jsxOutput: this.safeGetElement<HTMLTextAreaElement>('jsxOutput'),
      convertBtn: this.safeGetElement<HTMLButtonElement>('convertBtn'),
      clearBtn: this.safeGetElement<HTMLButtonElement>('clearBtn'),
      copyBtn: this.safeGetElement<HTMLButtonElement>('copyBtn'),
      sampleBtn: this.safeGetElement<HTMLButtonElement>('sampleBtn'),
      inputCount: this.safeGetElement<HTMLSpanElement>('inputCount'),
      outputCount: this.safeGetElement<HTMLSpanElement>('outputCount')
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
    const outputLength = this.elements.pugOutput?.value?.length || 0;

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
    if (!this.elements?.htmlInput || !this.elements?.pugOutput) return;

    const htmlContent = this.elements.htmlInput.value;
    
    try {
      // Simple HTML to Pug conversion (basic implementation)
      let pugContent = htmlContent;
      
      // Remove closing tags and convert to Pug syntax
      pugContent = pugContent.replace(/<(\w+)([^>]*)>(.*?)<\/\1>/g, '$1$2 $3');
      pugContent = pugContent.replace(/class="([^"]*)"/g, '.$1');
      pugContent = pugContent.replace(/id="([^"]*)"/g, '#$1');
      
      this.elements.pugOutput.value = pugContent;
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.elements.pugOutput.value = 'Error: Could not convert HTML to Pug';
    }
  }

  private clear(): void {
    if (!this.elements) return;
    
    if (this.elements.htmlInput) this.elements.htmlInput.value = '';
    if (this.elements.pugOutput) this.elements.pugOutput.value = '';
    this.updateStats();
  }

  private async copy(): void {
    if (!this.elements?.pugOutput) return;

    try {
      await navigator.clipboard.writeText(this.elements.pugOutput.value);
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