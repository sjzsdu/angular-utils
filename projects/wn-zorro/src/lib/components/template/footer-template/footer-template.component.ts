import { Component, TemplateRef, viewChildren } from '@angular/core';
import { ModalFooter, TemplateCategory } from 'projects/wn-zorro/src/types/template';
import { BaseTemplateComponent } from '../base-template';

@Component({
  standalone: false,
  selector: 'wn-footer-template',
  templateUrl: './footer-template.component.html',
  styleUrl: './footer-template.component.less',
})
export class FooterTemplateComponent extends BaseTemplateComponent<ModalFooter> {
  readonly prefixKey = TemplateCategory.FOOTER;
  templates = viewChildren<TemplateRef<any>>('footer');

  getTemplates() {
    return this.templates();
  }
}
