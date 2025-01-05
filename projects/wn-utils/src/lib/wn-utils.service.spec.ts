import { TestBed } from '@angular/core/testing';

import { WnUtilsService } from './wn-utils.service';

describe('WnUtilsService', () => {
  let service: WnUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WnUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
