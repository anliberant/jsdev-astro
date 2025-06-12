
// Example 1: Using the enhanced BaseConverterController
// src/features/tools/html-markdown/lib/html-markdown-controller.ts

import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlMarkdownElements } from '@/shared/types';

export class HtmlMarkdownController extends BaseConverterController<HtmlMarkdownElements> {
  // Define required elements for this specific converter
  protected getRequiredElementIds(): string[] {
    return [
      'htmlInput',
      'markdownOutput', 
      'convertBtn',
      'clearBtn',
      'copyBtn'
    ];
  }

  protected initializeElements(): HtmlMarkdownElements | null {
    // Use safe element getters
    const htmlInput = this.safeGetElement<HTMLTextAreaElement>('htmlInput');
    const markdownOutput = this.safeGetElement<HTMLTextAreaElement>('markdownOutput');
    const convertBtn = this.safeGetElement<HTMLButtonElement>('convertBtn');
    const clearBtn = this.safeGetElement<HTMLButtonElement>('clearBtn');
    const copyBtn = this.safeGetElement<HTMLButtonElement>('copyBtn');
    
    // Validate all required elements exist
    if (!htmlInput || !markdownOutput || !convertBtn || !clearBtn || !copyBtn) {
      console.error('HtmlMarkdownController: Missing required elements');
      return null;
    }

    return {
      htmlInput,
      markdownOutput,
      convertBtn,
      clearBtn,
      copyBtn,
      errorMessage: this.safeGetElement('errorMessage')!,
      successMessage: this.safeGetElement('successMessage')!,
      inputStats: this.safeGetElement('inputStats')!,
      outputStats: this.safeGetElement('outputStats')!,
      modeToggle: this.safeGetElement<HTMLInputElement>('modeToggle')!,
      inputLabel: this.safeGetElement('inputLabel')!,
      outputLabel: this.safeGetElement('outputLabel')!
    };
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    // Safe event binding using the base class method
    this.safeAddEventListener(this.elements.convertBtn, 'click', () => this.convert());
    this.safeAddEventListener(this.elements.clearBtn, 'click', () => this.clear());
    this.safeAddEventListener(this.elements.copyBtn, 'click', () => this.copy());
    this.safeAddEventListener(this.elements.htmlInput, 'input', () => this.updateStats());
    
    // Optional elements
    if (this.elements.modeToggle) {
      this.safeAddEventListener(this.elements.modeToggle, 'change', () => this.toggleMode());
    }
  }

  private convert(): void {
    if (!this.elements) return;
    
    try {
      const input = this.elements.htmlInput.value;
      if (!input.trim()) {
        this.showError('Please enter some HTML to convert');
        return;
      }

      // Your conversion logic here
      const output = this.convertHtmlToMarkdown(input);
      this.elements.markdownOutput.value = output;
      this.updateStats();
      this.showSuccess('Conversion completed successfully!');
    } catch (error) {
      this.showError('Conversion failed: ' + (error as Error).message);
    }
  }

  private clear(): void {
    if (!this.elements) return;
    this.clearAll('htmlInput', 'markdownOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('markdownOutput', 'copyBtn');
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
    // Mode toggle logic here
    console.log('Mode toggled');
  }

  private convertHtmlToMarkdown(html: string): string {
    // Your actual conversion logic here
    // This is just a placeholder
    return html.replace(/<[^>]*>/g, '');
  }
}