import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  EventEmitter,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  output,
  viewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormControlStatus,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  ComponentCommand,
  ControlRules,
  CustomComponentCache,
  FormController,
  FormDisabled,
  FormHide,
  FormItem,
  FormModalData,
  FormResets,
  OptioinItem,
  OptItem,
} from './types';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { BaseAccessorComponent } from './base-accessor';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { NzFormLayoutType } from 'ng-zorro-antd/form';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { FormService } from './form.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceExecute, delayExecute } from 'wn-utils';
import { getAsyncValidator, getValidator, ValidateReactiveFormData } from './validates';
import { Subject, takeUntil } from 'rxjs';
import { FORM_COMMANDS, FORM_DATA, FORM_EMITTER, FORM_PARAMS } from './const';

@Component({
  standalone: false,
  selector: 'wn-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormComponent),
      multi: true,
    },
    NzDestroyService,
  ],
})
export class FormComponent<T = any> extends BaseAccessorComponent<T> {
  name = input<string>();
  items = input<FormItem[]>();
  labelSpan = input(7);
  controlSpan = input(12);
  itemSpan = input(24);
  layout = input<NzFormLayoutType>('vertical');
  isSub = input(false);
  inModal = input(false);
  showError = model(false);
  row = input<any>();
  control = input<FormController>();
  nzModalData: FormModalData = inject(NZ_MODAL_DATA, { optional: true });

  _layout = computed(() => {
    if (this.isSub()) return this.layout() || 'vertical';
    return this.inModal() ? this.nzModalData?.layout || this.layout() : this.layout() || 'vertical';
  });

  _labelSpan = computed(() => {
    if (this._layout() === 'vertical') return 24;
    if (this.isSub()) return this.labelSpan();
    return this.inModal() ? this.nzModalData?.labelSpan || this.labelSpan() : this.labelSpan();
  });

  _controlSpan = computed(() => {
    if (this._layout() === 'vertical') return 24;
    if (this.isSub()) return this.controlSpan();
    return this.inModal() ? this.nzModalData?.controlSpan || this.controlSpan() : this.controlSpan();
  });

  _items = computed(() => {
    if (this.isSub()) return this.items() || [];
    return this.inModal() ? this.nzModalData?.items || this.items() || [] : this.items() || [];
  });

  _itemSpan = computed(() => {
    if (this.isSub()) return this.itemSpan();
    return this.inModal() ? this.nzModalData?.itemSpan || this.itemSpan() : this.itemSpan() || 24;
  });

  _control = computed(() => {
    if (this.isSub()) return this.control();
    return this.inModal() ? this.nzModalData?.control || this.control() : this.control();
  });

  _row = computed(() => {
    if (this.isSub()) return this.row() || this.innerValue;
    return this.inModal() ? this.nzModalData?.row || this.row() || this.innerValue : this.row() || this.innerValue;
  });

  rowChange = output<any>();
  subForms = viewChildren(FormComponent);
  selects = viewChildren(NzSelectComponent);

  currentRow?: any;
  reservedRow: any = {};

  customRow: Record<string, any> = {};
  customComponents: Record<string, CustomComponentCache> = {};

  validateForm?: FormGroup;

  autoTips: Record<string, Record<string, string>> = {
    en: {
      required: 'This field is required',
      exclude: 'This field should be unique',
    },
  };

  private fb = inject(FormBuilder);
  private destroy$ = inject(NzDestroyService);
  private cdr = inject(ChangeDetectorRef);
  private parent = inject(FormComponent, { optional: true, skipSelf: true });
  private formService = inject(FormService);

  override writeValue(val: any): void {
    super.writeValue(val);
    if (val) {
      this.setData(val, 'writeValue');
    }
  }

  submitForm(): void {
    if (!this.validateForm) {
      return;
    }
  }

  resetForm(e: MouseEvent): void {
    if (!this.validateForm) {
      return;
    }
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  constructor() {
    super();
    effect(() => {
      if (this._items()?.length) {
        this.createForm(this._items());
      }
      if (this._row()) {
        this.setData(this._row());
      }
      if (this._control()) {
        this.setControl();
      }
      if (this.selects()) {
        this.selects().forEach((item) => {
          this.formService.registerSelect(item);
        });
      }
      this.setShowError(this.showError());
    });

    if (this.isSub()) {
      this.validateForm?.statusChanges.pipe(takeUntilDestroyed()).subscribe((status) => {
        if (status === 'VALID') {
          this.doChange();
        }
      });
    }
  }

  @delayExecute(16)
  setData(data: any, _why?: string) {
    if (!data) {
      return;
    }
    for (const o in data) {
      const item = this._items().find((sitem) => sitem.name === o);
      if (item) {
        item.current = data[o];
      }
      const control = this.validateForm?.controls[o];
      if (control) {
        control.setValue(data[o]);
      }
      const { commands } = this.customComponents[o] || {};
      if (commands) {
        commands.next({ type: 'setData', data: data[o] });
      }
    }
    this.rowChange.emit(data);
    this.cdr.markForCheck();
  }

  clearData() {
    this.validateForm?.reset();
    this.currentRow = {};
    const subForms = this.subForms();
    if (subForms) {
      for (const form of subForms) {
        form.clearData();
      }
    }
    // const arrayForms = this.arrayForms();
    // if (arrayForms) {
    //   for (const arrayForm of arrayForms) {
    //     arrayForm.clearData();
    //   }
    // }
  }

  selectReset() {
    this.setData(this.reservedRow);
  }

  isOptItem(option: OptioinItem): option is OptItem {
    return typeof option !== 'string' && 'label' in option && 'value' in option;
  }

  handleItem(item: FormItem) {
    if (item.formParams) {
      return item.formParams;
    }
    const { required } = item;
    const defaults = this.getInitValue(item.name, item.defaults);
    if (required && !item.validates?.includes('required')) {
      item.validates = ['required', ...(item.validates || [])];
    }

    const validators = getValidator(item?.validates, item?.validatesArgs);
    const asyncValidators = getAsyncValidator(item?.asyncValidates);
    if (item.type === 'custom') {
      const emitter = new EventEmitter();
      const commands = new Subject<ComponentCommand>();
      this.customComponents[item.name] = { emitter, commands };
      const providers = [
        { provide: FORM_EMITTER, useValue: emitter },
        { provide: FORM_COMMANDS, useValue: commands },
        { provide: FORM_DATA, useValue: this.getInitValue(item.name, defaults) },
        { provide: FormComponent, useValue: this },
      ];
      if (item.params) {
        providers.push({ provide: FORM_PARAMS, useValue: item.params });
      }
      item.params.injector = Injector.create({
        providers,
        parent: item.params.injector,
      });
      emitter.pipe(takeUntil(this.destroy$)).subscribe((val) => {
        this.updateCustomItem(item, val);
      });
    }
    item.formParams = [defaults, validators, asyncValidators];
    return [defaults, validators, asyncValidators];
  }

  @debounceExecute(30)
  updateCustomItem(item: FormItem, val: any) {
    this.customRow[item.name] = val;
    const control = this.validateForm?.controls[item.name];
    if (control) {
      control.setValue(val);
      this.doChange();
    }
  }

  doChange() {
    this.currentRow = this.getValues();
    this.mergeNew(this.currentRow);
    this.onChange(this.currentRow);
    this.rowChange.emit(this.currentRow);
  }

  mergeNew(row: any) {
    for (const o in row) {
      if (row[o] || row[o] === 0) {
        this.reservedRow[o] = row[o];
      }
    }
  }

  createForm(items: FormItem[]) {
    if (this.validateForm) {
      return;
    }
    const fbObj: Record<string, any> = items.reduce((acc: Record<string, any>, item) => {
      if (item.isHide) {
        return acc;
      }
      acc[item.name] = this.handleItem(item);
      return acc;
    }, {});
    this.validateForm = this.fb.group(fbObj);
    this.validateForm.valueChanges.subscribe((_val) => {
      this.doChange();
    });
    this.validateForm.statusChanges.subscribe((status: FormControlStatus) => {
      const name = this.name();
      if (this.parent && name) {
        if (status === 'INVALID') {
          const parentControl = this.parent?.validateForm?.controls[name];
          if (parentControl) {
            parentControl.setErrors({ subForm: 'invalid' });
          }
        }
      }
    });
    this.doChange();
  }

  subRowChange(row: any, item: FormItem) {
    this.customRow[item.name] = row;
    this.doChange();
  }

  getInitValue(name: string, defaults?: any) {
    const row = this._row();
    return row[name] ?? defaults;
  }

  // @delayExecute(30)
  setControl() {
    const { hides, disableds, resets } = this._control() || {};
    if (hides && hides.length) {
      for (const hide of hides) {
        this.setHideControl(hide);
      }
    }
    if (disableds && disableds.length) {
      for (const disabled of disableds) {
        this.setDisabledControl(disabled);
      }
    }
    if (resets && resets.length) {
      for (const reset of resets) {
        this.setResetsControl(reset);
      }
    }
  }

  @delayExecute(30)
  setControlVisible(column: string) {
    const { hides } = this._control() || {};
    const hideItem = hides?.find((hide) => hide.field === column);
    if (hideItem) {
      this.setHideControl(hideItem);
    }
  }

  setResetsControl(reset: FormResets) {
    const { field, columns } = reset;
    const control = this.validateForm?.controls[field];
    if (control) {
      control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((_val) => {
        for (const column of columns) {
          const item = this._items().find((sItem) => sItem.name === column);
          const control = this.validateForm?.controls[column];
          // if (control && item) {
          //   const { options } = item!;
          //   if (!options?.length) {
          //     control?.reset();
          //   }
          //   if (!options?.some((item: any) => item === control.value || item.value === control.value)) {
          //     control.reset();
          //   }
          // }
        }
        this.cdr.detectChanges();
      });
    }
  }

  setDisabledControl(disabled: FormDisabled | string) {
    if (typeof disabled === 'string') {
      const control = this.validateForm?.controls[disabled];
      control?.disable();
      return;
    }
    const { field, rules } = disabled;
    const control = this.validateForm?.controls[field];
    let prevValue: any;
    if (control) {
      control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
        if (val === prevValue) {
          return;
        }
        prevValue = val;
        const columns = rules.reduce((acc: string[], rule: ControlRules) => {
          acc.push(...rule.columns);
          return acc;
        }, []);
        this.setDisabled(columns, false);
        for (const rule of rules) {
          if (rule.value === val) {
            this.setDisabled(rule.columns, true, rule.values);
            break;
          }
        }
        this.cdr.detectChanges();
      });
    }
  }

  setDisabled(columns: string[], isDisabled: boolean, values?: any[]) {
    for (const [index, column] of columns.entries()) {
      const control = this.validateForm?.controls[column];
      if (control) {
        isDisabled ? control.disable() : control.enable();
        if (values && values[index]) {
          control.setValue(values[index]);
        }
      }
    }
  }

  setHideControl(hide: FormHide) {
    const { field, rules } = hide;
    const control = this.validateForm?.controls[field];
    let prevValue: any;
    const watchControl = (val: any) => {
      if (val === prevValue || (!val && this._row() && this._row()[field])) {
        return;
      }
      prevValue = val;
      const columns = rules.reduce((acc: string[], rule: ControlRules) => {
        // add sub hides item's coumns
        const subHides = this._control()!.hides?.filter((hide) => rule.columns.includes(hide.field));
        if (subHides?.length) {
          for (const hideItem of subHides) {
            const { rules } = hideItem;
            for (const subRule of rules) {
              acc.push(...subRule.columns);
            }
          }
        }

        acc.push(...rule.columns);
        return acc;
      }, []);
      this.resetColumnsError(columns);
      this.setVisible(columns, false);
      for (const rule of rules) {
        if (rule.value === val) {
          this.setVisible(rule.columns, true);
          break;
        }
      }
      // this.cdr.detectChanges();
    };
    if (control) {
      watchControl(control.value);
      control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
        watchControl(val);
        this.cdr.detectChanges();
      });
    }
  }

  setVisible(columns: string[], isShow: boolean) {
    for (const item of this._items()) {
      if (columns.includes(item.name)) {
        item.isHide = !isShow;
      }
    }
    for (const column of columns) {
      const control = this.validateForm?.controls[column];

      if (isShow && !control) {
        const field = this._items().find((item) => item.name === column);
        if (field) {
          const [defaults, validators, asyncValidators] = this.handleItem(field);
          const _control = new FormControl(field.current ?? defaults, {
            validators,
            asyncValidators,
          });
          this.validateForm?.addControl(column, _control);
          this.setControlValue(_control, field);
          this.setControlVisible(column);
        }
      } else if (!isShow && control) {
        this.validateForm?.removeControl(column);
      }
    }
  }

  @delayExecute(30)
  setControlValue(_control: AbstractControl, field: FormItem) {
    if (this._row()[field.name]) {
      _control.setValue(this._row()[field.name]);
      const { commands } = this.customComponents[field.name] || {};
      if (commands) {
        commands.next({ type: 'setData', data: this._row()[field.name] });
      }
    }
  }

  getValues() {
    if (!this.validateForm) {
      return { ...this.customRow };
    }
    const { controls } = this.validateForm;
    const res: any = {};
    for (const o in controls) {
      res[o] = controls[o].value;
    }
    return { ...res, ...this.customRow };
  }

  getError(item: FormItem) {
    if (!this.validateForm) {
      return;
    }
    const { controls = {} } = this.validateForm;
    const control = controls[item.name];
    const errors = control?.errors;
    if (!errors || control.untouched) {
      return [];
    }
    if (errors['required']) {
      errors['required'] = `The {label} is required`;
    }
    if (errors['subForm']) {
      delete errors['subForm'];
    }
    if (control.untouched && !this.showError) {
      delete errors['required'];
    }
    return Object.entries(errors).map(([key, str]) => {
      if (typeof str === 'object') {
        const val = str['requiredLength'] ?? str[key];
        str = `the ${key} of the {label} should be ${val}`;
      }
      // return str.replace(/{([^}]+)}/g, (match: string, variable: string) => {
      //   if (variable === 'label') {
      //     return item[variable] || item.name || match;
      //   }
      //   return item[variable] || match;
      // });
    });
  }

  setShowError(bool: boolean) {
    this.showError.set(bool);
    for (const o in this.validateForm?.controls) {
      this.validateForm?.controls[o]?.markAsTouched();
    }
    this.validateForm?.markAsTouched();
    const subForms = this.subForms();
    if (subForms) {
      for (const form of subForms) {
        form.setShowError(bool);
      }
    }

    for (const o in this.customComponents) {
      const { commands } = this.customComponents[o];
      if (commands) {
        commands.next({ type: 'setShowError', data: {} });
      }
    }
    this.cdr.detectChanges();
  }

  customError: Record<string, string> = {};
  setCustomError(name: string, error: string) {
    this.customError[name] = error;
  }

  resetCustomError(name: string) {
    delete this.customError[name];
  }

  resetColumnsError(columns: string[]) {
    for (const column of columns) {
      this.resetCustomError(column);
    }
  }

  formValid() {
    this.setShowError(true);
    let result: any = this.validateForm?.status === 'VALID';
    if (this.subForms) {
      result = result && this.subForms().every((form: any) => form.formValid());
    }
    if (Object.keys(this.customError)?.length) {
      return false;
    }

    const res = ValidateReactiveFormData(
      this._items().filter((item) => !item.isHide),
      this.getValues()
    );
    result = result && res === false;
    return result;
  }
}
