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

@NgModule({
  declarations: [LayoutComponent, DetailComponent, UpcomingComponent, VisitedComponent],
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
