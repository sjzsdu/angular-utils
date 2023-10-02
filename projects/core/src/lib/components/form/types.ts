import { EventEmitter, Injector, TemplateRef, Type } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { NzFormControlComponent, NzFormItemComponent, NzFormLayoutType } from 'ng-zorro-antd/form';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { Subject } from 'rxjs';

export type ValidateStore = Record<string, ValidatorFn | ((...rest: any) => ValidatorFn)>;
export type AsyncValidateStore = Record<string, AsyncValidatorFn>;

export type AnyObject = {
    [key: string]: any;
};

export interface ReactiveFormParams extends AnyObject {
    items?: ReactiveFormItem[];
    labelSpan?: number;
    controlSpan?: number;
    itemSpan?: number;
    layout?: NzFormLayoutType;
    row?: any;
    control?: FormController;
}
export interface ReactiveFormItem extends Partial<NzFormControlComponent> {
    name: string;
    type?: string;
    label?: string;
    labelFunc?: string;
    tooltip?: string;
    defaults?: any;
    required?: boolean;
    validates?: string[];
    validatesArgs?: Record<string, any[]>;
    asyncValidates?: string[];
    options?: string[] | NzSelectOptionInterface[];
    children?: ReactiveFormItem[];
    span?: number;
    hideLabel?: boolean;
    itemSpan?: number;
    isHide?: boolean;
    componentInstance?: Type<any>;
    params?: ReactiveFormParams;
    injector?: Injector;
    content?: string | TemplateRef<any> | (() => TemplateRef<any>);
    [key: string]: any;
}

export interface ControlRules {
    value: any;
    columns: string[];
}

export interface FormHide {
    field: string;
    rules: ControlRules[];
}

export interface FormDisabled {
    field: string;
    rules: ControlRules[];
}

export interface FormController {
    hides?: FormHide[];
    disableds?: FormDisabled[];
}

export interface ComponentCommand {
    type: string;
    data?: any;
}

export interface CustomComponentCache {
    commands: Subject<ComponentCommand>;
    emitter: EventEmitter<any>;
}

