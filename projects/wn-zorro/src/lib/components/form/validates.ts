/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AsyncValidateStore, FormItem, ValidateStore } from '../edit/types';

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
    if (typeof reg === 'string') {
      reg = new RegExp(reg);
    }
    if (!reg || !(reg instanceof RegExp)) {
      return null;
    }
    return !reg.test(control.value) ? { exclude: 'the {label} format is not correct' } : null;
  };
}

function json(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  try {
    JSON.parse(control.value);
    return null;
  } catch (e: any) {
    return { json: 'the {label} should be a json string' };
  }
}

function requiredSubform(keys?: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!keys) {
      return !control.value ? { required: 'The {label} is required' } : null;
    } else {
      const row = control.value;
      if (!row) {
        return { required: 'The {label} is required' };
      }
      return keys.every((key) => !!row[key] || row[key] === 0) ? null : { required: 'The {label} is required' };
    }
  };
}

function nonZero(control: AbstractControl): ValidationErrors | null {
  if (control.value === '' || control.value === null || control.value === undefined) {
    return null;
  }
  const isNonZero = Number(control.value) !== 0;
  return isNonZero ? null : { nonZero: 'the {label} should be none zero' };
}

function integer(control: AbstractControl): ValidationErrors | null {
  const isInteger = Number.isInteger(control.value);
  return isInteger ? null : { integer: 'the {label} should be integer' };
}

function allNumber(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const arr = Array.isArray(control.value) ? control.value : [control.value];
  const isAllNumber = arr.every((item) => {
    const vals = Object.values(item);
    return vals.every((sitem) => typeof sitem === 'number' || (!isNaN(sitem as number) && sitem !== ''));
  });
  return isAllNumber ? null : { allNumber: 'the {label} should be all number' };
}

function minCount(count: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    return control.value.length >= count ? null : { minLength: 'the length of {label} must be more than ' + count };
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
        return sval >= tval ? null : { compare: `the {label} should be greater than or equal to the ${target}` };
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
  min: Validators.min,
  max: Validators.max,
  minLength: Validators.minLength,
  maxLength: Validators.maxLength,
  nonZero,
  integer,
  allNumber,
  minCount,
  requiredSubform,
  exclude,
  regexp,
  compare,
  json,
};

export function registerValidator(key: string, validator: ValidatorFn) {
  validatorStore[key] = validator;
}

function getValidators<T extends ValidatorFn | AsyncValidatorFn>(
  store: Record<string, T | ((...rest: any[]) => T)>,
  key?: string | string[],
  args?: Record<string, any[]>
): T[] {
  if (!key) {
    return [];
  }
  const keys = Array.isArray(key) ? key : [key];
  const validates = keys
    .map((item) => {
      const validator = store[item];
      if (!validator) {
        return;
      }
      if (args) {
        const _validator = validator as (...rest: any) => T;
        const arg = args[item];
        return arg ? _validator.apply(null, arg) : _validator;
      }
      return validator as T;
    })
    .filter((item) => !!item);
  return validates as T[];
}

export function getValidator(key?: string | string[], args?: Record<string, any[]>): ValidatorFn[] {
  return getValidators<ValidatorFn>(validatorStore, key, args);
}

// this is asyncValidates Function
export const asyncValidatorStore: AsyncValidateStore = {};

export function registerAsyncValidator(key: string, validator: AsyncValidatorFn) {
  asyncValidatorStore[key] = validator;
}

export function getAsyncValidator(key?: string | string[], args?: Record<string, any[]>): AsyncValidatorFn[] {
  return getValidators<AsyncValidatorFn>(asyncValidatorStore, key, args);
}

export function ValidateReactiveFormData(items: FormItem[], row: any) {
  const errors: Record<string, string> = {};
  const validateForm = (items: FormItem[], row: any) => {
    if (!row) {
      return;
    }
    for (const item of items) {
      if (item.isHide) {
        continue;
      }
      if (item.required && !validateValue(item.type, row[item.name])) {
        errors[item.name] = `the ${item.label ?? item.name} must be required`;
      }
      const { validates, validatesArgs = {} } = item;
      if (validates?.length) {
        const validators = getValidator(validates, validatesArgs);
        for (const valid of validators) {
          const result = valid.call(null, { value: row[item.name] } as AbstractControl);
          if (result) {
            const firstKey = Object.keys(result)[0];
            const first = result[firstKey];
            errors[item.name] =
              typeof first === 'string'
                ? first.replace('{label}', item?.label?.label ?? item.name)
                : `the ${firstKey} of ${item.label ?? item.name} should be ${first[firstKey]}`;
          }
        }
      }
      // if ((item?.params?.componentInstance as any)?.ValidateData) {
      //   const error = (item?.params?.componentInstance as any).ValidateData(row[item.name]);
      //   if (error) {
      //     errors[item.name] = error;
      //   }
      // }
      // if (item?.params?.children?.length) {
      //   if (item.type === 'arrayForm' || item.type === 'formArray') {
      //     if (Array.isArray(row[item.name])) {
      //       for (const itemRow of row[item.name]) {
      //         validateForm(item.params.children, itemRow);
      //       }
      //     }
      //   } else {
      //     validateForm(item.params.children, row[item.name]);
      //   }
      // }
    }
  };
  validateForm(items, row);
  if (Object.values(errors).length) {
    return Object.values(errors)[0];
  }
  return false;
}

type ValidatesMap = Record<string, (val: any) => boolean>;

const validatesMap: ValidatesMap = {
  range: (val: any) => {
    const valid = Array.isArray(val) && val.length === 2 && typeof val[0] === 'number' && typeof val[1] === 'number';
    return valid && val[1] > val[0];
  },
  number: (val: any) => {
    return typeof val === 'number';
  },
  input: (val: any) => {
    return val !== '';
  },
  custom: (val: any) => {
    return !!val;
  },
  sortedSelect: (val: any[] | any) => {
    return Array.isArray(val) ? val.every((item) => !!item) : !!val;
  },
};

export function validateValue(type?: string, value?: any) {
  if (type && validatesMap[type]) {
    return validatesMap[type](value);
  }
  return validatesMap['custom'](value);
}
