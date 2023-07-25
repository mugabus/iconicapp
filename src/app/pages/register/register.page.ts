/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { register } from 'src/app/interfaces/register';
import { UtilService } from 'src/app/services/util.service';
import { AlertController, ModalController } from '@ionic/angular';
import { SelectCountryPage } from '../select-country/select-country.page';
import { NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { RedeemSuccessPage } from '../redeem-success/redeem-success.page';
import { VerifyPage } from '../verify/verify.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  register: register = {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    mobile: '',
    fcm_token: 'NA',
    type: '1',
    lat: '0',
    lng: '0',
    cover: 'NA',
    status: 1,
    others: 'NA',
    date: '',
    stripe_key: '',
    country_code: '',
    check: false,
    referral_code: ''
  };

  submitted = false;
  isLogin: boolean = false;
  viewPassword: boolean = false;
  constructor(
    public util: UtilService,
    private modalCtrl: ModalController,
    public api: ApiService,
    private alertController: AlertController,
    private iab: InAppBrowser,
  ) {
    console.log(this.util.user_verification, this.util.register_style);
    setTimeout(() => {
      this.register.country_code = '+' + this.util.default_country_code;
    }, 1000);
  }

  ngOnInit() {
  }

  onLogin() {
    this.util.onBack();
  }

  onRegister(form: NgForm) {
    console.log(this.util.user_verification);
    this.submitted = true;
    if (form.valid) {
      if (this.register.check == false) {
        this.util.showToast('Please accept terms and condition of apps', 'danger', 'bottom');
        return false;
      }

      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.register.email)) {
        this.util.showToast(this.util.translate('Please enter valid email'), 'danger', 'bottom');
        return false;
      }

      console.log('ok', this.register.check, this.register);

      if (this.util.user_verification == 1) {
        // send email verification
        if (this.util.smsGateway == '2') {
          // open firebase Notification
          this.isLogin = true;
          this.api.post_public('v1/auth/verifyPhoneForFirebaseRegistrations', { email: this.register.email, country_code: this.register.country_code, mobile: this.register.mobile }).then((data: any) => {
            console.log(data);
            this.isLogin = false;
            if (data && data.status && data.status == 200 && data.data == true) {
              // send otp from api
              if (this.util.smsGateway == '2') { // Firebase OTP ON PHONE
                this.openFirebaseAuthModal();
              }
            } else if (data && data.status && data.status == 500 && data.data == false) {
              this.util.errorToast(data.message);
            }
          }, error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status == 500 && error.error.message) {
              this.util.errorToast(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status == 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorToast(error.error.error[key][0]);
              }
            } else {
              this.util.errorToast(this.util.translate('Something went wrong'));
            }
          }).catch(error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status == 500 && error.error.message) {
              this.util.errorToast(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status == 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorToast(error.error.error[key][0]);
              }
            } else {
              this.util.errorToast(this.util.translate('Something went wrong'));
            }
          });
        } else {
          this.isLogin = true;
          this.api.post_public('v1/verifyPhoneSignup', { email: this.register.email, country_code: this.register.country_code, mobile: this.register.mobile }).then((data: any) => {
            console.log(data);
            this.isLogin = false;
            if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
              // send otp from api
              this.openVerificationModal(data.otp_id, this.register.country_code + this.register.mobile);
            } else if (data && data.status && data.status == 500 && data.data == false) {
              this.util.errorToast(data.message);
            }
          }, error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status == 500 && error.error.message) {
              this.util.errorToast(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status == 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorToast(error.error.error[key][0]);
              }
            } else {
              this.util.errorToast(this.util.translate('Something went wrong'));
            }
          }).catch(error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status == 500 && error.error.message) {
              this.util.errorToast(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status == 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorToast(error.error.error[key][0]);
              }
            } else {
              this.util.errorToast(this.util.translate('Something went wrong'));
            }
          });
        }

      } else if (this.util.user_verification == 0) {
        // send phone verification
        this.isLogin = true;
        const param = {
          email: this.register.email,
          subject: this.util.translate('Verification'),
          header_text: this.util.translate('Use this code for verification'),
          thank_you_text: this.util.translate("Don't share this otp to anybody else"),
          mediaURL: this.api.mediaURL,
          country_code: this.register.country_code,
          mobile: this.register.mobile
        }
        this.api.post_public('v1/sendVerificationOnMail', param).then((data: any) => {
          console.log(data);
          this.isLogin = false;
          if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
            // send otp from api
            this.openVerificationModal(data.otp_id, this.register.email);
          } else if (data && data.status && data.status == 500 && data.data == false) {
            this.util.errorToast(data.message);
          }
        }, error => {
          console.log(error);
          this.isLogin = false;
          if (error && error.error && error.error.status == 500 && error.error.message) {
            this.util.errorToast(error.error.message);
          } else if (error && error.error && error.error.error && error.error.status == 422) {
            for (let key in error.error.error) {
              console.log(error.error.error[key][0]);
              this.util.errorToast(error.error.error[key][0]);
            }
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }).catch(error => {
          console.log(error);
          this.isLogin = false;
          if (error && error.error && error.error.status == 500 && error.error.message) {
            this.util.errorToast(error.error.message);
          } else if (error && error.error && error.error.error && error.error.status == 422) {
            for (let key in error.error.error) {
              console.log(error.error.error[key][0]);
              this.util.errorToast(error.error.error[key][0]);
            }
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        });
      } else {
        this.util.errorToast(this.util.translate('Something went wrong while registrations, please contact administrator'));
      }

    }
  }

  async openVerificationModal(id: any, to: any) {
    const modal = await this.modalCtrl.create({
      component: VerifyPage,
      backdropDismiss: false,
      cssClass: 'custom-modal',
      componentProps: {
        'id': id,
        'to': to
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.data, data.role);
      if (data && data.data && data.role && data.role == 'ok') {
        this.createAccount();
      }
    })
    return await modal.present();
  }

  async openFirebaseAuthModal() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      mobile: this.register.country_code + this.register.mobile
    }
    const browser = this.iab.create(this.api.baseUrl + 'v1/auth/firebaseauth?' + this.api.JSON_to_URLEncoded(param), '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success_verified')) {
        const urlItems = new URL(event.url);
        console.log(urlItems);
        this.createAccount();
        browser.close();
      }
    });
    console.log('browser=> end');
  }

  changeType() {
    this.viewPassword = !this.viewPassword;
  }

  createAccount() {
    this.isLogin = true;

    // no account found create it
    this.api.post_public('v1/auth/create_account', this.register).then((data: any) => {
      this.isLogin = false;
      console.log(data);

      if (data && data.status == 200) {

        this.util.userInfo = data.user;
        localStorage.setItem('uid', data.user.id);
        localStorage.setItem('token', data.token);
        if (this.register.referral_code != '' && this.register.referral_code) {
          this.redeemCode();
        }
        this.updateFCMToken();
        this.util.navigateRoot('tabs');
      } else if (data && data.error && data.error.msg) {
        this.util.errorToast(data.error.msg);
      } else if (data && data.error && data.error.message == 'Validation Error.') {
        for (let key in data.error[0]) {
          console.log(data.error[0][key][0]);
          this.util.errorToast(data.error[0][key][0]);
        }
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.isLogin = false;
      if (error && error.error && error.error.status == 500 && error.error.message) {
        this.util.errorToast(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status == 422) {
        for (let key in error.error.error) {
          console.log(error.error.error[key][0]);
          this.util.errorToast(error.error.error[key][0]);
        }
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }).catch(error => {
      console.log(error);
      this.isLogin = false;
      if (error && error.error && error.error.status == 500 && error.error.message) {
        this.util.errorToast(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status == 422) {
        for (let key in error.error.error) {
          console.log(error.error.error[key][0]);
          this.util.errorToast(error.error.error[key][0]);
        }
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    });
  }

  async presentModal(text: any) {
    const modal = await this.modalCtrl.create({
      component: RedeemSuccessPage,
      componentProps: { txt: text }
    });
    await modal.present();
  }


  redeemCode() {
    this.api.post_private('v1/referral/redeemReferral', { id: localStorage.getItem('uid'), code: this.register.referral_code }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        // 1 = inviter
        // 2 = redeemer
        // 3 = both
        let text = '';
        if (data && data.data && data.data.who_received == 1) {
          text = this.util.translate('Congratulations your friend have received the') + ' ' + this.util.currecny + ' ' + data.data.amount + ' ' + this.util.translate('on wallet');
        } else if (data && data.data && data.data.who_received == 2) {
          text = this.util.translate('Congratulations you have received the') + ' ' + this.util.currecny + ' ' + data.data.amount + ' ' + this.util.translate('on wallet');
        } else if (data && data.data && data.data.who_received == 3) {
          text = this.util.translate('Congratulations you & your friend have received the') + ' ' + this.util.currecny + ' ' + data.data.amount + ' ' + this.util.translate('on wallet');
        }
        this.presentModal(text);
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  async openCountry() {
    if (this.util.countrys && this.util.countrys.length && this.util.countrys.length > 1) {
      console.log('open ccode');
      const modal = await this.modalCtrl.create({
        component: SelectCountryPage,
        backdropDismiss: false,
        showBackdrop: true,
      });
      modal.onDidDismiss().then((data) => {
        console.log(data);
        if (data && data.role == 'selected') {
          console.log('ok');
          this.register.country_code = '+' + data.data;
        }
      });
      await modal.present();
    }

  }

  updateFCMToken() {
    const param = {
      id: localStorage.getItem('uid'),
      fcm_token: localStorage.getItem('pushToken') && localStorage.getItem('pushToken') != null ? localStorage.getItem('pushToken') : 'NA'
    }
    this.api.post_private('v1/profile/update', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }

  open(link: any) {
    console.log(link);
    const param: NavigationExtras = {
      queryParams: {
        id: link == 'privacy' ? 2 : 3,
        name: link
      }
    }
    this.util.navigateToPage('app-pages', param);
  }

  getString() {
    return 'By clicking on the I agree button click, download or if you use the Application, you agree to be bound by the';
  }
}
