import { LabelFunc } from '../../pipes';

export interface IRowStatus {
  disabled?: boolean;
}

export type IRow = Record<string, any> & IRowStatus;

export type IData = Array<IRow>;

export type ColumnMap = {
  text: {};
};

export type IColumn = {
  [T in keyof ColumnMap]: {
    name: string;
    title?: string;
    titleFunc?: LabelFunc;
    type: T;
    params: ColumnMap[T];
  };
}[keyof ColumnMap];
