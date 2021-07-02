import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFoodNutritionalValue, FoodNutritionalValue } from '../food-nutritional-value.model';
import { FoodNutritionalValueService } from '../service/food-nutritional-value.service';
import { IFood } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';

@Component({
  selector: 'jhi-food-nutritional-value-update',
  templateUrl: './food-nutritional-value-update.component.html',
})
export class FoodNutritionalValueUpdateComponent implements OnInit {
  isSaving = false;

  foodsSharedCollection: IFood[] = [];

  editForm = this.fb.group({
    id: [],
    di: [],
    barcode: [],
    protein: [],
    proteinCal: [],
    fat: [],
    fatCal: [],
    carbohydrate: [],
    carbohydrateCal: [],
    quantity: [],
    isProteinPowder: [],
    foodNutritionalValue: [],
  });

  constructor(
    protected foodNutritionalValueService: FoodNutritionalValueService,
    protected foodService: FoodService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foodNutritionalValue }) => {
      if (foodNutritionalValue.id === undefined) {
        const today = dayjs().startOf('day');
        foodNutritionalValue.di = today;
      }

      this.updateForm(foodNutritionalValue);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const foodNutritionalValue = this.createFromForm();
    if (foodNutritionalValue.id !== undefined) {
      this.subscribeToSaveResponse(this.foodNutritionalValueService.update(foodNutritionalValue));
    } else {
      this.subscribeToSaveResponse(this.foodNutritionalValueService.create(foodNutritionalValue));
    }
  }

  trackFoodById(index: number, item: IFood): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFoodNutritionalValue>>): void {
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

  protected updateForm(foodNutritionalValue: IFoodNutritionalValue): void {
    this.editForm.patchValue({
      id: foodNutritionalValue.id,
      di: foodNutritionalValue.di ? foodNutritionalValue.di.format(DATE_TIME_FORMAT) : null,
      barcode: foodNutritionalValue.barcode,
      protein: foodNutritionalValue.protein,
      proteinCal: foodNutritionalValue.proteinCal,
      fat: foodNutritionalValue.fat,
      fatCal: foodNutritionalValue.fatCal,
      carbohydrate: foodNutritionalValue.carbohydrate,
      carbohydrateCal: foodNutritionalValue.carbohydrateCal,
      quantity: foodNutritionalValue.quantity,
      isProteinPowder: foodNutritionalValue.isProteinPowder,
      foodNutritionalValue: foodNutritionalValue.foodNutritionalValue,
    });

    this.foodsSharedCollection = this.foodService.addFoodToCollectionIfMissing(
      this.foodsSharedCollection,
      foodNutritionalValue.foodNutritionalValue
    );
  }

  protected loadRelationshipsOptions(): void {
    this.foodService
      .query()
      .pipe(map((res: HttpResponse<IFood[]>) => res.body ?? []))
      .pipe(map((foods: IFood[]) => this.foodService.addFoodToCollectionIfMissing(foods, this.editForm.get('foodNutritionalValue')!.value)))
      .subscribe((foods: IFood[]) => (this.foodsSharedCollection = foods));
  }

  protected createFromForm(): IFoodNutritionalValue {
    return {
      ...new FoodNutritionalValue(),
      id: this.editForm.get(['id'])!.value,
      di: this.editForm.get(['di'])!.value ? dayjs(this.editForm.get(['di'])!.value, DATE_TIME_FORMAT) : undefined,
      barcode: this.editForm.get(['barcode'])!.value,
      protein: this.editForm.get(['protein'])!.value,
      proteinCal: this.editForm.get(['proteinCal'])!.value,
      fat: this.editForm.get(['fat'])!.value,
      fatCal: this.editForm.get(['fatCal'])!.value,
      carbohydrate: this.editForm.get(['carbohydrate'])!.value,
      carbohydrateCal: this.editForm.get(['carbohydrateCal'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      isProteinPowder: this.editForm.get(['isProteinPowder'])!.value,
      foodNutritionalValue: this.editForm.get(['foodNutritionalValue'])!.value,
    };
  }
}
