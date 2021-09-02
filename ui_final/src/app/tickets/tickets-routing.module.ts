import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { DetailComponent } from './detail/detail.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { VisitedComponent } from './visited/visited.component';
import { ReturnTicket } from './return-ticket/return-ticket.component';
import { SellTicketComponent } from './sell-ticket/sell-ticket.component';
import { RePersonalizeTicket } from './re-personalize-ticket/re-personalize-ticket.component';

const routes: Routes = [
    { path: '', component: LayoutComponent},
    { path: 'upcoming', component: UpcomingComponent},
    { path: 'visited', component: VisitedComponent},
    { path: 'detail/:id', component: DetailComponent},
    { path: 'returnticket/:ticketId', component: ReturnTicket},
    { path: 'sellticket/:ticketId', component: SellTicketComponent},
    { path: 'repersonalizeticket/:ticketId', component: RePersonalizeTicket}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class TicketsRoutingModule { }
