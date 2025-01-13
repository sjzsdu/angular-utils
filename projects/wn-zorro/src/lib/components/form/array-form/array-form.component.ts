import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import { BaseAccessorComponent } from '../base-accessor';
import { FormItem } from '../types';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormComponent } from '../form.component';
import { generateUUID } from 'wn-utils';

export interface ArrayItemForm {
  id: string;
  items: FormItem[];
  initRow?: any;
  dropdown?: boolean;
}

@Component({
  selector: 'wn-array-form',
  templateUrl: './array-form.component.html',
  styleUrls: ['./array-form.component.less'],
  providers: [
    NzDestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArrayFormComponent),
      multi: true,
    },
  ],
})
export class ArrayFormComponent extends BaseAccessorComponent<any[]> {
  @Input() items: FormItem[] | undefined;
  @Input()
  set itemCount(num: number) {
    if (!this.items) {
      console.error('The form items is required');
      return;
    }
    this.initRows(num);
  }
  @Input() isDropDown: boolean = false;
  @Input() itemSpan: number = 24;
  @Input() addTitle: string = 'Add One Row';

  @ViewChildren(FormComponent) formsRef?: QueryList<FormComponent>;

  forms: ArrayItemForm[] = [];
  rows: any[] = [];

  constructor(
    private destroy$: NzDestroyService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  override writeValue(value: any): void {
    this.innerValue = value || [];
    this.forms = this.innerValue!.map((item) => {
      return {
        items: [...(this.items || []).map((item) => ({ ...item }))],
        initRow: item,
        id: generateUUID(),
      };
    });
  }

  initRows(num: number) {
    this.forms = new Array(num).fill(0).map((_) => {
      return {
        items: [...(this.items || []).map((item) => ({ ...item }))],
        id: generateUUID(),
      };
    });
  }

  formValid() {
    if (this.formsRef) {
      return this.formsRef.toArray().every((form: any) => form.formValid());
    }
    return false;
  }

  clearData() {
    if (this.formsRef) {
      for (const form of this.formsRef) {
        form.clearData();
      }
    }
  }

  setShowError(bool: boolean) {
    if (this.formsRef) {
      for (const form of this.formsRef) {
        form.setShowError(bool);
      }
    }
  }

  onDrop(item: any) {
    item.dropdown = !item.dropdown;
  }

  formChange(form: ArrayItemForm, index: number, row: any) {
    this.rows[index] = row;
    this.change(this.rows);
  }

  addRow(): void {
    this.forms.push({
      id: generateUUID(),
      items: [...(this.items || []).map((item) => ({ ...item }))],
      dropdown: false,
    });
    this.rows.push({});
  }

  deleteRow(index: number): void {
    this.forms.splice(index, 1);
    this.rows.splice(index, 1);
    this.change(this.rows);
  }

  moveUp(index: number): void {
    if (index > 0) {
      [this.forms[index], this.forms[index - 1]] = [this.forms[index - 1], this.forms[index]];
      [this.rows[index], this.rows[index - 1]] = [this.rows[index - 1], this.rows[index]];
      this.change(this.rows);
    }
  }

  moveDown(index: number): void {
    if (index < this.forms.length - 1) {
      [this.forms[index], this.forms[index + 1]] = [this.forms[index + 1], this.forms[index]];
      [this.rows[index], this.rows[index + 1]] = [this.rows[index + 1], this.rows[index]];
      this.change(this.rows);
    }
  }
}
