import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserStatus, UserStatus } from '../user-status.model';

import { UserStatusService } from './user-status.service';

describe('Service Tests', () => {
  describe('UserStatus Service', () => {
    let service: UserStatusService;
    let httpMock: HttpTestingController;
    let elemDefault: IUserStatus;
    let expectedResult: IUserStatus | IUserStatus[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UserStatusService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        weight: 0,
        proteinNeed: 0,
        calProteinNeed: 0,
        fatNeed: 0,
        calFatNeed: 0,
        carbohydrateNeed: 0,
        calCarbohydrateNeed: 0,
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

      it('should create a UserStatus', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new UserStatus()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UserStatus', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            weight: 1,
            proteinNeed: 1,
            calProteinNeed: 1,
            fatNeed: 1,
            calFatNeed: 1,
            carbohydrateNeed: 1,
            calCarbohydrateNeed: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UserStatus', () => {
        const patchObject = Object.assign(
          {
            weight: 1,
            proteinNeed: 1,
            carbohydrateNeed: 1,
          },
          new UserStatus()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UserStatus', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            weight: 1,
            proteinNeed: 1,
            calProteinNeed: 1,
            fatNeed: 1,
            calFatNeed: 1,
            carbohydrateNeed: 1,
            calCarbohydrateNeed: 1,
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

      it('should delete a UserStatus', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUserStatusToCollectionIfMissing', () => {
        it('should add a UserStatus to an empty array', () => {
          const userStatus: IUserStatus = { id: 123 };
          expectedResult = service.addUserStatusToCollectionIfMissing([], userStatus);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userStatus);
        });

        it('should not add a UserStatus to an array that contains it', () => {
          const userStatus: IUserStatus = { id: 123 };
          const userStatusCollection: IUserStatus[] = [
            {
              ...userStatus,
            },
            { id: 456 },
          ];
          expectedResult = service.addUserStatusToCollectionIfMissing(userStatusCollection, userStatus);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UserStatus to an array that doesn't contain it", () => {
          const userStatus: IUserStatus = { id: 123 };
          const userStatusCollection: IUserStatus[] = [{ id: 456 }];
          expectedResult = service.addUserStatusToCollectionIfMissing(userStatusCollection, userStatus);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userStatus);
        });

        it('should add only unique UserStatus to an array', () => {
          const userStatusArray: IUserStatus[] = [{ id: 123 }, { id: 456 }, { id: 36592 }];
          const userStatusCollection: IUserStatus[] = [{ id: 123 }];
          expectedResult = service.addUserStatusToCollectionIfMissing(userStatusCollection, ...userStatusArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const userStatus: IUserStatus = { id: 123 };
          const userStatus2: IUserStatus = { id: 456 };
          expectedResult = service.addUserStatusToCollectionIfMissing([], userStatus, userStatus2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userStatus);
          expect(expectedResult).toContain(userStatus2);
        });

        it('should accept null and undefined values', () => {
          const userStatus: IUserStatus = { id: 123 };
          expectedResult = service.addUserStatusToCollectionIfMissing([], null, userStatus, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userStatus);
        });

        it('should return initial array if no UserStatus is added', () => {
          const userStatusCollection: IUserStatus[] = [{ id: 123 }];
          expectedResult = service.addUserStatusToCollectionIfMissing(userStatusCollection, undefined, null);
          expect(expectedResult).toEqual(userStatusCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
