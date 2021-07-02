import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserStatus, UserStatus } from '../user-status.model';
import { UserStatusService } from '../service/user-status.service';

@Injectable({ providedIn: 'root' })
export class UserStatusRoutingResolveService implements Resolve<IUserStatus> {
  constructor(protected service: UserStatusService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserStatus> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userStatus: HttpResponse<UserStatus>) => {
          if (userStatus.body) {
            return of(userStatus.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserStatus());
  }
}
