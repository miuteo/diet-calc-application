import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserDetails, UserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-user-details-update',
  templateUrl: './user-details-update.component.html',
})
export class UserDetailsUpdateComponent implements OnInit {
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
    protected userDetailsService: UserDetailsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDetails }) => {
      this.updateForm(userDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userDetails = this.createFromForm();
    if (userDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.userDetailsService.update(userDetails));
    } else {
      this.subscribeToSaveResponse(this.userDetailsService.create(userDetails));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserDetails>>): void {
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

  protected updateForm(userDetails: IUserDetails): void {
    this.editForm.patchValue({
      id: userDetails.id,
      weight: userDetails.weight,
      proteinNeed: userDetails.proteinNeed,
      calProteinNeed: userDetails.calProteinNeed,
      fatNeed: userDetails.fatNeed,
      calFatNeed: userDetails.calFatNeed,
      carbohydrateNeed: userDetails.carbohydrateNeed,
      calCarbohydrateNeed: userDetails.calCarbohydrateNeed,
      user: userDetails.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, userDetails.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IUserDetails {
    return {
      ...new UserDetails(),
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
