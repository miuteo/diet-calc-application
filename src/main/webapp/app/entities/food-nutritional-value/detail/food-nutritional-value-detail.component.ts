import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFoodNutritionalValue } from '../food-nutritional-value.model';

@Component({
  selector: 'jhi-food-nutritional-value-detail',
  templateUrl: './food-nutritional-value-detail.component.html',
})
export class FoodNutritionalValueDetailComponent implements OnInit {
  foodNutritionalValue: IFoodNutritionalValue | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foodNutritionalValue }) => {
      this.foodNutritionalValue = foodNutritionalValue;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
