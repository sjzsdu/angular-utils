import { ChangeDetectorRef, Component, Directive, inject, TemplateRef } from '@angular/core';
import { TemplateService } from './template.service';
import { TemplateCategory } from 'projects/wn-zorro/src/types/template';

const TIMEOUT = 50;

@Component({
  template: '',
})
export abstract class BaseTemplateComponent<T> {
  templateVars: T[] = [];
  protected template = inject(TemplateService);
  protected cdr = inject(ChangeDetectorRef);

  abstract readonly prefixKey: TemplateCategory;
  abstract getTemplates(): readonly TemplateRef<any>[];

  constructor() {
    this.template.templateVar$.subscribe((templateVar) => {
      if (templateVar && templateVar.key!.startsWith(this.prefixKey)) {
        const existed = this.templateVars.find((item) => (item as any).key === templateVar.key);
        if (!existed) {
          this.templateVars.push(templateVar as T);
          this.cdr.detectChanges();
        }
        this.emitTemplate(templateVar as T);
      }
    });
  }

  emitTemplate(templateVar: T, attempt = 0) {
    const templates = this.getTemplates();
    if (!templates?.length) {
      if (attempt < 5) {
        setTimeout(() => this.emitTemplate(templateVar, attempt + 1), TIMEOUT);
      }
      return;
    }

    const index = this.templateVars.findIndex((item) => (item as any).key === (templateVar as any).key);
    if (index < 0) {
      return;
    }

    const template = templates[index];
    if (template) {
      this.template.template$.next({
        key: (templateVar as any).key,
        template: template,
      });
    } else if (attempt < 5) {
      setTimeout(() => this.emitTemplate(templateVar, attempt + 1), TIMEOUT);
    }
  }
}
