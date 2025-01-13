import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { FormItem } from '../types';
import { FormComponent } from '../form.component';
import { debounceExecute } from 'wn-utils';

@Component({
  selector: 'wn-form-array',
  templateUrl: './form-array.component.html',
  styleUrl: './form-array.component.less',
  providers: [
    NzDestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormArrayComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FormArrayComponent implements OnInit, ControlValueAccessor {
  items = input<FormItem[]>();
  isDropDown = input(false);
  itemSpan = input(24);
  addTitle = input('Add One Row');

  @ViewChildren(FormComponent) formsRef?: QueryList<FormComponent>;

  private destroy$ = inject(NzDestroyService);

  innerValue = signal<any[]>([]);
  disabled = signal(false);

  itemCount = model(0);

  onChange = (value: any[]) => {};
  onTouched = () => {};

  constructor() {
    effect(() => {
      if (this.itemCount() > 0 && this.items()) {
        this.initRows(this.itemCount());
      }
    });
  }

  ngOnInit() {
    if (this.innerValue().length === 0) {
      this.innerValue.set([]);
    }
  }

  writeValue(value: any[]): void {
    console.log('writeValue in formarray', value);
    this.innerValue.set(value || []);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  formChange(row: Record<string, any>, newRow: Record<string, any>) {
    console.log('formChange', row, newRow, this.innerValue());
    for (const o in newRow) {
      if (newRow[o] !== '' && newRow[o] !== null && newRow[o] !== undefined) {
        row[o] = newRow[o];
      }
    }
    this.doChange();
  }

  listChange(rows: any[]) {
    this.innerValue.set(rows);
    console.log('listChange', this.innerValue());
    this.doChange();
  }

  @debounceExecute(200)
  doChange() {
    this.onChange(this.innerValue());
  }

  initRows(num: number) {
    if (!this.items()) {
      console.error('The form items is required');
      return;
    }
    this.innerValue.set(Array.from({ length: num }, () => ({})));
  }
}
