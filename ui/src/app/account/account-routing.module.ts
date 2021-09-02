import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountLayoutComponent} from './account-layout/account-layout.component';
import { MainAccountComponent } from './main-account/main-account.component';
import { LinkedAccountComponent } from './linked-account/linked-account.component';

const routes: Routes = [


    { path: '', component: AccountLayoutComponent , children: [
      {path: '' , component: MainAccountComponent},
      {path: '' , component: LinkedAccountComponent},

    ] },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
