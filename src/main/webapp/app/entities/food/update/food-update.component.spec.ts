jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FoodService } from '../service/food.service';
import { IFood, Food } from '../food.model';
import { IMeal } from 'app/entities/meal/meal.model';
import { MealService } from 'app/entities/meal/service/meal.service';

import { FoodUpdateComponent } from './food-update.component';

describe('Component Tests', () => {
  describe('Food Management Update Component', () => {
    let comp: FoodUpdateComponent;
    let fixture: ComponentFixture<FoodUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let foodService: FoodService;
    let mealService: MealService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FoodUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FoodUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FoodUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      foodService = TestBed.inject(FoodService);
      mealService = TestBed.inject(MealService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Meal query and add missing value', () => {
        const food: IFood = { id: 456 };
        const meal: IMeal = { id: 55731 };
        food.meal = meal;

        const mealCollection: IMeal[] = [{ id: 99571 }];
        jest.spyOn(mealService, 'query').mockReturnValue(of(new HttpResponse({ body: mealCollection })));
        const additionalMeals = [meal];
        const expectedCollection: IMeal[] = [...additionalMeals, ...mealCollection];
        jest.spyOn(mealService, 'addMealToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ food });
        comp.ngOnInit();

        expect(mealService.query).toHaveBeenCalled();
        expect(mealService.addMealToCollectionIfMissing).toHaveBeenCalledWith(mealCollection, ...additionalMeals);
        expect(comp.mealsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const food: IFood = { id: 456 };
        const meal: IMeal = { id: 23432 };
        food.meal = meal;

        activatedRoute.data = of({ food });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(food));
        expect(comp.mealsSharedCollection).toContain(meal);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Food>>();
        const food = { id: 123 };
        jest.spyOn(foodService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ food });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: food }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(foodService.update).toHaveBeenCalledWith(food);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Food>>();
        const food = new Food();
        jest.spyOn(foodService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ food });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: food }));
        saveSubject.complete();

        // THEN
        expect(foodService.create).toHaveBeenCalledWith(food);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Food>>();
        const food = { id: 123 };
        jest.spyOn(foodService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ food });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(foodService.update).toHaveBeenCalledWith(food);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMealById', () => {
        it('Should return tracked Meal primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMealById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
