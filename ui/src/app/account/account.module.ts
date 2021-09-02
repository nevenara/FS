import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAccountComponent } from './main-account/main-account.component';
import { LinkedAccountComponent } from './linked-account/linked-account.component';
import { SharedModule } from '../shared/shared.module';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { AccountRoutingModule } from './account-routing.module';
@NgModule({
  declarations: [MainAccountComponent, LinkedAccountComponent, AccountLayoutComponent,],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule { }
