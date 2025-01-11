import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlurOnClickDirective } from './blur-on-click.directive';
import { Component, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appBlurOnClick>Test</div>`,
})
class TestComponent {}

describe('BlurOnClickDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let divElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [BlurOnClickDirective],
    });
    fixture = TestBed.createComponent(TestComponent);
    divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    spyOn(divElement, 'blur');
  });

  it('should create an instance', () => {
    const directive = new BlurOnClickDirective(new ElementRef(divElement));
    expect(directive).toBeTruthy();
  });

  it('should blur element on click', () => {
    divElement.click();
    expect(divElement.blur).toHaveBeenCalled();
  });
});
