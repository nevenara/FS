import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { SharedModule } from '../shared/shared.module';
import {ProfileRoutingModule} from './profile-routing.module';

import { ProfileComponent } from './profile/profile.component';
import { LinkedEmptyComponent } from './linked/linked-empty/linked-empty.component';
import { ListComponent } from './linked/list/list.component';
import { CreateComponent } from './linked/create-layout/create/create.component';
import { Create1Component } from './linked/create-layout/create1/create1.component';
import { DetailComponent } from './linked/detail/detail.component';
import { NgxDateRangeModule } from 'ngx-daterange';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { from } from 'rxjs';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { CreateLayoutComponent } from './linked/create-layout/create-layout.component';
import { NgbDateCustomParserFormatter } from '../shared/DatepickerAdapter/datepickerFormatter'
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ProfileLayoutComponent, CreateLayoutComponent, ProfileComponent, LinkedEmptyComponent, ListComponent, CreateComponent, Create1Component, DetailComponent, VerifyEmailComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    NgxIntlTelInputModule,
    NgxDateRangeModule
  ],
 
})
export class ProfileModule { }
