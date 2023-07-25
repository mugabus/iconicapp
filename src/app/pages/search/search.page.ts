/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('inputId', { static: false }) ionSearch: { setFocus: () => void; };

  setFocusOnInput() {
    this.ionSearch.setFocus();
  }
  searchDataResults: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.ionSearch.setFocus();
  }

  onSearchChange(event: any) {
    const search = event.target.value;
    console.log(search);
    if (search && search.trim() != '') {
      console.log('search data', search);
      this.api.post_public('v1/products/searchQuery', { param: search, stores: this.util.active_store.join() }).then((data: any) => {
        console.log(data);
        if (data && data.status && data.status == 200) {
          this.searchDataResults = data.data;
          console.log('search result', this.searchDataResults);
        }
      }, error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch((error) => {
        console.log(error);
        this.util.apiErrorHandler(error);
      });

    } else {
      this.searchDataResults = [];
    }
  }

  goBack() {
    this.modalController.dismiss();
  }

  goToSingleProduct(item: any) {
    this.goBack();
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.util.navigateToPage('tabs/home/product', param);
  }
}
