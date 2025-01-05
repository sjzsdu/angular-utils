import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WnZorroComponent } from './wn-zorro.component';

describe('WnZorroComponent', () => {
  let component: WnZorroComponent;
  let fixture: ComponentFixture<WnZorroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WnZorroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WnZorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
