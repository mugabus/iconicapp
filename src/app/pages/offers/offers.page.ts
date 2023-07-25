/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  dummy = Array(5);
  list: any[] = [];
  dummyList: any[] = [];
  page = 1;
  constructor(
    public api: ApiService,
    public util: UtilService,
    public cart: CartService
  ) {
    this.getOffers();
  }

  ngOnInit() {
  }

  getOffers() {
    this.api.get_public('v1/offers/getMyOffers').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status == 200 && data.data && data.data.length) {
        const info = data.data;
        this.list = info;
        this.dummyList = info;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }


  selected(item: any) {
    console.log(item);
    const min = parseFloat(item.min);
    if (this.cart.totalPrice >= min) {
      this.cart.coupon = item;
      this.cart.calcuate();
      this.util.onBack();
    } else {
      console.log('not valid with minimum amout', min);
      this.util.showToast(this.util.translate('Sorry') + '\n' + this.util.translate('minimum cart value must be') + ' ' + min +
        ' ' + this.util.translate('or equal'), 'danger', 'bottom');
    }

  }

  getTime(time: any) {
    return moment(time).format('LLLL');
  }
}
