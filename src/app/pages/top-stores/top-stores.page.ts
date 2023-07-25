/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-top-stores',
  templateUrl: './top-stores.page.html',
  styleUrls: ['./top-stores.page.scss'],
})
export class TopStoresPage implements OnInit {
  dummy = Array(10);
  dummyStores: any[] = [];
  stores: any[] = [];
  haveSearch: boolean;
  constructor(
    public api: ApiService,
    public util: UtilService,
  ) {
    this.haveSearch = false;
    this.getData();
  }

  getData() {
    if (this.util.findType == 0) {
      this.getHomeDataWithCity();
    } else if (this.util.findType == 1) {
      this.getHomeDataWithGeoLocation();
    } else if (this.util.findType == 2) {
      this.getHomeDataWithZipCode();
    }
  }

  parseResponse(data: any) {
    console.log(data);
    this.stores = data;
    this.dummy = [];
    this.stores.forEach(async (element) => {
      element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
    });
    this.dummyStores = this.stores;
  }

  getHomeDataWithCity() {
    this.api.post_public('v1/home/searchStoreWithCity', { id: localStorage.getItem('cityId') }).then((data: any) => {
      console.log(data);
      this.stores = [];
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.parseResponse(data.data);
      } else {
        this.stores = [];
        this.dummy = [];
      }
    }, error => {
      this.stores = [];
      this.dummy = [];
      this.dummyStores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.stores = [];
      this.dummy = [];
      this.dummyStores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getHomeDataWithGeoLocation() {
    const param = {
      lat: localStorage.getItem('lat'),
      lng: localStorage.getItem('lng')
    }
    this.api.post_public('v1/home/searchStoreWithGeoLocation', param).then((data: any) => {
      console.log(data);
      this.stores = [];
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.parseResponse(data.data);
      } else {
        this.stores = [];
        this.dummy = [];
      }
    }, error => {
      this.stores = [];
      this.dummyStores = [];
      this.dummy = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.stores = [];
      this.dummy = [];
      this.dummyStores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getHomeDataWithZipCode() {
    this.api.post_public('v1/home/searchStoreWithZipCode', { zipcode: localStorage.getItem('zipcode') }).then((data: any) => {
      console.log(data);
      this.stores = [];
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.parseResponse(data.data);
      } else {
        this.stores = [];
        this.dummy = [];
      }
    }, error => {
      this.stores = [];
      this.dummy = [];
      this.dummyStores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.stores = [];
      this.dummy = [];
      this.dummyStores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  ngOnInit() {
  }

  search() {
    this.haveSearch = !this.haveSearch;
  }

  onSearchChange(event: any) {
    if (event.detail.value) {
      this.stores = this.dummyStores.filter((item) => {
        return item.name.toLowerCase().indexOf(event.detail.value.toLowerCase()) > -1;
      });
    } else {
      this.stores = this.dummyStores;
    }
  }

  openStore(item: any) {
    console.log('open store', item);

    const param: NavigationExtras = {
      queryParams: {
        id: item.uid,
        name: item.name
      }
    };
    this.util.navigateToPage('tabs/home/store', param);
  }


  getTime(time: any) {
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  getStores() {
    // const param = {
    //   id: localStorage.getItem('city')
    // }
    // this.api.post('stores/getByCity', param).subscribe((stores: any) => {
    //   console.log('stores by city', stores);
    //   this.stores = [];
    //   this.dummy = [];
    //   if (stores && stores.status == 200 && stores.data && stores.data.length) {
    //     this.stores = stores.data;
    //     this.dummy = [];
    //     this.stores.forEach(async (element) => {
    //       element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
    //     });
    //     this.dummyStores = this.stores;
    //   }
    // }, error => {
    //   console.log(error);
    //   this.util.errorToast(this.util.getString('Something went wrong'));
    //   this.dummy = [];
    //   this.dummyStores = [];
    //   this.stores = [];
    // });
  }

  isOpen(start: any, end: any) {
    const format = 'H:mm:ss';
    const ctime = moment().format('HH:mm:ss');
    const time = moment(ctime, format);
    const beforeTime = moment(start, format);
    const afterTime = moment(end, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false
  }

  back() {
    this.util.onBack();
  }

}
