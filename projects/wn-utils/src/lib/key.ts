/**
 * Generates a unique string key
 * @returns A unique string key
 */
export function generateUniqueKey(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Generates a unique numeric key of specified length
 * @param length The length of the key
 * @returns A unique numeric key
 */
export function generateUniqueNumericKey(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

/**
 * Generates a UUID (Universally Unique Identifier)
 * @returns A UUID string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
