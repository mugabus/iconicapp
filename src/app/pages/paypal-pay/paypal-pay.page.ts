/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-paypal-pay',
  templateUrl: './paypal-pay.page.html',
  styleUrls: ['./paypal-pay.page.scss'],
})
export class PaypalPayPage implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  public payPalConfig?: IPayPalConfig;
  clientID: any;
  payPalCode: any;
  constructor(
    private cart: CartService,
    private navParam: NavParams,
    private modalController: ModalController,
    public util: UtilService
  ) {
    this.payPalCode = this.navParam.get('currency_code');
    this.clientID = this.navParam.get('key');
    this.initConfig();
  }
  close(data?: any, role?: any) {
    this.modalController.dismiss(data, role);
  }
  ngOnInit() {
  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: this.payPalCode,
      clientId: this.clientID,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: this.payPalCode,
            value: this.cart.grandTotal,
            breakdown: {
              item_total: {
                currency_code: this.payPalCode,
                value: this.cart.grandTotal
              }
            }
          },
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);

        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.close(JSON.stringify(data), 'done');
        // this.showSuccess = true;
        // this.payId = data.id;
        // this.createOrder('paypal', this.payId);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      },
    };
  }
}
