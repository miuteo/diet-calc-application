import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserStatusComponent } from '../list/user-status.component';
import { UserStatusDetailComponent } from '../detail/user-status-detail.component';
import { UserStatusUpdateComponent } from '../update/user-status-update.component';
import { UserStatusRoutingResolveService } from './user-status-routing-resolve.service';

const userStatusRoute: Routes = [
  {
    path: '',
    component: UserStatusComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserStatusDetailComponent,
    resolve: {
      userStatus: UserStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserStatusUpdateComponent,
    resolve: {
      userStatus: UserStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserStatusUpdateComponent,
    resolve: {
      userStatus: UserStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userStatusRoute)],
  exports: [RouterModule],
})
export class UserStatusRoutingModule {}
