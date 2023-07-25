/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopStoresPage } from './top-stores.page';

describe('TopStoresPage', () => {
  let component: TopStoresPage;
  let fixture: ComponentFixture<TopStoresPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TopStoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
