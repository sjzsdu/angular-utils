import { hasDuplicates, getDuplicates, removeDuplicates, countOccurrences, mostFrequent } from './array';

describe('Array Utils', () => {
  describe('hasDuplicates', () => {
    it('should return true for arrays with duplicates', () => {
      expect(hasDuplicates([1, 2, 3, 1])).toBe(true);
      expect(hasDuplicates(['a', 'b', 'a'])).toBe(true);
    });

    it('should return false for arrays without duplicates', () => {
      expect(hasDuplicates([1, 2, 3])).toBe(false);
      expect(hasDuplicates([])).toBe(false);
    });
  });

  describe('getDuplicates', () => {
    it('should return array of duplicate elements', () => {
      expect(getDuplicates([1, 2, 3, 1, 2])).toEqual([1, 2]);
      expect(getDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a']);
    });

    it('should return empty array when no duplicates exist', () => {
      expect(getDuplicates([1, 2, 3])).toEqual([]);
      expect(getDuplicates([])).toEqual([]);
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate elements', () => {
      expect(removeDuplicates([1, 2, 3, 1, 2])).toEqual([1, 2, 3]);
      expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should return same array when no duplicates exist', () => {
      expect(removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
      expect(removeDuplicates([])).toEqual([]);
    });
  });

  describe('countOccurrences', () => {
    it('should count occurrences of each element', () => {
      const counts = countOccurrences([1, 2, 3, 1, 2, 1]);
      expect(counts.get(1)).toBe(3);
      expect(counts.get(2)).toBe(2);
      expect(counts.get(3)).toBe(1);
    });

    it('should return empty map for empty array', () => {
      const counts = countOccurrences([]);
      expect(counts.size).toBe(0);
    });
  });

  describe('mostFrequent', () => {
    it('should return most frequent element', () => {
      expect(mostFrequent([1, 2, 3, 1, 2, 1])).toBe(1);
      expect(mostFrequent(['a', 'b', 'a', 'c'])).toBe('a');
    });

    it('should return undefined for empty array', () => {
      expect(mostFrequent([])).toBeUndefined();
    });

    it('should return first element when all have same frequency', () => {
      expect(mostFrequent([1, 2, 3])).toBe(1);
      expect(mostFrequent(['a', 'b', 'c'])).toBe('a');
    });
  });
});
