import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerRoutingModule } from './organizer-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { ListComponent } from './list/list.component';




@NgModule({
  declarations: [ListComponent],
  imports: [
  CommonModule,
    OrganizerRoutingModule,
    SharedModule
  ]
})
export class OrganizerModule { }
