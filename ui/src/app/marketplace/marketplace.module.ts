import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import {SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { MarketTicketsComponent } from './market-tickets/market-tickets.component';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDateRangeModule } from 'ngx-daterange';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';
import { BuyTicketDetailsComponent } from './buy-ticket/buy-ticket-details/buy-ticket-details.component';
import { ConfirmBoughtTicketsComponent } from './buy-ticket/confirm-bought-tickets/confirm-bought-tickets.component';
import { AssignBoughtTicketsComponent } from './buy-ticket/assign-bought-tickets/assign-bought-tickets.component';
import { CountdownModule } from 'ngx-countdown';


@NgModule({
  declarations: [LayoutComponent, MarketTicketsComponent, MyTicketsComponent, BuyTicketComponent, BuyTicketDetailsComponent, ConfirmBoughtTicketsComponent, AssignBoughtTicketsComponent],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    NgxDateRangeModule,
    ReactiveFormsModule,
    FormsModule,
    CountdownModule 
  ]
})
export class MarketplaceModule { }
