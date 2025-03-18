import { TestBed } from '@angular/core/testing';

import { ReportsapiService } from './reportsapi.service';

describe('ReportsapiService', () => {
  let service: ReportsapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
