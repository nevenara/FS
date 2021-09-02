import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AssignComponent } from './assign/assign.component';
const routes: Routes = [


      {path: '' , component: ListComponent},
      {path: 'detail' , component: DetailComponent},
      {path: '' , component: AssignComponent},




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalizationRoutingModule { }
