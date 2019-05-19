import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuantitySelectorPage } from './quantity-selector';

@NgModule({
  declarations: [
    QuantitySelectorPage,
  ],
  imports: [
    IonicPageModule.forChild(QuantitySelectorPage),
  ],
})
export class QuantitySelectorPageModule {}
