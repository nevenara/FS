import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../../shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
 import { CreateRoutingModule } from './create-routing.module';
import { MainComponent } from './main/main.component';
import { VerificationComponent } from './verification/verification.component';

@NgModule({
  declarations: [LayoutComponent, MainComponent, VerificationComponent],
  imports: [

CommonModule,
    SharedModule,
    CreateRoutingModule
  ]
})
export class CreateModule { }
