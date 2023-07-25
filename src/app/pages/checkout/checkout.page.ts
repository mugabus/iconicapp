/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import * as moment from 'moment';
import { TimeComponent } from 'src/app/components/time/time.component';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import swal from 'sweetalert2';
import { SuccessPage } from '../success/success.page';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { PaypalPayPage } from '../paypal-pay/paypal-pay.page';
import { StripePayPage } from '../stripe-pay/stripe-pay.page';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
// declare let FlutterwaveCheckout: any;
// declare let PaystackPop: any;
// declare let Razorpay: any;

register();
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  @ViewChild("swiper") swiper?: ElementRef<{ swiper: Swiper }>
  current = 1;
  slideOpts = {
    allowTouchMove: false,
    slidesPerView: 1,
    spaceBetween: 0,
  };

  deliveryOption: any = 'home';

  storeAddress: any[] = [];
  time: any;
  datetime: any;

  myaddress: any[] = [];

  selectedAddress: any;
  dummy = Array(10);

  default: any;
  dummyPayments: any[] = [];
  payments: any[] = [];
  pay_method: any = '';
  payName: any = '';

  payMethodName: any = '';
  balance: any = 0;
  walletCheck: boolean = false;
  storeIds: any[] = [];
  constructor(
    public util: UtilService,
    private popoverController: PopoverController,
    public cart: CartService,
    public api: ApiService,
    private modalController: ModalController,
    private chMod: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
    private iab: InAppBrowser,
  ) {
    this.getStoreList();
    this.datetime = 'today';
    this.time = this.util.translate('Today -') + ' ' + moment().format('dddd, MMMM Do YYYY');
  }

  ngOnInit() {
  }

  getWallet() {
    this.dummy = Array(10);
    this.api.post_private('v1/profile/getMyWalletBalance', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.balance = parseFloat(data.data.balance);

      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  walletChange(event: any) {
    console.log(event, event.detail.checked);
    if (event && event.detail && event.detail.checked == true) {
      if (this.cart && this.cart.coupon && this.cart.coupon.id) {
        this.util.errorToast('Sorry you have already added a offers discount to cart');
        this.walletCheck = false;
        return false;
      }
      this.cart.walletDiscount = parseFloat(this.balance);
      this.cart.calcuate();
    } else {
      this.cart.walletDiscount = 0;
      this.cart.calcuate();
    }
  }

  getStoreList() {
    const info = [...new Set(this.cart.cart.map(item => item.store_id))];
    console.log('store iddss=>>', info);

    const param = {
      id: info.join()
    };
    this.api.post_private('v1/stores/getStoresData', param).then((data: any) => {
      console.log(data);
      if (data && data.status == 200 && data.data.length) {
        this.storeAddress = data.data;
        this.cart.stores = this.storeAddress;
        this.storeIds = [...new Set(this.storeAddress.map(item => item.uid))];
        console.log('store uid', this.storeIds);
      } else {
        this.util.showToast(this.util.translate('No Stores Found'), 'danger', 'bottom');
        this.util.onBack();
      }
    }, error => {
      console.log('error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  async openTime(ev: any) {
    const popover = await this.popoverController.create({
      component: TimeComponent,
      event: ev,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data.data) {
        if (data.data == 'today') {
          this.datetime = 'today';
          this.time = this.util.translate('Today -') + ' ' + moment().format('dddd, MMMM Do YYYY');
        } else {
          this.datetime = 'tomorrow';
          this.time = this.util.translate('Tomorrow -') + ' ' + moment().add(1, 'days').format('dddd, MMMM Do YYYY');
        }
      }
    });
    await popover.present();
  }

  getText() {
    return 'please visit all the stores listed on top';
  }

  payment() {
    console.log('on first tab', this.deliveryOption);
    this.cart.deliveryAt = this.deliveryOption;
    this.cart.datetime = this.datetime;
    if (this.deliveryOption == 'home') {
      console.log('address');
      this.swiper?.nativeElement.swiper.slideNext();
      this.cart.walletDiscount = 0;
      this.walletCheck = false;
      this.cart.calcuate();
      this.current = 2;
      this.getAddress();
    } else {
      console.log('payment');
      this.swiper?.nativeElement.swiper.slideTo(2);
      this.cart.calcuate();
      this.current = 3;
      this.getWallet();
      this.getPayments();
    }
  }

  addNew() {
    this.util.navigateRoot('add-address');
  }

  getAddress() {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.myaddress = [];
    this.dummy = Array(10);
    this.api.post_private('v1/address/getByUid', param).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.myaddress = data.data;
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

  selectAddress() {
    console.log(this.selectedAddress);
    if (this.selectedAddress) {
      this.swiper?.nativeElement.swiper.slideNext();
      this.current = 3;
      const selecte = this.myaddress.filter(x => x.id == this.selectedAddress);
      const item = selecte[0];
      console.log('item', item);
      this.cart.deliveryAddress = item;
      this.cart.calcuate();
      this.getWallet();
      this.getPayments();
    } else {
      this.util.errorToast('Please select delivery address');
    }
  }

  back() {
    if (this.current == 1) {
      this.util.onBack();
    } else if (this.current == 2) {
      this.swiper?.nativeElement.swiper.slidePrev();
      this.cart.walletDiscount = 0;
      this.walletCheck = false;
      this.current = 1;
    } else if (this.current == 3) {
      if (this.deliveryOption == 'home') {
        this.swiper?.nativeElement.swiper.slidePrev();
        this.cart.walletDiscount = 0;
        this.walletCheck = false;
        this.current = 2;
      } else {
        this.swiper?.nativeElement.swiper.slideTo(0);
        this.current = 1;
      }
    }
  }

  openCoupon() {
    if (this.cart && this.cart.walletDiscount && this.cart.walletDiscount > 0) {
      this.util.errorToast('Sorry you have already added a wallet discount to cart');
      return false;
    }
    this.util.navigateToPage('offers');
  }

  removeOffers() {
    this.cart.coupon = null;
    this.cart.discount = 0;
    this.cart.calcuate();
  }

  getPayments() {
    this.dummyPayments = Array(5);
    this.payments = [];
    this.api.get_private('v1/payments/getPayments').then((data: any) => {
      console.log('payments->', data);
      this.dummyPayments = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.payments = data.data;
      }
    }, error => {
      console.log(error);
      this.dummyPayments = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummyPayments = [];
      this.util.apiErrorHandler(error);
    });
  }

  verifyPurchaseRazorPay(paymentId: any) {
    this.util.show();
    this.api.get_private('v1/payments/VerifyRazorPurchase?id=' + paymentId).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.success && data.success.status && data.success.status == 'captured') {
        this.util.hide();
        this.createOrder(JSON.stringify(data.success));
      } else {
        this.util.hide();
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

  createOrder(payKey: any) {

    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus: any[] = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      }
      orderStatus.push(info)
    });
    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];
    const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId.join(),
      date_time: this.cart.datetime == 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: this.payMethodName,
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart),
      notes: JSON.stringify(notes),
      address: this.cart.deliveryAt == 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      driver_id: '',
      total: this.cart.totalPrice,
      tax: this.cart.orderTax,
      grand_total: this.cart.grandTotal,
      delivery_charge: this.cart.deliveryPrice,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: payKey,
      status: JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores),
      payStatus: 1,
      wallet_used: this.cart.walletDiscount > 0 ? 1 : 0,
      wallet_price: this.cart.walletDiscount
    }
    console.log(param);
    this.util.show(this.util.translate('Creating Your Order'));
    this.api.post_private('v1/orders/create', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data && data.data.id) {

        this.cart.clearCart();
        this.cart.clearCart();
        this.chMod.detectChanges();
        this.sendNotification(data.data.id);
        const param = {
          id: data.data.id,
          mediaURL: this.api.mediaURL,
          subject: this.util.translate('New Order Created'),
          email: this.getEmail(),
          username: this.getName(),
          store_phone: this.util.general.mobile,
          store_email: this.util.general.email
        };
        this.api.post_private('v1/orders/sendMailForOrders', param).then((data: any) => {
          console.log(data);
        }, error => {
          console.log(error);
        }).catch((error) => {
          console.log(error);
        });
        this.zone.run(() => {
          this.openSuccess(data.data.id);
        });
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  sendNotification(orderId: any) {
    const param = {
      id: this.storeIds.join(),
      title: 'New Order ' + ' #' + orderId,
      message: 'New Order'
    };
    this.api.post_private('v1/notification/sendToStore', param).then((data: any) => {
      console.log('notification response', data);
    }, error => {
      console.log('error in notification', error);
    }).catch(error => {
      console.log('error in notification', error);
    });
  }
  async openSuccess(orderID: any) {
    const modal = await this.modalController.create({
      component: SuccessPage,
      cssClass: 'custom_modal',
      backdropDismiss: false,
      componentProps: { id: orderID }
    });
    return await modal.present();
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Grocery';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@grocery.com';
  }


  goToTrack() {

    console.log(this.pay_method);

    swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('Orders once placed cannot be cancelled and are non-refundable'),
      icon: 'question',
      confirmButtonText: this.util.translate('Yes'),
      cancelButtonText: this.util.translate('Cancel'),
      showCancelButton: true,
      backdrop: false,
      background: 'white'
    }).then((data) => {
      console.log(data);
      if (data && data.value) {
        console.log('go to procesed,,');
        if (this.pay_method == 1) {
          console.log('cod');
          this.payMethodName = 'cod';
          this.createOrder('cod');
        } else if (this.pay_method == 2) {
          console.log('stripe');
          this.payMethodName = 'stripe';
          this.stripePayment();
        } else if (this.pay_method == 3) {
          console.log('paypal');
          this.payMethodName = 'paypal';
          this.payWithPayPal();
        } else if (this.pay_method == 4) {
          console.log('paytm');
          this.payMethodName = 'paytm';
          this.payWithPayTm();
        } else if (this.pay_method == 5) {
          console.log('razorpay');
          this.payMethodName = 'razorpay';
          this.payWithRazorPay();
        } else if (this.pay_method == 6) {
          console.log('instamojo');
          this.payMethodName = 'instamojo';
          this.paywithInstaMojo()
        } else if (this.pay_method == 7) {
          console.log('paystack');
          this.payMethodName = 'paystack';
          this.paystackPay();
        } else if (this.pay_method == 8) {
          console.log('flutterwave');
          this.payMethodName = 'flutterwave';
          this.payWithFlutterwave();
        } else if (this.pay_method == 9) {
          console.log('paykun');
        }
      }
    });
  }

  async payWithFlutterwave() {
    const payMethod = this.payments.filter(x => x.id == this.pay_method);
    console.log(payMethod);
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      amount: this.cart.grandTotal,
      email: this.getEmail(),
      phone: this.util.userInfo.mobile,
      name: this.getName(),
      code: payMethod[0].currency_code,
      logo: this.api.mediaURL + this.util.appLogo,
      app_name: this.util.appName
    }
    console.log('to url==>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'v1/payments/flutterwavePay?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe((event: any) => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success_payments') || navUrl.includes('failed_payments')) {
        console.log('close');
        browser.close();
        if (navUrl.includes('success_payments')) {
          const urlItems = new URL(event.url);
          const orderId = urlItems.searchParams.get('transaction_id');
          const txtId = urlItems.searchParams.get('tx_ref');
          const ord = {
            orderId: orderId,
            txtId: txtId
          }
          this.createOrder(JSON.stringify(ord));
        } else {
          this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
        }

      }
    });
  }

  async paystackPay() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const paykey = '' + Math.floor((Math.random() * 1000000000) + 1);
    const param = {
      email: this.util.userInfo.email,
      amount: this.cart.grandTotal * 100,
      first_name: this.util.userInfo.first_name,
      last_name: this.util.userInfo.last_name,
      ref: paykey
    }
    console.log('to url==>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'v1/payments/paystackPay?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe((event: any) => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success') || navUrl.includes('close')) {
        console.log('close');
        browser.close();
        if (navUrl.includes('success')) {
          console.log('closed---->>>>>')
          this.createOrder(paykey);
        } else {
          console.log('closed');
        }
      }
    });
  }

  async paywithInstaMojo() {
    const param = {
      allow_repeated_payments: 'False',
      amount: this.cart.grandTotal,
      buyer_name: this.getName(),
      purpose: this.util.appName + ' Orders',
      redirect_url: this.api.baseUrl + 'v1/success_payments',
      phone: this.util.userInfo && this.util.userInfo.mobile ? this.util.userInfo.mobile : '',
      send_email: 'True',
      webhook: this.api.baseUrl,
      send_sms: 'True',
      email: this.getEmail()
    };

    this.util.show();
    this.api.post_private('v1/payments/instamojoPay', param).then((data: any) => {
      console.log('instamojo response', data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success && data.success.success == true) {
        const options: InAppBrowserOptions = {
          location: 'no',
          clearcache: 'yes',
          zoom: 'yes',
          toolbar: 'yes',
          closebuttoncaption: 'close'
        };
        const browser: any = this.iab.create(data.success.payment_request.longurl, '_blank', options);
        browser.on('loadstop').subscribe((event: any) => {
          const navUrl = event.url;
          console.log('navURL', navUrl);
          if (navUrl.includes('success_payments')) {
            browser.close();
            const urlItems = new URL(event.url);
            console.log(urlItems);
            const orderId = urlItems.searchParams.get('payment_id');
            console.log(orderId);
            this.createOrder(orderId);
          }
        });
      } else {
        const error = JSON.parse(data.error);
        console.log('error message', error);
        if (error && error.message) {
          this.util.showToast(error.message, 'danger', 'bottom');
          return false;
        }
        this.util.apiErrorHandler(error);
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  async payWithRazorPay() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      amount: this.cart.grandTotal ? this.cart.grandTotal * 100 : 5,
      email: this.getEmail(),
      logo: this.util && this.util.appLogo ? this.api.mediaURL + this.util.appLogo : 'null',
      name: this.getName(),
      app_color: this.util && this.util.app_color ? this.util.app_color : '#f47878'
    }
    const browser = this.iab.create(this.api.baseUrl + 'v1/payments/razorPay?' + this.api.JSON_to_URLEncoded(param), '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success_payments')) {
        const urlItems = new URL(event.url);
        console.log(urlItems);
        const orderId = urlItems.searchParams.get('pay_id');
        this.verifyPurchaseRazorPay(orderId);
      }

      if (navUrl.includes('status=authorized') || navUrl.includes('status=failed')) {
        console.log('close here');
        browser.close();
        const urlItems = new URL(event.url).pathname;
        console.log('--->>', urlItems.split('/'), urlItems.split('/').length, urlItems.split('/')[3]);
        if (urlItems.split('/').length > 5 && urlItems.split('/')[3].startsWith('pay_')) {
          const paymentId = urlItems.split('/')[3];
          console.log('paymentId', paymentId);
          this.verifyPurchaseRazorPay(paymentId);
        }
      }

    });
    console.log('browser=> end');
  }

  async payWithPayTm() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const browser = this.iab.create(this.api.baseUrl + 'v1/payNow?amount=' + this.cart.grandTotal, '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      console.log(navUrl.includes('success_payments'), navUrl.includes('failed_payments'));
      if (navUrl.includes('success_payments') || navUrl.includes('failed_payments')) {
        browser.close();
        if (navUrl.includes('success_payments')) {
          const urlItems = new URL(event.url);
          console.log(urlItems);
          const orderId = urlItems.searchParams.get('id');
          const txt_id = urlItems.searchParams.get('txt_id');
          const param = {
            key: orderId,
            txtId: txt_id
          };
          this.createOrder(JSON.stringify(param));
        } else {
          this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
        }
      }

    });
    console.log('browser=> end');
  }

  async payWithPayPal() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const browser = this.iab.create(this.api.baseUrl + 'v1/payments/payPalPay?amount=' + this.cart.grandTotal, '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      console.log(navUrl.includes('success_payments'), navUrl.includes('failed_payments'));
      if (navUrl.includes('success_payments') || navUrl.includes('failed_payments')) {
        browser.close();
        if (navUrl.includes('success_payments')) {
          const urlItems = new URL(event.url);
          console.log(urlItems);
          const orderId = urlItems.searchParams.get('pay_id');
          const param = {
            key: orderId,
          };
          this.createOrder(JSON.stringify(param));
        } else {
          this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
        }
      }

    });
    console.log('browser=> end');
  }

  async stripePayment() {
    const payMethod = this.payments.filter(x => x.id == this.pay_method);
    console.log(payMethod);
    const modal = await this.modalController.create({
      component: StripePayPage,
      componentProps: { currency_code: payMethod[0].currency_code }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data.data, data.role);
      if (data && data.role && data.role == 'done') {
        this.createOrder(data.data);
      }
    });

    await modal.present();

  }

  paymentChange() {
    const payMethod = this.payments.filter(x => x.id == this.pay_method);
    console.log(payMethod);
    if (payMethod && payMethod.length) {
      this.payName = payMethod[0].name;
    }
  }
}
