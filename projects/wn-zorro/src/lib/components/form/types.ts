import { EventEmitter, Injector, TemplateRef, Type } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { NzFormLayoutType } from 'ng-zorro-antd/form';
import { NzSelectModeType } from 'ng-zorro-antd/select';
import { Subject } from 'rxjs';
import { NzAutosizeDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzCascaderComponent } from 'ng-zorro-antd/cascader';
import { NzRadioGroupComponent } from 'ng-zorro-antd/radio';
import { ExtractInputTypes } from '../../types';

type IInputGroup = Pick<NzInputGroupComponent, 'nzAddOnBefore' | 'nzAddOnAfter'>;

export interface ISubForm {
  children: FormItem[];
  control: FormController;
  addTitle: string;
  itemCount: number;
  itemSpan: number;
}
export type ComponentParamsMap = {
  input: IInputGroup;
  textarea: IInputGroup & Pick<NzAutosizeDirective, 'nzAutosize'>;
  number: IInputGroup & ExtractInputTypes<NzInputNumberComponent>;
  checkbox: { tooltip: string; label: string };
  cascade: Pick<NzCascaderComponent, 'nzOptions'> & IInputGroup;
  select: {
    nzMode?: NzSelectModeType;
    nzOptions?: OptioinItem[];
    addOption?: {
      text: string;
      onClick: () => void;
    };
  };
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
};

export interface OptItem {
  label: string;
  value: string;
}
export type OptioinItem = string | OptItem;

export type ValidateStore = Record<string, ValidatorFn | ((...rest: any) => ValidatorFn)>;
export type AsyncValidateStore = Record<string, AsyncValidatorFn>;

export interface ILabel {
  label?: string;
  labelFunc?: string;
  hideLabel?: boolean;
  tooltip?: string | TemplateRef<any>;
  tooltipPlacement?: string;
  help?: string;
  helpPath?: string;
}

export type FormItem = {
  [T in keyof ComponentParamsMap]: {
    name: string;
    type: T;
    params: ComponentParamsMap[T];
    label?: ILabel;
    placeholder?: string;
    defaults?: any;
    disabled?: boolean;
    validates?: string[];
    validatesArgs?: Record<string, any[]>;
    asyncValidates?: string[];

    itemSpan?: number;
    isHide?: boolean;
    span?: number;
    required?: boolean;
    current: any;
    formParams: any[];
  };
}[keyof ComponentParamsMap];

export interface ControlRules {
  value: any;
  columns: string[];
  values?: any[];
}

export interface FormHide {
  field: string;
  rules: ControlRules[];
}

export interface FormDisabled {
  field: string;
  rules: ControlRules[];
}

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
