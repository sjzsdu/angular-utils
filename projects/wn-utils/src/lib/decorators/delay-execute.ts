/**
 * Delays the execution of a method by the specified time
 * @param delayTime - Time in milliseconds to delay execution
 */
export function DelayExecute(delayTime: number): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(originalMethod.apply(this, args));
        }, delayTime);
      });
    };

    return descriptor;
  };
}
