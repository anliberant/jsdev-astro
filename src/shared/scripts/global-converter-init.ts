(() => {
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

  // Global converter registration system
  class GlobalConverterRegistry {
    private static instance: GlobalConverterRegistry;
    private registeredInitializers: Map<string, () => void> = new Map();
    private initializedConverters: Set<string> = new Set();

    static getInstance(): GlobalConverterRegistry {
      if (!GlobalConverterRegistry.instance) {
        GlobalConverterRegistry.instance = new GlobalConverterRegistry();
      }
      return GlobalConverterRegistry.instance;
    }

    registerInitializer(name: string, initializer: () => void): void {
      if (this.initializedConverters.has(name)) {
        console.log(`Converter ${name} already initialized, skipping registration`);
        return;
      }

      this.registeredInitializers.set(name, initializer);
      console.log(`📝 Registered converter initializer: ${name}`);
    }

    initializeAll(): void {
      console.log(`🚀 Starting converter initialization...`);
      let initializedCount = 0;

      for (const [name, initializer] of this.registeredInitializers) {
        if (this.initializedConverters.has(name)) {
          continue;
        }

        try {
          initializer();
          this.initializedConverters.add(name);
          initializedCount++;
          console.log(`✅ ${name} initialized`);
        } catch (error) {
          console.error(`❌ Failed to initialize ${name}:`, error);
        }
      }

      if (initializedCount === 0) {
        console.log(`ℹ️ No converters needed for this page`);
      } else {
        console.log(`🎉 Initialized ${initializedCount} converter(s)`);
      }
    }

    isInitialized(name: string): boolean {
      return this.initializedConverters.has(name);
    }
  }

  // Make the registry available globally
  (window as any).converterRegistry = GlobalConverterRegistry.getInstance();

  // Global safe initializer function
  (window as any).safeInitializeConverter = function(
    name: string,
    requiredElements: string[],
    initFunction: () => void
  ) {
    const registry = GlobalConverterRegistry.getInstance();

    if (registry.isInitialized(name)) {
      console.log(`${name} already initialized, skipping`);
      return;
    }

    // Check if required elements exist
    const missingElements = requiredElements.filter(id => !safeElementExists(id));
    
    if (missingElements.length > 0) {
      console.log(`${name}: Missing elements [${missingElements.join(', ')}], skipping`);
      return;
    }

    registry.registerInitializer(name, initFunction);
  };

  // Auto-initialize when DOM is ready
  function startGlobalInitialization() {
    const registry = GlobalConverterRegistry.getInstance();
    
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
    if (event.filename && event.filename.includes('converter')) {
      console.warn(`Converter script error: ${event.message}`, {
        filename: event.filename,
        line: event.lineno,
        column: event.colno
      });
      // Don't propagate converter errors to prevent page breaks
      event.preventDefault();
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    (window as any).converterRegistry = null;
    (window as any).converterSystemLoaded = false;
  });

  // Start the initialization process
  startGlobalInitialization();

  console.log(`🔧 Global converter system loaded`);
})();