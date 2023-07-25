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
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  constructor(
    public util: UtilService,
    public api: ApiService,
    public cart: CartService
  ) { }

  ngOnInit() {
  }

  loggedIn() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid != 'null') {
      return true;
    }
    return false;
  }

  ditProfile() {
    this.util.navigateToPage('/edit-profile');
  }

  logout() {
    this.util.show();
    this.api.post_private('v1/auth/logout', {}).then((data: any) => {
      this.util.hide();
      console.log(data)
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.cart.cart = [];
      this.cart.itemId = [];
      this.cart.totalPrice = 0;
      this.cart.grandTotal = 0;
      this.cart.coupon = null;
      this.cart.discount = null;
      this.util.navigateRoot('/tabs/home');
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    });

  }

  orders() {
    this.util.navigateToPage('/tabs/orders');
  }

  goToFav() {
    this.util.navigateToPage('/favorite');
  }

  goToMethods() {
    this.util.navigateToPage('/payment-method');
  }

  goToHistory() {
    this.util.navigateToPage('/payment-history');
  }

  editProfile() {
    this.util.navigateToPage('/tabs/account/profile');
  }

  goToRefer() {
    this.util.navigateToPage('/tabs/account/referral');
  }

  goToWallet() {
    this.util.navigateToPage('/tabs/account/wallet');
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Groceryee';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@groceryee.com';
  }

  getProfile() {
    return this.util.userInfo && this.util.userInfo.cover ? this.api.mediaURL + this.util.userInfo.cover : 'assets/imgs/user.png';
  }

  goLangs() {
    this.util.navigateToPage('languages');
  }

  goToAddress() {
    const param: NavigationExtras = {
      queryParams: {
        from: 'account'
      }
    }
    this.util.navigateToPage('addresss', param);
  }

  goToContact() {
    this.util.navigateToPage('tabs/account/contacts');
  }

  reset() {
    this.util.navigateToPage('reset-password');
  }

  goToChats() {
    this.util.navigateToPage('chats');
  }

  goFaqs() {
    const param: NavigationExtras = {
      queryParams: {
        id: 5,
        name: 'FAQs'
      }
    }
    this.util.navigateToPage('/tabs/account/app-pages', param);
  }

  goHelp() {
    const param: NavigationExtras = {
      queryParams: {
        id: 6,
        name: 'Help'
      }
    }
    this.util.navigateToPage('/tabs/account/app-pages', param);
  }

  goToAbout() {
    const param: NavigationExtras = {
      queryParams: {
        id: 1,
        name: 'About Us'
      }
    }
    this.util.navigateToPage('/tabs/account/app-pages', param);
  }

  login() {
    this.util.navigateToPage('login');
  }

}
