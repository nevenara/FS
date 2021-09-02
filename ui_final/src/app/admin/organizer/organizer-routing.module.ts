import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserType } from 'src/app/services/models/user-context';
import { RoleGuard } from 'src/app/shared/role-guard';
import { ListComponent } from './list/list.component';


const routes: Routes = [


  { path: '', component: ListComponent },
  { path: 'create', loadChildren: () => import('./create/create.module').then(m => m.CreateModule), canActivate: [RoleGuard], data: {roles: [UserType.SuperAdmin, UserType.Admin, UserType.EventManager]} },
  { path: 'detail/:organizerId', loadChildren: () => import('./detail/detail.module').then(m => m.DetailModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizerRoutingModule { }
