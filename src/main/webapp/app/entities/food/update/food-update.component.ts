import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFood, Food } from '../food.model';
import { FoodService } from '../service/food.service';
import { IMeal } from 'app/entities/meal/meal.model';
import { MealService } from 'app/entities/meal/service/meal.service';
import { IFoodNutritionalValue } from 'app/entities/food-nutritional-value/food-nutritional-value.model';
import { FoodNutritionalValueService } from 'app/entities/food-nutritional-value/service/food-nutritional-value.service';

@Component({
  selector: 'jhi-food-update',
  templateUrl: './food-update.component.html',
})
export class FoodUpdateComponent implements OnInit {
  isSaving = false;

  mealsSharedCollection: IMeal[] = [];
  foodNutritionalValuesSharedCollection: IFoodNutritionalValue[] = [];

  editForm = this.fb.group({
    id: [],
    di: [],
    quantity: [],
    meal: [],
    foodNutritionalValue: [null, Validators.required],
  });

  constructor(
    protected foodService: FoodService,
    protected mealService: MealService,
    protected foodNutritionalValueService: FoodNutritionalValueService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ food }) => {
      if (food.id === undefined) {
        const today = dayjs().startOf('day');
        food.di = today;
      }

      this.updateForm(food);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const food = this.createFromForm();
    if (food.id !== undefined) {
      this.subscribeToSaveResponse(this.foodService.update(food));
    } else {
      this.subscribeToSaveResponse(this.foodService.create(food));
    }
  }

  trackMealById(index: number, item: IMeal): number {
    return item.id!;
  }

  trackFoodNutritionalValueById(index: number, item: IFoodNutritionalValue): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFood>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(food: IFood): void {
    this.editForm.patchValue({
      id: food.id,
      di: food.di ? food.di.format(DATE_TIME_FORMAT) : null,
      quantity: food.quantity,
      meal: food.meal,
      foodNutritionalValue: food.foodNutritionalValue,
    });

    this.mealsSharedCollection = this.mealService.addMealToCollectionIfMissing(this.mealsSharedCollection, food.meal);
    this.foodNutritionalValuesSharedCollection = this.foodNutritionalValueService.addFoodNutritionalValueToCollectionIfMissing(
      this.foodNutritionalValuesSharedCollection,
      food.foodNutritionalValue
    );
  }

  protected loadRelationshipsOptions(): void {
    this.mealService
      .query()
      .pipe(map((res: HttpResponse<IMeal[]>) => res.body ?? []))
      .pipe(map((meals: IMeal[]) => this.mealService.addMealToCollectionIfMissing(meals, this.editForm.get('meal')!.value)))
      .subscribe((meals: IMeal[]) => (this.mealsSharedCollection = meals));

    this.foodNutritionalValueService
      .query()
      .pipe(map((res: HttpResponse<IFoodNutritionalValue[]>) => res.body ?? []))
      .pipe(
        map((foodNutritionalValues: IFoodNutritionalValue[]) =>
          this.foodNutritionalValueService.addFoodNutritionalValueToCollectionIfMissing(
            foodNutritionalValues,
            this.editForm.get('foodNutritionalValue')!.value
          )
        )
      )
      .subscribe((foodNutritionalValues: IFoodNutritionalValue[]) => (this.foodNutritionalValuesSharedCollection = foodNutritionalValues));
  }

  protected createFromForm(): IFood {
    return {
      ...new Food(),
      id: this.editForm.get(['id'])!.value,
      di: this.editForm.get(['di'])!.value ? dayjs(this.editForm.get(['di'])!.value, DATE_TIME_FORMAT) : undefined,
      quantity: this.editForm.get(['quantity'])!.value,
      meal: this.editForm.get(['meal'])!.value,
      foodNutritionalValue: this.editForm.get(['foodNutritionalValue'])!.value,
    };
  }
}
