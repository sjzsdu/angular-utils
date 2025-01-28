import { Component, input, model, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormController, FormGroupComponent, FormItem, IFormRow } from '@wn-zorro';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLabelAlignType } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'wn-search-form',
  imports: [FormGroupComponent, NzGridModule, NzButtonModule, NzIconModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.less',
})
export class SearchFormComponent {
  name = input('');
  items = input.required<FormItem[]>();
  control = input<FormController>();
  row = model<IFormRow>();
  group = input<FormGroup | null>(null);
  formGroup?: FormGroup;

  // form
  layout = input<'horizontal' | 'vertical' | 'inline'>('vertical');
  labelSpan = input<number>();
  controlSpan = input<number>();
  showSubmit = input(false);
  itemSpan = input(6);

  // label
  nzNoColon = input(false);
  nzLabelAlign = input<NzLabelAlignType>('right');
  nzLabelWrap = input(false);

  isCollapse = signal(false);

  onFormChange(row: Record<string, any>) {
    console.log('row', row);
  }
}
