import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailLayoutComponent } from './detail/detail-layout/detail-layout.component';
import { AddComponent } from './add/add.component';
import { VerificationComponent } from './verification/verification.component';
import { LinkedDtailComponent } from './linked-dtail/linked-dtail.component';
import { RoleGuard } from '../../shared/role-guard';
import { UserType } from 'src/app/services/models/user-context';



const routes: Routes = [


  { path: '', component: ListComponent },
  { path: 'detail/:userId', component: DetailLayoutComponent },

  { path: 'add', component: AddComponent, canActivate: [RoleGuard], data: {roles: [UserType.SuperAdmin, UserType.SupportLevel2, UserType.Admin, UserType.EventManager]} },
  { path: 'verification', component: VerificationComponent },
  { path: 'linked', component: LinkedDtailComponent },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
