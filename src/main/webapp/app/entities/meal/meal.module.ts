import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MealComponent } from './list/meal.component';
import { MealDetailComponent } from './detail/meal-detail.component';
import { MealUpdateComponent } from './update/meal-update.component';
import { MealDeleteDialogComponent } from './delete/meal-delete-dialog.component';
import { MealRoutingModule } from './route/meal-routing.module';

@NgModule({
  imports: [SharedModule, MealRoutingModule],
  declarations: [MealComponent, MealDetailComponent, MealUpdateComponent, MealDeleteDialogComponent],
  entryComponents: [MealDeleteDialogComponent],
})
export class MealModule {}
