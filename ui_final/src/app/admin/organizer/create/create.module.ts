import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { CreateRoutingModule } from './create-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './account/account.component';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';



@NgModule({
  declarations: [LayoutComponent, MainComponent, AccountComponent],
  imports: [
    CommonModule,
    SharedModule,
    CreateRoutingModule,
    NgxIntlTelInputModule
  ]
})
export class CreateModule { }
