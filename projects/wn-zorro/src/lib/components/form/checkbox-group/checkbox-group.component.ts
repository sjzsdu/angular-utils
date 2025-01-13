import { Component, OnInit, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseAccessorComponent } from '../base-accessor';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { NzCheckBoxOptionInterface } from 'ng-zorro-antd/checkbox';

export type CheckBoxOption = NzSelectOptionInterface | string;
export type CheckBoxValue = number | string;

@Component({
  standalone: false,
  selector: 'wn-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
})
export class CheckboxGroupComponent extends BaseAccessorComponent<CheckBoxValue[]> implements OnInit {
  options = input<CheckBoxOption[]>();
  _options?: NzCheckBoxOptionInterface[];

  ngOnInit(): void {
    this.updateOptions();
  }

  override writeValue(value?: CheckBoxValue[]): void {
    if (value?.length) {
      this.innerValue = value;
      this.updateOptions();
    }
  }
  updateOptions() {
    if (!this.options()?.length) {
      return;
    }
    this._options = this.options()?.map((item) => {
      const value = typeof item === 'string' ? item : (item.value as string);
      return {
        label: (typeof item === 'string' ? item : item.label) as string,
        value,
        checked: this.innerValue?.includes(value),
      };
    });
  }

  onCheck(options: NzCheckBoxOptionInterface[]) {
    this.change(options.filter((item) => item.checked).map((item) => item.value));
  }
}
