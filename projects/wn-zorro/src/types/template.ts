import { TemplateRef } from '@angular/core';

export interface BaseTemplateData {
  templateKey: string;
  key?: string;
}

export interface ModalHeader extends BaseTemplateData {
  title?: string;
  pathKey?: string;
  anchorPoint?: string;
  noTemp?: boolean;
  noDrag?: boolean;
}

export interface ModalFooter extends BaseTemplateData {
  okText?: string;
}

export interface ITemplate {
  key: string;
  template: TemplateRef<any>;
}

export const enum TemplateCategory {
  HEADER = 'modal-header',
  FOOTER = 'modal-footer',
}

export interface TemplateCategoryDataMap {
  [TemplateCategory.HEADER]: ModalHeader;
  [TemplateCategory.FOOTER]: ModalFooter;
}

export interface TemplateData<T extends TemplateCategory> {
  category: T;
  data: TemplateCategoryDataMap[T];
}

export type TemplateValues = TemplateCategoryDataMap[keyof TemplateCategoryDataMap];

export type AnyTemplateData = TemplateData<TemplateCategory>;
