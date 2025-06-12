
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlMarkdownElements } from '@/shared/types';

export class HtmlMarkdownController extends BaseConverterController<HtmlMarkdownElements> {
  private isMarkdownMode = false;

  // Define required elements for this specific converter
  protected getRequiredElementIds(): string[] {
    return [
      'editor', // MDX editor textarea
      'htmlOutput', // HTML output area
      'convertBtn',
      'clearBtn',
      'copyBtn'
    ];
  }

  protected initializeElements(): HtmlMarkdownElements | null {
    // Use safe element getters - map MDX editor elements to expected interface
    const htmlInput = this.safeGetElement<HTMLTextAreaElement>('editor'); // MDX editor
    const markdownOutput = this.safeGetElement<HTMLTextAreaElement>('htmlOutput'); // HTML output
    const convertBtn = this.safeGetElement<HTMLButtonElement>('convertBtn');
    const clearBtn = this.safeGetElement<HTMLButtonElement>('clearBtn');
    const copyBtn = this.safeGetElement<HTMLButtonElement>('copyHtmlBtn'); // Use actual copy button ID
    
    // Validate core elements exist
    if (!htmlInput || !markdownOutput) {
      console.error('HtmlMarkdownController: Missing core MDX editor elements');
      return null;
    }

    return {
      htmlInput,
      markdownOutput,
      convertBtn: convertBtn || document.createElement('button'),
      clearBtn: clearBtn || document.createElement('button'),
      copyBtn: copyBtn || document.createElement('button'),
      errorMessage: this.safeGetElement('errorMessage') || document.createElement('div'),
      successMessage: this.safeGetElement('successMessage') || document.createElement('div'),
      inputStats: this.safeGetElement('inputStats') || document.createElement('div'),
      outputStats: this.safeGetElement('outputStats') || document.createElement('div'),
      modeToggle: this.safeGetElement<HTMLInputElement>('modeToggle') || document.createElement('input'),
      inputLabel: this.safeGetElement('inputLabel') || document.createElement('div'),
      outputLabel: this.safeGetElement('outputLabel') || document.createElement('div')
    };
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    // Safe event binding using the base class method
    this.safeAddEventListener(this.elements.htmlInput, 'input', () => this.updatePreview());
    this.safeAddEventListener(this.elements.copyBtn, 'click', () => this.copy());
    
    // Optional elements
    if (this.elements.modeToggle) {
      this.safeAddEventListener(this.elements.modeToggle, 'change', () => this.toggleMode());
    }

    if (this.elements.convertBtn) {
      this.safeAddEventListener(this.elements.convertBtn, 'click', () => this.convert());
    }

    if (this.elements.clearBtn) {
      this.safeAddEventListener(this.elements.clearBtn, 'click', () => this.clear());
    }
  }

  private updatePreview(): void {
    if (!this.elements) return;
    
    try {
      const input = this.elements.htmlInput.value;
      if (!input.trim()) {
        this.elements.markdownOutput.value = '';
        return;
      }

      // Convert markdown to HTML
      const output = this.convertMarkdownToHtml(input);
      this.elements.markdownOutput.value = output;
      this.updateStats();
    } catch (error) {
      console.error('Preview update failed:', error);
    }
  }

  private convert(): void {
    this.updatePreview();
  }

  private clear(): void {
    if (!this.elements) return;
    this.elements.htmlInput.value = '';
    this.elements.markdownOutput.value = '';
    this.updateStats();
  }

  private async copy(): Promise<void> {
    if (!this.elements) return;
    
    try {
      const text = this.elements.markdownOutput.value || '';
      await navigator.clipboard.writeText(text);
      this.showCopySuccess();
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  private showCopySuccess(): void {
    if (!this.elements?.copyBtn) return;
    
    const originalText = this.elements.copyBtn.textContent || 'Copy HTML';
    this.elements.copyBtn.textContent = 'Copied!';
    this.elements.copyBtn.classList.add('copied');
    
    setTimeout(() => {
      if (this.elements?.copyBtn) {
        this.elements.copyBtn.textContent = originalText;
        this.elements.copyBtn.classList.remove('copied');
      }
    }, 2000);
  }

  private updateStats(): void {
    if (!this.elements) return;
    
    const inputStats = this.calculateStats(this.elements.htmlInput.value);
    const outputStats = this.calculateStats(this.elements.markdownOutput.value);
    
    if (this.elements.inputStats) {
      this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    }
    
    if (this.elements.outputStats) {
      this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
  }

  private toggleMode(): void {
    this.isMarkdownMode = !this.isMarkdownMode;
    console.log('Mode toggled:', this.isMarkdownMode ? 'Markdown to HTML' : 'HTML to Markdown');
  }

  private convertMarkdownToHtml(markdown: string): string {
    // Simple markdown to HTML conversion
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\_\_(.*\_\_)/gim, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    html = html.replace(/\_(.*\_)/gim, '<em>$1</em>');
    
    // Code
    html = html.replace(/\`(.*?)\`/gim, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>');
    
    // Lists
    html = html.replace(/^\* (.*)$/gim, '<li>$1</li>');
    html = html.replace(/^\d+\. (.*)$/gim, '<li>$1</li>');
    
    // Paragraphs (basic)
    html = html.replace(/\n\n/gim, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/gim, '');
    html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
    
    return html;
  }
}