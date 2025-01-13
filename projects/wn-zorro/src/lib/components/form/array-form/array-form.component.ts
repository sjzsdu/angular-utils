import {
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  QueryList,
  ViewChildren,
  effect,
  forwardRef,
  input,
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
  standalone: false,
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
  name = input<string>();
  items = input<FormItem[]>();
  isDropDown = input(false);
  itemSpan = input(24);
  itemCount = input(2);
  addTitle = input<string>('Add One Row');

  @ViewChildren(FormComponent) formsRef?: QueryList<FormComponent>;

  forms: ArrayItemForm[] = [];
  rows: any[] = [];

  constructor() {
    super();
    effect(() => {
      this.forms = new Array(this.itemCount()).fill(0).map(() => ({
        items: this.mapItems(),
        id: generateUUID(),
      }));
    });
  }

  private mapItems(): FormItem[] {
    return (this.items() || []).map((item) => ({ ...item }));
  }

  override writeValue(value: any): void {
    this.innerValue = value || [];
    this.forms = this.innerValue!.map((item) => {
      return {
        items: this.mapItems(),
        initRow: item,
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
      items: this.mapItems(),
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
