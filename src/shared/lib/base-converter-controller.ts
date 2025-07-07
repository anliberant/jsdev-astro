export abstract class BaseConverterController<T = any> {
  protected elements: T | null = null;
  protected initialized = false;

  constructor() {
  }

  public initialize(): void {
    if (this.initialized) {
      console.log(`${this.constructor.name} already initialized`);
      return;
    }

    try {
      this.elements = this.initializeElements();
      
      if (!this.validateElements()) {
        console.log(`${this.constructor.name}: Required elements not found`);
        return;
      }

      this.bindEvents();
      this.updateStats && this.updateStats();
      this.onReady();
      this.initialized = true;
      
      console.log(`✅ ${this.constructor.name} initialized successfully`);
    } catch (error) {
      console.error(`❌ ${this.constructor.name} initialization failed:`, error);
    }
  }

  protected abstract initializeElements(): T;
  protected abstract bindEvents(): void;
  protected abstract updateStats(): void;
  protected abstract getSampleInput(): string;

  protected onReady(): void {
    // Override in subclasses if needed
  }

  protected validateElements(): boolean {
    if (!this.elements) {
      return false;
    }

    const elementValues = Object.values(this.elements);
    const missingElements = elementValues.filter(el => !el);
    
    if (missingElements.length > 0) {
      console.log(`Missing ${missingElements.length} required elements`);
      return false;
    }

    return true;
  }

  protected safeGetElement<T extends HTMLElement>(id: string): T | null {
    try {
      return document.getElementById(id) as T;
    } catch (error) {
      console.warn(`Failed to get element ${id}:`, error);
      return null;
    }
  }

  protected safeAddEventListener(
    element: HTMLElement | null,
    event: string,
    handler: (e: Event) => void
  ): void {
    if (!element) {
      console.warn(`Cannot add ${event} listener: element is null`);
      return;
    }

    try {
      element.addEventListener(event, handler);
    } catch (error) {
      console.warn(`Failed to add ${event} listener:`, error);
    }
  }

  protected showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public destroy(): void {
    this.initialized = false;
    this.elements = null;
  }
}