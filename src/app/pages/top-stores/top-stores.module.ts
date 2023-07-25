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

import { TopStoresPageRoutingModule } from './top-stores-routing.module';

import { TopStoresPage } from './top-stores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopStoresPageRoutingModule
  ],
  declarations: [TopStoresPage]
})
export class TopStoresPageModule { }
