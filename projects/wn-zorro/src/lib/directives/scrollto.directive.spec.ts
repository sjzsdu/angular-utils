import { ScrollToDirective } from './scrollto.directive';
import { ElementRef } from '@angular/core';

describe('ScrollToDirective', () => {
  let directive: ScrollToDirective;
  let elementRef: ElementRef;
  let scrollableParent: HTMLElement;

  beforeEach(() => {
    // 创建一个模拟的 HTML 元素
    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);

    elementRef = new ElementRef(mockElement);
    directive = new ScrollToDirective(elementRef);

    // 创建可滚动的父元素
    scrollableParent = document.createElement('div');
    scrollableParent.style.overflowY = 'auto';
    scrollableParent.style.height = '100px';
    document.body.appendChild(scrollableParent);
  });

  afterEach(() => {
    // 清理 DOM
    document.body.innerHTML = '';
  });

  it('should scroll to the element of the current directive if no targetSelector is provided', () => {
    scrollableParent.appendChild(elementRef.nativeElement);

    directive.scrollToTarget(); // No target selector provided

    expect(scrollableParent.scrollTop).toBe(0); // Initial scroll position
  });

  it('should scroll to the element with the given ID selector', () => {
    const targetElement = document.createElement('div');
    targetElement.id = 'target';
    targetElement.style.height = '200px';
    targetElement.style.marginTop = '150px'; // Positioned below the scrollable parent
    document.body.appendChild(targetElement);
    scrollableParent.appendChild(elementRef.nativeElement);

    directive.scrollToTarget('#target');

    // 验证滚动位置
    expect(scrollableParent.scrollTop).toBe(150); // Should scroll to the top of the target element
  });

  it('should scroll to the element with the given class selector', () => {
    const targetElement = document.createElement('div');
    targetElement.className = 'target-class';
    targetElement.style.height = '200px';
    targetElement.style.marginTop = '150px'; // Positioned below the scrollable parent
    document.body.appendChild(targetElement);
    scrollableParent.appendChild(elementRef.nativeElement);

    directive.scrollToTarget('.target-class');

    // 验证滚动位置
    expect(scrollableParent.scrollTop).toBe(150); // Should scroll to the top of the target element
  });

  it('should log a warning if the target element is not found', () => {
    const consoleWarnSpy = spyOn(console, 'warn'); // 监控 console.warn 方法

    scrollableParent.appendChild(elementRef.nativeElement);

    directive.scrollToTarget('#non-existent'); // Provide a non-existent ID

    expect(consoleWarnSpy).toHaveBeenCalledWith('Target element "#non-existent" not found.');
  });
});
