import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFoodNutritionalValue, getFoodNutritionalValueIdentifier } from '../food-nutritional-value.model';

export type EntityResponseType = HttpResponse<IFoodNutritionalValue>;
export type EntityArrayResponseType = HttpResponse<IFoodNutritionalValue[]>;

@Injectable({ providedIn: 'root' })
export class FoodNutritionalValueService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/food-nutritional-values');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(foodNutritionalValue: IFoodNutritionalValue): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(foodNutritionalValue);
    return this.http
      .post<IFoodNutritionalValue>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(foodNutritionalValue: IFoodNutritionalValue): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(foodNutritionalValue);
    return this.http
      .put<IFoodNutritionalValue>(`${this.resourceUrl}/${getFoodNutritionalValueIdentifier(foodNutritionalValue) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(foodNutritionalValue: IFoodNutritionalValue): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(foodNutritionalValue);
    return this.http
      .patch<IFoodNutritionalValue>(`${this.resourceUrl}/${getFoodNutritionalValueIdentifier(foodNutritionalValue) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFoodNutritionalValue>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFoodNutritionalValue[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryProteinPowder(): Observable<IFoodNutritionalValue> {
    return this.http.get<IFoodNutritionalValue>(`${this.resourceUrl}/getProteinPowder`);
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFoodNutritionalValueToCollectionIfMissing(
    foodNutritionalValueCollection: IFoodNutritionalValue[],
    ...foodNutritionalValuesToCheck: (IFoodNutritionalValue | null | undefined)[]
  ): IFoodNutritionalValue[] {
    const foodNutritionalValues: IFoodNutritionalValue[] = foodNutritionalValuesToCheck.filter(isPresent);
    if (foodNutritionalValues.length > 0) {
      const foodNutritionalValueCollectionIdentifiers = foodNutritionalValueCollection.map(
        foodNutritionalValueItem => getFoodNutritionalValueIdentifier(foodNutritionalValueItem)!
      );
      const foodNutritionalValuesToAdd = foodNutritionalValues.filter(foodNutritionalValueItem => {
        const foodNutritionalValueIdentifier = getFoodNutritionalValueIdentifier(foodNutritionalValueItem);
        if (foodNutritionalValueIdentifier == null || foodNutritionalValueCollectionIdentifiers.includes(foodNutritionalValueIdentifier)) {
          return false;
        }
        foodNutritionalValueCollectionIdentifiers.push(foodNutritionalValueIdentifier);
        return true;
      });
      return [...foodNutritionalValuesToAdd, ...foodNutritionalValueCollection];
    }
    return foodNutritionalValueCollection;
  }

  protected convertDateFromClient(foodNutritionalValue: IFoodNutritionalValue): IFoodNutritionalValue {
    return Object.assign({}, foodNutritionalValue, {
      di: foodNutritionalValue.di?.isValid() ? foodNutritionalValue.di.toJSON() : undefined,
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
      res.body.forEach((foodNutritionalValue: IFoodNutritionalValue) => {
        foodNutritionalValue.di = foodNutritionalValue.di ? dayjs(foodNutritionalValue.di) : undefined;
      });
    }
    return res;
  }
}
