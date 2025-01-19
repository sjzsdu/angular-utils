import { deepCloneJSON } from '@wn-helper';

export function pickItems<T extends { [key: string]: any }>(items: T[], keys: string[], key = 'name') {
  return deepCloneJSON(items.filter((item) => !keys.length || keys.includes(item[key])));
}
