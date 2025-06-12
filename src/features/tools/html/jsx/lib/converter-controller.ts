import { JsxConverter } from './jsx-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToJsxElements, JsxConversionOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToJsxConverterController extends BaseConverterController<HtmlToJsxElements> {
  private converter: JsxConverter | null = null;

  constructor() {
    super('HtmlToJsxConverter'); 
  }

  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'jsxOutput'];
  }

  protected initializeElements(): HtmlToJsxElements {
    const createElement = <T extends HTMLElement>(tag: string): T => 
      document.createElement(tag) as T;

    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || createElement<HTMLTextAreaElement>('textarea'),
      jsxOutput: this.safeGetElement<HTMLTextAreaElement>('jsxOutput') || createElement<HTMLTextAreaElement>('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || createElement<HTMLElement>('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || createElement<HTMLElement>('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats') || createElement<HTMLElement>('div'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats') || createElement<HTMLElement>('div'),
      options: {
        prettify: this.safeGetElement<HTMLInputElement>('prettifyOption') || createElement<HTMLInputElement>('input'),
        camelCase: this.safeGetElement<HTMLInputElement>('camelCaseOption') || createElement<HTMLInputElement>('input'),
        fragment: this.safeGetElement<HTMLInputElement>('fragmentOption') || createElement<HTMLInputElement>('input'),
      },
    };
  }

  protected validateElements(): boolean {
    return !!(this.elements?.htmlInput && this.elements?.jsxOutput);
  }

  protected bindEvents(): void {
    if (!this.validateElements()) {
      console.error('Cannot bind events: required elements not found');
      return;
    }

    // Initialize converter
    this.converter = new JsxConverter(this.getOptions());

    // Main input event
    this.safeAddEventListener(this.elements!.htmlInput, 'input', () => {
      this.convert();
      this.updateStats();
    });

    // Action buttons
    const convertBtn = this.safeGetElement('convertBtn');
    this.safeAddEventListener(convertBtn, 'click', () => this.convert());

    const clearBtn = this.safeGetElement('clearBtn');
    this.safeAddEventListener(clearBtn, 'click', () => this.clear());

    const copyBtn = this.safeGetElement('copyBtn');
    this.safeAddEventListener(copyBtn, 'click', () => this.copy());

    const sampleBtn = this.safeGetElement('sampleBtn');
    this.safeAddEventListener(sampleBtn, 'click', () => this.loadSample());

    // Option change handlers
    if (this.elements!.options) {
      Object.values(this.elements!.options).forEach(option => {
        if (option && option.addEventListener) {
          this.safeAddEventListener(option, 'change', () => {
            if (this.converter) {
              this.converter = new JsxConverter(this.getOptions());
              this.convert();
            }
          });
        }
      });
    }

    console.log('JSX Converter events bound successfully');
  }

  protected onInitialized(): void {
    // Update stats after initialization
    this.updateStats();
  }

  private getOptions(): JsxConversionOptions {
    if (!this.elements?.options) {
      return {
        prettify: true,
        camelCase: true,
        useFragment: false,
      };
    }

    return {
      prettify: this.elements.options.prettify?.checked || false,
      camelCase: this.elements.options.camelCase?.checked || false,
      useFragment: this.elements.options.fragment?.checked || false,
    };
  }

  protected convert(): void {
    if (!this.converter || !this.validateElements()) {
      console.warn('Cannot convert: converter or elements not ready');
      return;
    }

    const html = this.elements!.htmlInput.value?.trim() || '';

    if (!html) {
      this.elements!.jsxOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const jsxCode = this.converter.convertToJsx(html);
      this.elements!.jsxOutput.value = jsxCode;
      this.showSuccess('HTML successfully converted to JSX!');
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements!.jsxOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (this.elements?.htmlInput) {
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
    if (!this.elements?.inputStats || !this.elements?.outputStats) {
      return;
    }

    const inputValue = this.elements.htmlInput?.value || '';
    const outputValue = this.elements.jsxOutput?.value || '';

    const inputStats = this.calculateStats(inputValue);
    const outputStats = this.calculateStats(outputValue);

    this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
  }

  protected showSuccess(message: string): void {
    if (this.elements?.successMessage) {
      this.elements.successMessage.textContent = message;
      this.elements.successMessage.classList.remove('hidden');
    }
    if (this.elements?.errorMessage) {
      this.elements.errorMessage.classList.add('hidden');
    }
    
    setTimeout(() => {
      this.hideMessages();
    }, 3000);
  }

  protected showError(message: string): void {
    if (this.elements?.errorMessage) {
      this.elements.errorMessage.textContent = message;
      this.elements.errorMessage.classList.remove('hidden');
    }
    if (this.elements?.successMessage) {
      this.elements.successMessage.classList.add('hidden');
    }
    
    setTimeout(() => {
      this.hideMessages();
    }, 5000);
  }

  // Public method to check if converter is ready
  public isReady(): boolean {
    return this.validateElements() && this.converter !== null;
  }
}