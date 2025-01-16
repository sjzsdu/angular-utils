import { ChangeDetectorRef, Component, computed, effect, inject, input, model } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule, NzLabelAlignType } from 'ng-zorro-antd/form';
import { FormController, FormDisabled, FormHide, FormItem, FormResets, IFormRow } from '../../edit';
import { getAsyncValidator, getValidator } from '../validates';
import { PipesModule } from '../../../pipes';
import { NzInputModule } from 'ng-zorro-antd/input';
import { hasDuplicates } from 'wn-helper';
import { takeUntil } from 'rxjs';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'wn-form-group',
  imports: [ReactiveFormsModule, NzFormModule, PipesModule, NzInputModule, NzInputNumberModule],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.less',
  providers: [NzDestroyService],
})
export class FormGroupComponent {
  key = input('');
  items = input.required<FormItem[]>();
  control = input<FormController>();
  row = model<IFormRow>();

  // form
  layout = input<'horizontal' | 'vertical' | 'inline'>('vertical');
  labelSpan = input<number>();
  controlSpan = input<number>();

  // label
  nzNoColon = input(false);
  nzLabelAlign = input<NzLabelAlignType>('right');
  nzLabelWrap = input(false);

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = inject(NzDestroyService);
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
          console.log('asdfadsf', this.items());
          this.createForm(this.items());
          this.cdr.detectChanges();
        };
        item.formControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
          console.log('value change', val);
          setValue(val);
        });
        setValue(item.formControl?.value);
      }
    }
  }

  setDisableds(disableds: (FormDisabled | string)[]) {
    for (const disabled of disableds) {
      if (typeof disabled === 'string') {
        const sub = this.getItem(disabled);
        if (sub) {
          sub.formControl?.disable();
        }
      } else {
        const { field, rules } = disabled;
        const item = this.getItem(field);
        if (item) {
          const setValue = (val: any) => {
            for (const rule of rules) {
              const { value, columns } = rule;
              for (const col of columns) {
                const sub = this.getItem(col);
                if (sub) {
                  if (val === value) {
                    sub.formControl?.enable();
                  } else {
                    sub.formControl?.disable();
                  }
                }
              }
            }
          };
          item.formControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
            setValue(val);
          });
          setValue(item.formControl?.value);
        }
      }
    }
  }

  setResets(resets: FormResets[]) {
    for (const reset of resets) {
      const { field, columns } = reset;
      const item = this.getItem(field);
      if (item) {
        const setValue = (val: any) => {
          for (const column of columns) {
            const sub = this.getItem(column);
            if (sub) {
              sub.formControl?.reset(val);
            }
          }
        };
        item.formControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
          setValue(val);
        });
        setValue(item.formControl?.value);
      }
    }
  }

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

  private formControls = new Map<string, FormControl>();

  handleItem(item: FormItem) {
    switch (item.type) {
      case 'custom':
        break;
      case 'groupForm':
        break;
      case 'arrayForm':
        break;
      default:
        const { required, defaults, name } = item;
        if (required && !item.validates?.includes('required')) {
          item.validates = ['required', ...(item.validates || [])];
        }
        const validators = getValidator(item?.validates, item?.validatesArgs);
        const asyncValidators = getAsyncValidator(item?.asyncValidates, item?.asyncValidatesArgs);
        const control = new FormControl(defaults, { validators, asyncValidators });
        this.formControls.set(name, control);
        this.addControl(name, control);
    }
  }

  getControl(name: string): FormControl | undefined {
    return this.formControls.get(name);
  }

  submitForm(): void {
    console.log('onSubmit:', this.formGroup.value);
  }
}
