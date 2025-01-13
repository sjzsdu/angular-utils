import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'wn-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.less'],
})
export class HelpCenterComponent {
  @Input() anchorPoint?: string;
  @Input() pathKey?: string;
  @Input() text: string = 'Help';
  @Input() type?: 'primary' | 'text' | 'link' = 'primary';
  @Input() mode: string = 'button';

  constructor() {}

  open(): void {}

  close(): void {}
}
