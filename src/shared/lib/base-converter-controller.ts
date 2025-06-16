export abstract class BaseConverterController<T> {
  protected elements: T | null = null;
  private isInitialized: boolean = false;
  private converterName: string;
  private initializationTimer: number | null = null;

  constructor(converterName?: string) {
    this.converterName = converterName || this.constructor.name;
    
    // Only initialize if we're on the right page
    if (this.shouldInitialize()) {
      this.delayedInit();
    } else {
      console.log(`${this.converterName}: Not the right page, skipping initialization`);
    }
  }

  protected abstract getRequiredElementIds(): string[];

  private shouldInitialize(): boolean {
    const requiredIds = this.getRequiredElementIds();
    
    if (!Array.isArray(requiredIds) || requiredIds.length === 0) {
      console.warn(`${this.converterName}: No required elements specified`);
      return false;
    }
    
    // Check if ALL required elements exist (изменено с ANY на ALL)
    const hasAllElements = requiredIds.every(id => {
      try {
        const element = document.getElementById(id);
        const exists = element !== null;
        if (!exists) {
          console.log(`${this.converterName}: Missing required element: ${id}`);
        }
        return exists;
      } catch (error) {
        console.error(`Error checking element ${id}:`, error);
        return false;
      }
    });
    
    if (!hasAllElements) {
      console.log(`${this.converterName}: Not all required elements found, skipping`);
      return false;
    }
    
    return true;
  }

  protected delayedInit(): void {
    // Clear any existing timer
    if (this.initializationTimer) {
      clearTimeout(this.initializationTimer);
    }

    // Use a more robust initialization approach
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attemptInit());
    } else {
      // Document is already ready, but wait a bit for dynamic content
      this.initializationTimer = setTimeout(() => this.attemptInit(), 100);
    }
  }

  private attemptInit(): void {
    try {
      console.log(`${this.converterName}: Attempting initialization...`);
      
      // Final check for required elements
      if (!this.checkAllRequiredElements()) {
        console.log(`${this.converterName}: Required elements still not found, aborting`);
        return;
      }
      
      this.elements = this.initializeElements();
      
      if (this.validateElements()) {
        this.bindEvents();
        this.isInitialized = true;
        console.log(`✅ ${this.converterName} initialized successfully`);
        
        // Call post-initialization hook
        this.onInitialized();
        
        // Store reference globally for debugging
        if (typeof window !== 'undefined') {
          (window as any)[`${this.converterName.toLowerCase()}Controller`] = this;
        }
      } else {
        throw new Error('Element validation failed');
      }
    } catch (error) {
      console.error(`❌ ${this.converterName} initialization failed:`, error);
      this.onInitializationFailed();
    }
  }

  private checkAllRequiredElements(): boolean {
    const requiredIds = this.getRequiredElementIds();
    const missingElements = requiredIds.filter(id => {
      try {
        return !document.getElementById(id);
      } catch (error) {
        console.error(`Error checking element ${id}:`, error);
        return true; // Treat error as missing
      }
    });
    
    if (missingElements.length > 0) {
      console.log(`${this.converterName}: Missing elements: ${missingElements.join(', ')}`);
      return false;
    }
    
    return true;
  }

  // Hook for subclasses to override
  protected onInitialized(): void {
    // Default implementation - can be overridden
  }

  // Hook for when initialization fails
  protected onInitializationFailed(): void {
    console.warn(`${this.converterName} failed to initialize.`);
  }

  protected abstract initializeElements(): T;
  protected abstract bindEvents(): void;

  protected validateElements(): boolean {
    return this.elements !== null;
  }

  protected safeGetElement<E extends HTMLElement>(id: string): E | null {
    try {
      const element = document.getElementById(id) as E | null;
      if (!element) {
        console.warn(`${this.converterName}: Element with id "${id}" not found`);
      }
      return element;
    } catch (error) {
      console.error(`${this.converterName}: Error getting element "${id}":`, error);
      return null;
    }
  }

  protected safeAddEventListener(
    element: HTMLElement | null,
    event: string,
    handler: EventListener
  ): void {
    if (!element) {
      console.warn(`${this.converterName}: Cannot add event listener to null element`);
      return;
    }

    if (typeof element.addEventListener !== 'function') {
      console.warn(`${this.converterName}: Element does not support addEventListener:`, element);
      return;
    }

    try {
      element.addEventListener(event, handler);
    } catch (error) {
      console.error(`${this.converterName}: Error adding event listener:`, error);
    }
  }

  protected calculateStats(text: string): { lines: number; characters: number } {
    if (typeof text !== 'string') {
      return { lines: 0, characters: 0 };
    }
    
    return {
      lines: text ? text.split('\n').length : 0,
      characters: text ? text.length : 0,
    };
  }

  protected async handleCopy(outputElementId: string, buttonId: string): Promise<void> {
    const outputElement = this.safeGetElement<HTMLTextAreaElement>(outputElementId);
    const button = this.safeGetElement(buttonId);

    if (!outputElement) {
      console.error(`${this.converterName}: Output element ${outputElementId} not found for copy operation`);
      return;
    }

    const text = outputElement.value || '';
    
    try {
      await navigator.clipboard.writeText(text);
      this.temporaryButtonText(button, '✅ Copied!', 'Copy');
    } catch (error) {
      console.error(`${this.converterName}: Failed to copy to clipboard:`, error);
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
    return this.isInitialized && this.elements !== null;
  }

  // Helper method to safely access nested properties
  protected safeAccess<K>(obj: any, path: string[]): K | null {
    try {
      let current = obj;
      for (const key of path) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return null;
        }
      }
      return current;
    } catch (error) {
      console.warn(`${this.converterName}: Error accessing path ${path.join('.')}:`, error);
      return null;
    }
  }

  // Cleanup method
  public destroy(): void {
    if (this.initializationTimer) {
      clearTimeout(this.initializationTimer);
      this.initializationTimer = null;
    }
    
    this.isInitialized = false;
    this.elements = null;
    
    // Remove global reference
    if (typeof window !== 'undefined') {
      delete (window as any)[`${this.converterName.toLowerCase()}Controller`];
    }
  }

  protected findSampleButton(): HTMLElement | null {
    // Пробуем разные способы найти кнопку Sample
    let sampleBtn = this.safeGetElement('sampleBtn');
    
    if (!sampleBtn) {
      // Пробуем найти по тексту
      const buttons = document.querySelectorAll('button');
      for (const button of buttons) {
        if (button.textContent?.trim().toLowerCase() === 'sample') {
          sampleBtn = button;
          break;
        }
      }
    }
    
    if (!sampleBtn) {
      // Пробуем найти по классу или другим атрибутам
      sampleBtn = document.querySelector('button[variant="sample"]') as HTMLElement;
    }
    
    if (!sampleBtn) {
      // Последняя попытка - ищем в converter-panel
      const inputPanel = document.querySelector('[data-panel="input"]');
      if (inputPanel) {
        sampleBtn = inputPanel.querySelector('button') as HTMLElement;
      }
    }
    
    return sampleBtn;
  }

  protected bindSampleButton(loadSampleFn: () => void): void {
    const bindSample = () => {
      const sampleBtn = this.findSampleButton();
      if (sampleBtn) {
        console.log(`${this.converterName}: Sample button found, binding event`);
        this.safeAddEventListener(sampleBtn, 'click', (e) => {
          console.log(`${this.converterName}: Sample button clicked!`);
          e.preventDefault();
          loadSampleFn();
        });
        return true;
      }
      return false;
    };

    if (!bindSample()) {
      console.log(`${this.converterName}: Sample button not found immediately, retrying...`);
      
      setTimeout(() => {
        if (!bindSample()) {
          setTimeout(() => {
            if (!bindSample()) {
              console.warn(`${this.converterName}: Failed to find Sample button after multiple attempts`);
            }
          }, 1000);
        }
      }, 500);
    }
  }

  protected debugDOMElements(): void {
    console.log(`${this.converterName}: DOM Debug Info:`);
    console.log('- Required elements check:');
    
    this.getRequiredElementIds().forEach(id => {
      const element = document.getElementById(id);
      console.log(`  ${id}: ${element ? '✓ found' : '✗ missing'}`);
    });
    
    console.log('- All buttons on page:');
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, index) => {
      console.log(`  Button ${index}: id="${btn.id}", text="${btn.textContent?.trim()}", classes="${btn.className}"`);
    });
    
    console.log('- Sample button search results:');
    const sampleById = document.getElementById('sampleBtn');
    const sampleByText = Array.from(document.querySelectorAll('button')).find(btn => 
      btn.textContent?.trim().toLowerCase() === 'sample'
    );
    
    console.log(`  By ID (#sampleBtn): ${sampleById ? '✓ found' : '✗ missing'}`);
    console.log(`  By text content: ${sampleByText ? '✓ found' : '✗ missing'}`);
  }
}