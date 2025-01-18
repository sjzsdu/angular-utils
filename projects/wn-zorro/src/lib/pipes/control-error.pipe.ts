import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { FormItem } from '../../types';
import { LabelPipe } from './label.pipe';

@Pipe({
  name: 'controlError',
  standalone: false,
})
export class ControlErrorPipe implements PipeTransform {
  constructor(private labelPipe: LabelPipe) {}

  transform(errors: ValidationErrors | null, item: FormItem): string {
    if (!errors) {
      return '';
    }
    for (const [key, error] of Object.entries(errors)) {
      if (typeof error === 'string') {
        return error.replace(/{([^}]+)}/g, (match: string, variable: string) => {
          if (variable === 'label') {
            return (
              item.label?.label ||
              this.labelPipe.transform(item.name, item.label?.labelFunc || 'WordUppercase') ||
              match
            );
          }
          return item[variable as keyof FormItem] || match;
        });
      }
    }
    return '';
  }
}
