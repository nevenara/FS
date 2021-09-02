import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../../shared/shared.module';
import { DetailRoutingModule } from './detail-routing.module';

import { LayoutComponent } from './layout/layout.component';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './account/account.component';
import { BillingComponent } from './billing/billing.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxDateRangeModule } from 'ngx-daterange';


@NgModule({
  declarations: [LayoutComponent, MainComponent, AccountComponent, BillingComponent],
  imports: [
  CommonModule,
    SharedModule,
    DetailRoutingModule,
    NgxIntlTelInputModule,
    NgxDateRangeModule
  ]
})
export class DetailModule { }
