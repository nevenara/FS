import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { PersonalizationRoutingModule } from './personalization-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AssignComponent } from './assign/assign.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { IdVerificationComponent } from './../id-verification/id-verification.component'
import { ChooseIdDocumentComponent } from './../id-verification/choose-id-document/choose-id-document.component'
import { InitialIdVerificationComponent } from './../id-verification/initial-id-verification/initial-id-verification.component'
import { UploadIdDocumentComponent } from './../id-verification/upload-id-document/upload-id-document.component'
import { idVerificationFail } from './../id-verification/id-verification-fail/id-verification-fail.component'
import { idVerificationSuccess } from './../id-verification/id-verification-success/id-verification-success.component'


@NgModule({
  declarations: [ListComponent, DetailComponent, AssignComponent, IdVerificationComponent, ChooseIdDocumentComponent, InitialIdVerificationComponent, UploadIdDocumentComponent, idVerificationFail, idVerificationSuccess],
  imports: [
CommonModule,
  SharedModule,
  PersonalizationRoutingModule,
  AngularEditorModule

  ]
})
export class PersonalizationModule { }
