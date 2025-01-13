import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCheckboxOption } from 'ng-zorro-antd/checkbox';

import { CheckboxGroupComponent } from './checkbox-group.component';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxGroupComponent],
      imports: [FormsModule, NzCheckboxModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    // Initialize required inputs
    component['options'] = {
      set: (value: NzCheckboxOption[]) => {},
      update: (fn: (value: NzCheckboxOption[]) => NzCheckboxOption[]) => {},
      asReadonly: () => ({}),
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update computedOptions when options change', () => {
    component['options'] = {
      set: (value: NzCheckboxOption[]) => {},
      update: (fn: (value: NzCheckboxOption[]) => NzCheckboxOption[]) => {},
      asReadonly: () => [{ label: 'Test', value: '1' }],
    } as any;
    fixture.detectChanges();
    expect(component.computedOptions().length).toBe(1);
    expect(component.computedOptions()[0].label).toBe('Test');
  });

  it('should update computedOptions when value changes', () => {
    component.writeValue(['1']);
    component['options'] = {
      set: (value: NzCheckboxOption[]) => {},
      update: (fn: (value: NzCheckboxOption[]) => NzCheckboxOption[]) => {},
      asReadonly: () => [{ label: 'Test', value: '1' }],
    } as any;
    fixture.detectChanges();
    expect(component.computedOptions()[0].checked).toBe(true);
  });

  it('should emit change event when checkbox is checked', () => {
    const spy = jasmine.createSpy();
    component.registerOnChange(spy);

    component.onCheck(['1']);
    expect(spy).toHaveBeenCalledWith(['1']);
  });
});
