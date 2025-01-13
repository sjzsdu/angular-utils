import { Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseAccessorComponent } from '../base-accessor';
import { NzCheckboxOption } from 'ng-zorro-antd/checkbox';

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
export class CheckboxGroupComponent extends BaseAccessorComponent<CheckBoxValue[]> {
  options = input<NzCheckboxOption[]>([]);

  // Computed options with checked state
  computedOptions = computed(() => {
    const currentValue = this.innerValue ?? [];
    return this.options().map((option) => ({
      ...option,
      checked: currentValue.includes(option.value),
    }));
  });

  onCheck(checkedValues: CheckBoxValue[]) {
    this.change(checkedValues);
  }
}
