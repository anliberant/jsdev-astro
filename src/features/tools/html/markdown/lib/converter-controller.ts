import { HtmlMarkdownConverter } from './html-to-markdown-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlMarkdownElements, ConversionMode } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlMarkdownController extends BaseConverterController<HtmlMarkdownElements> {
  private converter: HtmlMarkdownConverter | null = null;
  private currentMode: ConversionMode = 'html-to-markdown';
  private initAttempts: number = 0;
  private maxAttempts: number = 20;

  constructor() {
    super();
    this.elements = this.initializeElements();
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
      this.converter = new HtmlMarkdownConverter();
      this.updateLabels();
      this.updateStats();
    } else if (this.initAttempts < this.maxAttempts) {
      setTimeout(() => this.attemptInit(), 100);
    }
  }

  private checkRequiredElements(): boolean {
    const required = ['htmlInput', 'markdownOutput'];
    return required.every(id => document.getElementById(id) !== null);
  }

  protected initializeElements(): HtmlMarkdownElements {
    const createElement = <T extends HTMLElement>(tag: string): T => 
      document.createElement(tag) as T;

    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || createElement<HTMLTextAreaElement>('textarea'),
      markdownOutput: this.safeGetElement<HTMLTextAreaElement>('markdownOutput') || createElement<HTMLTextAreaElement>('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || createElement<HTMLElement>('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || createElement<HTMLElement>('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats') || createElement<HTMLElement>('div'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats') || createElement<HTMLElement>('div'),
      modeToggle: this.safeGetElement<HTMLInputElement>('modeToggle') || createElement<HTMLInputElement>('input'),
      inputLabel: this.safeGetElement<HTMLElement>('inputLabel') || createElement<HTMLElement>('div'),
      outputLabel: this.safeGetElement<HTMLElement>('outputLabel') || createElement<HTMLElement>('div'),
    };
  }

  protected bindEvents(): void {
    if (!this.elements.htmlInput || !this.elements.markdownOutput) {
      return;
    }

    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
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

    if (this.elements.modeToggle) {
      this.safeAddEventListener(this.elements.modeToggle, 'change', () => {
        this.toggleMode();
      });
    }
  }

  private toggleMode(): void {
    if (!this.elements.modeToggle) return;

    this.currentMode = this.elements.modeToggle.checked ? 
      'markdown-to-html' : 'html-to-markdown';
    
    this.updateLabels();
    this.swapInputOutput();
    this.convert();
  }

  private updateLabels(): void {
    if (this.currentMode === 'html-to-markdown') {
      if (this.elements.inputLabel) {
        this.elements.inputLabel.textContent = '📝 HTML Input';
      }
      if (this.elements.outputLabel) {
        this.elements.outputLabel.textContent = '📄 Markdown Output';
      }
    } else {
      if (this.elements.inputLabel) {
        this.elements.inputLabel.textContent = '📄 Markdown Input';
      }
      if (this.elements.outputLabel) {
        this.elements.outputLabel.textContent = '📝 HTML Output';
      }
    }
  }

  private swapInputOutput(): void {
    if (!this.elements.htmlInput || !this.elements.markdownOutput) return;

    const inputValue = this.elements.htmlInput.value;
    const outputValue = this.elements.markdownOutput.value;

    this.elements.htmlInput.value = outputValue;
    this.elements.markdownOutput.value = inputValue;
  }

  protected convert(): void {
    if (!this.converter || !this.elements.htmlInput || !this.elements.markdownOutput) {
      return;
    }

    const input = this.elements.htmlInput.value?.trim() || '';

    if (!input) {
      this.elements.markdownOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      let result: string;
      
      if (this.currentMode === 'html-to-markdown') {
        result = this.converter.htmlToMarkdown(input);
        this.showSuccess('HTML converted to Markdown successfully!');
      } else {
        result = this.converter.markdownToHtml(input);
        this.showSuccess('Markdown converted to HTML successfully!');
      }

      this.elements.markdownOutput.value = result;
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.markdownOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (this.elements.htmlInput) {
      if (this.currentMode === 'html-to-markdown') {
        this.elements.htmlInput.value = SAMPLE_HTML.markdown;
      } else {
        this.elements.htmlInput.value = '# Sample Markdown\n\nThis is a **sample** markdown content with *emphasis* and [links](https://example.com).\n\n## Features\n\n- Lists\n- Tables\n- Code blocks\n\n```javascript\nfunction hello() {\n  console.log("Hello World!");\n}\n```';
      }
      this.convert();
      this.updateStats();
    }
  }

  private clear(): void {
    this.clearAll('htmlInput', 'markdownOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('markdownOutput', 'copyBtn');
  }

  private updateStats(): void {
    if (!this.elements.inputStats || !this.elements.outputStats) {
      return;
    }

    const inputValue = this.elements.htmlInput?.value || '';
    const outputValue = this.elements.markdownOutput?.value || '';

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