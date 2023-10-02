import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpaceModule } from 'ng-zorro-antd/space';


const SharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NzButtonModule,
  NzIconModule,
  NzInputModule,
  NzDividerModule,
  NzOutletModule,
  NzFormModule,
  NzSelectModule,
  NzGridModule,
  NzRadioModule,
  NzDropDownModule,
  NzDrawerModule,
  NzModalModule,
  NzInputNumberModule,
  NzSpaceModule,
]

@NgModule({
  declarations: [],
  imports: SharedModules,
  exports: SharedModules
})
export class SharedModule { }
