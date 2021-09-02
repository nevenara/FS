import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoicingComponent } from './invoicing/invoicing.component';
import { GetmatiComponent } from './getmati/getmati.component';
import { QCRMComponent } from './qcrm/qcrm.component';
import { ALayoutComponent } from './layout/layout.component';
import { AHeaderComponent } from './layout/header/header.component';
import { ABreadCrumbComponent } from './layout/bread-crumb/bread-crumb.component';
import { ASidebarComponent } from './layout/sidebar/sidebar.component';
import { AFooterComponent } from './layout/footer/footer.component';
import { CustomCalendar } from '../admin/calendar/calendar.component'

@NgModule({
  declarations: [
    ALayoutComponent,
    AHeaderComponent,
    ABreadCrumbComponent,
    ASidebarComponent,
    AFooterComponent,
    DashboardComponent, InvoicingComponent, GetmatiComponent, QCRMComponent, CustomCalendar],
  imports: [
CommonModule,
    AdminRoutingModule,
    SharedModule,

  ]
})
export class AdminModule { }
