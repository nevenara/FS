import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OLayoutComponent } from './layout/layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TicketsListComponent } from './tickets-list/tickets-list.component'
import { DetailComponent } from './detail/detail.component';





const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
  path: '', component: OLayoutComponent, children: [

  { path: 'dashboard', component: DashboardComponent },
  { path: 'ticketlist', component: TicketsListComponent },
  { path: 'detail/:eventId', component: DetailComponent },
  { path: '', redirectTo: '/organizer/auth', pathMatch: 'full' },
]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizerRoutingModule { }
