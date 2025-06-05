import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToPugElements, PugConversionOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

import { HtmlParser } from './html-parser';

export class HtmlToPugConverterController extends BaseConverterController<HtmlToPugElements> {
  private parser: HtmlParser;

  constructor() {
    super();
    this.parser = new HtmlParser(this.getOptions());
    this.updateStats();
  }

  protected initializeElements(): HtmlToPugElements {
    return {
      htmlInput: document.getElementById('htmlInput') as HTMLTextAreaElement,
      pugOutput: document.getElementById('pugOutput') as HTMLTextAreaElement,
      errorMessage: document.getElementById('errorMessage') as HTMLElement,
      successMessage: document.getElementById('successMessage') as HTMLElement,
      inputStats: document.getElementById('inputStats') as HTMLElement,
      outputStats: document.getElementById('outputStats') as HTMLElement,
      options: {
        prettify: document.getElementById('prettifyOption') as HTMLInputElement,
        combineText: document.getElementById(
          'combineTextOption'
        ) as HTMLInputElement,
        preserveComments: document.getElementById(
          'preserveCommentsOption'
        ) as HTMLInputElement,
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
        this.parser = new HtmlParser(this.getOptions());
        this.convert();
      });
    });
  }

  private getOptions(): PugConversionOptions {
    return {
      prettify: this.elements.options.prettify.checked,
      combineText: this.elements.options.combineText.checked,
      preserveComments: this.elements.options.preserveComments.checked,
    };
  }

  protected convert(): void {
    const html = this.elements.htmlInput.value.trim();

    if (!html) {
      this.elements.pugOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const pug = this.parser.convertToPug(html);
      this.elements.pugOutput.value = pug;
      this.showSuccess('HTML successfully converted to Pug!');
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.pugOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    this.elements.htmlInput.value = SAMPLE_HTML.pug;
    this.convert();
    this.updateStats();
  }

  private clear(): void {
    this.clearAll('htmlInput', 'pugOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('pugOutput', 'copyBtn');
  }

  private updateStats(): void {
    const inputStats = this.calculateStats(this.elements.htmlInput.value);
    const outputStats = this.calculateStats(this.elements.pugOutput.value);

    this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
  }

  protected showSuccess(message: string): void {
    this.elements.successMessage.textContent = message;
    this.elements.successMessage.classList.remove('hidden');
    this.elements.errorMessage.classList.add('hidden');
    
    setTimeout(() => {
      this.hideMessages();
    }, 3000);
  }

  protected showError(message: string): void {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.remove('hidden');
    this.elements.successMessage.classList.add('hidden');
    
    setTimeout(() => {
      this.hideMessages();
    }, 5000);
  }
}