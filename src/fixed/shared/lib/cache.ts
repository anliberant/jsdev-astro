export class Cache<T> {
  private data: Map<string, { value: T; timestamp: number }> = new Map();
  private ttl: number;

  constructor(ttlInSeconds: number = 3600) {
    this.ttl = ttlInSeconds * 1000;
  }

  set(key: string, value: T): void {
    this.data.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | undefined {
    const item = this.data.get(key);

    if (!item) {
      return undefined;
    }

    if (Date.now() - item.timestamp > this.ttl) {
      this.data.delete(key);
      return undefined;
    }

    return item.value;
  }

  has(key: string): boolean {
    const value = this.get(key);
    return value !== undefined;
  }

  clear(): void {
    this.data.clear();
  }

  delete(key: string): boolean {
    return this.data.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.data.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.data.delete(key);
      }
    }
  }
}

export const converterCache = new Cache<string>(300); 
export const categoryCache = new Cache<any>(3600); 
export const tagCache = new Cache<any>(3600);
