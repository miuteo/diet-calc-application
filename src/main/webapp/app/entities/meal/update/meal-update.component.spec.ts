jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MealService } from '../service/meal.service';
import { IMeal, Meal } from '../meal.model';

import { MealUpdateComponent } from './meal-update.component';

describe('Component Tests', () => {
  describe('Meal Management Update Component', () => {
    let comp: MealUpdateComponent;
    let fixture: ComponentFixture<MealUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let mealService: MealService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MealUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MealUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MealUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      mealService = TestBed.inject(MealService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const meal: IMeal = { id: 456 };

        activatedRoute.data = of({ meal });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(meal));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Meal>>();
        const meal = { id: 123 };
        jest.spyOn(mealService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ meal });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: meal }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(mealService.update).toHaveBeenCalledWith(meal);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Meal>>();
        const meal = new Meal();
        jest.spyOn(mealService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ meal });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: meal }));
        saveSubject.complete();

        // THEN
        expect(mealService.create).toHaveBeenCalledWith(meal);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Meal>>();
        const meal = { id: 123 };
        jest.spyOn(mealService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ meal });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(mealService.update).toHaveBeenCalledWith(meal);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
