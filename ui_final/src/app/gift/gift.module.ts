import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftRoutingModule } from './gift-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GiftComponent } from './gift/gift.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxDateRangeModule } from 'ngx-daterange';



@NgModule({
  declarations: [GiftComponent],
  imports: [
    CommonModule,
    GiftRoutingModule,
    SharedModule,
    AngularEditorModule,
    NgxDateRangeModule,
  ]
})
export class GiftModule { }
