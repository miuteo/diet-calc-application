import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMeal } from '../meal.model';
import { MealService } from '../service/meal.service';
import { MealDeleteDialogComponent } from '../delete/meal-delete-dialog.component';

@Component({
  selector: 'jhi-meal',
  templateUrl: './meal.component.html',
})
export class MealComponent implements OnInit {
  meals?: IMeal[];
  isLoading = false;

  constructor(protected mealService: MealService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.mealService.query().subscribe(
      (res: HttpResponse<IMeal[]>) => {
        this.isLoading = false;
        this.meals = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMeal): number {
    return item.id!;
  }

  delete(meal: IMeal): void {
    const modalRef = this.modalService.open(MealDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.meal = meal;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
