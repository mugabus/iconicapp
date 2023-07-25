/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { TestBed, async, inject } from '@angular/core/testing';

import { LocationGuard } from './location.guard';

describe('LocationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationGuard]
    });
  });

  it('should ...', inject([LocationGuard], (guard: LocationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
