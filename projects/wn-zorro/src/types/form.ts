import { EventEmitter, Injector, TemplateRef, Type } from '@angular/core';
import { AsyncValidatorFn, FormControl, NgModel } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { NzFormLayoutType } from 'ng-zorro-antd/form';
import { NzSelectModeType, NzSelectSizeType } from 'ng-zorro-antd/select';
import { Subject } from 'rxjs';
import { NzAutosizeDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzCascaderComponent } from 'ng-zorro-antd/cascader';
import { NzRadioComponent, NzRadioGroupComponent } from 'ng-zorro-antd/radio';
import { ExtractInputTypes } from './common';

export interface IFormRowStatus {}
export type IFormRow = Record<string, any> & IFormRowStatus;

type IInputGroup = Pick<NzInputGroupComponent, 'nzAddOnBefore' | 'nzAddOnAfter'>;

export interface ISubForm {
  children: FormItem[];
  control: FormController;
  addTitle: string;
  itemCount: number;
  itemSpan: number;
}

export interface FormGroupConfig {
  items: FormItem[];
  control?: FormController;
  row?: IFormRow;
  layout?: NzFormLayoutType;
  labelSpan?: number;
  controlSpan?: number;
}

export type ComponentParamsMap = {
  input: IInputGroup;
  number: IInputGroup & ExtractInputTypes<NzInputNumberComponent>;
  radio: { options: string[] | OptItem[]; radioButton?: boolean } & Partial<
    Pick<NzRadioGroupComponent, 'nzSize' | 'nzButtonStyle'> & Pick<NzRadioComponent, 'nzDisabled'>
  >;
  checkbox: {};
  checkboxGroup: { options: string[] | OptItem[] };
  select: {
    showSearch?: boolean;
    showArrow?: boolean;
    mode?: NzSelectModeType;
    options?: OptioinItem[];
    maxTagCount?: number;
    size?: NzSelectSizeType;
    addOption?: {
      text: string;
      onClick: () => void;
    };
  };
  groupForm: FormGroupConfig;

  textarea: IInputGroup & Pick<NzAutosizeDirective, 'nzAutosize'>;
  cascade: Pick<NzCascaderComponent, 'nzOptions'> & IInputGroup;
  radioGroup: Pick<NzRadioGroupComponent, 'nzButtonStyle'> & { buttonRadio?: boolean; nzOptions: OptioinItem[] };
  custom: {
    injector: Injector;
    componentInstance: Type<any>;
  };
  tip: { title: string };
  subForm: {
    children: FormItem[];
    control: FormController;
  };
  arrayForm: {
    children: FormItem[];
    control: FormController;
  };
};

export interface OptItem {
  label: string;
  value: string;
  disabled?: boolean;
}
export type OptioinItem = string | OptItem;

export type ValidateStore = Record<string, ValidatorFn | ((...rest: any) => ValidatorFn)>;
export type AsyncValidateStore = Record<string, AsyncValidatorFn | ((...rest: any) => AsyncValidatorFn)>;

export interface ILabel {
  label?: string;
  labelFunc?: string;
  hideLabel?: boolean;
  tooltip?: string | TemplateRef<any>;
  tooltipPlacement?: string;
  help?: string;
  helpPath?: string;
}

export type templateOrString = string | TemplateRef<{ $implicit: FormControl | NgModel }>;

export interface IControl {
  hasFeedback?: boolean;
  validatingTip?: templateOrString;
  errorTip?: templateOrString;
  successTip?: templateOrString;
  warningTip?: templateOrString;
  autoTips?: Record<string, Record<string, string>>;
  disableAutoTips?: boolean;
  extra?: string | TemplateRef<void>;
}

export type FormItem = {
  [T in keyof ComponentParamsMap]: {
    name: string;
    type: T;
    params?: ComponentParamsMap[T];
    label?: ILabel;
    control?: IControl;
    placeholder?: string;
    defaults?: any;
    disabled?: boolean;
    validates?: string[];
    validatesArgs?: Record<string, any[]>;
    asyncValidates?: string[];
    asyncValidatesArgs?: Record<string, any[]>;

    itemSpan?: number;
    isHide?: boolean;
    span?: number;
    required?: boolean;
  };
}[keyof ComponentParamsMap];

export interface ControlRules {
  value: any;
  columns: string[];
  values?: any[];
}

/**
 * Represents the structure for controlling form item visibility.
 * When the value of a specific item in the current row changes,
 * if it matches the 'value' in ControlRules, the items specified
 * in 'columns' will be displayed.
 */
export interface FormHide {
  field: string;
  rules: ControlRules[];
}
/**
 * Represents the control logic for disabling form items
 * Allows disabling specific form items when the value of a specified field meets certain rules
 */
export interface FormDisabled {
  field: string;
  rules: ControlRules[];
}

/**
 * Represents the control logic for resetting form items
 * Allows resetting specific form items when the value of a specified field changes
 */
export interface FormResets {
  field: string;
  columns: string[];
}

export interface FormController {
  hides?: FormHide[];
  disableds?: (FormDisabled | string)[];
  resets?: FormResets[];
}

export interface FormModalData {
  items: FormItem[];
  labelSpan?: number;
  controlSpan?: number;
  itemSpan?: number;
  layout?: NzFormLayoutType;
  row: any;
  control?: FormController;
  isSub?: boolean;
  name?: string;
}

export interface ComponentCommand {
  type: string;
  data?: any;
}

export interface CustomComponentCache {
  commands: Subject<ComponentCommand>;
  emitter: EventEmitter<any>;
}
