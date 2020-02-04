import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { Statement5Component } from './statement2/statement2.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';


@NgModule({
  declarations: [AnalyticsComponent, Statement5Component],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    Ng2GoogleChartsModule
  ]
})
export class AnalyticsModule { }
