import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsRoutingModule } from './tickets-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { DetailComponent } from './detail/detail.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { VisitedComponent } from './visited/visited.component';
import { NgxDateRangeModule } from 'ngx-daterange';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellTicketComponent } from './sell-ticket/sell-ticket.component'
import { RePersonalizeTicket } from './re-personalize-ticket/re-personalize-ticket.component'
import { ReturnTicket } from './return-ticket/return-ticket.component'
import { RepersonalizationFailComponent } from './re-personalize-ticket/fail-page/repersonalization-fail.component'
import { RepersonalizationSuccessComponent } from './re-personalize-ticket/success-page/repersonalization-success.component'


@NgModule({
  declarations: [LayoutComponent, DetailComponent, UpcomingComponent, VisitedComponent, SellTicketComponent, RePersonalizeTicket, ReturnTicket, RepersonalizationFailComponent, RepersonalizationSuccessComponent],
  imports: [
  CommonModule,
    TicketsRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    NgxDateRangeModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class TicketsModule { }
