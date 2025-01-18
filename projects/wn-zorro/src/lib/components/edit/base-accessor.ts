import { Component, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
@Component({ standalone: false, template: '' })
export abstract class BaseAccessorComponent<T> implements ControlValueAccessor {
  innerValue = signal<T | null>(null);

  onChange: (value: T | null) => void = () => {};
  onTouched: (value: T | null) => void = () => {};

  writeValue(value: T | null): void {
    console.log('writeValue called with:', value);
    this.innerValue.set(value);
  }

  registerOnChange(fn: any): void {
    console.log('registerOnChange called', fn);
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('registerOnTouched called');
    this.onTouched = fn;
  }

  protected change(value: T): void {
    this.innerValue.set(value);
    if (this.onChange) {
      this.onChange(value);
    }
  }

  protected touched(value: T): void {
    if (this.onTouched) {
      this.onTouched(value);
    }
  }
}
