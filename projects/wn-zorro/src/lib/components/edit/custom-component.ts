import { EventEmitter, inject, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FORM_COMMANDS, FORM_DATA, FORM_EMITTER, FORM_PARAMS } from './const';
import { Subject } from 'rxjs';
import { BaseAccessorComponent } from './base-accessor';
import { ComponentCommand } from '../../../types/form';

export class CustomComponent<T = any> extends BaseAccessorComponent<T> implements ControlValueAccessor {
  innerParams = signal<Record<string, any>>({});
  formEmitter?: EventEmitter<any>;
  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    this.formEmitter = inject(FORM_EMITTER, { optional: true }) as EventEmitter<any>;
    const value = inject(FORM_DATA, { optional: true }) as T;
    if (value) {
      this.writeValue(value);
    }
    const params = inject(FORM_PARAMS, { optional: true }) as Record<string, any>;
    if (params) {
      this.innerParams.set(params);
    }
  }

  setCommands() {
    const commands = inject(FORM_COMMANDS, { optional: true }) as Subject<ComponentCommand>;
    if (commands) {
      commands.subscribe((res: ComponentCommand) => {
        if (res && res.type) {
          const method = (this as any)[res.type] as ((data: any) => void) | undefined;
          if (method && typeof method === 'function') {
            method.call(this, res.data);
          }
        }
      });
    }
  }

  override change(value: T): void {
    if (this.onChange) {
      this.onChange(value);
    }
    this.formEmitter?.emit(value);
  }
}
