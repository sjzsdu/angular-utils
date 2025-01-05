import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WnUtilsComponent } from './wn-utils.component';

describe('WnUtilsComponent', () => {
  let component: WnUtilsComponent;
  let fixture: ComponentFixture<WnUtilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WnUtilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WnUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
