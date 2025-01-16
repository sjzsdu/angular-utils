import { ChangeDetectorRef, Component, computed, effect, inject, input, model } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule, NzLabelAlignType } from 'ng-zorro-antd/form';
import { FormController, FormDisabled, FormHide, FormItem, FormResets, IFormRow } from '../../edit';
import { getAsyncValidator, getValidator } from '../validates';
import { PipesModule } from '../../../pipes';
import { NzInputModule } from 'ng-zorro-antd/input';
import { hasDuplicates } from 'wn-helper';

@Component({
  selector: 'wn-form-group',
  imports: [ReactiveFormsModule, NzFormModule, PipesModule, NzInputModule],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.less',
})
export class FormGroupComponent {
  key = input('');
  items = input.required<FormItem[]>();
  control = input<FormController>();
  row = model<IFormRow>();

  // form
  nzLayout = input<'horizontal' | 'vertical' | 'inline'>('horizontal');

  // label
  nzNoColon = input(false);
  nzLabelAlign = input<NzLabelAlignType>('right');
  nzLabelWrap = input(false);

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private parent = inject(FormGroupComponent, { optional: true, skipSelf: true });

  _hides = computed(() => {
    if (!this.control()) {
      return;
    }
    return this.control()?.hides || [];
  });
  _disableds = computed(() => {
    if (!this.control()) {
      return;
    }
    return this.control()?.disableds || [];
  });
  _resets = computed(() => {
    if (!this.control()) {
      return;
    }
    return this.control()?.resets || [];
  });
  formGroup = new FormGroup({});

  constructor() {
    effect(() => {
      if (this.items()?.length) {
        this.handleItems(this.items());
      }
      if (this._hides()) {
        this.setHides(this._hides()!);
      }
      if (this._disableds()) {
        this.setDisableds(this._disableds()!);
      }
      if (this._resets()) {
        this.setResets(this._resets()!);
      }
      this.createForm(this.items());
    });
  }

  addControl(name: string, control: AbstractControl) {
    if (!this.formGroup.contains(name)) {
      this.formGroup.addControl(name, control);
    }
  }

  removeControl(name: string) {
    if (this.formGroup.contains(name)) {
      this.formGroup.removeControl(name);
    }
  }

  createForm(items: FormItem[]) {
    for (const item of items) {
      if (!item.isHide) {
        this.addControl(item.name, item.formControl!);
      } else {
        this.removeControl(item.name);
      }
    }
  }

  setHides(hides: FormHide[]) {
    for (const hide of hides) {
      const { field, rules } = hide;
      const item = this.getItem(field);
      if (item) {
        item!.isHide = false;
        const setValue = (val: any) => {
          for (const rule of rules) {
            const { value, columns } = rule;
            for (const col of columns) {
              const sub = this.getItem(col);
              if (sub) {
                sub.isHide = !(val === value);
              }
            }
          }
        };
        item.formControl?.valueChanges.subscribe((val) => {
          setValue(val);
        });
        setValue(item.formControl?.value);
      }
    }
  }

  setDisableds(disableds: (FormDisabled | string)[]) {}

  setResets(resets: FormResets[]) {}

  handleItems(items: FormItem[]) {
    if (hasDuplicates(items.map((item) => item.name))) {
      console.error('FormGroupComponent: can not have duplicate name');
      return;
    }
    for (const item of items) {
      this.handleItem(item);
    }
  }

  getItem(name: string) {
    return this.items()!.find((item) => item.name === name);
  }

  handleItem(item: FormItem) {
    switch (item.type) {
      case 'custom':
        break;
      case 'groupForm':
        break;
      case 'arrayForm':
        break;
      default:
        const { required, defaults } = item;
        if (required && !item.validates?.includes('required')) {
          item.validates = ['required', ...(item.validates || [])];
        }
        const validators = getValidator(item?.validates, item?.validatesArgs);
        const asyncValidators = getAsyncValidator(item?.asyncValidates, item?.asyncValidatesArgs);
        item.formControl = new FormControl(defaults, { validators, asyncValidators });
    }
  }

  submitForm(): void {
    console.log('onSubmit:', this.formGroup.value);
  }
}
