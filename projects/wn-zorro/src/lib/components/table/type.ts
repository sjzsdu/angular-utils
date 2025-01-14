import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { LabelFunc } from '../../pipes';

export interface IRowStatus {
  disabled?: boolean;
}

export type IRow = Record<string, any> & IRowStatus;

export type IData = Array<IRow>;

export type ColumnMap = {
  text: {};
};

export type IColumn<K extends IRow> = {
  [T in keyof ColumnMap]: {
    name: string;
    title?: string;
    titleFunc?: LabelFunc;
    type: T;
    params: ColumnMap[T];
    sortFilter?: {
      sortOrder: NzTableSortOrder | null;
      sortFn: NzTableSortFn<K> | null;
      listOfFilter: NzTableFilterList;
      filterFn: NzTableFilterFn<K> | null;
      filterMultiple: boolean;
      sortDirections: NzTableSortOrder[];
    };
  };
}[keyof ColumnMap];
