import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoodNutritionalValue } from '../food-nutritional-value.model';
import { FoodNutritionalValueService } from '../service/food-nutritional-value.service';
import { FoodNutritionalValueDeleteDialogComponent } from '../delete/food-nutritional-value-delete-dialog.component';

@Component({
  selector: 'jhi-food-nutritional-value',
  templateUrl: './food-nutritional-value.component.html',
})
export class FoodNutritionalValueComponent implements OnInit {
  foodNutritionalValues?: IFoodNutritionalValue[];
  isLoading = false;

  constructor(protected foodNutritionalValueService: FoodNutritionalValueService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.foodNutritionalValueService.query().subscribe(
      (res: HttpResponse<IFoodNutritionalValue[]>) => {
        this.isLoading = false;
        this.foodNutritionalValues = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFoodNutritionalValue): number {
    return item.id!;
  }

  delete(foodNutritionalValue: IFoodNutritionalValue): void {
    const modalRef = this.modalService.open(FoodNutritionalValueDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.foodNutritionalValue = foodNutritionalValue;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
