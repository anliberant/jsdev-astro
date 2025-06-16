import { HtmlEncoderDecoder } from './html-encoder-decoder';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlEncoderElements, EncoderOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlEncoderDecoderController extends BaseConverterController<HtmlEncoderElements> {
  private encoder: HtmlEncoderDecoder | null = null;
  private isDecodeMode: boolean = false;

  constructor() {
    super('HtmlEncoderDecoderController');
    this.delayedInit();
  }

  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'htmlOutput'];
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
    if (!this.elements) return;

    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.detectMode();
      this.performConversion();
      this.updateStats();
    });

    const convertBtn = this.safeGetElement('convertBtn');
    this.safeAddEventListener(convertBtn, 'click', () => this.performConversion());

    const clearBtn = this.safeGetElement('clearBtn');
    this.safeAddEventListener(clearBtn, 'click', () => this.clearAll('htmlInput', 'htmlOutput'));

    const copyBtn = this.safeGetElement('copyBtn');
    this.safeAddEventListener(copyBtn, 'click', () => this.handleCopy('htmlOutput', 'copyBtn'));

    const sampleBtn = this.safeGetElement('sampleBtn');
    this.safeAddEventListener(sampleBtn, 'click', () => this.loadSample());

    Object.values(this.elements.options).forEach(option => {
      if (option) {
        this.safeAddEventListener(option, 'change', () => {
          this.updateEncoderOptions();
          this.performConversion();
        });
      }
    });

    this.initializeEncoder();
  }

  private initializeEncoder(): void {
    const options = this.getOptions();
    this.encoder = new HtmlEncoderDecoder(options);
  }

  private getOptions(): EncoderOptions {
    if (!this.elements) {
      return {
        prettyFormat: false,
        specialChars: false,
        numericEntities: false
      };
    }

    return {
      prettyFormat: this.elements.options.prettyFormat?.checked ?? false,
      specialChars: this.elements.options.specialChars?.checked ?? false,
      numericEntities: this.elements.options.numericEntities?.checked ?? false,
    };
  }

  private updateEncoderOptions(): void {
    const options = this.getOptions();
    if (this.encoder) {
      this.encoder = new HtmlEncoderDecoder(options);
    } else {
      this.encoder = new HtmlEncoderDecoder(options);
    }
  }

  private detectMode(): void {
    if (!this.elements?.htmlInput?.value) {
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

  private performConversion(): void {
    if (!this.encoder || !this.elements?.htmlInput || !this.elements?.htmlOutput) {
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
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.htmlOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (this.elements?.htmlInput) {
      this.elements.htmlInput.value = this.getSampleInput();
      this.detectMode();
      this.performConversion();
      this.updateStats();
    }
  }

  private updateStats(): void {
    if (!this.elements?.htmlInput || !this.elements?.htmlOutput) return;

    const inputValue = this.elements.htmlInput.value || '';
    const outputValue = this.elements.htmlOutput.value || '';

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
    return SAMPLE_HTML.encoder;
  }

  protected onInitialized(): void {
    this.updateStats();
    this.detectMode();
    console.log('HTML Encoder & Decoder initialized successfully');
  }
}