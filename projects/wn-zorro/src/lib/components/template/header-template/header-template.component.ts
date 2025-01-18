import { ChangeDetectorRef, Component, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { TemplateService } from '../template.service';
import { ModalHeader } from '../../../../types/template';

@Component({
  standalone: false,
  selector: 'wn-header-template',
  templateUrl: './header-template.component.html',
  styleUrls: ['./header-template.component.less'],
})
export class HeaderTemplateComponent {
  headerVars: ModalHeader[] = [];
  @ViewChildren('header') headers?: QueryList<TemplateRef<any>>;
  constructor(
    private template: TemplateService,
    private cdr: ChangeDetectorRef
  ) {
    this.template.headerVar$.subscribe((headerVar) => {
      if (headerVar) {
        const existed = this.headerVars.find((item) => item.title === headerVar.title);
        if (!existed) {
          this.headerVars.push(headerVar);
          this.cdr.detectChanges();
        }
        this.emitTemplate(headerVar);
      }
    });
  }

  emitTemplate(headerVar: ModalHeader, attempt = 0) {
    if (!this.headers || this.headers.length === 0) {
      // If headers not ready, try again after short delay (max 5 attempts)
      if (attempt < 5) {
        setTimeout(() => this.emitTemplate(headerVar, attempt + 1), 50);
      }
      return;
    }

    const index = this.headerVars.findIndex((item) => item.title === headerVar.title);
    if (index < 0) {
      return;
    }

    const template = this.headers.get(index);
    if (template) {
      this.template.header$.next({
        key: headerVar.key!,
        template: template,
      });
    } else if (attempt < 5) {
      // If template not found, try again after short delay
      setTimeout(() => this.emitTemplate(headerVar, attempt + 1), 50);
    }
  }
}
