import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { CompleteRegistrationComponent } from './signup/complete-registration/complete-registration.component';
import { SignuplayoutComponent } from './signup/signuplayout/signuplayout.component';
import { SignupComponent } from './signup/signup.component';



const routes: Routes = [

    {path: '' , component: LoginComponent},
    {path: 'signup' , component: SignupComponent},
    { path: 'signup', component: SignuplayoutComponent , children: [
      {path: 'completeregistration' , component: CompleteRegistrationComponent}
    ]},
    {path: 'forgotpassword' , component: ForgotpasswordComponent},
    {path: 'resetpassword' , component: ResetpasswordComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
