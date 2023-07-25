/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAddressPage } from './add-address.page';

describe('AddAddressPage', () => {
  let component: AddAddressPage;
  let fixture: ComponentFixture<AddAddressPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
