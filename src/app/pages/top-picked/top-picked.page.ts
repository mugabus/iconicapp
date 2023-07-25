/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { FiltersComponent } from 'src/app/components/filters/filters.component';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { SortPage } from '../sort/sort.page';

@Component({
  selector: 'app-top-picked',
  templateUrl: './top-picked.page.html',
  styleUrls: ['./top-picked.page.scss'],
})
export class TopPickedPage implements OnInit {
  limit: any;
  products: any[] = [];
  dummyProduct: any[] = [];
  dummy = Array(20);
  qty = 0;

  haveSearch: boolean;
  mode: any = 'grid';
  selectedFilter: any = '';
  selectedFilterID: any;

  min: any;
  max: any;
  minValue: any;
  maxValue: any;
  isClosedFilter: boolean = true;
  discount: any;
  haveSortFilter: boolean;
  constructor(
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private alertCtrl: AlertController
  ) {
    this.getProducts();
  }

  sortFilter() {
    if (this.discount && this.discount != null) {
      console.log('filter with discount');
      const products: any[] = [];
      this.dummyProduct.forEach(element => {
        if (parseFloat(element.original_price) >= this.minValue && parseFloat(element.original_price) <= this.maxValue &&
          parseFloat(this.discount) <= parseFloat(element.discount)) {
          products.push(element);
        }
        this.products = products;
      });
    } else {
      console.log('filter without discount');
      const products: any[] = [];
      this.dummyProduct.forEach(element => {
        if (parseFloat(element.original_price) >= this.minValue && parseFloat(element.original_price) <= this.maxValue) {
          products.push(element);
        }
      });
      this.products = products;
    }
  }

  ngOnInit() {
  }

  search() {
    this.haveSearch = !this.haveSearch;
  }

  onSearchChange(event: any) {
    console.log(event.detail.value);
    if (event.detail.value) {
      this.products = this.dummyProduct.filter((item) => {
        return item.name.toLowerCase().indexOf(event.detail.value.toLowerCase()) > -1;
      });
    } else {
      this.products = this.dummyProduct;
    }
  }
  changeMode() {
    this.mode = this.mode == 'grid' ? 'list' : 'grid';
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

  getProducts() {
    this.dummyProduct = [];
    this.products = [];
    this.api.post_public('v1/products/getTopRated', { storeIds: this.util.active_store.join() }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200) {
        const products = [...data.topProducts, ...data.homeProducts];
        console.log(products);

        products.forEach(element => {
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
        this.products = products;
        this.dummyProduct = products;
        this.max = Math.max(...this.products.map(o => o.original_price), 0);
        console.log('maxValueOfPrice', this.max);

        this.min = Math.min.apply(null, this.products.map(item => item.original_price))
        console.log('minValueOfPrice', this.min);
        if (this.selectedFilterID && this.selectedFilterID != null) {
          this.updateFilter();
        }
        if (this.haveSortFilter && this.isClosedFilter == false) {
          this.sortFilter();
        }

      }
    }, error => {
      this.dummy = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.dummy = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    });


  }

  back() {
    this.util.onBack();
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

  checkCart(id: any) {
    const item = this.cart.itemId;
    console.log('item', item);
    return false;
  }

  singleProduct(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };

    this.util.navigateToPage('/tabs/categories/product', param);
  }
  updateFilter() {
    switch (this.selectedFilterID) {
      case '1':
        console.log('its rating');
        this.selectedFilter = this.util.translate('Popularity');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.total_rating) < parseFloat(a.total_rating) ? -1
            : (parseFloat(b.total_rating) > parseFloat(a.total_rating) ? 1 : 0));
        break;

      case '2':
        console.log('its low to high');
        this.selectedFilter = this.util.translate('Price L-H');
        this.products = this.products.sort((a, b) =>
          parseFloat(a.original_price) < parseFloat(b.original_price) ? -1
            : (parseFloat(a.original_price) > parseFloat(b.original_price) ? 1 : 0));
        break;

      case '3':
        console.log('its highht to low');
        this.selectedFilter = this.util.translate('Price H-L');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.original_price) < parseFloat(a.original_price) ? -1
            : (parseFloat(b.original_price) > parseFloat(a.original_price) ? 1 : 0));
        break;

      case '4':
        console.log('its a - z');
        this.selectedFilter = this.util.translate('A-Z');
        this.products = this.products.sort((a, b) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
        break;

      case '5':
        console.log('its z - a');
        this.selectedFilter = this.util.translate('Z-A');
        this.products = this.products.sort((a, b) => {
          if (a.name > b.name) { return -1; }
          if (a.name < b.name) { return 1; }
          return 0;
        });
        break;

      case '6':
        console.log('its % off');
        this.selectedFilter = this.util.translate('% Off');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.discount) < parseFloat(a.discount) ? -1
            : (parseFloat(b.discount) > parseFloat(a.discount) ? 1 : 0));
        break;

      default:
        break;
    }
  }

  async filter(events: any) {
    const popover = await this.popoverController.create({
      component: FiltersComponent,
      event: events,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data && data.role == 'selected') {
        this.selectedFilterID = data.data;
        this.updateFilter();
      }
    });
    await popover.present();
  }

  async priceFilter() {
    // console.log('print a filter');
    // this.util.publishFilter({ min: this.min, max: this.max, from: 'products' });
    // this.menuCtrl.enable(true, 'menu1');
    // this.menuCtrl.open('menu1').then(() => {
    //   console.log('menu 1');
    // });
    const modal = await this.modalController.create({
      component: SortPage,
      componentProps: { min: this.min, max: this.max, from: 'products', discountSelected: this.discount }
    });
    modal.onDidDismiss().then((datas: any) => {
      const data = datas.data;
      console.log(data);
      this.haveSortFilter = true;
      if (this.products && data.from == 'products') {
        this.minValue = data.min;
        this.maxValue = data.max;
        this.discount = data.discount;
        this.isClosedFilter = data.close;
        if (this.isClosedFilter == false) {
          this.sortFilter();
        } else {
          this.products = this.dummyProduct;
        }
      }
    })
    return await modal.present();
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
