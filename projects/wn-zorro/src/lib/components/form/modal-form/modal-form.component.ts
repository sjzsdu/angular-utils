import { Component, effect, inject } from '@angular/core';
import { FormController, FormGroupComponent, FormItem, FormModalData, IFormRow } from '@wn-zorro';
import { NzLabelAlignType } from 'ng-zorro-antd/form';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'wn-modal-form',
  imports: [FormGroupComponent],
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.less',
})
export class ModalFormComponent {
  nzModalData: FormModalData = inject(NZ_MODAL_DATA, { optional: true });

  name?: string;
  items?: FormItem[];
  control?: FormController;
  row?: IFormRow;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelSpan?: number;
  controlSpan?: number;
  showSubmit?: boolean;

  // label
  nzNoColon?: boolean;
  nzLabelAlign?: NzLabelAlignType;
  nzLabelWrap?: boolean;

  constructor() {
    effect(() => {
      this.name = this.nzModalData.name ?? '';
      this.items = this.nzModalData.items ?? [];
      this.control = this.nzModalData.control ?? {};
      this.row = this.nzModalData.row ?? {};
      this.layout = this.nzModalData.layout ?? 'vertical';
      this.labelSpan = this.nzModalData.labelSpan ?? 6;
      this.controlSpan = this.nzModalData.controlSpan ?? 18;
      this.showSubmit = this.nzModalData.showSubmit ?? false;
      this.nzNoColon = this.nzModalData.nzNoColon ?? false;
    });
  }
}
