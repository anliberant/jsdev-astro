import type { BaseConverterElements, ConversionStats } from '@/shared/types';

export abstract class BaseConverterController<T extends BaseConverterElements> {
  protected elements: T;

  constructor() {
    this.elements = this.initializeElements();
    this.bindEvents();
  }

  protected abstract initializeElements(): T;
  protected abstract bindEvents(): void;
  protected abstract convert(): void;

  protected showError(message: string): void {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.remove('hidden');
    this.elements.successMessage.classList.add('hidden');
  }

  protected showSuccess(message: string): void {
    this.elements.successMessage.textContent = message;
    this.elements.successMessage.classList.remove('hidden');
    this.elements.errorMessage.classList.add('hidden');
  }

  protected hideMessages(): void {
    this.elements.errorMessage.classList.add('hidden');
    this.elements.successMessage.classList.add('hidden');
  }

  protected async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  protected calculateStats(text: string): ConversionStats {
    return {
      lines: text.split('\n').length,
      characters: text.length,
    };
  }

  protected temporaryButtonText(
    buttonId: string,
    tempText: string,
    originalText: string,
    duration = 2000
  ): void {
    const button = document.getElementById(buttonId);
    if (button) {
      button.innerHTML = tempText;
      button.classList.add('copied');
      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('copied');
      }, duration);
    }
  }

  protected clearAll(inputId: string, outputId: string): void {
    const input = document.getElementById(inputId) as HTMLTextAreaElement;
    const output = document.getElementById(outputId) as HTMLTextAreaElement;

    if (input) input.value = '';
    if (output) output.value = '';

    this.hideMessages();
    input?.focus();
  }

  protected async handleCopy(
    outputId: string,
    buttonId: string
  ): Promise<void> {
    const output = document.getElementById(outputId) as HTMLTextAreaElement;
    const content = output?.value;

    if (!content) {
      this.showError('No content to copy');
      return;
    }

    const success = await this.copyToClipboard(content);
    const btn = document.getElementById(buttonId);

    if (success && btn) {
      const originalText = btn.innerHTML;
      this.temporaryButtonText(buttonId, '✅ Copied!', originalText);
    } else {
      this.showError('Failed to copy to clipboard');
    }
  }
}
