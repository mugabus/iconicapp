/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindLocationPageRoutingModule } from './find-location-routing.module';

import { FindLocationPage } from './find-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindLocationPageRoutingModule
  ],
  declarations: [FindLocationPage]
})
export class FindLocationPageModule { }
