/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopPickedPage } from './top-picked.page';

describe('TopPickedPage', () => {
  let component: TopPickedPage;
  let fixture: ComponentFixture<TopPickedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TopPickedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
