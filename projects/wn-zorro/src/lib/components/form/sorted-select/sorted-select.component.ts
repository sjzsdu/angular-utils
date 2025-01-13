/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseAccessorComponent } from '../base-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string | number;
  value: string | number;
}

@Component({
  standalone: false,
  selector: 'wn-sorted-select',
  templateUrl: './sorted-select.component.html',
  styleUrl: './sorted-select.component.less',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SortedSelectComponent),
      multi: true,
    },
  ],
})
export class SortedSelectComponent extends BaseAccessorComponent<string | string[]> implements OnInit, OnChanges {
  @Input() options: number[] | string[] | SelectOption[] = [];
  @Input() maxCount = 2;
  @Input() nzDisabled = false;
  constructor() {
    super();
  }

  selects: any[] = [];
  override writeValue(value: string | string[]): void {
    this.innerValue = value;
    if (typeof value === 'string') {
      this.selects = [value];
    } else if (Array.isArray(value)) {
      this.selects = value;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { options } = changes;
    if (options?.currentValue?.length) {
      console.log('options changed', options?.currentValue, this.selects);
      for (let i = 0; i < this.selects.length; i++) {
        if (!options?.currentValue.some((item: any) => item.value === this.selects[i])) {
          this.selects[i] = '';
        }
      }
    }
  }

  ngOnInit(): void {
    if (!this.selects?.length) {
      this.selects = [''];
    }
  }

  addSelect(): void {
    if (this.selects.length < this.maxCount) {
      this.selects.push('');
    }
  }

  selectChange() {
    const vals = this.selects.filter(Boolean);
    if (vals.length === 1) {
      this.change(vals[0]);
    } else if (vals.length > 1) {
      this.change(vals);
    }
  }

  label(option: number | string | SelectOption) {
    return ['number', 'string'].includes(typeof option) ? (option as number | string) : (option as SelectOption).label;
  }

  value(option: number | string | SelectOption) {
    return ['number', 'string'].includes(typeof option) ? option : (option as SelectOption).value;
  }
}
