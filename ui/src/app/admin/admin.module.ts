import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoicingComponent } from './invoicing/invoicing.component';
import { GetmatiComponent } from './getmati/getmati.component';
import { QCRMComponent } from './qcrm/qcrm.component';



@NgModule({
  declarations: [DashboardComponent, InvoicingComponent, GetmatiComponent, QCRMComponent],
  imports: [
  CommonModule,
    AdminRoutingModule,
    SharedModule,

  ]
})
export class AdminModule { }
