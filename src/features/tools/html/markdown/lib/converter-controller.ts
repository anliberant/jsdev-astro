import { JsxConverter } from './jsx-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToJsxElements, JsxConversionOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToJsxConverterController extends BaseConverterController<HtmlToJsxElements> {
  private converter: JsxConverter | null = null;

  constructor() {
    super();
  }

  protected initializeElements(): HtmlToJsxElements {
    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || document.createElement('textarea'),
      jsxOutput: this.safeGetElement<HTMLTextAreaElement>('jsxOutput') || document.createElement('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || document.createElement('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || document.createElement('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats') || document.createElement('div'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats') || document.createElement('div'),
      options: {
        prettify: this.safeGetElement<HTMLInputElement>('prettifyOption') || document.createElement('input'),
        camelCase: this.safeGetElement<HTMLInputElement>('camelCaseOption') || document.createElement('input'),
        fragment: this.safeGetElement<HTMLInputElement>('fragmentOption') || document.createElement('input'),
      },
    };
  }

  protected validateElements(): boolean {
    return !!(this.elements.htmlInput && this.elements.jsxOutput);
  }

  protected bindEvents(): void {
    this.converter = new JsxConverter(this.getOptions());
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

    Object.values(this.elements.options).forEach(option => {
      this.safeAddEventListener(option, 'change', () => {
        if (this.converter) {
          this.converter = new JsxConverter(this.getOptions());
          this.convert();
        }
      });
    });
  }

  private getOptions(): JsxConversionOptions {
    return {
      prettify: this.elements.options.prettify?.checked || false,
      camelCase: this.elements.options.camelCase?.checked || false,
      useFragment: this.elements.options.fragment?.checked || false,
    };
  }

  protected convert(): void {
    if (!this.converter) return;

    const html = this.elements.htmlInput?.value?.trim() || '';

    if (!html) {
      if (this.elements.jsxOutput) {
        this.elements.jsxOutput.value = '';
      }
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const jsxCode = this.converter.convertToJsx(html);
      if (this.elements.jsxOutput) {
        this.elements.jsxOutput.value = jsxCode;
      }
      this.showSuccess('HTML successfully converted to JSX!');
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      if (this.elements.jsxOutput) {
        this.elements.jsxOutput.value = '';
      }
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (this.elements.htmlInput) {
      this.elements.htmlInput.value = SAMPLE_HTML.jsx || '<div>Sample HTML</div>';
      this.convert();
      this.updateStats();
    }
  }

  private clear(): void {
    this.clearAll('htmlInput', 'jsxOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('jsxOutput', 'copyBtn');
  }

  private updateStats(): void {
    if (!this.elements.inputStats || !this.elements.outputStats) {
      return;
    }

    const inputValue = this.elements.htmlInput?.value || '';
    const outputValue = this.elements.jsxOutput?.value || '';

    const inputStats = this.calculateStats(inputValue);
    const outputStats = this.calculateStats(outputValue);

    this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
  }
}