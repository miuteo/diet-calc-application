import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserStatus, getUserStatusIdentifier } from '../user-status.model';

export type EntityResponseType = HttpResponse<IUserStatus>;
export type EntityArrayResponseType = HttpResponse<IUserStatus[]>;

@Injectable({ providedIn: 'root' })
export class UserStatusService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-statuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userStatus: IUserStatus): Observable<EntityResponseType> {
    return this.http.post<IUserStatus>(this.resourceUrl, userStatus, { observe: 'response' });
  }

  update(userStatus: IUserStatus): Observable<EntityResponseType> {
    return this.http.put<IUserStatus>(`${this.resourceUrl}/${getUserStatusIdentifier(userStatus) as number}`, userStatus, {
      observe: 'response',
    });
  }

  partialUpdate(userStatus: IUserStatus): Observable<EntityResponseType> {
    return this.http.patch<IUserStatus>(`${this.resourceUrl}/${getUserStatusIdentifier(userStatus) as number}`, userStatus, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserStatus>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserStatus[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserStatusToCollectionIfMissing(
    userStatusCollection: IUserStatus[],
    ...userStatusesToCheck: (IUserStatus | null | undefined)[]
  ): IUserStatus[] {
    const userStatuses: IUserStatus[] = userStatusesToCheck.filter(isPresent);
    if (userStatuses.length > 0) {
      const userStatusCollectionIdentifiers = userStatusCollection.map(userStatusItem => getUserStatusIdentifier(userStatusItem)!);
      const userStatusesToAdd = userStatuses.filter(userStatusItem => {
        const userStatusIdentifier = getUserStatusIdentifier(userStatusItem);
        if (userStatusIdentifier == null || userStatusCollectionIdentifiers.includes(userStatusIdentifier)) {
          return false;
        }
        userStatusCollectionIdentifiers.push(userStatusIdentifier);
        return true;
      });
      return [...userStatusesToAdd, ...userStatusCollection];
    }
    return userStatusCollection;
  }
}
