/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { TimeComponent } from './time/time.component';
import { PopoverComponent } from './popover/popover.component';
import { FiltersComponent } from './filters/filters.component';
import { ClosedComponent } from './closed/closed.component';

const components = [
  TimeComponent,
  PopoverComponent,
  FiltersComponent,
  ClosedComponent
];
@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports: [
    ...components,
  ]
})
export class ComponentsModule { }
