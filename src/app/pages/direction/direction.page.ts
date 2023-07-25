/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
declare var google: any;

@Component({
  selector: 'app-direction',
  templateUrl: './direction.page.html',
  styleUrls: ['./direction.page.scss'],
})
export class DirectionPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;

  myLat: any;
  myLng: any;

  driverLat: any;
  driverLng: any;

  storeLat: any;
  storeLng: any;

  storeInfo: any;
  driverInfo: any;

  who: any;
  uid: any;
  interval: any;

  orderAt: any;
  homeLat: any;
  homeLng: any;

  orderId: any;
  watchId: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private route: ActivatedRoute,
    public navCtrl: NavController,
    private iab: InAppBrowser,
    private platform: Platform,
    private alertController: AlertController,
    private zone: NgZone
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id && data.lat && data.lng && data.who) {
        this.uid = data.id;
        this.orderId = data.orderId;
        this.who = data.who;
        this.orderAt = data.orderAt;
        this.homeLat = data.homeLat;
        this.homeLng = data.homeLng;

        if (this.who == 'driver') {
          this.driverLat = data.lat;
          this.driverLng = data.lng;
          this.homeLat = parseFloat(this.homeLat);
          this.homeLng = parseFloat(this.homeLng);
          this.driverLat = parseFloat(this.driverLat);
          this.driverLng = parseFloat(this.driverLng);
          const param = {
            id: this.uid
          };
          this.api.post_private('v1/driverInfo/byId', param).then((infoss: any) => {
            console.log('******************* driver --->>>> driverinfo --->', infoss);
            if (infoss && infoss.status && infoss.status == 200 && infoss.data && infoss.data) {
              this.driverInfo = infoss.data;
              this.driverLat = parseFloat(infoss.data.lat);
              this.driverLng = parseFloat(infoss.data.lng);
              this.loadMap(this.driverLat, this.driverLng, this.homeLat, this.homeLng);
            }
          }, error => {
            console.log('==>>', error);
          });

        } else {
          this.storeLat = parseFloat(data.lat);
          this.storeLng = parseFloat(data.lng);
          const param = {
            id: this.uid
          };
          this.api.post_private('v1/storesInfo/getByIds', param).then((data: any) => {
            console.log('*******************', data);
            if (data && data.status && data.status == 200 && data.data) {
              this.storeLat = parseFloat(data.data.lat);
              this.storeLng = parseFloat(data.data.lng);
              this.storeInfo = data.data;
              this.getLocationInfo();
            }
          }, error => {
            console.log(error);
          });

        }
      } else {
        this.navCtrl.back();
      }
    });
  }

  callDriver() {
    this.iab.create('tel:' + this.driverInfo.mobile, '_system');
  }
  callStore() {
    this.iab.create('tel:' + this.storeInfo.mobile, '_system');
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

  report(message: any) {
    console.log(message);
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log(coordinates);
    if (coordinates && coordinates.coords && coordinates.coords) {
      this.watchPosition();
      this.updateLocations(coordinates.coords.latitude, coordinates.coords.longitude);
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
          this.watchPosition();
          this.updateLocations(position.coords.latitude, position.coords.longitude);
        });
      } else if (result.state == 'denied') {
        this.report(result.state);
      }
      result.onchange = () => {
        this.report(result.state);
      }
    });
  }



  updateLocations(lat: any, lng: any) {
    this.myLat = lat;
    this.myLng = lng;
    this.loadMap(this.myLat, this.myLng, this.storeLat, this.storeLng);
  }

  watchPosition() {
    try {
      this.watchId = Geolocation.watchPosition({}, (position, err) => {
        console.log('Watch', position);
        this.zone.run(() => {
          if (position && position.coords) {
            this.updateLocations(position.coords.latitude, position.coords.longitude);
          }

        });
      });
    } catch (e) {
      console.error(e);
    }
  }



  async iOSAlert() {
    const alert = await this.alertController.create({
      header: this.util.translate('Error'),
      subHeader: this.util.translate('Location error'),
      message: this.util.translate('Please Enable Location Service from settings for best experience'),
      buttons: ['OK']
    });
    await alert.present();
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.util.translate('Alert'),
      message: this.util.translate('Please Enable Location Service for best experience'),
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.translate('Okay'),
          handler: () => {
            console.log('Confirm Okay');
            this.askPermission();
          }
        }
      ]
    });

    await alert.present();
  }


  getDriverLocation(marker: any, maps: any) {
    const param = {
      id: this.uid
    };
    this.api.post_private('v1/driverInfo/byId', param).then((data: any) => {
      console.log('******************* driver --->>>> driverinfo --->', data);
      if (data && data.status && data.status == 200 && data.data && data.data) {
        this.driverLat = parseFloat(data.data.lat);
        this.driverLng = parseFloat(data.data.lng);
        this.changeMarkerPosition(marker, maps);
      }
    }, error => {
      console.log('==>>', error);
    });
  }

  loadMap(latOri: any, lngOri: any, latDest: any, lngDest: any) {

    const directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay = new google.maps.DirectionsRenderer();
    const bounds = new google.maps.LatLngBounds;

    const origin1 = { lat: parseFloat(latOri), lng: parseFloat(lngOri) };
    const destinationA = { lat: latDest, lng: lngDest };

    const maps = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: latOri, lng: lngOri },
      disableDefaultUI: true,
      zoom: 100
    });

    const custPos = new google.maps.LatLng(latOri, lngOri);
    const restPos = new google.maps.LatLng(latDest, lngDest);

    const logo = {
      url: 'assets/marker.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    const marker = new google.maps.Marker({
      map: maps,
      position: custPos,
      animation: google.maps.Animation.DROP,
      icon: logo,
    });
    const markerCust = new google.maps.Marker({
      map: maps,
      position: restPos,
      animation: google.maps.Animation.DROP,
    });
    marker.setMap(maps);
    markerCust.setMap(maps);

    directionsDisplay.setMap(maps);
    // directionsDisplay.setOptions({ suppressMarkers: true });
    directionsDisplay.setOptions({
      polylineOptions: {
        strokeWeight: 4,
        strokeOpacity: 1,
        strokeColor: '#44C261'
      },
      suppressMarkers: true
    });
    const geocoder = new google.maps.Geocoder;

    const service = new google.maps.DistanceMatrixService;

    service.getDistanceMatrix({
      origins: [origin1],
      destinations: [destinationA],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function (response: any, status: any) {
      if (status != 'OK') {
        alert('Error was: ' + status);
      } else {
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;
        const showGeocodedAddressOnMap = function (asDestination: any) {
          return function (results: any, status: any) {
            if (status == 'OK') {
              maps.fitBounds(bounds.extend(results[0].geometry.location));
            } else {
              alert('Geocode was not successful due to: ' + status);
            }
          };
        };

        directionsService.route({
          origin: origin1,
          destination: destinationA,
          travelMode: 'DRIVING'
        }, function (response: any, status: any) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });


        for (let i = 0; i < originList.length; i++) {
          const results = response.rows[i].elements;
          geocoder.geocode({ 'address': originList[i] },
            showGeocodedAddressOnMap(false));
          for (let j = 0; j < results.length; j++) {
            geocoder.geocode({ 'address': destinationList[j] },
              showGeocodedAddressOnMap(true));
          }
        }
      }
    });
    this.interval = setInterval(() => {
      if (this.who == 'driver') {
        this.getDriverLocation(marker, maps);
      } else {
        console.log('update->');
        this.changeMyMarker(marker, maps);
      }
    }, 12000);
  }

  ionViewDidLeave() {
    console.log('leaved');
    clearInterval(this.interval);
  }

  changeMarkerPosition(marker: any, map: any) {
    const latlng = new google.maps.LatLng(this.driverLat, this.driverLng);
    map.setCenter(latlng);
    marker.setPosition(latlng);
  }

  changeMyMarker(marker: any, map: any) {
    const latlng = new google.maps.LatLng(this.myLat, this.myLng);
    map.setCenter(latlng);
    marker.setPosition(latlng);
  }

  ngOnInit() {
  }
}
