import { TestBed } from '@angular/core/testing';

import { UomsapiService } from './uomsapi.service';

describe('UomsapiService', () => {
  let service: UomsapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UomsapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
