import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserStatusComponent } from './list/user-status.component';
import { UserStatusDetailComponent } from './detail/user-status-detail.component';
import { UserStatusUpdateComponent } from './update/user-status-update.component';
import { UserStatusDeleteDialogComponent } from './delete/user-status-delete-dialog.component';
import { UserStatusRoutingModule } from './route/user-status-routing.module';

@NgModule({
  imports: [SharedModule, UserStatusRoutingModule],
  declarations: [UserStatusComponent, UserStatusDetailComponent, UserStatusUpdateComponent, UserStatusDeleteDialogComponent],
  entryComponents: [UserStatusDeleteDialogComponent],
})
export class UserStatusModule {}
