import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWraperComponent } from './list-wraper.component';

describe('ListWraperComponent', () => {
  let component: ListWraperComponent;
  let fixture: ComponentFixture<ListWraperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListWraperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListWraperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
