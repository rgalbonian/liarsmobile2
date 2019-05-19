import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemSummaryPage } from './item-summary';

@NgModule({
  declarations: [
    ItemSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemSummaryPage),
  ],
})
export class ItemSummaryPageModule {}
