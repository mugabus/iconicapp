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
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-find-location',
  templateUrl: './find-location.page.html',
  styleUrls: ['./find-location.page.scss'],
})
export class FindLocationPage implements OnInit {
  cityId: any = '';
  zipCode: any = '';
  isLoading: boolean = false;
  // 0 = City Based
  // 1 = Geo Location
  // 2 = Pincode / Zipcode
  constructor(
    public util: UtilService,
    public api: ApiService,
    private alertController: AlertController
  ) {
    console.log(this.util.findType, this.util.servingCities);
  }

  ngOnInit() {
  }

  getLocationInfo() {
    const isLocationPlugin = Capacitor.isPluginAvailable('Geolocation');
    if (isLocationPlugin) {
      this.getPermission();
    }
  }

  async getPermission() {
    const permission = await Geolocation.checkPermissions();
    console.log(permission.location);
    if (permission && permission.location == 'granted') {
      this.getLocation();
    } else {
      const platform = Capacitor.getPlatform();
      console.log(platform);
      if (platform == 'web') {
        this.getWebLocationPermission();
      } else {
        this.askPermission();
      }
    }
  }

  report(message: any) {
    console.log(message);
  }

  getWebLocationPermission() {
    navigator.permissions.query({
      name: 'geolocation'
    }).then((result) => {
      if (result.state == 'granted') {
        this.report(result.state);
      } else if (result.state == 'prompt') {
        this.report(result.state);
        navigator.geolocation.getCurrentPosition(position => {
          console.log(position);
          this.getAddress(position.coords.latitude, position.coords.longitude);
        });
      } else if (result.state == 'denied') {
        this.report(result.state);
      }
      result.onchange = () => {
        this.report(result.state);
      }
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.util.translate('Permission Denied'),
      subHeader: this.util.translate('Location Error'),
      message: this.util.translate('Please enable location from App settings'),
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: this.util.translate('Okay'),
          handler: () => {
            console.log('Confirm Okay');
            this.getLocationInfo();
          }
        }
      ]
    });
    await alert.present();
  }

  getAddress(lat: any, lng: any) {
    if (typeof google == 'object' && typeof google.maps == 'object') {
      const geocoder = new google.maps.Geocoder();
      const location = new google.maps.LatLng(lat, lng);
      this.isLoading = true;
      geocoder.geocode({ 'location': location }, (results: any, status: any) => {
        console.log(results);
        this.isLoading = false;
        console.log('status', status);
        if (results && results.length) {
          localStorage.setItem('location', 'true');
          localStorage.setItem('lat', lat);
          localStorage.setItem('address', results[0].formatted_address);
          this.util.deliveryAddress = results[0].formatted_address;
          localStorage.setItem('lng', lng);
          this.util.onTypeChanged();
          this.util.navigateRoot('tabs');
        } else {
          this.util.errorToast('Something went wrong please try again later');
        }
      });
    } else {
      this.util.errorToast(this.util.translate('Error while fetching google maps... please check your google maps key'));
      return false;
    }
  }

  async askPermission() {
    const permission = await Geolocation.requestPermissions();
    console.log(permission);
    if (permission && permission.location == 'granted') {
      this.getLocation();
    } else if (permission && permission.location == 'denied') {
      this.presentAlert();
    }
  }


  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log(coordinates);
    if (coordinates && coordinates.coords && coordinates.coords) {
      this.getAddress(coordinates.coords.latitude, coordinates.coords.longitude);
    }
  }

  selectCity() {
    console.log(this.cityId);
    if (this.cityId && this.cityId != null && this.cityId != '') {
      localStorage.setItem('location', 'true');
      localStorage.setItem('cityId', this.cityId);
      const item = this.util.servingCities.filter(x => x.id == this.cityId);
      if (item && item.length) {
        this.util.cityName = item[0].name;
        this.util.onTypeChanged();
        this.util.navigateRoot('tabs');
      }
    }
  }

  onZipSave() {
    if (this.zipCode && this.zipCode != null && this.zipCode != '') {
      localStorage.setItem('location', 'true');
      localStorage.setItem('zipcode', this.zipCode);
      this.util.zipcode = this.zipCode;
      this.util.onTypeChanged();
      this.util.navigateRoot('tabs');
    }
  }
}
