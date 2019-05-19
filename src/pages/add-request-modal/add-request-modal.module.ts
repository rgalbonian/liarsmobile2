import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddRequestModalPage } from './add-request-modal';

@NgModule({
  declarations: [
    AddRequestModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddRequestModalPage)
  ],
  exports: [
    AddRequestModalPage
  ]
})
export class AddRequestModalPageModule {}
