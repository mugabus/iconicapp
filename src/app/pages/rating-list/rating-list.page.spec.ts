/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingListPage } from './rating-list.page';

describe('RatingListPage', () => {
  let component: RatingListPage;
  let fixture: ComponentFixture<RatingListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RatingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
