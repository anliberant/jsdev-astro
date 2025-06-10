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
    if (this.elements.errorMessage) {
      this.elements.errorMessage.textContent = message;
      this.elements.errorMessage.classList.remove('hidden');
    }
    if (this.elements.successMessage) {
      this.elements.successMessage.classList.add('hidden');
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
  }

  protected hideMessages(): void {
    if (this.elements.errorMessage) {
      this.elements.errorMessage.classList.add('hidden');
    }
    if (this.elements.successMessage) {
      this.elements.successMessage.classList.add('hidden');
    }
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

  // Helper method to safely get element
  protected safeGetElement<E extends HTMLElement>(id: string): E | null {
    try {
      return document.getElementById(id) as E | null;
    } catch (error) {
      console.warn(`Element with id "${id}" not found:`, error);
      return null;
    }
  }

  // Helper method to safely add event listener
  protected safeAddEventListener(
    element: HTMLElement | null,
    event: string,
    handler: EventListener
  ): void {
    if (element && typeof element.addEventListener === 'function') {
      element.addEventListener(event, handler);
    } else {
      console.warn(`Cannot add event listener to element:`, element);
    }
  }
}