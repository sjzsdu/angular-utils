import { InputSignal, InputSignalWithTransform } from '@angular/core';

export type ExtractInputTypes<T> = Partial<{
  [K in keyof T as T[K] extends InputSignal<infer U> | InputSignalWithTransform<infer U, unknown>
    ? K
    : never]: T[K] extends InputSignal<infer U>
    ? U
    : T[K] extends InputSignalWithTransform<infer U, unknown>
      ? U
      : never;
}>;
