/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.page.html',
  styleUrls: ['./rating-list.page.scss'],
})
export class RatingListPage implements OnInit {
  id: any = '';
  name: any = '';
  type: any = '';
  list: any[] = [];
  dummy: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private navParam: NavParams,
    private modalController: ModalController
  ) {
    this.name = this.navParam.get('name');
    this.id = this.navParam.get('id');
    this.type = this.navParam.get('type');
    if (this.type == 'product') {
      console.log('get type of product');
      this.getProducts();
    }
  }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

  getProducts() {
    this.dummy = Array(5);
    this.api.post_public('v1/ratings/getProductsRatings', { id: this.id }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
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
}
