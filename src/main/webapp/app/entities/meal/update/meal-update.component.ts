import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMeal, Meal } from '../meal.model';
import { MealService } from '../service/meal.service';

@Component({
  selector: 'jhi-meal-update',
  templateUrl: './meal-update.component.html',
})
export class MealUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    mealTime: [],
  });

  constructor(protected mealService: MealService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ meal }) => {
      this.updateForm(meal);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const meal = this.createFromForm();
    if (meal.id !== undefined) {
      this.subscribeToSaveResponse(this.mealService.update(meal));
    } else {
      this.subscribeToSaveResponse(this.mealService.create(meal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMeal>>): void {
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

  protected updateForm(meal: IMeal): void {
    this.editForm.patchValue({
      id: meal.id,
      mealTime: meal.mealTime,
    });
  }

  protected createFromForm(): IMeal {
    return {
      ...new Meal(),
      id: this.editForm.get(['id'])!.value,
      mealTime: this.editForm.get(['mealTime'])!.value,
    };
  }
}
