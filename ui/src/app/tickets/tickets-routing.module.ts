import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { DetailComponent } from './detail/detail.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { VisitedComponent } from './visited/visited.component';

const routes: Routes = [
    { path: '', component: LayoutComponent},
    { path: 'upcoming', component: UpcomingComponent},
    { path: 'visited', component: VisitedComponent},
    { path: 'detail/:id', component: DetailComponent}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class TicketsRoutingModule { }
