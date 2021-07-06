import { Component, OnInit } from '@angular/core';
import { UserStatusService } from '../../entities/user-status/service/user-status.service';
import { IUserStatus } from '../../entities/user-status/user-status.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-daily-logs',
  templateUrl: './daily-logs.component.html',
  styleUrls: ['./daily-logs.component.scss'],
})
export class DailyLogsComponent implements OnInit {
  userStatuses?: IUserStatus[];

  constructor(private userStatusService: UserStatusService) {
    console.log(userStatusService);
  }

  ngOnInit(): void {
    this.userStatusService.query().subscribe((res: HttpResponse<IUserStatus[]>) => {
      this.userStatuses = res.body ?? [];
    });
  }
}
