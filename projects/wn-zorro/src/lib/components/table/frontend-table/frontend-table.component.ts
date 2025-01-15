import { Component, computed, input, signal, TemplateRef } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IColumn, IRow } from '../type';
import { PipesModule } from '../../../pipes';
import { CopyTextComponent } from '../../view/copy-text/copy-text.component';

@Component({
  selector: 'wn-frontend-table',
  imports: [NzTableModule, PipesModule, CopyTextComponent],
  templateUrl: './frontend-table.component.html',
})
export class FrontendTableComponent<T extends IRow> {
  nzData = input<T[]>([]);
  columns = input<IColumn<T>[]>([]);
  nzSelections = input<Array<{ text: string; onSelect(...args: any[]): any }>>([]);
  nzSize = input<'middle' | 'small' | 'default'>('default');
  nzBordered = input<boolean>(false);
  nzTitle = input<string | TemplateRef<void> | null>(null);
  nzFooter = input<string | TemplateRef<void> | null>(null);
  nzShowPagination = input(true);
  nzShowSizeChanger = input(false);
  showChecked = input(false);
  nzExpandable = input<boolean>(false);
  mainKey = input('id');
  expandKey = input('description');
  maxHeight = input('');
  maxWidth = input('');

  scroll = computed<{ x?: string; y?: string }>(() => {
    return { x: this.maxWidth(), y: this.maxHeight() };
  });

  // -----------------enable expand------------------
  expandSet = new Set<string | number>();
  mapOfExpandedData: { [key: string]: IRow[] } = {};

  onExpandChange(id: string | number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  //==================enable pagination=============

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
  setOfCheckedId = new Set<string | number>();
  currentPageData = signal<readonly IRow[]>([]);
  updateCheckedSet(id: string | number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onItemChecked(id: string | number, checked: boolean): void {
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
