import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../pipes';
import { FormComponent } from './form.component';
import { TemplateModule } from '../template/template.module';
import { ListModule } from '../list/list.module';

const COMPONENTS = [FormComponent];
@NgModule({
  declarations: COMPONENTS,
  imports: [SharedModule, PipesModule, TemplateModule, ListModule],
  exports: COMPONENTS,
})
export class FormModule {}
