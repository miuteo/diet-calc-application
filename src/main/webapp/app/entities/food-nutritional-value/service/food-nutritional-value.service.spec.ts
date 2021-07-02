import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFoodNutritionalValue, FoodNutritionalValue } from '../food-nutritional-value.model';

import { FoodNutritionalValueService } from './food-nutritional-value.service';

describe('Service Tests', () => {
  describe('FoodNutritionalValue Service', () => {
    let service: FoodNutritionalValueService;
    let httpMock: HttpTestingController;
    let elemDefault: IFoodNutritionalValue;
    let expectedResult: IFoodNutritionalValue | IFoodNutritionalValue[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FoodNutritionalValueService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        di: currentDate,
        name: 'AAAAAAA',
        protein: 0,
        proteinCal: 0,
        fat: 0,
        fatCal: 0,
        carbohydrate: 0,
        carbohydrateCal: 0,
        quantity: 0,
        isProteinPowder: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            di: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a FoodNutritionalValue', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            di: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            di: currentDate,
          },
          returnedFromService
        );

        service.create(new FoodNutritionalValue()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FoodNutritionalValue', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            di: currentDate.format(DATE_TIME_FORMAT),
            name: 'BBBBBB',
            protein: 1,
            proteinCal: 1,
            fat: 1,
            fatCal: 1,
            carbohydrate: 1,
            carbohydrateCal: 1,
            quantity: 1,
            isProteinPowder: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            di: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a FoodNutritionalValue', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            fat: 1,
            fatCal: 1,
            carbohydrateCal: 1,
            quantity: 1,
          },
          new FoodNutritionalValue()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            di: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of FoodNutritionalValue', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            di: currentDate.format(DATE_TIME_FORMAT),
            name: 'BBBBBB',
            protein: 1,
            proteinCal: 1,
            fat: 1,
            fatCal: 1,
            carbohydrate: 1,
            carbohydrateCal: 1,
            quantity: 1,
            isProteinPowder: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            di: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a FoodNutritionalValue', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFoodNutritionalValueToCollectionIfMissing', () => {
        it('should add a FoodNutritionalValue to an empty array', () => {
          const foodNutritionalValue: IFoodNutritionalValue = { id: 123 };
          expectedResult = service.addFoodNutritionalValueToCollectionIfMissing([], foodNutritionalValue);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(foodNutritionalValue);
        });

        it('should not add a FoodNutritionalValue to an array that contains it', () => {
          const foodNutritionalValue: IFoodNutritionalValue = { id: 123 };
          const foodNutritionalValueCollection: IFoodNutritionalValue[] = [
            {
              ...foodNutritionalValue,
            },
            { id: 456 },
          ];
          expectedResult = service.addFoodNutritionalValueToCollectionIfMissing(foodNutritionalValueCollection, foodNutritionalValue);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FoodNutritionalValue to an array that doesn't contain it", () => {
          const foodNutritionalValue: IFoodNutritionalValue = { id: 123 };
          const foodNutritionalValueCollection: IFoodNutritionalValue[] = [{ id: 456 }];
          expectedResult = service.addFoodNutritionalValueToCollectionIfMissing(foodNutritionalValueCollection, foodNutritionalValue);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(foodNutritionalValue);
        });

        it('should add only unique FoodNutritionalValue to an array', () => {
          const foodNutritionalValueArray: IFoodNutritionalValue[] = [{ id: 123 }, { id: 456 }, { id: 93570 }];
          const foodNutritionalValueCollection: IFoodNutritionalValue[] = [{ id: 123 }];
          expectedResult = service.addFoodNutritionalValueToCollectionIfMissing(
            foodNutritionalValueCollection,
            ...foodNutritionalValueArray
          );
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const foodNutritionalValue: IFoodNutritionalValue = { id: 123 };
          const foodNutritionalValue2: IFoodNutritionalValue = { id: 456 };
          expectedResult = service.addFoodNutritionalValueToCollectionIfMissing([], foodNutritionalValue, foodNutritionalValue2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(foodNutritionalValue);
          expect(expectedResult).toContain(foodNutritionalValue2);
        });

        it('should accept null and undefined values', () => {
          const foodNutritionalValue: IFoodNutritionalValue = { id: 123 };
          expectedResult = service.addFoodNutritionalValueToCollectionIfMissing([], null, foodNutritionalValue, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(foodNutritionalValue);
        });

        it('should return initial array if no FoodNutritionalValue is added', () => {
          const foodNutritionalValueCollection: IFoodNutritionalValue[] = [{ id: 123 }];
          expectedResult = service.addFoodNutritionalValueToCollectionIfMissing(foodNutritionalValueCollection, undefined, null);
          expect(expectedResult).toEqual(foodNutritionalValueCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
