import { NgModule } from '@angular/core';
import { HeaderTemplateComponent } from './header-template/header-template.component';
import { SharedModule } from '../../shared/shared.module';
import { TemplatesIndexComponent } from './templates-index/templates-index.component';
import { FooterTemplateComponent } from './footer-template/footer-template.component';
import { DraggableModalDirective } from '../../directives/dragable.directive';

@NgModule({
  declarations: [HeaderTemplateComponent, FooterTemplateComponent, TemplatesIndexComponent],
  imports: [SharedModule, DraggableModalDirective],
  exports: [TemplatesIndexComponent],
})
export class TemplateModule {}
