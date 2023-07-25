/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { TestBed, async, inject } from '@angular/core/testing';

import { cartGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [cartGuard]
    });
  });

  it('should ...', inject([cartGuard], (guard: cartGuard) => {
    expect(guard).toBeTruthy();
  }));
});
