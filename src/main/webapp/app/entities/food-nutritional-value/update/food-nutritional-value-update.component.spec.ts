jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FoodNutritionalValueService } from '../service/food-nutritional-value.service';
import { IFoodNutritionalValue, FoodNutritionalValue } from '../food-nutritional-value.model';

import { FoodNutritionalValueUpdateComponent } from './food-nutritional-value-update.component';

describe('Component Tests', () => {
  describe('FoodNutritionalValue Management Update Component', () => {
    let comp: FoodNutritionalValueUpdateComponent;
    let fixture: ComponentFixture<FoodNutritionalValueUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let foodNutritionalValueService: FoodNutritionalValueService;

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

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const foodNutritionalValue: IFoodNutritionalValue = { id: 456 };

        activatedRoute.data = of({ foodNutritionalValue });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(foodNutritionalValue));
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
  });
});
