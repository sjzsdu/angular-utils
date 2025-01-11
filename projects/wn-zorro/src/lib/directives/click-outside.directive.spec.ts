import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';
import { Component, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div appClickOutside [excludeClass]="excludeClass" (clickOutside)="onClickOutside($event)">
      <div class="inner">Inner</div>
      <div class="excluded">Excluded</div>
    </div>
    <div class="outside">Outside</div>
  `,
})
class TestComponent {
  excludeClass = 'excluded';
  clickedElement: HTMLElement | null = null;

  onClickOutside(element: HTMLElement) {
    this.clickedElement = element;
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let directiveElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ClickOutsideDirective],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.css('[appClickOutside]')).nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new ClickOutsideDirective(new ElementRef(directiveElement));
    expect(directive).toBeTruthy();
  });

  it('should emit clickOutside when clicking outside', () => {
    const outsideElement = fixture.debugElement.query(By.css('.outside')).nativeElement;
    outsideElement.click();
    expect(component.clickedElement).toBe(outsideElement);
  });

  it('should not emit clickOutside when clicking inside', () => {
    const innerElement = fixture.debugElement.query(By.css('.inner')).nativeElement;
    innerElement.click();
    expect(component.clickedElement).toBeNull();
  });

  it('should not emit clickOutside when clicking excluded element', () => {
    const excludedElement = fixture.debugElement.query(By.css('.excluded')).nativeElement;
    excludedElement.click();
    expect(component.clickedElement).toBeNull();
  });
});
