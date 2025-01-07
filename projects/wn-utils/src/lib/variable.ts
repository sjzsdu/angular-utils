/**
 * Utility functions for type checking and validation
 */

/**
 * Check if value is a string
 * @param value - The value to check
 * @returns True if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if value is a number
 * @param value - The value to check
 * @returns True if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is a boolean
 * @param value - The value to check
 * @returns True if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if value is an object (excluding null and arrays)
 * @param value - The value to check
 * @returns True if value is a plain object
 */
export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check if value is an array
 * @param value - The value to check
 * @returns True if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Check if value is a function
 * @param value - The value to check
 * @returns True if value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Check if value is a Date object
 * @param value - The value to check
 * @returns True if value is a Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

/**
 * Check if value is a RegExp
 * @param value - The value to check
 * @returns True if value is a RegExp
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

/**
 * Check if value is null
 * @param value - The value to check
 * @returns True if value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Check if value is undefined
 * @param value - The value to check
 * @returns True if value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Check if value is null or undefined
 * @param value - The value to check
 * @returns True if value is null or undefined
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if value is a primitive type (string, number, boolean, null, undefined)
 * @param value - The value to check
 * @returns True if value is a primitive
 */
export function isPrimitive(value: unknown): boolean {
  return (
    isString(value) ||
    isNumber(value) ||
    isBoolean(value) ||
    isNull(value) ||
    isUndefined(value)
  );
}

/**
 * Type guard for checking if value is a specific type using constructor
 * @param value - The value to check
 * @param constructor - The constructor function to check against
 * @returns True if value is instance of constructor
 */
export function isInstanceOf<T>(
  value: unknown,
  constructor: new (...args: any[]) => T
): value is T {
  return value instanceof constructor;
}

/**
 * Check if value is a Promise
 * @param value - The value to check
 * @returns True if value is a Promise
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return (
    value instanceof Promise ||
    (typeof value === 'object' &&
      value !== null &&
      typeof (value as any).then === 'function' &&
      typeof (value as any).catch === 'function')
  );
}


export function isAsyncFunction(fn: Function): boolean {
  return isFunction(fn) && fn instanceof (async function() {}).constructor;
}
