import { HtmlEncoderDecoder } from './html-encoder-decoder';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlEncoderElements, EncoderOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/lib/index';

export class HtmlEncoderDecoderController extends BaseConverterController<HtmlEncoderElements> {
  private encoder: HtmlEncoderDecoder | null = null;
  private isDecodeMode: boolean = false;
  private initAttempts: number = 0;
  private maxAttempts: number = 20;

  constructor() {
    super();
    this.delayedInit();
  }

  private delayedInit(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attemptInit());
    } else {
      setTimeout(() => this.attemptInit(), 50);
    }
  }

  private attemptInit(): void {
    this.initAttempts++;
    
    if (this.checkRequiredElements()) {
      this.encoder = new HtmlEncoderDecoder(this.getOptions());
      this.updateStats();
      this.detectMode();
    } else if (this.initAttempts < this.maxAttempts) {
      setTimeout(() => this.attemptInit(), 100);
    }
  }

  private checkRequiredElements(): boolean {
    const required = ['htmlInput', 'htmlOutput'];
    return required.every(id => document.getElementById(id) !== null);
  }

  protected initializeElements(): HtmlEncoderElements {
    const createElement = <T extends HTMLElement>(tag: string): T => 
      document.createElement(tag) as T;

    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || createElement<HTMLTextAreaElement>('textarea'),
      htmlOutput: this.safeGetElement<HTMLTextAreaElement>('htmlOutput') || createElement<HTMLTextAreaElement>('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || createElement<HTMLElement>('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || createElement<HTMLElement>('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats') || createElement<HTMLElement>('div'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats') || createElement<HTMLElement>('div'),
      options: {
        prettyFormat: this.safeGetElement<HTMLInputElement>('prettyFormatOption') || createElement<HTMLInputElement>('input'),
        specialChars: this.safeGetElement<HTMLInputElement>('specialCharsOption') || createElement<HTMLInputElement>('input'),
        numericEntities: this.safeGetElement<HTMLInputElement>('numericEntitiesOption') || createElement<HTMLInputElement>('input'),
      },
    };
  }

  protected bindEvents(): void {
    if (!this.elements.htmlInput || !this.elements.htmlOutput) {
      return;
    }

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
      if (option && option.addEventListener) {
        this.safeAddEventListener(option, 'change', () => {
          if (this.encoder) {
            this.encoder = new HtmlEncoderDecoder(this.getOptions());
            this.convert();
          }
        });
      }
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
    if (!this.elements.htmlInput?.value) {
      return;
    }

    const input = this.elements.htmlInput.value.trim();
    const hasEntities = /&[a-zA-Z][a-zA-Z0-9]*;|&#[0-9]+;|&#x[0-9a-fA-F]+;/.test(input);
    this.isDecodeMode = hasEntities;
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
    if (!this.encoder || !this.elements.htmlInput || !this.elements.htmlOutput) {
      return;
    }

    const input = this.elements.htmlInput.value?.trim() || '';

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
      // removed log: console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.htmlOutput.value = '';
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
    if (!this.elements.inputStats || !this.elements.outputStats) {
      return;
    }

    const inputValue = this.elements.htmlInput?.value || '';
    const outputValue = this.elements.htmlOutput?.value || '';

    const inputStats = this.calculateStats(inputValue);
    const outputStats = this.calculateStats(outputValue);

    this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
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