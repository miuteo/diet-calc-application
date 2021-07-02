import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoodNutritionalValue } from '../food-nutritional-value.model';
import { FoodNutritionalValueService } from '../service/food-nutritional-value.service';

@Component({
  templateUrl: './food-nutritional-value-delete-dialog.component.html',
})
export class FoodNutritionalValueDeleteDialogComponent {
  foodNutritionalValue?: IFoodNutritionalValue;

  constructor(protected foodNutritionalValueService: FoodNutritionalValueService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.foodNutritionalValueService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
