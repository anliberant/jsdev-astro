export interface ConverterConfig {
  name: string;
  requiredElements: string[];
  controllerClass: any;
  initFunction?: () => void;
}

class UniversalConverterManager {
  private static instance: UniversalConverterManager;
  private registeredConverters: Map<string, ConverterConfig> = new Map();
  private initializedConverters: Set<string> = new Set();
  private initAttempts: number = 0;
  private maxAttempts: number = 10;

  static getInstance(): UniversalConverterManager {
    if (!UniversalConverterManager.instance) {
      UniversalConverterManager.instance = new UniversalConverterManager();
    }
    return UniversalConverterManager.instance;
  }

  registerConverter(config: ConverterConfig): void {
    this.registeredConverters.set(config.name, config);
    console.log(`Registered converter: ${config.name}`);
  }

  private checkElementsExist(requiredElements: string[]): boolean {
    return requiredElements.every(id => {
      const element = document.getElementById(id);
      return element !== null;
    });
  }

  private initializeConverter(config: ConverterConfig): boolean {
    try {
      console.log(`Attempting to initialize ${config.name}...`);

      if (!this.checkElementsExist(config.requiredElements)) {
        console.log(`${config.name}: Required elements not found, skipping`);
        return false;
      }

      if (config.initFunction) {
        config.initFunction();
      } else if (config.controllerClass) {
        new config.controllerClass();
      }

      this.initializedConverters.add(config.name);
      console.log(`✅ ${config.name} initialized successfully`);
      
      // Store reference globally for debugging
      if (typeof window !== 'undefined') {
        (window as any)[`${config.name}Initialized`] = true;
      }

      return true;
    } catch (error) {
      console.error(`❌ Error initializing ${config.name}:`, error);
      return false;
    }
  }

  initializeAll(): void {
    this.initAttempts++;
    console.log(`🔄 Universal Converter Init Attempt ${this.initAttempts}`);

    let anyInitialized = false;
    
    for (const [name, config] of this.registeredConverters) {
      if (!this.initializedConverters.has(name)) {
        const success = this.initializeConverter(config);
        if (success) {
          anyInitialized = true;
        }
      }
    }

    // If no converters were found and we haven't exceeded max attempts, try again
    if (!anyInitialized && this.initAttempts < this.maxAttempts) {
      console.log(`No converters initialized, retrying in 200ms...`);
      setTimeout(() => this.initializeAll(), 200);
    } else if (anyInitialized) {
      console.log(`✅ Converter initialization complete`);
    } else {
      console.log(`ℹ️ No converters found for this page`);
    }
  }

  getInitializedConverters(): string[] {
    return Array.from(this.initializedConverters);
  }

  isConverterInitialized(name: string): boolean {
    return this.initializedConverters.has(name);
  }
}

// Global initialization function
export function initializeConverters(): void {
  const manager = UniversalConverterManager.getInstance();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => manager.initializeAll(), 50);
    });
  } else {
    setTimeout(() => manager.initializeAll(), 50);
  }
}

// Registration helper
export function registerConverter(config: ConverterConfig): void {
  const manager = UniversalConverterManager.getInstance();
  manager.registerConverter(config);
}

// Safe element checker - can be used by individual converters
export function safeElementCheck(elementIds: string[]): boolean {
  return elementIds.every(id => {
    const element = document.getElementById(id);
    if (!element) {
      console.log(`Element '${id}' not found`);
      return false;
    }
    return true;
  });
}

// Helper to prevent multiple initializations
export function createSafeInitializer(
  converterName: string,
  requiredElements: string[],
  initFunction: () => void
): () => void {
  return () => {
    const manager = UniversalConverterManager.getInstance();
    
    if (manager.isConverterInitialized(converterName)) {
      console.log(`${converterName} already initialized, skipping`);
      return;
    }

    if (!safeElementCheck(requiredElements)) {
      console.log(`${converterName}: Required elements not found, skipping initialization`);
      return;
    }

    try {
      initFunction();
      console.log(`✅ ${converterName} initialized successfully`);
    } catch (error) {
      console.error(`❌ Error initializing ${converterName}:`, error);
    }
  };
}