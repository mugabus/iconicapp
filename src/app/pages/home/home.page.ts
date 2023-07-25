/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { CartService } from 'src/app/services/cart.service';
import { AlertController, ModalController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { SearchPage } from '../search/search.page';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  slideOpts = {
    slidesPerView: 1,
  };
  slideTops = {
    slidesPerView: 2,
    spaceBetween: 5,
    slideShadows: true,
  }
  categories: any[] = [];
  dummyCates: any[] = [];

  dummyBanners: any[] = [];
  banners: any[] = [];

  bottomDummy: any[] = [];
  bottomBanners: any[] = [];

  betweenDummy: any[] = [];
  betweenBanners: any[] = [];

  dummyTopProducts: any[] = [];
  topProducts: any[] = [];

  products: any[] = [];
  dummyProducts: any[] = [];


  dummyStores: any[] = [];
  stores: any[] = [];

  allcates: any[] = [];

  haveData: boolean;
  searchDataResults: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    private alertCtrl: AlertController,
    private modalController: ModalController,
    private chMod: ChangeDetectorRef
  ) {
    this.util.getTypeChanged().subscribe(() => {
      setTimeout(() => {
        this.getData();
      }, 1000);
    });
    setTimeout(() => {
      this.getData();
    }, 1000);

  }

  resetData() {
    this.dummyCates = Array(10);
    this.dummyBanners = Array(5);
    this.bottomDummy = Array(5);
    this.betweenDummy = Array(5);
    this.dummyTopProducts = Array(5);
    this.allcates = [];
    this.stores = [];
    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];
  }

  clearDummy() {
    this.dummyCates = [];
    this.dummyBanners = [];
    this.bottomDummy = [];
    this.betweenDummy = [];
    this.dummyTopProducts = [];
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

  ngOnInit() {
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

  async openSearchModal() {
    console.log('open search model');

    const modal = await this.modalController.create({
      component: SearchPage,
      componentProps: { value: 123 }
    });

    await modal.present();

  }

  parseResponse(data: any) {
    console.log(data);
    this.clearDummy();
    this.allcates = data.category;
    this.categories = data.category;
    this.stores = data.stores;
    this.stores.forEach(async (element) => {
      element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
    });
    data.banners.forEach((element: any) => {
      if (element.position == 0) {
        this.banners.push(element);
      } else if (element.position == 1) {
        this.bottomBanners.push(element);
      } else {
        this.betweenBanners.push(element);
      }
    });
    this.util.active_store = [...new Set(this.stores.map(item => item.uid))];
    const finalProducts = [...data.homeProducts, ...data.topProducts];
    this.topProducts = finalProducts;
    this.util.cityId = data.cityInfo.id;
    this.topProducts.forEach(element => {
      if (element.variations && element.size == 1 && element.variations != '') {
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.variations)) {
          element.variations = JSON.parse(element.variations);
          element['variant'] = 0;
        } else {
          element.variations = [];
          element['variant'] = 1;
        }
      } else {
        element.variations = [];
        element['variant'] = 1;
      }
      if (this.cart.itemId.includes(element.id)) {
        const index = this.cart.cart.filter(x => x.id == element.id);
        element['quantiy'] = index[0].quantiy;
      } else {
        element['quantiy'] = 0;
      }

    });
    this.chMod.detectChanges();
    console.log(this.topProducts);
  }

  getHomeDataWithCity() {
    this.resetData();
    this.api.post_public('v1/home/searchWithCity', { id: localStorage.getItem('cityId') }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data && data.data.stores && data.data.stores.length) {
        this.haveData = true;
        this.parseResponse(data.data);
      } else {
        this.clearDummy();
        this.haveData = false;
      }
    }, error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
      this.util.apiErrorHandler(error);
    });
  }

  getHomeDataWithGeoLocation() {
    this.resetData();
    const param = {
      lat: localStorage.getItem('lat'),
      lng: localStorage.getItem('lng')
    }
    this.api.post_public('v1/home/searchWithGeoLocation', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data && data.data.stores && data.data.stores.length) {
        this.haveData = true;
        this.parseResponse(data.data);
      } else {
        this.clearDummy();
        this.haveData = false;
      }
    }, error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
      this.util.apiErrorHandler(error);
    });
  }

  getHomeDataWithZipCode() {
    this.resetData();
    this.api.post_public('v1/home/searchWithZipCode', { zipcode: localStorage.getItem('zipcode') }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data && data.data.stores && data.data.stores.length) {
        this.haveData = true;
        this.parseResponse(data.data);
      } else {
        this.clearDummy();
        this.haveData = false;
      }
    }, error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
      this.util.apiErrorHandler(error);
    });
  }


  getTime(time: any) {
    return moment(time, ['h:mm A']).format('hh:mm A');
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
              console.log('before', this.topProducts[indeX].variant);
              this.topProducts[indeX].variant = data;
              console.log('after', this.topProducts[indeX].variant);
            }
          }
        ]
      });

      await alert.present();
    } else {
      console.log('none');
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

  topicked() {
    this.util.navigateToPage('/tabs/home/top-picked');
  }

  topStores() {
    this.util.navigateToPage('top-stores');
  }

  allOffers() {
    this.util.navigateToPage('all-offers');
  }

  goToSingleProduct(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };

    this.util.navigateToPage('tabs/home/product', param);
  }

  goToCatrgory() {
    this.util.navigateToPage('/tabs/categories');
  }

  subCate(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        name: item.name
      }
    };
    this.util.navigateToPage('tabs/home/sub-category', param);
  }


  openLink(item: any) {
    console.log(item);

    if (item.type == 0) {
      // Category
      console.log('open category');
      const name = this.categories.filter(x => x.id == item.link);
      let cateName: any = '';
      if (name && name.length) {
        cateName = name[0].name
      }
      const param: NavigationExtras = {
        queryParams: {
          id: item.link,
          name: cateName
        }
      };
      this.util.navigateToPage('tabs/home/sub-category', param);
    } else if (item.type == 1) {
      // product
      console.log('open product');
      const param: NavigationExtras = {
        queryParams: {
          id: item.link
        }
      };

      this.util.navigateToPage('tabs/home/product', param);
    } else {
      // link
      console.log('open link');
      // this.iab.create(item.link, '_blank');
      window.open(item.link, '_system');
    }
  }

  goToProductList(val: any) {
    const navData: NavigationExtras = {
      queryParams: {
        id: val.id,
        name: val.name,
        from: 'home'
      }
    }
    this.util.navigateToPage('/tabs/home/products', navData);
  }


  // cart
  addToCart(item: any, index: any) {
    console.log(this.util.makeOrders); // 0=> from multiple stores // 1 = single store only
    console.log(item);
    if (this.util && this.util.makeOrders == 0) {
      this.topProducts[index].quantiy = 1;
      this.cart.addItem(item);
    } else if (this.util && this.util.makeOrders == 1) {
      // check existing items and store
      console.log('exist item and store id');
      if (this.cart.cart.length == 0) {
        this.topProducts[index].quantiy = 1;
        this.cart.addItem(item);
      } else if (this.cart.cart.length >= 0) {
        const products = this.cart.cart.filter(x => x.store_id != item.store_id);
        console.log(products);
        if (products && products.length) {
          this.cart.clearCartAlert().then((data: any) => {
            console.log(data);
            if (data && data == true) {
              this.topProducts.forEach(element => {
                element.quantiy = 0;
              });
            }
          });
        } else {
          this.topProducts[index].quantiy = 1;
          this.cart.addItem(item);
        }
      }
    }
  }


  getQuanity(id: any) {
    const data = this.cart.cart.filter(x => x.id == id);
    return data[0].quantiy;
  }

  add(product: any, index: any) {
    console.log(product);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy > 0) {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy + 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
  }

  remove(product: any, index: any) {
    console.log(product, index);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy == 1) {
      this.topProducts[index].quantiy = 0;
      this.cart.removeItem(product.id)
    } else {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy - 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
  }

  findLocation() {
    this.util.navigateToPage('find-location');
  }
}
