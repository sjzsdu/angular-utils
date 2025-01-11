import { EventEmitter, Injector, TemplateRef, Type } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { NzFormControlComponent, NzFormLayoutType } from 'ng-zorro-antd/form';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { Subject } from 'rxjs';

export type ValidateStore = Record<string, ValidatorFn | ((...rest: any) => ValidatorFn)>;
export type AsyncValidateStore = Record<string, AsyncValidatorFn>;

export interface FormItem extends Partial<NzFormControlComponent> {
  name: string;
  type?: string;
  label?: string;
  labelFunc?: string;
  tooltip?: string | TemplateRef<any>;
  tooltipPlacement?: string;
  defaults?: any;
  required?: boolean;
  disabled?: boolean;
  validates?: string[];
  validatesArgs?: Record<string, any[]>;
  asyncValidates?: string[];
  options?: number[] | string[] | NzSelectOptionInterface[];
  children?: FormItem[];
  span?: number;
  hideLabel?: boolean;
  itemSpan?: number;
  isHide?: boolean;
  componentInstance?: Type<any>;
  params?: any;
  injector?: Injector;
  content?: string | TemplateRef<any> | (() => TemplateRef<any>);
  addText?: string;
  placeholder?: string;
  control?: FormController;
  current?: any;
  onAdd?: (callback?: (...rest: any) => any) => void;
  [key: string]: any;
}

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
