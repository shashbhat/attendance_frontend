import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { Statement2Component } from './statement2/statement2.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [AnalyticsComponent, Statement2Component],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    Ng2GoogleChartsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    NgxSpinnerModule    ,
    MatProgressSpinnerModule 
  ]
})
export class AnalyticsModule { }
