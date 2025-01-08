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
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
const sharedModules = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzDividerModule,
    NzOutletModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzGridModule,
    NzRadioModule,
    NzDropDownModule,
    NzDrawerModule,
    NzModalModule,
    NzInputNumberModule,
    NzSpaceModule,
    NzTabsModule,
    NzTreeViewModule,
    NzListModule,
    NzUploadModule,
    NzToolTipModule,
    NzCheckboxModule,
    NzProgressModule,
    NzStepsModule,
    NzSpinModule,
    NzSliderModule,
    NzSwitchModule,
    NzTimelineModule,
    NzCardModule,
    NzCascaderModule,
    NzEmptyModule,
];

@NgModule({
    imports: sharedModules,
    exports: [...sharedModules],
})
export class SharedModule {}
