/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.page.html',
  styleUrls: ['./sub-category.page.scss'],
})
export class SubCategoryPage implements OnInit {
  @ViewChild('content', { static: false }) private content: any;
  id: any;
  name: any;
  subCates: any[] = [];
  tabSelected: any;
  products: any[] = [];
  dummyProducts: any[] = [];
  allProducts: any[] = [];
  limit: any;

  dummys = Array(20);
  dummyCates = Array(10);
  constructor(
    private route: ActivatedRoute,
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    private alertCtrl: AlertController
  ) {
    this.dummys = Array(20);
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.limit = 1;
        this.name = data.name ? data.name : 'Top Picked';
        this.getCates();
      }
    });
  }

  ngOnInit() {
  }

  getCates() {
    this.dummys = Array(10);
    this.subCates = [];
    this.products = [];
    this.dummyProducts = Array(10);
    this.api.post_public('v1/subCategories/getFromCateId', { id: this.id }).then((data: any) => {
      console.log(data);
      this.dummys = [];
      this.dummyCates = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.subCates = data.data;
        this.tabSelected = data.data[0].id;
        this.getSubProducts(false, 'none');
      }
    }, error => {
      console.log(error);
      this.dummys = [];
      this.dummyCates = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummys = [];
      this.dummyCates = [];
      this.util.apiErrorHandler(error);
    });
  }

  getSubProducts(limit: any, event: any) {
    const param = {
      id: this.id,
      storeIds: this.util.active_store.join(),
      sub: this.tabSelected,
      limit: this.limit * 10
    }
    console.log(param);

    this.api.post_public('v1/products/getWithSubCategory', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.products = data.data;
        this.dummyProducts = this.products;
        console.log('real products', this.products);
        console.log('cart=>', this.cart.cart);
        this.products.forEach(info => {
          if (info.variations && info.size == 1 && info.variations != '') {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.variations)) {
              info.variations = JSON.parse(info.variations);
              info['variant'] = 0;
            } else {
              info.variations = [];
              info['variant'] = 1;
            }
          } else {
            info.variations = [];
            info['variant'] = 1;
          }
          if (this.cart.itemId.includes(info.id)) {
            const index = this.cart.cart.filter(x => x.id == info.id);
            info['quantiy'] = index[0].quantiy;
          } else {
            info['quantiy'] = 0;
          }
        });
        this.dummys = [];
      } else {
        this.dummys = [];
      }
      if (limit) {
        event.complete();
      }
    }, error => {
      console.log(error);
      this.dummys = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummys = [];
      this.util.apiErrorHandler(error);
    });
  }

  addToCart(item: any, index: any) {
    console.log(this.util.makeOrders); // 0=> from multiple stores // 1 = single store only
    console.log(item);
    if (this.util && this.util.makeOrders == 0) {
      this.products[index].quantiy = 1;
      this.cart.addItem(item);
    } else if (this.util && this.util.makeOrders == 1) {
      // check existing items and store
      console.log('exist item and store id');
      if (this.cart.cart.length == 0) {
        this.products[index].quantiy = 1;
        this.cart.addItem(item);
      } else if (this.cart.cart.length >= 0) {
        const products = this.cart.cart.filter(x => x.store_id != item.store_id);
        console.log(products);
        if (products && products.length) {
          this.cart.clearCartAlert().then((data: any) => {
            console.log(data);
            if (data && data == true) {
              this.products.forEach(element => {
                element.quantiy = 0;
              });
            }
          });
        } else {
          this.products[index].quantiy = 1;
          this.cart.addItem(item);
        }
      }
    }
  }


  add(product: any, index: any) {
    console.log(product);
    if (this.products[index].quantiy > 0) {
      this.products[index].quantiy = this.products[index].quantiy + 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }

  remove(product: any, index: any) {
    console.log(product, index);
    if (this.products[index].quantiy == 1) {
      this.products[index].quantiy = 0;
      this.cart.removeItem(product.id)
    } else {
      this.products[index].quantiy = this.products[index].quantiy - 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }
  // getByCid
  onMenuClick(cid: any) {

    this.tabSelected = cid;
    this.limit = 1;
    this.dummyProducts = [];
    this.allProducts = [];
    this.dummys = Array(30);
    this.getSubProducts(false, 'none');
    this.content.scrollToPoint(0, 0, 1000);
  }



  onProductClick(item: any) {
    console.log(item);
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };

    this.util.navigateToPage('tabs/home/product', param);
  }

  back() {
    this.util.onBack();
  }

  onSearchChange(event: any) {
    if (event.detail.value) {
      this.allProducts = this.dummyProducts.filter((item) => {
        return item.name.toLowerCase().indexOf(event.detail.value.toLowerCase()) > -1;
      });
    } else {
      this.allProducts = [];
    }

  }

  singleProduct(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };

    this.util.navigateToPage('tabs/home/product', param);
  }

  loadData(event: any) {
    console.log(event);
    this.limit = this.limit + 1;
    this.getSubProducts(true, event.target);
  }

  goToSingleProduct(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };

    this.util.navigateToPage('tabs/home/product', param);
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
              console.log('before', this.products[indeX].variant);
              this.products[indeX].variant = data;
              console.log('after', this.products[indeX].variant);
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
