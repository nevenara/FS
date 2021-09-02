import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportRoutingModule } from './support-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SupportComponent } from './support/support.component';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  declarations: [SupportComponent],
  imports: [
  CommonModule,
    SupportRoutingModule,
    SharedModule,
    AngularEditorModule
  ]
})
export class SupportModule { }
