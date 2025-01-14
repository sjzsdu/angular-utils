import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'wn-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.less'],
})
export class HelpCenterComponent implements OnInit {
  @Input() anchorPoint?: string;
  @Input() pathKey?: string;
  @Input() text: string = 'Help';
  @Input() type?: 'primary' | 'text' | 'link' = 'primary';
  @Input() mode: string = 'button';

  constructor() {}

  ngOnInit(): void {
    console.log('HelpCenterComponent', this.mode);
  }

  open(): void {}

  close(): void {}
}
