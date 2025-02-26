import { ElementRef } from '@angular/core';
import { AutoFocusDirective } from './auto-focus.directive';

describe('AutoFocusDirective', () => {
    it('should create an instance', () => {
        const elementRef = new ElementRef(document.createElement('input'));
        const directive = new AutoFocusDirective(elementRef);
        expect(directive).toBeTruthy();
    });
});
