import { removeEmptyKeys, deepMerge, getNestedValue, objectToQueryString } from './object';

describe('Object Utils', () => {
  describe('removeEmptyKeys', () => {
    it('should remove undefined, null and empty string values', () => {
      const obj = {
        a: 1,
        b: undefined,
        c: null,
        d: '',
        e: 'value',
      };
      expect(removeEmptyKeys(obj)).toEqual({
        a: 1,
        e: 'value',
      });
    });

    it('should return empty object when all values are empty', () => {
      const obj = {
        a: undefined,
        b: null,
        c: '',
      };
      expect(removeEmptyKeys(obj)).toEqual({});
    });
  });

  describe('deepMerge', () => {
    it('should merge two objects deeply', () => {
      interface Target {
        a: number;
        b: {
          c: number;
          d: number;
        };
      }

      const target = {
        a: 1,
        b: {
          c: 2,
          d: 3,
        },
      };
      const source = {
        a: 1,
        b: {
          c: 4,
          d: 3,
        },
      };
      expect(deepMerge(target, source)).toEqual({
        a: 1,
        b: {
          c: 4,
          d: 3,
        },
      });
    });

    it('should not merge arrays', () => {
      const target = {
        a: [1, 2],
      };
      const source = {
        a: [3, 4],
      };
      expect(deepMerge(target, source)).toEqual({
        a: [3, 4],
      });
    });
  });

  describe('getNestedValue', () => {
    const obj = {
      a: {
        b: {
          c: 1,
        },
        d: 2,
      },
      e: 3,
    };

    it('should get nested value', () => {
      expect(getNestedValue(obj, 'a.b.c')).toBe(1);
      expect(getNestedValue(obj, 'a.d')).toBe(2);
      expect(getNestedValue(obj, 'e')).toBe(3);
    });

    it('should return undefined for non-existent path', () => {
      expect(getNestedValue(obj, 'a.b.x')).toBeUndefined();
      expect(getNestedValue(obj, 'x.y.z')).toBeUndefined();
    });
  });

  describe('objectToQueryString', () => {
    it('should convert object to query string', () => {
      const obj = {
        a: 1,
        b: 'test',
        c: true,
      };
      expect(objectToQueryString(obj)).toBe('a=1&b=test&c=true');
    });

    it('should ignore undefined and null values', () => {
      const obj = {
        a: 1,
        b: undefined,
        c: null,
      };
      expect(objectToQueryString(obj)).toBe('a=1');
    });

    it('should return empty string for empty object', () => {
      expect(objectToQueryString({})).toBe('');
    });
  });
});
