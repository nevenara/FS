import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { SignuplayoutComponent } from './signup/signuplayout/signuplayout.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { UserDataComponent } from './signup/complete-registration/user-data/user-data.component';
import { PersonalDataComponent } from './signup/complete-registration/personal-data/personal-data.component';
import { AdditionalEmailsComponent } from './signup/complete-registration/additional-emails/additional-emails.component';
import { CompleteRegistrationComponent } from './signup/complete-registration/complete-registration.component';
import { NgxDateRangeModule } from 'ngx-daterange';
import { LocalisationComponent } from '../localisation/localisation.component';


@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotpasswordComponent, ResetpasswordComponent, SignuplayoutComponent, UserDataComponent, PersonalDataComponent, AdditionalEmailsComponent, CompleteRegistrationComponent],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    NgxIntlTelInputModule,
    NgxDateRangeModule
  ]
})
export class AuthModule { }
