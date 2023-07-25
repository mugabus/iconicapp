/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ComponentsModule } from './components/components.module';
import { SearchPageModule } from './pages/search/search.module';
import { SortPageModule } from './pages/sort/sort.module';
import { VerifyPageModule } from './pages/verify/verify.module';
import { SuccessPageModule } from './pages/success/success.module';
import { StripePayPageModule } from './pages/stripe-pay/stripe-pay.module';
import { PaypalPayPageModule } from './pages/paypal-pay/paypal-pay.module';
import { AddCardPageModule } from './pages/add-card/add-card.module';
import { RedeemSuccessPageModule } from './pages/redeem-success/redeem-success.module';
import { VerifyResetPageModule } from './pages/verify-reset/verify-reset.module';
import { BillingPageModule } from './pages/billing/billing.module';
import { StoreRatingPageModule } from './pages/store-rating/store-rating.module';
import { DriverRatingPageModule } from './pages/driver-rating/driver-rating.module';
import { ProductRatingPageModule } from './pages/product-rating/product-rating.module';
import { RatingListPageModule } from './pages/rating-list/rating-list.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    SearchPageModule,
    SortPageModule,
    ComponentsModule,
    VerifyPageModule,
    SuccessPageModule,
    StripePayPageModule,
    PaypalPayPageModule,
    AddCardPageModule,
    RedeemSuccessPageModule,
    VerifyResetPageModule,
    BillingPageModule,
    StoreRatingPageModule,
    DriverRatingPageModule,
    ProductRatingPageModule,
    RatingListPageModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    InAppBrowser
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
