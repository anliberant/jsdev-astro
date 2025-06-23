export class SafeToolInitializer {
  private static activeTools = new Set<string>();
  
  static registerTool(
    toolName: string,
    requiredElements: string[],
    initFunction: () => void,
    options: {
      urlPattern?: string;
      priority?: number;
      timeout?: number;
    } = {}
  ) {
    const {
      urlPattern,
      priority = 0,
      timeout = 5000
    } = options;

    if (urlPattern && !window.location.pathname.includes(urlPattern)) {
      console.log(`Tool ${toolName}: URL pattern doesn't match, skipping`);
      return;
    }

    if (this.activeTools.has(toolName)) {
      console.log(`Tool ${toolName}: Already registered, skipping`);
      return;
    }

    const missingElements = requiredElements.filter(id => {
      try {
        return !document.getElementById(id);
      } catch {
        return true;
      }
    });

    if (missingElements.length > 0) {
      console.log(`Tool ${toolName}: Missing elements [${missingElements.join(', ')}], skipping`);
      return;
    }

    try {
      console.log(`Tool ${toolName}: Initializing...`);
      initFunction();
      this.activeTools.add(toolName);
      console.log(`✅ Tool ${toolName}: Successfully initialized`);
    } catch (error) {
      console.error(`❌ Tool ${toolName}: Initialization failed:`, error);
    }
  }

  static safeExecute<T>(
    toolName: string,
    operation: () => T,
    fallback?: T
  ): T | undefined {
    if (!this.activeTools.has(toolName)) {
      console.warn(`Tool ${toolName} is not active`);
      return fallback;
    }

    try {
      return operation();
    } catch (error) {
      console.error(`Error in tool ${toolName}:`, error);
      return fallback;
    }
  }

  static isToolActive(toolName: string): boolean {
    return this.activeTools.has(toolName);
  }

  static getActiveTools(): string[] {
    return Array.from(this.activeTools);
  }

  static reset(): void {
    this.activeTools.clear();
  }
}

export abstract class SafeBaseConverterController<T> {
  protected elements: T | null = null;
  private isInitialized: boolean = false;
  private converterName: string;
  private toolRouter: ToolRouter;

  constructor(converterName: string, private toolKey: string) {
    this.converterName = converterName;
    this.toolRouter = ToolRouter.getInstance();
    
    // Инициализируем только если мы на правильной странице
    if (this.shouldInitialize()) {
      this.delayedInit();
    } else {
      console.log(`${this.converterName}: Not on the correct page, skipping`);
    }
  }

  protected abstract getRequiredElementIds(): string[];
  protected abstract initializeElements(): T;
  protected abstract bindEvents(): void;

  private shouldInitialize(): boolean {
    // Проверяем, что мы на странице этого тулза
    if (!this.toolRouter.isCurrentTool(this.toolKey)) {
      return false;
    }

    // Проверяем наличие всех обязательных элементов
    const requiredIds = this.getRequiredElementIds();
    return requiredIds.every(id => {
      try {
        return document.getElementById(id) !== null;
      } catch {
        return false;
      }
    });
  }

  protected delayedInit(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attemptInit());
    } else {
      setTimeout(() => this.attemptInit(), 100);
    }
  }

  private attemptInit(): void {
    try {
      if (!this.shouldInitialize()) {
        console.log(`${this.converterName}: Conditions not met, aborting`);
        return;
      }

      this.elements = this.initializeElements();
      
      if (this.validateElements()) {
        this.bindEvents();
        this.isInitialized = true;
        this.onInitialized();
        console.log(`✅ ${this.converterName} initialized successfully`);
      } else {
        throw new Error('Element validation failed');
      }
    } catch (error) {
      console.error(`❌ ${this.converterName} initialization failed:`, error);
    }
  }

  protected validateElements(): boolean {
    return this.elements !== null;
  }

  protected onInitialized(): void {
    // Hook для подклассов
  }

  protected safeGetElement<E extends HTMLElement>(id: string): E | null {
    try {
      return document.getElementById(id) as E | null;
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
    if (!element) return;
    
    try {
      element.addEventListener(event, handler);
    } catch (error) {
      console.error(`Error adding event listener:`, error);
    }
  }

  public isReady(): boolean {
    return this.isInitialized && this.elements !== null;
  }
}