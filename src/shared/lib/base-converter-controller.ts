export abstract class BaseConverterController<T> {
  protected elements: T;
  private isInitialized: boolean = false;
  private initAttempts: number = 0;
  private maxAttempts: number = 50;

  constructor() {
    this.delayedInit();
  }

  private delayedInit(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attemptInit());
    } else {
      requestAnimationFrame(() => this.attemptInit());
    }
  }

  private attemptInit(): void {
    this.initAttempts++;
    
    try {
      console.log(`Attempt ${this.initAttempts}: Initializing converter...`);
      
      this.elements = this.initializeElements();
      
      if (this.validateElements()) {
        this.bindEvents();
        this.isInitialized = true;
        console.log('Converter initialized successfully');
      } else {
        throw new Error('Required elements not found');
      }
    } catch (error) {
      console.warn(`Initialization attempt ${this.initAttempts} failed:`, error);
      
      if (this.initAttempts < this.maxAttempts) {
        setTimeout(() => this.attemptInit(), 100);
      } else {
        console.error('Failed to initialize converter after maximum attempts');
      }
    }
  }

  protected abstract initializeElements(): T;
  protected abstract bindEvents(): void;

  protected validateElements(): boolean {
    return true;
  }

  protected safeGetElement<E extends HTMLElement>(id: string): E | null {
    try {
      const element = document.getElementById(id) as E | null;
      if (!element) {
        console.warn(`Element with id "${id}" not found`);
      }
      return element;
    } catch (error) {
      console.error(`Error getting element "${id}":`, error);
      return null;
    }
  }

  protected safeAddEventListener(
    element: HTMLElement | null,
    event: string,
    handler: EventListener
  ): void {
    if (element && typeof element.addEventListener === 'function') {
      try {
        element.addEventListener(event, handler);
      } catch (error) {
        console.error(`Error adding event listener to element:`, error);
      }
    } else {
      console.warn(`Cannot add event listener to element: ${element}`);
    }
  }

  protected calculateStats(text: string): { lines: number; characters: number } {
    return {
      lines: text ? text.split('\n').length : 0,
      characters: text ? text.length : 0,
    };
  }

  protected async handleCopy(outputElementId: string, buttonId: string): Promise<void> {
    const outputElement = this.safeGetElement<HTMLTextAreaElement>(outputElementId);
    const button = this.safeGetElement(buttonId);

    if (!outputElement) {
      console.error(`Output element ${outputElementId} not found for copy operation`);
      return;
    }

    const text = outputElement.value || '';
    
    try {
      await navigator.clipboard.writeText(text);
      this.temporaryButtonText(button, '✅ Copied!', 'Copy');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      this.temporaryButtonText(button, '❌ Failed', 'Copy');
    }
  }

  protected clearAll(...elementIds: string[]): void {
    elementIds.forEach(id => {
      const element = this.safeGetElement<HTMLTextAreaElement>(id);
      if (element) {
        element.value = '';
      }
    });
    this.hideMessages();
  }

  protected temporaryButtonText(
    button: HTMLElement | null,
    tempText: string,
    originalText: string,
    duration: number = 2000
  ): void {
    if (!button) return;

    const original = button.textContent || originalText;
    button.textContent = tempText;
    button.classList.add('copied');

    setTimeout(() => {
      button.textContent = original;
      button.classList.remove('copied');
    }, duration);
  }

  protected hideMessages(): void {
    const errorMessage = this.safeGetElement('errorMessage');
    const successMessage = this.safeGetElement('successMessage');

    if (errorMessage) {
      errorMessage.classList.add('hidden');
    }
    if (successMessage) {
      successMessage.classList.add('hidden');
    }
  }

  protected showSuccess(message: string): void {
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

  protected showError(message: string): void {
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

  public isReady(): boolean {
    return this.isInitialized;
  }
}