interface ConverterConfig {
  name: string;
  requiredElements: string[];
  initFunction: () => void;
  priority?: number; // Higher priority runs first
}

class GlobalConverterManager {
  private static instance: GlobalConverterManager;
  private converters: Map<string, ConverterConfig> = new Map();
  private initialized: Set<string> = new Set();
  private isInitializing = false;
  private initializationComplete = false;
  
  static getInstance(): GlobalConverterManager {
    if (!GlobalConverterManager.instance) {
      GlobalConverterManager.instance = new GlobalConverterManager();
    }
    return GlobalConverterManager.instance;
  }

  // Register a converter with its requirements
  register(config: ConverterConfig): void {
    if (this.initializationComplete) {
      console.warn(`Cannot register ${config.name}: initialization already complete`);
      return;
    }

    this.converters.set(config.name, {
      ...config,
      priority: config.priority || 0
    });
    
    console.log(`📝 Registered converter: ${config.name}`);
  }

  // Check if all required elements exist for a converter
  private canInitialize(config: ConverterConfig): boolean {
    const missing = config.requiredElements.filter(id => !this.elementExists(id));
    
    if (missing.length > 0) {
      console.log(`${config.name}: Missing elements [${missing.join(', ')}]`);
      return false;
    }
    
    return true;
  }

  // Safe element existence check
  private elementExists(id: string): boolean {
    try {
      const element = document.getElementById(id);
      return element !== null;
    } catch (error) {
      console.warn(`Error checking element ${id}:`, error);
      return false;
    }
  }

  // Initialize all registered converters
  async initializeAll(): Promise<void> {
    if (this.isInitializing || this.initializationComplete) {
      return;
    }

    this.isInitializing = true;
    console.log('🚀 Starting global converter initialization...');

    try {
      // Sort converters by priority (higher first)
      const sortedConverters = Array.from(this.converters.entries())
        .sort(([, a], [, b]) => (b.priority || 0) - (a.priority || 0));

      let initCount = 0;

      for (const [name, config] of sortedConverters) {
        if (this.initialized.has(name)) {
          continue;
        }

        if (this.canInitialize(config)) {
          try {
            console.log(`⚡ Initializing ${name}...`);
            config.initFunction();
            this.initialized.add(name);
            initCount++;
            console.log(`✅ ${name} initialized successfully`);
            
            // Small delay between initializations to prevent conflicts
            await this.delay(10);
          } catch (error) {
            console.error(`❌ Failed to initialize ${name}:`, error);
          }
        }
      }

      this.initializationComplete = true;
      
      if (initCount === 0) {
        console.log('ℹ️ No converters needed for this page');
      } else {
        console.log(`🎉 Successfully initialized ${initCount} converter(s)`);
      }
    } finally {
      this.isInitializing = false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if a converter is initialized
  isInitialized(name: string): boolean {
    return this.initialized.has(name);
  }

  // Get initialization stats
  getStats(): { registered: number; initialized: number; complete: boolean } {
    return {
      registered: this.converters.size,
      initialized: this.initialized.size,
      complete: this.initializationComplete
    };
  }

  // Reset for testing purposes
  reset(): void {
    this.converters.clear();
    this.initialized.clear();
    this.isInitializing = false;
    this.initializationComplete = false;
  }
}

// Global instance
const globalManager = GlobalConverterManager.getInstance();

// Public API
export function registerConverter(config: ConverterConfig): void {
  globalManager.register(config);
}

export function initializeConverters(): void {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => globalManager.initializeAll(), 50);
    });
  } else {
    setTimeout(() => globalManager.initializeAll(), 50);
  }
}

export function isConverterInitialized(name: string): boolean {
  return globalManager.isInitialized(name);
}

export function getInitializationStats() {
  return globalManager.getStats();
}

// Safe converter registration helper
export function safeRegisterConverter(
  name: string,
  requiredElements: string[],
  initFunction: () => void,
  priority = 0
): void {
  // Check if we're on the right page before registering
  const hasAnyElement = requiredElements.some(id => {
    try {
      return document.getElementById(id) !== null;
    } catch {
      return false;
    }
  });

  if (!hasAnyElement) {
    console.log(`${name}: No required elements found, skipping registration`);
    return;
  }

  registerConverter({
    name,
    requiredElements,
    initFunction,
    priority
  });
}

// Prevent multiple initialization attempts
let initializationStarted = false;

export function startGlobalInitialization(): void {
  if (initializationStarted) {
    return;
  }
  
  initializationStarted = true;
  initializeConverters();
}

// Auto-start when this module loads (if in browser)
if (typeof window !== 'undefined') {
  // Add global error handler for converter errors
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('converter')) {
      console.warn(`Converter error caught:`, {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno
      });
      // Prevent error from breaking other scripts
      event.preventDefault();
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    globalManager.reset();
    initializationStarted = false;
  });

  // Auto-start initialization
  startGlobalInitialization();
}

// For debugging
if (typeof window !== 'undefined') {
  (window as any).converterManager = globalManager;
}