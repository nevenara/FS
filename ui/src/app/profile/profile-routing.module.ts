import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';

import { LinkedEmptyComponent } from './linked/linked-empty/linked-empty.component';
import { ListComponent } from './linked/list/list.component';
import { CreateComponent } from './linked/create/create.component';
import { Create1Component } from './linked/create1/create1.component';
import { DetailComponent } from './linked/detail/detail.component';



const routes: Routes = [


    { path: '', component: ProfileLayoutComponent , children: [
      {path: '', component: LinkedEmptyComponent},
      {path: 'list', component: ListComponent},
     {path: 'create', component: CreateComponent},
     {path: 'create1/:id', component: Create1Component},
     {path: 'detail/:id', component: DetailComponent},
    ] },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
