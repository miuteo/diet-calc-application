import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMeal, getMealIdentifier } from '../meal.model';

export type EntityResponseType = HttpResponse<IMeal>;
export type EntityArrayResponseType = HttpResponse<IMeal[]>;

@Injectable({ providedIn: 'root' })
export class MealService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/meals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(meal: IMeal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(meal);
    return this.http
      .post<IMeal>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(meal: IMeal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(meal);
    return this.http
      .put<IMeal>(`${this.resourceUrl}/${getMealIdentifier(meal) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(meal: IMeal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(meal);
    return this.http
      .patch<IMeal>(`${this.resourceUrl}/${getMealIdentifier(meal) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMeal>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMeal[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMealToCollectionIfMissing(mealCollection: IMeal[], ...mealsToCheck: (IMeal | null | undefined)[]): IMeal[] {
    const meals: IMeal[] = mealsToCheck.filter(isPresent);
    if (meals.length > 0) {
      const mealCollectionIdentifiers = mealCollection.map(mealItem => getMealIdentifier(mealItem)!);
      const mealsToAdd = meals.filter(mealItem => {
        const mealIdentifier = getMealIdentifier(mealItem);
        if (mealIdentifier == null || mealCollectionIdentifiers.includes(mealIdentifier)) {
          return false;
        }
        mealCollectionIdentifiers.push(mealIdentifier);
        return true;
      });
      return [...mealsToAdd, ...mealCollection];
    }
    return mealCollection;
  }

  protected convertDateFromClient(meal: IMeal): IMeal {
    return Object.assign({}, meal, {
      di: meal.di?.isValid() ? meal.di.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.di = res.body.di ? dayjs(res.body.di) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((meal: IMeal) => {
        meal.di = meal.di ? dayjs(meal.di) : undefined;
      });
    }
    return res;
  }
}
