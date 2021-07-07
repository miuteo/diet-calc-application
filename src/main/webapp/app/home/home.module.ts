import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { DailyLogsComponent } from './daily-logs/daily-logs.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE]), MatSliderModule, MatBadgeModule, MatIconModule],
  declarations: [HomeComponent, DailyLogsComponent],
})
export class HomeModule {}
