/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  dummy: any[] = [];
  orders: any[] = [];
  limit: any;
  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService,) {

  }

  ionViewWillEnter() {
    this.limit = 1;
    this.dummy = Array(15);
    this.getOrders('', false);
  }
  getOrders(event: any, haveRefresh: any) {
    const param = {
      id: localStorage.getItem('uid'),
      limit: this.limit * 10
    }
    this.api.post_private('v1/orders/getByUid', param).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status == 200 && data.data.length > 0) {
        const orders = data.data;
        orders.forEach((element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders.forEach((order: any) => {
              if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                order.variations = JSON.parse(order.variations);
                if (order["variant"] == undefined) {
                  order['variant'] = 0;
                }
              }
            });
          }
        });
        this.orders = orders;
        if (haveRefresh) {
          event.target.complete();
        }
        console.log('orderss==>?', this.orders);
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.orders = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.orders = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  ngOnInit() {
  }

  goToOrder(val: any) {
    const navData: NavigationExtras = {
      queryParams: {
        id: val.id
      }
    }
    this.router.navigate(['/order-details'], navData);
  }

  doRefresh(event: any) {
    console.log(event);
    this.limit = this.limit + 1;
    this.getOrders(event, true);
  }

  searchWithOrderId(event: any) {
    const search = event.target.value;
    console.log(search);
    if (search && search.trim() != '') {
      console.log('search data', search);
      this.api.post_private('v1/orders/searchWithId', { id: search, uid: localStorage.getItem('uid') }).then((data: any) => {
        console.log(data);
        if (data && data.status == 200 && data.data.length > 0) {
          const orders = data.data;
          orders.forEach((element: any) => {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
              element.orders = JSON.parse(element.orders);
              element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
              element.orders.forEach((order: any) => {
                if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                  order.variations = JSON.parse(order.variations);
                  if (order["variant"] == undefined) {
                    order['variant'] = 0;
                  }
                }
              });
            }
          });
          this.orders = orders;

          console.log('orderss==>?', this.orders);
        }
      }, error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch((error) => {
        console.log(error);
        this.util.apiErrorHandler(error);
      });

    } else {
      this.limit = 1;
      this.dummy = Array(15);
      this.getOrders('', false);
    }
  }
}
