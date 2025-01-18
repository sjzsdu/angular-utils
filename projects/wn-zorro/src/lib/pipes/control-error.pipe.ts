import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { FormItem } from '../../types';

@Pipe({
  name: 'controlError',
  standalone: false,
})
export class ControlErrorPipe implements PipeTransform {
  transform(errors: ValidationErrors | null, item: FormItem): string {
    if (!errors) {
      return '';
    }
    for (const [key, error] of Object.entries(errors)) {
      if (typeof error === 'string') {
        return error.replace(/{([^}]+)}/g, (match: string, variable: string) => {
          // Type-safe access to FormItem properties
          if (variable === 'label' && item.label) {
            return item.label.label || item.name || match;
          }
          if (variable === 'name' && item.name) {
            return item.name || match;
          }
          return match;
        });
      }
    }
    return '';
  }
}
