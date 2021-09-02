import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';

import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ListComponent } from './linked/list/list.component';
import { CreateLayoutComponent } from './linked/create-layout/create-layout.component';
import { DetailComponent } from './linked/detail/detail.component';



const routes: Routes = [


    { path: '', component: ProfileLayoutComponent , children: [
      {path: '', component: ListComponent},
     {path: 'create', component: CreateLayoutComponent},
     {path: 'detail/:id', component: DetailComponent},
     {path: 'verifyEmail', component: VerifyEmailComponent},
    ] },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
