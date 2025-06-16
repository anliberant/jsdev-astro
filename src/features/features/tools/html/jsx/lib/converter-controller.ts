import { JsxConverter } from './jsx-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToJsxElements, JsxConversionOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToJsxConverterController extends BaseConverterController<HtmlToJsxElements> {
  private converter: JsxConverter | null = null;

  constructor() {
    super('HtmlToJsxConverter');
    this.delayedInit();
  }

  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'jsxOutput'];
  }

  protected hasRequiredElements(): boolean {
    const requiredIds = this.getRequiredElementIds();
    return requiredIds.every(id => {
      try {
        const element = document.getElementById(id);
        return element !== null;
      } catch (error) {
        console.error(`Error checking element ${id}:`, error);
        return false;
      }
    });
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
      }
    };
  }

  protected getSampleInput(): string {
    return SAMPLE_HTML.jsx;
  }

  protected convert(input: string): string {
    if (!this.converter) {
      this.initializeConverter();
    }
    return this.converter!.convertToJsx(input);
  }

  private initializeConverter(): void {
    const options = this.getOptions();
    console.log('Initializing JSX converter with options:', options);
    this.converter = new JsxConverter(options);
  }

  private getOptions(): JsxConversionOptions {
    if (!this.elements) {
      return {
        prettify: true,
        camelCase: true,
        useFragment: false
      };
    }

    const options = {
      prettify: this.elements.options.prettify?.checked ?? true,
      camelCase: this.elements.options.camelCase?.checked ?? true,
      useFragment: this.elements.options.fragment?.checked ?? false,
    };

    console.log('Current JSX options:', options);
    return options;
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    this.initializeConverter();

    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.performConversion();
      this.updateStats();
    });

    const convertBtn = this.safeGetElement('convertBtn');
    this.safeAddEventListener(convertBtn, 'click', () => this.performConversion());

    const clearBtn = this.safeGetElement('clearBtn');
    this.safeAddEventListener(clearBtn, 'click', () => this.clearAll('htmlInput', 'jsxOutput'));

    const copyBtn = this.safeGetElement('copyBtn');
    this.safeAddEventListener(copyBtn, 'click', () => this.handleCopy('jsxOutput', 'copyBtn'));

    const sampleBtn = this.safeGetElement('sampleBtn');
    if (sampleBtn) {
      console.log('Sample button found, adding click handler');
      this.safeAddEventListener(sampleBtn, 'click', (e) => {
        console.log('Sample button clicked!');
        e.preventDefault();
        this.loadSample();
      });
    } else {
      console.error('Sample button not found!');
    }

    this.safeAddEventListener(this.elements.options.prettify, 'change', () => {
      console.log('Prettify option changed');
      this.updateConverterOptions();
    });
    
    this.safeAddEventListener(this.elements.options.camelCase, 'change', () => {
      console.log('CamelCase option changed');
      this.updateConverterOptions();
    });
    
    this.safeAddEventListener(this.elements.options.fragment, 'change', () => {
      console.log('Fragment option changed');
      this.updateConverterOptions();
    });
  }

  private performConversion(): void {
    if (!this.elements?.htmlInput || !this.elements?.jsxOutput) return;

    const input = this.elements.htmlInput.value.trim();
    
    try {
      const result = input ? this.convert(input) : '';
      this.elements.jsxOutput.value = result;
      this.updateStats();
      
      if (input && result) {
        this.showSuccess('HTML successfully converted to JSX!');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.jsxOutput.value = '';
    }
  }

  private loadSample(): void {
    if (this.elements?.htmlInput) {
      this.elements.htmlInput.value = this.getSampleInput();
      this.performConversion();
    }
  }

  private updateConverterOptions(): void {
    const options = this.getOptions();
    console.log('Updating JSX converter options:', options);
    this.converter = new JsxConverter(options);
    this.performConversion();
  }

  private updateStats(): void {
    if (!this.elements?.htmlInput || !this.elements?.jsxOutput) return;

    const inputValue = this.elements.htmlInput.value || '';
    const outputValue = this.elements.jsxOutput.value || '';

    const inputStats = this.calculateStats(inputValue);
    const outputStats = this.calculateStats(outputValue);

    const inputStatsElement = this.safeGetElement('inputStats');
    const outputStatsElement = this.safeGetElement('outputStats');

    if (inputStatsElement) {
      inputStatsElement.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    }

    if (outputStatsElement) {
      outputStatsElement.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
  }

  protected onInitialized(): void {
    this.updateStats();
    console.log('HTML to JSX Converter initialized successfully');
  }
}