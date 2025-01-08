
/**
 * Format number as currency string
 * @param value - number to format
 * @param currency - currency symbol (default: '¥')
 * @returns formatted currency string
 */
export function formatCurrency(value: number, currency = '¥'): string {
  return `${currency}${value.toFixed(2)}`;
}

/**
 * Convert string to camelCase
 * @param str - string to convert
 * @returns camelCase string
 */
export function toCamelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

/**
 * Convert string to kebab-case
 * @param str - string to convert
 * @returns kebab-case string
 */
export function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Validate email format
 * @param str - string to validate
 * @returns true if valid email format
 */
export function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

/**
 * Validate phone number format (China)
 * @param str - string to validate
 * @returns true if valid phone number format
 */
export function isPhoneNumber(str: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(str);
}

/**
 * Truncate string with ellipsis
 * @param str - string to truncate
 * @param length - max length of string
 * @returns truncated string
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

/**
 * Reverse a string
 * @param str - string to reverse
 * @returns reversed string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Encode string to base64
 * @param str - string to encode
 * @returns base64 encoded string
 */
export function base64Encode(str: string): string {
  return Buffer.from(str).toString('base64');
}

/**
 * Decode base64 string
 * @param str - base64 string to decode
 * @returns decoded string
 */
export function base64Decode(str: string): string {
  return Buffer.from(str, 'base64').toString('utf8');
}
