import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './list/list.component';

import { NgxDateRangeModule } from 'ngx-daterange';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DetailLayoutComponent } from './detail/detail-layout/detail-layout.component';
import { UserDetailComponent } from './detail/user-detail/user-detail.component';
import { AccountDetailComponent } from './detail/account-detail/account-detail.component';
import { PaymentDetailComponent } from './detail/payment-detail/payment-detail.component';
import { AddComponent } from './add/add.component';
import { VerificationComponent } from './verification/verification.component';
import { LinkedDtailComponent } from './linked-dtail/linked-dtail.component';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';



@NgModule({
  declarations: [ListComponent, DetailLayoutComponent, UserDetailComponent, AccountDetailComponent, PaymentDetailComponent,
     AddComponent, VerificationComponent, LinkedDtailComponent,],

  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    NgxDateRangeModule,
    NgxIntlTelInputModule
    
  ]
})
export class UsersModule { }
