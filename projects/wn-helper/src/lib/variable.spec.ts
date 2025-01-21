import {
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isDate,
  isRegExp,
  isNull,
  isUndefined,
  isNil,
  isNilStr,
  isPrimitive,
  isInstanceOf,
  isPromise,
  isAsyncFunction,
} from './variable';

describe('Variable Utils', () => {
  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('test')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1.23)).toBe(true);
      expect(isNumber(Number('123'))).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber('123')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject('{}')).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('[]')).toBe(false);
      expect(isArray(null)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function () {})).toBe(true);
      expect(isFunction(class {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction('function')).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for Date objects', () => {
      expect(isDate(new Date())).toBe(true);
    });

    it('should return false for non-Date objects', () => {
      expect(isDate('2023-01-01')).toBe(false);
      expect(isDate(1234567890)).toBe(false);
    });
  });

  describe('isRegExp', () => {
    it('should return true for RegExp objects', () => {
      expect(isRegExp(/test/)).toBe(true);
      expect(isRegExp(new RegExp('test'))).toBe(true);
    });

    it('should return false for non-RegExp objects', () => {
      expect(isRegExp('/test/')).toBe(false);
      expect(isRegExp({})).toBe(false);
    });
  });

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false for defined values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
    });
  });

  describe('isNil', () => {
    it('should return true for null and undefined', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
    });

    it('should return false for non-nil values', () => {
      expect(isNil(0)).toBe(false);
      expect(isNil('')).toBe(false);
    });
  });

  describe('isNilStr', () => {
    it('should return true for null, undefined and empty string', () => {
      expect(isNilStr(null)).toBe(true);
      expect(isNilStr(undefined)).toBe(true);
      expect(isNilStr('')).toBe(true);
    });

    it('should return false for non-nil values', () => {
      expect(isNilStr(0)).toBe(false);
      expect(isNilStr('test')).toBe(false);
    });
  });

  describe('isPrimitive', () => {
    it('should return true for primitive values', () => {
      expect(isPrimitive('')).toBe(true);
      expect(isPrimitive(0)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(null)).toBe(true);
      expect(isPrimitive(undefined)).toBe(true);
    });

    it('should return false for non-primitive values', () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
    });
  });

  describe('isInstanceOf', () => {
    class TestClass {}

    it('should return true for instances of given class', () => {
      expect(isInstanceOf(new TestClass(), TestClass)).toBe(true);
    });

    it('should return false for non-instances', () => {
      expect(isInstanceOf({}, TestClass)).toBe(false);
      expect(isInstanceOf(null, TestClass)).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('should return true for Promise objects', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
    });

    it('should return false for non-Promise objects', () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise(() => {})).toBe(false);
    });
  });

  describe('isAsyncFunction', () => {
    it('should return true for async functions', () => {
      expect(isAsyncFunction(async () => {})).toBe(true);
    });

    it('should return false for non-async functions', () => {
      expect(isAsyncFunction(() => {})).toBe(false);
      expect(isAsyncFunction(function () {})).toBe(false);
    });
  });
});
