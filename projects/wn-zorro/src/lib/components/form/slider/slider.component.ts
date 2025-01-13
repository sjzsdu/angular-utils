import { ChangeDetectorRef, Component, Injector, Input, OnInit, forwardRef } from '@angular/core';
import { BaseAccessorComponent } from '../base-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isValidNumber } from 'wn-utils';

export interface SliderConfig {
  minTitle?: string;
  maxTitle?: string;
  suffix?: string;
  precision?: number;
  step?: number;
  min?: number;
  max?: number;
  showInput?: boolean;
  rangeClass?: string;
  noLimit?: boolean;
}

const defaultConfig = {
  minTitle: 'z min',
  maxTitle: 'z max',
  suffix: 'μm',
  precision: 2,
  step: 0,
  min: -Infinity,
  max: +Infinity,
  showInput: true,
  rangeClass: '',
  noLimit: true,
};

@Component({
  selector: 'wn-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent extends BaseAccessorComponent<number[]> {
  _config: Required<SliderConfig> = defaultConfig;
  @Input()
  set config(obj: SliderConfig) {
    this._config = { ...this._config, ...(obj || {}) };
  }

  @Input() nzDisabled: boolean = false;
  slide: { min?: number; max?: number } = {};
  min?: number;
  max?: number;

  get maxVal() {
    if (this._config.noLimit) {
      return Infinity;
    }
    return Math.min(this._config.max, this.innerValue ? this.innerValue[1] : Infinity);
  }

  get min_maxVal() {
    return this.innerValue && isValidNumber(this.innerValue[1]) ? this.innerValue[1] : Infinity;
  }

  get minVal() {
    if (this._config.noLimit) {
      return -Infinity;
    }
    return Math.max(this._config.min, this.innerValue ? this.innerValue[0] : -Infinity);
  }

  get max_minVal() {
    return this.innerValue && isValidNumber(this.innerValue[0]) ? this.innerValue[0] : -Infinity;
  }

  get slide_max() {
    return this.slide.max === this.slide.min ? this.slide.max! + 0.5 : this.slide.max;
  }

  get slide_min() {
    return this.slide.max === this.slide.min ? this.slide.min! - 0.5 : this.slide.min;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    injector: Injector
  ) {
    super();
  }

  override writeValue(value: number[]): void {
    if (value && value.length === 2) {
      this.innerValue = value;
    } else {
      this.innerValue = [this._config.min, this._config.max];
    }
    this.min = this.innerValue![0];
    this.max = this.innerValue![1];
    this.slide.min = this.min;
    this.slide.max = this.max;
    this.cdr.detectChanges();
  }

  onChangeVal() {
    this.innerValue = [this.min as number, this.max as number];
    this.slide.min = this.min;
    this.slide.max = this.max;
    this.change(this.innerValue);
  }

  slideChange(e: number[]) {
    this.min = e[0];
    this.max = e[1];

    this.change(this.innerValue!);
  }
}
