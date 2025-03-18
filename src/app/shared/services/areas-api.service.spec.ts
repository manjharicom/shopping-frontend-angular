import { TestBed } from '@angular/core/testing';

import { AreasApiService } from './areas-api.service';

describe('AreasApiService', () => {
  let service: AreasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreasApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
