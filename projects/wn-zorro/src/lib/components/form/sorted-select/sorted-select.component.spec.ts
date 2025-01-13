import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortedSelectComponent } from './sorted-select.component';

describe('SortedSelectComponent', () => {
    let component: SortedSelectComponent;
    let fixture: ComponentFixture<SortedSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SortedSelectComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SortedSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
