import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsRoutingModule } from './tickets-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDateRangeModule } from 'ngx-daterange';


@NgModule({
  declarations: [ListComponent, DetailComponent],
  imports: [
  CommonModule,
    TicketsRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    NgxDateRangeModule
  ]
})
export class TicketsModule { }
