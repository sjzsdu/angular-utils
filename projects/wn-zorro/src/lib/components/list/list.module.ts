import { NgModule } from '@angular/core';
import { ListWraperComponent } from './list-wraper/list-wraper.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ListWraperComponent],
  imports: [SharedModule, DragDropModule],
  exports: [ListWraperComponent],
})
export class ListModule {}
