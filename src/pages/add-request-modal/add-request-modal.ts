import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { ModalController , NavController} from 'ionic-angular';

/**
 * Generated class for the AddRequestModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-request-modal',
  templateUrl: 'add-request-modal.html',
})
export class AddRequestModalPage {

  constructor(private navCtrl: NavController, public modalCtrl: ModalController, private navParams: NavParams, private view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRequestModalPage');
  }

  cancelAddRequest(){
  this.view.dismiss();
  }


  addRequestItems(){
  		const itemsModal = this.modalCtrl.create("ItemsPage")
		itemsModal.present();
  }
}
