import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerTableComponent } from './server-table.component';

describe('ServerTableComponent', () => {
  let component: ServerTableComponent;
  let fixture: ComponentFixture<ServerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
