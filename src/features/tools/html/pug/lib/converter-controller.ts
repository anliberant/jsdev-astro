import { HtmlParser } from './html-parser';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToPugElements, PugConversionOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToPugConverterController extends BaseConverterController<HtmlToPugElements> {
  private parser: HtmlParser | null = null;

  constructor() {
    super('HtmlToPugConverter');
    this.delayedInit();
  }

  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'pugOutput'];
  }

  protected initializeElements(): HtmlToPugElements {
    const createElement = <T extends HTMLElement>(tag: string): T =>
      document.createElement(tag) as T;

    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || createElement<HTMLTextAreaElement>('textarea'),
      pugOutput: this.safeGetElement<HTMLTextAreaElement>('pugOutput') || createElement<HTMLTextAreaElement>('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || createElement<HTMLElement>('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || createElement<HTMLElement>('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats') || createElement<HTMLElement>('div'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats') || createElement<HTMLElement>('div'),
      options: {
        prettify: this.safeGetElement<HTMLInputElement>('prettifyOption') || createElement<HTMLInputElement>('input'),
        combineText: this.safeGetElement<HTMLInputElement>('combineTextOption') || createElement<HTMLInputElement>('input'),
        preserveComments: this.safeGetElement<HTMLInputElement>('preserveCommentsOption') || createElement<HTMLInputElement>('input'),
      }
    };
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.performConversion();
      this.updateStats();
    });

    const convertBtn = this.safeGetElement('convertBtn');
    this.safeAddEventListener(convertBtn, 'click', () => this.performConversion());

    const clearBtn = this.safeGetElement('clearBtn');
    this.safeAddEventListener(clearBtn, 'click', () => this.clearAll('htmlInput', 'pugOutput'));

    const copyBtn = this.safeGetElement('copyBtn');
    this.safeAddEventListener(copyBtn, 'click', () => this.handleCopy('pugOutput', 'copyBtn'));

    const sampleBtn = this.safeGetElement('sampleBtn');
    this.safeAddEventListener(sampleBtn, 'click', () => this.loadSample());

    this.safeAddEventListener(this.elements.options.prettify, 'change', () => this.updateParserOptions());
    this.safeAddEventListener(this.elements.options.combineText, 'change', () => this.updateParserOptions());
    this.safeAddEventListener(this.elements.options.preserveComments, 'change', () => this.updateParserOptions());

    this.initializeParser();
  }

  private initializeParser(): void {
    const options = this.getOptions();
    this.parser = new HtmlParser(options);
  }

  private getOptions(): PugConversionOptions {
    if (!this.elements) {
      return {
        prettify: true,
        combineText: false,
        preserveComments: false
      };
    }

    return {
      prettify: this.elements.options.prettify?.checked ?? true,
      combineText: this.elements.options.combineText?.checked ?? false,
      preserveComments: this.elements.options.preserveComments?.checked ?? false
    };
  }

  private updateParserOptions(): void {
    const options = this.getOptions();
    this.parser = new HtmlParser(options);
    this.performConversion();
  }

  private performConversion(): void {
    if (!this.elements?.htmlInput || !this.elements?.pugOutput || !this.parser) return;

    const input = this.elements.htmlInput.value.trim();
    
    try {
      const result = input ? this.parser.convertToPug(input) : '';
      this.elements.pugOutput.value = result;
      this.updateStats();
      
      if (input && result) {
        this.showSuccess('HTML successfully converted to Pug!');
      }
    } catch (error) {
      console.error('Pug conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.pugOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (this.elements?.htmlInput) {
      this.elements.htmlInput.value = this.getSampleInput();
      this.performConversion();
      this.updateStats();
    }
  }

  private updateStats(): void {
    if (!this.elements?.htmlInput || !this.elements?.pugOutput) return;

    const inputValue = this.elements.htmlInput.value || '';
    const outputValue = this.elements.pugOutput.value || '';

    const inputStats = this.calculateStats(inputValue);
    const outputStats = this.calculateStats(outputValue);

    if (this.elements.inputStats) {
      this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    }

    if (this.elements.outputStats) {
      this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
  }

  protected getSampleInput(): string {
    return SAMPLE_HTML.pug;
  }

  protected onInitialized(): void {
    this.updateStats();
    console.log('HTML to Pug Converter initialized successfully');
  }
}