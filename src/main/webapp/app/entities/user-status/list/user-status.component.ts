import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserStatus } from '../user-status.model';
import { UserStatusService } from '../service/user-status.service';
import { UserStatusDeleteDialogComponent } from '../delete/user-status-delete-dialog.component';

@Component({
  selector: 'jhi-user-status',
  templateUrl: './user-status.component.html',
})
export class UserStatusComponent implements OnInit {
  userStatuses?: IUserStatus[];
  isLoading = false;

  constructor(protected userStatusService: UserStatusService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userStatusService.query().subscribe(
      (res: HttpResponse<IUserStatus[]>) => {
        this.isLoading = false;
        this.userStatuses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUserStatus): number {
    return item.id!;
  }

  delete(userStatus: IUserStatus): void {
    const modalRef = this.modalService.open(UserStatusDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userStatus = userStatus;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
