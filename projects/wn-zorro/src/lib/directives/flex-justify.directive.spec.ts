import { FlexJustifyDirective } from './flex-justify.directive';
import { ElementRef } from '@angular/core';

describe('FlexJustifyDirective', () => {
    it('should create an instance', () => {
        const elementRef = new ElementRef(document.createElement('div'));
        const directive = new FlexJustifyDirective(elementRef);
        expect(directive).toBeTruthy();
    });
});
