/**
 * Estimates the size of an object in bytes
 * @param obj The object to measure
 * @returns An estimate of the object's size in bytes
 */
export function sizeOf(obj: unknown): number {
  const str = JSON.stringify(obj);
  return str.length * 2;
}

// Existing functions are omitted for brevity

/**
 * Creates a deep clone of an object
 * @param obj The object to clone
 * @returns A deep clone of the input object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const copy: any = {};
    Object.keys(obj).forEach((key) => {
      copy[key] = deepClone((obj as any)[key]);
    });
    return copy;
  }

  throw new Error(`Unable to copy obj! Its type isn't supported.`);
}

/**
 * Memoizes a function to cache its results
 * @param fn The function to memoize
 * @returns A memoized version of the input function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(args);
    cache.set(key, result);
    return result;
  } as T;
}
/**
 * Creates a weak reference cache
 * @returns An object with set and get methods for weak caching
 */
export function weakRefCache() {
  const cache = new Map();
  const registry = new FinalizationRegistry((key) => {
    cache.delete(key);
  });

  return {
    set(key: any, value: any) {
      const ref = new WeakRef(value);
      cache.set(key, ref);
      registry.register(value, key);
    },
    get(key: any) {
      const ref = cache.get(key);
      return ref ? ref.deref() : undefined;
    },
  };
}

/**
 * Creates an object pool for reusing objects
 * @param factory A function that creates new objects
 * @param reset A function that resets object properties
 * @returns An object with acquire and release methods
 */
export function objectPool<T>(factory: () => T, reset: (obj: T) => void) {
  const pool: T[] = [];

  return {
    acquire(): T {
      return pool.pop() || factory();
    },
    release(obj: T) {
      reset(obj);
      pool.push(obj);
    },
  };
}

/**
 * Lazily loads a large object or resource
 * @param loader A function that loads the resource
 * @returns A proxy object that loads the resource on first access
 */
export function lazyLoad<T extends object>(loader: () => T): T {
  let instance: T | null = null;

  return new Proxy({} as T, {
    get(target, prop) {
      if (!instance) {
        instance = loader();
      }
      return (instance as any)[prop];
    },
  });
}

/**
 * Compresses an object by replacing repeated values with references
 * @param obj The object to compress
 * @returns A compressed version of the object
 */
export function compressObject(obj: any): any {
  const valueMap = new Map();
  let counter = 0;

  function compress(value: any): any {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    if (valueMap.has(value)) {
      return { $ref: valueMap.get(value) };
    }

    const id = counter++;
    valueMap.set(value, id);

    if (Array.isArray(value)) {
      return value.map(compress);
    }

    const result: any = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = compress(value[key]);
      }
    }
    return result;
  }

  return compress(obj);
}

/**
 * Simple tool to detect potential memory leaks
 * @param createObject A function that creates an object to track
 * @param gcTrigger A function to trigger garbage collection (if available)
 * @returns A function to check if the object has been garbage collected
 */
export function detectMemoryLeak(createObject: () => object, gcTrigger?: () => void): () => boolean {
  const weak = new WeakRef(createObject());

  return () => {
    if (gcTrigger) {
      gcTrigger();
    }
    return weak.deref() !== undefined;
  };
}

/**
 * Attempts to trigger garbage collection (only works in certain environments)
 */
export function gcTrigger(): void {
  if (global.gc) {
    global.gc();
  } else {
    console.warn('Garbage collection is not exposed. Run Node with --expose-gc flag.');
  }
}

/**
 * Monitors memory usage and returns current statistics
 * @returns An object with memory usage statistics
 */
export function monitorMemoryUsage(): NodeJS.MemoryUsage {
  return process.memoryUsage();
}

/**
 * Serializes an object to a string
 * @param obj The object to serialize
 * @returns A string representation of the object
 */
export function serializeObject(obj: any): string {
  return JSON.stringify(obj);
}

/**
 * Deserializes a string back into an object
 * @param str The string to deserialize
 * @returns The deserialized object
 */
export function deserializeObject(str: string): any {
  return JSON.parse(str);
}

/**
 * Measures the execution time and memory usage of a function
 * @param fn The function to measure
 * @returns A function that returns the original result and performance metrics
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => {
  result: ReturnType<T>;
  metrics: { executionTime: number; memoryUsage: NodeJS.MemoryUsage };
} {
  return (...args: Parameters<T>) => {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    const result = fn(...args);

    const endTime = performance.now();
    const endMemory = process.memoryUsage();

    const executionTime = endTime - startTime;
    const memoryUsage = {
      rss: endMemory.rss - startMemory.rss,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      external: endMemory.external - startMemory.external,
      arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers,
    };

    return { result, metrics: { executionTime, memoryUsage } };
  };
}

/**
 * Creates a limited cache that evicts least recently used items when full
 * @param maxSize The maximum number of items to store in the cache
 * @returns An object with set and get methods for LRU caching
 */
export function lruCache<K, V>(maxSize: number) {
  const cache = new Map<K, V>();
  const keys: K[] = [];

  return {
    set(key: K, value: V) {
      if (cache.has(key)) {
        // Move key to the end of the array (most recently used)
        keys.splice(keys.indexOf(key), 1);
        keys.push(key);
      } else {
        if (cache.size >= maxSize) {
          // Evict the least recently used item
          const lruKey = keys.shift();
          if (lruKey !== undefined) {
            cache.delete(lruKey);
          }
        }
        keys.push(key);
      }
      cache.set(key, value);
    },
    get(key: K): V | undefined {
      if (cache.has(key)) {
        // Move key to the end of the array (most recently used)
        keys.splice(keys.indexOf(key), 1);
        keys.push(key);
        return cache.get(key);
      }
      return undefined;
    },
  };
}
