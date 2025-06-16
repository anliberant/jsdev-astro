export interface ConverterInitOptions {
  requiredElements: string[];
  maxAttempts?: number;
  retryDelay?: number;
  timeout?: number;
  onSuccess?: (controller: any) => void;
  onError?: (error: Error) => void;
  debug?: boolean;
}

export interface ConverterController {
  new (): any;
}

export class ConverterInitializer {
  private static instances = new Map<string, any>();
  
  static async initialize<T>(
    name: string,
    ControllerClass: ConverterController,
    options: ConverterInitOptions
  ): Promise<T | null> {
    const {
      requiredElements,
      maxAttempts = 20,
      retryDelay = 100,
      timeout = 5000,
      onSuccess,
      onError,
      debug = false
    } = options;

    if (this.instances.has(name)) {
      if (debug) // removed log: console.log(`${name} already initialized`);
      return this.instances.get(name);
    }

    const startTime = Date.now();
    let attempts = 0;

    const log = (message: string) => {
      if (debug) // removed log: console.log(`[${name}] ${message}`);
    };

    const checkElements = (): boolean => {
      for (const elementId of requiredElements) {
        const element = document.getElementById(elementId);
        if (!element) {
          log(`Missing element: ${elementId}`);
          return false;
        }
      }
      return true;
    };

    const attemptInitialization = (): Promise<T | null> => {
      return new Promise((resolve) => {
        attempts++;
        log(`Attempt ${attempts}/${maxAttempts}`);

        if (Date.now() - startTime > timeout) {
          const error = new Error(`Initialization timeout after ${timeout}ms`);
          log(`Timeout reached`);
          onError?.(error);
          resolve(null);
          return;
        }

        if (!checkElements()) {
          if (attempts >= maxAttempts) {
            const error = new Error(`Failed to find all required elements after ${maxAttempts} attempts`);
            log(`Max attempts reached`);
            onError?.(error);
            resolve(null);
            return;
          }

          setTimeout(() => {
            attemptInitialization().then(resolve);
          }, retryDelay);
          return;
        }

        try {
          log('All elements found, creating controller...');
          const controller = new ControllerClass();
          
          this.instances.set(name, controller);
          
          log('Controller created successfully');
          onSuccess?.(controller);
          resolve(controller);
        } catch (error) {
          log(`Error creating controller: ${error}`);
          
          if (attempts < maxAttempts) {
            setTimeout(() => {
              attemptInitialization().then(resolve);
            }, retryDelay * 2);
          } else {
            onError?.(error as Error);
            resolve(null);
          }
        }
      });
    };

    await this.waitForDOM();
    return attemptInitialization();
  }

  private static waitForDOM(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve());
      } else {
        requestAnimationFrame(() => {
          setTimeout(resolve, 0);
        });
      }
    });
  }

  static getInstance<T>(name: string): T | null {
    return this.instances.get(name) || null;
  }

  static destroy(name: string): void {
    const instance = this.instances.get(name);
    if (instance && typeof instance.destroy === 'function') {
      instance.destroy();
    }
    this.instances.delete(name);
  }

  static destroyAll(): void {
    for (const [name] of this.instances) {
      this.destroy(name);
    }
  }

  static async waitForElement(
    elementId: string, 
    maxAttempts = 10, 
    retryDelay = 100
  ): Promise<HTMLElement | null> {
    for (let i = 0; i < maxAttempts; i++) {
      const element = document.getElementById(elementId);
      if (element) return element;
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
    return null;
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

export function initializeConverter<T>(
  name: string,
  ControllerClass: ConverterController,
  requiredElements: string[],
  debug = false
): Promise<T | null> {
  return ConverterInitializer.initialize<T>(name, ControllerClass, {
    requiredElements,
    debug,
    onSuccess: (controller) => {
      if (debug) {
        // removed log: console.log(`${name} initialized successfully`);
        if (typeof window !== 'undefined') {
          (window as any)[`${name}Controller`] = controller;
        }
      }
    },
    onError: (error) => {
      // removed log: console.error(`Failed to initialize ${name}:`, error);
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    ConverterInitializer.destroyAll();
  });
}