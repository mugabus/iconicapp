/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-all-offers',
  templateUrl: './all-offers.page.html',
  styleUrls: ['./all-offers.page.scss'],
})
export class AllOffersPage implements OnInit {
  dummy = Array(10);
  list: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
  ) {
    console.log(this.util.cityId);
    this.getOffers();
  }

  getOffers() {
    this.api.post_public('v1/banners/userBanners', { id: this.util.cityId }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.list = data.data;
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

  ngOnInit() {
  }

  openLink(item: any) {
    if (item.type == 0) {
      console.log('open category');
      const param: NavigationExtras = {
        queryParams: {
          id: item.link,
          name: 'Category'
        }
      };
      this.util.navigateToPage('tabs/home/sub-category', param);
    } else if (item.type == 1) {
      // product
      console.log('open product');
      const param: NavigationExtras = {
        queryParams: {
          id: item.link
        }
      };

      this.util.navigateToPage('tabs/categories/product', param);
    } else {
      // link
      window.open(item.link, '_system');
    }
  }

  back() {
    this.util.onBack();
  }
}
