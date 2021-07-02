import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserStatus } from '../user-status.model';

@Component({
  selector: 'jhi-user-status-detail',
  templateUrl: './user-status-detail.component.html',
})
export class UserStatusDetailComponent implements OnInit {
  userStatus: IUserStatus | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userStatus }) => {
      this.userStatus = userStatus;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
