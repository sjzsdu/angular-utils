import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AsyncValidateStore, ValidateStore } from './types';

function getControl(control: AbstractControl, target: string) {
    const controls = control['_parent']?.controls;
    if (!controls) {
        return;
    }
    return controls[target];
}

function exclude(stringArr: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return stringArr.includes(control.value) ? { exclude: 'the {label} should be unique' } : null;
    };
}

function regexp(reg: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }
        return !reg.test(control.value) ? { exclude: 'the {label} format is not correct' } : null;
    };
}

function requiredSubform(keys?: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!keys) {
            return !control.value ? { required: 'the {label} is required' } : null;
        } else {
            const row = control.value;
            if (!row) {
                return { required: 'the {label} is required' };
            }
            return keys.every(key => !!row[key] || row[key] === 0) ? null : { required: 'the {label} is required' };
        }
    };
}

function compare(target: string, type: '>' | '==' | '>=' | '<' | '<='): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const targetControl = getControl(control, target);
        if (
            !targetControl ||
            (!targetControl.value && targetControl.value !== 0) ||
            (!control.value && control.value !== 0)
        ) {
            return null;
        }
        const tval = Number(targetControl.value);
        const sval = Number(control.value);
        switch (type) {
            case '>':
                return sval > tval ? null : { compare: `the {label} should be greater than the ${target}` };
            case '>=':
                return sval >= tval
                    ? null
                    : { compare: `the {label} should be greater than or equal to the ${target}` };
            case '==':
                return sval == tval ? null : { compare: `the {label} should be equal to the ${target}` };
            case '<':
                return sval < tval ? null : { compare: `the {label} should be less than the ${target}` };
            case '<=':
                return sval <= tval ? null : { compare: `the {label} should be less than or equal to the ${target}` };
            default:
                return null;
        }
    };
}

// this is sync validates function
export const validatorStore: ValidateStore = {
    required: Validators.required,
    requiredSubform,
    exclude,
    regexp,
    compare,
};

export function registerValidator(key: string, validator: ValidatorFn) {
    validatorStore[key] = validator;
}

export function getValidator(key?: string | string[], args?: Record<string, any[]>): ValidatorFn[] {
    if (!key) {
        return [];
    }
    const keys = Array.isArray(key) ? key : [key];
    const validates = keys
        .map(item => {
            const validator = validatorStore[item];
            if (!validator) {
                return;
            }
            if (args) {
                const arg = args[item];
                return arg ? validator.apply(null, arg) : validator;
            }
            return validator as ValidatorFn;
        })
        .filter(item => !!item);
    return validates as ValidatorFn[];
}

export const asyncValidatorStore: AsyncValidateStore = {};

export function registerAsyncValidator(key: string, validator: AsyncValidatorFn) {
    asyncValidatorStore[key] = validator;
}

export function getAsyncValidator(key?: string | string[]): AsyncValidatorFn[] {
    if (!key) {
        return [];
    }
    const keys = Array.isArray(key) ? key : [key];
    return keys.map(item => asyncValidatorStore[item] || '').filter(item => !!item);
}
