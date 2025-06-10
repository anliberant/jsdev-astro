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
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || document.createElement('textarea'),
      htmlOutput: this.safeGetElement<HTMLTextAreaElement>('htmlOutput') || document.createElement('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || document.createElement('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || document.createElement('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats') || document.createElement('div'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats') || document.createElement('div'),
      options: {
        prettyFormat: this.safeGetElement<HTMLInputElement>('prettyFormatOption') || document.createElement('input'),
        specialChars: this.safeGetElement<HTMLInputElement>('specialCharsOption') || document.createElement('input'),
        numericEntities: this.safeGetElement<HTMLInputElement>('numericEntitiesOption') || document.createElement('input'),
      },
    };
  }

  protected bindEvents(): void {
    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.detectMode();
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
        this.encoder = new HtmlEncoderDecoder(this.getOptions());
        this.convert();
      });
    });
  }

  private getOptions(): EncoderOptions {
    return {
      prettyFormat: this.elements.options.prettyFormat?.checked || false,
      specialChars: this.elements.options.specialChars?.checked || false,
      numericEntities: this.elements.options.numericEntities?.checked || false,
    };
  }

  private detectMode(): void {
    const input = this.elements.htmlInput.value?.trim() || '';
    
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
    const input = this.elements.htmlInput.value?.trim() || '';

    if (!input) {
      if (this.elements.htmlOutput) {
        this.elements.htmlOutput.value = '';
      }
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

      if (this.elements.htmlOutput) {
        this.elements.htmlOutput.value = result;
      }
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      if (this.elements.htmlOutput) {
        this.elements.htmlOutput.value = '';
      }
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (this.elements.htmlInput) {
      this.elements.htmlInput.value = SAMPLE_HTML.encoder;
      this.detectMode();
      this.convert();
      this.updateStats();
    }
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
      const inputStats = this.calculateStats(this.elements.htmlInput.value || '');
      const outputStats = this.calculateStats(this.elements.htmlOutput.value || '');

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