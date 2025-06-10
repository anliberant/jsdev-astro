import { HtmlEncoderDecoder } from './html-encoder-decoder';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlEncoderElements, EncoderOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlEncoderDecoderController extends BaseConverterController<HtmlEncoderElements> {
  private encoder: HtmlEncoderDecoder;
  private isDecodeMode: boolean = false;

  constructor() {
    super();
    this.encoder = new HtmlEncoderDecoder(this.getOptions());
    this.updateStats();
    this.detectMode();
  }

  protected initializeElements(): HtmlEncoderElements {
    return {
      htmlInput: document.getElementById('htmlInput') as HTMLTextAreaElement,
      htmlOutput: document.getElementById('htmlOutput') as HTMLTextAreaElement,
      errorMessage: document.getElementById('errorMessage') as HTMLElement,
      successMessage: document.getElementById('successMessage') as HTMLElement,
      inputStats: document.getElementById('inputStats') as HTMLElement,
      outputStats: document.getElementById('outputStats') as HTMLElement,
      options: {
        prettyFormat: document.getElementById('prettyFormatOption') as HTMLInputElement,
        specialChars: document.getElementById('specialCharsOption') as HTMLInputElement,
        numericEntities: document.getElementById('numericEntitiesOption') as HTMLInputElement,
      },
    };
  }

  protected bindEvents(): void {
    this.elements.htmlInput.addEventListener('input', () => {
      this.detectMode();
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
        this.encoder = new HtmlEncoderDecoder(this.getOptions());
        this.convert();
      });
    });
  }

  private getOptions(): EncoderOptions {
    return {
      prettyFormat: this.elements.options.prettyFormat.checked,
      specialChars: this.elements.options.specialChars.checked,
      numericEntities: this.elements.options.numericEntities.checked,
    };
  }

  private detectMode(): void {
    const input = this.elements.htmlInput.value.trim();
    
    // Check if input contains HTML entities
    const hasEntities = /&[a-zA-Z][a-zA-Z0-9]*;|&#[0-9]+;|&#x[0-9a-fA-F]+;/.test(input);
    this.isDecodeMode = hasEntities;
    
    // Update UI to show current mode
    this.updateModeIndicator();
  }

  private updateModeIndicator(): void {
    const outputPanel = document.querySelector('[data-panel="output"] .pane-title');
    if (outputPanel) {
      outputPanel.textContent = this.isDecodeMode ? 
        '🔓 Decoded Output' : 
        '🔐 Encoded Output';
    }
  }

  protected convert(): void {
    const input = this.elements.htmlInput.value.trim();

    if (!input) {
      this.elements.htmlOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      let result: string;
      
      if (this.isDecodeMode) {
        result = this.encoder.decode(input);
        this.showSuccess('HTML successfully decoded!');
      } else {
        result = this.encoder.encode(input);
        this.showSuccess('HTML successfully encoded!');
      }

      this.elements.htmlOutput.value = result;
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.htmlOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    this.elements.htmlInput.value = SAMPLE_HTML.encoder;
    this.detectMode();
    this.convert();
    this.updateStats();
  }

  private clear(): void {
    this.clearAll('htmlInput', 'htmlOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('htmlOutput', 'copyBtn');
  }

  private updateStats(): void {
    if (this.elements.inputStats && this.elements.outputStats) {
      const inputStats = this.calculateStats(this.elements.htmlInput.value);
      const outputStats = this.calculateStats(this.elements.htmlOutput.value);

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