import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post<IMeal>(this.resourceUrl, meal, { observe: 'response' });
  }

  update(meal: IMeal): Observable<EntityResponseType> {
    return this.http.put<IMeal>(`${this.resourceUrl}/${getMealIdentifier(meal) as number}`, meal, { observe: 'response' });
  }

  partialUpdate(meal: IMeal): Observable<EntityResponseType> {
    return this.http.patch<IMeal>(`${this.resourceUrl}/${getMealIdentifier(meal) as number}`, meal, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMeal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMeal[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
