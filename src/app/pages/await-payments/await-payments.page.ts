/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { SuccessPage } from '../success/success.page';

@Component({
  selector: 'app-await-payments',
  templateUrl: './await-payments.page.html',
  styleUrls: ['./await-payments.page.scss'],
})
export class AwaitPaymentsPage implements OnInit {
  orderId: any;
  interval: any;
  confirmed: boolean = false;
  payLink: any;
  payClick: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private zone: NgZone,
    private modalController: ModalController
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.id && data.payLink) {
        this.orderId = data.id;
        this.payLink = data.payLink;
        this.interval = setInterval(() => {
          console.log('calling');
          if (this.confirmed == false) {
            this.getOrderStatus();
          }
        }, 5000);
      }
    });
  }

  async openBrowser() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    this.payClick = true;
    await this.iab.create(this.payLink, '_blank', options);
  }

  async openSuccess() {
    const modal = await this.modalController.create({
      component: SuccessPage,
      cssClass: 'custom_modal',
      backdropDismiss: false,
      componentProps: { id: this.orderId }
    });
    return await modal.present();
  }

  getOrderStatus() {
    const param = {
      id: this.orderId
    };
    this.api.post_private('v1/orders/getById', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200) {
        if (data && data.data && data.data.payStatus == 1) {
          this.confirmed = true;
          setTimeout(() => {
            // this.navCtrl.navigateRoot(['/confirm']);
            this.openSuccess();
          }, 5000);
        }
      }
    }).catch(error => {
      console.log(error);
      this.navCtrl.navigateRoot(['']);
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
    });
  }

  ngOnInit() {

  }

  ionViewDidLeave() {
    console.log('leaved');
    clearInterval(this.interval);
  }
}
