import { Component, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
@Component({ standalone: false, template: '' })
export abstract class BaseAccessorComponent<T> implements ControlValueAccessor {
  public innerValue?: T;

  onChange: (value: T) => void = () => {};
  onTouched: (value: T) => void = () => {};
  [key: string]: any;
  @Output() ngModelChange = new EventEmitter<T>();

  constructor() {}

  writeValue(value: T): void {
    this.innerValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected change(value: T): void {
    if (this.onChange) {
      this.onChange(value);
    }
    this.ngModelChange.emit(value);
  }

  protected touched(value: T): void {
    if (this.onTouched) {
      this.onTouched(value);
    }
  }
}
