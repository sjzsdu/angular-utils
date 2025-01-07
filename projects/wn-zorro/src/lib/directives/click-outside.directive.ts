import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[appClickOutside]',
    standalone: true,
    exportAs: 'appClickOutside',
})
export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<HTMLElement>(undefined);
    @Input() excludeClass?: string;

    constructor(private el: ElementRef) {}

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement: HTMLElement): void {
        const clickedInside = this.el.nativeElement.contains(targetElement);
        const clickedExcludedElement = this.excludeClass ? targetElement.classList.contains(this.excludeClass) : false;

        if (!clickedInside && !clickedExcludedElement) {
            this.clickOutside.emit(targetElement);
        }
    }
}
