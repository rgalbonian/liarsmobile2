import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountabilityPage } from './accountability';

@NgModule({
  declarations: [
    AccountabilityPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountabilityPage),
  ],
})
export class AccountabilityPageModule {}
