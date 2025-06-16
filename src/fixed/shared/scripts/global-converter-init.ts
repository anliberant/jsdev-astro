(() => {
  // Prevent multiple loading
  if ((window as any).converterSystemLoaded) {
    return;
  }
  (window as any).converterSystemLoaded = true;

  // Enhanced element existence checker
  function safeElementExists(id: string): boolean {
    try {
      const element = document.getElementById(id);
      return element !== null && element !== undefined;
    } catch (error) {
      console.warn(`Error checking element ${id}:`, error);
      return false;
    }
  }

  // Check if multiple elements exist
  function allElementsExist(elementIds: string[]): boolean {
    return elementIds.every(id => safeElementExists(id));
  }

  // Global converter registration system
  class GlobalConverterRegistry {
    private static instance: GlobalConverterRegistry;
    private registeredInitializers: Map<string, { 
      initializer: () => void; 
      requiredElements: string[] 
    }> = new Map();
    private initializedConverters: Set<string> = new Set();
    private maxRetries: number = 3;
    private retryDelay: number = 200;

    static getInstance(): GlobalConverterRegistry {
      if (!GlobalConverterRegistry.instance) {
        GlobalConverterRegistry.instance = new GlobalConverterRegistry();
      }
      return GlobalConverterRegistry.instance;
    }

    registerInitializer(
      name: string, 
      initializer: () => void, 
      requiredElements: string[] = []
    ): void {
      if (this.initializedConverters.has(name)) {
        console.log(`Converter ${name} already initialized, skipping registration`);
        return;
      }

      // Only register if elements exist or no elements required
      if (requiredElements.length === 0 || allElementsExist(requiredElements)) {
        this.registeredInitializers.set(name, { initializer, requiredElements });
        console.log(`📝 Registered converter initializer: ${name}`);
      } else {
        console.log(`${name}: Required elements not found, skipping registration`);
      }
    }

    private async initializeConverter(
      name: string, 
      config: { initializer: () => void; requiredElements: string[] },
      retryCount: number = 0
    ): Promise<boolean> {
      try {
        // Check elements exist before initialization
        if (config.requiredElements.length > 0 && !allElementsExist(config.requiredElements)) {
          if (retryCount < this.maxRetries) {
            console.log(`${name}: Elements not ready, retrying in ${this.retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            return this.initializeConverter(name, config, retryCount + 1);
          } else {
            console.log(`${name}: Elements not found after ${this.maxRetries} retries, skipping`);
            return false;
          }
        }

        config.initializer();
        this.initializedConverters.add(name);
        console.log(`✅ ${name} initialized`);
        return true;
      } catch (error) {
        console.error(`❌ Failed to initialize ${name}:`, error);
        return false;
      }
    }

    async initializeAll(): Promise<void> {
      console.log(`🚀 Starting converter initialization...`);
      
      if (this.registeredInitializers.size === 0) {
        console.log(`ℹ️ No converters registered for this page`);
        return;
      }

      let initializedCount = 0;
      const initPromises: Promise<boolean>[] = [];

      for (const [name, config] of this.registeredInitializers) {
        if (this.initializedConverters.has(name)) {
          continue;
        }

        initPromises.push(this.initializeConverter(name, config));
      }

      const results = await Promise.all(initPromises);
      initializedCount = results.filter(Boolean).length;

      if (initializedCount === 0) {
        console.log(`ℹ️ No converters needed for this page`);
      } else {
        console.log(`🎉 Initialized ${initializedCount} converter(s)`);
      }
    }

    isInitialized(name: string): boolean {
      return this.initializedConverters.has(name);
    }

    reset(): void {
      this.registeredInitializers.clear();
      this.initializedConverters.clear();
    }

    getStats(): { registered: number; initialized: number } {
      return {
        registered: this.registeredInitializers.size,
        initialized: this.initializedConverters.size
      };
    }
  }

  // Make the registry available globally
  const registry = GlobalConverterRegistry.getInstance();
  (window as any).converterRegistry = registry;

  // Enhanced global safe initializer function
  (window as any).safeInitializeConverter = function(
    name: string,
    requiredElements: string[],
    initFunction: () => void
  ) {
    if (registry.isInitialized(name)) {
      console.log(`${name} already initialized, skipping`);
      return;
    }

    // Validate inputs
    if (!name || typeof initFunction !== 'function') {
      console.error('Invalid parameters for converter initialization');
      return;
    }

    // Ensure requiredElements is an array
    const elements = Array.isArray(requiredElements) ? requiredElements : [];

    registry.registerInitializer(name, initFunction, elements);
  };

  // Page-specific initialization function
  (window as any).initializePageConverters = function(converterConfigs: Array<{
    name: string;
    requiredElements: string[];
    initFunction: () => void;
  }>) {
    // Reset registry for new page
    registry.reset();
    
    // Register only relevant converters
    converterConfigs.forEach(config => {
      if (config.name && typeof config.initFunction === 'function') {
        registry.registerInitializer(
          config.name, 
          config.initFunction, 
          config.requiredElements || []
        );
      }
    });
    
    // Start initialization
    startGlobalInitialization();
  };

  // Auto-initialize when DOM is ready
  function startGlobalInitialization() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => registry.initializeAll(), 100);
      });
    } else {
      setTimeout(() => registry.initializeAll(), 100);
    }
  }

  // Enhanced error handling for converter scripts
  window.addEventListener('error', (event) => {
    if (event.filename && 
        (event.filename.includes('converter') || 
         event.filename.includes('tool') || 
         event.message.includes('Cannot read properties of null'))) {
      console.warn(`Converter script error prevented:`, {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno
      });
      // Prevent converter errors from breaking the page
      event.preventDefault();
      return false;
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    registry?.reset();
    (window as any).converterRegistry = null;
    (window as any).converterSystemLoaded = false;
  });

  // Debug function for troubleshooting
  (window as any).debugConverters = function() {
    const stats = registry.getStats();
    console.log('Converter Debug Info:', {
      stats,
      initialized: Array.from(registry['initializedConverters']),
      registered: Array.from(registry['registeredInitializers'].keys())
    });
  };

  // Only start auto-initialization if we have a basic page structure
  if (document.body) {
    startGlobalInitialization();
  }

  console.log(`🔧 Global converter system loaded`);
})();