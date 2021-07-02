import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FoodNutritionalValueComponent } from '../list/food-nutritional-value.component';
import { FoodNutritionalValueDetailComponent } from '../detail/food-nutritional-value-detail.component';
import { FoodNutritionalValueUpdateComponent } from '../update/food-nutritional-value-update.component';
import { FoodNutritionalValueRoutingResolveService } from './food-nutritional-value-routing-resolve.service';

const foodNutritionalValueRoute: Routes = [
  {
    path: '',
    component: FoodNutritionalValueComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FoodNutritionalValueDetailComponent,
    resolve: {
      foodNutritionalValue: FoodNutritionalValueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FoodNutritionalValueUpdateComponent,
    resolve: {
      foodNutritionalValue: FoodNutritionalValueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FoodNutritionalValueUpdateComponent,
    resolve: {
      foodNutritionalValue: FoodNutritionalValueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(foodNutritionalValueRoute)],
  exports: [RouterModule],
})
export class FoodNutritionalValueRoutingModule {}
