import { HtmlMarkdownConverter } from './html-to-markdown-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlMarkdownElements, ConversionMode } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlMarkdownController extends BaseConverterController<HtmlMarkdownElements> {
  private converter: HtmlMarkdownConverter | null = null;
  private currentMode: ConversionMode = 'html-to-markdown';

  constructor() {
    super('HtmlMarkdownController');
    this.delayedInit();
  }

  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'markdownOutput'];
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
      outputLabel: this.safeGetElement<HTMLElement>('outputLabel') || createElement<HTMLElement>('div')
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
    this.safeAddEventListener(clearBtn, 'click', () => this.clearAll('htmlInput', 'markdownOutput'));

    const copyBtn = this.safeGetElement('copyBtn');
    this.safeAddEventListener(copyBtn, 'click', () => this.handleCopy('markdownOutput', 'copyBtn'));

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
      this.elements.markdownOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (!this.elements?.htmlInput) {
      console.error('htmlInput element not found');
      return;
    }

    console.log('Loading sample for HTML to Markdown converter...');
    
    let sampleContent = '';
    if (this.currentMode === 'html-to-markdown') {
      sampleContent = this.getSampleInput();
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
    
    this.clearAll('htmlInput', 'markdownOutput');
    
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

  protected getSampleInput(): string {
    return SAMPLE_HTML.markdown;
  }

  protected onInitialized(): void {
    this.updateStats();
    console.log('HTML ⇄ Markdown Converter initialized successfully');
  }
}