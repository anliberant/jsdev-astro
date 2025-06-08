import { HtmlToMarkdownConverter } from './html-to-markdown-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlMarkdownElements, ConversionMode } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlMarkdownConverterController extends BaseConverterController<HtmlMarkdownElements> {
  private converter: HtmlToMarkdownConverter;
  private currentMode: ConversionMode = 'html-to-markdown';

  constructor() {
    super();
    this.converter = new HtmlToMarkdownConverter();
    this.updateStats();
    this.updateUI();
  }

  protected initializeElements(): HtmlMarkdownElements {
    return {
      htmlInput: document.getElementById('htmlInput') as HTMLTextAreaElement,
      markdownOutput: document.getElementById('markdownOutput') as HTMLTextAreaElement,
      errorMessage: document.getElementById('errorMessage') as HTMLElement,
      successMessage: document.getElementById('successMessage') as HTMLElement,
      inputStats: document.getElementById('inputStats') as HTMLElement,
      outputStats: document.getElementById('outputStats') as HTMLElement,
      modeToggle: document.getElementById('modeToggle') as HTMLButtonElement,
      inputLabel: document.getElementById('inputLabel') as HTMLElement,
      outputLabel: document.getElementById('outputLabel') as HTMLElement,
    };
  }

  protected bindEvents(): void {
    this.elements.htmlInput.addEventListener('input', () => {
      this.convert();
      this.updateStats();
    });

    this.elements.modeToggle?.addEventListener('click', () => this.toggleMode());

    document.getElementById('convertBtn')?.addEventListener('click', () => this.convert());
    document.getElementById('clearBtn')?.addEventListener('click', () => this.clear());
    document.getElementById('copyBtn')?.addEventListener('click', () => this.copy());
    document.getElementById('sampleBtn')?.addEventListener('click', () => this.loadSample());
    document.getElementById('downloadBtn')?.addEventListener('click', () => this.downloadFile());
    document.getElementById('fileImport')?.addEventListener('change', (e) => this.importFile(e as Event));
  }

  private toggleMode(): void {
    this.currentMode = this.currentMode === 'html-to-markdown' ? 'markdown-to-html' : 'html-to-markdown';
    this.updateUI();
    this.clear();
  }

  private updateUI(): void {
    if (this.currentMode === 'html-to-markdown') {
      this.elements.inputLabel.textContent = '📝 HTML Input';
      this.elements.outputLabel.textContent = '📝 Markdown Output';
      this.elements.htmlInput.placeholder = 'Paste your HTML code here...';
      this.elements.modeToggle.textContent = '🔄 Switch to Markdown → HTML';
    } else {
      this.elements.inputLabel.textContent = '📝 Markdown Input';
      this.elements.outputLabel.textContent = '📝 HTML Output';
      this.elements.htmlInput.placeholder = 'Paste your Markdown content here...';
      this.elements.modeToggle.textContent = '🔄 Switch to HTML → Markdown';
    }
  }

  protected convert(): void {
    const input = this.elements.htmlInput.value.trim();

    if (!input) {
      this.elements.markdownOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      let result: string;
      
      if (this.currentMode === 'html-to-markdown') {
        result = this.converter.convertHtmlToMarkdown(input);
        this.showSuccess('HTML successfully converted to Markdown!');
      } else {
        result = this.converter.convertMarkdownToHtml(input);
        this.showSuccess('Markdown successfully converted to HTML!');
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
    if (this.currentMode === 'html-to-markdown') {
      this.elements.htmlInput.value = SAMPLE_HTML.markdown;
    } else {
      this.elements.htmlInput.value = `# Sample Markdown

This is a **sample** markdown document with *various* elements.

## Features

- Unordered lists
- **Bold text**
- *Italic text*
- \`inline code\`

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> This is a blockquote with some **bold** text.

[Link to Google](https://google.com)

---

### Table

| Feature | Status |
|---------|--------|
| Headers | ✅ |
| Lists | ✅ |
| Links | ✅ |`;
    }
    this.convert();
    this.updateStats();
  }

  private clear(): void {
    this.clearAll('htmlInput', 'markdownOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('markdownOutput', 'copyBtn');
  }

  private downloadFile(): void {
    const content = this.elements.markdownOutput.value;
    if (!content) {
      this.showError('No content to download');
      return;
    }

    const extension = this.currentMode === 'html-to-markdown' ? 'md' : 'html';
    const mimeType = this.currentMode === 'html-to-markdown' ? 'text/markdown' : 'text/html';
    const filename = `converted.${extension}`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private importFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.elements.htmlInput.value = e.target?.result as string;
        this.convert();
        this.updateStats();
      };
      reader.readAsText(file);
    }
  }

  private updateStats(): void {
    const inputStats = this.calculateStats(this.elements.htmlInput.value);
    const outputStats = this.calculateStats(this.elements.markdownOutput.value);

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