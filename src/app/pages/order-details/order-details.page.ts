/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { NavController, AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import * as moment from 'moment';
import { BillingPage } from '../billing/billing.page';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
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
  driverInfo: any[] = [];
  changeStatusOrder: any;
  userLat: any;
  userLng: any;
  driverId: any;

  stores: any[] = [];

  canCancle: boolean;

  isDelivered: boolean;
  assigneeDriver: any[] = [];

  billingData: any = [] = [];
  payStatus: any = 1;
  grandTotal: any = 0;
  payMethodName: any = '';
  constructor(
    private route: ActivatedRoute,
    public util: UtilService,
    public api: ApiService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private iab: InAppBrowser,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
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

  back() {
    this.navCtrl.back();
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
        if (info.assignee && info.assignee != '') {
          this.assigneeDriver = JSON.parse(info.assignee);
          console.log('ASSSIGNEE---->>>>', this.assigneeDriver);
        }
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
        this.status = JSON.parse(info.status);
        console.log('order status--------------------', this.status);
        this.payStatus = info.payStatus;
        console.log('payment status', this.payStatus);
        if (this.payStatus == 0) {
          this.util.errorToast(this.util.translate('Your Payment is pending'), 'danger');
        }
        const status = this.status.filter(x => x.status == 'created');
        if (status.length == this.status.length) {
          this.canCancle = true;
        } else {
          this.canCancle = false;
        }

        const delivered = this.status.filter(x => x.status == 'delivered');
        if (delivered.length == this.status.length) {
          this.isDelivered = true;
        } else {
          this.isDelivered = false;
        }
        this.grandTotal = info.grand_total;
        // if()
        this.datetime = moment(info.date_time).format('dddd, MMMM Do YYYY');
        this.payMethod = info.paid_method == 'cod' ? 'COD' : 'PAID';
        this.payMethodName = info.paid_method;
        if (this.payStatus == 0) {
          this.payMethod = this.util.translate('Unpaid');
        }
        this.orderAt = info.order_to;
        this.driverId = info.driver_id;
        if (this.driverId && this.driverId != null) {
          this.driverInfo = data.driverInfo;

        }

        this.stores = data.storeInfo;
        if (this.orderAt == 'home') {
          const address = JSON.parse(info.address);
          console.log('---address', address);
          if (address && address.address) {
            this.userLat = address.lat;
            this.userLng = address.lng;
            this.address = address.landmark + ' ' + address.house + ' ' + address.address + ' ' + address.pincode;
          }
        }

        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.extra)) {
          const extras = JSON.parse(info.extra);
          console.log('extra==>>', extras);
          if (extras && extras.length && info.order_to == 'home') {
            extras.forEach((element: any) => {
              if (element.shipping == 'km') {
                const deliveryCharge = parseFloat(element.distance) * parseFloat(element.shippingPrice);
                console.log('delivert charge of ', element.store_id, deliveryCharge);
                const index = this.orders.findIndex(x => x.id == element.store_id);
                console.log('index=>', index);
                if (this.orders && this.orders[index] && this.orders[index].id == element.store_id) {
                  this.orders[index].shippingPrice = deliveryCharge;
                  this.orders[index].orderTaxAmount = parseFloat(element.tax);
                }
              } else {
                console.log(element.shippingPrice);
                const index = this.orders.findIndex(x => x.id == element.store_id);
                console.log('index=>', index);
                if (this.orders && this.orders[index] && this.orders[index].id == element.store_id) {
                  this.orders[index].shippingPrice = parseFloat(element.shippingPrice) / this.orders.length;
                  this.orders[index].orderTaxAmount = parseFloat(element.tax);
                }
              }
            });
          } else {
            extras.forEach((element: any) => {
              const index = this.orders.findIndex(x => x.id == element.store_id);
              console.log('index=>', index);
              if (this.orders && this.orders[index] && this.orders[index].id == element.store_id) {
                this.orders[index].orderTaxAmount = parseFloat(element.tax);
              }
            });
          }
        }
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

  ngOnInit() {
  }


  call() {
    if (this.userInfo.mobile) {
      this.iab.create('tel:' + this.userInfo.mobile, '_system');
    } else {
      this.util.errorToast(this.util.translate('Number not found'));
    }
  }

  email() {
    if (this.userInfo.email) {
      this.iab.create('mailto:' + this.userInfo.email, '_system');
    } else {
      this.util.errorToast(this.util.translate('Email not found'));
    }
  }

  callStore(item: any) {
    if (item) {
      this.iab.create('tel:' + item, '_system');
    } else {
      this.util.errorToast(this.util.translate('Number not found'));
    }
  }

  emailStore(item: any) {
    if (item) {
      this.iab.create('mailto:' + item, '_system');
    } else {
      this.util.errorToast(this.util.translate('Email not found'));
    }
  }

  getTotalBilling(item: any) {
    const total = item.orderItemTotal + item.orderTaxAmount + item.shippingPrice;
    const discount = item.orderDiscount + item.orderWalletDiscount;
    return total - discount > 0 ? total - discount : 0;
  }

  printOrder() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const browser: any = this.iab.create(this.api.baseUrl + 'v1/orders/printInvoice?id=' + this.id + '&token=' + localStorage.getItem('token'), '_system', options);
    browser.on('loadstop').subscribe((event: any) => {
      const navUrl = event.url;
      console.log('navURL', navUrl);
    });
  }

  async openBillingInfo() {
    const modal = await this.modalController.create({
      component: BillingPage,
      componentProps: { orders: this.orders, stores: this.stores, status: this.status }
    });

    await modal.present();

  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.util.translate('How was your experience?'),
      message: this.util.translate('Rate your experience with stores and driver'),
      mode: 'ios',
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.translate('Yes'),
          handler: () => {
            console.log('Confirm Okay');
            // this.util.setOrders(this.orderData);
            const param: NavigationExtras = {
              queryParams: {
                id: this.id
              }
            }
            this.router.navigate(['order-rating'], param);
          }
        }
      ]
    });

    await alert.present();
  }

  changeStatus() {
    console.log('status');

    const newOrderNotes = {
      status: 1,
      value: this.util.translate('Order') + ' ' + this.util.translate('cancelled by you'),
      time: moment().format('lll'),
    };
    this.orderDetail.push(newOrderNotes);

    this.status.forEach(element => {
      if (element.status == 'created') {
        element.status = 'cancelled';
      }
    });

    this.util.show();
    const param = {
      id: this.id,
      notes: JSON.stringify(this.orderDetail),
      status: JSON.stringify(this.status),
      order_status: 'cancelled'
    };
    console.log('---->', this.status)
    this.api.post_private('v1/orders/updateStatusUser', param).then((data: any) => {
      console.log('order', data);
      this.util.hide();
      if (this.orderAt == 'home' && this.driverId && this.driverId != '0') {
        this.updateDriver(this.driverId, 'active');
      }
      if (data && data.status == 200) {
        this.back();
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });

  }



  updateDriver(uid: any, value: any) {
    const param = {
      id: uid,
      current: value
    };
    console.log('param', param);
    this.api.post_private('v1/drivers/edit_profile', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }

  getStoreName(id: any) {
    const item = this.stores.filter(x => x.uid == id);
    if (item && item.length) {
      return item[0].name;
    }
    return 'Store';
  }

  getOrderStatus(id: any) {
    const item = this.status.filter(x => x.id == id);
    if (item && item.length) {
      return this.util.translate(item[0].status);
    }
    return 'created';
  }

  getOrderStatusFromDriver(id: any) {
    const item = this.assigneeDriver.filter(x => x.driver == id);
    if (item && item.length) {
      return this.getOrderStatus(item[0].assignee);
    }
    return 'rejected';
  }

  async contanct(item: any) {
    console.log(item);
    const alert = await this.alertController.create({
      header: this.util.translate('Contact') + ' ' + item.name,
      inputs: [
        {
          name: 'mail',
          type: 'radio',
          label: this.util.translate('Email'),
          value: 'mail',
        },
        {
          name: 'call',
          type: 'radio',
          label: this.util.translate('Call'),
          value: 'call'
        },
        {
          name: 'msg',
          type: 'radio',
          label: this.util.translate('Message'),
          value: 'msg'
        },
      ],
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
            if (data && data == 'mail') {
              this.emailStore(item.email);
            } else if (data && data == 'call') {
              this.callStore(item.mobile);
            } else if (data && data == 'msg') {
              console.log('none');
              const param: NavigationExtras = {
                queryParams: {
                  id: item.uid,
                  name: item.name,
                  uid: localStorage.getItem('uid')
                }
              };
              this.router.navigate(['inbox'], param);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async contanctDriver(item: any) {
    console.log(item);
    const alert = await this.alertController.create({
      header: this.util.translate('Contact') + ' ' + item.first_name,
      inputs: [
        {
          name: 'mail',
          type: 'radio',
          label: this.util.translate('Email'),
          value: 'mail',
        },
        {
          name: 'call',
          type: 'radio',
          label: this.util.translate('Call'),
          value: 'call'
        },
      ],
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
            if (data && data == 'mail') {
              this.emailStore(item.email);
            } else if (data && data == 'call') {
              this.callStore(item.mobile);
            } else {
              console.log('none');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  direction(item: any, type: any) {
    console.log(item, type);
    const navData: NavigationExtras = {
      queryParams: {
        lat: item.lat,
        lng: item.lng,
        who: type,
        id: type == 'store' ? item.uid : item.id,
        orderAt: this.orderAt,
        homeLat: this.userLat ? this.userLat : 'none',
        homeLng: this.userLng ? this.userLng : 'none',
        orderId: this.id
      }
    };
    this.router.navigate(['direction'], navData);

  }

  async openIssue() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose'),
      buttons: [{
        text: this.util.translate('Chat'),
        icon: 'chatbubbles',
        handler: () => {
          console.log('Chat clicked');
          const param: NavigationExtras = {
            queryParams: {
              id: this.util.adminInfo.id,
              name: this.util.adminInfo.first_name + ' ' + this.util.adminInfo.last_name,
              uid: localStorage.getItem('uid')
            }
          };
          this.router.navigate(['inbox'], param);
        }
      }, {
        text: this.util.translate('Complaints'),
        icon: 'help-buoy',
        handler: () => {
          console.log('Complaints clicked');
          this.openComplaints();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  openComplaints() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.id
      }
    }
    this.util.navigateToPage('complaints', param);
  }

  repayment() {
    if (this.payMethodName == 'paytm') { // PayTM
      console.log('paytm pay');
      const navParma: NavigationExtras = {
        queryParams: {
          id: this.id,
          payLink: this.api.baseUrl + 'v1/payNowWeb?amount=' + this.grandTotal + '&standby_id=' + this.id
        }
      }

      this.router.navigate(['/await-payments'], navParma);
    } else if (this.payMethodName == 'instamojo') { // InstaMOJO
      console.log('InstaMOJO');
      const param = {
        allow_repeated_payments: 'False',
        amount: this.grandTotal,
        buyer_name: this.getName(),
        purpose: this.util.appName + ' Orders',
        redirect_url: this.api.baseUrl + 'v1/instaMOJOWebSuccess?id=' + this.id,
        phone: this.util.userInfo && this.util.userInfo.mobile ? this.util.userInfo.mobile : '',
        send_email: 'True',
        webhook: this.api.baseUrl,
        send_sms: 'True',
        email: this.getEmail()
      };

      this.util.show(this.util.translate('Fetching Details'));
      this.api.post_private('v1/payments/instamojoPay', param).then((data: any) => {
        console.log('instamojo response', data);
        this.util.hide();
        if (data && data.status && data.status == 200 && data.success && data.success.success == true) {

          const navParma: NavigationExtras = {
            queryParams: {
              id: this.id,
              payLink: data.success.payment_request.longurl
            }
          }

          this.router.navigate(['/await-payments'], navParma);
          // Instamojo.open();

        } else {
          const error = JSON.parse(data.error);
          console.log('error message', error);
          if (error && error.message) {
            this.util.showToast(error.message, 'danger', 'bottom');
            return false;
          }
          this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
        }
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
      }).catch(error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
      });
    }
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Foodies';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@bunchdevelopers.com';
  }
}
