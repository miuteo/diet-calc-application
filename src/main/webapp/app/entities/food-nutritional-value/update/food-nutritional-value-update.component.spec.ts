jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FoodNutritionalValueService } from '../service/food-nutritional-value.service';
import { IFoodNutritionalValue, FoodNutritionalValue } from '../food-nutritional-value.model';
import { IFood } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';

import { FoodNutritionalValueUpdateComponent } from './food-nutritional-value-update.component';

describe('Component Tests', () => {
  describe('FoodNutritionalValue Management Update Component', () => {
    let comp: FoodNutritionalValueUpdateComponent;
    let fixture: ComponentFixture<FoodNutritionalValueUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let foodNutritionalValueService: FoodNutritionalValueService;
    let foodService: FoodService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FoodNutritionalValueUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FoodNutritionalValueUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FoodNutritionalValueUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      foodNutritionalValueService = TestBed.inject(FoodNutritionalValueService);
      foodService = TestBed.inject(FoodService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Food query and add missing value', () => {
        const foodNutritionalValue: IFoodNutritionalValue = { id: 456 };
        const foodNutritionalValue: IFood = { id: 5867 };
        foodNutritionalValue.foodNutritionalValue = foodNutritionalValue;

        const foodCollection: IFood[] = [{ id: 77382 }];
        jest.spyOn(foodService, 'query').mockReturnValue(of(new HttpResponse({ body: foodCollection })));
        const additionalFoods = [foodNutritionalValue];
        const expectedCollection: IFood[] = [...additionalFoods, ...foodCollection];
        jest.spyOn(foodService, 'addFoodToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ foodNutritionalValue });
        comp.ngOnInit();

        expect(foodService.query).toHaveBeenCalled();
        expect(foodService.addFoodToCollectionIfMissing).toHaveBeenCalledWith(foodCollection, ...additionalFoods);
        expect(comp.foodsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const foodNutritionalValue: IFoodNutritionalValue = { id: 456 };
        const foodNutritionalValue: IFood = { id: 44924 };
        foodNutritionalValue.foodNutritionalValue = foodNutritionalValue;

        activatedRoute.data = of({ foodNutritionalValue });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(foodNutritionalValue));
        expect(comp.foodsSharedCollection).toContain(foodNutritionalValue);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<FoodNutritionalValue>>();
        const foodNutritionalValue = { id: 123 };
        jest.spyOn(foodNutritionalValueService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ foodNutritionalValue });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: foodNutritionalValue }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(foodNutritionalValueService.update).toHaveBeenCalledWith(foodNutritionalValue);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<FoodNutritionalValue>>();
        const foodNutritionalValue = new FoodNutritionalValue();
        jest.spyOn(foodNutritionalValueService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ foodNutritionalValue });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: foodNutritionalValue }));
        saveSubject.complete();

        // THEN
        expect(foodNutritionalValueService.create).toHaveBeenCalledWith(foodNutritionalValue);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<FoodNutritionalValue>>();
        const foodNutritionalValue = { id: 123 };
        jest.spyOn(foodNutritionalValueService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ foodNutritionalValue });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(foodNutritionalValueService.update).toHaveBeenCalledWith(foodNutritionalValue);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackFoodById', () => {
        it('Should return tracked Food primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFoodById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
