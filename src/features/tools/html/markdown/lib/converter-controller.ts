// src/features/tools/html/markdown/lib/converter-controller.ts
import { HtmlMarkdownConverter } from './html-to-markdown-converter';
import { SafeBaseConverterController } from '@/shared/lib/safe-tool-initializer';
import type { HtmlMarkdownElements, ConversionMode } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlMarkdownController extends SafeBaseConverterController<HtmlMarkdownElements> {
  private converter: HtmlMarkdownConverter | null = null;
  private currentMode: ConversionMode = 'html-to-markdown';

  constructor() {
    super('HtmlMarkdownController', 'html-markdown');
  }

  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'markdownOutput', 'convertBtn', 'clearBtn', 'copyBtn'];
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
      inputLabel: createElement<HTMLElement>('div'),
      outputLabel: createElement<HTMLElement>('div')
    };
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
    this.safeAddEventListener(clearBtn, 'click', () => this.clearAll());

    const copyBtn = this.safeGetElement('copyBtn');
    this.safeAddEventListener(copyBtn, 'click', () => this.handleCopy());

    const sampleBtn = this.safeGetElement('sampleBtn');
    this.safeAddEventListener(sampleBtn, 'click', () => this.loadSample());

    if (this.elements.modeToggle) {
      this.safeAddEventListener(this.elements.modeToggle, 'change', () => this.toggleMode());
    }
  }

  private initializeConverter(): void {
    this.converter = new HtmlMarkdownConverter();
  }

  private performConversion(): void {
    if (!this.elements?.htmlInput || !this.elements?.markdownOutput || !this.converter) return;

    const input = this.elements.htmlInput.value.trim();
    
    try {
      let result = '';
      if (input) {
        if (this.currentMode === 'html-to-markdown') {
          result = this.converter.htmlToMarkdown(input);
        } else {
          result = this.converter.markdownToHtml(input);
        }
      }
      
      this.elements.markdownOutput.value = result;
      this.updateStats();
      
      if (input && result) {
        const modeText = this.currentMode === 'html-to-markdown' ? 'HTML to Markdown' : 'Markdown to HTML';
        this.showSuccess(`Successfully converted ${modeText}!`);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      if (this.elements.markdownOutput) {
        this.elements.markdownOutput.value = '';
      }
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (!this.elements?.htmlInput) return;

    let sampleContent = '';
    if (this.currentMode === 'html-to-markdown') {
      sampleContent = SAMPLE_HTML.markdown;
    } else {
      sampleContent = `# Sample Markdown Document

This is a **sample paragraph** with *various markdown elements*.

## Features

- Lists
- Tables  
- Code blocks

> This is an important quote that contains valuable information.

\`\`\`javascript
function hello() {
    console.log("Hello World!");
}
\`\`\``;
    }

    this.elements.htmlInput.value = sampleContent;
    this.performConversion();
    this.updateStats();
    this.showSuccess('Sample content loaded!');
  }

  private toggleMode(): void {
    if (!this.elements?.modeToggle) return;

    this.currentMode = this.elements.modeToggle.checked ? 'markdown-to-html' : 'html-to-markdown';
    this.updatePanelLabels();
    this.clearAll();
    console.log(`Switched to mode: ${this.currentMode}`);
  }

  private updatePanelLabels(): void {
    const inputPanel = document.querySelector('[data-panel="input"] .pane-title');
    const outputPanel = document.querySelector('[data-panel="output"] .pane-title');
    
    if (this.currentMode === 'html-to-markdown') {
      if (inputPanel) inputPanel.textContent = '📝 HTML Input';
      if (outputPanel) outputPanel.textContent = '📄 Markdown Output';
    } else {
      if (inputPanel) inputPanel.textContent = '📄 Markdown Input';
      if (outputPanel) outputPanel.textContent = '📝 HTML Output';
    }
  }

  private updateStats(): void {
    if (!this.elements?.htmlInput || !this.elements?.markdownOutput) return;

    const inputValue = this.elements.htmlInput.value || '';
    const outputValue = this.elements.markdownOutput.value || '';

    const inputStats = this.calculateStats(inputValue);
    const outputStats = this.calculateStats(outputValue);

    if (this.elements.inputStats) {
      this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    }

    if (this.elements.outputStats) {
      this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
  }

  private calculateStats(text: string): { lines: number; characters: number } {
    return {
      lines: text ? text.split('\n').length : 0,
      characters: text ? text.length : 0,
    };
  }

  private clearAll(): void {
    if (this.elements?.htmlInput) this.elements.htmlInput.value = '';
    if (this.elements?.markdownOutput) this.elements.markdownOutput.value = '';
    this.hideMessages();
    this.updateStats();
  }

  private async handleCopy(): Promise<void> {
    if (!this.elements?.markdownOutput) return;

    const text = this.elements.markdownOutput.value || '';
    
    try {
      await navigator.clipboard.writeText(text);
      this.showSuccess('Copied to clipboard!');
      
      const copyBtn = this.safeGetElement('copyBtn');
      if (copyBtn) {
        const originalText = copyBtn.textContent || 'Copy';
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Copy failed:', error);
      this.showError('Failed to copy to clipboard');
    }
  }

  private hideMessages(): void {
    const errorMessage = this.safeGetElement('errorMessage');
    const successMessage = this.safeGetElement('successMessage');

    if (errorMessage) errorMessage.classList.add('hidden');
    if (successMessage) successMessage.classList.add('hidden');
  }

  private showSuccess(message: string): void {
    const successMessage = this.safeGetElement('successMessage');
    const errorMessage = this.safeGetElement('errorMessage');

    if (successMessage) {
      successMessage.textContent = message;
      successMessage.classList.remove('hidden');
    }
    if (errorMessage) {
      errorMessage.classList.add('hidden');
    }

    setTimeout(() => {
      this.hideMessages();
    }, 3000);
  }

  private showError(message: string): void {
    const errorMessage = this.safeGetElement('errorMessage');
    const successMessage = this.safeGetElement('successMessage');

    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden');
    }
    if (successMessage) {
      successMessage.classList.add('hidden');
    }

    setTimeout(() => {
      this.hideMessages();
    }, 5000);
  }

  protected onInitialized(): void {
    this.updateStats();
    console.log('HTML ⇄ Markdown Converter initialized successfully');
  }
}