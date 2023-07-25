/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { cartGuard } from 'src/app/cartGuard/auth.guard';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'sub-category',
            loadChildren: () =>
              import('../sub-category/sub-category.module').then(m => m.SubCategoryPageModule)
          },
          {
            path: 'store',
            loadChildren: () =>
              import('../store/store.module').then(m => m.StorePageModule)
          },
          {
            path: 'top-picked',
            loadChildren: () =>
              import('../top-picked/top-picked.module').then(m => m.TopPickedPageModule)
          },

          {
            path: 'products',
            loadChildren: () =>
              import('../products/products.module').then(m => m.ProductsPageModule)
          },
          {
            path: 'product',
            loadChildren: () =>
              import('../product/product.module').then(m => m.ProductPageModule)
          }
        ]
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../categories/categories.module').then(m => m.CategoriesPageModule)
          },
          {
            path: 'products',
            loadChildren: () =>
              import('../products/products.module').then(m => m.ProductsPageModule)
          },
          {
            path: 'product',
            loadChildren: () =>
              import('../product/product.module').then(m => m.ProductPageModule)
          }
        ]
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../cart/cart.module').then(m => m.CartPageModule),
          },
          {
            path: 'checkout',
            loadChildren: () =>
              import('../checkout/checkout.module').then(m => m.CheckoutPageModule),
            canActivate: [cartGuard]
          },
        ],

      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../orders/orders.module').then(m => m.OrdersPageModule)
          }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../account/account.module').then(m => m.AccountPageModule),
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule),
          },
          {
            path: 'contacts',
            loadChildren: () =>
              import('../contacts/contacts.module').then(m => m.ContactsPageModule)
          },
          {
            path: 'languages',
            loadChildren: () =>
              import('../languages/languages.module').then(m => m.LanguagesPageModule)
          },
          {
            path: 'referral',
            loadChildren: () =>
              import('../referral/referral.module').then(m => m.ReferralPageModule)
          },
          {
            path: 'wallet',
            loadChildren: () =>
              import('../wallet/wallet.module').then(m => m.WalletPageModule)
          },
          {
            path: 'app-pages',
            loadChildren: () =>
              import('../app-pages/app-pages.module').then(m => m.AppPagesPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
