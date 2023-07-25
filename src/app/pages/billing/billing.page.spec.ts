/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingPage } from './billing.page';

describe('BillingPage', () => {
  let component: BillingPage;
  let fixture: ComponentFixture<BillingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BillingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
