import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[wnAutoFocus]',
  standalone: true,
  exportAs: 'wnAutoFocus',
})
export class AutoFocusDirective implements AfterViewInit {
  @Input() fcAutoFocus: '' | boolean = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.fcAutoFocus !== false) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 0);
    }
  }
}
