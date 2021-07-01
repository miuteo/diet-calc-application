import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FoodNutritionalValueComponent } from './list/food-nutritional-value.component';
import { FoodNutritionalValueDetailComponent } from './detail/food-nutritional-value-detail.component';
import { FoodNutritionalValueUpdateComponent } from './update/food-nutritional-value-update.component';
import { FoodNutritionalValueDeleteDialogComponent } from './delete/food-nutritional-value-delete-dialog.component';
import { FoodNutritionalValueRoutingModule } from './route/food-nutritional-value-routing.module';

@NgModule({
  imports: [SharedModule, FoodNutritionalValueRoutingModule],
  declarations: [
    FoodNutritionalValueComponent,
    FoodNutritionalValueDetailComponent,
    FoodNutritionalValueUpdateComponent,
    FoodNutritionalValueDeleteDialogComponent,
  ],
  entryComponents: [FoodNutritionalValueDeleteDialogComponent],
})
export class FoodNutritionalValueModule {}
