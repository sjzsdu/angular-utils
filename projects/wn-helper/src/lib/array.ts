/**
 * Checks if an array contains any duplicate elements.
 * @param arr The array to check for duplicates.
 * @returns True if the array contains duplicates, false otherwise.
 */
export function hasDuplicates<T>(arr: T[]): boolean {
  return new Set(arr).size !== arr.length;
}

/**
 * Returns an array of all duplicate elements in the given array.
 * @param arr The array to search for duplicates.
 * @returns An array containing all duplicate elements.
 */
export function getDuplicates<T>(arr: T[]): T[] {
  return arr.filter((item, index) => arr.indexOf(item) !== index);
}

/**
 * Removes all duplicate elements from an array.
 * @param arr The array to remove duplicates from.
 * @returns A new array with all duplicate elements removed.
 */
export function removeDuplicates<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Counts the occurrences of each element in an array.
 * @param arr The array to count occurrences in.
 * @returns A Map where keys are array elements and values are their occurrence counts.
 */
export function countOccurrences<T>(arr: T[]): Map<T, number> {
  return arr.reduce((acc, curr) => {
    acc.set(curr, (acc.get(curr) || 0) + 1);
    return acc;
  }, new Map<T, number>());
}

/**
 * Finds the most frequent element in an array.
 * @param arr The array to search for the most frequent element.
 * @returns The most frequent element in the array, or undefined if the array is empty.
 */
export function mostFrequent<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const occurrences = countOccurrences(arr);
  return Array.from(occurrences.entries()).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}
