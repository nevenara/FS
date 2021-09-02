import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { EventComponent } from './event/event.component';
import { EnvironmentGuard } from './shared/environment-guard';
import { ApplicationType, RedirectionUrls } from './shared/application-type';
import { Environment } from './environments/environment';
import { RoleGuard } from './shared/role-guard';
import { UserType } from './services/models/user-context';


const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [EnvironmentGuard], data: {appType: ApplicationType.ADMIN_PANEL} },
  { path: 'organizer', loadChildren: () => import('./Organizer/organizer.module').then(m => m.OrganizerModule), canActivate: [EnvironmentGuard], data: {appType: ApplicationType.ORGANIZER} },
  {
    path: 'auth', canActivate: [EnvironmentGuard], data: {appType: ApplicationType.WEB},
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '', component: LayoutComponent, canActivate: [EnvironmentGuard], data: {appType: ApplicationType.WEB}, children: [
      { path: 'home', component: HomeComponent },
      { path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule) },
      { path: 'event', component: EventComponent },
      { path: 'marketplace', loadChildren: () => import('./marketplace/marketplace.module').then(m => m.MarketplaceModule),  canActivate: [RoleGuard], data: {roles: [UserType.MainAccount]} },
      { path: 'personalization', loadChildren: () => import('./personalization/personalization.module').then(m => m.PersonalizationModule), canActivate: [RoleGuard], data: {roles: [UserType.MainAccount]} },
      { path: 'gift', loadChildren: () => import('./gift/gift.module').then(m => m.GiftModule) },
      { path: 'support', loadChildren: () => import('./support/support.module').then(m => m.SupportModule) },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
      { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
      { path: '', redirectTo: RedirectionUrls[Environment.applicationType()].home, pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: RedirectionUrls[Environment.applicationType()].home, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
