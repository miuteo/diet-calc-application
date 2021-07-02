import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MealComponent } from '../list/meal.component';
import { MealDetailComponent } from '../detail/meal-detail.component';
import { MealUpdateComponent } from '../update/meal-update.component';
import { MealRoutingResolveService } from './meal-routing-resolve.service';

const mealRoute: Routes = [
  {
    path: '',
    component: MealComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MealDetailComponent,
    resolve: {
      meal: MealRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MealUpdateComponent,
    resolve: {
      meal: MealRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MealUpdateComponent,
    resolve: {
      meal: MealRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mealRoute)],
  exports: [RouterModule],
})
export class MealRoutingModule {}
