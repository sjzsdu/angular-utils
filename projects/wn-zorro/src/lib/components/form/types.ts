import { EventEmitter, Injector, InputSignal, InputSignalWithTransform, TemplateRef, Type } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { NzFormLayoutType } from 'ng-zorro-antd/form';
import { NzSelectModeType } from 'ng-zorro-antd/select';
import { Subject } from 'rxjs';
import { ColorSelectComponent } from './color-select/color-select.component';
import { ArrayFormComponent } from './array-form/array-form.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { CodeMirrorEditorComponent } from './code-mirror-editor/code-mirror-editor.component';
import { FormArrayComponent } from './form-array/form-array.component';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { RangeComponent, RangeConfig } from './range/range.component';
import { SliderComponent, SliderConfig } from './slider/slider.component';
import { SortedSelectComponent } from './sorted-select/sorted-select.component';
import { TabFormComponent } from './tab-form/tab-form.component';
import { UploadComponent } from './upload/upload.component';
import { NzAutosizeDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzCascaderComponent } from 'ng-zorro-antd/cascader';
import { NzRadioGroupComponent } from 'ng-zorro-antd/radio';

export type ExtractInputTypes<T> = {
  [K in keyof T as T[K] extends InputSignal<infer U> | InputSignalWithTransform<infer U, unknown>
    ? K
    : never]: T[K] extends InputSignal<infer U>
    ? U
    : T[K] extends InputSignalWithTransform<infer U, unknown>
      ? U
      : never;
};
export type IColorSelect = ExtractInputTypes<ColorSelectComponent>;
export type IArrayForm = ExtractInputTypes<ArrayFormComponent>;
export type ICheckboxGroup = ExtractInputTypes<CheckboxGroupComponent>;
export type ICodeMirrorEditor = ExtractInputTypes<CodeMirrorEditorComponent>;
export type IFormArray = ExtractInputTypes<FormArrayComponent>;
export type IMarkdownEditor = ExtractInputTypes<MarkdownEditorComponent>;
export type IRange = ExtractInputTypes<RangeComponent>;
export type ISlider = ExtractInputTypes<SliderComponent>;
export type ISortedSelect = ExtractInputTypes<SortedSelectComponent>;
export type ITabForm = ExtractInputTypes<TabFormComponent>;
export type IUpload = ExtractInputTypes<UploadComponent>;

type IInputGroup = Pick<NzInputGroupComponent, 'nzAddOnBefore' | 'nzAddOnAfter'>;

export interface ISubForm {
  children: FormItem[];
  control: FormController;
  addTitle: string;
  itemCount: number;
  itemSpan: number;
}
export type ComponentParamsMap = {
  input: IInputGroup;
  textarea: IInputGroup & Pick<NzAutosizeDirective, 'nzAutosize'>;
  number: IInputGroup & ExtractInputTypes<NzInputNumberComponent>;
  checkbox: { tooltip: string; label: string };
  colorSelect: IColorSelect;
  checkboxGroup: ICheckboxGroup;
  cascade: Pick<NzCascaderComponent, 'nzOptions'> & IInputGroup;
  select: {
    nzMode?: NzSelectModeType;
    nzOptions?: OptioinItem[];
    addOption?: {
      text: string;
      onClick: () => void;
    };
  };
  radioGroup: Pick<NzRadioGroupComponent, 'nzButtonStyle'> & { buttonRadio?: boolean; nzOptions: OptioinItem[] };
  arrayForm: ISubForm;
  tabForm: ISubForm;
  codeMirrorEditor: ICodeMirrorEditor;
  formArray: ISubForm;
  markdownEditor: IMarkdownEditor;
  range: {
    config?: RangeConfig;
    reverse?: boolean;
  };
  slider: {
    config: SliderConfig;
    nzDisabled?: boolean;
  };
  file: {
    accept?: string;
    mode?: 'server' | 'frontend';
    showUploadList?: boolean;
    content?: TemplateRef<any> | string;
  };
  subForm: {
    children: FormItem[];
    control: FormController;
  };
  sortedSelect: ISortedSelect;
  code: {};
  custom: {
    injector: Injector;
    componentInstance: Type<any>;
  };
  tip: { title: string };
};

export interface OptItem {
  label: string;
  value: string;
}
export type OptioinItem = string | OptItem;

export type ValidateStore = Record<string, ValidatorFn | ((...rest: any) => ValidatorFn)>;
export type AsyncValidateStore = Record<string, AsyncValidatorFn>;

export interface ILabel {
  label?: string;
  labelFunc?: string;
  hideLabel?: boolean;
  tooltip?: string | TemplateRef<any>;
  tooltipPlacement?: string;
  help?: string;
  helpPath?: string;
}

export type FormItem = {
  [T in keyof ComponentParamsMap]: {
    name: string;
    type: T;
    params: ComponentParamsMap[T];
    label?: ILabel;
    placeholder?: string;
    defaults?: any;
    disabled?: boolean;
    validates?: string[];
    validatesArgs?: Record<string, any[]>;
    asyncValidates?: string[];

    itemSpan?: number;
    isHide?: boolean;
    span?: number;
    required?: boolean;
  };
}[keyof ComponentParamsMap];

export interface ControlRules {
  value: any;
  columns: string[];
  values?: any[];
}

export interface FormHide {
  field: string;
  rules: ControlRules[];
}

export interface FormDisabled {
  field: string;
  rules: ControlRules[];
}

export interface FormResets {
  field: string;
  columns: string[];
}

export interface FormController {
  hides?: FormHide[];
  disableds?: (FormDisabled | string)[];
  resets?: FormResets[];
}

export interface FormModalData {
  items: FormItem[];
  labelSpan?: number;
  controlSpan?: number;
  itemSpan?: number;
  layout?: NzFormLayoutType;
  row: any;
  control?: FormController;
  isSub?: boolean;
  name?: string;
}

export interface ComponentCommand {
  type: string;
  data?: any;
}

export interface CustomComponentCache {
  commands: Subject<ComponentCommand>;
  emitter: EventEmitter<any>;
}
