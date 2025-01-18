import { NgModule } from '@angular/core';
import { HeaderTemplateComponent } from './header-template/header-template.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [HeaderTemplateComponent],
  imports: [SharedModule],
  exports: [HeaderTemplateComponent],
})
export class TemplateModule {}
