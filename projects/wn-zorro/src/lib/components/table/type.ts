import { LabelFunc } from '../../pipes';

export type IRow = Record<string, any>;

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
