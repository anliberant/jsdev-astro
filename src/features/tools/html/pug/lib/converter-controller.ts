// src/features/tools/html/pug/lib/converter-controller.ts
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
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || document.createElement('textarea'),
      pugOutput: this.safeGetElement<HTMLTextAreaElement>('pugOutput') || document.createElement('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || document.createElement('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || document.createElement('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats') || document.createElement('div'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats') || document.createElement('div'),
      options: {
        prettify: this.safeGetElement<HTMLInputElement>('prettifyOption') || document.createElement('input'),
        combineText: this.safeGetElement<HTMLInputElement>('combineTextOption') || document.createElement('input'),
        preserveComments: this.safeGetElement<HTMLInputElement>('preserveCommentsOption') || document.createElement('input'),
      },
    };
  }

  protected bindEvents(): void {
    // Main input event
    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
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
    Object.values(this.elements.options).forEach(option => {
      this.safeAddEventListener(option, 'change', () => {
        this.parser = new HtmlParser(this.getOptions());
        this.convert();
      });
    });
  }

  private getOptions(): PugConversionOptions {
    return {
      prettify: this.elements.options.prettify?.checked || false,
      combineText: this.elements.options.combineText?.checked || false,
      preserveComments: this.elements.options.preserveComments?.checked || false,
    };
  }

  protected convert(): void {
    const html = this.elements.htmlInput.value?.trim() || '';

    if (!html) {
      if (this.elements.pugOutput) {
        this.elements.pugOutput.value = '';
      }
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const pug = this.parser.convertToPug(html);
      if (this.elements.pugOutput) {
        this.elements.pugOutput.value = pug;
      }
      this.showSuccess('HTML successfully converted to Pug!');
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      if (this.elements.pugOutput) {
        this.elements.pugOutput.value = '';
      }
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (this.elements.htmlInput) {
      this.elements.htmlInput.value = SAMPLE_HTML.pug;
      this.convert();
      this.updateStats();
    }
  }

  private clear(): void {
    this.clearAll('htmlInput', 'pugOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('pugOutput', 'copyBtn');
  }

  private updateStats(): void {
    if (this.elements.inputStats && this.elements.outputStats) {
      const inputStats = this.calculateStats(this.elements.htmlInput.value || '');
      const outputStats = this.calculateStats(this.elements.pugOutput.value || '');

      this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
      this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
  }

  protected showSuccess(message: string): void {
    if (this.elements.successMessage) {
      this.elements.successMessage.textContent = message;
      this.elements.successMessage.classList.remove('hidden');
    }
    if (this.elements.errorMessage) {
      this.elements.errorMessage.classList.add('hidden');
    }
    
    setTimeout(() => {
      this.hideMessages();
    }, 3000);
  }

  protected showError(message: string): void {
    if (this.elements.errorMessage) {
      this.elements.errorMessage.textContent = message;
      this.elements.errorMessage.classList.remove('hidden');
    }
    if (this.elements.successMessage) {
      this.elements.successMessage.classList.add('hidden');
    }
    
    setTimeout(() => {
      this.hideMessages();
    }, 5000);
  }
}