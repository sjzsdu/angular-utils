import { Component, inject, TemplateRef, viewChildren } from '@angular/core';
import { ModalHeader, TemplateCategory } from 'projects/wn-zorro/src/types/template';
import { BaseTemplateComponent } from '../base-template';
import { NzIconService } from 'ng-zorro-antd/icon';
import { HolderOutline } from '@ant-design/icons-angular/icons';

@Component({
  standalone: false,
  selector: 'wn-header-template',
  templateUrl: './header-template.component.html',
  styleUrls: ['./header-template.component.less'],
})
export class HeaderTemplateComponent extends BaseTemplateComponent<ModalHeader> {
  readonly prefixKey = TemplateCategory.HEADER;
  templates = viewChildren<TemplateRef<any>>('header');

  iconService = inject(NzIconService);
  constructor() {
    super();
    this.iconService.addIcon(HolderOutline);
  }

  getTemplates() {
    return this.templates();
  }
}
