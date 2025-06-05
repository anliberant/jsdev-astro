import { JsxConverter } from './jsx-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToJsxElements, JsxConversionOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToJsxConverterController extends BaseConverterController<HtmlToJsxElements> {
  private converter: JsxConverter;

  constructor() {
    super();
    this.converter = new JsxConverter(this.getOptions());
    this.updateStats();
  }

  protected initializeElements(): HtmlToJsxElements {
    return {
      htmlInput: document.getElementById('htmlInput') as HTMLTextAreaElement,
      jsxOutput: document.getElementById('jsxOutput') as HTMLTextAreaElement,
      errorMessage: document.getElementById('errorMessage') as HTMLElement,
      successMessage: document.getElementById('successMessage') as HTMLElement,
      inputStats: document.getElementById('inputStats') as HTMLElement,
      outputStats: document.getElementById('outputStats') as HTMLElement,
      options: {
        prettify: document.getElementById('prettifyOption') as HTMLInputElement,
        camelCase: document.getElementById(
          'camelCaseOption'
        ) as HTMLInputElement,
        fragment: document.getElementById('fragmentOption') as HTMLInputElement,
      },
    };
  }

  protected bindEvents(): void {
    this.elements.htmlInput.addEventListener('input', () => {
      this.convert();
      this.updateStats();
    });

    document
      .getElementById('convertBtn')
      ?.addEventListener('click', () => this.convert());
    document
      .getElementById('clearBtn')
      ?.addEventListener('click', () => this.clear());
    document
      .getElementById('copyBtn')
      ?.addEventListener('click', () => this.copy());
    document
      .getElementById('sampleBtn')
      ?.addEventListener('click', () => this.loadSample());

    Object.values(this.elements.options).forEach(option => {
      option.addEventListener('change', () => {
        this.converter = new JsxConverter(this.getOptions());
        this.convert();
      });
    });
  }

  private getOptions(): JsxConversionOptions {
    return {
      prettify: this.elements.options.prettify.checked,
      camelCase: this.elements.options.camelCase.checked,
      useFragment: this.elements.options.fragment.checked,
    };
  }

  protected convert(): void {
    const html = this.elements.htmlInput.value.trim();

    if (!html) {
      this.elements.jsxOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const jsxCode = this.converter.convertToJsx(html);
      this.elements.jsxOutput.value = jsxCode;
      this.showSuccess('HTML successfully converted to JSX!');
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.jsxOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    this.elements.htmlInput.value = SAMPLE_HTML.jsx;
    this.convert();
    this.updateStats();
  }

  private clear(): void {
    this.clearAll('htmlInput', 'jsxOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('jsxOutput', 'copyBtn');
  }

  private updateStats(): void {
    const inputStats = this.calculateStats(this.elements.htmlInput.value);
    const outputStats = this.calculateStats(this.elements.jsxOutput.value);

    this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
  }
}
