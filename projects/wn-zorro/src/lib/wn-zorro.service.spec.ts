import { TestBed } from '@angular/core/testing';

import { WnZorroService } from './wn-zorro.service';

describe('WnZorroService', () => {
  let service: WnZorroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WnZorroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
