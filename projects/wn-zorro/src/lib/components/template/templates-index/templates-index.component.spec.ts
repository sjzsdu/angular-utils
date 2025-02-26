import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesIndexComponent } from './templates-index.component';

describe('TemplatesIndexComponent', () => {
  let component: TemplatesIndexComponent;
  let fixture: ComponentFixture<TemplatesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
