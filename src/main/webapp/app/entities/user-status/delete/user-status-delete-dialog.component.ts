import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserStatus } from '../user-status.model';
import { UserStatusService } from '../service/user-status.service';

@Component({
  templateUrl: './user-status-delete-dialog.component.html',
})
export class UserStatusDeleteDialogComponent {
  userStatus?: IUserStatus;

  constructor(protected userStatusService: UserStatusService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userStatusService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
