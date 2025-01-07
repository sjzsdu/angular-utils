import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[appScrollTo]',
    standalone: true,
    exportAs: 'appScrollTo',
})
export class ScrollToDirective {
    constructor(private el: ElementRef) {}

    scrollToTarget(targetSelector?: string) {
        let targetElement: HTMLElement | null = null;

        // If no parameter is provided, scroll to the element of the current directive
        if (!targetSelector) {
            targetElement = this.el.nativeElement;
        }
        // Support ID selector
        else if (targetSelector.startsWith('#')) {
            targetElement = document.getElementById(targetSelector.substring(1));
        }
        // Support class selector
        else if (targetSelector.startsWith('.')) {
            targetElement = document.querySelector(targetSelector);
        }

        // If the target element is not found, log a warning
        if (!targetElement) {
            console.warn(`Target element "${targetSelector}" not found.`);
            return;
        }

        const parentElement = this.findClosestScrollableParent(this.el.nativeElement);
        if (parentElement) {
            const targetRect = targetElement.getBoundingClientRect();
            const parentRect = parentElement.getBoundingClientRect();

            const targetTopRelativeToParent = targetRect.top - parentRect.top + parentElement.scrollTop;

            parentElement.scrollTo({
                top: targetTopRelativeToParent,
                behavior: 'smooth',
            });
        }
    }

    private findClosestScrollableParent(element: HTMLElement): HTMLElement | null {
        let parent = element.parentElement;
        while (parent) {
            const overflowY = window.getComputedStyle(parent).overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll') {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null; // If no scrollable parent is found
    }
}
