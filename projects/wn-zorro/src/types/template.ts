import { TemplateRef } from '@angular/core';

export interface ModalHeader {
  title: string;
  key?: string;
  pathKey?: string;
  anchorPoint?: string;
  noTemp?: boolean;
}

export interface ModalHeaderTemplate {
  key: string;
  template: TemplateRef<any>;
}
