import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FoodNutritionalValueComponent } from './list/food-nutritional-value.component';
import { FoodNutritionalValueDetailComponent } from './detail/food-nutritional-value-detail.component';
import { FoodNutritionalValueUpdateComponent } from './update/food-nutritional-value-update.component';
import { FoodNutritionalValueDeleteDialogComponent } from './delete/food-nutritional-value-delete-dialog.component';
import { FoodNutritionalValueRoutingModule } from './route/food-nutritional-value-routing.module';
import { FoodNutritionalCustomComponent } from './food-nutritional-custom/food-nutritional-custom.component';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    SharedModule,
    FoodNutritionalValueRoutingModule,
    MatInputModule,
    MatStepperModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatAutocompleteModule,
    MatDialogModule,
  ],
  declarations: [
    FoodNutritionalValueComponent,
    FoodNutritionalValueDetailComponent,
    FoodNutritionalValueUpdateComponent,
    FoodNutritionalValueDeleteDialogComponent,
    FoodNutritionalCustomComponent,
  ],
  entryComponents: [FoodNutritionalValueDeleteDialogComponent],
})
export class FoodNutritionalValueModule {}
