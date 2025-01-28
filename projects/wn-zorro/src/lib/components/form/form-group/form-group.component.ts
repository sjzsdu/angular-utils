import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzFormModule, NzLabelAlignType } from 'ng-zorro-antd/form';
import {
  FormController,
  FormDisabled,
  FormHide,
  FormItem,
  FormResets,
  IFormRow,
  OptioinItem,
  OptItem,
} from '../../../../types/form';
import { getAsyncValidator, getValidator } from '../validates';
import { PipesModule } from '../../../pipes';
import { NzInputModule } from 'ng-zorro-antd/input';
import { hasDuplicates } from '@wn-helper';
import { takeUntil } from 'rxjs';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TemplateModule } from '../../template';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BaseAccessorComponent } from '../../edit';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'wn-form-group',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    PipesModule,
    NzInputModule,
    NzInputNumberModule,
    NzRadioModule,
    NzCheckboxModule,
    NzSelectModule,
    TemplateModule,
    NzToolTipModule,
    NzLayoutModule,
    NzSwitchModule,
    NzCascaderModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.less',
  providers: [
    NzDestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormGroupComponent),
      multi: true,
    },
  ],
})
export class FormGroupComponent<T extends IFormRow = IFormRow> extends BaseAccessorComponent<T> {
  name = input('');
  items = input.required<FormItem[]>();
  control = input<FormController>();
  row = model<IFormRow>();
  group = input<FormGroup | null>(null);
  formGroup?: FormGroup;

  // form
  layout = input<'horizontal' | 'vertical' | 'inline'>('vertical');
  labelSpan = input<number>();
  controlSpan = input<number>();
  showSubmit = input(false);
  gutter = input(20);
  itemSpan = input(24);
  showCollapse = input(false);
  collapseCount = input(3);

  _showCollapse = computed(() => {
    if (this.showCollapse()) {
      return this.showCollapse();
    }
    return this.items()?.length >= this.collapseCount();
  });

  _controlSpan = computed(() => {
    if (!this.labelSpan()) {
      return null;
    }
    return this.controlSpan() || 24 - this.labelSpan()!;
  });

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
  afterRegister = false;

  constructor() {
    super();
    effect(() => {
      console.log('form group Oninit');
      if (!this.group()) {
        this.formGroup = new FormGroup({});
      } else {
        this.formGroup = this.group()!;
      }
      this.setFormEvent();
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

  setFormEvent() {
    this.formGroup!.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      console.log('form group value change', val);
      // this.change(val as unknown as T);
    });
  }

  addControl(name: string, control: AbstractControl) {
    if (!control) {
      return;
    }
    if (!this.formGroup!.contains(name)) {
      this.formGroup!.addControl(name, control);
    }
  }

  removeControl(name: string) {
    if (this.formGroup!.contains(name)) {
      this.formGroup!.removeControl(name);
    }
  }

  createForm(items: FormItem[]) {
    for (const item of items) {
      if (!item.isHide) {
        this.addControl(item.name, this.getControl(item.name)!);
      } else {
        this.removeControl(item.name);
      }
    }
  }

  compareFunc(val: number | string | (number | string)[], value: string): boolean {
    return Array.isArray(val) ? val.includes(value) : val === value;
  }

  setHides(hides: FormHide[]) {
    for (const hide of hides) {
      const { field, rules } = hide;
      const item = this.getItem(field);
      const control = this.getControl(field);
      if (item && control) {
        item!.isHide = false;
        const setValue = (val: number | string | (number | string)[]) => {
          const allColumns = rules.flatMap((rule) => rule.columns);

          for (const col of allColumns) {
            const sub = this.getItem(col);
            if (sub) {
              sub.isHide = true;
            }
          }

          const matchedRule = rules.find((rule) => this.compareFunc(val, rule.value));
          if (matchedRule) {
            for (const col of matchedRule.columns) {
              const sub = this.getItem(col);
              if (sub) {
                sub.isHide = false;
              }
            }
          }
          this.createForm(this.items());
          this.cdr.detectChanges();
        };

        control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
          setValue(val);
        });
        setValue(control.value);
      }
    }
  }
  setDisableds(disableds: (FormDisabled | string)[]) {
    for (const disabled of disableds) {
      if (typeof disabled === 'string') {
        const item = this.getItem(disabled);
        const control = this.getControl(disabled);
        if (item && control) {
          control.disable();
        }
      } else {
        const { field, rules } = disabled;
        const item = this.getItem(field);
        const control = this.getControl(field);
        if (item && control) {
          control.enable();
          const setValue = (val: number | string | (number | string)[]) => {
            const allColumns = rules.flatMap((rule) => rule.columns);

            for (const col of allColumns) {
              const subControl = this.getControl(col);
              if (subControl) {
                subControl.disable();
              }
            }

            const matchedRule = rules.find((rule) => this.compareFunc(val, rule.value));
            if (matchedRule) {
              for (const col of matchedRule.columns) {
                const subControl = this.getControl(col);
                if (subControl) {
                  subControl.enable();
                }
              }
            }

            console.log('setDisableds: ', val, allColumns, matchedRule?.columns);
            this.cdr.detectChanges();
          };

          control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
            console.log('value change for disable', val);
            setValue(val);
          });
          console.log('Disabled item', control);
          setValue(control.value);
        }
      }
    }
  }

  setResets(resets: FormResets[]) {
    for (const reset of resets) {
      const { field, columns } = reset;
      const item = this.getItem(field);
      const control = this.getControl(field);
      if (item && control) {
        const setValue = (val: any) => {
          for (const column of columns) {
            const subControl = this.getControl(column);
            if (subControl) {
              subControl.reset();
            }
          }
          this.cdr.detectChanges();
        };

        control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
          setValue(val);
        });
        setValue(control.value);
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

  formControls = new Map<string, AbstractControl>();

  handleItem(item: FormItem) {
    const { required, defaults, name } = item;
    switch (item.type) {
      case 'custom':
        break;
      case 'groupForm':
        const group = new FormGroup({});
        this.formControls.set(item.name, group);
        this.addControl(name, group);
        this.afterRegister = false;
        break;
      case 'arrayForm':
        break;
      default:
        console.log('Handling form item:', item);
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

  getControl(name: string): AbstractControl | undefined {
    return this.formControls.get(name);
  }

  getGroup(name: string): FormGroup | null {
    return this.formControls.get(name) as FormGroup | null;
  }

  submitForm(): void {
    console.log('onSubmit:', this.formGroup!.value);
    for (const [key, control] of Object.entries(this.formGroup!.controls)) {
      console.log(key, control, (control as AbstractControl)?.errors);
    }
  }

  isOptItem(item: OptioinItem): item is OptItem {
    return typeof item !== 'string';
  }

  isCollapse = signal(false);
  toggleCollapse() {
    this.isCollapse.set(!this.isCollapse());
  }

  resetForm() {
    this.formGroup?.reset();
  }

  search() {
    console.log('search');
  }
}
