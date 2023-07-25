/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedeemSuccessPage } from './redeem-success.page';

describe('RedeemSuccessPage', () => {
  let component: RedeemSuccessPage;
  let fixture: ComponentFixture<RedeemSuccessPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RedeemSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
