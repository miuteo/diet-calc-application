import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMeal, Meal } from '../meal.model';
import { MealService } from '../service/meal.service';

@Injectable({ providedIn: 'root' })
export class MealRoutingResolveService implements Resolve<IMeal> {
  constructor(protected service: MealService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMeal> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((meal: HttpResponse<Meal>) => {
          if (meal.body) {
            return of(meal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Meal());
  }
}
