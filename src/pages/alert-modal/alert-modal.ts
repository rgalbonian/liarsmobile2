import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AlertModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alert-modal',
  templateUrl: 'alert-modal.html',
})
export class AlertModalPage {
	public alertMsg: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private view: ViewController) {
  	this.alertMsg = this.navParams.get('alertMessage');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlertModalPage');
  }
  closeAlert(){
  		this.view.dismiss();
  	}
}
