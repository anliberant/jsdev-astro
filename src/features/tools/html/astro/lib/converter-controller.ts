import { convertHtmlToAstro } from './html-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToAstroElements } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToAstroConverterController extends BaseConverterController<HtmlToAstroElements> {
  protected initializeElements(): HtmlToAstroElements {
    return {
      htmlInput: document.getElementById('htmlInput') as HTMLTextAreaElement,
      astroOutput: document.getElementById(
        'astroOutput'
      ) as HTMLTextAreaElement,
      errorMessage: document.getElementById('errorMessage') as HTMLElement,
      successMessage: document.getElementById('successMessage') as HTMLElement,
      inputStats: document.getElementById('inputStats') as HTMLElement,
      outputStats: document.getElementById('outputStats') as HTMLElement,
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
  }

  protected convert(): void {
    const html = this.elements.htmlInput.value.trim();

    if (!html) {
      this.elements.astroOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const astroCode = convertHtmlToAstro(html);
      this.elements.astroOutput.value = astroCode;
      this.showSuccess('HTML successfully converted to Astro!');
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.astroOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    this.elements.htmlInput.value = SAMPLE_HTML.astro;
    this.convert();
    this.updateStats();
  }

  private clear(): void {
    this.clearAll('htmlInput', 'astroOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('astroOutput', 'copyBtn');
  }

  private updateStats(): void {
    if (this.elements.inputStats && this.elements.outputStats) {
      const inputStats = this.calculateStats(this.elements.htmlInput.value);
      const outputStats = this.calculateStats(this.elements.astroOutput.value);

      this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
      this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
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