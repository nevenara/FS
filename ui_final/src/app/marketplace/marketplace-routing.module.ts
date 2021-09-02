import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [


    { path: '', component: LayoutComponent},
    { path: 'buyticket/:ticketId', component: BuyTicketComponent},
    { path: 'editticketonsale/:ticketId', component: EditTicketComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
