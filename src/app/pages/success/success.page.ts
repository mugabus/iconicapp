/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {
  orderId: any;
  constructor(
    private modalCrtl: ModalController,
    private navCtrl: NavController,
    private navParam: NavParams,
    public util: UtilService
  ) {
    this.orderId = this.navParam.get('id');
    console.log(this.orderId);
  }

  ngOnInit() {
  }

  goToHome() {
    this.modalCrtl.dismiss();
    this.navCtrl.navigateRoot(['/tabs/home'], { replaceUrl: true, skipLocationChange: true });
  }

  goToOrderInfo() {
    this.modalCrtl.dismiss();
    this.navCtrl.navigateRoot(['/tabs/orders',], { replaceUrl: true, skipLocationChange: true });
  }

}
