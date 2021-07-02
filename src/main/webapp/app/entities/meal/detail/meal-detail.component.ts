import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMeal } from '../meal.model';

@Component({
  selector: 'jhi-meal-detail',
  templateUrl: './meal-detail.component.html',
})
export class MealDetailComponent implements OnInit {
  meal: IMeal | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ meal }) => {
      this.meal = meal;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
