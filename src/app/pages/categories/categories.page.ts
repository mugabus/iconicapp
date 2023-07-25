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
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: any[] = [];
  dummy: any[] = [];
  selectedIndex: any;
  subIndex: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
  ) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.dummy = Array(5);
    this.api.get_public('v1/category/getHome').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.categories = data.data;
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

  change(id: any) {
    if (this.selectedIndex == id) {
      this.selectedIndex = '';
    } else {
      this.selectedIndex = id;
    }
  }

  goToProductList(val: any) {
    this.subIndex = val.id;
    const navData: NavigationExtras = {
      queryParams: {
        id: val.id,
        name: val.name,
        from: 'categories'
      }
    }
    this.util.navigateToPage('/tabs/categories/products', navData);
  }
}
