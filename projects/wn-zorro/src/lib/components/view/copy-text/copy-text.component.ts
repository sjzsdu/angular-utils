import { Component, input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'wn-copy-text',
  imports: [NzToolTipModule, NzIconModule, NzButtonModule],
  templateUrl: './copy-text.component.html',
  styleUrls: ['./copy-text.component.less'],
})
export class CopyTextComponent {
  value = input<string>('');
  copyTip = input<string>('Copy');
  copiedTip = input<string>('Copied!');

  copied = false;

  constructor(
    private clipboard: Clipboard,
    private message: NzMessageService
  ) {}

  copyToClipboard() {
    if (this.value()) {
      this.clipboard.copy(this.value());
      this.copied = true;
      this.message.success(this.copiedTip());
      setTimeout(() => {
        this.copied = false;
      }, 3000);
    }
  }
}
