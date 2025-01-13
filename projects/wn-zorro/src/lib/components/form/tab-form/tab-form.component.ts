import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Injector, Input, Output } from '@angular/core';
import { FormController, FormItem } from '../types';
import { BaseAccessorComponent } from '../base-accessor';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceExecute } from 'wn-utils';

export interface tabData {
  items: FormItem[];
  initRow?: any;
  row: any;
  control?: FormController;
  title: string;
}

@Component({
  selector: 'wn-tab-form',
  templateUrl: './tab-form.component.html',
  styleUrl: './tab-form.component.less',
  providers: [
    NzDestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TabFormComponent),
      multi: true,
    },
  ],
})
export class TabFormComponent extends BaseAccessorComponent<any[]> {
  selectedIndex = 0;
  tabs: tabData[] = [];
  @Input() items?: FormItem[];
  @Input() control?: FormController;
  @Input() title = 'Instance';
  @Input() formsShowError = false;
  constructor(
    private destroy$: NzDestroyService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
    this.doChange();
  }

  mapFunc(item: any, i: number) {
    return {
      items: this.items ?? [],
      control: this.control,
      initRow: item,
      row: item,
      title: `${this.title} ${i + 1}`,
    };
  }

  newTab(): void {
    this.tabs.push(this.mapFunc({}, this.tabs.length));
    this.selectedIndex = this.tabs.length;
  }

  onTabChange(index: number) {
    console.log('onTabChange', index, this.selectedIndex);
  }

  doChange() {
    const rows = this.tabs.map(({ row }) => row);
    this.change(rows);
  }

  @debounceExecute(30)
  formChange(tab: tabData, row: any) {
    tab.row = row;
    this.doChange();
  }
}
