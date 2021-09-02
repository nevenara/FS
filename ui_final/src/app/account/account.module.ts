import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAccountComponent } from './main-account/main-account.component';
import { LinkedAccountComponent } from './linked-account/linked-account.component';
import { SharedModule } from '../shared/shared.module';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { AccountRoutingModule } from './account-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentsettingsComponent } from './paymentsettings/paymentsettings.component';

@NgModule({
  declarations: [
    MainAccountComponent, 
    LinkedAccountComponent, 
    AccountLayoutComponent, 
    PaymentsettingsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }
