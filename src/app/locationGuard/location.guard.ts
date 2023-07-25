/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UtilService } from '../services/util.service';

@Injectable({
  providedIn: 'root'
})
export class LocationGuard implements CanActivate {

  constructor(public util: UtilService) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    const location = localStorage.getItem('location');
    console.log('location', localStorage.getItem('location'));
    if (location && location != null && location != 'null') {
      return true;
    }
    this.util.navigateRoot('/find-location');
    return false;
  }
}
