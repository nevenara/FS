import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoicingComponent } from './invoicing/invoicing.component';
import { GetmatiComponent } from './getmati/getmati.component';
import { QCRMComponent } from './qcrm/qcrm.component';
import { ALayoutComponent } from './layout/layout.component';




const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
  path: '', component: ALayoutComponent, children: [

  { path: 'dashboard', component: DashboardComponent },
  { path: 'invoice', component: InvoicingComponent },
  { path: 'getmati', component: GetmatiComponent },
  //{ path: 'qcrm', component: QCRMComponent },
  { path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule) },
  { path: 'organizer', loadChildren: () => import('./organizer/organizer.module').then(m => m.OrganizerModule) },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) }, 
  { path: '', redirectTo: '/admin/auth', pathMatch: 'full' },
]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
