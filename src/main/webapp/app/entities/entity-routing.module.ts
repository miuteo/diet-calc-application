import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'food-nutritional-value',
        data: { pageTitle: 'dietCalcApplicationApp.foodNutritionalValue.home.title' },
        loadChildren: () => import('./food-nutritional-value/food-nutritional-value.module').then(m => m.FoodNutritionalValueModule),
      },
      {
        path: 'food',
        data: { pageTitle: 'dietCalcApplicationApp.food.home.title' },
        loadChildren: () => import('./food/food.module').then(m => m.FoodModule),
      },
      {
        path: 'meal',
        data: { pageTitle: 'dietCalcApplicationApp.meal.home.title' },
        loadChildren: () => import('./meal/meal.module').then(m => m.MealModule),
      },
      {
        path: 'user-details',
        data: { pageTitle: 'dietCalcApplicationApp.userDetails.home.title' },
        loadChildren: () => import('./user-details/user-details.module').then(m => m.UserDetailsModule),
      },
      {
        path: 'user-status',
        data: { pageTitle: 'dietCalcApplicationApp.userStatus.home.title' },
        loadChildren: () => import('./user-status/user-status.module').then(m => m.UserStatusModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
