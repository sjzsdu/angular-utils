import { NgModule } from '@angular/core';
import { HeaderTemplateComponent } from './header-template/header-template.component';
import { SharedModule } from 'wn-zorro/lib/shared/shared.module';
import { HelpCenterComponent } from './helper-center/help-center.component';

@NgModule({
  declarations: [HeaderTemplateComponent, HelpCenterComponent],
  imports: [SharedModule],
  exports: [HeaderTemplateComponent, HelpCenterComponent],
})
export class TemplateModule {}
