import { TestBed } from '@angular/core/testing';

import { ShoppinglistApiService } from './shoppinglist-api.service';

describe('ShoppinglistApiService', () => {
  let service: ShoppinglistApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppinglistApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
