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
  private maxAttempts: number = 3; // Reduced from 10
  private retryDelay: number = 100; // Shorter delay

  static getInstance(): UniversalConverterManager {
    if (!UniversalConverterManager.instance) {
      UniversalConverterManager.instance = new UniversalConverterManager();
    }
    return UniversalConverterManager.instance;
  }

  registerConverter(config: ConverterConfig): void {
    // Don't register if elements don't exist
    if (!this.checkElementsExist(config.requiredElements)) {
      console.log(`${config.name}: Required elements not found, skipping registration`);
      return;
    }
    
    this.registeredConverters.set(config.name, config);
    console.log(`Registered converter: ${config.name}`);
  }

  private checkElementsExist(requiredElements: string[]): boolean {
    return requiredElements.every(id => {
      const element = document.getElementById(id);
      if (!element) {
        console.log(`Element '${id}' not found`);
        return false;
      }
      return true;
    });
  }

  private initializeConverter(config: ConverterConfig): boolean {
    try {
      console.log(`Attempting to initialize ${config.name}...`);

      // Double-check elements exist before initialization
      if (!this.checkElementsExist(config.requiredElements)) {
        console.log(`${config.name}: Required elements not found during init, skipping`);
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

    // Only proceed if we have registered converters
    if (this.registeredConverters.size === 0) {
      console.log(`ℹ️ No converters registered for this page`);
      return;
    }

    let anyInitialized = false;
    
    for (const [name, config] of this.registeredConverters) {
      if (!this.initializedConverters.has(name)) {
        const success = this.initializeConverter(config);
        if (success) {
          anyInitialized = true;
        }
      }
    }

    // Retry logic - only if we have pending converters and haven't exceeded attempts
    const pendingConverters = this.registeredConverters.size - this.initializedConverters.size;
    if (pendingConverters > 0 && this.initAttempts < this.maxAttempts) {
      console.log(`${pendingConverters} converters pending, retrying in ${this.retryDelay}ms...`);
      setTimeout(() => this.initializeAll(), this.retryDelay);
    } else if (anyInitialized || this.initializedConverters.size > 0) {
      console.log(`✅ Converter initialization complete (${this.initializedConverters.size} initialized)`);
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

  // Reset method for cleanup
  reset(): void {
    this.registeredConverters.clear();
    this.initializedConverters.clear();
    this.initAttempts = 0;
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

// Registration helper with enhanced safety
export function registerConverter(config: ConverterConfig): void {
  const manager = UniversalConverterManager.getInstance();
  
  // Enhanced element checking with retry
  const attemptRegistration = (attempts = 0) => {
    if (safeElementCheck(config.requiredElements)) {
      manager.registerConverter(config);
    } else if (attempts < 2) {
      // Retry registration after a short delay
      setTimeout(() => attemptRegistration(attempts + 1), 100);
    } else {
      console.log(`${config.name}: Elements not found after retries, skipping registration`);
    }
  };

  attemptRegistration();
}

// Enhanced safe element checker
export function safeElementCheck(elementIds: string[]): boolean {
  if (!Array.isArray(elementIds) || elementIds.length === 0) {
    console.warn('No element IDs provided for checking');
    return false;
  }

  return elementIds.every(id => {
    try {
      const element = document.getElementById(id);
      if (!element) {
        console.log(`Element '${id}' not found`);
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error checking element '${id}':`, error);
      return false;
    }
  });
}

// Helper to prevent multiple initializations with enhanced error handling
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

// Enhanced page-specific initialization
export function initializePageConverters(pageConverters: ConverterConfig[]): void {
  const manager = UniversalConverterManager.getInstance();
  
  // Reset previous state
  manager.reset();
  
  // Only register converters whose elements exist
  pageConverters.forEach(config => {
    if (safeElementCheck(config.requiredElements)) {
      manager.registerConverter(config);
    }
  });
  
  // Initialize if we have any registered converters
  if (manager.getInitializedConverters().length > 0 || manager['registeredConverters'].size > 0) {
    initializeConverters();
  }
}