import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';



@NgModule({
  declarations: [ListComponent, DetailComponent],
  imports: [
CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
