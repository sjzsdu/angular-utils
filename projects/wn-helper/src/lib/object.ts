import { isNilStr } from './variable';

/**
 * Removes keys with undefined, null, or empty string values from an object
 * @param obj The object to process
 * @returns A new object with empty keys removed
 */
export function removeEmptyKeys<T extends object>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!isNilStr(value)) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Deep merges two objects
 * @param target The target object
 * @param source The source object
 * @returns A new object with merged properties
 */
export function deepMerge<T extends Record<string, any>, U extends Partial<T>>(target: T, source: U): T {
  const output: any = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = target[key];

    // Check if the source value is an object and the target has a corresponding key
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue;
    }
  });

  return output;
}

/**
 * Gets the nested property value of an object
 * @param obj The object to query
 * @param path The property path, separated by dots
 * @returns The property value or undefined
 */
export function getNestedValue<T extends object, K extends keyof T>(obj: T, path: string): any {
  return path.split('.').reduce((acc: any, part: string) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj);
}

/**
 * Converts an object to a query string
 * @param obj The object to convert
 * @returns The query string
 */
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}
