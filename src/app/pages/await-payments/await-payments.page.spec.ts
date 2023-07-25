/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AwaitPaymentsPage } from './await-payments.page';

describe('AwaitPaymentsPage', () => {
  let component: AwaitPaymentsPage;
  let fixture: ComponentFixture<AwaitPaymentsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AwaitPaymentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
