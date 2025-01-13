import { Component, Input, forwardRef } from '@angular/core';
import { BaseAccessorComponent } from '../base-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatNumber } from 'wn-utils';

export interface RangeConfig {
  minTitle?: string;
  maxTitle?: string;
  suffix?: string;
  itemSpan?: number;
  precision?: number;
  step?: number;
  min?: number;
  max?: number;
  rangeClass?: string;
  nolimit?: boolean;
  noEquate?: boolean;
}

const defaultConfig = {
  minTitle: 'z min',
  maxTitle: 'z max',
  suffix: 'μm',
  itemSpan: 24,
  precision: 2,
  step: 0,
  min: -Infinity,
  max: +Infinity,
  rangeClass: '',
  nolimit: false,
  noEquate: false,
};

@Component({
  selector: 'wn-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeComponent),
      multi: true,
    },
  ],
})
export class RangeComponent extends BaseAccessorComponent<number[]> {
  _config: Required<RangeConfig> = defaultConfig;
  @Input()
  set config(obj: RangeConfig) {
    this._config = { ...this._config, ...(obj || {}) };
  }

  @Input() required = false;

  @Input() reverse: boolean = false;
  min?: number;
  max?: number;

  override writeValue(value: number[]): void {
    if (!value) {
      this.min = undefined;
      this.max = undefined;
      return;
    }
    this.min = formatNumber(value[0], 6) ?? undefined;
    this.max = formatNumber(value[1], 6) ?? undefined;
  }

  get min_min() {
    if (this._config.nolimit || this._config.noEquate) {
      return this._config.min;
    }
    return this.reverse ? (!this.max ? this._config.min : Math.max(this._config.min, this.max)) : this._config.min;
  }

  get min_max() {
    if (this._config.nolimit || this._config.noEquate) {
      return this._config.max;
    }
    return this.reverse ? this._config.max : !this.max ? this._config.max : Math.min(this._config.max, this.max);
  }

  get max_min() {
    if (this._config.nolimit || this._config.noEquate) {
      return this._config.min;
    }
    return this.reverse ? this._config.min : !this.min ? this._config.min : Math.max(this._config.min, this.min);
  }

  get max_max() {
    if (this._config.nolimit || this._config.noEquate) {
      return this._config.max;
    }
    return this.reverse ? (!this.min ? this._config.min : Math.min(this._config.max, this.min)) : this._config.max;
  }

  onChangeValFirst(val: number) {
    if (this._config.noEquate && this.max && val >= this.max) {
      this.setError({ min: 'The min value must be less than the max' });
      this.onChangeVal();
      return;
    }
    if (!val && val !== 0) {
      this.setError({ min: 'The value is required' });
      this.onChangeVal();
      return;
    }
    this.error = undefined;
    this.onChangeVal();
  }

  onChangeValSecond(val: number) {
    if (this._config.noEquate && this.min && val <= this.min) {
      this.setError({ max: 'The max value must be big than the min' });
      this.onChangeVal();
      return;
    }
    if (!val && val !== 0) {
      this.setError({ max: 'The value is required' });
      this.onChangeVal();
      return;
    }
    this.error = undefined;
    this.onChangeVal();
  }

  error: any;
  setError(error: any) {
    this.error = error;
  }

  onChangeVal() {
    if (typeof this.min === 'string' || typeof this.max === 'string') {
      return;
    }
    this.change([this.min ?? -Infinity, this.max ?? Infinity]);
  }
}
