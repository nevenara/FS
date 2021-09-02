import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';


const routes: Routes = [


  { path: '', component: ListComponent },
  { path: 'create', loadChildren: () => import('./create/create.module').then(m => m.CreateModule) },
  { path: 'detail', loadChildren: () => import('./detail/detail.module').then(m => m.DetailModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizerRoutingModule { }
