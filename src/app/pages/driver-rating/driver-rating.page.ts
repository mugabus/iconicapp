/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-driver-rating',
  templateUrl: './driver-rating.page.html',
  styleUrls: ['./driver-rating.page.scss'],
})
export class DriverRatingPage implements OnInit {
  id: any;
  name: any;
  rate: any = 2;
  comment: any = '';
  total: any;
  rating: any[] = [];
  way: any;
  constructor(
    private navParam: NavParams,
    private modalCtrl: ModalController,
    public util: UtilService,
    public api: ApiService
  ) {

    this.id = this.navParam.get('id');
    this.name = this.navParam.get('name');
    if (this.navParam.get('way')) {
      this.way = this.navParam.get('way');
    } else {
      this.way = 'order';
    }
    console.log('id', this.id);
    console.log('name', this.name);
    this.util.show();
    const param = {
      id: this.id
    }
    this.api.post_private('v1/ratings/getByDriverId', param).then((data: any) => {
      this.util.hide();
      console.log('data', data);
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.rating = data.data.map(function (x: any) {
          return x.rate;
        });
        this.total = this.rating.length;
      }

    }, error => {
      console.log(error);
      this.util.hide();
      this.total = 0;
      this.rating = [];
    });
  }

  ngOnInit() {
  }

  close(item: any) {
    this.modalCtrl.dismiss(item, item);
  }

  onRatingChange(event: any) {
    console.log(event);
    this.rate = event;
  }

  submit() {
    if (this.comment == '') {
      this.util.errorToast(this.util.translate('Please enter comment'));
      return false;
    }

    this.rating.push(this.rate);
    const sumOfRatingCount = this.rating.length * 5;
    const sumOfStars = this.rating.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    const ratings = ((sumOfStars * 5) / sumOfRatingCount).toFixed(2);
    console.log(ratings);
    console.log(this.rating);

    console.log('rate', this.rate, this.comment);

    const param = {
      uid: localStorage.getItem('uid'),
      pid: 0,
      did: this.id,
      sid: 0,
      rate: this.rate,
      msg: this.comment,
      way: this.way,
      status: 1,
      timestamp: moment().format('YYYY-MM-DD'),
    };
    console.log(param);
    this.util.show();
    this.api.post_private('v1/ratings/saveDriversRatings', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status == 200) {
        this.util.showToast(this.util.translate('Rating added'), 'success', 'bottom');
        this.close('success');
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
}
