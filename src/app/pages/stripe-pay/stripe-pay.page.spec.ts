/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StripePayPage } from './stripe-pay.page';

describe('StripePayPage', () => {
  let component: StripePayPage;
  let fixture: ComponentFixture<StripePayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StripePayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
