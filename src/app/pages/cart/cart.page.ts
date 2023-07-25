/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  coupon: boolean;
  deliveryCharge: any;
  grandTotal: any;
  constructor(
    public util: UtilService,
    private alertCtrl: AlertController,
    public cart: CartService,
    public api: ApiService,
  ) {

  }

  ngOnInit() {
  }

  add(product: any, index: any) {
    if (this.cart.cart[index].quantiy > 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  remove(product: any, index: any) {
    if (this.cart.cart[index].quantiy == 1) {
      this.cart.cart[index].quantiy = 0;
      this.cart.removeItem(product.id)
    } else {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  goToPayment() {
    console.log(this.cart.minOrderPrice);

    if (this.cart.totalPrice < this.cart.minOrderPrice) {
      let text;
      if (this.util.cside == 'left') {
        text = this.util.currecny + ' ' + this.cart.minOrderPrice;
      } else {
        text = this.cart.minOrderPrice + ' ' + this.util.currecny;
      }
      this.util.errorToast(this.util.translate('Minimum order amount must be') + ' ' + text + ' ' + this.util.translate('or more'));
      return false;
    }
    this.util.navigateToPage('tabs/cart/checkout');
    // this.router.navigate(['/tabs/cart/delivery-options']);
  }

  back() {
    this.util.onBack();
  }

  openCoupon() {
    // this.router.navigate(['offers']);
  }

  async variant(item: any, indeX: any) {
    console.log(item);
    const allData: any[] = [];
    console.log(item && item.variations != '');
    console.log(item && item.variations != '' && item.variations.length > 0);
    console.log(item && item.variations != '' && item.variations.length > 0 && item.variations[0].items.length > 0);
    if (item && item.variations != '' && item.variations.length > 0 && item.variations[0].items.length > 0) {
      console.log('->', item.variations[0].items);
      item.variations[0].items.forEach((element: any, index: any) => {
        console.log('OK');
        let title = '';
        if (this.util.cside == 'left') {
          const price = item.variations && item.variations[0] &&
            item.variations[0].items[index] &&
            item.variations[0].items[index].discount ? item.variations[0].items[index].discount :
            item.variations[0].items[index].price;
          title = element.title + ' - ' + this.util.currecny + ' ' + price;
        } else {
          const price = item.variations && item.variations[0] && item.variations[0].items[index] &&
            item.variations[0].items[index].discount ? item.variations[0].items[index].discount :
            item.variations[0].items[index].price;
          title = element.title + ' - ' + price + ' ' + this.util.currecny;
        }
        const data = {
          name: element.title,
          type: 'radio',
          label: title,
          value: index,
          checked: item.variant == index
        };
        allData.push(data);
      });

      console.log('All Data', allData);
      const alert = await this.alertCtrl.create({
        header: item.name,
        inputs: allData,
        buttons: [
          {
            text: this.util.translate('Cancel'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: this.util.translate('Ok'),
            handler: (data) => {
              console.log('Confirm Ok', data);
              console.log('before', this.cart.cart[indeX].variant);
              this.cart.cart[indeX].variant = data;
              console.log('after', this.cart.cart[indeX].variant);
              this.cart.calcuate();
            }
          }
        ]
      });
      await alert.present();
    } else {
      console.log('none');
    }

  }
}
