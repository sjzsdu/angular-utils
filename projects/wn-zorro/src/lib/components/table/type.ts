import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { LabelFunc } from '../../pipes';
import { ExtractInputTypes } from '../../types';
import { CopyTextComponent } from '../view/copy-text/copy-text.component';

export interface IRowStatus {
  disabled?: boolean;
}

export interface ITreeNode {
  level?: number;
  expand?: boolean;
  children?: IRow[];
  parent?: IRow;
}

export type IRow = Record<string, any> & IRowStatus;

export type IData = Array<IRow>;

export type ColumnMap = {
  text: {};
  copy: { valueKey: string };
};

export type IColumn<K extends IRow> = {
  [T in keyof ColumnMap]: {
    name: string;
    title?: string;
    titleFunc?: LabelFunc;
    type: T;
    params: ColumnMap[T];
    width?: string;
    fixLeft?: string | boolean;
    fixRight?: string | boolean;
    sortFilter?: {
      sortOrder: NzTableSortOrder | null;
      sortFn: NzTableSortFn<K> | null;
      sortPriority?: number | boolean;
      listOfFilter: NzTableFilterList;
      filterFn: NzTableFilterFn<K> | null;
      filterMultiple: boolean;
      sortDirections: NzTableSortOrder[];
    };
  };
}[keyof ColumnMap];

export type IServerTableColumns<K extends IRow> = {
  [T in keyof ColumnMap]: {
    name: string;
    title?: string;
    titleFunc?: LabelFunc;
    type: T;
    params: ColumnMap[T];
  };
}[keyof ColumnMap];

export interface ServerTableConfig {
  pageIndexName: string;
  pageSizeName: string;
  sortName: string;
  fitlerName: string;
}
