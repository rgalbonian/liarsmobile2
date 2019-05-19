import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestSummaryPage } from './request-summary';

@NgModule({
  declarations: [
    RequestSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestSummaryPage),
  ],
})
export class RequestSummaryPageModule {}
