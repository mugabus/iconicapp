/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { RatingListPage } from '../rating-list/rating-list.page';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  qty = 0;

  loaded: boolean;

  name: any = '';
  realPrice: any;
  sellPrice: any;
  discount: any;
  description: any;
  is_single: any;
  subId: any;
  status: any;
  coverImage: any = '';
  veg: any;

  have_gram: any;
  gram: any;
  have_kg: any;
  kg: any;
  have_pcs: any;
  pcs: any;
  have_liter: any;
  liter: any;
  have_ml: any;
  ml: any;
  exp_date: any;

  in_stoke: any;
  in_offer: any;
  key_features: any = '';
  disclaimer: any = '';

  id: any;
  rate: any;
  gallery: any[] = [];
  slideOpts = {
    slidesPerView: 1,
  };

  slideOpts1 = {
    slidesPerView: 2.5,
  };
  related: any[] = [];
  quantiy: any = 0;
  productt: any;
  totalRating: any;
  storeId: any;
  storeName: any;
  size: any;
  variations: any;
  variant: any;
  storeIsActive: boolean = true;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private route: ActivatedRoute,
    public cart: CartService,
    private modalController: ModalController,
    private alertCtrl: AlertController
  ) {

    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.loaded = false;
        this.id = parseInt(data.id);
        this.getProduct();
      }
    })
  }
  async openViewer(url: any) {
    // const modal = await this.modalController.create({
    //   component: ViewerModalComponent,
    //   componentProps: {
    //     src: url
    //   },
    //   cssClass: 'ion-img-viewer',
    //   keyboardClose: true,
    //   showBackdrop: true
    // });

    // return await modal.present();
  }

  checkCartItems() {
    const item = this.cart.cart.filter(x => x.id == this.id);
    console.log('cart===>>>>>>', item);
    if (item && item.length) {
      this.quantiy = item[0].quantiy;
    }
  }

  getProduct() {
    const param = {
      id: this.id
    }
    this.api.post_public('v1/products/getById', param).then((data: any) => {
      this.loaded = true;
      console.log(data);
      this.gallery = [];
      if (data && data.status == 200 && data.data && data.data) {
        const info = data.data;
        this.productt = info;
        this.productt['quantiy'] = 0;
        this.name = info.name;
        this.description = info.descriptions;
        this.subId = info.sub_cate_id;
        this.coverImage = info.cover;
        this.key_features = info.key_features;
        this.disclaimer = info.disclaimer;
        this.discount = info.discount;
        this.exp_date = info.exp_date;
        this.gram = info.gram;
        this.have_gram = info.have_gram;
        this.kg = info.kg;
        this.have_kg = info.have_kg;
        this.liter = info.liter;
        this.have_liter = info.have_liter;
        this.ml = info.ml;
        this.have_ml = info.have_ml;
        this.pcs = info.pcs;
        this.have_pcs = info.have_pcs;
        this.in_offer = info.in_offer;
        this.in_stoke = info.in_stoke;
        this.is_single = info.is_single;
        this.veg = info.kind;
        this.realPrice = parseFloat(info.original_price);
        this.sellPrice = parseFloat(info.sell_price);
        this.status = info.status;
        this.rate = info.rating;
        this.totalRating = info.total_rating;
        this.storeId = info.store_id;
        this.storeName = info.s_name;
        this.gallery.push(this.coverImage);
        this.size = info.size;
        if (info.variations && info.size == 1 && info.variations != '') {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.variations)) {
            this.variations = JSON.parse(info.variations);
            this.variant = 0;
            this.productt['variations'] = JSON.parse(info.variations);
            this.productt['variant'] = 0;
          } else {
            info.variations = [];
            this.productt['variations'] = [];
            this.variant = 1;
            this.productt['variant'] = 1;
          }
        } else {
          this.variations = [];
          this.variant = 1;
          this.productt['variations'] = [];
          this.productt['variant'] = 1;
        }
        this.checkCartItems();
        if (info.images) {
          const images = JSON.parse(info.images);
          console.log('images===>>>', images);
          if (images[0]) {
            this.gallery.push(images[0]);
          }
          if (images[1]) {
            this.gallery.push(images[1]);
          }
          if (images[2]) {
            this.gallery.push(images[2]);
          }
          if (images[3]) {
            this.gallery.push(images[3]);
          }
          if (images[4]) {
            this.gallery.push(images[4]);
          }
          if (images[5]) {
            this.gallery.push(images[5]);
          }
        }

        this.related = [];
        this.related = data.related.filter((x: any) => x.id != this.id);
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



  back() {
    this.util.onBack();
  }

  ngOnInit() {
  }

  addToCart() {
    // this.quantiy = 1;
    // this.productt.quantiy = 1;
    // this.cart.addItem(this.productt);
    console.log(this.util.makeOrders); // 0=> from multiple stores // 1 = single store only
    if (this.util && this.util.makeOrders == 0) {
      this.quantiy = 1;
      this.cart.addItem(this.productt);
    } else if (this.util && this.util.makeOrders == 1) {
      // check existing items and store
      console.log('exist item and store id');
      if (this.cart.cart.length == 0) {
        this.quantiy = 1;
        this.cart.addItem(this.productt);
      } else if (this.cart.cart.length >= 0) {
        const products = this.cart.cart.filter(x => x.store_id != this.storeId);
        console.log(products);
        if (products && products.length) {
          this.cart.clearCartAlert().then((data: any) => {
            console.log(data);
            if (data && data == true) {
              this.quantiy = 1;
            }
          });
        } else {
          this.quantiy = 1;
          this.cart.addItem(this.productt);
        }
      }
    }
    console.log(this.cart.itemId.includes(this.id), this.id);
  }


  gotoStore() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.storeId,
        name: this.storeName
      }
    };
    this.util.navigateToPage('tabs/home/store', param);
  }

  add() {
    this.quantiy = this.quantiy + 1;
    this.cart.addQuantity(this.quantiy, this.id);
  }

  remove() {
    if (this.quantiy == 1) {
      this.quantiy = 0;
      this.cart.removeItem(this.id)
    } else {
      this.quantiy = this.quantiy - 1;
      this.cart.addQuantity(this.quantiy, this.id);
    }
  }

  onShare() {

  }

  onFav() {
    console.log(this.id);
    if (this.util.favIds.includes(this.id)) {
      console.log('remove this')
      this.util.removeFav(this.id);
      console.log('after removed', this.util.favIds);
      console.log('edit');
      const param = {
        id: localStorage.getItem('uid'),
        ids: this.util.favIds.join()
      };
      this.util.haveFav = true;
      console.log('parama', param)
      this.api.post_private('v1/favourite/update', param).then((data: any) => {
        console.log('save response', data);
        if (data && data.status != 200) {
          this.util.errorToast(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log('error on save', error);
        this.util.apiErrorHandler(error);
      });
    } else {
      console.log('add new');
      this.util.setFav(this.id);
      console.log('after added', this.util.favIds);
      if (this.util.haveFav) {
        console.log('edit');
        const param = {
          id: localStorage.getItem('uid'),
          ids: this.util.favIds.join()
        };
        this.util.haveFav = true;
        console.log('parama', param)
        this.api.post_private('v1/favourite/update', param).then((data: any) => {
          console.log('save response', data);
          if (data && data.status != 200) {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log('error on save', error);
          this.util.apiErrorHandler(error);
        });
      } else {
        console.log('save');
        const param = {
          uid: localStorage.getItem('uid'),
          ids: this.util.favIds.join()
        };
        this.util.haveFav = true;
        console.log('parama', param)
        this.api.post_private('v1/favourite/create', param).then((data: any) => {
          console.log('save response', data);
          if (data && data.status != 200) {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log('error on save', error);
          this.util.apiErrorHandler(error);
        });
      }
    }
  }

  singleProduct(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };

    this.util.navigateToPage('/tabs/categories/product', param);
  }

  async productRating() {
    const modal = await this.modalController.create({
      component: RatingListPage,
      componentProps: {
        id: this.id,
        name: this.name,
        type: 'product'
      }
    });

    await modal.present();

  }
  // productRating() {
  //   // const param: NavigationExtras = {
  //   //   queryParams: {
  //   //     id: this.id,
  //   //     name: this.name,
  //   //     type: 'product'
  //   //   }
  //   // }

  //   // this.util.navigateToPage('/tabs/home/ratings', param);
  // }

  async variants() {

    const allData: any[] = [];

    if (this.variations != '' && this.variations.length > 0 && this.variations[0].items.length > 0) {
      console.log('->', this.variations[0].items);
      this.variations[0].items.forEach((element: any, index: any) => {
        console.log('OK');
        let title = '';
        if (this.util.cside == 'left') {
          const price = this.variations && this.variations[0] &&
            this.variations[0].items[index] &&
            this.variations[0].items[index].discount ? this.variations[0].items[index].discount :
            this.variations[0].items[index].price;
          title = element.title + ' - ' + this.util.currecny + ' ' + price;
        } else {
          const price = this.variations && this.variations[0] && this.variations[0].items[index] &&
            this.variations[0].items[index].discount ? this.variations[0].items[index].discount :
            this.variations[0].items[index].price;
          title = element.title + ' - ' + price + ' ' + this.util.currecny;
        }
        const data = {
          name: element.title,
          type: 'radio',
          label: title,
          value: index,
          checked: this.variant == index
        };
        allData.push(data);
      });

      console.log('All Data', allData);
      const alert = await this.alertCtrl.create({
        header: this.name,
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
              console.log('before', this.variant);
              this.variant = data;
              console.log('after', this.variant);
              this.productt['variant'] = data;
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
