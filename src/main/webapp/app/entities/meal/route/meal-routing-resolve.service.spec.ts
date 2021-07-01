jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMeal, Meal } from '../meal.model';
import { MealService } from '../service/meal.service';

import { MealRoutingResolveService } from './meal-routing-resolve.service';

describe('Service Tests', () => {
  describe('Meal routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MealRoutingResolveService;
    let service: MealService;
    let resultMeal: IMeal | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MealRoutingResolveService);
      service = TestBed.inject(MealService);
      resultMeal = undefined;
    });

    describe('resolve', () => {
      it('should return IMeal returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMeal = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMeal).toEqual({ id: 123 });
      });

      it('should return new IMeal if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMeal = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMeal).toEqual(new Meal());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Meal })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMeal = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMeal).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
