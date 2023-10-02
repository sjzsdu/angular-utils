import { Component } from '@angular/core';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { FormModalService } from 'projects/core/src/lib/components/form/form-modal.service';
import { ReactiveFormItem } from 'projects/core/src/lib/components/form/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [NzDestroyService]
})
export class AppComponent {
  title = 'angular-utils';
  formItems: ReactiveFormItem[] = [
    {name: 'name', type: 'input' }, 
    {name: 'job', type: 'input' }, 
  ]
  constructor(
    private modal: FormModalService,
    private destroy$: NzDestroyService,
  ) {}
  onOpen() {
    this.modal.modalForm(
      this.formItems,
      undefined,
      this.destroy$
    ).then(res => {
      console.log('mdoal row', res);
    })
  }

  onChange(row: any) {
    console.log('form value', row);
  }
}
