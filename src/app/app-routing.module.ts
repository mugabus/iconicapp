/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './introGuard/auth.guard';
import { LocationGuard } from './locationGuard/location.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/find-location/find-location.module').then(m => m.FindLocationPageModule),
    canActivate: [IntroGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [LocationGuard]
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'add-address',
    loadChildren: () => import('./pages/add-address/add-address.module').then(m => m.AddAddressPageModule)
  },
  {
    path: 'add-card',
    loadChildren: () => import('./pages/add-card/add-card.module').then(m => m.AddCardPageModule)
  },
  {
    path: 'add-stripe-card',
    loadChildren: () => import('./pages/add-stripe-card/add-stripe-card.module').then(m => m.AddStripeCardPageModule)
  },
  {
    path: 'addresss',
    loadChildren: () => import('./pages/addresss/addresss.module').then(m => m.AddresssPageModule)
  },
  {
    path: 'all-offers',
    loadChildren: () => import('./pages/all-offers/all-offers.module').then(m => m.AllOffersPageModule)
  },
  {
    path: 'api-error',
    loadChildren: () => import('./pages/api-error/api-error.module').then(m => m.ApiErrorPageModule)
  },
  {
    path: 'app-pages',
    loadChildren: () => import('./pages/app-pages/app-pages.module').then(m => m.AppPagesPageModule)
  },
  {
    path: 'await-payments',
    loadChildren: () => import('./pages/await-payments/await-payments.module').then(m => m.AwaitPaymentsPageModule)
  },
  {
    path: 'billing',
    loadChildren: () => import('./pages/billing/billing.module').then(m => m.BillingPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesPageModule)
  },
  {
    path: 'chats',
    loadChildren: () => import('./pages/chats/chats.module').then(m => m.ChatsPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule)
  },
  {
    path: 'complaints',
    loadChildren: () => import('./pages/complaints/complaints.module').then(m => m.ComplaintsPageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./pages/contacts/contacts.module').then(m => m.ContactsPageModule)
  },
  {
    path: 'delivery-options',
    loadChildren: () => import('./pages/delivery-options/delivery-options.module').then(m => m.DeliveryOptionsPageModule)
  },
  {
    path: 'direction',
    loadChildren: () => import('./pages/direction/direction.module').then(m => m.DirectionPageModule)
  },
  {
    path: 'driver-rating',
    loadChildren: () => import('./pages/driver-rating/driver-rating.module').then(m => m.DriverRatingPageModule)
  },
  {
    path: 'favorite',
    loadChildren: () => import('./pages/favorite/favorite.module').then(m => m.FavoritePageModule)
  },
  {
    path: 'find-location',
    loadChildren: () => import('./pages/find-location/find-location.module').then(m => m.FindLocationPageModule)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then(m => m.ForgotPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('./pages/inbox/inbox.module').then(m => m.InboxPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'languages',
    loadChildren: () => import('./pages/languages/languages.module').then(m => m.LanguagesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./pages/new-password/new-password.module').then(m => m.NewPasswordPageModule)
  },
  {
    path: 'offers',
    loadChildren: () => import('./pages/offers/offers.module').then(m => m.OffersPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./pages/order-details/order-details.module').then(m => m.OrderDetailsPageModule)
  },
  {
    path: 'order-rating',
    loadChildren: () => import('./pages/order-rating/order-rating.module').then(m => m.OrderRatingPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then(m => m.PaymentPageModule)
  },
  {
    path: 'paypal-pay',
    loadChildren: () => import('./pages/paypal-pay/paypal-pay.module').then(m => m.PaypalPayPageModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then(m => m.ProductPageModule)
  },
  {
    path: 'product-rating',
    loadChildren: () => import('./pages/product-rating/product-rating.module').then(m => m.ProductRatingPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'rating-list',
    loadChildren: () => import('./pages/rating-list/rating-list.module').then(m => m.RatingListPageModule)
  },
  {
    path: 'redeem-success',
    loadChildren: () => import('./pages/redeem-success/redeem-success.module').then(m => m.RedeemSuccessPageModule)
  },
  {
    path: 'referral',
    loadChildren: () => import('./pages/referral/referral.module').then(m => m.ReferralPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'select-country',
    loadChildren: () => import('./pages/select-country/select-country.module').then(m => m.SelectCountryPageModule)
  },
  {
    path: 'sort',
    loadChildren: () => import('./pages/sort/sort.module').then(m => m.SortPageModule)
  },
  {
    path: 'store',
    loadChildren: () => import('./pages/store/store.module').then(m => m.StorePageModule)
  },
  {
    path: 'store-rating',
    loadChildren: () => import('./pages/store-rating/store-rating.module').then(m => m.StoreRatingPageModule)
  },
  {
    path: 'stripe-pay',
    loadChildren: () => import('./pages/stripe-pay/stripe-pay.module').then(m => m.StripePayPageModule)
  },
  {
    path: 'sub-category',
    loadChildren: () => import('./pages/sub-category/sub-category.module').then(m => m.SubCategoryPageModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./pages/success/success.module').then(m => m.SuccessPageModule)
  },
  {
    path: 'top-picked',
    loadChildren: () => import('./pages/top-picked/top-picked.module').then(m => m.TopPickedPageModule)
  },
  {
    path: 'top-stores',
    loadChildren: () => import('./pages/top-stores/top-stores.module').then(m => m.TopStoresPageModule)
  },
  {
    path: 'verification',
    loadChildren: () => import('./pages/verification/verification.module').then(m => m.VerificationPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./pages/verify/verify.module').then(m => m.VerifyPageModule)
  },
  {
    path: 'verify-reset',
    loadChildren: () => import('./pages/verify-reset/verify-reset.module').then(m => m.VerifyResetPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./pages/wallet/wallet.module').then(m => m.WalletPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
