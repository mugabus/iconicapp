/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { NavController, PopoverController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-addresss',
  templateUrl: './addresss.page.html',
  styleUrls: ['./addresss.page.scss'],
})
export class AddresssPage implements OnInit {
  id: any;
  myaddress: any[] = [];
  from: any;
  selectedAddress: any;
  dummy = Array(10);
  constructor(
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
    public cart: CartService
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.from) {
        this.from = data.from;
      }
    });
    this.getAddress();
  }

  ionViewWillEnter() {
    this.getAddress();
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
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

  addNew() {
    this.router.navigate(['add-address']);
  }

  selectAddress() {
    if (this.from == 'cart') {
      const selecte = this.myaddress.filter(x => x.id == this.selectedAddress);
      const item = selecte[0];
      console.log('item', item);
      this.cart.deliveryAddress = item;
      this.cart.calcuate();
      this.router.navigate(['/tabs/cart/payment']);
    }
  }

  async openMenu(item: any, events: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: events,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data) {
        if (data.data == 'edit') {
          const navData: NavigationExtras = {
            queryParams: {
              from: 'edit',
              data: JSON.stringify(item)
            }
          };
          this.router.navigate(['add-address'], navData);
        } else if (data.data == 'delete') {
          console.log(item);
          Swal.fire({
            title: this.util.translate('Are you sure?'),
            text: this.util.translate('to delete this address'),
            icon: 'question',
            confirmButtonText: this.util.translate('Yes'),
            backdrop: false,
            background: 'white',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: this.util.translate('cancel')
          }).then(data => {
            console.log(data);
            if (data && data.value) {
              this.util.show();
              const param = {
                id: item.id
              };
              this.api.post_private('v1/address/deleteMyAddress', param).then(info => {
                console.log(info);
                this.util.hide();
                this.getAddress();
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
          });

        }
      }
    });
    await popover.present();
  }
}
