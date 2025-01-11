/**
 * JSON utility functions
 */

/**
 * Safely parse a JSON string
 * @param jsonString - The JSON string to parse
 * @returns The parsed object, or null if parsing fails
 */
export function safeParseJSON(jsonString: string): any | null {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
}

/**
 * Deep clone a JSON object
 * @param obj - The object to clone
 * @returns A new object that is a deep clone of the input
 */
export function deepCloneJSON<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge multiple JSON objects
 * @param objects - An array of objects to merge
 * @returns A new object that combines all input objects
 */
export function mergeJSONObjects(...objects: object[]): object {
  return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}

/**
 * Safely get a nested property value from an object
 * @param obj - The object to retrieve the property from
 * @param path - The property path, separated by dots
 * @param defaultValue - The default value to return if the property doesn't exist
 * @returns The property value or the default value
 */
export function safeGetNestedValue(obj: any, path: string, defaultValue: any = undefined): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? defaultValue;
}

/**
 * Flatten a nested JSON object
 * @param obj - The object to flatten
 * @param prefix - The prefix for flattened keys
 * @returns A flattened object with dot-separated keys
 */
export function flattenJSON(obj: Record<string, any>, prefix: string = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenJSON(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
}

/**
 * Validate JSON structure against a schema
 * @param json - The JSON object to validate
 * @param schema - The schema to validate against
 * @returns True if valid, false otherwise
 */
export function validateJSONSchema(json: any, schema: object): boolean {
  // This is a simplified version. For production use, consider using a library like Ajv
  try {
    const ajv = new (require('ajv'))();
    const validate = ajv.compile(schema);
    return validate(json);
  } catch (error) {
    console.error('JSON schema validation error:', error);
    return false;
  }
}

/**
 * Compare two JSON objects and return their differences
 * @param obj1 - The first object to compare
 * @param obj2 - The second object to compare
 * @returns An object representing the differences
 */
export function compareJSON(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj1) {
    if (!(key in obj2)) {
      result[key] = { type: 'removed', value: obj1[key] };
    } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
      result[key] = { type: 'changed', oldValue: obj1[key], newValue: obj2[key] };
    }
  }
  for (const key in obj2) {
    if (!(key in obj1)) {
      result[key] = { type: 'added', value: obj2[key] };
    }
  }
  return result;
}

/**
 * Filter properties of a JSON object
 * @param obj - The object to filter
 * @param predicate - A function that returns true for properties to keep
 * @returns A new object with filtered properties
 */
export function filterJSONProperties(obj: object, predicate: (key: string, value: any) => boolean): object {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(key, value)));
}

/**
 * Format a JSON string for pretty printing
 * @param json - The JSON string or object to format
 * @param spaces - The number of spaces to use for indentation
 * @returns A formatted JSON string
 */
export function formatJSON(json: string | object, spaces: number = 2): string {
  const obj = typeof json === 'string' ? JSON.parse(json) : json;
  return JSON.stringify(obj, null, spaces);
}

/**
 * Compress a JSON string by removing whitespace
 * @param json - The JSON string to compress
 * @returns A compressed JSON string
 */
export function compressJSON(json: string): string {
  return JSON.stringify(JSON.parse(json));
}
