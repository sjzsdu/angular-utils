import { memoize, clearMemoizeCache } from './memoize';

describe('memoize decorator', () => {
  class TestClass {
    callCount = 0;

    @memoize
    async testMethod(): Promise<number> {
      this.callCount++;
      return 42;
    }
  }

  it('should cache the result for same instance', async () => {
    const instance = new TestClass();

    const result1 = await instance.testMethod();
    const result2 = await instance.testMethod();

    expect(result1).toBe(42);
    expect(result2).toBe(42);
    expect(instance.callCount).toBe(1);
  });

  it('should have separate cache for different instances', async () => {
    const instance1 = new TestClass();
    const instance2 = new TestClass();

    await instance1.testMethod();
    await instance2.testMethod();

    expect(instance1.callCount).toBe(1);
    expect(instance2.callCount).toBe(1);
  });

  it('should clear cache for specific method', async () => {
    const instance = new TestClass();

    await instance.testMethod();
    clearMemoizeCache(instance, 'testMethod');
    await instance.testMethod();

    expect(instance.callCount).toBe(2);
  });

  it('should clear all caches for instance', async () => {
    const instance = new TestClass();

    await instance.testMethod();
    clearMemoizeCache(instance);
    await instance.testMethod();

    expect(instance.callCount).toBe(2);
  });
});
