import { Component, EventEmitter, Injector } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FORM_COMMANDS, FORM_DATA, FORM_EMITTER, FORM_PARAMS } from './constant';
import { Subject } from 'rxjs';
import { AnyObject, ComponentCommand, ReactiveFormParams } from './types';

@Component({
    template: '',
})
export abstract class BaseAccessorComponent<T> implements ControlValueAccessor {
    public innerValue?: T;
    public innerParams?: ReactiveFormParams = {};

    onChange?: (_: any) => void;
    onTouched?: () => void;
    formEmitter?: EventEmitter<any>;
    [key: string]: any;

    constructor(injector: Injector) {
        const options = { optional: true };
        this.formEmitter = injector.get(FORM_EMITTER, undefined, options) as EventEmitter<any>;
        const value = injector.get(FORM_DATA, undefined, options) as T;
        if (value) {
            this.writeValue(value);
        }
        const params = injector.get(FORM_PARAMS, undefined, options) as AnyObject;
        if (params) {
            this.writeParams(params);
        }

        const commands = injector.get(FORM_COMMANDS, undefined, options) as Subject<ComponentCommand>;
        if (commands) {
            commands.subscribe((res: ComponentCommand) => {
                if (res && res.type) {
                    const func = this[res.type];
                    if (func) {
                        func.call(this, res?.data);
                    }
                }
            });
        }
    }

    writeValue(value: T): void {
        this.innerValue = value;
    }

    writeParams(params: ReactiveFormParams): void {
        this.innerParams = params;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    protected change(value?: T): void {
        if (this.onChange) {
            this.onChange(value);
        }
        this.formEmitter?.emit(value);
    }
}
