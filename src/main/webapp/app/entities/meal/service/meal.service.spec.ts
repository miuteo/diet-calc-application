import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MealName } from 'app/entities/enumerations/meal-name.model';
import { IMeal, Meal } from '../meal.model';

import { MealService } from './meal.service';

describe('Service Tests', () => {
  describe('Meal Service', () => {
    let service: MealService;
    let httpMock: HttpTestingController;
    let elemDefault: IMeal;
    let expectedResult: IMeal | IMeal[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MealService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        mealTime: MealName.MORNING,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Meal', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Meal()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Meal', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            mealTime: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Meal', () => {
        const patchObject = Object.assign({}, new Meal());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Meal', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            mealTime: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Meal', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMealToCollectionIfMissing', () => {
        it('should add a Meal to an empty array', () => {
          const meal: IMeal = { id: 123 };
          expectedResult = service.addMealToCollectionIfMissing([], meal);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(meal);
        });

        it('should not add a Meal to an array that contains it', () => {
          const meal: IMeal = { id: 123 };
          const mealCollection: IMeal[] = [
            {
              ...meal,
            },
            { id: 456 },
          ];
          expectedResult = service.addMealToCollectionIfMissing(mealCollection, meal);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Meal to an array that doesn't contain it", () => {
          const meal: IMeal = { id: 123 };
          const mealCollection: IMeal[] = [{ id: 456 }];
          expectedResult = service.addMealToCollectionIfMissing(mealCollection, meal);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(meal);
        });

        it('should add only unique Meal to an array', () => {
          const mealArray: IMeal[] = [{ id: 123 }, { id: 456 }, { id: 36952 }];
          const mealCollection: IMeal[] = [{ id: 123 }];
          expectedResult = service.addMealToCollectionIfMissing(mealCollection, ...mealArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const meal: IMeal = { id: 123 };
          const meal2: IMeal = { id: 456 };
          expectedResult = service.addMealToCollectionIfMissing([], meal, meal2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(meal);
          expect(expectedResult).toContain(meal2);
        });

        it('should accept null and undefined values', () => {
          const meal: IMeal = { id: 123 };
          expectedResult = service.addMealToCollectionIfMissing([], null, meal, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(meal);
        });

        it('should return initial array if no Meal is added', () => {
          const mealCollection: IMeal[] = [{ id: 123 }];
          expectedResult = service.addMealToCollectionIfMissing(mealCollection, undefined, null);
          expect(expectedResult).toEqual(mealCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
