import { ChangeDetectorRef, Component, EventEmitter, inject, Injector, Input, Optional, Output, QueryList, SimpleChanges, SkipSelf, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlStatus, FormGroup } from '@angular/forms';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { NzFormLayoutType } from 'ng-zorro-antd/form';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { trackFunc } from 'projects/core/src/utils/ng';
import { Subject, takeUntil } from 'rxjs';
import { debounceExecute, delayExecute } from 'utils/decarator';
import { BaseAccessorComponent } from './base-accessor';
import { FORM_COMMANDS, FORM_DATA, FORM_EMITTER, FORM_PARAMS } from './constant';
import { AnyObject, ComponentCommand, ControlRules, CustomComponentCache, FormController, FormDisabled, FormHide, ReactiveFormItem, ReactiveFormParams } from './types';
import { getAsyncValidator, getValidator } from './validator';

@Component({
  selector: 'wn-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
  providers: [
    NzDestroyService,
  ]
})
export class FormComponent<T = any> extends BaseAccessorComponent<any> {
    @Input() name?: string;
    @Input() items?: ReactiveFormItem[];
    @Input() labelSpan: number = 7;
    @Input() controlSpan: number = 12;
    @Input() itemSpan: number = 24;
    @Input() layout: NzFormLayoutType = 'vertical';
    @Input() isSub: boolean = false;
    @Input() showError: boolean = false;
    @Input() row?: any;
    @Input() control?: FormController;
    @Input() showSubmit: boolean = false;
    @Output() rowChange: EventEmitter<any> = new EventEmitter();
    @ViewChildren(FormComponent) subForms?: QueryList<FormComponent>;

    numberMin = -Infinity;
    numberMax = Infinity;

    customRow: Record<string, any> = {};
    customComponents: Record<string, CustomComponentCache> = {};

    validateForm?: FormGroup;
    trackByName = trackFunc('name');
    trackByOption = trackFunc('value');

    autoTips: Record<string, Record<string, string>> = {
        en: {
            required: 'This field is required',
            exclude: 'This field should be unique',
        },
    };

    override writeValue(val: any): void {
        this.innerValue = val;
        if (val) {
            this.setData(val);
        }
    }

    submitForm(): void {
        this.doChange();
    }

    resetForm(e: MouseEvent): void {
        if (!this.validateForm) return;
        e.preventDefault();
        this.validateForm.reset();
        for (const key in this.validateForm.controls) {
            if (this.validateForm.controls.hasOwnProperty(key)) {
                this.validateForm.controls[key].markAsPristine();
                this.validateForm.controls[key].updateValueAndValidity();
            }
        }
    }

    get _layout() {
        return this.innerParams?.layout || this.layout || 'vertical';
    }

    get _labelSpan() {
        return this.layout === 'vertical' ? 24 : this.innerParams?.labelSpan || this.labelSpan;
    }

    get _controlSpan() {
        return this.layout === 'vertical' ? 24 : this.innerParams?.controlSpan || this.controlSpan;
    }

    get _items() {
        return this.items || this.innerParams?.items || [];
    }

    get _itemSpan() {
        return this.innerParams?.itemSpan || this.itemSpan || 24;
    }

    get _control() {
        return this.innerParams?.control || this.control;
    }

    get _row() {
        return this.innerParams?.row || this.row || this.innerValue || {};
    }

    constructor(
        private injector: Injector,
        private fb: FormBuilder,
        private destroy$: NzDestroyService,
        private cdr: ChangeDetectorRef,
        @Optional() @SkipSelf() private parent: FormComponent
    ) {
      super(injector);
      const params = inject(NZ_MODAL_DATA, { optional: true });
      if (params) {
        this.writeParams(params);
      }
    }

    override writeParams(params: ReactiveFormParams): void {
      this.innerParams = params;
      if (params && params.items) {
        this.createForm(params.items);
        this.setData(params?.row || {});
        this.setControl();
        return;
      }
    }

    ngOnInit(): void {
        if (this.items && this.items.length) {
            this.createForm(this.items);
        }
        if (this.row) {
            this.setData(this.row);
        }
        if (this.isSub) {
            this.validateForm?.statusChanges.subscribe(status => {
                if (status === 'VALID') {
                    this.doChange();
                }
            });
        }
        if (this.control) {
            this.setControl();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { row } = changes;
        if (row && row.currentValue && row.currentValue !== row.previousValue) {
            this.setData(row.currentValue);
        }
    }

    @delayExecute(50)
    setData(data: any) {
        this.validateForm?.reset();
        for (let o in data) {
            const control = this.validateForm?.controls[o];
            if (control) {
                control.setValue(data[o]);
            }
            const { commands } = this.customComponents[o] || {};
            if (commands) {
                commands.next({ type: 'setData', data: data[o] });
            }
        }
    }

    handleItem(item: ReactiveFormItem) {
        const { required } = item;
        const defaults = item?.defaults ?? '';
        if (required && !item.validates?.includes('required')) {
            item.validates = ['required', ...(item.validates || [])];
        }

        const validates = getValidator(item?.validates, item?.validatesArgs);
        const asyncValidates = getAsyncValidator(item?.asyncValidates);
        if (item.injector) {
            const emitter = new EventEmitter();
            const commands = new Subject<ComponentCommand>();
            this.customComponents[item.name] = { emitter, commands };
            const providers = [
                { provide: FORM_EMITTER, useValue: emitter },
                { provide: FORM_COMMANDS, useValue: commands },
                { provide: FORM_DATA, useValue: this.getInitValue(item.name) },
            ];
            if (item.params) {
                providers.push({ provide: FORM_PARAMS, useValue: item.params });
            }
            item.injector = Injector.create({
                providers,
                parent: item.injector,
            });
            emitter.pipe(takeUntil(this.destroy$)).subscribe(val => {
                this.customRow[item.name] = val;
                this.doChange();
            });
        }
        return [defaults, validates, asyncValidates];
    }

    @debounceExecute(30)
    doChange() {
        const row = this.getValues();
        this.change(row);
        this.rowChange.emit(row);
    }

    createForm(items: ReactiveFormItem[]) {
        const fbObj: Record<string, any> = items.reduce((acc: Record<string, any>, item) => {
            acc[item.name] = this.handleItem(item);
            return acc;
        }, {});
        this.validateForm = this.fb.group(fbObj);
        this.validateForm.valueChanges.subscribe(val => {
            this.doChange();
        });
        this.validateForm.statusChanges.subscribe((status: FormControlStatus) => {
            if (this.parent && this.name) {
                if (status === 'INVALID') {
                    const parentControl = this.parent?.validateForm?.controls[this.name];
                    if (parentControl) {
                        parentControl.setErrors({ subForm: 'invalid' });
                    }
                }
            }
        });
    }

    getInitValue(name: string) {
        return this._row && this._row[name] ? this._row[name] : undefined;
    }

    setControl() {
        const { hides, disableds } = this._control || {};
        if (hides && hides.length) {
            for (let hide of hides) {
                this.setHideControl(hide);
            }
        }
        if (disableds && disableds.length) {
            for (let disabled of disableds) {
                this.setDisabledControl(disabled);
            }
        }
    }

    setDisabledControl(hide: FormDisabled) {
        const { field, rules } = hide;
        const control = this.validateForm?.controls[field];
        let prevValue: any;
        if (control) {
            control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
                if (val === prevValue) {
                    return;
                }
                prevValue = val;
                const columns = rules.reduce((acc: string[], rule: ControlRules) => {
                    acc.push(...rule.columns);
                    return acc;
                }, []);
                this.setDisabled(columns, false);
                for (let rule of rules) {
                    if (rule.value === val) {
                        this.setDisabled(rule.columns, true);
                        break;
                    }
                }
                this.cdr.detectChanges();
            });
        }
    }

    setDisabled(columns: string[], isDisabled: boolean) {
        for (let column of columns) {
            const control = this.validateForm?.controls[column];
            if (control) {
                isDisabled ? control.disable() : control.enable();
            }
        }
    }

    setHideControl(hide: FormHide) {
        const { field, rules } = hide;
        const control = this.validateForm?.controls[field];
        let prevValue: any;
        if (control) {
            control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
                if (val === prevValue) {
                    return;
                }
                prevValue = val;
                const columns = rules.reduce((acc: string[], rule: ControlRules) => {
                    acc.push(...rule.columns);
                    return acc;
                }, []);
                this.setVisible(columns, false);
                for (let rule of rules) {
                    if (rule.value === val) {
                        this.setVisible(rule.columns, true);
                        break;
                    }
                }
                this.cdr.detectChanges();
            });
        }
    }

    setVisible(columns: string[], isShow: boolean) {
        for (let item of this._items) {
            if (columns.includes(item.name)) {
                item.isHide = !isShow;
            }
        }
        for (let column of columns) {
            const control = this.validateForm?.controls[column];
            if (isShow && !control) {
                const field = this._items.find(item => item.name === column);
                if (field) {
                    const [defaults, validates, asyncValidates] = this.handleItem(field);
                    this.validateForm?.addControl(column, new FormControl(defaults, validates, asyncValidates));
                }
            } else if (!isShow && control) {
                this.validateForm?.removeControl(column);
            }
        }
    }

    getValues() {
        if (!this.validateForm) return { ...this.customRow };
        const { controls } = this.validateForm;
        const res: any = {};
        for (let o in controls) {
            res[o] = controls[o].value;
        }
        return { ...res, ...this.customRow };
    }

    getError(item: ReactiveFormItem) {
        if (!this.validateForm) return;
        const { controls = {} } = this.validateForm;
        const control = controls[item.name];
        const errors = control.errors;
        if (!errors || control.untouched) {
            return [];
        }
        if (errors['required']) {
            errors['required'] = `the {label} is required`;
        }
        if (errors['subForm']) {
            delete errors['subForm'];
        }
        if (control.untouched && !this.showError) {
            delete errors['required'];
        }
        return Object.values(errors).map(str =>
            str.replace(/{([^}]+)}/g, (match: string, variable: string) => {
                if (variable === 'label') {
                    return item[variable] || item.name || match;
                }
                return item[variable] || match;
            })
        );
    }

    setShowError(bool: boolean) {
        this.showError = bool;
        for (let o in this.validateForm?.controls) {
            this.validateForm?.controls[o]?.markAsTouched();
        }
        this.validateForm?.markAsTouched();
        if (this.subForms) {
            for (const form of this.subForms) {
                form.setShowError(bool);
            }
        }
        this.cdr.detectChanges();
    }

    getContent(item: ReactiveFormItem) {
        if (!item.content) {
            return '';
        }
        if (typeof item.content === 'function') {
            return item.content.call(this);
        } else {
            return item.content;
        }
    }
}
