import { Component, OnInit } from '@angular/core';
import { UserStatusService } from '../../entities/user-status/service/user-status.service';
import { IUserStatus } from '../../entities/user-status/user-status.model';
import { HttpResponse } from '@angular/common/http';
import { FoodService } from '../../entities/food/service/food.service';
import { IFood } from '../../entities/food/food.model';
import { FoodDeleteDialogComponent } from '../../entities/food/delete/food-delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-daily-logs',
  templateUrl: './daily-logs.component.html',
  styleUrls: ['./daily-logs.component.scss'],
})
export class DailyLogsComponent implements OnInit {
  userStatuses?: IUserStatus[];
  foods?: IFood[];

  sumOfProtein = 0;
  sumOfFat = 0;
  sumOfCarbo = 0;

  constructor(private userStatusService: UserStatusService, private foodService: FoodService, protected modalService: NgbModal) {}

  ngOnInit(): void {
    this.userStatusService.query().subscribe((res: HttpResponse<IUserStatus[]>) => {
      this.userStatuses = res.body ?? [];
    });
    this.foodService.query().subscribe(response => {
      this.foods = response.body ?? [];
      this.foods.forEach(food => {
        this.sumOfProtein += (food.quantity! / food.foodNutritionalValue!.quantity!) * food.foodNutritionalValue!.protein!;
        this.sumOfCarbo += (food.quantity! / food.foodNutritionalValue!.quantity!) * food.foodNutritionalValue!.carbohydrate!;
        this.sumOfFat += (food.quantity! / food.foodNutritionalValue!.quantity!) * food.foodNutritionalValue!.fat!;
      });
    });
  }

  delete(food: IFood): void {
    const modalRef = this.modalService.open(FoodDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.food = food;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.ngOnInit();
      }
    });
  }
}
