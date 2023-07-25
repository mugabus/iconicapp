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

import { AwaitPaymentsPageRoutingModule } from './await-payments-routing.module';

import { AwaitPaymentsPage } from './await-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AwaitPaymentsPageRoutingModule
  ],
  declarations: [AwaitPaymentsPage]
})
export class AwaitPaymentsPageModule { }
