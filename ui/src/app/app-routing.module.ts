import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { EventComponent } from './event/event.component';
import { PaymentsettingsComponent } from './paymentsettings/paymentsettings.component';
import { CardPaymentComponent } from './card-payment/card-payment.component';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule) },
      { path: 'event', component: EventComponent },
      { path: 'paymentsettings', component: PaymentsettingsComponent },
      { path: 'cardpayment', component: CardPaymentComponent },
      { path: 'marketplace', loadChildren: () => import('./marketplace/marketplace.module').then(m => m.MarketplaceModule) },
      { path: 'personalization',
      loadChildren: () => import('./personalization/personalization.module').then(m => m.PersonalizationModule) },
      { path: 'gift', loadChildren: () => import('./gift/gift.module').then(m => m.GiftModule) },
      { path: 'support', loadChildren: () => import('./support/support.module').then(m => m.SupportModule) },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
      { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
      { path: '', redirectTo: '/auth', pathMatch: 'full' },

    ]
  },
  { path: '**', redirectTo: '/auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
