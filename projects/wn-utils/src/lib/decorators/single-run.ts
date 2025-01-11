import { isAsyncFunction } from '../variable';

/**
 * A decorator that ensures a method is only executed once.
 * If the method is called again while it is still running, the subsequent calls will be ignored.
 *
 * @param target - The prototype of the class containing the method.
 * @param propertyKey - The name of the method being decorated.
 * @param descriptor - The descriptor of the method being decorated.
 * @returns The modified descriptor with the method wrapped to ensure single execution.
 */
export function singletonRun() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const lockProperty = Symbol('isLocked');

    if (isAsyncFunction(originalMethod)) {
      console.log('You should use single run in a async function!');
      return descriptor;
    }

    descriptor.value = async function (this: any, ...args: unknown[]) {
      if (this[lockProperty]) {
        return;
      }

      this[lockProperty] = true;

      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        throw error;
      } finally {
        this[lockProperty] = false;
      }
    };

    return descriptor;
  };
}
