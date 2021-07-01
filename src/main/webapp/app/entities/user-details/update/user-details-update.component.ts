import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IUserDetails, UserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';

@Component({
  selector: 'jhi-user-details-update',
  templateUrl: './user-details-update.component.html',
})
export class UserDetailsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    weight: [],
    proteinNeed: [],
    calProteinNeed: [],
    fatNeed: [],
    calFatNeed: [],
    carbohydrateNeed: [],
    calCarbohydrateNeed: [],
  });

  constructor(protected userDetailsService: UserDetailsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDetails }) => {
      this.updateForm(userDetails);
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
    });
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
    };
  }
}
