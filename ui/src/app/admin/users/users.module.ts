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


@NgModule({
  declarations: [ListComponent,  DetailLayoutComponent, UserDetailComponent, AccountDetailComponent, PaymentDetailComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    NgxDateRangeModule
  ]
})
export class UsersModule { }
