import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendTableComponent } from './frontend-table.component';

describe('FrontendTableComponent', () => {
  let component: FrontendTableComponent<any>;
  let fixture: ComponentFixture<FrontendTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontendTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontendTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
