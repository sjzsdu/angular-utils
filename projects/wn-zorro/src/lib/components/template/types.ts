import { TemplateRef } from '@angular/core';

export interface ModalHeader {
  key?: string;
  title: string;
  pathKey?: string;
  anchorPoint?: string;
  noTemp?: boolean;
}

export interface ModalHeaderTemplate {
  key: string;
  template: TemplateRef<any>;
}
