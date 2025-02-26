import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[wnBlurOnClick]',
  standalone: true,
  exportAs: 'exitAllEvent',
})
export class BlurOnClickDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.el.nativeElement.blur();
  }
}
