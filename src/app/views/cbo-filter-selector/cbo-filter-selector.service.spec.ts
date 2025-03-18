import { TestBed } from '@angular/core/testing';

import { CboFilterSelectorService } from './cbo-filter-selector.service';

describe('CboFilterSelectorService', () => {
  let service: CboFilterSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CboFilterSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
