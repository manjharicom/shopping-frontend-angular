import { TestBed } from '@angular/core/testing';

import { SupermarketApiService } from './supermarket-api.service';

describe('SupermarketApiService', () => {
  let service: SupermarketApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupermarketApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
