import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMeal } from '../meal.model';
import { MealService } from '../service/meal.service';

@Component({
  templateUrl: './meal-delete-dialog.component.html',
})
export class MealDeleteDialogComponent {
  meal?: IMeal;

  constructor(protected mealService: MealService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mealService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
