const debounceMap = new WeakMap();
export function debounceExecute(ms: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const context = this;

      if (!debounceMap.has(context)) {
        debounceMap.set(context, {});
      }

      const contextMap = debounceMap.get(context);

      if (contextMap[propertyKey]) {
        clearTimeout(contextMap[propertyKey]);
      }

      const timeoutId = setTimeout(async () => {
        try {
          await originalMethod.apply(context, args);
        } catch (error) {
          console.error(`Error in debounced method ${propertyKey}:`, error);
        } finally {
          delete contextMap[propertyKey];
        }
      }, ms);

      contextMap[propertyKey] = timeoutId;
    };
  };
}
