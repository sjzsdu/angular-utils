import { Component, computed, input, Input } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { ActionItem } from 'projects/wn-zorro/src/types/view';

@Component({
  selector: 'wn-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.less'],
  imports: [NzIconModule, NzDropDownModule, NzSpaceModule],
})
export class ActionsComponent {
  actions = input<ActionItem[]>([]);
  moreActions = input<ActionItem[]>([]);
  params = input<any[]>([]);
  hasMore = computed(() => {
    return this.moreActions().length > 0;
  });

  onAction(act: ActionItem) {
    act.click(...this.params(), act);
  }
}
