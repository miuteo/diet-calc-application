import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFood, Food } from '../food.model';

import { FoodService } from './food.service';

describe('Service Tests', () => {
  describe('Food Service', () => {
    let service: FoodService;
    let httpMock: HttpTestingController;
    let elemDefault: IFood;
    let expectedResult: IFood | IFood[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FoodService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        di: currentDate,
        quantity: 0,
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

      it('should create a Food', () => {
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

        service.create(new Food()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Food', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            di: currentDate.format(DATE_TIME_FORMAT),
            quantity: 1,
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

      it('should partial update a Food', () => {
        const patchObject = Object.assign(
          {
            di: currentDate.format(DATE_TIME_FORMAT),
            quantity: 1,
          },
          new Food()
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

      it('should return a list of Food', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            di: currentDate.format(DATE_TIME_FORMAT),
            quantity: 1,
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

      it('should delete a Food', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFoodToCollectionIfMissing', () => {
        it('should add a Food to an empty array', () => {
          const food: IFood = { id: 123 };
          expectedResult = service.addFoodToCollectionIfMissing([], food);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(food);
        });

        it('should not add a Food to an array that contains it', () => {
          const food: IFood = { id: 123 };
          const foodCollection: IFood[] = [
            {
              ...food,
            },
            { id: 456 },
          ];
          expectedResult = service.addFoodToCollectionIfMissing(foodCollection, food);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Food to an array that doesn't contain it", () => {
          const food: IFood = { id: 123 };
          const foodCollection: IFood[] = [{ id: 456 }];
          expectedResult = service.addFoodToCollectionIfMissing(foodCollection, food);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(food);
        });

        it('should add only unique Food to an array', () => {
          const foodArray: IFood[] = [{ id: 123 }, { id: 456 }, { id: 94026 }];
          const foodCollection: IFood[] = [{ id: 123 }];
          expectedResult = service.addFoodToCollectionIfMissing(foodCollection, ...foodArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const food: IFood = { id: 123 };
          const food2: IFood = { id: 456 };
          expectedResult = service.addFoodToCollectionIfMissing([], food, food2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(food);
          expect(expectedResult).toContain(food2);
        });

        it('should accept null and undefined values', () => {
          const food: IFood = { id: 123 };
          expectedResult = service.addFoodToCollectionIfMissing([], null, food, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(food);
        });

        it('should return initial array if no Food is added', () => {
          const foodCollection: IFood[] = [{ id: 123 }];
          expectedResult = service.addFoodToCollectionIfMissing(foodCollection, undefined, null);
          expect(expectedResult).toEqual(foodCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
