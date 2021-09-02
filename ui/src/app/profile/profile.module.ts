import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { SharedModule } from '../shared/shared.module';
import {ProfileRoutingModule} from './profile-routing.module';

import { ProfileComponent } from './profile/profile.component';
import { LinkedEmptyComponent } from './linked/linked-empty/linked-empty.component';
import { ListComponent } from './linked/list/list.component';
import { CreateComponent } from './linked/create/create.component';
import { Create1Component } from './linked/create1/create1.component';
import { DetailComponent } from './linked/detail/detail.component';


@NgModule({
  declarations: [ProfileLayoutComponent,  ProfileComponent, LinkedEmptyComponent, ListComponent, CreateComponent, Create1Component, DetailComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
