import { Component, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IColumn, IData } from '../type';
import { LabelPipe, PipesModule } from '../../../pipes';

@Component({
  selector: 'wn-frontend-table',
  imports: [NzTableModule, PipesModule],
  templateUrl: './frontend-table.component.html',
  styleUrl: './frontend-table.component.less',
})
export class FrontendTableComponent {
  nzData = input<IData>([]);
  columns = input<IColumn[]>([]);
}
