import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFood, getFoodIdentifier } from '../food.model';

export type EntityResponseType = HttpResponse<IFood>;
export type EntityArrayResponseType = HttpResponse<IFood[]>;

@Injectable({ providedIn: 'root' })
export class FoodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/foods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(food: IFood): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(food);
    return this.http
      .post<IFood>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(food: IFood): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(food);
    return this.http
      .put<IFood>(`${this.resourceUrl}/${getFoodIdentifier(food) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(food: IFood): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(food);
    return this.http
      .patch<IFood>(`${this.resourceUrl}/${getFoodIdentifier(food) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFood>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFood[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFoodToCollectionIfMissing(foodCollection: IFood[], ...foodsToCheck: (IFood | null | undefined)[]): IFood[] {
    const foods: IFood[] = foodsToCheck.filter(isPresent);
    if (foods.length > 0) {
      const foodCollectionIdentifiers = foodCollection.map(foodItem => getFoodIdentifier(foodItem)!);
      const foodsToAdd = foods.filter(foodItem => {
        const foodIdentifier = getFoodIdentifier(foodItem);
        if (foodIdentifier == null || foodCollectionIdentifiers.includes(foodIdentifier)) {
          return false;
        }
        foodCollectionIdentifiers.push(foodIdentifier);
        return true;
      });
      return [...foodsToAdd, ...foodCollection];
    }
    return foodCollection;
  }

  protected convertDateFromClient(food: IFood): IFood {
    return Object.assign({}, food, {
      di: food.di?.isValid() ? food.di.toJSON() : undefined,
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
      res.body.forEach((food: IFood) => {
        food.di = food.di ? dayjs(food.di) : undefined;
      });
    }
    return res;
  }
}
