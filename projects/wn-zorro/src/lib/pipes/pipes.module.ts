import { NgModule } from '@angular/core';
import { LabelPipe } from './label.pipe';
import { ControlErrorPipe } from './control-error.pipe';

const PIPES = [LabelPipe, ControlErrorPipe];
@NgModule({
  declarations: PIPES,
  imports: [],
  exports: PIPES,
})
export class PipesModule {}
