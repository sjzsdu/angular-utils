import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormComponent } from './form.component';
import { LabelPipe } from './label.pipe';



@NgModule({
  declarations: [
    FormComponent,
    LabelPipe
  ],
  imports: [
    SharedModule
  ],
  exports: [FormComponent, LabelPipe]
})
export class FormModule { }
