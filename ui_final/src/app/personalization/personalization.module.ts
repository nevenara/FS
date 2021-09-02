import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { PersonalizationRoutingModule } from './personalization-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AssignComponent } from './assign/assign.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    ListComponent, 
    DetailComponent, 
    AssignComponent, 
  ],
  imports: [
    CommonModule,
    SharedModule,
    PersonalizationRoutingModule,
    AngularEditorModule,
  ]
})
export class PersonalizationModule { }
