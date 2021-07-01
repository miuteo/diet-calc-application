import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFood } from '../food.model';
import { FoodService } from '../service/food.service';
import { FoodDeleteDialogComponent } from '../delete/food-delete-dialog.component';

@Component({
  selector: 'jhi-food',
  templateUrl: './food.component.html',
})
export class FoodComponent implements OnInit {
  foods?: IFood[];
  isLoading = false;

  constructor(protected foodService: FoodService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.foodService.query().subscribe(
      (res: HttpResponse<IFood[]>) => {
        this.isLoading = false;
        this.foods = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFood): number {
    return item.id!;
  }

  delete(food: IFood): void {
    const modalRef = this.modalService.open(FoodDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.food = food;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
