import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { OLayoutComponent } from './layout/layout.component';
import { OHeaderComponent } from './layout/header/header.component';
import { OBreadCrumbComponent } from './layout/bread-crumb/bread-crumb.component';
import { OSidebarComponent } from './layout/sidebar/sidebar.component';
import { OFooterComponent } from './layout/footer/footer.component';
import { OrganizerRoutingModule } from './organizer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketsListComponent } from './tickets-list/tickets-list.component'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDateRangeModule } from 'ngx-daterange';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [
    OLayoutComponent,
    OHeaderComponent,
    OBreadCrumbComponent,
    OSidebarComponent,
    OFooterComponent,
    DashboardComponent,
    TicketsListComponent,
    DetailComponent

  ],
  imports: [
    CommonModule,
    OrganizerRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    NgxDateRangeModule,
    

  ]
})
export class OrganizerModule { }
