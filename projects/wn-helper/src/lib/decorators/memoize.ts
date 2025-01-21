const cacheMap = new WeakMap<object, Map<string, any>>();

export function clearMemoizeCache(instance: any, methodName?: string) {
  if (!cacheMap.has(instance)) return;

  const instanceCache = cacheMap.get(instance)!;
  if (methodName) {
    instanceCache.delete(methodName);
  } else {
    cacheMap.delete(instance);
  }
}

export function memoize<T>(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]): Promise<T> {
    if (!cacheMap.has(this)) {
      cacheMap.set(this, new Map());
    }

    const instanceCache = cacheMap.get(this)!;

    if (!instanceCache.has(propertyKey)) {
      instanceCache.set(propertyKey, await originalMethod.apply(this, args));
    }

    return instanceCache.get(propertyKey);
  };

  return descriptor;
}
