/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  dummy: any[] = [];
  list: any[] = [];
  balance: any = 0;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getWallet();
  }

  ngOnInit() {
  }

  getWallet() {
    this.dummy = Array(10);
    this.api.post_private('v1/profile/getMyWallet', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.balance = data.data.balance;
        this.list = data.transactions;
        this.list.forEach(element => {
          element.created_at = moment(element.created_at).format('LL');
        })
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
