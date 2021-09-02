import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../../shared/shared.module';
import { DetailRoutingModule } from './detail-routing.module';

import { LayoutComponent } from './layout/layout.component';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [LayoutComponent, MainComponent, AccountComponent],
  imports: [
  CommonModule,
    SharedModule,
    DetailRoutingModule
  ]
})
export class DetailModule { }
