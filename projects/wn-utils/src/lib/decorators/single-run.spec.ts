import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { singletonRun } from './single-run';

describe('singletonRun Decorator', () => {
  class TestClass {
    calls = 0;

    @singletonRun()
    async testMethod() {
      this.calls++;
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.calls;
    }
  }

  let instance: TestClass;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    instance = new TestClass();
  });

  it('should prevent concurrent execution', async () => {
    const firstCall = await instance.testMethod();

    expect(firstCall).toBe(1);
  });
});
