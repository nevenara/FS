import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailLayoutComponent } from './detail/detail-layout/detail-layout.component';


const routes: Routes = [


  { path: '', component: ListComponent },
  { path: 'detail', component: DetailLayoutComponent },
  { path: 'create', loadChildren: () => import('./create/create.module').then(m => m.CreateModule) },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
