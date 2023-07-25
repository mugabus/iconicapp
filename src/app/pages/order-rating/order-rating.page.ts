/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { NavController, ModalController } from '@ionic/angular';
import { ProductRatingPage } from '../product-rating/product-rating.page';
import { DriverRatingPage } from '../driver-rating/driver-rating.page';
import { StoreRatingPage } from './../store-rating/store-rating.page';


@Component({
  selector: 'app-order-rating',
  templateUrl: './order-rating.page.html',
  styleUrls: ['./order-rating.page.scss'],
})
export class OrderRatingPage implements OnInit {
  id: any;
  loaded: boolean;
  orderDetail: any[] = [];
  orders: any[] = [];
  payMethod: any;
  status: any[] = [];
  datetime: any;
  orderAt: any;
  address: any;
  userInfo: any;
  changeStatusOrder: any;
  userLat: any;
  userLng: any;
  driverId: any;
  stores: any[] = [];
  driverInfo: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public util: UtilService,
    public api: ApiService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.loaded = false;
        this.getOrder();
      } else {
        this.navCtrl.back();
      }
    });
  }

  getOrder() {
    this.api.post_private('v1/orders/getByOrderId', { id: this.id }).then((data: any) => {
      console.log(data);
      this.loaded = true;
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        console.log(info);
        this.orderDetail = JSON.parse(info.notes);
        console.log('driver???? ==>', this.orderDetail);
        const order = JSON.parse(info.orders);
        console.log('order==>>', order);
        const finalOrder: any[] = [];

        const ids = [...new Set(order.map((item: any) => item.store_id))];
        ids.forEach(element => {
          const param = {
            id: element,
            order: [],
            orderItemTotal: 0,
            orderDiscount: 0,
            shippingPrice: 0,
            orderWalletDiscount: 0,
            orderTaxAmount: 0
          };
          finalOrder.push(param);
        });

        ids.forEach((element, index) => {
          let total = 0;
          order.forEach((cart: any) => {
            if (cart.variations && cart.variations != '' && typeof cart.variations == 'string') {
              cart.variations = JSON.parse(cart.variations);
              console.log(cart['variant']);
              if (cart["variant"] == undefined) {
                cart['variant'] = 0;
              }
            }
            if (cart.store_id == element) {
              finalOrder[index].order.push(cart);
              if (cart && cart.discount == 0) {
                if (cart.size == '1' || cart.size == 1) {
                  if (cart.variations[0].items[cart.variant].discount && cart.variations[0].items[cart.variant].discount != 0) {
                    total = total + (parseFloat(cart.variations[0].items[cart.variant].discount) * cart.quantiy);
                  } else {
                    total = total + (parseFloat(cart.variations[0].items[cart.variant].price) * cart.quantiy);
                  }
                } else {
                  total = total + (parseFloat(cart.original_price) * cart.quantiy);
                }
              } else {
                if (cart.size == '1' || cart.size == 1) {
                  if (cart.variations[0].items[cart.variant].discount && cart.variations[0].items[cart.variant].discount != 0) {
                    total = total + (parseFloat(cart.variations[0].items[cart.variant].discount) * cart.quantiy);
                  } else {
                    total = total + (parseFloat(cart.variations[0].items[cart.variant].price) * cart.quantiy);
                  }
                } else {
                  total = total + (parseFloat(cart.sell_price) * cart.quantiy);
                }
              }
            }

          });
          if (info.discount > 0) {
            finalOrder[index].orderDiscount = info.discount / ids.length;
          }
          if (info.wallet_used == 1) {
            finalOrder[index].orderWalletDiscount = info.wallet_price / ids.length;
          }
          finalOrder[index].orderItemTotal = total;
          console.log('total', element, total);
        });


        console.log('final order', finalOrder);
        this.orders = finalOrder;
        this.driverId = info.driver_id;
        if (this.driverId && this.driverId != null) {
          this.driverInfo = data.driverInfo;
        }
        this.stores = data.storeInfo;
        console.log(this.orders);
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.loaded = true;
      this.util.apiErrorHandler(error);
    });
  }


  getStoreName(id: any) {
    const item = this.stores.filter(x => x.uid == id);
    if (item && item.length) {
      return item[0].name;
    }
    return 'Store';
  }

  async rateProduct(item: any) {
    const modal = await this.modalCtrl.create({
      component: ProductRatingPage,
      cssClass: 'modalContact',
      backdropDismiss: false,
      componentProps: {
        id: item.id,
        name: item.name
      }
    });
    return await modal.present();
  }

  async rateStore(item: any) {
    console.log(item)
    const modal = await this.modalCtrl.create({
      component: StoreRatingPage,
      cssClass: 'modalContact',
      componentProps: {
        id: item,
        name: this.getStoreName(item)
      },
      backdropDismiss: false,
    });
    return await modal.present();
  }



  ngOnInit() {
  }
  back() {
    this.navCtrl.back();
  }

  async ratDriver(item: any) {
    console.log(item);
    const modal = await this.modalCtrl.create({
      component: DriverRatingPage,
      cssClass: 'modalContact',
      backdropDismiss: false,
      componentProps: {
        id: item.id,
        name: item.first_name + ' ' + item.last_name
      }
    });
    return await modal.present();
  }
}
