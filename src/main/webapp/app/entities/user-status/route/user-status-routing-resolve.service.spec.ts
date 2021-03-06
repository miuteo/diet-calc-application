jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUserStatus, UserStatus } from '../user-status.model';
import { UserStatusService } from '../service/user-status.service';

import { UserStatusRoutingResolveService } from './user-status-routing-resolve.service';

describe('Service Tests', () => {
  describe('UserStatus routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: UserStatusRoutingResolveService;
    let service: UserStatusService;
    let resultUserStatus: IUserStatus | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(UserStatusRoutingResolveService);
      service = TestBed.inject(UserStatusService);
      resultUserStatus = undefined;
    });

    describe('resolve', () => {
      it('should return IUserStatus returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserStatus = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserStatus).toEqual({ id: 123 });
      });

      it('should return new IUserStatus if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserStatus = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultUserStatus).toEqual(new UserStatus());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserStatus })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserStatus = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserStatus).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
