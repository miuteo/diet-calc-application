jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFoodNutritionalValue, FoodNutritionalValue } from '../food-nutritional-value.model';
import { FoodNutritionalValueService } from '../service/food-nutritional-value.service';

import { FoodNutritionalValueRoutingResolveService } from './food-nutritional-value-routing-resolve.service';

describe('Service Tests', () => {
  describe('FoodNutritionalValue routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FoodNutritionalValueRoutingResolveService;
    let service: FoodNutritionalValueService;
    let resultFoodNutritionalValue: IFoodNutritionalValue | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FoodNutritionalValueRoutingResolveService);
      service = TestBed.inject(FoodNutritionalValueService);
      resultFoodNutritionalValue = undefined;
    });

    describe('resolve', () => {
      it('should return IFoodNutritionalValue returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoodNutritionalValue = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFoodNutritionalValue).toEqual({ id: 123 });
      });

      it('should return new IFoodNutritionalValue if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoodNutritionalValue = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFoodNutritionalValue).toEqual(new FoodNutritionalValue());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FoodNutritionalValue })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoodNutritionalValue = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFoodNutritionalValue).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
