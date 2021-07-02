import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserStatus, UserStatus } from '../user-status.model';
import { UserStatusService } from '../service/user-status.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-user-status-update',
  templateUrl: './user-status-update.component.html',
})
export class UserStatusUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    weight: [],
    proteinNeed: [],
    calProteinNeed: [],
    fatNeed: [],
    calFatNeed: [],
    carbohydrateNeed: [],
    calCarbohydrateNeed: [],
    user: [],
  });

  constructor(
    protected userStatusService: UserStatusService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userStatus }) => {
      this.updateForm(userStatus);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userStatus = this.createFromForm();
    if (userStatus.id !== undefined) {
      this.subscribeToSaveResponse(this.userStatusService.update(userStatus));
    } else {
      this.subscribeToSaveResponse(this.userStatusService.create(userStatus));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserStatus>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userStatus: IUserStatus): void {
    this.editForm.patchValue({
      id: userStatus.id,
      weight: userStatus.weight,
      proteinNeed: userStatus.proteinNeed,
      calProteinNeed: userStatus.calProteinNeed,
      fatNeed: userStatus.fatNeed,
      calFatNeed: userStatus.calFatNeed,
      carbohydrateNeed: userStatus.carbohydrateNeed,
      calCarbohydrateNeed: userStatus.calCarbohydrateNeed,
      user: userStatus.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, userStatus.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IUserStatus {
    return {
      ...new UserStatus(),
      id: this.editForm.get(['id'])!.value,
      weight: this.editForm.get(['weight'])!.value,
      proteinNeed: this.editForm.get(['proteinNeed'])!.value,
      calProteinNeed: this.editForm.get(['calProteinNeed'])!.value,
      fatNeed: this.editForm.get(['fatNeed'])!.value,
      calFatNeed: this.editForm.get(['calFatNeed'])!.value,
      carbohydrateNeed: this.editForm.get(['carbohydrateNeed'])!.value,
      calCarbohydrateNeed: this.editForm.get(['calCarbohydrateNeed'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
