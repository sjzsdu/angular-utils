import { Component, input, signal } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IColumn, IRow } from '../type';
import { PipesModule } from '../../../pipes';

@Component({
  selector: 'wn-frontend-table',
  imports: [NzTableModule, PipesModule],
  templateUrl: './frontend-table.component.html',
})
export class FrontendTableComponent<T extends IRow> {
  nzData = input<T[]>([]);
  columns = input<IColumn<T>[]>([]);
  nzSelections = input<Array<{ text: string; onSelect(...args: any[]): any }>>([]);
  nzShowPagination = input(true);
  nzShowSizeChanger = input(false);
  showChecked = input(false);
  mainKey = input('id');

  // -----------------enable pagination------------------
  onCurrentPageDataChange(listOfCurrentPageData: readonly IRow[]): void {
    this.currentPageData.set(listOfCurrentPageData);
    this.refreshCheckedStatus();
  }
  //==================enable pagination=============

  // -----------------enable checkable------------------
  checked = false;
  loading = false;
  indeterminate = false;
  setOfCheckedId = new Set<number | string>();
  currentPageData = signal<readonly IRow[]>([]);
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  onAllChecked(checked: boolean): void {
    this.currentPageData()
      .filter(({ disabled }) => !disabled)
      .forEach(({ [this.mainKey()]: id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    const pageData = this.currentPageData().filter(({ disabled }) => !disabled);
    this.checked = pageData.every(({ [this.mainKey()]: id }) => this.setOfCheckedId.has(id));
    this.indeterminate = pageData.some(({ [this.mainKey()]: id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }
  //==================enable checkable=============
}
