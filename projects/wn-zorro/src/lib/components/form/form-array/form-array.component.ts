import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Injector,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { BaseAccessorComponent } from '../base-accessor';
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
      useExisting: forwardRef(() => FormArrayComponent),
      multi: true,
    },
  ],
})
export class FormArrayComponent extends BaseAccessorComponent<any[]> implements OnInit {
  @Input() items: FormItem[] | undefined;
  @Input()
  set itemCount(num: number) {
    if (!this.items) {
      console.error('The form items is required');
      return;
    }
    this.initRows(num);
  }
  @Input() isDropDown = false;
  @Input() itemSpan = 24;
  @Input() addTitle = 'Add One Row';
  @ViewChildren(FormComponent) formsRef?: QueryList<FormComponent>;

  constructor(
    private destroy$: NzDestroyService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  override writeValue(value: any[]): void {
    console.log('writeValue n formarray', value);
    this.innerValue = value || [];
  }

  ngOnInit() {
    if (!this.innerValue) {
      this.innerValue = [];
    }
  }

  formChange(row: Record<string, any>, newRow: Record<string, any>) {
    console.log('formChange', row, newRow, this.innerValue);
    for (const o in newRow) {
      if (newRow[o] !== '' && newRow[o] !== null && newRow[o] !== undefined) {
        row[o] = newRow[o];
      }
    }
    this.doChange();
  }

  listChange(rows: any[]) {
    this.innerValue = rows;
    console.log('listChange', this.innerValue);
    this.doChange();
  }

  @debounceExecute(200)
  doChange() {
    this.change(this.innerValue!);
  }

  initRows(num: number) {
    if (this.innerValue) {
      this.innerValue = Array.from({ length: num }, (_, i) => ({}));
    }
  }
}
