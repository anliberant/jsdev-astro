export class LazyToolLoader {
  private static loadedTools = new Set<string>();
  private static loadingPromises = new Map<string, Promise<any>>();

  static async loadTool(toolName: string, importPath: string, className: string): Promise<any> {
    if (this.loadedTools.has(toolName)) {
      console.log(`Tool ${toolName} already loaded`);
      return;
    }

    if (this.loadingPromises.has(toolName)) {
      console.log(`Tool ${toolName} is already loading, waiting...`);
      return this.loadingPromises.get(toolName);
    }

    const loadingPromise = this.performLoad(toolName, importPath, className);
    this.loadingPromises.set(toolName, loadingPromise);

    try {
      const result = await loadingPromise;
      this.loadedTools.add(toolName);
      this.loadingPromises.delete(toolName);
      return result;
    } catch (error) {
      this.loadingPromises.delete(toolName);
      throw error;
    }
  }

  private static async performLoad(toolName: string, importPath: string, className: string): Promise<any> {
    console.log(`🔄 Loading tool: ${toolName}`);
    
    try {
      const startTime = performance.now();
      const module = await import(importPath);
      const loadTime = performance.now() - startTime;
      
      console.log(`📦 Tool ${toolName} module loaded in ${loadTime.toFixed(2)}ms`);
      
      if (!module[className]) {
        throw new Error(`Class ${className} not found in module ${importPath}`);
      }

      const controller = new module[className]();
      console.log(`✅ Tool ${toolName} initialized successfully`);
      
      return controller;
    } catch (error) {
      console.error(`❌ Failed to load tool ${toolName}:`, error);
      throw error;
    }
  }

  static isLoaded(toolName: string): boolean {
    return this.loadedTools.has(toolName);
  }

  static isLoading(toolName: string): boolean {
    return this.loadingPromises.has(toolName);
  }

  static getLoadedTools(): string[] {
    return Array.from(this.loadedTools);
  }

  static preloadTool(toolName: string, importPath: string): void {
    if (!this.loadedTools.has(toolName) && !this.loadingPromises.has(toolName)) {
      import(importPath)
        .then(() => {
          console.log(`🔄 Preloaded tool module: ${toolName}`);
        })
        .catch(error => {
          console.warn(`⚠️ Failed to preload tool ${toolName}:`, error);
        });
    }
  }
}